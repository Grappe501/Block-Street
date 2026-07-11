# Session Management Policy

**System ID:** AUTH-001

## Session Requirements

Sessions are secure, refreshable, revocable, device-aware, and auditable. Invalidated on password change, MFA change, and account suspension.

## Default Expiration

| Actor | Policy |
|-------|--------|
| Standard user | 24h rolling session (`SESSION_HOURS`) |
| Administrator | Shorter inactivity (configurable) |
| Elevated operation | Reauthentication required |
| Account suspension | All sessions revoked immediately |

## Session Cookie

- Name: `cos_session`
- HTTP-only, Secure in production, SameSite=Lax
- Scoped to `/`
- Contains session ID only — not user data

## User Controls

- View active sessions
- Revoke individual session
- Sign out everywhere (`POST /api/auth/logout-all`)

## Session Record Fields

`session_id`, `user_id`, `session_hash`, `created_at`, `last_seen_at`, `expires_at`, `revoked`, `active_organization_id`, `active_workspace_id`, `authentication_strength`, `risk_state`, device metadata.

## Reauthentication Required Before

- Changing authentication methods
- Changing primary email
- Viewing recovery codes
- Elevating permissions
- Deleting organization
- Creating high-risk API credentials

## Implementation

`src/lib/auth/engine.ts` · `data/auth/sessions.json`
