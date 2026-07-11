# Build 8.5 — Unified API and Integration Layer

**Document ID:** BUILD-008.5 · **API-001**  
**Status:** Canonical · **Phase:** 8

> How do users, applications, services, integrations, and AI tools interact with the platform safely, consistently, and predictably?

**Builds on:** [NTF-001](../phase-08/NOTIFICATION_AND_MESSAGING_SERVICES.md) · [CMS-001](../phase-08/CMS_AND_CONTENT_SERVICES.md) · [AUTH-001](../phase-08/AUTHENTICATION_AND_IDENTITY.md)  
**Live spec:** `data/registry/unified-api-layer.json` · **API:** `/api/v1`, `/api/admin/api`

---

## Governing Principle

> Every platform capability should be exposed through a clear contract, and every contract should enforce identity, permission, validation, traceability, and failure safety.

---

## Core Outcomes

Unified gateway · v1 standards · request context · auth/authz enforcement · validation · standard errors · pagination · idempotency · rate limiting · webhooks · API credentials · public APIs · AI tool governance · OpenAPI · telemetry

---

## APIs

**Gateway:** `GET /api/v1/health` · `/api/v1/identity/me` · `/api/v1/public/content` · `/api/v1/missions` · `/api/v1/notifications` · `/api/v1/search`  
**Admin:** `GET /api/admin/api/overview` · `/clients` · `/credentials` · `/webhooks` · `/deprecations` · `/telemetry`

**Acceptance:** `AC-182`

---

## Related Documentation

`docs/platform/api/` — architecture, design standard, versioning, errors, auth, authorization, rate limits, idempotency, file upload, bulk ops, webhooks, credentials, AI tools, deprecation, migration, test plan, incident runbook
