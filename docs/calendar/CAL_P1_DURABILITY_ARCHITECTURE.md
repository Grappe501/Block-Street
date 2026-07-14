# CAL-P1 Durability Architecture

**Status:** soft-beta governing baseline preserved; CAL-P1 Wave 1 architecture PRESENT  
**Baseline content:** `dd2841c` · deploy stamp lineage from calendar soft-beta  
**Authority:** Not yet production scheduling authority

## Principle (unchanged)

> An event exists once. Calendars reference it according to scope, audience, geography, organization, and permissions.

## Current seed architecture

| Layer | Path | Role |
|-------|------|------|
| Types | `src/lib/calendar/types.ts` | Canonical field model |
| Builder | `src/lib/calendar/canonical.ts` | Normalize records |
| Catalog | `src/lib/calendar/seed.ts` | Soft-beta seed events |
| Session proposals | `src/lib/calendar/events.ts` | In-memory proposals (not durable) |
| UI routes | `src/app/calendar/**` | Projection by scope |
| Registry | `data/calendar/registry.json` | Soft-beta route map |

Soft-beta is authoritative only for demonstration. Session proposals do not survive redeploy.

## Target Postgres architecture

| Concern | Design |
|---------|--------|
| Identity | Stable external `event_id` (text unique). Internal `id` UUID optional. |
| Scopes | `calendar_event_scopes` rows — never clone event bodies |
| Candidate privacy | `calendar_event_candidate_details` — excluded from public queries |
| Approvals | Append-only `calendar_event_approvals` |
| Publication | `calendar_event_publication` + gated public DTO |
| Audit | Append-only `calendar_event_audit_log` |
| Staffing (later waves) | Requirements → shifts → participants |

### Source of truth transition

```text
seed_only / session_soft_beta
        ↓
postgres_shadow   (writes verified; seed/UI still authoritative for reads)
        ↓
postgres_primary  (Postgres authoritative; seed becomes import baseline only)
```

Do **not** promote to `postgres_primary` until shadow comparison passes and RBAC is enforced.

## Record ownership

| Record | Owner | Notes |
|--------|-------|-------|
| Canonical event | Calendar repository | Single write path |
| Scope rows | Calendar repository | Multi-row references |
| Candidate details | Candidate schedulers only | Never public |
| Approvals | Role-scoped actors | Append-only |
| Audit | System | Immutable after insert |

UI components never write SQL directly. All mutations go through `src/lib/calendar/persistence/repository.ts`.

## Seed import behavior

1. Read `SEED_EVENTS` from `src/lib/calendar/seed.ts`
2. Upsert by stable `event_id` **only if** not already present **or** marked import-owned without durable edits
3. Skip silently when durable edits exist (`version` / `updated_at` after import stamp)
4. Always recreate missing scope rows idempotently
5. Report conflicts; never silently overwrite operator edits

## Rollback process

See `docs/calendar/CAL_P1_MIGRATION_AND_ROLLBACK_PLAN.md`.

## Failure behavior

| Situation | Behavior |
|-----------|----------|
| No `DATABASE_URL` / `NETLIFY_DATABASE_URL` | Health = disconnected; writes to Postgres refused |
| `CALENDAR_WRITE_ENABLED=false` | Repository rejects mutations even if connected |
| Shadow mismatch | Log comparison report; do not flip primary |
| Private field query on public path | Hard deny; audit if attempted through repository |

## Permission / publication / notification boundaries (Wave 1)

Mode flags only in Wave 1:

```text
CALENDAR_PERSISTENCE_MODE=postgres_shadow   # target after connectivity
CALENDAR_WRITE_ENABLED=false
CALENDAR_RBAC_MODE=audit_only
CALENDAR_PUBLICATION_ENABLED=false
CALENDAR_NOTIFICATION_MODE=disabled
```

Enforced RBAC, publication, and notifications remain later subphases.

## Operator surfaces

- `/admin/calendar/system`
- `/admin/calendar/persistence`
- `/admin/calendar/health`

Never display connection strings or secrets.
