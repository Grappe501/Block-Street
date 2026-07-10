# VOLUME 2 — Data Architecture Bible

**Document ID:** VOLUME-002 · **DAB-001**  
**Artifact:** `DATA_ARCHITECTURE_BIBLE.md`  
**Status:** Canonical · **14/14 steps complete**  
**Priority:** Critical — single source of truth for the database

**Master sequence:** [VOLUME_2_MASTER_SEQUENCE.md](../volume-02/VOLUME_2_MASTER_SEQUENCE.md)  
**Live spec:** `data/registry/data-architecture-bible.json`

> **What is the data model that powers everything?**

Volume 1 answered: *How is the software built?*  
Volume 2 answers: *What is the data model that powers everything?*

**Governed by:** [Volume 0](MASTER_ARCHITECTURE_BIBLE.md) · [Volume 1](ENGINEERING_ARCHITECTURE_BIBLE.md) · [1.4 Database Architecture](../volume-01/DATABASE_ARCHITECTURE.md) [ENG-004]

---

## DAB-M01 — Purpose

**[DAB-M01]** The **single source of truth for persistence** — entities, relationships, schemas, graph projections, events, calendars, documents, configuration, search, analytics, AI knowledge, security, and field-level governance.

**[DAB-M01a]** Phase registries remain authoritative for **domain rules**; Volume 2 is authoritative for **schema and data shape**.

---

## Step Sequence (2.1–2.14)

| Step | Document | Requirement | Status |
|------|----------|-------------|--------|
| **2.1** | [Data Philosophy](../volume-02/DATA_PHILOSOPHY.md) | DAB-002 | ✅ |
| **2.2** | [Canonical Entity Dictionary](../volume-02/CANONICAL_ENTITY_DICTIONARY.md) | DAB-003 | ✅ |
| **2.3** | [Relationship Data Model](../volume-02/RELATIONSHIP_DATA_MODEL.md) | DAB-004 | ✅ |
| **2.4** | [Database Schema Blueprint](../volume-02/DATABASE_SCHEMA_BLUEPRINT.md) | DAB-005 | ✅ |
| **2.5** | [Knowledge Graph Schema](../volume-02/KNOWLEDGE_GRAPH_SCHEMA.md) | DAB-006 | ✅ |
| **2.6** | [Event Data Model](../volume-02/EVENT_DATA_MODEL.md) | DAB-007 | ✅ |
| **2.7** | [Time & Calendar Data Model](../volume-02/TIME_CALENDAR_DATA_MODEL.md) | DAB-008 | ✅ |
| **2.8** | [Media & Document Model](../volume-02/MEDIA_DOCUMENT_MODEL.md) | DAB-009 | ✅ |
| **2.9** | [Configuration Model](../volume-02/CONFIGURATION_MODEL.md) | DAB-010 | ✅ |
| **2.10** | [Search Index Model](../volume-02/SEARCH_INDEX_MODEL.md) | DAB-011 | ✅ |
| **2.11** | [Analytics Data Model](../volume-02/ANALYTICS_DATA_MODEL.md) | DAB-012 | ✅ |
| **2.12** | [AI Knowledge Model](../volume-02/AI_KNOWLEDGE_MODEL.md) | DAB-013 | ✅ |
| **2.13** | [Security & Privacy Model](../volume-02/SECURITY_PRIVACY_MODEL.md) | DAB-014 | ✅ |
| **2.14** | [Master Data Dictionary](../volume-02/MASTER_DATA_DICTIONARY.md) | DAB-015 | ✅ |

**Full detail:** [VOLUME_2_MASTER_SEQUENCE.md](../volume-02/VOLUME_2_MASTER_SEQUENCE.md)

---

## Canonical Entity Catalog [DAB-M02]

| Entity | Step ref |
|--------|----------|
| Participant, Community, County, Institution | [CED](CANONICAL_ENTITY_DICTIONARY.md) DAB-E01–E04 |
| Team, Mission, Project, Event, Task, Initiative | DAB-E05–E08, E15–E16 |
| Opportunity, Partnership, Resource | DAB-E09–E11 |
| Story, Lesson, Knowledge Object | DAB-E12–E14 |

**16 primary entities** · **15 Postgres schemas** · **60+ tables** in master dictionary.

---

## Architecture Summary

```text
Canonical SQL (Postgres)
  ├── Domain schemas (identity → media)
  ├── graph.entity_relationships
  └── events.domain_events
        ↓ projections
  Community Knowledge Graph · Search · AI · Analytics · Twins
```

---

## Completion Standard

Volume 2 is complete when Burt has blueprints for:

- [x] Every entity, relationship, and schema
- [x] Graph, event, calendar, and document models
- [x] Configuration, search, analytics, and AI knowledge objects
- [x] Security, privacy, and master field dictionary

**Next recommended:** [Volume 1.5 — API Architecture](../volume-01/API_ARCHITECTURE.md) [ENG-005] · Phase 7 implementation.

---

## AC-078 — Acceptance Criteria (umbrella)

- [x] **[AC-078a]** Fourteen-step Volume 2 sequence documented. `[VOLUME_2_MASTER_SEQUENCE]`
- [x] **[AC-078b]** Entity catalog and relationship model complete. `[DAB-003, DAB-004]`
- [x] **[AC-078c]** Schema blueprint and specialized models specified. `[DAB-005–DAB-013]`
- [x] **[AC-078d]** Master data dictionary and governance established. `[DAB-015]`
- [ ] **[AC-078e]** Full DDL migrations (implementation Phase 7+).

---

**End of Volume 2 umbrella.**
