# Invitation Lifecycle (ITL-INV-001)

## Statuses

`draft` → `ready_to_send` → `sent` → `delivered` → `viewed` → `acceptance_started` → `accepted`

Terminal: `expired`, `revoked`, `declined`, `replaced`, `identity_review`, `failed_delivery`

## Security

- Cryptographically random tokens
- Stored as hashes only
- Time-limited (default 7 days)
- Single-use after acceptance
- Revocable; replay blocked and audited

## Creation requirements

1. Sponsor authority check
2. Dual attestation (`SPONSOR_ATTESTATION_REQUIRED`)
3. Scoped institution and membership
4. Intended recipient identity and contact

## Replacement

Links to original invitation; does not erase lineage.

Implementation: `src/lib/identity-trust/wave1/engine.ts`, `acceptance.ts`
