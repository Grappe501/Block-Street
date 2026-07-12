# Human Identity Registry (ITL-HIR-001)

Wave 1 canonical human records are independent of login credentials, institutional membership, and roles.

## Core fields

- `global_human_id` — permanent nonsemantic identifier (`hum_*`)
- `public_name` — required display identity
- `identity_status` — lifecycle state
- `created_from_invitation_id` — accepted invitation lineage (after founding)
- `originating_sponsor_human_id` — accountable sponsor

## Human vs account

| Concept | Purpose |
|---------|---------|
| Human | Real person |
| AuthenticationIdentity | Login method |
| InstitutionMembership | Institution relationship |
| RoleAssignment | Scoped authority |

One human may connect multiple authentication providers without creating duplicate humans.

## Statuses

`pending_activation`, `active`, `restricted`, `identity_review`, `suspended`, `retired`, `merged_duplicate`

Ordinary deletion is not a human status; governed privacy processes may anonymize eligible fields while preserving lineage.

## Implementation

- Registry: `src/lib/identity-trust/wave1/engine.ts`
- Store: `data/identity-trust/store.json`
- APIs: `GET /api/v1/humans`, `GET /api/v1/identity/me`
