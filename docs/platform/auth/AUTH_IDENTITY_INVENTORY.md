# AUTH Identity Inventory — Build 8.1.1

**System ID:** AUTH-001 · **Deliverable:** 8.1.1

## Existing User Models

| Location | Model | Notes |
|----------|-------|-------|
| `data/auth/users.json` | `User` | Bootstrap canonical users (`usr-001`, `usr-002`) |
| `src/lib/auth/types.ts` | `User`, `Membership`, `Session` | V1 types — expanded in 8.1 |
| `docs/phase-03/PARTICIPANT_PROFILE_SYSTEM.md` | Participant profile | Honor-system county/campus — separate from platform auth |
| `data/registry/personal-headquarters.json` | `honorSystem: true` | PHQ still uses honor affiliation at V1 |

## Honor-System Entry Points (Pre-8.1)

| Surface | Mechanism | Migration |
|---------|-----------|-----------|
| `/admin` | Local identity selector / assumed director | **Replaced** — session cookie via middleware |
| Protected `/api/*` | No server auth | **Replaced** — middleware + `assertAuthenticated()` |
| `/join` signup | County-first honor affiliation | Remains public; links to auth onboarding |
| PHQ / participant profiles | Honor county/campus | Mapped via `legacy_claimed_attribution` — not auto-verified |

## Route Protection (Current)

| Category | Routes | Enforcement |
|----------|--------|-------------|
| Public | `/`, `/join`, `/login`, `/register`, auth flows | None |
| Authenticated | `/admin/*` (except login) | `middleware.ts` — `cos_session` cookie |
| API protected | `/api/*` except public auth prefixes | Middleware cookie check + handler `assertAuthenticated()` |
| Membership required | Workspace context APIs | `resolveActiveContext()` in engine |

## Provider Integrations

| Provider | Status | Config |
|----------|--------|--------|
| Email/password | **Live** | `AUTH_BOOTSTRAP_PASSWORD` env |
| Passwordless email | **Scaffold** | `data/auth/passwordless_tokens.json` |
| Google OAuth | **Scaffold** | `AUTH_GOOGLE_ENABLED` flag |
| Microsoft OAuth | **Planned** | `AUTH_MICROSOFT_ENABLED` flag |
| MFA (TOTP) | **Foundation** | `data/auth/mfa_methods.json` |
| SSO / Passkeys | **Schema-ready** | Future builds |

## Administrative Bypasses

- Honor-system admin selector: **removed** from protected routes
- `AUTH_HONOR_SYSTEM_DISABLED` feature flag: default `true` in production config

## Audit Logs

| Store | Format |
|-------|--------|
| `data/auth/audit_events.jsonl` | Append-only authentication audit events |

## Migration Attribution States

- `verified_user` — mapped canonical user
- `legacy_claimed` — honor-system claim, not verified
- `system_migration` — created during migration
- `unknown_legacy` — cannot safely attribute
