# WP-01 — Invite Evidence and Certification

**Status:** PRESENT (not CERTIFIED)  
**Journey:** `V1-JRN-INVITE-CHAIN-01`  
**Machine twin:** `data/v1-certification/journeys/V1-JRN-INVITE-CHAIN-01/evidence-matrix.json`  
**Companion gate:** [`V1_INVITE_CHAIN_CERTIFICATION_GATE.md`](../v1-certification/V1_INVITE_CHAIN_CERTIFICATION_GATE.md)

## Purpose

Not to make invitations look complete. To produce evidence that the chain works from beginning to end for real leaders.

## Certification states (only these)

```text
ABSENT → PRESENT → TESTED → CERTIFIED
```

| State | Meaning |
|-------|---------|
| ABSENT | No code, UI, or durable evidence |
| PRESENT | Code or UI exists |
| TESTED | Automated or controlled tests passed |
| CERTIFIED | Full production-like evidence chain inspected and documented |

WP-01 must not become `CERTIFIED` while it depends only on static seed data or temporary browser state.

## Certification path

```text
Authorized leader initiates invitation
→ invitation receives stable identity
→ intended role is preserved
→ county/institution/command scope is preserved
→ recipient opens valid invitation
→ recipient understands the position
→ recipient accepts or declines
→ acceptance persists
→ user identity binds to the intended role
→ reporting hierarchy updates
→ correct dashboard becomes available
→ duplicate, expired, revoked, and reused links are rejected
→ operator can inspect the complete audit trail
```

## Evidence matrix

See the twin JSON for live row status. Rows: Creation, Authority, Scope, Delivery, Expiration, Revocation, Duplication, Identity binding, Hierarchy binding, Dashboard routing, Persistence, Auditability, Security, Separation.

## Relationship to six-axis gate

The six-axis production smoke in `V1_INVITE_CHAIN_CERTIFICATION_GATE.md` remains required. The evidence matrix is the launch-critical ledger; both must pass before package `CERTIFIED`.

## Explicit non-claims

Soft-beta invite UX and local sandbox PASS do not certify:

- Safe recruit → bind → permission → activate of real leaders at launch scale
- Postgres / production RBAC
- Hierarchy binding into command boards
- L4 Field Plan execution
