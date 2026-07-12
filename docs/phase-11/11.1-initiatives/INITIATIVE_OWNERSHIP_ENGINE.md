# Initiative Ownership Engine

**Build:** 11.1 · **Wave:** W3

`services/owner-eligibility.ts` enforces Human ownership rules.

## Roles

Executive owner, operational owner, backup owner — all must be canonical Humans with active membership.

## Prohibited

Service identities and AI actors cannot hold ownership (`INITIATIVE_OWNER_INELIGIBLE`).

## Owner Required

`detectOwnerEligibilityLoss()` can set operational exception `owner_required`, blocking high-risk execution.

## Transfer

`TransferOperationalOwnershipCommand` validates eligibility, writes history, and preserves assignment chain.

## Acceptance

Nominated owners require acceptance before becoming active (MVP: eligibility check at assignment).
