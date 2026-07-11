# Build 8.3 — CMS and Content Services

**Document ID:** BUILD-008.3 · **CMS-001**  
**Status:** Canonical · **Phase:** 8

> What information does the platform present, who controls it, and how do we know it is current, approved, and appropriate?

**Builds on:** [ADM-001](../phase-08/ADMINISTRATION_PLATFORM.md) · [AUTH-001](../phase-08/AUTHENTICATION_AND_IDENTITY.md) · [SIS-001](../phase-07/STATEWIDE_INTELLIGENCE_SEARCH.md)  
**Live spec:** `data/registry/content-services.json` · **API:** `/api/content`, `/api/cms`

---

## Governing Principle

> Content should be created once, governed clearly, published intentionally, and reused safely.

---

## Core Outcomes

Canonical content model · versioned repository · editorial workflows · media library · audience/scope controls · search integration · API delivery · AI assistance scaffold

---

## APIs

**Delivery:** `GET /api/content` · `/api/content/{id}` · `/api/content/slug/{slug}` · `/types` · `/search`  
**Authoring:** `POST /api/cms/content` · `PATCH` · `/versions` · `/submit-review` · `/approve` · `/publish` · `/schedule` · `/archive`  
**Media:** `GET/POST /api/cms/media` · **Taxonomy:** `GET /api/cms/taxonomies`

**Acceptance:** `AC-180`

---

## Related Documentation

`docs/platform/cms/` — architecture, content model, workflows, publication, media, accessibility, localization, AI policy, migration, security, test plan
