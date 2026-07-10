# Phase 2 — Arkansas Organizing Registry

> **The Registry is not a list. It is the digital map of Arkansas.**  
> **Step 2.4:** The Registry becomes an **organizing intelligence system** — a digital twin connected by relationships.

**Goal:** Build the canonical data foundation for the entire platform.  
**Status:** In progress · Steps 2.1–2.4 complete  
**Build Bible (closeout):** `PHASE_2_ARKANSAS_ORGANIZING_REGISTRY_BUILD_BIBLE.md` (Step 2.10)

---

## Core Concepts

| Concept | Meaning |
|---------|---------|
| **AOR** | Arkansas Organizing Registry — source of truth |
| **Knowledge graph** | Nodes (entities) + edges (relationships) |
| **Digital twin** | Living model of Arkansas youth organizing |
| **Pages are views** | UI renders graph queries — not the source of truth |
| **One Arkansas** | One Registry. One Source of Truth. |

**Doctrine:** [ARKANSAS_ORGANIZING_REGISTRY_DOCTRINE.md](ARKANSAS_ORGANIZING_REGISTRY_DOCTRINE.md)  
**Relationships:** [ARKANSAS_RELATIONSHIP_GRAPH.md](ARKANSAS_RELATIONSHIP_GRAPH.md)

---

## Step Sequence

| Step | Document | Status |
|------|----------|--------|
| 2.1 | [Registry Doctrine](ARKANSAS_ORGANIZING_REGISTRY_DOCTRINE.md) | ✅ |
| 2.2 | [County Registry Model](COUNTY_REGISTRY_MODEL.md) | ✅ |
| 2.3 | [Institution Registry Model](INSTITUTION_REGISTRY_MODEL.md) | ✅ |
| 2.4 | [Relationship Graph](ARKANSAS_RELATIONSHIP_GRAPH.md) | ✅ |
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
| `data/registry/counties.json` | 75 county nodes — migrate in 2.9 |
| `data/registry/institutions.json` | 23 institution nodes — migrate in 2.9 |
| `data/registry/relationship-types.json` | Canonical relationship type catalog |
| `data/registry/schemas/*.json` | JSON Schemas for county, institution, relationship |

---

## V1 Graph Edges

```
County contains Institution
Participant resides_in County
Participant attends Institution
Participant invited_by Participant
Participant connected_to Participant
```

**Ask the Registry first.** Relationship edges materialized in Step **2.9** seed plan.

---

*Requirements: REL-001 · Principles: REL-M02, CP-008, OM-L2*
