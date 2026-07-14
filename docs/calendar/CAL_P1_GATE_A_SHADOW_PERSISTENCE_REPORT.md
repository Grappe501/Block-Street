# CAL-P1 Gate A — Shadow Persistence Report

**Verdict: OPEN**  
**Authority: soft-beta scheduling path only**  
**Wave 1 content:** `f63c8b1` · deploy stamp `666af01`  
**Evidence package:** `data/calendar/certification/CAL-P1/gate-a/`

## Governing statement

> The durable architecture is present. The database authority is not yet proven, writes are disabled by default, and Block Street remains on the soft-beta scheduling path.

## Current environment

| Item | Value |
|------|--------|
| Persistence mode | `session_soft_beta` |
| Write enabled | `false` |
| RBAC mode | `audit_only` |
| Database target classification | **unconfigured** |
| Postgres / Netlify Database URL | Not set in the Wave 1 build environment |
| Live migrate | Not run |
| Live seed import | Not run |
| Live shadow compare | Not run |
| Restart persistence proof | Not run |
| Redeploy persistence proof | Not run |
| Rollback rehearsal | SQL present; not executed against a live target |

## What Wave 1 established (PRESENT)

- Core migration + rollback SQL
- Durable schemas for events, scopes, candidate-private details, volunteer requirements, approvals, publication, audit
- Repository abstraction and persistence modes
- Idempotent seed-import tooling
- Shadow-compare tooling
- Operator health / persistence / certification surfaces
- Safe write defaults (no silent promotion to Postgres authority)

## Gate A closure sequence (required order)

1. Provision the Netlify/Postgres database.
2. Set `DATABASE_URL` or `NETLIFY_DATABASE_URL` in the correct local and Netlify environments.
3. Verify the target is the intended hosted database (document classification; never commit secrets).
4. Run `npm run calendar:db:probe`.
5. Run `npm run calendar:db:migrate`.
6. Confirm all expected tables and indexes exist.
7. Set `CALENDAR_PERSISTENCE_MODE=postgres_shadow`.
8. Set `CALENDAR_WRITE_ENABLED=true` for the controlled test environment only.
9. Run `npm run calendar:seed-import`.
10. Run `npm run calendar:shadow-compare`.
11. Restart the application.
12. Re-run the comparison.
13. Redeploy.
14. Re-run the comparison against the deployment.
15. Record counts, mismatches, and audit entries into this package.

## Acceptance criteria

Gate A closes only when all are true:

| Criterion | Status |
|-----------|--------|
| Hosted database target identified and documented | OPEN |
| Migrations complete successfully | OPEN |
| All eight seed events import once | OPEN |
| Re-running import creates no duplicates | OPEN |
| Every event preserves stable `event_id` | OPEN |
| Scope references match the seed catalog | OPEN |
| Candidate-private records excluded from public queries | Architecture present; live proof OPEN |
| Audit records exist for imports and shadow writes | OPEN |
| Shadow reads and soft-beta reads agree | OPEN |
| Data survives application restart | OPEN |
| Data survives Netlify redeployment | OPEN |
| Rollback SQL validated in a safe rehearsal database | OPEN |
| No production secrets in logs or repository | PASS (to date) |

## Evidence to record when executing Gate A

Populate under `data/calendar/certification/CAL-P1/gate-a/`:

- Database target classification (no URLs or credentials)
- Migration timestamp and version (`20260714190000_calendar_p1_core`)
- Seed import count (expect 8 inserted on first run, 0 on second)
- Scope-reference count
- Duplicate count (expect 0)
- Shadow mismatch count (expect 0)
- Audit-row count
- Restart result
- Redeploy result
- Rollback rehearsal result
- Final Gate A verdict (`CLOSED` only when every criterion passes)

## Next build boundary

Do **not** start CAL-P1.2 production RBAC **enforcement** until Gate A proves canonical events persist correctly.

RBAC matrix design may proceed in parallel as documentation only. The authority switch remains blocked until:

```text
Postgres configured
→ migrations passed
→ seed import passed
→ shadow compare passed
→ restart passed
→ redeploy passed
```

## Final Gate A verdict

**OPEN** — awaiting hosted database configuration and the closure sequence above.
