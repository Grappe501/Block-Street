# CAL-P1.2 RBAC Design Package

**Status:** DESIGN PRESENT · runtime mode **`audit_only`**  
**Gate A:** **OPEN** — Postgres shadow persistence not proven  
**Enforcement:** **BLOCKED**  
**Authority:** Soft-beta scheduling path remains governing until Gate A closes and enforcement is certified

## Purpose

CAL-P1.2 defines how calendar permissions will be evaluated, audited, and (eventually) enforced server-side. The package exists so operators, engineers, and campaign leadership can agree on roles, scopes, and denial behavior **before** production enforcement replaces soft-beta demonstration authority.

This design does **not** promote Postgres or RBAC to production authority. It records intended policy and provides `audit_only` evaluation helpers that log outcomes without blocking mutations.

## Actor model

A **calendar actor** is the unit of authorization:

| Field | Meaning |
|-------|---------|
| `userId` | Optional authenticated identity (not production-bound during soft beta) |
| `role` | One of 16 design role keys (10 in matrix JSON today; 6 design-only pending matrix rows) |
| `collegeSlugs` | Assigned colleges for college-scoped roles |
| `countySlugs` | Assigned counties for county-scoped roles |
| `citySlugs` | Assigned cities for city-scoped roles |

Actors are evaluated against a **resource scope** (college/county/city slugs, campaign-wide flag). Role permission alone is insufficient when geographic restriction applies.

## Roles summary (16 design roles)

| # | Role key | Display | Geographic limit | Notes |
|---|----------|---------|------------------|-------|
| 1 | `campaign_manager` | Campaign Manager | Statewide | Full campaign authority when command seat is certified |
| 2 | `assistant_campaign_manager` | Assistant Campaign Manager | Statewide | Same calendar authority as CM |
| 3 | `volunteer_manager` | Volunteer Manager | Statewide Event Board | **Carol Eagan** — staffing/local approve; **not** candidate-private; **not** publish |
| 4 | `event_board_member` | Event Board Member | Campaign-approved scopes | Staffing confirm · local review |
| 5 | `college_leader` | College Leader | Assigned college only | Propose · local approve · campus staffing |
| 6 | `county_leader` | County Leader | Assigned county only | Propose · local approve · county staffing |
| 7 | `city_leader` | City Leader | Assigned city only | Blocked until Gate A + city wave |
| 8 | `team_lead` | Team Lead | Assigned team | Propose · edit own · report |
| 9 | `volunteer` | Volunteer | Relevant public + assigned | Express shift interest only |
| 10 | `viewer` | Viewer | Public only | View public calendar |
| 11 | `candidate_scheduler` | Candidate Scheduler | Statewide (Kelly fields) | **Explicit grant** for `view_candidate_private` and candidate approval — not conferred by title alone |
| 12 | `college_command_lead` | College Command Lead | Assigned college | Command seat above college_leader; broader scope edit within institution |
| 13 | `county_volunteer_manager` | County Volunteer Manager | Assigned county | County staffing orchestration under county_leader |
| 14 | `event_owner` | Event Owner | Event-scoped | Owns specific events: propose, edit_own, cancel within ownership |
| 15 | `shift_lead` | Shift Lead | Shift-scoped | Confirm/cancel shifts for assigned shift windows only |
| 16 | `system_operator` | System Operator | System | Audit view, health probes, import/migrate operators — no calendar content authority |

### Candidate-private boundary

**Campaign Manager does NOT receive candidate-private access by role title alone.** Operational access to Kelly travel/security fields requires either:

- An explicit **`candidate_scheduler`** assignment, or  
- A **certified CM/ACM command seat** bound to the production identity (post Gate A)

**Volunteer Manager (Carol Eagan)** never receives candidate-private by role grant. Event Board, college, county, and city roles are likewise denied.

## Permission categories

| Category | Example actions |
|----------|-----------------|
| **View** | `view_public`, `view_internal`, `view_candidate_private` |
| **Mutate** | `propose`, `edit_own`, `edit_scope`, `cancel` |
| **Approve** | `approve_local`, `approve_campaign`, `approve_candidate` |
| **Publish** | `publish`, `unpublish` (CM/ACM only in this revision) |
| **Staffing** | `staffing.define`, `shift.express_interest`, `shift.confirm`, `shift.cancel` |
| **Governance** | `audit.view`, `report.create`, `report.approve` |

Source of truth for action keys: `data/calendar/calendar-rbac-matrix.json`.

## Scope model

1. **Statewide** — CM, ACM, Volunteer Manager, candidate_scheduler (Kelly fields only for scheduler grant).
2. **Campaign-approved scopes** — Event Board may staff across approved campaign scopes.
3. **Assigned college** — `college_leader`, `college_command_lead` may act only on matching `college_slug(s)`.
4. **Assigned county** — `county_leader`, `county_volunteer_manager` limited to `county_slug(s)`.
5. **Assigned city** — `city_leader` limited to `city_slug(s)`; inactive until Gate A + city wave.
6. **Event / shift scoped** — `event_owner`, `shift_lead` bound to owned event or shift records.
7. **Public / participant** — `volunteer`, `viewer` see only public or assigned surfaces.

Scope rules in matrix JSON (`scope_rules`) supplement per-role geographic restrictions.

## Evaluation order

When `evaluateCalendarPermission(actor, action, resource)` runs:

1. **Resolve role** — unknown role → deny (`unknown_role`).
2. **Role-action matrix** — role lacks action → deny (`role_lacks_action`).
3. **Scope check** — geographic/organizational mismatch → deny (`scope_mismatch`).
4. **Combine** — `allowed = roleOk && scope_ok`.
5. **Mode gate** — read `CALENDAR_RBAC_MODE` (default `audit_only`).
6. **Block decision** — `should_block = (mode === "enforced") && !allowed`.
7. **Gate A hard guard** — even if mode is `enforced`, enforcement remains blocked while Gate A is OPEN.

## Deny rules

- Denials must be **server-side** when enforced; UI hiding is insufficient.
- Return **safe generic messages** — never leak candidate-private existence.
- Record denied actions in audit when `audit_denied_actions` is true.
- Separate approval types: local ≠ campaign ≠ candidate.
- `shift.express_interest` never implies `shift.confirm`.
- Publication requires explicit publish permission — never UI-only gates.

## Separation of duties

| Concern | Separation |
|---------|------------|
| Candidate-private view | Only `candidate_scheduler` grant or certified CM/ACM seat |
| Publication | CM/ACM only; Volunteer Manager and Event Board denied |
| Shift confirm | Staffing authority required; volunteers may only express interest |
| Audit | `system_operator` and senior roles; college/county leaders excluded from audit view |
| Command vs participant | Command seats (CM, college_command_lead) ≠ volunteer participant role |

## Field-level access

Candidate-private fields (Kelly travel, security, non-public scheduling details) live in `calendar_event_candidate_details` and are excluded from public DTOs. Field-level access maps to `calendar.event.view_candidate_private` — not to public or internal view permissions.

Editors without `edit_scope` may only use `edit_own` on records they own. Scope editors (CM, Volunteer Manager) may edit within their organizational boundary.

## `audit_only` vs `enforced`

| Mode | Mutations | Audit | Production authority |
|------|-----------|-------|----------------------|
| `disabled` | Ungated by RBAC helper | No RBAC audit | Soft-beta only |
| `audit_only` (current) | **Never blocked** by RBAC helper | Decisions recorded when wired | Soft-beta only |
| `enforced` | **Blocked** when `should_block` | Denied actions logged | Requires Gate A CLOSED + test suite PASS |

**Current default:** `audit_only`. Do not set `CALENDAR_RBAC_MODE=enforced` while Gate A is OPEN.

## Hard guardrails

1. **Gate A OPEN → enforcement BLOCKED** — no production deny path.
2. **Soft-beta authority remains** — session proposals and demonstration paths govern live behavior.
3. **Never leak candidate-private** — unauthorized callers receive generic denials or empty public projections.
4. **No secrets in audit logs** — see denial and audit protocol doc.
5. **Matrix changes require doc sync** — update `CALENDAR_RBAC_AUTHORITY_MATRIX.md` and readiness report.
6. **Six design roles pending matrix rows** — `candidate_scheduler`, `college_command_lead`, `county_volunteer_manager`, `event_owner`, `shift_lead`, `system_operator` documented here; JSON rows added before enforcement.

## Related artifacts

| Artifact | Path |
|----------|------|
| Authority matrix | `docs/calendar/CALENDAR_RBAC_AUTHORITY_MATRIX.md` |
| Enforcement runbook | `docs/calendar/CALENDAR_RBAC_ENFORCEMENT_RUNBOOK.md` |
| Denial & audit protocol | `docs/calendar/CALENDAR_RBAC_DENIAL_AND_AUDIT_PROTOCOL.md` |
| Readiness report | `docs/calendar/CAL_P1_2_RBAC_READINESS_REPORT.md` |
| Matrix JSON | `data/calendar/calendar-rbac-matrix.json` |
| Gate A status | `data/calendar/certification/CAL-P1/gate-a/status.json` |
| Admin hub | `/admin/calendar/rbac` |
