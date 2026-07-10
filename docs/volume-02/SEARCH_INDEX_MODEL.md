# Build Volume 2.10 — Search Index Data Model

### Data Architecture Bible

**Document ID:** VOLUME-002.10 · **DAB-011**  
**Artifact:** `SEARCH_INDEX_MODEL.md`  
**Status:** Canonical  
**Priority:** Critical

**Builds on:** [2.6 Event Data Model](EVENT_DATA_MODEL.md) [DAB-007] · [2.5 Knowledge Graph](KNOWLEDGE_GRAPH_SCHEMA.md) [DAB-006] · [1.10 Search Architecture](../volume-01/SEARCH_ARCHITECTURE.md) [ENG-010] · [Discovery Engine](../volume-01/DISCOVERY_ENGINE.md) [DGE-001]  
**Live spec:** `data/registry/search-index-model.json`

> The search index is **not** the database. It is an optimized, permission-aware projection for discovery.

---

## Purpose

**[DAB-SIX01]** The Search Index Data Model defines how the Community Operating System transforms canonical data into **high-performance, permission-aware search structures**.

**[DAB-SIX01a]** The index is built from:

- Canonical relational database
- Community Knowledge Graph [DAB-006]
- Community Event Ledger [DAB-007]
- Supporting metadata

**[DAB-SIX01b]** Its purpose is to make discovery **fast, relevant, explainable, and secure**.

---

## Guiding Principle

**[DAB-SIX02]**

> **Search should never become another source of truth.**

**[DAB-SIX02a]** The database owns truth. The search index owns **discovery** [DAB-PH19].

---

## Philosophy

**[DAB-SIX03]** The Community Operating System is not a document search engine. It is a **relationship-centered discovery platform**.

**[DAB-SIX03a]** Search should answer:

- What am I looking for?
- What else is related?
- What should I discover next?
- Who should I connect with?
- What knowledge already exists?
- What opportunities fit my interests?

**[DAB-SIX03b]** Search becomes **intelligent navigation** [DGE-001].

---

## Search Architecture

**[DAB-SIX04]** The search architecture consists of six layers:

```text
Canonical Database
        ↓
Projection Engine
        ↓
Search Index
        ↓
Ranking Engine
        ↓
Discovery Engine
        ↓
Participant Experience
```

**[DAB-SIX04a]** Each layer has **one responsibility** — indexing separate from ranking separate from presentation.

**[DAB-SIX04b]** Projection Engine aligns with Unified Graph Projection Engine [DAB-KGS13] and Community Event Ledger replay [DAB-EVT14].

---

## Canonical Sources

**[DAB-SIX05]** Indexes may be built from:

Participants · Communities · Counties · Institutions · Missions · Events · Stories · Lessons · Playbooks · Community Brain · Partnerships · Resources · Knowledge Graph · Community Event Ledger · Digital Twins

**[DAB-SIX05a]** Canonical data remains **authoritative** — index is always rebuildable.

---

## Search Object

**[DAB-SIX06]** Every indexed object includes:

| Field | Purpose |
|-------|---------|
| Canonical Entity ID | Link to source of truth |
| Entity Type | Index category |
| Title | Display and match |
| Summary | Short description |
| Search Text | Full-text body |
| Keywords | Controlled terms |
| Tags | Discovery aids |
| Visibility | Permission class |
| Permission Scope | Community/role scope |
| Location | Geographic metadata |
| Relationships | Graph edge refs |
| Ranking Signals | Explainable scores |
| Last Indexed | Sync timestamp |
| Version | Source version |

**[DAB-SIX06a]** The search object is optimized for **retrieval** rather than storage.

---

## Index Categories

**[DAB-SIX07]** Nine primary index categories aligned to business domains.

### Identity Index

**[DAB-SIX07a]** Supports: Participants · Mentors · Leaders · Volunteers · Skills · Interests

### Community Index

**[DAB-SIX07b]** Supports: Communities · Committees · Community Profiles · Community Health · Growth

### Registry Index

**[DAB-SIX07c]** Supports: Counties · Cities · Institutions · Regions · Facilities

### Mission Index

**[DAB-SIX07d]** Supports: Initiatives · Missions · Projects · Tasks · Milestones

### Experience Index

**[DAB-SIX07e]** Supports: Events · Training · Workshops · Volunteer Opportunities · Attendance

### Knowledge Index

**[DAB-SIX07f]** Supports: Stories · Lessons · Playbooks · Mission Library · Community Brain · Legacy

### Partnership Index

**[DAB-SIX07g]** Supports: Organizations · Partners · Collaborations · Shared Initiatives · Facilities

### Capacity Index

**[DAB-SIX07h]** Supports: Skills · Equipment · Transportation · Resources · Availability

### Intelligence Index

**[DAB-SIX07i]** Supports: Recommendations · Insights · Patterns · Digital Twins · Search intelligence

**[DAB-SIX07i1]** Intelligence index entries remain **derived** — never canonical [DAB-SCH16a].

---

## Geographic Index

**[DAB-SIX08]** Every searchable object may include:

State · County · Region · City · Institution · Coordinates · Map Layers

**[DAB-SIX08a]** Geography supports **spatial discovery** — map search and "near me" [ENG-011 · ADT-002].

---

## Temporal Index

**[DAB-SIX09]** Support:

- Creation date
- Modification
- Historical events
- Timeline position
- Upcoming events
- Anniversaries

**[DAB-SIX09a]** Time becomes **searchable** — fed by Community Event Ledger [DAB-EVT17].

---

## Relationship Index

**[DAB-SIX10]** Index relationship metadata.

Examples: Mentorship · Leadership · Participation · Community membership · Shared missions · Collaborations

**[DAB-SIX10a]** **Relationship-aware search** becomes possible [DAB-REL18].

---

## Semantic Index

**[DAB-SIX11]** Future semantic capabilities include:

- Embeddings
- Topic clustering
- Intent matching
- Similarity search
- Knowledge recommendations

**[DAB-SIX11a]** Semantic search remains **derived** — V1.1+ optional [DAB-013 · ENG-010].

**[DAB-SIX11b]** Chunk strategy aligns with AI Knowledge Model [DAB-AIK].

---

## Permission Index

**[DAB-SIX12]** Every indexed object stores permission metadata.

Before returning results:

- Visibility is evaluated
- Community scope is evaluated
- Role permissions are evaluated

**[DAB-SIX12a]** Sensitive objects **never appear** in unauthorized searches [PRE-001 · DAB-SPM].

**[DAB-SIX12b]** PRE filters **before** ranking — never index unauthorized content.

---

## Ranking Signals

**[DAB-SIX13]** Ranking may consider:

Text relevance · Relationship proximity · Knowledge quality · Community context · Recent activity · Leadership relevance · Participant interests · Geographic proximity · Freshness

**[DAB-SIX13a]** Search ranking should remain **explainable** — cite signals in results [ENG-SR15 · CIF-001].

---

## Facets

**[DAB-SIX14]** Support faceted search.

Examples: County · Community · Institution · Mission · Knowledge Area · Date · Topic · Status · Visibility · Type

**[DAB-SIX14a]** Facets simplify **exploration** without replacing structured navigation.

---

## Autocomplete

**[DAB-SIX15]** Autocomplete should support:

Participants · Communities · Counties · Events · Stories · Knowledge · Playbooks · Organizations

**[DAB-SIX15a]** Autocomplete **respects permissions** — prefix/trigram indexes on authorized entities only.

---

## Saved Search Objects

**[DAB-SIX16]** Participants may save:

Search queries · Filters · Collections · Alerts · Discovery preferences

**[DAB-SIX16a]** Saved searches become **reusable data** — participant-owned operational records, not index truth.

---

## Discovery Objects

**[DAB-SIX17]** Discovery recommendations include:

Suggested communities · Volunteer opportunities · Relevant stories · Nearby events · Mentors · Knowledge · Partnerships

**[DAB-SIX17a]** Discovery **extends search** — proactive recommendations via Discovery Engine [DGE-001].

---

## Reindex Strategy

**[DAB-SIX18]** Indexes should support:

- Incremental updates (domain events)
- Full rebuild
- Replay from Event Ledger [DAB-EVT14]
- Verification
- Health monitoring

**[DAB-SIX18a]** Reindexing should be **automated** — idempotent upsert by entity ID.

**[DAB-SIX18b]** Index jobs track: entity type, operation, status, attempts, last error.

---

## Search Observability

**[DAB-SIX19]** Track:

Query latency · Popularity · No-result searches · Ranking quality · Permission filtering · Click-through · Discovery success

**[DAB-SIX19a]** Search **continuously improves** — observability feeds analytics [DAB-012].

---

## AI Integration

**[DAB-SIX20]** AI may:

- Generate search summaries
- Recommend filters
- Interpret search intent
- Suggest related knowledge
- Identify overlooked resources
- Generate semantic queries

**[DAB-SIX20a]** AI **assists search without changing canonical data** [DAB-PH10 · CIF-001].

---

## Universal Discovery Index

**[DAB-SIX21]** **Major Architectural Recommendation:** Create a **Universal Discovery Index** as the unified search projection for the entire platform.

**[DAB-SIX21a]** Instead of isolated indexes per feature, every canonical entity projects into **one standardized discovery model**.

**[DAB-SIX21b]** Each indexed object contains:

- Canonical entity reference
- Human-readable title and summary
- Searchable text
- Relationships from Community Knowledge Graph
- Geographic metadata
- Timeline metadata
- Visibility and permission metadata
- Ranking signals
- Semantic embeddings (when enabled)
- Digital Twin references (where applicable)

**[DAB-SIX21c]** The Universal Discovery Index becomes the foundation for:

Global Search · Discovery Engine · AI retrieval · Recommendation systems · Dashboard suggestions · Map search · Community exploration · Knowledge reuse

**[DAB-SIX21d]** Principle: **Canonical data is written once, projected many times, and discovered through a single, coherent model.**

**[DAB-SIX21e]** Live spec: `data/registry/search-index-model.json` · `universalDiscoveryIndex`

---

## Burt Implementation Guidance

**[DAB-SIX22]** Implementation should:

1. Treat indexes as **projections**
2. Keep search **independent from storage technology**
3. Build **permission-aware indexes**
4. Separate **ranking from indexing**
5. Support **incremental and full reindexing**
6. Integrate with CKG and Community Event Ledger
7. Route all entity indexing through the **Universal Discovery Index**

**[DAB-SIX22a]** V1 implementation options documented in [ENG-010](../volume-01/SEARCH_ARCHITECTURE.md): Postgres `tsvector` + GIN, PostGIS, trigram — technology replaceable.

---

## AC-116 — Acceptance Criteria

Volume 2.10 is complete when:

- [x] **[AC-116a]** Search philosophy is documented. `[DAB-SIX03]`
- [x] **[AC-116b]** Search object model is defined. `[DAB-SIX06]`
- [x] **[AC-116c]** Index categories, ranking, facets, autocomplete, and discovery are established. `[DAB-SIX07–SIX17]`
- [x] **[AC-116d]** Permission, geographic, temporal, and semantic indexing are incorporated. `[DAB-SIX08–SIX12]`
- [x] **[AC-116e]** Universal Discovery Index specified. `[DAB-SIX21]`
- [x] **[AC-116f]** Burt has a complete blueprint for search and discovery. `[DAB-SIX22]`

---

**Next step:** [2.11 — Analytics & Metrics Model](ANALYTICS_DATA_MODEL.md) [DAB-012]

**End of Volume 2.10.**
