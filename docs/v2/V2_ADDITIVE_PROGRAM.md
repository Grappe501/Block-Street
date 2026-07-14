# V2 Additive Program — Governing Sequence

**Status:** Accepted 2026-07-14  
**Posture:** Additive overlays only · no destructive rebuild  
**Authority:** [`GOVERNING_PRODUCT_TRUTH.md`](../v1-certification/GOVERNING_PRODUCT_TRUTH.md)

## Order (locked)

| # | ID | Name | Primary outcome |
|---|-----|------|-----------------|
| 1 | V2-A | Operator Command | One usable operator surface; doctrine demoted to library |
| 2 | V2-B | Blobs→Postgres Port | Production persistence + tenancy; Blobs path kept until cutover proven |
| 3 | V2-C | Community Room MVP | First complete human community experience |
| 4 | V2-D | LocalBrain Shell | One coherent LocalBrain product surface |
| 5 | V2-E | Network Graph | Living visible network of invites/places/membership |
| 6 | V2-F | Assurance Dashboard | Certification truth, journey proof, deploy/risk state |

## Preferred next move (locked with governing truth)

1. **`V1-JRN-INVITE-CHAIN-01`** — named launch blocker · certify + evidence on production  
2. **V2-B.1** Field Plan source contract + ingestion spine (schema/gates only; broad ingest blocked)  
3. **V2-B.2** Position mapping registry + review/conflict queues (map into V2-A.3; no silent assign)  
4. **V2-B.3** Expandable responsibility library bound to mapped seats (task scaffolds; no personnel assign)  
5. **V2-B.4** KPI wiring + review resolution for content-backed responsibilities (templates approved; still unassigned)  
6. **V2-B.5** Durability prep — freeze approved templates on static_seed (no Postgres cutover; no personnel assign)  
7. **V2-B.6+ / Postgres lane** dual-write candidates later — Blobs+seed until gates proven · invite-chain CERTIFIED PRESENT still blocks expansion  

Note: historical “V2-B Blobs→Postgres” in the original table remains a later durability lane; Field Plan operationalization is the active V2-B content lane.

## Immediate constraint

`V1-JRN-INVITE-CHAIN-01` must reach **CERTIFIED PRESENT** (or fail with recorded defects) before marketing expansion beyond invite-only soft beta. V2-A may proceed in parallel; participant-facing claim expansion may not.

Governance registries:

- Journey ledger: [`../v1-certification/PRODUCT_CERTIFICATION_REGISTRY.md`](../v1-certification/PRODUCT_CERTIFICATION_REGISTRY.md)
- Audience bands: [`AUDIENCE_SECTIONING_DOCTRINE.md`](./AUDIENCE_SECTIONING_DOCTRINE.md)
- Feature discovery: [`FEATURE_DISCOVERY_REGISTRY.md`](./FEATURE_DISCOVERY_REGISTRY.md)

## Ernie + Steve working plane

Forensic brief + modular plan (post V2-B.5):

- [`ERNIE_STEVE_FORENSIC_BUILD_BRIEF.md`](./ERNIE_STEVE_FORENSIC_BUILD_BRIEF.md)
- [`FIELD_PLAN_DEPTH_LAYERS.md`](./FIELD_PLAN_DEPTH_LAYERS.md) — L2/L3/L4 = three depths still needed
- Twin: `data/v2/ernie-steve-build-plan.json`

## Closeout

Every lane shipment follows `.cursor/rules/netlify-deploy-closeout.mdc`: validate → commit → `git push origin HEAD`.