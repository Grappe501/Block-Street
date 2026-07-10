# Build Volume 2.1 — Data Philosophy & Canonical Model

### Data Architecture Bible

**Document ID:** VOLUME-002.1 · **DAB-002**  
**Artifact:** `DATA_PHILOSOPHY.md`  
**Status:** Canonical  
**Priority:** Critical

**Builds on:** [Volume 0](../master/MASTER_ARCHITECTURE_BIBLE.md) [MAB-001] · [1.4 Database Architecture](../volume-01/DATABASE_ARCHITECTURE.md) [ENG-004]  
**Live spec:** `data/registry/data-philosophy.json`

---

## DAB-PH01 — Purpose

**[DAB-PH01]** Data Philosophy defines **how the COS thinks about information** — before any table, field, or index is named.

**[DAB-PH01a]** Volume 1 preserves truth in Postgres; Volume 2 defines **what truth means** for each domain.

---

## DAB-PH02 — Guiding Principle

**[DAB-PH02]**

> **Connected data beats isolated tables.**

**[DAB-PH02a]** Almost everything in the COS is **related** — participants, communities, missions, stories, and knowledge form a living network [MAB-G].

---

## DAB-PH03 — Canonical Data Principles

**[DAB-PH03]** The canonical model follows:

| Principle | Meaning |
|-----------|---------|
| **Single source of truth** | Postgres relational store is canonical; graph, search, AI are projections |
| **Entity-first** | Named entities with stable IDs — not anonymous blobs |
| **Relationship-native** | Membership, leadership, mentorship are first-class data |
| **Event-backed history** | State changes produce immutable events [ENG-009] |
| **Lifecycle-aware** | Every entity has defined states and transitions [STS-001] |
| **Permission-by-design** | Visibility and ownership are attributes, not afterthoughts [PRE-001] |
| **Audit everything material** | Who changed what, when, with before/after |
| **Config vs. data** | Platform rules in DCL; community facts in domain tables [DCL-001] |
| **Migration-driven evolution** | Schema changes are versioned artifacts [ENG-DTR08] |

---

## DAB-PH04 — Source of Truth

**[DAB-PH04a]** **Canonical:** Supabase Postgres — domain schemas per [ENG-DB05](../volume-01/DATABASE_ARCHITECTURE.md).

**[DAB-PH04b]** **Derived (non-canonical):**

- Community Knowledge Graph projection [ENG-008]
- Search indexes [ENG-010]
- AI embeddings and retrieval chunks [ENG-013]
- Analytics rollups [NISS-001]
- Digital Twin snapshots [LDT-001]

**[DAB-PH04c]** Derived stores **must be rebuildable** from canonical data.

---

## DAB-PH05 — Data Ownership

**[DAB-PH05a]** **Platform** owns: constitution, templates, system config, global reference data (counties, institution catalog).

**[DAB-PH05b]** **Community** owns: community profile, missions, local knowledge, member roster (scoped).

**[DAB-PH05c]** **Participant** owns: personal profile, preferences, private notes, consent records.

**[DAB-PH05d]** **Stewardship** — every entity has `created_by`, `owned_by` or `community_id`, and optional `steward_id` [DAB-015].

---

## DAB-PH06 — Entity Lifecycle Philosophy

**[DAB-PH06a]** Lifecycle states are **enumerated**, not free text.

**[DAB-PH06b]** Transitions are **validatable** — services enforce; database constraints where practical.

**[DAB-PH06c]** Archival ≠ deletion — soft archive with retention policy [DAB-SPM].

**[DAB-PH06d]** Detail per entity: [CANONICAL_ENTITY_DICTIONARY.md](CANONICAL_ENTITY_DICTIONARY.md) [DAB-003].

---

## DAB-PH07 — Relationship Philosophy

**[DAB-PH07a]** Relationships are **typed edges** with metadata, validity windows, and community scope.

**[DAB-PH07b]** Cardinality is explicit: one-to-one, one-to-many, many-to-many via junction or edge table.

**[DAB-PH07c]** Detail: [RELATIONSHIP_DATA_MODEL.md](RELATIONSHIP_DATA_MODEL.md) [DAB-004].

---

## DAB-PH08 — Event Sourcing Philosophy

**[DAB-PH08a]** **Not full event sourcing** — canonical state lives in normalized tables.

**[DAB-PH08b]** **Event log** captures material changes for history, audit, and replay [ENG-ET · LHE-001].

**[DAB-PH08c]** Events are **immutable**; corrections append compensating events.

**[DAB-PH08d]** Detail: [EVENT_DATA_MODEL.md](EVENT_DATA_MODEL.md) [DAB-007].

---

## DAB-PH09 — Configuration vs. Data

**[DAB-PH09a]** **Configuration** — changes how the platform behaves (roles, templates, feature flags, workflows). Stored in `config` schema + DCL [DCL-001].

**[DAB-PH09b]** **Data** — facts about the real world (participants, events, stories). Stored in domain schemas.

**[DAB-PH09c]** Rule: if removing it would change **behavior** not **history**, it is configuration.

**[DAB-PH09d]** Detail: [CONFIGURATION_MODEL.md](CONFIGURATION_MODEL.md) [DAB-010].

---

## DAB-PH10 — Versioning Philosophy

**[DAB-PH10a]** **Schema version** — semver migrations tracked in `platform.schema_migrations`.

**[DAB-PH10b]** **Entity version** — optimistic locking via `version` column or `updated_at` on hot entities.

**[DAB-PH10c]** **Content version** — documents and knowledge objects support revision history [DAB-MED].

**[DAB-PH10d]** **Projection version** — search/graph indexes track `source_version` or `indexed_at`.

---

## DAB-PH11 — Identifier Philosophy

**[DAB-PH11a]** Primary keys: `uuid` (v7 preferred for time-order) — never sequential integers exposed publicly.

**[DAB-PH11b]** Public references: `slug` where human-shareable (community, county, institution).

**[DAB-PH11c]** External refs: store provider + external_id (Supabase auth, civic passport [CJT-001]).

---

## DAB-PH12 — Burt Implementation Guidance

**[DAB-PH12]** Before any DDL:

1. Confirm entity exists in [CANONICAL_ENTITY_DICTIONARY.md](CANONICAL_ENTITY_DICTIONARY.md)
2. Confirm relationships in [RELATIONSHIP_DATA_MODEL.md](RELATIONSHIP_DATA_MODEL.md)
3. Place table in correct schema per [DATABASE_SCHEMA_BLUEPRINT.md](DATABASE_SCHEMA_BLUEPRINT.md)
4. Register field in [MASTER_DATA_DICTIONARY.md](MASTER_DATA_DICTIONARY.md)

---

## AC-107 — Acceptance Criteria

- [x] **[AC-107a]** Canonical data principles documented. `[DAB-PH03]`
- [x] **[AC-107b]** Source of truth, ownership, and lifecycle philosophy defined. `[DAB-PH04–PH06]`
- [x] **[AC-107c]** Relationship, event, config, and versioning philosophy established. `[DAB-PH07–PH10]`

---

**Next step:** [2.2 — Canonical Entity Dictionary](CANONICAL_ENTITY_DICTIONARY.md) [DAB-003]

**End of Volume 2.1.**
