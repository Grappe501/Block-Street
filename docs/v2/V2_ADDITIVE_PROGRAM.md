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

## Immediate constraint

`V1-JRN-INVITE-CHAIN-01` must reach **CERTIFIED PRESENT** (or fail with recorded defects) before marketing expansion beyond invite-only soft beta. V2-A operator/docs prep may proceed in parallel; participant-facing claim expansion may not.

Journey ledger: [`../v1-certification/PRODUCT_CERTIFICATION_REGISTRY.md`](../v1-certification/PRODUCT_CERTIFICATION_REGISTRY.md)  
Audience bands (Field Plan): [`AUDIENCE_SECTIONING_DOCTRINE.md`](./AUDIENCE_SECTIONING_DOCTRINE.md)

## Closeout

Every lane shipment follows `.cursor/rules/netlify-deploy-closeout.mdc`: validate → commit → `git push origin HEAD`.