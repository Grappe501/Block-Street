# MFA and Account Recovery

**System ID:** AUTH-001

## MFA Methods (Foundation)

| Method | Status |
|--------|--------|
| Authenticator app (TOTP) | Foundation — enroll + verify |
| Recovery codes | Hashed at rest, shown once |
| Passkey | Schema-ready |
| Email / SMS fallback | Scaffold only — SMS not strongest |

## MFA Policy

| Role | Requirement |
|------|-------------|
| General user | Optional unless risk detected |
| Organization administrator | Required before production |
| Platform / security administrator | Required |
| Finance / restricted data | Required |

## Recovery Codes

- Generated at MFA enrollment
- Hashed at rest (`recovery_codes.json`)
- Displayed only at creation or regeneration
- Single-use, individually consumed
- Never logged

## Account Recovery Options

1. Verified email recovery
2. Existing trusted authentication provider
3. MFA recovery code
4. Administrator-assisted recovery (audit + notification + forced reauth)

## APIs

- `GET /api/auth/mfa` · `POST /api/auth/mfa/enroll` · `POST /api/auth/mfa/verify`
- `DELETE /api/auth/mfa/{methodId}`
- `POST /api/auth/recovery-codes/regenerate`
- `POST /api/account/recovery/request` · `POST /api/account/recovery/complete`

## Implementation

`src/lib/auth/mfa.ts` · `data/auth/mfa_methods.json` · `data/auth/recovery_codes.json`
