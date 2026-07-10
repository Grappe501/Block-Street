# Build Log

> Chronological record of every build step. Newest entries at top.

---

## 2026-07-10 — PHASE-002.5 Status & Lifecycle Framework

**Document ID:** PHASE-002.5  
**Requirement IDs:** STS-M01–STS-M18, STS-001, AC-014  
**Artifact:** `docs/phase-02/CANONICAL_STATUS_LIFECYCLE_FRAMEWORK.md`

### What Was Built

- Platform elevated to **status-driven operating system**
- Universal categories: operational, verification, organizing, visibility, system
- Entity lifecycles: County, Institution, Participant (+ future Committee, Event, Project)
- **Status Timeline** architecture [STS-M16] — history, not just current state
- `data/registry/status-framework.json` — live catalog with dashboard queries

### Guiding Principle Locked

> Everything has a lifecycle.

### Key Shift

UI behavior from status queries: "Help Us Launch", "Looking for Organizers", outreach dashboard — **not hard-coded page logic**.

### Legacy Mapping

`needs_organizer` → `needs_outreach` · Code migration in Step 2.9

### ED-FD Handoff

| Item | Detail |
|------|--------|
| Built | CANONICAL_STATUS_LIFECYCLE_FRAMEWORK.md, status-framework.json, transition schema |
| Changed | Admin Registry, requirements registry (STS-001, DB-STATUS-TIMELINE) |
| Next | 2.6 Outreach Gap Dashboard Requirements |

---

## 2026-07-10 — PHASE-002.4 Arkansas Relationship Graph

**Document ID:** PHASE-002.4  
**Requirement IDs:** REL-M01–REL-M14, REL-001, AC-013  
**Artifact:** `docs/phase-02/ARKANSAS_RELATIONSHIP_GRAPH.md`

### What Was Built

- Registry elevated from database to **organizing intelligence system**
- **Digital twin** of Arkansas youth organizing ecosystem [REL-M03]
- Canonical relationship types: geographic, educational, organizing, network, civic
- `data/registry/relationship-types.json` — live type catalog
- `relationship-record.schema.json` — edge record schema
- V1 edges: contains, resides_in, attends, invited_by, connected_to

### Guiding Principle Locked

> Everything belongs somewhere. Everything connects to something.

### Key Shift

**Pages are views over the graph** — not the source of truth. Think network, not pages.

### ED-FD Handoff

| Item | Detail |
|------|--------|
| Built | ARKANSAS_RELATIONSHIP_GRAPH.md, relationship-types.json, edge schema |
| Changed | Phase 2 README, Admin Registry, requirements registry (REL-001, DB-RELATIONSHIPS) |
| Next | 2.5 Representation Status System |

---

## 2026-07-10 — PHASE-002.3 Institution Registry Model

**Document ID:** PHASE-002.3  
**Requirement IDs:** INST-M01–INST-M18, INST-003, AC-012  
**Artifact:** `docs/phase-02/INSTITUTION_REGISTRY_MODEL.md`

### What Was Built

- **Educational Institution Canonical Profile** — 8 standardized sections every campus page shares
- Institution as **digital home**, not directory entry
- **Knowledge graph** architecture [INST-M17] — belongs_to, has_students, hosts, contains, neighbors, etc.
- JSON Schema: `data/registry/schemas/institution-record.schema.json`
- Representation lifecycle stages (needs_outreach → thriving)

### Design Intent Locked

> Every campus page should feel like walking onto that campus — through respect, not copying.

> "This is my campus community."

### Not Yet Done (By Design)

- `institutions.json` migration to Canonical Profile → Step **2.9**
- Graph edges formalized → Step **2.4**

### ED-FD Handoff

| Item | Detail |
|------|--------|
| Built | INSTITUTION_REGISTRY_MODEL.md, institution JSON schema |
| Changed | Phase 2 README, Admin Registry, requirements registry |
| Next | 2.4 County-Institution Relationship Map |

---

## 2026-07-10 — PHASE-002.2 County Registry Model

**Document ID:** PHASE-002.2  
**Requirement IDs:** CNTY-M01–CNTY-M16, CNTY-002, AC-011  
**Artifact:** `docs/phase-02/COUNTY_REGISTRY_MODEL.md`

### What Was Built

- First real Registry **graph node** specification — county as digital organizing community
- Field model: identity, geography, demographics, organizing status
- Canonical vs operational separation [CNTY-M16]
- JSON Schema: `data/registry/schemas/county-record.schema.json`
- Graph edges: county **contains** institutions, participants, future entities

### Guiding Principle Locked

> Every Arkansas county has an organizing home.

### Not Yet Done (By Design)

- `counties.json` migration to full schema → Step **2.9** seed plan
- FIPS codes, regions, population for all 75 → Step 2.9

### Step 2.3 Preview (Steve)

Educational Institution **Canonical Profile** — standardized campus page sections (Identity, History, Academics, Student life, etc.) for consistency across institution types.

### ED-FD Handoff

| Item | Detail |
|------|--------|
| Built | COUNTY_REGISTRY_MODEL.md, county JSON schema |
| Changed | Phase 2 README, Admin Registry, requirements registry |
| Next | 2.3 Institution Registry Model |

---

## 2026-07-10 — PHASE-002.1 Refinement: Digital Map & Graph Model

**Enhancement to:** PHASE-002.1 Registry Doctrine  
**Requirement IDs:** REG-D16 (graph model), REG-D04 (One Arkansas)

### Key Concept Locked

> The Registry is not a list. It is the digital map of Arkansas.

### Architectural Decision [REG-D16]

Registry modeled as **graph of interconnected entities** — counties contain institutions, participants belong to communities, future committees/events link by typed relationships. Steps 2.2–2.4 define nodes and edges.

### ED-FD

| Item | Detail |
|------|--------|
| Built | Enhanced doctrine (21 requirements + REG-BG), graph model section |
| Changed | Admin Registry tab, phase-02 README, data/registry README |
| Next | 2.2 County Registry Model (graph node) |

---

## 2026-07-10 — PHASE-002.1 Registry Purpose & Authority

**Document ID:** PHASE-002.1  
**Requirement IDs:** REG-D01–REG-D15, REG-003, AC-010  
**Artifact:** `docs/phase-02/ARKANSAS_ORGANIZING_REGISTRY_DOCTRINE.md`

### What Was Built

- Registry authority doctrine — source of truth for counties, institutions, hubs, status, priority
- Phase 2 step sequence (2.1–2.10) indexed in `docs/phase-02/README.md`
- Admin **Registry** tab at `/admin`
- `data/registry/README.md` updated to reference doctrine

### Key Decisions [REG-D02]

Priority when data conflicts: approved registry record → Phase 2 models → DB → JSON seed → hardcoded (never preferred)

### Preliminary Implementation Note

75 counties and 23 institutions exist in JSON with minimal schema. Formal models pending Steps 2.2–2.3. No schema changes until models approved [ED-GR].

### ED-FD Handoff

| Item | Detail |
|------|--------|
| Built | PHASE-002.1 doctrine, Phase 2 README, Registry admin tab |
| Changed | build-progress Phase 2 steps restructured to design sequence |
| Deferred | Steps 2.2–2.10 model documents |
| Next | 2.2 County Registry Model |

---

## 2026-07-10 — PHASE-001.9 Master Traceability — Phase 1 Final

**Document ID:** PHASE-001.9  
**Requirement IDs:** TR-001–TR-MOTTO, AC-009  
**Status:** Phase 1 Constitution complete (9 steps) · Production code gate active

### What Was Built

- `docs/build-steps/PHASE-001.9-MASTER-TRACEABILITY.md` — universal traceability system
- `data/requirements-registry.json` — 11 seeded V1 requirements with full trace chains
- Admin **Traceability** tab at `/admin`
- Two-layer ID convention (constitutional + production)

### Production Code Gate [TR-MOTTO]

> If it cannot be traced, it should not be built.

**Critical pending:** USR-001 · NET-001 · NET-002 · NET-003 (Jul 12 minimum)

### Phase 1 Complete — Nine Foundational Documents

Identity · North Star · Principles · Boundaries · Organizing Model · Growth · Launch Success · Implementation Doctrine · Traceability

**Phase 2 begins:** Arkansas Organizing Registry — canonical data foundation.

### ED-FD Handoff

| Item | Detail |
|------|--------|
| Built | Step 1.9 doc, requirements registry, Traceability admin tab |
| Changed | BUILD-BIBLE (9 steps), ID convention, build-progress |
| Deferred | Full requirement catalog for Phase 2+ domains (EVT, COM, MSG) |
| Limitations | Registry seeded with V1-critical items; grows with Phase 2 |
| V2 rec | Auto-generate traceability matrix exports from registry |

---

## 2026-07-10 — PHASE-001.8 Implementation Doctrine — Phase 1 Complete

**Document ID:** PHASE-001.8 · BUILD-BIBLE  
**Requirement IDs:** ED-002–ED-FD, AC-008  
**Status:** Phase 1 Constitution closed · Phase 2 active

### What Was Built

- `docs/build-steps/PHASE-001.8-IMPLEMENTATION-DOCTRINE.md` — Burt's operating manual
- `docs/build-steps/BUILD-BIBLE.md` — authoritative index for Steps 1.1–1.8
- Admin **Engineering** tab at `/admin`
- Phase 1 marked complete in `build-progress.json`

### Phase 1 Summary

Eight canonical documents define identity, North Star, principles, boundaries, organizing model, growth strategy, launch success, and implementation doctrine.

**Phase 2 begins:** Arkansas Organizing Registry.

### ED-FD Handoff

| Item | Detail |
|------|--------|
| Built | Step 1.8 doc, Build Bible, Engineering admin tab |
| Changed | build-progress, README, ID convention, PROJECT_CONSTITUTION header |
| Deferred | Phase 1.9 traceability matrix (Steve recommendation) |
| Limitations | Traceability IDs not yet formalized beyond existing convention |
| V2 rec | Implement Phase 1.9 before deep Phase 2 if Steve approves |

---

## 2026-07-10 — PHASE-001.7 Launch Success Definition

**Document ID:** PHASE-001.7  
**Requirement IDs:** LS-P1–P7, LS-CHK, AC-007  
**Launch checklist:** 2/10 done · NOT launch ready · Jul 12 minimum: items 3–6

---

**PHASE-001.6 Growth Model** closes Phase 1.

Six canonical documents define why ASYON exists, what it stands for, how it organizes people, what boundaries it respects, and how it evolves.

**Phase 2 begins:** Arkansas Organizing Registry.

---

**Document ID:** PHASE-001.5  
**Requirement IDs:** OM-001 through OM-010, OM-L1–L5, AC-005  
**Status:** Complete — Canonical — Database Foundation

### Key Insight

Most platforms organize around **organizations**. ASYON organizes around **people**. Communities are built from individuals.

### Constitutional Layer Complete

Steps 1.1–1.5 complete the constitutional layer. Next: PHASE-001.6 Growth Model (V1 roadmap).

---

**Document ID:** PHASE-001.4  
**Requirement IDs:** DG-001 through DG-015, BG-001, ED-001, AC-004  
**Status:** Complete — Canonical — Mandatory Guardrails

### Standing Engineering Doctrine [ED-001]

> Design First · Build Second · Validate Third · Iterate Fourth

### Deliverables

- `docs/build-steps/PHASE-001.4-PLATFORM-BOUNDARIES.md` — 15 boundaries + conflict protocol
- DG, BG, ED categories in ID convention
- Admin dashboard: new **Guardrails** tab at `/admin`
- Conflict resolution: redesign or constitutional change — never silent drift

### Next Step

PHASE-001.5 — Organizing Model

---

**Document ID:** PHASE-001.3  
**Requirement IDs:** CP-001 through CP-015, CT-001, AC-003  
**Status:** Complete — Canonical — Immutable Doctrine

### Deliverables

- `docs/build-steps/PHASE-001.3-CORE-PRINCIPLES.md` — 15 principles + constitutional test
- CP and CT categories added to ID convention
- Admin dashboard: new **Constitution** tab at `/admin`
- Change protocol documented — principles require user approval to modify

### Next Step

PHASE-001.4 — Platform Boundaries (Design Guardrails)

---

**Document ID:** PHASE-001.2  
**Requirement IDs:** NS-001 through NS-014, AC-002  
**Status:** Complete — Canonical

### The One Question

> Does this help us reach the North Star? If no — it doesn't belong in V1.

### Deliverables

- `docs/build-steps/PHASE-001.2-NORTH-STAR-OUTCOME.md`
- Five North Star Questions [NS-013] as feature filter
- Admin dashboard: new **North Star** tab at `/admin`
- NS category added to ID convention

### Next Step

PHASE-001.3 — Core Principles (immutable doctrine, 10–15 principles)

---

**Document ID:** PHASE-001.1  
**Requirement IDs:** PI-001 through ER-001, AC-001  
**Status:** Complete — Canonical

### Deliverables

- `docs/build-steps/PHASE-001.1-PLATFORM-IDENTITY.md` — first document Burt reads
- `docs/build-steps/00-ID-CONVENTION.md` — requirement ID naming system
- `docs/build-steps/README.md` — Burt start-here index
- Platform working name: **ASYON** (final branding TBD)
- Motto: *Connect Locally. Organize Statewide. Lead Together.*
- Site updated to configurable `PLATFORM` object in `src/lib/data.ts`

### Next Step

PHASE-001.2 — North Star Outcome

---

**Commit:** Gather Arkansas rebrand + constitution  
**Phase:** 1 — Project Constitution & Mission Doctrine  
**Deploy:** https://block-street.netlify.app/

### What Was Built

- **Platform name:** Gather Arkansas (neutral, nonpartisan)
- **Constitution:** `docs/PROJECT_CONSTITUTION_AND_MISSION_DOCTRINE.md` — Burt reads this first
- **Master build sequence:** `docs/master/MASTER-BUILD-SEQUENCE.md` (30 modules)
- **Phase 1 design:** `docs/phases/PHASE-01-CONSTITUTION.md` (9 steps, all complete)
- **Leadership council removed** — all schools equal standing
- **Arkansas Organizing Registry:** 75 counties + 23 colleges/universities
- **New pages:** `/map`, `/schools`, `/schools/[slug]` with personalized color-inspired design
- **County-first signup:** honor system, county → school OR county-only for non-students 16-24
- **WHY call-to-action:** Golden Circle teaching on homepage
- **Netlify live:** block-street.netlify.app

### Key Decisions Locked

- Honor system affiliation (county → school)
- No privileged campuses or founding council
- Collective voice + voting block power (student-determined)
- Election: November 3, 2026 | Launch call: July 14 | Leader test: July 12

### Next Steps

1. Phase 2: Complete registry (SVG map, remaining schools)
2. Phase 3: Signup + share link + QR + network board (Jul 12-14)
3. Connect Netlify DB

---

**Commit:** Initial project scaffold  
**Phase:** 1 — Mission + Structure  
**Deploy:** Pending first GitHub push → Netlify

### What Was Built

- Complete documentation system (`docs/`)
  - Mission, principles, north star, audience paths
  - Architecture: overview, data model, organizing philosophy, network tree, nonpartisan rules
  - 6 build phases documented with step checklists
  - Version roadmap (v1.1–v1.8)
  - Founding council + 75 counties reference
- Data files (`data/`)
  - `build-progress.json` — powers admin dashboard
  - `campuses.json` — founding council seed data
  - `counties.json` — all 75 Arkansas counties
- Next.js 15 application scaffold
  - Public home page (mission v0)
  - Join page stub (campus vs county paths)
  - Campus hub pages (dynamic)
  - County hub pages (dynamic)
  - Admin Director Workbench with tabs
- H: drive only configuration (`.npmrc`)
- Netlify deployment config (`netlify.toml`)
- GitHub repository initialized

### Next Steps

1. Push to GitHub
2. User connects Netlify
3. Begin Phase 2 — Netlify DB connection
4. Complete Phase 3 public pages (council, FAQ, contact)

---

## Template for Future Entries

```
## YYYY-MM-DD — [Title]

**Commit:** [hash/message]
**Phase:** [N] — [Name]
**Deploy:** [Netlify URL or status]

### What Was Built
- ...

### Next Steps
- ...
```
