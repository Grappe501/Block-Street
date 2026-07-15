# Calendar RBAC Authority Matrix (CAL-P1.2 Design)

**Status:** DESIGN PRESENT · runtime mode **`audit_only`**  
**Gate A:** **OPEN**  
**Enforcement:** **BLOCKED** until Gate A closes  
**Matrix file:** `data/calendar/calendar-rbac-matrix.json` (10 roles materialized · 6 design roles documented below)  
**Design package:** `docs/calendar/CAL_P1_2_RBAC_DESIGN.md`

## Governing boundary

> CAL-P1.2 may be designed in parallel, but RBAC enforcement and authority promotion remain blocked until Gate A proves Postgres shadow persistence.

Soft-beta remains the scheduling authority until that proof completes. UI and docs must read **DESIGN + AUDIT-ONLY**, not **CERTIFIED**.

## Modes

| Mode | Behavior |
|------|----------|
| `disabled` | RBAC helper bypass; soft-beta only |
| `audit_only` (current default) | Evaluate permission outcomes and record them. Do **not** use denials to block mutations. |
| `enforced` | Server-side deny unauthorized actions. Requires Gate A CLOSED + RBAC test suite PASS. **BLOCKED now.** |

Do not set `CALENDAR_RBAC_MODE=enforced` before Gate A evidence is complete.

## All 16 design roles

Roles 1–10 are in matrix JSON. Roles 11–16 are design-documented; matrix rows pending before enforcement.

| # | Role key | Display | Geographic limit | Key authorities | Matrix row |
|---|----------|---------|------------------|-----------------|------------|
| 1 | `campaign_manager` | Campaign Manager | Statewide | Approve campaign/candidate, publish, staffing, audit | **Yes** |
| 2 | `assistant_campaign_manager` | Assistant Campaign Manager | Statewide | Same as CM for calendar authority | **Yes** |
| 3 | `volunteer_manager` | Volunteer Manager | Statewide Event Board | Local/staffing approve · **not** candidate-private · **not** publish | **Yes** · **Carol Eagan** |
| 4 | `event_board_member` | Event Board Member | Campaign-approved scopes | Staffing confirm · local review | **Yes** |
| 5 | `college_leader` | College Leader | Assigned college only | Propose · local approve · campus staffing | **Yes** |
| 6 | `county_leader` | County Leader | Assigned county only | Propose · local approve · county staffing | **Yes** |
| 7 | `city_leader` | City Leader | Assigned city only | Same pattern — activation after Gate A + city wave | **Yes** |
| 8 | `team_lead` | Team Lead | Assigned team | Propose · edit own · report | **Yes** |
| 9 | `volunteer` | Volunteer | Relevant assigned/public | Express shift interest only | **Yes** |
| 10 | `viewer` | Viewer | Public only | View public calendar | **Yes** |
| 11 | `candidate_scheduler` | Candidate Scheduler | Statewide (Kelly grant) | `view_candidate_private`, `approve_candidate` — **explicit assignment only** | Design only |
| 12 | `college_command_lead` | College Command Lead | Assigned college | Command seat above college_leader; scoped edit within institution | Design only |
| 13 | `county_volunteer_manager` | County Volunteer Manager | Assigned county | County staffing orchestration under county_leader | Design only |
| 14 | `event_owner` | Event Owner | Event-scoped | Propose, edit_own, cancel for owned events | Design only |
| 15 | `shift_lead` | Shift Lead | Shift-scoped | Confirm/cancel assigned shifts only | Design only |
| 16 | `system_operator` | System Operator | System | Audit view, health/import operators — no content authority | Design only |

### Notable role notes

- **`candidate_scheduler`** — Explicit grant for Kelly private fields. Campaign Manager does **not** receive candidate-private by role title alone; certified command seat or scheduler assignment required.
- **`college_command_lead`** — Institution command seat; broader than `college_leader` but still college-scoped.
- **`county_volunteer_manager`** — County volunteer orchestration; pairs with `county_leader`.
- **`event_owner`** — Per-event ownership; does not imply publish or campaign approval.
- **`shift_lead`** — Shift-window authority; `shift.confirm` without full staffing define.
- **`system_operator`** — Operator/infra role; `calendar.audit.view` only among calendar permissions.
- **Volunteer Manager = Carol Eagan** — Named holder in matrix JSON; denied candidate-private and publish.

## Actions (permission categories)

All action keys live in matrix JSON:

| Category | Actions |
|----------|---------|
| View | `view_public`, `view_internal`, `view_candidate_private` |
| Mutate | `propose`, `edit_own`, `edit_scope`, `cancel` |
| Approve | `approve_local`, `approve_campaign`, `approve_candidate` |
| Publish | `publish`, `unpublish` |
| Staffing | `staffing.define`, `shift.express_interest`, `shift.confirm`, `shift.cancel` |
| Governance | `audit.view`, `report.create`, `report.approve` |

Critical separations:

- `calendar.event.view_candidate_private` ≠ public Kelly language
- `calendar.shift.express_interest` ≠ `calendar.shift.confirm`
- `calendar.event.approve_candidate` separate from local/campaign approval
- `calendar.event.publish` gated — CM/ACM only in this design revision

## Scope-aware rules

1. Henderson College Leader may manage Henderson-scoped events only.  
2. That leader may not approve an unrelated county event.  
3. County leaders inspect/manage only their county scopes.  
4. `county_volunteer_manager` acts within assigned county only.  
5. Event Board may staff across approved campaign scopes.  
6. Only certified CM/ACM seats and explicit **`candidate_scheduler`** grants may view private Kelly details — not role title alone.  
7. **Volunteer Manager (Carol Eagan)** may not view candidate-private.  
8. Publication requires publication permission — never UI-only.  
9. `event_owner` and `shift_lead` are bound to owned event/shift records.  
10. `system_operator` has audit/ops visibility only.

## Denial behavior (when enforced — blocked now)

- Fail server-side
- Return a safe message per `CALENDAR_RBAC_DENIAL_AND_AUDIT_PROTOCOL.md`
- Record denied-action audit where appropriate
- Never rely only on hidden buttons
- Never leak existence of private candidate data to unauthorized callers

## Parallel design vs blocked enforcement

Allowed now:

- Matrix JSON and this document
- Full 16-role design package
- `audit_only` evaluation helpers
- Admin matrix display (`/admin/calendar/rbac`)
- Tests that prove matrix integrity (roles, actions, scope rules present)

Blocked until Gate A:

- `enforced` mode
- Production deny path as authority
- Assuming soft-beta actors are production-authenticated roles
- Matrix rows for design-only roles 11–16 (until promotion window)

## Operator view

| Route | Content |
|-------|---------|
| `/admin/calendar/rbac` | Hub — mode, Gate A, enforcement badge |
| `/admin/calendar/rbac/matrix` | Full matrix summary |
| `/admin/calendar/rbac/roles` | Role catalog |
| `/admin/calendar/rbac/permissions` | Action catalog |
| `/admin/calendar/rbac/readiness` | Readiness stub |

## Related artifacts

- `docs/calendar/CAL_P1_2_RBAC_DESIGN.md`
- `docs/calendar/CALENDAR_RBAC_ENFORCEMENT_RUNBOOK.md`
- `docs/calendar/CALENDAR_RBAC_DENIAL_AND_AUDIT_PROTOCOL.md`
- `docs/calendar/CAL_P1_2_RBAC_READINESS_REPORT.md`
