# Identity Ledger Standard (ITL-LED-001)

Append-only history of identity assurance and trust changes.

## Rules

- Events are never edited or deleted through ordinary operations
- Corrections append new events with `status: correction`
- Optional SHA-256 hash chain when `IDENTITY_LEDGER_HASH_CHAIN_ENABLED`

## Event types

`identity.sponsored`, `verification.requested`, `verification.statement_submitted`, `identity.verified`, `trust.provisional_started`, `identity.restricted`, `identity.recovered`, `identity.challenge_opened`, etc.

## Access

- Individuals: safe summary via `GET /api/v1/identity/me/trust`
- Administrators: full ledger via `/api/admin/identity/trust`

Implementation: `src/lib/identity-trust/wave2/ledger.ts`
