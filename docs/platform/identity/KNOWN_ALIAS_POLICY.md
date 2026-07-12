# Known Alias Policy

Aliases are permitted only when they represent an actual human identity known by that alias.

## Approval criteria

- Genuinely used by the individual
- Recognized by community members
- Not impersonation or accountability evasion
- Permanently linked to canonical Human record

## Workflow

1. User submits `AliasRequest`
2. Review queue evaluates evidence
3. Approve or reject — no automatic activation
4. Approved alias recorded with approval history

APIs: `POST /api/v1/identity/aliases`, admin approve/reject routes.

Flag: `KNOWN_ALIAS_REVIEW_ENABLED`
