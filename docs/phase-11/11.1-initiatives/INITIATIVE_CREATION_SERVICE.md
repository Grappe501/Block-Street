# Initiative Creation Service

**Build:** 11.1 · **Wave:** W3

`CreateInitiativeDraftCommand` creates a draft in `concept` status with initial charter, scope, timeline, and version records.

## Preconditions

- Authenticated Human with institution membership
- Supported initiative type
- Governing institution active

## Draft Fields

Minimum: governing institution, name, type, initial problem/opportunity, visibility, creator.

## Effects

- Status: `concept` (never `active`)
- Slug generated institution-scoped
- Creator recorded; no automatic activation authority
- `initiative.draft_created` event emitted

## Code

`createDraft()` in `domain-service.ts`.
