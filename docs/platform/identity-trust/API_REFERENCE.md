# Identity Trust API Reference

**System ID:** ITF-001

## Endpoints

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/api/v1/identity-trust/overview` | identity_trust.view | Layer status and counts |
| GET | `/api/v1/identity-trust/policy` | public | Constitutional policy and sponsor agreement |
| GET | `/api/v1/identity-trust/identities` | identity_trust.view | Human identity registry |
| GET | `/api/v1/identity-trust/identity` | identity_trust.view | Single identity or public badge |
| PATCH | `/api/v1/identity-trust/identity/update` | identity_trust.manage | Update public identity |
| GET | `/api/v1/identity-trust/invitations` | identity_trust.view | List trust invitations |
| POST | `/api/v1/identity-trust/invitations` | identity_trust.manage | Create invitation with sponsor agreement |
| POST | `/api/v1/identity-trust/register` | public | Invitation-only registration |
| GET | `/api/v1/identity-trust/verifications` | identity_trust.view | Private verification records |
| POST | `/api/v1/identity-trust/verifications` | identity_trust.manage | Record verification |
| GET | `/api/v1/identity-trust/invite-tree` | identity_trust.view | Invite tree or ancestry |
| GET | `/api/v1/identity-trust/reviews` | identity_trust.view | Identity reviews |
| POST | `/api/v1/identity-trust/reviews` | identity_trust.manage | Open or resolve review |
| GET | `/api/v1/identity-trust/sponsor-accountability` | identity_trust.manage | Sponsor accountability summary |
| GET | `/api/admin/identity-trust/overview` | admin | Admin dashboard data |
