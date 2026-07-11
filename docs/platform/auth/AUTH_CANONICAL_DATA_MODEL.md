# Canonical Identity Data Model — Build 8.1.2

**System ID:** AUTH-001 · **Live data:** `data/auth/`

## Entity Relationships

```text
PlatformUser
  ├── AuthenticationIdentity[]
  ├── UserSession[]
  ├── OrganizationMembership[]
  ├── WorkspaceMembership[]
  ├── MfaMethod[]
  ├── RecoveryCode[]
  ├── AuthenticationAuditEvent[]
  └── AccountRecoveryRequest[]

Organization
  ├── Workspace[]
  ├── OrganizationMembership[]
  ├── IdentityInvitation[]
  └── ServiceIdentity[]

Workspace
  ├── WorkspaceMembership[]
  └── IdentityInvitation[]
```

## PlatformUser

| Field | Type | Notes |
|-------|------|-------|
| `user_id` | string | Internal durable ID |
| `public_id` | string | External-safe reference |
| `primary_email` | string | Login contact — not internal PK |
| `display_name` | string | Editable |
| `preferred_name` | string | Editable |
| `account_status` | enum | Lifecycle state |
| `identity_assurance_level` | enum | IAL-0 through IAL-4 |
| `onboarding_status` | enum | Onboarding progress |
| `locale` | string | e.g. `en-US` |
| `timezone` | string | e.g. `America/Chicago` |
| `terms_accepted_at` | ISO8601 \| null | |
| `privacy_policy_accepted_at` | ISO8601 \| null | |
| `password_hash` | string \| null | Never exposed via API |

**Store:** `data/auth/users.json`

## AuthenticationIdentity

| Field | Type |
|-------|------|
| `id` | string |
| `user_id` | string |
| `provider_type` | google \| microsoft \| email_password \| passwordless \| passkey |
| `provider_subject` | string |
| `provider_email` | string |
| `provider_email_verified` | boolean |
| `status` | active \| revoked |
| `linked_at` | ISO8601 |
| `last_used_at` | ISO8601 \| null |

**Store:** `data/auth/authentication_identities.json`

## UserSession

| Field | Type |
|-------|------|
| `session_id` | string |
| `user_id` | string |
| `session_hash` | string |
| `created_at` | ISO8601 |
| `last_seen_at` | ISO8601 |
| `expires_at` | ISO8601 |
| `revoked` | boolean |
| `revocation_reason` | string \| null |
| `device_type` | string \| null |
| `browser` | string \| null |
| `operating_system` | string \| null |
| `authentication_strength` | string |
| `active_organization_id` | string \| null |
| `active_workspace_id` | string \| null |
| `risk_state` | normal \| elevated \| blocked |

**Store:** `data/auth/sessions.json`

## OrganizationMembership

| Field | Type |
|-------|------|
| `id` | string |
| `organization_id` | string |
| `user_id` | string |
| `membership_status` | invited \| pending \| active \| restricted \| suspended \| ended |
| `membership_type` | string |
| `primary_role_id` | string \| null |
| `joined_at` | ISO8601 \| null |

**Store:** `data/auth/organization_memberships.json`

## WorkspaceMembership

| Field | Type |
|-------|------|
| `id` | string |
| `workspace_id` | string |
| `user_id` | string |
| `organization_membership_id` | string |
| `status` | active \| ended \| suspended |
| `role_id` | string |
| `joined_at` | ISO8601 |

**Store:** `data/auth/workspace_memberships.json`

## IdentityInvitation

| Field | Type |
|-------|------|
| `id` | string |
| `email` | string |
| `organization_id` | string |
| `workspace_id` | string \| null |
| `role_id` | string \| null |
| `invitation_token_hash` | string |
| `status` | created \| sent \| accepted \| expired \| revoked |
| `expires_at` | ISO8601 |

**Store:** `data/auth/invitations.json`

## Supporting Entities

| Entity | Store |
|--------|-------|
| Organization | `data/auth/organizations.json` |
| Workspace | `data/auth/workspaces.json` |
| MfaMethod | `data/auth/mfa_methods.json` |
| RecoveryCode | `data/auth/recovery_codes.json` |
| ServiceIdentity | `data/auth/service_identities.json` |
| Feature flags | `data/auth/feature_flags.json` |

## Implementation

- Types: `src/lib/auth/types.ts`
- Engine: `src/lib/auth/engine.ts`, `context.ts`, `invitations.ts`, `mfa.ts`, `providers.ts`
