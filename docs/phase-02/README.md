# Phase 2 — Arkansas Organizing Registry

> **The Registry is not a list. It is the digital map of Arkansas.**  
> **Step 2.5:** The platform becomes an **operating system** — status-driven, not page-driven.

**Goal:** Build the canonical data foundation for the entire platform.  
**Status:** In progress · Steps 2.1–2.5 complete  
**Build Bible (closeout):** `PHASE_2_ARKANSAS_ORGANIZING_REGISTRY_BUILD_BIBLE.md` (Step 2.10)

---

## Core Concepts

| Concept | Meaning |
|---------|---------|
| **AOR** | Arkansas Organizing Registry — source of truth |
| **Knowledge graph** | Nodes + edges (relationships) |
| **Digital twin** | Living model of Arkansas organizing |
| **Status-driven** | UI and dashboards query status — not hard-coded pages |
| **Status timeline** | History of how entities got where they are |

**Doctrine:** [ARKANSAS_ORGANIZING_REGISTRY_DOCTRINE.md](ARKANSAS_ORGANIZING_REGISTRY_DOCTRINE.md)  
**Relationships:** [ARKANSAS_RELATIONSHIP_GRAPH.md](ARKANSAS_RELATIONSHIP_GRAPH.md)  
**Status:** [CANONICAL_STATUS_LIFECYCLE_FRAMEWORK.md](CANONICAL_STATUS_LIFECYCLE_FRAMEWORK.md)

---

## Step Sequence

| Step | Document | Status |
|------|----------|--------|
| 2.1 | [Registry Doctrine](ARKANSAS_ORGANIZING_REGISTRY_DOCTRINE.md) | ✅ |
| 2.2 | [County Registry Model](COUNTY_REGISTRY_MODEL.md) | ✅ |
| 2.3 | [Institution Registry Model](INSTITUTION_REGISTRY_MODEL.md) | ✅ |
| 2.4 | [Relationship Graph](ARKANSAS_RELATIONSHIP_GRAPH.md) | ✅ |
| 2.5 | [Status & Lifecycle Framework](CANONICAL_STATUS_LIFECYCLE_FRAMEWORK.md) | ✅ |
| 2.6 | Outreach Gap Dashboard Requirements | Pending |
| 2.7 | Campus Page Personalization Rules | Pending |
| 2.8 | Registry Data Source & Verification Protocol | Pending |
| 2.9 | Registry Seed Data Plan | Pending |
| 2.10 | Phase 2 Build Bible | Pending |

---

## Registry Artifacts

| File | Purpose |
|------|---------|
| `status-framework.json` | Lifecycles, categories, dashboard queries |
| `relationship-types.json` | Graph edge catalog |
| `schemas/*.json` | County, institution, relationship, status-transition |

---

*Requirements: STS-001 · Everything has a lifecycle.*
