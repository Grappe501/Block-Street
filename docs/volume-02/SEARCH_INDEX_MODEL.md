# Build Volume 2.10 — Search Index Model

### Data Architecture Bible

**Document ID:** VOLUME-002.10 · **DAB-011**  
**Artifact:** `SEARCH_INDEX_MODEL.md`  
**Status:** Canonical  
**Priority:** Critical

**Builds on:** [1.10 Search Architecture](../volume-01/SEARCH_ARCHITECTURE.md) [ENG-010] · [Discovery Engine](../volume-01/DISCOVERY_ENGINE.md) [DGE-001]  
**Live spec:** `data/registry/search-index-model.json`

---

## DAB-SIX01 — Purpose

**[DAB-SIX01]** Defines search indexes, full-text, semantic, ranking metadata, suggestions, and geographic indexes — supporting the **Discovery Engine**.

---

## DAB-SIX02 — Search Document Envelope

**[DAB-SIX02a]** Table: `search.search_documents`:

```text
search_documents (
  id, entity_type, entity_id,
  title, body, summary,
  community_scope, visibility, data_class,
  geo_point,              -- PostGIS point optional
  county_id, institution_id,
  tags[], entity_status,
  ranking_boost, freshness_at,
  indexed_at, source_version
)
```

**[DAB-SIX02b]** One document per searchable entity instance — upserted on domain events.

---

## DAB-SIX03 — Index Types

| Index | Technology V1 | Contents |
|-------|---------------|----------|
| **Full-text** | Postgres `tsvector` + GIN | title, body, summary |
| **Entity** | B-tree composites | type + community + status |
| **Geographic** | PostGIS | communities, events, institutions |
| **Suggestion** | Prefix table / trigram | autocomplete candidates |
| **Semantic** | pgvector V1.1+ | embedding column on search_documents |

---

## DAB-SIX04 — Full-Text Index

**[DAB-SIX04a]** Column: `search_vector tsvector` generated from weighted fields:

- A: title
- B: summary  
- C: body
- D: tags

**[DAB-SIX04b]** Language: `english` default; configurable per document.

---

## DAB-SIX05 — Ranking Metadata

**[DAB-SIX05a]** Stored fields for ranking [ENG-SR15]:

```text
rank_signals (document_id, signal_type, signal_value, computed_at)
```

**[DAB-SIX05b]** Signals: recency, community relevance, participation overlap, leadership boost, quality score.

**[DAB-SIX05c]** PRE filters results **before** ranking — never index unauthorized content.

---

## DAB-SIX06 — Suggestion Index

**[DAB-SIX06a]** Table: `search.suggestions (phrase, entity_type, entity_id, weight)`.

**[DAB-SIX06b]** Built from entity names, community titles, county names, mission titles.

**[DAB-SIX06c]** Trigram index for fuzzy match: `pg_trgm`.

---

## DAB-SIX07 — Geographic Index

**[DAB-SIX07a]** Entities with location expose `geo_point` + admin boundaries (county_id).

**[DAB-SIX07b]** Supports map search and "near me" discovery [ENG-011 · ADT-002].

---

## DAB-SIX08 — Semantic Index (V1.1+)

**[DAB-SIX08a]** Column: `embedding vector(1536)` on `search_documents` or separate `search.semantic_chunks`.

**[DAB-SIX08b]** Chunk strategy aligns with [AI_KNOWLEDGE_MODEL.md](AI_KNOWLEDGE_MODEL.md) [DAB-AIK].

---

## DAB-SIX09 — Index Jobs

**[DAB-SIX09a]** Table: `search.index_jobs (entity_type, entity_id, operation, status, attempts, last_error)`.

**[DAB-SIX09b]** Worker consumes domain events — at-least-once processing, idempotent upsert.

---

## AC-116 — Acceptance Criteria

- [x] **[AC-116a]** Search document envelope and index types documented. `[DAB-SIX02, SIX03]`
- [x] **[AC-116b]** Full-text, ranking, and suggestion indexes defined. `[DAB-SIX04–SIX06]`
- [x] **[AC-116c]** Geographic, semantic, and index job model specified. `[DAB-SIX07–SIX09]`

---

**Next step:** [2.11 — Analytics & Metrics Model](ANALYTICS_DATA_MODEL.md) [DAB-012]

**End of Volume 2.10.**
