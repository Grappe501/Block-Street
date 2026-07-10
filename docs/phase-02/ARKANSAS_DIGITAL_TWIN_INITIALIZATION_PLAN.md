# Arkansas Digital Twin Initialization Plan

**Document ID:** PHASE-002.9  
**Artifact:** `ARKANSAS_DIGITAL_TWIN_INITIALIZATION_PLAN.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 2 — Arkansas Organizing Registry

> **Ship a living Arkansas, not an empty database.**

Before the first user ever logs in, the platform already knows Arkansas. The state already exists. Every county already exists. Every university already exists. Every community already has a home waiting.

**Builds On:** [PHASE-002.1 Registry Doctrine](ARKANSAS_ORGANIZING_REGISTRY_DOCTRINE.md) · [PHASE-002.4 Relationship Graph](ARKANSAS_RELATIONSHIP_GRAPH.md) · [PHASE-002.7 Community Identity](COMMUNITY_IDENTITY_PERSONALIZATION_SYSTEM.md) · [PHASE-002.8 Knowledge Governance](KNOWLEDGE_DATA_GOVERNANCE_FRAMEWORK.md)

**Live spec:** `data/registry/digital-twin-init.json`  
**Living model:** [Volume 1.11 Arkansas Digital Twin Architecture](../volume-01/ARKANSAS_DIGITAL_TWIN_ARCHITECTURE.md) [ADT-002 · ENG-011]

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| ADT-M01 | Purpose |
| ADT-M02 | Guiding principle |
| ADT-M03 | Initialization philosophy |
| ADT-M04 | State initialization |
| ADT-M05 | County initialization |
| ADT-M06 | Institution initialization |
| ADT-M07 | Relationship initialization |
| ADT-M08 | Community initialization |
| ADT-M09 | Initial status |
| ADT-M10 | Initial personalization |
| ADT-M11 | Registry validation |
| ADT-M12 | Deployment philosophy |
| ADT-M13 | Schema migration |
| ADT-M14 | Knowledge Provenance at init |
| ADT-M15 | Future expansion |
| ADT-M16 | V1 implementation scope |
| ADT-BG | Burt implementation guidance |
| AC-018 | Step 2.9 acceptance criteria |

---

## ADT-M01 — Purpose

**[ADT-M01]** This document defines the **initialization process** for ASYON — not a "seed data dump," but the birth of the **Arkansas Digital Twin**.

**[ADT-M01a]** Before the first participant registers, the platform contains a **complete digital representation** of Arkansas's organizing landscape.

**[ADT-M01b]** Objective: participants **join an existing community** rather than creating one from scratch.

**[ADT-M01c]** A student from Conway finds **UCA already waiting**. A student from Fayetteville finds the **University of Arkansas already represented**. A young adult from Ashley County finds their **county hub already established**.

*Adoption impact:* Users step into the map — they don't build it.

---

## ADT-M02 — Guiding Principle

**[ADT-M02]**

> **The platform launches with Arkansas already built.**

**[ADT-M02a]** Participants do **not** create counties.

**[ADT-M02b]** Participants do **not** create universities.

**[ADT-M02c]** Participants **bring those communities to life**.

---

## ADT-M03 — Initialization Philosophy

**[ADT-M03]** First deployment initializes the **foundational organizing landscape**.

### V1 Initialization Package

| Layer | Contents |
|-------|----------|
| **State** | Arkansas root node, state dashboard, map, statistics |
| **Counties** | All 75 counties — none omitted |
| **Institutions** | Every Arkansas college and university (4-year V1) |
| **Relationships** | State→County, County→Institution graph edges |
| **Identifiers** | Permanent IDs, stable URLs, canonical slugs |
| **Status** | Organizing placeholders — communities ready for organizers |
| **Personalization** | Welcoming foundation per community [CID-M09] |
| **Operational** | **Empty** — no participants, events, or committees assumed |

**[ADT-M03a]** Initialization is **deterministic and repeatable** [ADT-BG].

**[ADT-M03b]** Current bootstrap status documented in `digital-twin-init.json` → `bootstrapStatus`.

---

## ADT-M04 — State Initialization

**[ADT-M04]** Create **Arkansas** as root of the Registry.

| Deliverable | Detail |
|-------------|--------|
| Permanent State ID | `STATE-AR` |
| State dashboard | `/admin`, `/map` |
| State map | `/map` — all counties |
| State registry | Root node in graph |
| State statistics | Derived from county/institution queries [OIS-M05] |

**[ADT-M04a]** Arkansas is the **single parent** of all county nodes via `contains` edge [REL-M04].

---

## ADT-M05 — County Initialization

**[ADT-M05]** Create **all seventy-five counties** [CNTY-M01, REG-001].

Each county receives:

| Field / Asset | Requirement |
|---------------|-------------|
| Permanent County ID | `CNTY-{slug}` |
| URL | `/county/{slug}` |
| Canonical Registry record | Full schema [CNTY-M05] |
| County page | Community DNA renderer [CID-M16] |
| Organizing dashboard | Status-driven sections |
| Representation status | Default: `needs_outreach` [ADT-M09] |
| Future expansion points | Committees, events, projects (empty) |

**[ADT-M05a]** **No county is omitted.**

**[ADT-M05b]** Bootstrap: `counties.json` has 75 minimal records — migrate to full canonical profile during init script execution.

---

## ADT-M06 — Institution Initialization

**[ADT-M06]** Create **every Arkansas college and university** [INST-M01, REG-002].

V1 scope: **4-year colleges and universities** [INST-M04, REG-D13].

Each institution receives:

| Field / Asset | Requirement |
|---------------|-------------|
| Permanent Institution ID | `INST-{slug}` |
| Canonical Registry record | Full schema [INST-M06] |
| Campus page | `/schools/{slug}` |
| County relationship | `contains` / `belongs_to` edge |
| Institution type | From canonical enum |
| Status placeholder | Default: `needs_outreach` |
| Community DNA foundation | History, geography, welcome [ADT-M10] |
| Disclaimer | Required [CID-M07] |

**[ADT-M06a]** Bootstrap: `institutions.json` has 23 partial records — init expands to complete V1 institution set.

**[ADT-M06b]** Future types (community colleges, trade schools, high schools) extend via **expansion packages** [ADT-M15] — not rebuild.

---

## ADT-M07 — Relationship Initialization

**[ADT-M07]** Create initial **organizing graph** edges [REL-M01].

| Edge | Source | Destination | V1 |
|------|--------|-------------|-----|
| `contains` | Arkansas (`STATE-AR`) | County | ✅ |
| `contains` | County | Institution | ✅ |
| `located_in` | Institution | County | ✅ (inverse view) |
| `belongs_to` | Institution | County | ✅ |

**[ADT-M07a]** Migrate bootstrap denormalization (`institution.county` field) to explicit relationship records [REL-M13a].

**[ADT-M07b]** Relationship seed file: `data/registry/relationships-bootstrap.json` (generated by init script).

**[ADT-M07c]** Participant edges (`attends`, `resides_in`, `invited_by`) created at **registration** — not initialization.

---

## ADT-M08 — Community Initialization

**[ADT-M08]** Every community begins **empty** of organizing activity.

**No assumptions** regarding:

- Participants · Committees · Events · Projects · Volunteer activity

**[ADT-M08a]** Communities become **active through participation** [OM-L1].

**[ADT-M08b]** Empty ≠ blank page — welcome foundation always present [ADT-M10, CID-M09].

---

## ADT-M09 — Initial Status

**[ADT-M09]** Default organizing status for uninitialized communities:

| Entity | Default status | Rationale |
|--------|----------------|-----------|
| County | `needs_outreach` | Ready for first organizer |
| Institution | `needs_outreach` | Outreach target — Mission Board [OIS-M16] |

**[ADT-M09a]** Alternative `building` may apply where pre-launch organizer activity exists — admin override only.

**[ADT-M09b]** Status clearly indicates communities are **ready for organizers** — not abandoned or broken.

**[ADT-M09c]** Maps legacy `needs_organizer` → `needs_outreach` [STS-M17].

---

## ADT-M10 — Initial Personalization

**[ADT-M10]** Every community receives a **welcoming foundation** [CID-M09]:

| Content | Source |
|---------|--------|
| History summary | DNA `history` or bootstrap field |
| Location / geography | DNA `geography` |
| Basic facts | Enrollment, seat, population (with provenance) |
| Community overview | DNA `culture` / `studentLife` |
| Join invitation | Platform CTA — `/join` with county/campus preselect |
| Disclaimer | Institution pages [CID-M07] |

**[ADT-M10a]** Migrate bootstrap `culture` → `historySummary` + `studentLifeSummary` [INST-M07a].

**[ADT-M10b]** Future versions enrich via Community DNA and participant content [CID-M10].

---

## ADT-M11 — Registry Validation

**[ADT-M11]** Initialization **must verify** integrity — validation is part of deployment.

| Check | Rule |
|-------|------|
| County count | Exactly 75 |
| Institution count | Matches V1 target list |
| Every county exists | No gaps in FIPS/slug set |
| Every institution exists | All V1 targets present |
| Every relationship exists | State→County, County→Institution |
| No duplicate identifiers | Unique slugs and IDs |
| No orphaned records | Every institution has county edge |
| Stable URLs | All `pageUrl` fields valid |
| Schema compliance | Pass JSON Schema validation |
| Provenance present | Critical fields have confidence ≥ `needs_review` [KDG-M10] |

**[ADT-M11a]** Validation script: `scripts/validate-registry.ts` (implementation Phase 3).

**[ADT-M11b]** Failed validation **blocks deployment** [ED-003].

---

## ADT-M12 — Deployment Philosophy

**[ADT-M12]** Initialization occurs **automatically** during first deployment.

| Rule | Detail |
|------|--------|
| No manual county creation | Ever |
| No manual institution creation | V1 set via init script |
| Repeatable | Same input → same twin |
| Idempotent | Re-run safe — upsert, not duplicate |
| Separated from operational data | Class A init ≠ Class B users [KDG-M03] |

**[ADT-M12a]** Future Registry updates via **controlled expansion packages** [ADT-M15] — not rebuilding initialization.

**[ADT-M12b]** Init script entry point: `scripts/init-digital-twin.ts` (implementation Phase 3).

---

## ADT-M13 — Schema Migration

**[ADT-M13]** Initialization migrates bootstrap JSON to **full canonical schemas**:

| File | From | To |
|------|------|-----|
| `counties.json` | `{ slug, name }` | Full `county-record.schema.json` |
| `institutions.json` | Partial bootstrap | Full `institution-record.schema.json` |
| Relationships | Denormalized `county` field | `relationships-bootstrap.json` + DB edges |
| Status | Legacy `needs_organizer` | Canonical `needs_outreach` |
| DNA | `culture` string | Community DNA categories [CID-M14] |
| Provenance | `referenceSources` only | Per-field `knowledge-provenance.schema.json` [KDG-M10] |

**[ADT-M13a]** Migration is **approved by this document** [CNTY-M08, INST-M18, ED-GR].

---

## ADT-M14 — Knowledge Provenance at Init

**[ADT-M14]** Initialization attaches **Knowledge Provenance** to factual fields [KDG-M10].

| Field type | Default confidence |
|------------|-------------------|
| Official source (IPEDS, Census) | `verified_official` or `verified_public` |
| Bootstrap without source | `needs_review` |
| Estimated enrollment | `needs_review` + `reviewBy` date |

**[ADT-M14a]** Bulk import defaults to `needs_review` where sources unverified [KDG-M17b].

**[ADT-M14b]** Stewards prioritize review queue post-launch.

---

## ADT-M15 — Future Expansion

**[ADT-M15]** Future initialization **packages** add entity types without breaking existing twin:

| Package | Entities | Preserves |
|---------|----------|-----------|
| V1.5 | Community colleges | All V1 IDs and URLs |
| V2 | Trade schools, technical institutes | Graph structure |
| V3 | High schools (self-registration) | County relationships |
| V4+ | Additional org categories | Permanent identifiers |

**[ADT-M15a]** Expansion **preserves existing identifiers and relationships** [REG-D11].

---

## ADT-M16 — V1 Implementation Scope

**[ADT-M16]** This document (Step 2.9) delivers the **blueprint**. Implementation executes in Phase 3.

| Deliverable | Step 2.9 | Phase 3 |
|-------------|----------|---------|
| Initialization philosophy | ✅ | |
| Entity and relationship spec | ✅ | |
| Validation checklist | ✅ | Script |
| `digital-twin-init.json` catalog | ✅ | |
| Full county schema migration | Spec | Execute |
| Complete institution set | Spec | Execute |
| Relationship bootstrap file | Spec | Generate |
| Init + validate scripts | Spec | `scripts/` |
| DB seed on Netlify | Spec | Deploy |

**[ADT-M16b]** Current bootstrap: **75 counties** (minimal), **23 institutions** (partial) — init closes the gap to full V1 twin.

---

## ADT-BG — Burt Implementation Guidance

**[ADT-BG]** Implementation should:

| # | Rule |
|---|------|
| 1 | **Deterministic initialization scripts** — reproducible twin |
| 2 | **Separate initialization from operational data** — Class A only |
| 3 | **Support repeatable deployments** — idempotent upsert |
| 4 | **Validate Registry integrity** after every init run [ADT-M11] |
| 5 | **Document every initialized entity** — manifest output |
| 6 | **Avoid manual setup** — no admin "create county" workflow |
| 7 | **Wire graph edges** — not just flat JSON arrays [REL-M13] |
| 8 | **Attach provenance** on migration [KDG-M14] |
| 9 | **Generate welcome-ready pages** — never empty communities [ADT-M10] |

---

## AC-018 — Acceptance Criteria

Step 2.9 is complete when:

- [x] **[AC-018a]** Initialization philosophy documented. `[ADT-M01, ADT-M02, ADT-M03]`
- [x] **[AC-018b]** State, county, institution, relationship initialization defined. `[ADT-M04–M07]`
- [x] **[AC-018c]** Validation expectations established. `[ADT-M11]`
- [x] **[AC-018d]** Future Registry expansion supported. `[ADT-M15]`
- [x] **[AC-018e]** Schema migration and provenance at init specified. `[ADT-M13, ADT-M14]`
- [x] **[AC-018f]** Burt has blueprint for initial knowledge foundation. `[ADT-BG, digital-twin-init.json]`

---

**Next Step:** 2.10 — Phase 2 Build Bible · then Phase 3 People

*Trace: REG-D16 digital twin → ADT-M03 → init script → validate → participants step in [OM-L1]*
