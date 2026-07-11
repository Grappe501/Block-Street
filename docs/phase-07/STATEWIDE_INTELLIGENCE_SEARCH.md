# Build 7.1 — Statewide Intelligence Search

**Document ID:** BUILD-007.1 · **SIS-001**  
**Artifact:** `STATEWIDE_INTELLIGENCE_SEARCH.md`  
**Status:** Canonical  
**Phase:** 7 — Intelligence Layer  
**Supersedes build detail for:** [SRCH-001](STATEWIDE_SEARCH.md)

> The platform must instantly find any piece of information stored anywhere in the CampaignOS ecosystem.

**Builds on:** [Search Architecture PSI-007](../volume-05/SEARCH_ARCHITECTURE.md) · [CKK-001](../canon/CANONICAL_KNOWLEDGE_KERNEL.md) · [KDG-001](../phase-03/KNOWLEDGE_DATA_GOVERNANCE.md)  
**Live spec:** `data/registry/statewide-intelligence-search.json` · **Index:** `data/search/`

---

## Purpose

**[SIS-M01]** The **Statewide Intelligence Search (SIS)** is the foundation of the Intelligence Layer. Every future intelligence feature depends on one capability: unified knowledge retrieval across structured data, documents, communications, media, locations, and relationships.

**[SIS-M01a]** Unlike traditional database search, SIS is a **knowledge retrieval engine** — one search bar, one index, one ranking model.

---

## Objectives

**[SIS-M02]** By the end of Build 7.1, users can:

- Search every person, organization, county, event, task, document, and conversation from one search bar
- Search using natural language instead of exact keywords (semantic-ready architecture)
- Filter and refine results by dozens of dimensions
- Save commonly used searches and build dynamic collections
- Surface the most relevant results based on context
- Search OCR text, AI transcripts, and document contents
- Return results in under one second for normal workloads
- Support future semantic/vector search without redesign

---

## SIS Architecture

**[SIS-M03]**

```text
                 Search Bar
                      │
        ┌─────────────┼─────────────┐
        │             │             │
 Keyword Search   Semantic Layer   AI Search
        │             │             │
        └─────────────┼─────────────┘
                      │
            Search Service API
                      │
        ┌─────────────┼─────────────┐
        │             │             │
     Indexer      Ranking Engine  Filters
                      │
              Unified Search Index
```

---

## Core Design Principles

**[SIS-M04] One Search** — Exactly one global search. Users never ask which module contains information.

**[SIS-M05] Search Everything** — Every searchable object implements a common `SearchObject` interface.

---

## Canonical Search Object

**[SIS-M06]** Every indexed item:

```text
search_id · entity_type · entity_id · title · subtitle · summary · full_text
keywords · tags · created_at · updated_at · county · organization · owner
permissions · status · latitude · longitude · importance_score · popularity_score
relationship_score · embedding_reference
```

---

## Search Modes

**[SIS-M07]** Standard (exact) · Fuzzy (misspellings, nicknames) · Semantic (meaning — future-ready) · Geographic (radius, county, district, ZIP)

---

## Intelligent Ranking

**[SIS-M08]** Overall score combines: keyword match · semantic similarity · relationship · popularity · freshness · importance · user behavior · campaign priority

**[SIS-M08a]** Ranking is explainable — each result includes score breakdown.

---

## Search Filters

**[SIS-M09]** Entity · Geography · Time · Campaign · Ownership · Status · AI Confidence

---

## Search Results UI

**[SIS-M10]** Unified result cards · quick preview on hover · type-ahead suggestions · saved searches · search collections (living dashboards)

---

## Permission Model

**[SIS-M11]** Search only returns objects the user can access. Every result permission-filtered. No leaks.

---

## Performance Targets

**[SIS-M12]** Suggestions <100ms · Keyword <300ms · Filtered <500ms · Semantic <800ms · Large document <1s

---

## Search API

**[SIS-M13]**

```text
GET  /api/search
GET  /api/search/suggestions
GET  /api/search/saved
POST /api/search/save
GET  /api/search/status
```

---

## Index Pipeline

**[SIS-M14]** New Record → Change Event → Indexer Queue → Text Extraction → OCR → Metadata → Permissions → Embedding (future) → Unified Index

---

## Administrative Console

**[SIS-M15]** Index health · queue backlog · latency · top terms · zero-result searches · coverage by entity type

---

## Acceptance Criteria

**[SIS-M16]** Build 7.1 is complete when:

- Single search bar queries every supported entity type
- Results ranked by configurable, explainable scoring
- Keyword, fuzzy, filtered, and geographic queries supported
- Documents, OCR, and transcripts indexed (architecture + bootstrap)
- Saved searches and collections specified
- Permissions respected on every result
- Indexing pipeline updates automatically as data changes
- Architecture supports semantic/vector search without redesign

**Acceptance:** `AC-172`
