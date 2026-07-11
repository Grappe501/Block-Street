# Auth Provider Configuration

**System ID:** AUTH-001

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `AUTH_BOOTSTRAP_PASSWORD` | Dev/bootstrap email-password credential |
| `AUTH_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_CLIENT_SECRET` | Google OAuth secret |
| `AUTH_MICROSOFT_CLIENT_ID` | Microsoft OAuth (institutional) |
| `AUTH_MICROSOFT_CLIENT_SECRET` | Microsoft OAuth secret |
| `NEXT_PUBLIC_APP_URL` | Base URL for callbacks |
| `AUTH_SESSION_HOURS` | Session duration override |

**Never commit secrets to source control.**

## Feature Flags

`data/auth/feature_flags.json`:

| Flag | Default (dev) |
|------|---------------|
| `AUTH_REQUIRED_FOR_PROTECTED_ROUTES` | true |
| `AUTH_GOOGLE_ENABLED` | false |
| `AUTH_MICROSOFT_ENABLED` | false |
| `AUTH_PASSWORD_ENABLED` | true |
| `AUTH_PASSWORDLESS_ENABLED` | true |
| `AUTH_MFA_ENABLED` | true |
| `AUTH_MFA_REQUIRED_FOR_ADMINS` | true |
| `AUTH_SELF_REGISTRATION_ENABLED` | true |
| `AUTH_INVITATION_ONLY_MODE` | false |
| `AUTH_HONOR_SYSTEM_DISABLED` | true |

Production must fail safely if authentication configuration is incomplete.

## Callback URLs

- Google: `{APP_URL}/api/auth/providers/google/callback`
- Microsoft: `{APP_URL}/api/auth/providers/microsoft/callback`

## Cookie Security

HTTP-only · Secure in production · SameSite=Lax · narrow scope · invalidated on logout.

## Rate Limiting

Apply to login, registration, password reset, passwordless, MFA, invitation acceptance, account recovery. Avoid email enumeration in responses.
