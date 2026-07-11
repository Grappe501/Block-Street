# Build 8.1 — Authentication and Identity

**Document ID:** BUILD-008.1 · **AUTH-001**  
**Artifact:** `AUTHENTICATION_AND_IDENTITY.md`  
**Status:** Canonical  
**Phase:** 8 — Platform Services

> Who is the user?

**Builds on:** [ENG-006](../volume-01/AUTHORIZATION_ARCHITECTURE.md) · [PRE-001](../volume-01/PERMISSION_RESOLUTION_ENGINE.md) · [KDG-M16](../phase-03/KNOWLEDGE_DATA_GOVERNANCE.md)  
**Live spec:** `data/registry/authentication-identity.json` · **API:** `/api/auth`

---

## Purpose

**[AUTH-M01]** Replace honor-system V1 with production-grade identity and authentication supporting individuals, organizations, institutions, and multiple workspace memberships.

**[AUTH-M01a]** Identity is separate from organizational roles. A person is not permanently defined as administrator, volunteer, or executive — those are contextual assignments.

---

## Canonical User Identity

**[AUTH-M02]** `user_id` · `primary_email` · `verified_emails` · `display_name` · `authentication_methods` · `account_status` · `security_state` · `identity_assurance_level`

---

## Membership Model

**[AUTH-M03]** User → Organization Membership → Workspace Membership → Role Assignment → Permission Grants

---

## Session Management

**[AUTH-M04]** View active sessions · revoke sessions · login alerts · reauthentication for sensitive actions · configurable expiry

---

## Account Lifecycle

**[AUTH-M05]** Invited → Pending Verification → Active → Restricted → Suspended → Archived → Deleted/Anonymized. Every transition governed and logged.

---

## Authentication Methods (Roadmap)

**[AUTH-M06]** V1: email/password · session tokens. Roadmap: OAuth (Google, Microsoft), MFA, passwordless links, SSO.

---

## APIs

**[AUTH-M07]** `POST /api/auth/login` · `/logout` · `GET /api/auth/session` · `/me` · `/sessions` · `DELETE /api/auth/sessions/{id}`

---

## Acceptance Criteria

**[AUTH-M08]** Build 8.1 is complete when:

- Honor-system access removed from protected areas
- Users authenticate through secure verified identity flows
- Sessions securely managed and revocable
- MFA scaffolding available for elevated roles
- Identity separated from role and organization membership
- Account lifecycle events auditable
- Protected routes cannot be reached through client-side bypasses

**Acceptance:** `AC-178`
