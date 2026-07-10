# Build Volume 2.14 — Master Data Dictionary & Data Governance

### Data Architecture Bible

**Document ID:** VOLUME-002.14 · **DAB-015**  
**Artifact:** `MASTER_DATA_DICTIONARY.md`  
**Status:** Canonical  
**Priority:** Highest

**Builds on:** All Volume 2 steps 2.1–2.13 · [DAB-001](../master/DATA_ARCHITECTURE_BIBLE.md)  
**Live spec:** `data/registry/master-data-dictionary.json`

> Every piece of data has one canonical definition, one owner, and one meaning.

---

## Purpose

**[DAB-MDD01]** The Master Data Dictionary & Data Governance defines the **official language** of the Community Operating System.

**[DAB-MDD01a]** It is the highest authority for every:

Entity · Table · Field · Relationship · Enumeration · Identifier · Configuration object · Event · Graph node · Graph edge · Search object · Analytics metric · AI knowledge object

**[DAB-MDD01b]** If Volume 2 is the **blueprint**, the Master Data Dictionary is the **encyclopedia**.

**[DAB-MDD01c]** No developer, AI assistant, migration, API, or report should invent new data structures **outside this governance process**.

---

## Guiding Principle

**[DAB-MDD02]**

> **Every piece of data has one canonical definition, one owner, and one meaning.**

**[DAB-MDD02a]** **Consistency is more valuable than convenience.**

---

## Philosophy

**[DAB-MDD03]** The Master Data Dictionary exists to prevent:

Duplicate fields · Conflicting terminology · Multiple definitions · Schema drift · Inconsistent APIs · AI hallucination about data · Reporting inconsistencies

**[DAB-MDD03a]** Over years of development, this document **protects architectural integrity** [DAB-PH24].

---

## Governance Hierarchy

**[DAB-MDD04]**

```text
Volume 0
(Constitution)
        ↓
Volume 1
(Engineering)
        ↓
Volume 2
(Data)
        ↓
Master Data Dictionary
        ↓
Database
        ↓
API
        ↓
Applications
        ↓
AI
```

**[DAB-MDD04a]** **Everything derives from the Dictionary.**

---

## Canonical Vocabulary

**[DAB-MDD05]** Every business term receives **one official definition**.

Examples: Participant · Community · County · Institution · Mission · Initiative · Project · Task · Committee · Story · Lesson · Knowledge · Legacy · Partnership · Volunteer · Leadership · Opportunity · Capacity · Mentorship · Digital Twin · Community Brain · Living History

**[DAB-MDD05a]** **No competing definitions are permitted** [DAB-E01–E43 · DAB-003].

---

## Canonical Entity Registry

**[DAB-MDD06]** For every entity record:

Official Name · Description · Business Purpose · Owning Service · Database Schema · Primary Identifier · Lifecycle · Visibility Rules · Relationships · Graph Participation · Search Participation · Analytics Participation · AI Participation · Documentation Reference

**[DAB-MDD06a]** Every entity has **one canonical definition** [DAB-003 · CED].

---

## Canonical Field Registry

**[DAB-MDD07]** Every field records:

Field Name · Description · Data Type · Nullable · Default · Validation Rules · Source · Owner · Version Introduced · Deprecation Status · Sensitive Classification · Search Participation · AI Visibility

**[DAB-MDD07a]** **Fields are governed assets** — not ad hoc columns.

---

## Identifier Registry

**[DAB-MDD08]** Define every identifier.

Examples: Participant ID · Community ID · Mission ID · Event ID · Knowledge ID · Story ID · Public IDs · External IDs · Correlation IDs

**[DAB-MDD08a]** Identifiers remain **globally consistent** [RCN-001 · ENG-DTR08].

---

## Enumeration Registry

**[DAB-MDD09]** Enumerations become **governed objects**.

Examples: Statuses · Visibility · Community Types · Mission Types · Relationship Types · Notification Priorities · Leadership Levels · Event Types · Permission Levels

**[DAB-MDD09a]** Enumerations **evolve through governance** — not inline magic strings.

**[DAB-MDD09b]** Core enums cataloged in live spec: `data/registry/master-data-dictionary.json` · `coreEnums`

---

## Relationship Registry

**[DAB-MDD10]** Every relationship records:

Source Entity · Target Entity · Relationship Type · Cardinality · Lifecycle · Visibility · History Rules · Graph Projection · AI Participation

**[DAB-MDD10a]** Relationships remain **standardized** [DAB-004 · DAB-006].

---

## Configuration Registry

**[DAB-MDD11]** Track:

Templates · Roles · Permissions · Feature Flags · Workflow Definitions · Prompt Profiles · Taxonomies

**[DAB-MDD11a]** **Configuration becomes fully documented** [DAB-009 · DCL-001].

---

## Event Registry

**[DAB-MDD12]** Every event definition includes:

Event Name · Category · Producer · Consumers · Payload Definition · Visibility · Timeline Participation · Graph Projection · Notification Participation · Analytics Participation

**[DAB-MDD12a]** **Events become governed contracts** [DAB-007 · DAB-EVT].

---

## Search Registry

**[DAB-MDD13]** Every searchable object defines:

Indexed Fields · Ranking Signals · Facets · Permission Rules · Semantic Participation · Autocomplete · Discovery Categories

**[DAB-MDD13a]** **Search becomes standardized** [DAB-011 · UDI].

---

## AI Registry

**[DAB-MDD14]** Every AI object defines:

Knowledge Sources · Prompt Profiles · Retrieval Objects · Embeddings · Citation Rules · Explainability · Approval Requirements

**[DAB-MDD14a]** **AI becomes governed** [DAB-013 · CKF].

---

## Analytics Registry

**[DAB-MDD15]** Every metric records:

Definition · Formula · Source Data · Refresh Schedule · Dashboard Usage · Confidence · Historical Scope

**[DAB-MDD15a]** **Metrics remain reproducible** [DAB-012 · CHO].

---

## Data Stewardship

**[DAB-MDD16]** Every governed object has:

Owner · Reviewer · Approval Authority · Review Schedule · Documentation

**[DAB-MDD16a]** **Stewardship protects long-term quality.**

**[DAB-MDD16b]** Stewards:

| Scope | Steward |
|-------|---------|
| Platform schema | Platform Kernel / Engineering |
| Community data | Community leaders |
| Domain entities | Product + Engineering domain owners |
| Retention & compliance | Operations |

---

## Version Governance

**[DAB-MDD17]** Every change requires:

Proposal · Review · Approval · Migration Plan · Documentation · Version Increment · Rollback Strategy

**[DAB-MDD17a]** **Evolution becomes intentional** [ENG-DTR08].

---

## Naming Standards

**[DAB-MDD18]** Rules:

- Business language
- Singular entities
- Consistent verbs
- No abbreviations unless standardized
- Avoid implementation-specific names

**[DAB-MDD18a]** Names should remain **understandable decades later**.

**[DAB-MDD18b]** Implementation conventions (schema, table, column, event type notation) documented in [Database Schema Blueprint](DATABASE_SCHEMA_BLUEPRINT.md) [DAB-005] — the Dictionary governs **meaning**, the Blueprint governs **physical layout**.

---

## Change Management

**[DAB-MDD19]** Changes are categorized:

Correction · Enhancement · Deprecation · Replacement · Breaking Change · Historical Preservation

**[DAB-MDD19a]** Each follows an **appropriate approval path**.

**[DAB-MDD19b]** Change process:

1. Propose change in requirements registry trace
2. Update relevant Volume 2 step doc
3. Update this dictionary
4. Update `master-data-dictionary.json`
5. Generate migration
6. Update search/graph/AI/analytics projections
7. Record in BUILD-LOG

---

## Deprecation Policy

**[DAB-MDD20]** Never immediately delete canonical definitions. Instead:

Deprecated → Replacement identified → Migration completed → Historical documentation preserved → Retired

**[DAB-MDD20a]** **Institutional memory remains intact.**

---

## Data Quality Framework

**[DAB-MDD21]** Govern:

Completeness · Consistency · Accuracy · Freshness · Integrity · Relationship validity · Documentation quality · Search quality

**[DAB-MDD21a]** **Quality is continuously monitored** — not a one-time audit.

---

## Governance Reviews

**[DAB-MDD22]** Periodic reviews include:

Unused fields · Duplicate concepts · Relationship consistency · Taxonomy health · Configuration complexity · Schema growth · AI retrieval quality

**[DAB-MDD22a]** **Architecture evolves thoughtfully.**

---

## AI Governance

**[DAB-MDD23]** AI may:

- Suggest improvements
- Detect duplication
- Recommend simplification
- Generate documentation
- Identify inconsistencies

**[DAB-MDD23a]** AI **never modifies the dictionary without approval** [DAB-AIK02 · AIB-001].

---

## Schema Reference

**[DAB-MDD24]** Physical schema registry maintained in [Database Schema Blueprint](DATABASE_SCHEMA_BLUEPRINT.md) [DAB-005]:

15 domain schemas · 60+ tables · Canonical Schema Registry pattern

**[DAB-MDD24a]** The Master Data Dictionary **governs meaning**; the Schema Blueprint **governs structure**. Both remain synchronized.

---

## Canonical Metadata Registry

**[DAB-MDD25]** **Major Architectural Recommendation:** Create a **Canonical Metadata Registry** as the connective tissue for all governed objects.

**[DAB-MDD25a]** Every governed object — entity, field, relationship, event, API contract, search index, AI knowledge object, analytics metric, or configuration item — carries a **standardized metadata envelope**.

**[DAB-MDD25b]** Each metadata record includes:

Canonical identifier · Human-readable name · Description · Owning domain · Steward · Version · Status (Draft, Active, Deprecated, Retired) · Source documentation · Related architecture documents · Security classification · Privacy classification · Search participation · Community Knowledge Graph participation · Digital Twin participation · AI retrieval eligibility · Analytics eligibility · Creation and revision history

**[DAB-MDD25c]** A developer selecting an entity immediately understands:

- Where it lives in the database
- Which services own it
- Which APIs expose it
- Which search indexes include it
- Which graph projections reference it
- Which Digital Twins consume it
- Which analytics depend on it
- Which AI retrieval pipelines may use it
- Which governance rules apply

**[DAB-MDD25d]** Live spec: `data/registry/master-data-dictionary.json` · `canonicalMetadataRegistry`

---

## Volume 2 Completion

**[DAB-MDD26]** With Volume 2 complete, Burt has three complementary blueprints:

| Volume | Defines |
|--------|---------|
| **Volume 0** | **Why** the Community Operating System exists and the principles it must uphold |
| **Volume 1** | **How** the software is engineered |
| **Volume 2** | **How** every piece of information is represented, governed, and connected |

**[DAB-MDD26a]** Those three volumes form a **coherent foundation for implementation** and provide a stable reference as the platform grows over time.

**[DAB-MDD26b]** Next: close Volume 1 gap [1.5 API Architecture ENG-005] · then Phase 7 implementation.

---

## Burt Implementation Guidance

**[DAB-MDD27]** Implementation should:

1. **Consult the Master Data Dictionary** before creating new fields or entities
2. **Extend existing vocabulary** whenever practical
3. Require **governance review** for structural additions
4. Keep **documentation synchronized** with implementation
5. Treat the Dictionary as the **canonical reference for every layer** of the platform
6. Consult **Canonical Metadata Registry** spec before registering new governed objects

**[DAB-MDD27a]** Checklist before any schema change: entity in CED → relationship in REL → field registered → visibility/classification → event type → search mapping → graph projection → AI eligibility → analytics metric → MDD update → BUILD-LOG.

---

## AC-120 — Acceptance Criteria

Volume 2.14 is complete when:

- [x] **[AC-120a]** Governance philosophy is documented. `[DAB-MDD03]`
- [x] **[AC-120b]** Canonical registries are defined. `[DAB-MDD06–MDD15]`
- [x] **[AC-120c]** Stewardship and version governance are established. `[DAB-MDD16, MDD17]`
- [x] **[AC-120d]** Naming, change management, and AI governance are incorporated. `[DAB-MDD18–MDD23]`
- [x] **[AC-120e]** Canonical Metadata Registry specified. `[DAB-MDD25]`
- [x] **[AC-120f]** Burt has a single authoritative reference for every data concept in the COS. `[DAB-MDD27]`

---

**Volume 2 complete.** All 14 steps documented · `data/registry/data-architecture-bible.json` · status: complete

**End of Volume 2.14 — Master Data Dictionary & Data Governance.**
