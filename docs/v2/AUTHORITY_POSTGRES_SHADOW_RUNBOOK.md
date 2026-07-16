# Authority Postgres Shadow Runbook

**Mode:** `json_primary_postgres_shadow`  
**Migration:** `database/migrations/20260716060000_authority_p1_core.sql`

## Shadow-write targets

- Appointment create/update/activate/deactivate
- Appointment scope bindings
- Denial events
- Platform-admin override events

## Behavior

```text
JSON write succeeds
→ Postgres shadow write attempted
→ result recorded in shadow-parity-status.json
→ user response follows JSON canonical behavior
```

Shadow failures do **not** block JSON workflows. Diagnostics are recorded without exposing DB details to users.

## Compare parity

```bash
npm run authority:shadow-compare
npm run test:authority-shadow-parity
```

Output categories: `json_only`, `postgres_only`, `field_mismatch`, `scope_mismatch`, `status_mismatch`.

## Promotion gate

Set `promotionReady: true` in `data/authority/shadow-parity-status.json` only when:

- Appointment counts match
- No field/status mismatches on fixtures
- Decision parity tests pass

## Environment

- `DATABASE_URL` — required for shadow writes
- `AUTHORITY_SHADOW_WRITES_ENABLED=false` — disable shadow (JSON only)
