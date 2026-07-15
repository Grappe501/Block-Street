# Calendar RBAC Denial and Audit Protocol

**Phase:** CAL-P1.2  
**Mode:** `audit_only` (decisions recorded; mutations not blocked)  
**Enforcement:** BLOCKED until Gate A closes

## Denial UX messages

When `enforced` mode is active (future), API and UI surfaces return **safe, non-leaking** messages. Message selection by denial class:

| Class | When | User-facing message |
|-------|------|---------------------|
| **generic** | Default deny; unknown role; internal errors | "You do not have authority for this calendar action." |
| **scope** | Actor role OK but geographic/organizational scope mismatch | "This action is outside your assigned calendar scope." |
| **approval** | Missing approval permission (local/campaign/candidate) | "You cannot approve this event at the required level." |
| **candidate** | Candidate-private view or field access denied | **Same as generic** — never confirm private record existence |
| **publication** | Publish/unpublish denied | "Publication authority is required for this action." |
| **staffing** | Shift confirm/cancel without staffing authority | "Staffing authority is required to manage shifts." |

### Rules

- Never return "event not found" for unauthorized candidate-private access when existence would leak.
- Never include role keys, matrix internals, or Kelly field names in user messages.
- UI may hide buttons, but server must still deny on direct API calls.
- `audit_only` mode: log decision; do not show denial UX for blocked mutations (mutations proceed).

## Audit record fields

When recording an RBAC decision (allow or deny):

| Field | Required | Description |
|-------|----------|-------------|
| `timestamp` | Yes | ISO-8601 UTC |
| `actor_user_id` | If known | Authenticated user id (nullable in soft beta) |
| `actor_role` | Yes | Role key evaluated |
| `action` | Yes | Permission action key |
| `allowed` | Yes | Boolean outcome |
| `mode` | Yes | `audit_only` \| `enforced` |
| `reason` | Yes | `allowed` \| `unknown_role` \| `role_lacks_action` \| `scope_mismatch` |
| `scope_ok` | Yes | Scope check result |
| `enforcement_active` | Yes | Whether mode was `enforced` |
| `should_block` | Yes | Whether mutation would have been blocked |
| `resource_scope` | If scoped | College/county/city slugs or event id hash — no PII |
| `denial_class` | On deny | generic \| scope \| approval \| candidate \| publication \| staffing |
| `request_id` | If available | Correlation id for support |

Append to `calendar_event_audit_log` (Postgres) or in-memory audit store when wired.

## What not to log

- Database URLs, API keys, JWTs, session tokens
- Candidate-private field values (Kelly travel, security details)
- Full request bodies containing PII
- Passwords or auth secrets
- Raw soft-beta session payloads
- Stack traces with env secrets in production audit tables

Log **decision metadata** only. Candidate-private denials log `denial_class: candidate` without confirming record existence.

## Mismatch types

Mismatches occur when observed behavior diverges from policy. Severity guides operator response:

| Type | Description | Severity |
|------|-------------|----------|
| `policy_denied_actual_allowed` | Policy says deny but mutation succeeded | **CRITICAL** — enforcement failure or audit_only gap |
| `policy_allowed_actual_denied` | Policy says allow but user blocked | High — false deny harms operations |
| `scope_drift` | Scope assignment changed without audit | Medium |
| `role_mapping_drift` | Soft-beta actor mapped to wrong production role | High |
| `ui_only_gate` | UI hid action but API allowed unauthorized mutation | High in audit_only; CRITICAL in enforced |
| `candidate_leak` | Private field exposed to unauthorized actor | **CRITICAL** — immediate rollback |

### `policy_denied_actual_allowed` (critical)

In `enforced` mode this is a **security incident**: unauthorized mutation occurred despite deny decision.

In `audit_only` mode this is **expected** for denied decisions — mutations are not blocked by design. Track count for enforcement readiness; do not treat as incident until mode is `enforced`.

Operator response when critical in enforced mode:

1. Rollback to `audit_only` per runbook.
2. Capture mismatch row in `/admin/calendar/rbac/mismatches`.
3. Freeze role mapping changes until root cause fixed.
4. Re-run RBAC test suite before re-enabling enforcement.

## Audit-only protocol (current)

While Gate A is OPEN and mode is `audit_only`:

1. Call `evaluateCalendarPermission` on mutation paths when instrumented.
2. Append decision to audit store via `getAuditOnlyDecisions` pipeline (when wired).
3. **Do not** call `assertCalendarPermission` throw path in production mutations.
4. Review denied-would-have-been counts weekly at `/admin/calendar/rbac/audit-only`.
5. Update readiness report when test run completes.

## Related docs

- `CAL_P1_2_RBAC_DESIGN.md` — evaluation order and guardrails
- `CALENDAR_RBAC_ENFORCEMENT_RUNBOOK.md` — mode transitions
- `CALENDAR_RBAC_AUTHORITY_MATRIX.md` — role-action reference
