# V1 Invite-Chain Certification Gate

**Journey ID:** `V1-JRN-INVITE-CHAIN-01`  
**Target status:** CERTIFIED PRESENT (six-axis)  
**Environment:** Production — https://block-street.netlify.app/  
**Prerequisite:** Invite Wave1 + Blobs flush fix on `main` (at/after `180c503`)

## Intent

Before expanding the product beyond the narrow PHASE-001.7 path, prove that a real invite-only leader-chain works end-to-end for Humans on production — not only that Build Control shows phase complete.

## Exact journey under test

```text
Steve sends invite
→ recipient opens production link
→ recipient understands the invitation
→ recipient chooses and locks a place
→ recipient enters the network
→ recipient sees a meaningful next action
→ recipient shares or invites another person
→ state persists after refresh and return
→ mobile journey passes
→ failures are visible and recoverable
```

## Six-axis evidence checklist

Record pass/fail with timestamp, actor, URL, screenshot or log ID for each axis.

| Axis | Pass criterion for this journey |
|------|----------------------------------|
| **1. Vision presence** | UX answers belong / get involved / invite without admin doctrine |
| **2. Implementation** | Production routes/APIs used: `/start`, `/invite/{token}`, `/choose-place`, `/network`, `/s/{slug}` |
| **3. Journey continuity** | No dead ends; each step has an obvious next action |
| **4. Production proof** | Ran on Netlify production (not localhost); state survives refresh/return |
| **5. Governance / trust** | Invite-only entry; sponsor lineage retained; failures show recoverable message |
| **6. Observation / ops** | Operator can see that the invitation was created and accepted (admin or durable store evidence) |

## Procedure

1. Steve signs in at `/start` on production.
2. Create invite for a fresh email; copy **new** `/invite/{token}` link (do not reuse pre-fix links).
3. Open link in a clean browser profile (desktop).
4. Complete accept → understand copy → set password → proceed.
5. Choose and lock a place; confirm map-style browse is constrained after lock.
6. Land on `/network`; confirm share link + QR + clear next action.
7. Hard refresh; sign out/in or return later; confirm place + network persist.
8. Open `/s/{slug}` from second device or window; confirm recruit understanding.
9. Repeat steps 3–7 at phone width (or real device); note blockers only.
10. Induce one recoverable failure (wrong password / expired token once) and confirm messaging.
11. Capture evidence pack under `data/v1-certification/journeys/V1-JRN-INVITE-CHAIN-01/` (when run).

## Pass / fail

- **PASS → CERTIFIED PRESENT** for `V1-JRN-INVITE-CHAIN-01` only (not the whole platform).
- **FAIL** → record defect; fix additively; re-run full journey; do not claim beta expansion.

## Explicit non-claims

Passing this gate does **not** certify:

- Large-scale statewide launch
- LocalBrain / Living Intelligence product completeness
- Postgres tenancy
- Committees, calendar UI, or LS-DEF deferred features

## Related

- [`GOVERNING_PRODUCT_TRUTH.md`](./GOVERNING_PRODUCT_TRUTH.md)
- [`FORENSIC_PLATFORM_AUDIT_2026-07-14.md`](./FORENSIC_PLATFORM_AUDIT_2026-07-14.md)
- [`.cursor/rules/netlify-deploy-closeout.mdc`](../../.cursor/rules/netlify-deploy-closeout.mdc)
