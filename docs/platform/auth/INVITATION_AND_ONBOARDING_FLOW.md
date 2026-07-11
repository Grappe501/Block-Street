# Invitation and Onboarding Flow

**System ID:** AUTH-001

## Invitation Lifecycle

```text
Created → Sent → Opened → Identity Verified → Accepted → Membership Created → Onboarding Started
```

Alternative outcomes: Expired, Revoked, Declined, Replaced, Already a Member.

## Rules

- Single-use, time-limited, revocable tokens (stored as hash)
- Scoped to organization and optional workspace + role
- Existing platform users attach to canonical identity — no duplicate accounts
- Full audit trail

## Onboarding Steps

1. Identity verified
2. Accept terms and privacy notice
3. Confirm display name
4. Select timezone and preferences
5. Join or confirm organization
6. Confirm workspace
7. Review assigned role
8. Complete required profile / training
9. Enter platform

## APIs

- `POST /api/invitations` — create (authenticated admin)
- `GET /api/invitations/{token}` — preview (public)
- `POST /api/invitations/{token}/accept` — accept after auth
- `POST /api/invitations/{id}/revoke` — revoke

## UI

- `/invitations/accept` — invitation acceptance
- `/onboarding` — contextual onboarding wizard
- `/select-organization`, `/select-workspace` — context selection

## Data

`data/auth/invitations.json`
