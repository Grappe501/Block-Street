# Wave 1 Test Plan

## Unit / smoke

- `node scripts/identity-trust/wave1-smoke.mjs` — public name policy, flags

## Integration (manual / admin certification)

- Founding path closure
- Invitation create → deliver → accept → human + provisional membership
- Expired and revoked invitation blocked
- OAuth-without-invitation creates nothing
- Duplicate routing to existing-human confirmation
- Legacy reconciliation

## Security

- Public signup returns 403
- Token replay fails
- Elevated role not auto-activated

## Certification

`GET /api/v1/identity-trust/wave1/certification` — seven gates plus ten invariants.

Passing certification persists to `data/identity-trust/wave1_certification.json`.
