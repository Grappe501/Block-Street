# Build Volume 2.1 — Data Philosophy & Canonical Model

### Data Architecture Bible

**Document ID:** VOLUME-002.1 · **DAB-002**  
**Artifact:** `DATA_PHILOSOPHY.md`  
**Status:** Canonical  
**Priority:** Critical

**Builds on:** [Volume 0](../master/MASTER_ARCHITECTURE_BIBLE.md) [MAB-001] · [1.4 Database Architecture](../volume-01/DATABASE_ARCHITECTURE.md) [ENG-004]  
**Live spec:** `data/registry/data-philosophy.json`

---

## Purpose

**[DAB-PH01]** The Data Philosophy & Canonical Model defines how the Community Operating System understands, stores, protects, connects, and evolves information.

**[DAB-PH01a]** This document governs every future database table, API contract, search index, graph relationship, AI retrieval object, dashboard metric, and historical record.

---

## Guiding Principle

**[DAB-PH02]**

> **Data is the memory of the community.**

**[DAB-PH02a]** The platform should preserve not only what exists, but how people, communities, missions, and relationships change over time.

---

## Core Data Philosophy

**[DAB-PH03]** The system should treat data as:

| Principle | Meaning |
|-----------|---------|
| **Canonical** | One authoritative record per real-world object |
| **Relational** | Entities connected by explicit, queryable relationships |
| **Historical** | Change preserved, not silently overwritten |
| **Permission-aware** | Visibility enforced at access layer [PRE-001] |
| **Auditable** | Material changes traceable to actor and time |
| **Searchable** | Discoverable through indexed projections [ENG-010] |
| **Explainable** | AI and analytics cite sources; humans can verify |
| **Exportable** | Participants and stewards can retrieve what they own |
| **Extensible** | Additive evolution preferred over breaking changes |
| **Human-centered** | Data serves belonging, organizing, learning, and leadership |

**[DAB-PH03a]** Data should help people belong, organize, learn, and lead.

---

## Canonical Source of Truth

**[DAB-PH04]** The SQL database is the canonical source of truth.

**[DAB-PH04a]** All major platform facts should ultimately trace back to canonical database records.

**[DAB-PH04b]** Search indexes, AI embeddings, graph projections, analytics rollups, and dashboard summaries are **secondary representations**.

**[DAB-PH04c]** They may improve speed or intelligence, but they do **not** replace the canonical database.

**[DAB-PH04d]** Derived stores must be rebuildable from canonical data.

---

## Canonical Data Rule

**[DAB-PH05]** Every real-world object should have **one canonical record**.

Examples:

- One participant record per person
- One county record per county
- One institution record per educational institution
- One community record per organizing community
- One mission record per mission
- One event record per event
- One story record per story

**[DAB-PH05a]** Duplicate data should be avoided unless intentionally created as a read model, cache, or historical snapshot.

---

## Entity Philosophy

**[DAB-PH06]** An entity is a meaningful thing the platform understands.

Examples: Participant · Community · County · Institution · Mission · Event · Story · Lesson · Opportunity · Partnership · Capacity

**[DAB-PH06a]** Every entity should have:

- Stable ID
- Clear ownership
- Lifecycle
- Status
- Visibility
- Created timestamp
- Updated timestamp
- Historical context where appropriate

**[DAB-PH06b]** Detail per entity: [CANONICAL_ENTITY_DICTIONARY.md](CANONICAL_ENTITY_DICTIONARY.md) [DAB-003]

---

## Relationship Philosophy

**[DAB-PH07]** Relationships are **first-class data**.

**[DAB-PH07a]** The platform should not only know that two records exist — it should understand **how they are connected**.

Examples:

- Participant belongs to Community
- Participant invited Participant
- Mission belongs to Community
- Event supports Mission
- Story documents Event
- Lesson improves Playbook
- Institution is located in County
- Partner supports Initiative

**[DAB-PH07b]** Relationships should be queryable, historical, and permission-aware.

**[DAB-PH07c]** Detail: [RELATIONSHIP_DATA_MODEL.md](RELATIONSHIP_DATA_MODEL.md) [DAB-004]

---

## Time Philosophy

**[DAB-PH08]** The platform should understand change over time.

**[DAB-PH08a]** Important data should not simply be overwritten. The system should preserve:

- Status changes
- Membership history
- Leadership transitions
- Mission progress
- Event history
- Invitations
- Participation
- Lessons learned
- Community milestones

**[DAB-PH08b]** The current state matters. The journey to that state also matters.

---

## Event Philosophy

**[DAB-PH09]** Important actions should produce **event records**.

Examples:

- Participant registered
- Community launched
- Mission created
- Event completed
- Story published
- Lesson captured
- Invitation accepted
- Leadership role assigned

**[DAB-PH09a]** Events power: Timelines · Audit history · Living History Engine [LHE-001] · Notifications · Analytics · Intelligence · Legacy

**[DAB-PH09b]** Detail: [EVENT_DATA_MODEL.md](EVENT_DATA_MODEL.md) [DAB-007]

---

## Configuration vs. Operational Data

**[DAB-PH10]** The system should distinguish **configuration** from **operational data**.

### Configuration Data

Defines how the platform behaves.

Examples: Community types · Role definitions · Permission groups · Status values · Workflow definitions · Recognition categories · Notification rules · Templates

### Operational Data

Records what participants and communities do.

Examples: Missions created · Events attended · Volunteers assigned · Stories written · Invitations accepted · Lessons captured

**[DAB-PH10a]** Configuration should be editable through controlled governance.

**[DAB-PH10b]** Operational data should preserve community activity.

**[DAB-PH10c]** Detail: [CONFIGURATION_MODEL.md](CONFIGURATION_MODEL.md) [DAB-010]

---

## Public Facts vs. Platform Activity

**[DAB-PH11]** The platform stores two different kinds of truth.

### Public Facts

Examples: County name · Institution founding year · Institution location · Enrollment estimate · Official website

**[DAB-PH11a]** These require source attribution and periodic review.

### Platform Activity

Examples: Community membership · Missions completed · Events attended · Stories published · Volunteer participation

**[DAB-PH11b]** These are generated by platform usage.

**[DAB-PH11c]** Both are important, but they follow different governance rules.

---

## Data Ownership

**[DAB-PH12]** Every data domain needs a clear owner.

| Domain | Owner Service |
|--------|---------------|
| Counties & institutions | Registry Service |
| Communities | Community Service |
| Missions & projects | Mission Service |
| Events | Experience Service |
| Stories | Story Service |
| Lessons & playbooks | Knowledge Service |
| Invitations & onboarding | Growth Service |
| Participant identity | Identity Service |

**[DAB-PH12a]** Ownership prevents conflicting business rules.

---

## Data Stewardship

**[DAB-PH13]** Canonical data should have stewardship.

Stewardship means:

- Reviewing accuracy
- Approving changes
- Maintaining source attribution
- Resolving duplicates
- Protecting privacy
- Documenting major revisions

**[DAB-PH13a]** Not all data requires the same level of review, but all important data needs accountability.

---

## Versioning Philosophy

**[DAB-PH14]** Some data should be versioned.

Examples: Community Charters · Mission Canvas · Playbooks · Public profiles · Policies · Templates · Knowledge articles · Published stories

**[DAB-PH14a]** Versioning allows the platform to answer: What changed? When? Who changed it? Why?

**[DAB-PH14b]** Schema version — semver migrations in `platform.schema_migrations` [ENG-DTR08]

**[DAB-PH14c]** Entity version — optimistic locking via `version` or `updated_at` on hot entities

**[DAB-PH14d]** Projection version — search/graph indexes track `source_version` or `indexed_at`

---

## Status Philosophy

**[DAB-PH15]** Every major entity should support lifecycle status.

Examples: Planned · Draft · Active · Paused · Completed · Archived · Needs Review

**[DAB-PH15a]** Status should be explicit data, not implied by missing fields.

**[DAB-PH15b]** Status changes should be historically preserved where meaningful [STS-001].

---

## Visibility Philosophy

**[DAB-PH16]** Visibility should be separate from existence.

**[DAB-PH16a]** An entity may exist but not be public.

Visibility examples: Private · Participant only · Team · Community · Regional · Statewide · Public

**[DAB-PH16b]** Visibility must always be evaluated through the permission system [PRE-001].

---

## Privacy Philosophy

**[DAB-PH17]** Participant data should be collected only when it serves a meaningful purpose.

**[DAB-PH17a]** The system should support:

- Consent
- Privacy preferences
- Data minimization
- Visibility controls
- Exportability
- Deletion or archival where appropriate
- Audit history for sensitive access

**[DAB-PH17b]** Trust is a data requirement. Detail: [SECURITY_PRIVACY_MODEL.md](SECURITY_PRIVACY_MODEL.md) [DAB-014]

---

## Audit Philosophy

**[DAB-PH18]** Significant changes should be traceable.

Audit records should capture:

- Actor
- Action
- Target
- Timestamp
- Previous value where appropriate
- New value where appropriate
- Source
- Reason where available

**[DAB-PH18a]** Audit is not about suspicion. Audit protects trust and institutional memory.

---

## Search Philosophy

**[DAB-PH19]** Search is a **projection** of canonical data.

Indexes may include:

- Full text
- Tags
- Geographic metadata
- Relationship metadata
- Permission filters
- Semantic embeddings

**[DAB-PH19a]** Search must never expose data the participant is not authorized to see.

**[DAB-PH19b]** Detail: [SEARCH_INDEX_MODEL.md](SEARCH_INDEX_MODEL.md) [DAB-011]

---

## AI Data Philosophy

**[DAB-PH20]** AI may consume data, summarize data, and recommend actions.

**[DAB-PH20a]** AI should **not** become the canonical source of truth.

**[DAB-PH20b]** AI outputs should include:

- Source references
- Confidence or uncertainty
- Explanation
- Prompt/model version where appropriate
- Human approval status where needed

**[DAB-PH20c]** AI-generated content should be clearly distinguishable from verified platform data.

**[DAB-PH20d]** Detail: [AI_KNOWLEDGE_MODEL.md](AI_KNOWLEDGE_MODEL.md) [DAB-013]

---

## Analytics Philosophy

**[DAB-PH21]** Analytics are **interpretations**, not truth itself.

**[DAB-PH21a]** Dashboards and reports should be derived from canonical records.

**[DAB-PH21b]** Important metrics should document:

- Source data
- Calculation method
- Refresh schedule
- Limitations
- Permission scope

**[DAB-PH21c]** Analytics should guide decisions, not replace judgment. Detail: [ANALYTICS_DATA_MODEL.md](ANALYTICS_DATA_MODEL.md) [DAB-012]

---

## Archive Philosophy

**[DAB-PH22]** Archiving is different from deleting.

**[DAB-PH22a]** Completed missions, past events, former leadership roles, old stories, and historical community records should usually remain available as institutional memory.

**[DAB-PH22b]** Deletion should be reserved for privacy, safety, legal, or duplicate correction needs.

---

## Data Quality Principles

**[DAB-PH23]** Data should be:

- Accurate
- Complete enough to be useful
- Consistent
- Attributed when sourced externally
- Reviewed when important
- Structured enough for search and intelligence
- Flexible enough for growth

---

## Canonical Metadata

**[DAB-PH24]** Every major table should consider standard metadata fields:

`id` · `public_id` · `created_at` · `updated_at` · `created_by` · `updated_by` · `status` · `visibility` · `version` · `source` · `review_status` · `archived_at`

**[DAB-PH24a]** Not every entity needs every field, but consistency should be preferred.

**[DAB-PH24b]** Detail: [MASTER_DATA_DICTIONARY.md](MASTER_DATA_DICTIONARY.md) [DAB-015]

---

## Data Expansion Rule

**[DAB-PH25]** Future data types should **extend** the model instead of breaking it.

The architecture should support:

- More educational institution types
- More community types
- More relationship types
- More event types
- More knowledge objects
- More states later
- More AI capabilities later

**[DAB-PH25a]** Expansion should be additive whenever possible.

---

## Burt Implementation Guidance

**[DAB-PH26]** Implementation should:

1. Treat SQL as canonical truth
2. Model relationships explicitly
3. Preserve meaningful history
4. Keep configuration separate from operational data
5. Track source attribution for public facts
6. Keep AI, search, and analytics as derived layers
7. Enforce privacy and permissions at the data access layer
8. Prefer additive schema evolution

**[DAB-PH26a]** Before any DDL:

1. Confirm entity in [CANONICAL_ENTITY_DICTIONARY.md](CANONICAL_ENTITY_DICTIONARY.md)
2. Confirm relationships in [RELATIONSHIP_DATA_MODEL.md](RELATIONSHIP_DATA_MODEL.md)
3. Place table in correct schema per [DATABASE_SCHEMA_BLUEPRINT.md](DATABASE_SCHEMA_BLUEPRINT.md)
4. Register field in [MASTER_DATA_DICTIONARY.md](MASTER_DATA_DICTIONARY.md)

---

## AC-107 — Acceptance Criteria

Volume 2.1 is complete when:

- [x] **[AC-107a]** The canonical data philosophy is documented. `[DAB-PH03]`
- [x] **[AC-107b]** Source-of-truth rules are established. `[DAB-PH04–PH05]`
- [x] **[AC-107c]** Entity, relationship, event, status, visibility, privacy, audit, search, AI, and analytics philosophies are defined. `[DAB-PH06–PH21]`
- [x] **[AC-107d]** Burt has the governing doctrine for every future data model decision. `[DAB-PH26]`

---

**Next step:** [2.2 — Canonical Entity Dictionary](CANONICAL_ENTITY_DICTIONARY.md) [DAB-003]

**End of Volume 2.1.**
