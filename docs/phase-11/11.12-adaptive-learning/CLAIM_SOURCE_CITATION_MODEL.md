# Claim, Source, and Citation Model

**Protocol:** CAE-11.12-W2

## KnowledgeClaim

Institutional factual assertions attached to artifacts. Claims require evidence before validation.

### Claim lifecycle

`draft → pending_evidence → evidence_attached → validated → (disputed | retracted) → archived`

**Rule:** `validated` requires `evidence_status` of `attached` or `verified`.

## Source

Authoritative references (legislation, research, policy, operational evidence). Reusable across claims.

## Citation

Links claim to source with locator. **Orphan citations prohibited** — must reference `claim_id`, `source_id`, and `artifact_id`.

## EvidenceReference

Polymorphic link from claim to operational or research evidence entities.

Validation codes: `KNW-V-010` through `KNW-V-023`.
