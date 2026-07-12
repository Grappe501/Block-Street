# Wave 2 Certification

Seven gates plus Wave 2 invariants. Requires Wave 1 foundation complete.

## Gates

1. Verification integrity — no self-verification
2. Independent confirmation — two-person standard
3. Provisional controls
4. Trust-state integrity — named states, no hidden score
5. Restriction and recovery
6. Privacy — evidence not on public profiles
7. Ledger integrity — hash chain validation

## API

`GET /api/v1/identity-trust/wave2/certification`

Persisted to `data/identity-trust/wave2_certification.json` when all gates pass.
