# Phase 2 — Arkansas Organizing Registry

> **The Registry is not a list. It is the digital map of Arkansas.**  
> If something doesn't exist in the Registry, it doesn't exist in the platform.

**Goal:** Build the canonical data foundation for the entire platform.  
**Status:** In progress · Step 2.1 complete  
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
| 2.2 | County Registry Model (graph node) | Pending |
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
| `data/registry/counties.json` | 75 counties — formal node model in 2.2 |
| `data/registry/institutions.json` | 23 institutions — formal node model in 2.3 |
| Relationship graph | Formalized in 2.4 |

---

## Burt's Rule

**Ask the Registry first.** No production schema changes until Steps 2.2–2.4 approved.

---

*Requirements: REG-001, REG-002, REG-003 · Principles: CP-006, OM-L3, OM-L4, LS-P1, LS-P2*
