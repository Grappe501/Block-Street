# Canonical Identity Model

**System ID:** AUTH-001

## One Person, One Canonical Identity

Multiple authentication providers link to a single `PlatformUser` via `AuthenticationIdentity` records. Signing in with Google today and Microsoft later must not create duplicate accounts when emails match and linking is confirmed.

## Identity Rules

| Rule | Implementation |
|------|----------------|
| Email is not the primary internal identifier | All references use `user_id` |
| Provider IDs are not platform IDs | `AuthenticationIdentity.provider_subject` stored separately |
| Names are editable | `display_name`, `preferred_name` user-controlled |
| Sensitive data minimized | No birth date, government ID, or legal name unless module requires |

## Identity Assurance Levels

| Level | Meaning |
|-------|---------|
| IAL-0 | Unverified or temporary |
| IAL-1 | Verified email |
| IAL-2 | Verified provider or password + verified email |
| IAL-3 | MFA authenticated |
| IAL-4 | Institutionally verified or hardware-backed |

## Account Lifecycle States

`invited` → `pending_verification` → `active` → `restricted` → `suspended` → `archived` → `deletion_pending` → `deleted` / `anonymized`

Suspended accounts revoke all sessions immediately.

## Service and AI Identities

`ServiceIdentity` records support integrations, jobs, and future AI agents. AI actions must record initiating user, agent identity, context, and permission evaluation — never anonymous system actors.

## Data

See [AUTH_CANONICAL_DATA_MODEL.md](./AUTH_CANONICAL_DATA_MODEL.md) and `data/auth/users.json`.
