# Build 8.2 — Administration Platform

**Document ID:** BUILD-008.2 · **ADM-001**  
**Artifact:** `ADMINISTRATION_PLATFORM.md`  
**Status:** Canonical · **Phase:** 8 — Platform Services

> Who is authorized to govern the platform, what may they control, and how is every action visible, limited, and reversible?

**Builds on:** [AUTH-001](../phase-08/AUTHENTICATION_AND_IDENTITY.md) · [ENG-006](../../volume-01/AUTHORIZATION_ARCHITECTURE.md) · [PRE-001](../../volume-01/PERMISSION_RESOLUTION_ENGINE.md)  
**Live spec:** `data/registry/administration-platform.json` · **API:** `/api/admin`  
**Platform docs:** `docs/platform/admin/`

---

## Governing Principle

> Administrative authority must always be scoped, attributable, reviewable, and reversible.

---

## Core Outcomes

1. Unified Administration Center
2. Administrative role hierarchy with scope
3. Role and permission management
4. Organization and workspace administration
5. User and membership administration
6. Policy and configuration foundation
7. Feature-flag administration
8. Integration administration scaffold
9. Approval workflows for high-risk actions
10. Administrative audit explorer
11. Attention queue and operational health
12. Support and emergency-access governance scaffold

---

## Administrative Context

Resolved server-side on every `/api/admin` request:

`user_id` · `session_id` · `organization_id` · `workspace_id` · `administrative_role_ids` · `effective_permissions` · `authentication_strength` · `elevation_state`

---

## API Surface

`GET /api/admin/overview` · `/attention` · `/health` · `/users` · `/organizations` · `/workspaces` · `/roles` · `/permissions` · `/policies` · `/feature-flags` · `/integrations` · `/approvals` · `/audit` · `/jobs` · `/incidents`

---

## Definition of Done

- Unified Administration Center governs platform, organization, and workspace administration
- Administrative access requires AUTH-001 authentication
- Every role has explicit permissions and scope
- Organization administrators cannot access other organizations
- High-risk actions require MFA elevation scaffold and approval workflow
- Consequential actions generate append-only audit events
- Role preview and permission simulation available

**Acceptance:** `AC-179`

---

## Related Documentation

| Document | Path |
|----------|------|
| Architecture | `docs/platform/admin/ADMINISTRATION_ARCHITECTURE.md` |
| Role Catalog | `docs/platform/admin/ADMIN_ROLE_CATALOG.md` |
| Permission Registry | `docs/platform/admin/ADMIN_PERMISSION_REGISTRY.md` |
| Scope Model | `docs/platform/admin/ADMIN_SCOPE_MODEL.md` |
| Inventory | `docs/platform/admin/ADMINISTRATION_CAPABILITY_INVENTORY.md` |
| Legacy Migration | `docs/platform/admin/LEGACY_WORKBENCH_MIGRATION_PLAN.md` |
