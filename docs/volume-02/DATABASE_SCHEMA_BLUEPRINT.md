# Build Volume 2.4 — Database Schema Blueprint

### Data Architecture Bible

**Document ID:** VOLUME-002.4 · **DAB-005**  
**Artifact:** `DATABASE_SCHEMA_BLUEPRINT.md`  
**Status:** Canonical  
**Priority:** Critical

**Builds on:** [2.3 Relationship Data Model](RELATIONSHIP_DATA_MODEL.md) [DAB-004] · [1.4 Database Architecture](../volume-01/DATABASE_ARCHITECTURE.md) [ENG-004]  
**Live spec:** `data/registry/database-schema-blueprint.json`

> **This document is intentionally technology-neutral.** It is not SQL. It is the architectural blueprint Burt converts into migrations, schemas, indexes, views, constraints, and APIs.

---

## Purpose

**[DAB-SCH01]** The Database Schema Blueprint defines the **logical structure** of the Community Operating System database.

**[DAB-SCH01a]** It answers one question:

> **How should the platform's information be organized?**

---

## Guiding Principle

**[DAB-SCH02]**

> **Organize the database around business domains—not around screens or features.**

**[DAB-SCH02a]** The database should mirror the Community Operating System architecture.

---

## Database Philosophy

**[DAB-SCH03]** The database should be:

| Principle | Meaning |
|-----------|---------|
| **Domain-driven** | Schemas align to business responsibility |
| **Highly normalized** | One canonical fact per place |
| **Explicitly related** | FKs and ledger edges, not hidden joins |
| **History-preserving** | Temporal and audit tables |
| **Graph-compatible** | Relational truth projects to CKG [DAB-006] |
| **Search-friendly** | Supports derived search indexes [DAB-011] |
| **Analytics-ready** | Rollups without polluting operational tables |
| **AI-ready** | Retrieval metadata separated from canonical rows |
| **Migration-controlled** | Every change versioned and documented |
| **Extensible** | Growth through addition, not redesign |

**[DAB-SCH03a]** The schema should grow through **addition** rather than redesign.

---

## Canonical Organization

**[DAB-SCH04]** The platform is divided into **domain schemas** rather than one large collection of unrelated tables.

```text
Identity
Registry
Community
Leadership
Mission
Experience
Growth
Knowledge
Partnership
Capacity
Communication
Intelligence
Analytics
System
```

**[DAB-SCH04a]** Each schema owns its own business responsibility.

**[DAB-SCH04b]** Implementation mapping to Postgres physical schemas is documented in [ENG-004](../volume-01/DATABASE_ARCHITECTURE.md) — this blueprint defines **logical ownership** first.

---

## Identity Schema

**[DAB-SCH05]** **Owns:** Participant · Account · Profile · Session · Preference · Authentication Provider · Privacy Setting · Communication Preference

**[DAB-SCH05a]** Identity is **isolated** from operational data — authentication is separate from profile and participant record [DAB-E17–E18].

---

## Registry Schema

**[DAB-SCH06]** **Owns:** County · Region · City · Educational Institution · Community Type · Institution Type · Geographic Metadata

**[DAB-SCH06a]** Registry becomes the **statewide reference layer** — seeded from ADE registries (`data/registry/*.json`) and stewarded over time.

---

## Community Schema

**[DAB-SCH07]** **Owns:** Community · Committee · Membership · Community Role · Community Setting · Community History · Community Template · Community Lifecycle

**[DAB-SCH07a]** Membership is a **first-class entity**, not a dumb join table [DAB-REL21].

---

## Leadership Schema

**[DAB-SCH08]** **Owns:** Leadership Role · Leadership Assignment · Mentorship · Leadership Pathway · Community Builder Progress · Leadership Succession

**[DAB-SCH08a]** Leadership succession and term history preserved as institutional memory.

---

## Mission Schema

**[DAB-SCH09]** **Owns:** Initiative · Mission · Project · Task · Milestone · Mission Template · Mission Operating Record · Mission Reflection

**[DAB-SCH09a]** Hierarchy: Initiative → Mission → Project → Task [ACN-001].

---

## Experience Schema

**[DAB-SCH10]** **Owns:** Event · Attendance · Registration · Schedule · Calendar · Venue · Agenda Item · Check-in

**[DAB-SCH10a]** Time-bound experiences parallel the mission hierarchy [EEOS-001 · TSOS-001].

---

## Growth Schema

**[DAB-SCH11]** **Owns:** Invitation · Referral Chain · QR Identity · Belonging Milestone · Growth Campaign · Community Launch Record · Welcome Journey

**[DAB-SCH11a]** Growth schema powers the invite tree and belonging engine [PON-001 · WBS-001 · ICS-001].

---

## Knowledge Schema

**[DAB-SCH12]** **Owns:** Story · Lesson · Experience Playbook · Community Brain · Mission Library · Legacy · Media Reference · Knowledge Category

**[DAB-SCH12a]** Knowledge compounds — relationships to missions and events are explicit [DAB-REL07h–i].

---

## Partnership Schema

**[DAB-SCH13]** **Owns:** Partner · Partnership · Shared Initiative · Facility · Institution Relationship · Collaboration Record

**[DAB-SCH13a]** External collaboration tracked with lifecycle and provenance [IPS-001].

---

## Capacity Schema

**[DAB-SCH14]** **Owns:** Skill · Resource · Equipment · Transportation · Facility · Availability · Capacity Profile

**[DAB-SCH14a]** Searchable capability matching for missions and events [CCS-001 · CCE-001].

---

## Communication Schema

**[DAB-SCH15]** **Owns:** Announcement · Notification · Communication Log · Delivery Status · Message Template · Notification Preference · Communication Timeline

**[DAB-SCH15a]** Respects attention budget and participant preferences [CAM-001].

---

## Intelligence Schema

**[DAB-SCH16]** **Owns:** Insight · Recommendation · Digital Twin · Knowledge Graph Node · Knowledge Graph Relationship · Graph Projection · Forecast Record · AI Metadata

**[DAB-SCH16a]** Intelligence **never replaces** canonical operational data — all derived and rebuildable [DAB-PH04].

---

## Analytics Schema

**[DAB-SCH17]** **Owns:** Snapshot · Aggregation · Dashboard Metric · KPI · Rollup · Historical Summary · Performance Indicator

**[DAB-SCH17a]** Analytics remain **derived** from canonical records [DAB-PH21].

---

## System Schema

**[DAB-SCH18]** **Owns:** Configuration · Audit Record · Feature Flag · Workflow Definition · Enumeration · Status Definition · Template Definition · Migration Metadata · System Health

**[DAB-SCH18a]** Platform kernel, DCL constitution layer, and governance artifacts [DCL-001 · CRCC-001].

---

## Table Naming Standards

**[DAB-SCH19]** Prefer **singular nouns** describing business meaning:

Participant · Community · Mission · Event · Story · Lesson

**[DAB-SCH19a]** Avoid ambiguous names. Names should describe **what the business object is**, not how a screen uses it.

**[DAB-SCH19b]** Physical implementation may use plural table names per [ENG-004] — logical blueprint uses singular entity names.

---

## Identifier Strategy

**[DAB-SCH20]** Every table should include:

| Field | Purpose |
|-------|---------|
| Canonical ID | Stable internal primary key |
| Public ID | Shareable slug or code where appropriate |
| Creation Timestamp | When record born |
| Update Timestamp | Last material change |
| Status | Lifecycle state |
| Visibility | Permission class |
| Version | Optimistic locking / content revision |
| Audit Reference | Link to audit trail |

**[DAB-SCH20a]** Identifiers remain **stable** — never recycled across different entities.

---

## Foreign Key Philosophy

**[DAB-SCH21]** Relationships should be **explicit**.

Examples:

- Mission → Community
- Community → County
- Story → Mission
- Attendance → Event
- Leadership Assignment → Participant
- Mentorship → Participant

**[DAB-SCH21a]** Hidden relationships create long-term complexity.

**[DAB-SCH21b]** Cross-domain references are allowed; cross-database references never.

---

## Join Tables

**[DAB-SCH22]** Simple join tables are acceptable **only** when no business meaning exists.

If the relationship has history, metadata, lifecycle, permissions, or events — it becomes **its own entity**.

Example: **Membership** — not `ParticipantCommunityJoin`.

**[DAB-SCH22a]** Aligns with Relationship Ledger [DAB-REL21].

---

## Constraints

**[DAB-SCH23]** Define:

- Required relationships
- Uniqueness (natural keys: slug, FIPS, referral code)
- Referential integrity
- Lifecycle rules (valid status transitions)
- Visibility consistency
- Status validity

**[DAB-SCH23a]** Constraints preserve data quality at the database layer.

---

## Index Philosophy

**[DAB-SCH24]** Indexes should optimize:

- Identity lookup
- Community lookup
- Search
- Timeline queries
- Graph projection sync
- Reporting
- Permission evaluation

**[DAB-SCH24a]** Indexes should support **actual usage patterns**, not speculative over-indexing [ENG-DTR10].

**[DAB-SCH24b]** Every foreign key column indexed · partial indexes for active rows · composite indexes for hot paths.

---

## Views

**[DAB-SCH25]** Logical views support:

- Dashboards
- Reporting
- Community Health
- Growth Intelligence
- Leadership Intelligence
- Map summaries

**[DAB-SCH25a]** Views should **never replace** canonical tables.

---

## Materialized Views

**[DAB-SCH26]** Use when expensive calculations become common.

Examples: Community Health · Growth Metrics · Statewide Rollups · Knowledge Statistics

**[DAB-SCH26a]** Materialized views improve performance; canonical data remains source of truth.

---

## Read Models

**[DAB-SCH27]** Separate optimized read models may support:

- Search
- Maps
- Analytics
- AI Retrieval
- Notifications

**[DAB-SCH27a]** Read models remain **derived** from canonical data and are rebuildable.

---

## Historical Tables

**[DAB-SCH28]** Historical preservation should include:

- Leadership history
- Community history
- Mission history
- Invitation history
- Status history
- Relationship history

**[DAB-SCH28a]** History becomes institutional memory [LHE-001 · CJT-001].

---

## Soft Deletes

**[DAB-SCH29]** Prefer:

- Archived
- Inactive
- Superseded

Instead of physical deletion for important operational records.

**[DAB-SCH29a]** Historical continuity is valuable. Deletion reserved for privacy, safety, legal, and duplicate correction [DAB-PH22].

---

## Partition Strategy

**[DAB-SCH30]** Prepare for future partitioning by:

- Events
- Audit
- Notifications
- Timeline
- Search
- AI Logs

**[DAB-SCH30a]** Large datasets remain manageable at statewide scale. V1 may run unpartitioned; architecture anticipates growth.

---

## Schema Evolution

**[DAB-SCH31]** The schema should evolve through:

- New tables
- New columns
- New relationship types
- Configuration
- Versioning

**[DAB-SCH31a]** Avoid breaking redesigns. Additive migration preferred [DAB-PH25].

---

## Migration Philosophy

**[DAB-SCH32]** Every structural change requires:

| Requirement | Purpose |
|-------------|---------|
| Migration | Versioned DDL artifact |
| Documentation | Master Data Dictionary update [DAB-015] |
| Rollback plan | Safe reversal path |
| Validation | Data integrity checks |
| Compatibility review | Cross-domain impact assessment |

**[DAB-SCH32a]** The schema evolves **intentionally**, not accidentally.

**[DAB-SCH32b]** Suggested migration order:

1. System + Registry (reference seed)
2. Identity + Community
3. Relationship Ledger
4. Leadership + Mission
5. Experience + Growth
6. Knowledge + Partnership + Capacity + Communication
7. Intelligence + Analytics projections

---

## Performance Philosophy

**[DAB-SCH33]** Optimize for:

- Community queries
- Timeline queries
- Relationship traversal
- Search
- Maps
- Reporting
- Graph synchronization

**[DAB-SCH33a]** Performance should follow **observed usage** rather than speculation.

---

## Row-Level Security (Implementation Note)

**[DAB-SCH34]** When implemented in Postgres [ENG-004 · PRE-001]:

- RLS on all tenant-scoped tables
- Policies derive from platform role + community membership + data class
- Service role bypasses RLS for batch jobs only — never client-facing

---

## Canonical Schema Registry

**[DAB-SCH35]** **Major Architectural Recommendation:** Maintain a **Canonical Schema Registry** as the governing catalog for every schema and table.

For each schema, the registry documents:

| Field | Description |
|-------|-------------|
| Business purpose | Why this schema exists |
| Owning service | Domain service responsible |
| Tables within schema | Logical entity list |
| Relationships to other schemas | Cross-domain FK map |
| Primary identifiers | ID strategy per entity |
| Canonical constraints | Uniqueness and integrity rules |
| Index strategy | Hot paths and partial indexes |
| Read models | Derived views and materializations |
| Graph projections | CKG node/edge participation |
| Search participation | Index types |
| Analytics participation | Rollup sources |
| AI retrieval participation | Chunk/embedding sources |
| Migration history | Version trail |

**[DAB-SCH35a]** The Canonical Schema Registry is the bridge between architecture and implementation.

**[DAB-SCH35b]** Live spec: `data/registry/database-schema-blueprint.json`

**[DAB-SCH35c]** Instead of treating the database as a collection of tables, Burt — and any future developers or AI assistants — understand how each schema contributes to the COS and how changes in one domain affect the rest.

---

## Burt Implementation Guidance

**[DAB-SCH36]** Implementation should:

1. Build schemas around business domains
2. Keep relationships explicit
3. Use migrations exclusively
4. Preserve history wherever practical
5. Separate operational data from projections
6. Design for graph synchronization and future scaling
7. Consult the Canonical Schema Registry before any DDL

---

## AC-110 — Acceptance Criteria

Volume 2.4 is complete when:

- [x] **[AC-110a]** Domain schemas are defined. `[DAB-SCH04–SCH18]`
- [x] **[AC-110b]** Ownership boundaries are established. `[Domain sections]`
- [x] **[AC-110c]** Naming, identifiers, constraints, and indexes are documented. `[DAB-SCH19–SCH24]`
- [x] **[AC-110d]** Read models, views, history, and migration philosophies are incorporated. `[DAB-SCH25–SCH32]`
- [x] **[AC-110e]** Canonical Schema Registry established. `[DAB-SCH35]`
- [x] **[AC-110f]** Burt has a complete architectural blueprint for translating the COS into a robust relational database. `[DAB-SCH36]`

---

**Next step:** [2.5 — Community Knowledge Graph Schema](KNOWLEDGE_GRAPH_SCHEMA.md) [DAB-006]

**End of Volume 2.4.**
