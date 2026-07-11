# Build 8.1 — Authentication and Identity Foundation

**Document ID:** BUILD-008.1 · **AUTH-001**  
**Artifact:** `AUTHENTICATION_AND_IDENTITY.md`  
**Status:** Canonical  
**Phase:** 8 — Platform Services

> Who is attempting to enter? Who is this person? What context are they in?

**Builds on:** [ENG-006](../volume-01/AUTHORIZATION_ARCHITECTURE.md) · [PRE-001](../volume-01/PERMISSION_RESOLUTION_ENGINE.md) · [KDG-M16](../phase-03/KNOWLEDGE_DATA_GOVERNANCE.md)  
**Live spec:** `data/registry/authentication-identity.json` · **API:** `/api/auth`, `/api/identity`, `/api/invitations`  
**Platform docs:** `docs/platform/auth/`

---

## Governing Principle

> Identity is permanent enough to establish continuity, but access is always contextual, limited, revocable, and auditable.

---

## Core Outcomes

1. Canonical user identity (`PlatformUser`)
2. Secure authentication (email/password, passwordless scaffold, OAuth scaffold)
3. Verified login methods (`AuthenticationIdentity`)
4. Session management (`UserSession`)
5. Organization and workspace membership
6. Invitation and onboarding flows
7. Account lifecycle management
8. MFA readiness
9. Identity recovery foundation
10. Authentication auditing
11. Protected route enforcement
12. Future SSO and passkey compatibility

---

## Five Layers

| Layer | Question |
|-------|----------|
| Person | Who is interacting? |
| Authentication Method | How do they prove identity? |
| Canonical Identity | What is their durable platform record? |
| Membership | Where do they belong? |
| Access Policy | What may they do? (Builds 8.2, 8.8) |

---

## APIs

### Authentication

`POST /api/auth/register` · `/login` · `/logout` · `/logout-all` · `/passwordless/request` · `/passwordless/verify` · `/password/reset-request` · `/password/reset` · `GET /session` · `/sessions` · `DELETE /sessions/{id}` · `/providers` · `/mfa` · `/recovery-codes/regenerate` · `/security-events`

### Identity & Membership

`GET/PATCH /api/identity/me` · `/memberships` · `POST /context` · `/api/invitations` · `/invitations/{token}` · `/accept` · `/revoke`

---

## UI Surfaces

`/login` · `/register` · `/passwordless` · `/forgot-password` · `/reset-password` · `/mfa/setup` · `/mfa/challenge` · `/invitations/accept` · `/onboarding` · `/account/security` · `/select-organization` · `/select-workspace` · `/access-denied`

---

## Definition of Done

- Every protected route requires server-verified session
- Honor-system disabled for protected access (`AUTH_HONOR_SYSTEM_DISABLED`)
- One canonical identity per person with provider linking
- Multi-org/workspace membership with validated active context
- Secure invitations create or attach memberships
- Revocable sessions visible to users
- MFA foundation for elevated roles
- Governed account recovery scaffold
- Privacy-safe audit events
- Suspended users lose access immediately

**Acceptance:** `AC-178`

---

## Related Documentation

| Document | Path |
|----------|------|
| Architecture | `docs/platform/auth/AUTHENTICATION_ARCHITECTURE.md` |
| Identity Model | `docs/platform/auth/CANONICAL_IDENTITY_MODEL.md` |
| Sessions | `docs/platform/auth/SESSION_MANAGEMENT_POLICY.md` |
| Lifecycle | `docs/platform/auth/ACCOUNT_LIFECYCLE_POLICY.md` |
| Invitations | `docs/platform/auth/INVITATION_AND_ONBOARDING_FLOW.md` |
| MFA & Recovery | `docs/platform/auth/MFA_AND_ACCOUNT_RECOVERY.md` |
| Providers | `docs/platform/auth/AUTH_PROVIDER_CONFIGURATION.md` |
| Migration | `docs/platform/auth/HONOR_SYSTEM_MIGRATION_PLAN.md` |
| Test Plan | `docs/platform/auth/AUTHENTICATION_TEST_PLAN.md` |
| Incident Runbook | `docs/platform/auth/AUTHENTICATION_INCIDENT_RUNBOOK.md` |
| Inventory | `docs/platform/auth/AUTH_IDENTITY_INVENTORY.md` |
| Data Model | `docs/platform/auth/AUTH_CANONICAL_DATA_MODEL.md` |
