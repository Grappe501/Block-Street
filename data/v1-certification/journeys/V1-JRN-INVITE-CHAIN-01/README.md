# Journey evidence — V1-JRN-INVITE-CHAIN-01 (WP-01)

**Package status:** PRESENT (not CERTIFIED)  
**Ledger:** [`evidence-matrix.json`](./evidence-matrix.json)  
**Docs:** [`docs/v2/WP01_INVITE_EVIDENCE_CERTIFICATION.md`](../../../../docs/v2/WP01_INVITE_EVIDENCE_CERTIFICATION.md) · [`V1_INVITE_CHAIN_CERTIFICATION_GATE.md`](../../../../docs/v1-certification/V1_INVITE_CHAIN_CERTIFICATION_GATE.md)

## Certification states

```text
ABSENT | PRESENT | TESTED | CERTIFIED
```

Do not mark package `CERTIFIED` while evidence depends only on static seed data or temporary browser state.

## Artifacts to place when the gate is executed

- `run.json` — timestamps, actors, commit SHA, environment URL, pass/fail per evidence row + six-axis
- Updated `evidence-matrix.json` row statuses
- Operator audit notes / log IDs for create, delivery, accept, expire, revoke, duplicate, fail
- Screenshots optional

## Hard rule

A route that renders is PRESENT at best. Sandbox PASS supports TESTED, not package CERTIFIED.
