# CAL-P1 Migration and Rollback Plan

## Migration order

1. `20260714190000_calendar_p1_core.sql` — events, scopes, candidate details, volunteer requirements, approvals, publication, audit
2. (Wave 4) shifts + participants + status history
3. (Wave 5) conflicts
4. (Wave 6) notifications (if not shared)
5. (Wave 7) city inheritance tables / reference data

## Backfill order

1. Run migrations on a non-production or empty schema target
2. `npm run calendar:seed-import` with `CALENDAR_WRITE_ENABLED=true` and mode `postgres_shadow`
3. Verify `event_id` uniqueness and scope counts
4. Run `npm run test:calendar:persistence`
5. Run shadow comparison against in-process seed catalog

## Seed-event import

- Source: `src/lib/calendar/seed.ts`
- Preserve every stable `event_id`
- One row per event in `calendar_events`
- N rows in `calendar_event_scopes`
- Candidate details only when Kelly fields exist
- Volunteer requirements from `volunteer_roles[]`

## Duplicate prevention

```sql
UNIQUE (event_id)
UNIQUE (event_slug) WHERE event_slug IS NOT NULL
UNIQUE (event_id, scope_type, scope_key)
```

Import must use `ON CONFLICT (event_id) DO NOTHING` for events when `import_locked = true` or durable edits exist.

## Verification queries (safe — no secrets)

```sql
SELECT count(*) AS events FROM calendar_events;
SELECT count(*) AS scopes FROM calendar_event_scopes;
SELECT event_id, count(*) FROM calendar_events GROUP BY event_id HAVING count(*) > 1;
SELECT e.event_id, count(s.id) AS scope_count
FROM calendar_events e
LEFT JOIN calendar_event_scopes s ON s.event_id = e.event_id
GROUP BY e.event_id;
```

## Rollback commands

Forward migration is additive. Rollback (pre-primary only):

1. Set `CALENDAR_PERSISTENCE_MODE=session_soft_beta` and `CALENDAR_WRITE_ENABLED=false`
2. Deploy UI that reads seed (already the soft-beta path)
3. Optionally drop calendar tables **only** on non-primary rehearsal targets:

```sql
-- rehearsal targets only — never run against certified primary without explicit operator order
DROP TABLE IF EXISTS calendar_event_audit_log CASCADE;
DROP TABLE IF EXISTS calendar_event_approvals CASCADE;
DROP TABLE IF EXISTS calendar_event_publication CASCADE;
DROP TABLE IF EXISTS calendar_event_volunteer_requirements CASCADE;
DROP TABLE IF EXISTS calendar_event_candidate_details CASCADE;
DROP TABLE IF EXISTS calendar_event_scopes CASCADE;
DROP TABLE IF EXISTS calendar_events CASCADE;
DROP TABLE IF EXISTS calendar_schema_migrations CASCADE;
```

## Production enablement gates

| Gate | Requirement |
|------|-------------|
| A Shadow | Connectivity + migration applied + import idempotent + compare pass |
| B Primary restricted | `postgres_primary` + write enabled + RBAC audit_only + test actors only |
| C Enforced RBAC | Permission suite green |
| D–F | Later subphases |

Wave 1 does **not** enable Gate B–F.
