# Phase 2 — Arkansas Organizing Registry

> **The Registry is not a list. It is the digital map of Arkansas.**  
> If something doesn't exist in the Registry, it doesn't exist in the platform.

**Goal:** Build the canonical data foundation for the entire platform.  
**Status:** In progress · Steps 2.1–2.2 complete  
**Build Bible (closeout):** `PHASE_2_ARKANSAS_ORGANIZING_REGISTRY_BUILD_BIBLE.md` (Step 2.10)

---

## Core Concepts

| Concept | Meaning |
|---------|---------|
| **AOR** | Arkansas Organizing Registry — source of truth |
| **Graph model** | Counties contain institutions; entities link by typed relationships |
| **Canonical data** | What exists (Registry) |
| **Operational data** | What people do (references Registry) |
| **One Arkansas** | One Registry. One Source of Truth. |

**Doctrine:** [ARKANSAS_ORGANIZING_REGISTRY_DOCTRINE.md](ARKANSAS_ORGANIZING_REGISTRY_DOCTRINE.md)

---

## Step Sequence

| Step | Document | Status |
|------|----------|--------|
| 2.1 | [Registry Doctrine](ARKANSAS_ORGANIZING_REGISTRY_DOCTRINE.md) | ✅ |
| 2.2 | [County Registry Model](COUNTY_REGISTRY_MODEL.md) | ✅ |
| 2.3 | Institution Registry Model (graph node) | Pending |
| 2.4 | County-Institution Relationship Map (graph edges) | Pending |
| 2.5 | Representation Status System | Pending |
| 2.6 | Outreach Gap Dashboard Requirements | Pending |
| 2.7 | Campus Page Personalization Rules | Pending |
| 2.8 | Registry Data Source & Verification Protocol | Pending |
| 2.9 | Registry Seed Data Plan | Pending |
| 2.10 | Phase 2 Build Bible | Pending |

---

## Live Data (Preliminary)

| File | Status |
|------|--------|
| `data/registry/counties.json` | 75 counties — minimal bootstrap; full schema in [COUNTY_REGISTRY_MODEL.md](COUNTY_REGISTRY_MODEL.md) · migrate in 2.9 |
| `data/registry/schemas/county-record.schema.json` | JSON Schema for county graph node |
| `data/registry/institutions.json` | 23 institutions — formal node model in 2.3 |
| Relationship graph | Formalized in 2.4 |

---

## Burt's Rule

**Ask the Registry first.** County model approved (2.2). Institution model pending (2.3). Seed migration in 2.9.

---

*Requirements: REG-001, CNTY-002, REG-003 · Step 2.3 preview: Educational Institution Canonical Profile*
