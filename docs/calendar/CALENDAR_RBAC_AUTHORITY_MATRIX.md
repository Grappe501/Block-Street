# Calendar RBAC Authority Matrix (CAL-P1.2 Design)

**Status:** DESIGN PRESENT · runtime mode **`audit_only`**  
**Enforcement:** **BLOCKED** until Gate A closes  
**Matrix file:** `data/calendar/calendar-rbac-matrix.json`

## Governing boundary

> CAL-P1.2 may be designed in parallel, but RBAC enforcement and authority promotion remain blocked until Gate A proves Postgres shadow persistence.

Soft beta remains the scheduling authority until that proof completes.

## Modes

| Mode | Behavior |
|------|----------|
| `audit_only` (current default) | Evaluate permission outcomes and record them. Do **not** use denials to block mutations. |
| `enforced` | Server-side deny unauthorized actions. Requires Gate A CLOSED + RBAC test suite PASS. |

Do not set `CALENDAR_RBAC_MODE=enforced` before Gate A evidence is complete.

## Roles

| Role | Geographic limit | Key authorities |
|------|------------------|-----------------|
| Campaign Manager | Statewide | Approve campaign, candidate, publish, staffing, audit |
| Assistant Campaign Manager | Statewide | Same as CM for calendar authority |
| Volunteer Manager (Carol Eagan) | Statewide Event Board | Local/staffing approve · **not** candidate-private · **not** publish |
| Event Board Member | Approved campaign scopes | Staffing confirm · local review |
| College Leader | Assigned college only | Propose / local approve / campus staffing |
| County Leader | Assigned county only | Propose / local approve / county staffing |
| City Leader | Assigned city only | Same pattern — activation after Gate A + city wave |
| Team Lead | Assigned team | Propose · edit own · report |
| Volunteer | Relevant assigned/public | Express shift interest only |
| Viewer | Public only | View public calendar |

## Actions

All action keys live in the matrix JSON. Critical separations:

- `calendar.event.view_candidate_private` ≠ public Kelly language
- `calendar.shift.express_interest` ≠ `calendar.shift.confirm`
- `calendar.event.approve_candidate` separate from local/campaign approval
- `calendar.event.publish` gated and CM/ACM only in this design revision

## Scope-aware rules

1. Henderson College Leader may manage Henderson-scoped events only.  
2. That leader may not approve an unrelated county event.  
3. County leaders inspect/manage only their county scopes.  
4. Event Board may staff across approved campaign scopes.  
5. Only CM/ACM (and future certified candidate schedulers) may view private Kelly details.  
6. Publication requires publication permission — never UI-only.

## Denial behavior (when enforced)

- Fail server-side
- Return a safe message
- Record denied-action audit where appropriate
- Never rely only on hidden buttons
- Never leak existence of private candidate data to unauthorized callers

## Parallel design vs blocked enforcement

Allowed now:

- Matrix JSON and this document
- `audit_only` evaluation helpers
- Admin matrix display
- Tests that prove matrix integrity (roles, actions, scope rules present)

Blocked until Gate A:

- `enforced` mode
- Production deny path as authority
- Assuming soft-beta actors are production-authenticated roles

## Operator view

`/admin/calendar/rbac` renders the designed matrix and the live `CALENDAR_RBAC_MODE` (must remain `audit_only` until Gate A).
