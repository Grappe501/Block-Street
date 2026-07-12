# Wave 3 Test Plan

**Wave ID:** CAE-11.1-W3

## Runner

```bash
npm run phase11:11.1:w3
```

Implementation: `w3-tests.ts`, invoked via `scripts/phase11/invoke-w3-tests.mjs`.

## Unit / Service Tests

| Area | Coverage |
|------|----------|
| State machine | Allowed and illegal transitions |
| Ownership | Human eligible; service identity rejected |
| Dependencies | Cycle detection, valid new dependency |
| Direct mutation | `assertInitiativeMutationViaService` guard |
| Acceptance flow | Draft → review → approve → blocked activation |
| Idempotency | Pause command with idempotency key |
| Restoration | Archived → active denied |
| Charter | Activation validation structure |

## Certification Gates

See [WAVE_3_CERTIFICATION.md](WAVE_3_CERTIFICATION.md).

## Future Tests (W4+)

HTTP API security, UI state maps, Spanish path, scheduled transition revalidation worker.
