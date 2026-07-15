# Calendar RBAC Enforcement Runbook

**Audience:** Operators and deploy engineers  
**Phase:** CAL-P1.2  
**Current state:** Gate A **OPEN** · mode **`audit_only`** · enforcement **BLOCKED**

## Modes

| Mode | `CALENDAR_RBAC_MODE` | Allowed now? | Behavior |
|------|----------------------|--------------|----------|
| **disabled** | unset or explicit off (helper bypass) | Yes | RBAC evaluation skipped; soft-beta authority only. Use only in local dev or emergency rollback. |
| **audit_only** | `audit_only` (default) | **Yes — current** | Evaluate permissions, record decisions, **never block** mutations via RBAC helper. |
| **enforced** | `enforced` | **No — blocked** | Server-side deny unauthorized actions. Requires Gate A CLOSED + RBAC test suite PASS. |

### When each mode is allowed

| Mode | Prerequisites |
|------|---------------|
| `disabled` | Local development or documented incident rollback. Not for production demo hosts. |
| `audit_only` | **Always safe** during CAL-P1.2 design and Gate A OPEN period. Default for all hosted environments. |
| `enforced` | Gate A `verdict: "CLOSED"` · migrations + shadow compare PASS · RBAC test suite PASS · operator sign-off · readiness report verdict not BLOCKED |

## Gate A prerequisite

RBAC enforcement is **subordinate** to Gate A shadow persistence proof.

Read status:

```text
data/calendar/certification/CAL-P1/gate-a/status.json
```

While `verdict` is **`OPEN`**:

- Do **not** set `CALENDAR_RBAC_MODE=enforced`.
- Do **not** treat RBAC denials as production authority.
- Soft-beta scheduling path remains governing (`authority: soft_beta_scheduling_path_only`).

Gate A closure sequence is documented in `status.json` → `closure_sequence` and `docs/calendar/CAL_P1_GATE_A_SHADOW_PERSISTENCE_REPORT.md`.

## Environment variable

| Variable | Values | Default |
|----------|--------|---------|
| `CALENDAR_RBAC_MODE` | `audit_only` \| `enforced` | `audit_only` |

Read by `getCalendarPersistenceConfig()` in `src/lib/calendar/persistence/config.ts`.

### Setting mode (hosted)

1. Confirm Gate A status — must be **CLOSED** before `enforced`.
2. Set `CALENDAR_RBAC_MODE=audit_only` for all pre-certification hosts (current requirement).
3. After Gate A closes and tests pass, set `CALENDAR_RBAC_MODE=enforced` in a **controlled** environment first.
4. Redeploy and verify `/admin/calendar/rbac` shows enforcement unblocked.
5. Run RBAC test suite and record in readiness report.

## Rollback to `audit_only`

If enforced mode causes unexpected denials or policy mismatch:

1. Set `CALENDAR_RBAC_MODE=audit_only` immediately.
2. Redeploy (or restart process if env is runtime-only).
3. Confirm `/admin/calendar/rbac` shows **Enforcement blocked: true**.
4. File incident note in audit log review (`/admin/calendar/rbac/mismatches`).
5. Do **not** re-enable `enforced` until root cause is documented and tests updated.

Emergency local rollback:

```powershell
$env:CALENDAR_RBAC_MODE = 'audit_only'
```

## Never enforce while Gate A is open

**Hard rule:** If `gate-a/status.json` → `verdict` is not `"CLOSED"`, enforcement is blocked regardless of env var.

`isRbacEnforcementBlocked()` returns `true` when Gate A is OPEN. Operators must treat any `enforced` env setting during Gate A OPEN as a **configuration error** — revert to `audit_only` and investigate.

## Operator checklist (pre-enforcement)

- [ ] Gate A `verdict: "CLOSED"` with acceptance checklist complete
- [ ] `CAL_P1_2_RBAC_READINESS_REPORT.md` verdict not BLOCKED
- [ ] RBAC test suite PASS recorded
- [ ] Denial UX messages reviewed (`CALENDAR_RBAC_DENIAL_AND_AUDIT_PROTOCOL.md`)
- [ ] Soft-beta actors mapped to production roles
- [ ] Rollback rehearsed (`audit_only` restore < 5 min)
- [ ] On-call notified

## Admin surfaces

| Route | Purpose |
|-------|---------|
| `/admin/calendar/rbac` | Hub — mode, Gate A, enforcement badge |
| `/admin/calendar/rbac/readiness` | Readiness checks |
| `/admin/calendar/rbac/audit-only` | Audit-only decision log |
| `/admin/calendar/rbac/mismatches` | Policy vs actual mismatches |
| `/admin/calendar/system` | Parent calendar operator console |

## Honesty statement

CAL-P1.2 RBAC is **DESIGN + AUDIT-ONLY**, not **CERTIFIED**. UI labels must not imply production enforcement until Gate A closes and readiness report approves promotion.
