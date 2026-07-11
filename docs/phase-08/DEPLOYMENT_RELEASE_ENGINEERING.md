# Build 8.6 — Deployment, Release Engineering, and CI/CD

**Document ID:** BUILD-008.6 · **DPL-001**  
**Status:** Canonical · **Phase:** 8

> How does a change move safely from a developer's machine into production, and how can the platform verify, observe, reverse, and explain that change?

**Builds on:** [API-001](../phase-08/UNIFIED_API_AND_INTEGRATION_LAYER.md) · [ADM-001](../phase-08/ADMINISTRATION_PLATFORM.md)  
**Live spec:** `data/registry/deployment-platform.json` · **API:** `/api/v1/deployments`, `/api/admin/deployments`

---

## Governing Principle

> No production release should depend on memory, improvisation, or hope.

---

## Core Outcomes

Environment model · CI pipeline · preview/staging · release candidates · approval gates · release manifests · migration governance · secrets · smoke tests · rollback · hotfixes · deployment audit

---

## Environments

Local · Test · Preview · Staging · Production — each isolated with separate secrets, credentials, and data boundaries.

**Netlify:** `netlify.toml` · production branch `main` · https://block-street.netlify.app/

**Acceptance:** `AC-183`

---

## Related Documentation

`docs/platform/deployment/` — architecture, environments, CI, preview, staging, production release, migrations, secrets, smoke tests, rollback, hotfix, Netlify standard, test plan
