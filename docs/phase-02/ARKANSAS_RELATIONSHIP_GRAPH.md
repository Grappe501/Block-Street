# Arkansas Relationship Graph & Geographic Intelligence Model

**Document ID:** PHASE-002.4  
**Artifact:** `ARKANSAS_RELATIONSHIP_GRAPH.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 2 — Arkansas Organizing Registry

> **This is where the Registry stops being a database and becomes an organizing intelligence system.**  
> This document is not about counties and schools — it is about **relationships**.

**Think in terms of a living network, not pages.**

**Builds On:** [PHASE-002.1 Registry Doctrine](ARKANSAS_ORGANIZING_REGISTRY_DOCTRINE.md) · [PHASE-002.2 County Model](COUNTY_REGISTRY_MODEL.md) · [PHASE-002.3 Institution Model](INSTITUTION_REGISTRY_MODEL.md) · [OM-L2](../build-steps/PHASE-001.5-ORGANIZING-MODEL.md) · [CP-008](../build-steps/PHASE-001.3-CORE-PRINCIPLES.md)

**Live catalog:** `data/registry/relationship-types.json` · **Schema:** `data/registry/schemas/relationship-record.schema.json`

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| REL-M01 | Purpose |
| REL-M02 | Guiding principle |
| REL-M03 | Digital twin of Arkansas |
| REL-M04 | Arkansas organizing graph |
| REL-M05 | Canonical relationship types |
| REL-M06 | Relationship record rules |
| REL-M07 | Geographic intelligence |
| REL-M08 | Educational intelligence |
| REL-M09 | Organizing intelligence |
| REL-M10 | Personal network intelligence |
| REL-M11 | Discovery engine |
| REL-M12 | Graph principles |
| REL-M13 | V1 relationship scope |
| REL-M14 | Entity vs relationship separation |
| REL-BG | Burt implementation guidance |
| AC-013 | Step 2.4 acceptance criteria |

---

## REL-M01 — Purpose

**[REL-M01]** This document defines the canonical **relationship model** connecting every entity within the Arkansas Student & Youth Organizing Network.

**[REL-M01a]** The Registry is not a collection of independent records — it is a **connected graph** describing how every person, place, institution, organization, project, event, and community relates to every other entity.

**[REL-M01b]** Every future capability should **leverage these relationships** rather than creating isolated data.

**[REL-M01c]** This relationship model will power almost every future feature: search, maps, outreach gaps, discovery, analytics, recommendations, and AI assistance.

*Supersedes narrow "county-institution map" — full graph architecture.*

---

## REL-M02 — Guiding Principle

**[REL-M02]**

> **Everything belongs somewhere. Everything connects to something.**

**[REL-M02a]** No Registry entity should exist without context.

**[REL-M02b]** **Relationships are first-class citizens** within the platform — as important as entities themselves [REL-M12].

**[REL-M02c]** One of the biggest mistakes: thinking in terms of **pages** instead of **connections**.

---

## REL-M03 — Digital Twin of Arkansas

**[REL-M03]** Treat the platform not as a website alone, but as a **digital twin of Arkansas's youth organizing ecosystem**.

| Represented in the model | Node type |
|--------------------------|-----------|
| Every county | `County` |
| Every educational institution | `Institution` |
| Every participant | `Participant` |
| Every relationship | `Relationship` (edge) |
| Every event, committee, project | Future nodes |

**[REL-M03a]** The software maintains a **living, evolving model** of the organizing network — not just displaying information.

**[REL-M03b]** This perspective supports analytics, search, recommendations, AI, planning, and long-term continuity while remaining grounded in Phase 1 constitutional principles.

**[REL-M03c]** Pages are **views** over the graph — not the source of truth.

---

## REL-M04 — The Arkansas Organizing Graph

**[REL-M04]** Every entity is a **node**. Relationships connect nodes.

```
Arkansas (State)
│
├── County
│      │
│      ├── Educational Institution
│      │        │
│      │        ├── Participant
│      │        ├── Committee      (future)
│      │        ├── Event           (future)
│      │        └── Project         (future)
│      │
│      └── County Youth Hub
│               │
│               ├── Participant
│               ├── Committee       (future)
│               ├── Event           (future)
│               └── Project         (future)
│
└── Statewide Communities         (future)
```

**[REL-M04a]** The software **understands relationships** rather than simply displaying pages.

**[REL-M04b]** V1 critical path: `State → County → Institution → Participant`

---

## REL-M05 — Canonical Relationship Types

**[REL-M05]** Relationships are **explicit and typed**. Full catalog in `relationship-types.json`.

### Geographic

| Type | Source | → | Destination | V1 |
|------|--------|---|-------------|-----|
| `contains` | Arkansas | → | County | Implicit |
| `contains` | County | → | Institution | ✅ |
| `located_in` | Institution | → | County | ✅ |
| `resides_in` | Participant | → | County | ✅ |
| `adjacent_to` | County | ↔ | County | Future |

### Educational

| Type | Source | → | Destination | V1 |
|------|--------|---|-------------|-----|
| `attends` | Participant | → | Institution | ✅ |
| `belongs_to` | Institution | → | County | ✅ |
| `graduated_from` | Participant | → | Institution | Future |

### Organizing

| Type | Source | → | Destination | V1 |
|------|--------|---|-------------|-----|
| `invited` | Participant | → | Participant | ✅ |
| `invited_by` | Participant | → | Participant | ✅ |
| `belongs_to` | Participant | → | Committee | Future |
| `organized` | Participant | → | Event | Future |
| `volunteered_for` | Participant | → | Project | Future |

### Network

| Type | Source | → | Destination | V1 |
|------|--------|---|-------------|-----|
| `connected_to` | Participant | ↔ | Participant | ✅ |
| `mentors` | Participant | → | Participant | Future |
| `member_of` | Participant | → | Community | Future |

### Civic

| Type | Source | → | Destination | V1 |
|------|--------|---|-------------|-----|
| `serves` | Project | → | County | Future |
| `operates_in` | Committee | → | Institution | Future |
| `operates_in` | Committee | → | County | Future |
| `occurs_in` | Event | → | County | Future |
| `occurs_at` | Event | → | Institution | Future |

**[REL-M05a]** `located_in` and `belongs_to` (Institution→County) are **inverse views** of County `contains` Institution — store once, query both directions.

**[REL-M05b]** Future versions may introduce additional types without breaking existing edges.

---

## REL-M06 — Relationship Record Rules

**[REL-M06]** Every relationship record includes:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Permanent relationship ID (e.g. `REL-001234`) |
| `type` | enum | Canonical type from catalog |
| `sourceEntityId` | string | Source node ID (e.g. `CNTY-pulaski`) |
| `sourceEntityType` | enum | `County` · `Institution` · `Participant` · etc. |
| `destinationEntityId` | string | Destination node ID |
| `destinationEntityType` | enum | Target node type |
| `createdAt` | ISO datetime | When relationship established |
| `status` | enum | `active` · `inactive` · `archived` |
| `metadata` | object | Future: role, weight, effective dates |

**[REL-M06a]** Relationships are **permanent historical records** unless intentionally removed — preserve referral and organizing history [REG-D14].

**[REL-M06b]** Many-to-many relationships are **normalized** — never duplicated as embedded arrays in entity records alone.

**[REL-M06c]** Denormalized fields (e.g. `institution.county` slug) are **cache** for performance — graph is authoritative.

---

## REL-M07 — Geographic Intelligence

**[REL-M07]** The platform should **understand Arkansas geographically** — reason about place.

| Capability | V1 | Future |
|------------|-----|--------|
| Institutions within a county | ✅ Graph traverse | |
| Counties with zero institutions | ✅ Query | |
| Neighboring counties | | `adjacent_to` edges |
| Regional clusters | ✅ `region` field on County | Graph + region |
| Nearby institutions | | Geo + graph |
| Driving distance | | Geo API |
| Population regions | ✅ Demographics on County | |
| Recruitment regions | ✅ Outreach priority | |
| Map visualization | Partial `/map` | Interactive SVG |

**[REL-M07a]** Example query: *"What counties have no participating institutions?"* — answerable from graph without redesign.

---

## REL-M08 — Educational Intelligence

**[REL-M08]** The Registry understands **educational relationships**:

| Query | Source |
|-------|--------|
| Institutions within a county | County `contains` Institution |
| Nearby institutions | Future: geo + `neighbors` |
| Institution categories | `institutionType` on node |
| Public / private | `sector` on node |
| Enrollment ranges | `enrollment` on node |
| Regional educational ecosystems | Region + graph cluster |
| Academic partnerships | Future relationship type |

---

## REL-M09 — Organizing Intelligence

**[REL-M09]** The Registry understands **organizing relationships**:

| Question | Graph approach |
|----------|----------------|
| Which counties have no organizers? | County nodes where no Participant `resides_in` with active status |
| Which campuses need outreach? | Institution with `needs_outreach` status |
| Where are volunteers concentrated? | Future: `volunteered_for` edges |
| Where are committees forming? | Future: Committee nodes |
| Which institutions have growing participation? | Participant `attends` count over time |

**[REL-M09a]** Powers outreach gap dashboard [Step 2.6] and admin Launch tab metrics.

---

## REL-M10 — Personal Network Intelligence

**[REL-M10]** Every participant creates **relationship edges**:

| Edge | Meaning | V1 |
|------|---------|-----|
| `invited_by` / `invited` | Referral chain | ✅ |
| `connected_to` | Network board membership | ✅ |
| `mentors` | Mentorship | Future |
| `collaborates_with` | Shared work | Future |
| Committee membership | `belongs_to` Committee | Future |
| Shared projects | Project edges | Future |
| Volunteer history | `volunteered_for` | Future |

**[REL-M10a]** The platform grows through **accumulated relationships** [CP-008, OM-L2].

**[REL-M10b]** Personal network board [NET-001] is a **view** over Participant subgraph.

---

## REL-M11 — Discovery Engine

**[REL-M11]** Relationship data **powers discovery** — recommendations derive from graph, not static lists.

| Discovery | Relationship source |
|-----------|---------------------|
| Suggested nearby institutions | County `contains` + future geo |
| Recommended committees | Future: `belongs_to`, interests |
| County recommendations | Signup flow + `resides_in` |
| Nearby events | Future: `occurs_in` / `occurs_at` |
| Potential mentors | Future: `mentors` edges |
| Volunteer opportunities | Future: `volunteered_for` targets |
| AI recommendations | Future: graph traversal + ML |

**[REL-M11a]** V1 discovery: county pages list institutions via `contains`; institution pages link county via `belongs_to`.

---

## REL-M12 — Registry Graph Principles

**[REL-M12]** Relationships must be:

| Principle | Meaning |
|-----------|---------|
| **Normalized** | One edge record per relationship |
| **Explicit** | Typed — never inferred-only |
| **Searchable** | Index by type, source, destination |
| **Expandable** | New types without migration break |
| **Versionable** | History preserved |
| **Auditable** | Traceable to requirement IDs |
| **Future-proof** | Relational DB today; graph queries tomorrow |

**[REL-M12a]** Relationships are **as important as entities themselves**.

---

## REL-M13 — V1 Relationship Scope

**[REL-M13]** Version 1 implements these edges:

```
County ──contains──► Institution     (from institutions.json county field → normalized)
Institution ──belongs_to──► County   (inverse view)
Participant ──resides_in──► County   (signup: county selection)
Participant ──attends──► Institution (signup: school selection, students only)
Participant ──invited_by──► Participant (referral attribution)
Participant ──connected_to──► Participant (network board)
```

**[REL-M13a]** Step **2.9** seed plan migrates `institution.county` to explicit `contains` edges in seed/bootstrap layer.

**[REL-M13b]** DB table: `DB-RELATIONSHIPS` (or `registry_relationships`) with indexed `type`, `source_entity_id`, `destination_entity_id`.

---

## REL-M14 — Entity vs Relationship Separation

**[REL-M14]** Implementation architecture:

```
Entities (nodes)                    Relationships (edges)
─────────────────                   ─────────────────────
DB-COUNTIES                         DB-RELATIONSHIPS
DB-INSTITUTIONS                     type + source + destination
DB-USERS (participants)             metadata + timestamps
Future: DB-EVENTS, DB-COMMITTEES
```

**[REL-M14a]** **Never** encode relationships only as foreign keys without edge records when the relationship carries history (referrals, membership over time).

**[REL-M14b]** Simple denormalization (`institution.county`) acceptable as read cache if graph edges exist as source of truth.

**[REL-M14c]** Support future graph-style queries while remaining compatible with **relational databases** (Postgres + indexed joins) [ED-ME].

---

## REL-BG — Burt Implementation Guidance

**[REL-BG]** Implementation should:

| # | Action |
|---|--------|
| 1 | **Separate entities from relationships** — distinct tables/schemas |
| 2 | **Avoid duplicated** relationship information across modules |
| 3 | **Normalize** many-to-many relationships |
| 4 | Design **stable relationship identifiers** (`REL-*`) |
| 5 | Query graph for county↔institution — don't hardcode joins in UI |
| 6 | Build **discovery and dashboards** from relationship queries |
| 7 | Treat pages as **views** over the graph |
| 8 | Implement V1 edges before speculative future types |
| 9 | Document new relationship types in `relationship-types.json` |

**Anti-pattern:** Building `/county/[slug]` by filtering a flat institution array without a relationship model — acceptable as V0 bootstrap only until Step 2.9 migration.

---

## AC-013 — Acceptance Criteria

Step 2.4 is complete when:

- [x] **[AC-013a]** Relationship graph philosophy documented. `[REL-M01, REL-M03]`
- [x] **[AC-013b]** Canonical relationship types defined. `[REL-M05, relationship-types.json]`
- [x] **[AC-013c]** Geographic and educational intelligence established. `[REL-M07, REL-M08]`
- [x] **[AC-013d]** Organizing and personal network relationships incorporated. `[REL-M09, REL-M10]`
- [x] **[AC-013e]** Discovery engine concepts documented. `[REL-M11]`
- [x] **[AC-013f]** V1 scope and entity/edge separation defined. `[REL-M13, REL-M14]`
- [x] **[AC-013g]** Burt has complete model for relationship-aware architecture. `[REL-BG]`

---

**Next Step:** 2.5 — Representation Status System (`REPRESENTATION_STATUS_SYSTEM.md`)

*Trace: CP-008 → REL-M10 → NET-001 → invited_by edges → Discovery [REL-M11]*
