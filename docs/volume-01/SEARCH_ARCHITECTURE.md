# Build Volume 1.10 — Search & Discovery Architecture

### Engineering Architecture Bible

**Document ID:** VOLUME-001.10 · **ENG-010**  
**Artifact:** `SEARCH_ARCHITECTURE.md`  
**Status:** Canonical  
**Priority:** Critical

**Companion:** [Discovery Engine](DISCOVERY_ENGINE.md) [DGE-001]  
**Builds on:** [1.8 Knowledge Graph](COMMUNITY_KNOWLEDGE_GRAPH_ARCHITECTURE.md) [ENG-008] · [1.9 Events & Timelines](EVENT_TIMELINE_ARCHITECTURE.md) [ENG-009] · [1.6 Authorization](AUTHORIZATION_ARCHITECTURE.md) [ENG-006] · [1.7 Search Service](DOMAIN_SERVICE_ARCHITECTURE.md) [ENG-DS21]  
**Phase alignment:** [Public Community Network](../phase-06/PUBLIC_COMMUNITY_NETWORK.md) [PCN-M12] · [Personal Relationship Network](../phase-03/PERSONAL_RELATIONSHIP_NETWORK.md) [PRN-001]  
**Live spec:** `data/registry/search-architecture.json`

---

## ENG-SR01 — Purpose

**[ENG-SR01]** The Search & Discovery Architecture defines how participants **find people, communities, missions, opportunities, stories, knowledge, events, and resources** throughout the Community Operating System.

**[ENG-SR01a]** Search is not simply a search box — it is the platform's **discovery engine**.

**[ENG-SR01b]** Objective: help people discover **meaningful connections**, not merely locate records [CP-013 · PRN-001].

---

## ENG-SR02 — Guiding Principle

**[ENG-SR02]**

> **The right information should find the right person at the right time.**

**[ENG-SR02a]** Discovery should **reduce effort** while **expanding opportunity** [GOS-M03 · WBS-001].

---

## ENG-SR03 — Philosophy

**[ENG-SR03]** Traditional search answers: *Where is this?*

**The COS also answers:**

| Question | Mechanism |
|----------|-----------|
| What should I explore next? | Discovery Engine [DGE-001] |
| What opportunities fit me? | Opportunity + ranking |
| Who should I meet? | Relationship search · PRN |
| What knowledge already exists? | Knowledge search |
| Which community needs help? | Geographic + growth signals |
| What is related to this mission? | CKG relationship search |

**[ENG-SR03a]** Search becomes **exploration** [ENG-SR02].

---

## ENG-SR04 — Search Philosophy

**[ENG-SR04]** Every searchable object contributes to discovery:

People · communities · missions · events · stories · lessons · playbooks · partnerships · volunteer opportunities · institutions · committees · resources

**[ENG-SR04a]** Search reveals **relationships** — not isolated records [ENG-KG10 · ENG-008].

**[ENG-SR04b]** Indexing is **separate from canonical storage** [ENG-DB24 · ENG-DS21].

---

## ENG-SR05 — Search Layers

**[ENG-SR05]** Six complementary layers:

```text
Global Search
       ↓
Domain Search
       ↓
Context Search
       ↓
Relationship Search
       ↓
Knowledge Search
       ↓
Semantic Discovery
```

**[ENG-SR05a]** Each layer builds on the previous — unified API, different scopes [ENG-SR25].

---

## ENG-SR06 — Global Search

**[ENG-SR06]** Accessible from anywhere — primary navigation tool [UXB-001].

**Searches (permission-scoped):**

Participants · communities · events · stories · knowledge · opportunities · institutions · committees · resources

**[ENG-SR06a]** Global bar in app shell · keyboard shortcut · mobile-first [PHQ-001 entry point].

**Path:** `apps/*/components/GlobalSearch/`

---

## ENG-SR07 — Domain Search

**[ENG-SR07]** Each domain exposes **specialized search** with domain filters:

| Domain | Service | Key filters |
|--------|---------|-------------|
| Mission | Mission | status · type · community |
| Volunteer | Opportunity | skills · availability |
| Leadership | Leadership | pathway · role |
| Story | Story | atlas · theme |
| Community | Community | type · growth stage |
| Knowledge | Knowledge | playbook · lesson |
| Partnership | Partnership | institution · region |

**[ENG-SR07a]** Domain search delegates to **Search Service** with `domain` parameter [ENG-DS21].

---

## ENG-SR08 — Context Search

**[ENG-SR08]** Search adapts to **where the participant is**:

| Context | Default scope |
|---------|---------------|
| Inside community | Community-first · then network |
| Inside initiative | Initiative resources first |
| Inside event | Attendees · agenda · materials |
| Personal HQ [PHQ-001] | My communities · my opportunities |

**[ENG-SR08a]** Context reduces noise — `contextScope` in every query [PRE-001].

---

## ENG-SR09 — Relationship Search

**[ENG-SR09]** Powered by **Community Knowledge Graph** [ENG-008]:

People who worked together · mentors · communities via partnerships · stories connected to missions · knowledge related to events

**[ENG-SR09a]** Graph traversal with **PRE filter at each hop** [ENG-KG20].

**API:** `search.relationship(pattern, startNode, depth)`

---

## ENG-SR10 — Knowledge Search

**[ENG-SR10]** Searches:

Community Brain · Mission Library · experience playbooks · lessons learned · Community Legacy · documentation [CKLS-001 · LIS-001 · CLS-001]

**[ENG-SR10a]** Knowledge should always be **reusable** — rank by quality signals · reuse count [ENG-SR19].

---

## ENG-SR11 — Opportunity Search

**[ENG-SR11]** Participants discover:

Volunteer opportunities · leadership openings · open committees · projects · training · events · mentorship [OEX-001 · OBE-001 · CLD-001]

**[ENG-SR11a]** Opportunities remain **easy to find** — featured in Discovery Engine [DGE-001].

---

## ENG-SR12 — Geographic Search

**[ENG-SR12]** Search by:

County · campus · city · region · institution · nearby communities [CNTY-001 · INST-001 · ENG-011 maps]

**[ENG-SR12a]** Maps become **searchable** — geo filters + distance ranking · integrates with Map Architecture [ENG-011].

---

## ENG-SR13 — Timeline Search

**[ENG-SR13]** Search historical information [ENG-009]:

Past events · former leaders · completed missions · historic stories · community anniversaries

**[ENG-SR13a]** Timeline search preserves **institutional memory** — index `domain_events` summaries · LHE narratives [LHE-001].

---

## ENG-SR14 — Search Filters

**[ENG-SR14]** Every major search supports:

Date · community · institution · mission · topic · tags · location · status · visibility · relationship

**[ENG-SR14a]** Filters simplify exploration — exposed as typed filter DSL in API contracts.

---

## ENG-SR15 — Saved Searches

**[ENG-SR15]** Participants save frequently used searches:

Upcoming volunteer opportunities · my county communities · mentorship requests · leadership openings

**Storage:** `identity.saved_searches` · notify on new matches (optional) [Communication Service]

---

## ENG-SR16 — Search Collections

**[ENG-SR16]** Organize results into **reusable collections**:

Research folders · volunteer ideas · training resources · community launch materials

**[ENG-SR16a]** Collections encourage **knowledge reuse** [CKLS-001 · PHQ-001 bookmarks].

**Storage:** `identity.search_collections`

---

## ENG-SR17 — Search Ranking

**[ENG-SR17]** Ranking considers:

| Factor | Weight context |
|--------|----------------|
| **Relevance** | Text/semantic match |
| **Permissions** | PRE-filtered first |
| **Relationship proximity** | CKG hop distance |
| **Community context** | Current scope boost |
| **Freshness** | Recency decay |
| **Popularity** | Where appropriate · not engagement trap [PCN-M12] |
| **Knowledge quality** | Reuse · approval signals |

**[ENG-SR17a]** Ranking remains **explainable** — `rankFactors[]` in response [ENG-KG19 · ENG-SR21].

---

## ENG-SR18 — Search Suggestions

**[ENG-SR18]** Autocomplete and advisory suggestions:

Communities · people · stories · events · playbooks · opportunities · mentors

**[ENG-SR18a]** Suggestions remain **advisory** — participant chooses [DGE-001 never auto-enrolls].

---

## ENG-SR19 — Discovery Pages

**[ENG-SR19]** Curated pages when search is empty or exploratory:

Trending stories · nearby events · communities needing help · new volunteer opportunities · recently published playbooks

**[ENG-SR19a]** Discovery **encourages exploration** — not algorithmic addiction [GCN-M03 · PCN-M12a].

---

## ENG-SR20 — Semantic Discovery

**[ENG-SR20]** Future layer — meaning beyond keywords [AIB-001 · ENG-013]:

```text
"Food drive"
    ↓ volunteer projects
    ↓ related stories
    ↓ lessons learned
    ↓ nearby organizers
    ↓ reusable playbooks
```

**[ENG-SR20a]** Semantic search is an **extension** — keyword + structured search remain V1 canonical [ENG-SR26].

**V1:** Postgres `tsvector` + tags · v1.1+ vector embeddings behind same API.

---

## ENG-SR21 — Explainability

**[ENG-SR21]** Participants understand:

Why this result appears · how it is related · which permissions affect visibility · what similar resources exist

**Response shape:**

```typescript
interface SearchResult {
  id: string;
  type: string;
  title: string;
  snippet: string;
  rankScore: number;
  explanation: {
    factors: string[];
    relationshipPath?: GraphEdge[];
  };
}
```

**[ENG-SR21a]** Transparency builds **trust** [TPS-M02 · ENG-KG19].

---

## ENG-SR22 — Privacy

**[ENG-SR22]** Search **never bypasses authorization** [PRE-001]:

Permissions · visibility · community boundaries · private mentor relationships · private committees · sensitive knowledge

**[ENG-SR22a]** Index stores **visibility scope** — query applies PRE before returning hits · RLS on index tables where used.

---

## ENG-SR23 — Performance

**[ENG-SR23]** Support at scale:

Indexes · incremental indexing on domain events · caching · background updates · large datasets · fast autocomplete

**[ENG-SR23a]** Event-driven reindex: `StoryPublished` → search index upsert [ENG-ET23 · ENG-DS27].

**Target:** < 200ms p95 for global search V1 · < 50ms autocomplete.

---

## ENG-SR24 — Discovery Engine

**[ENG-SR24]** Search is one component of the broader **[Discovery Engine](DISCOVERY_ENGINE.md) [DGE-001]**.

**[ENG-SR24a]** Engine **continuously surfaces** opportunities on dashboard — participant need not search first [PHQ-001 · PDT-001].

---

## ENG-SR25 — Search API Layer

**[ENG-SR25]** Storage-agnostic API — Search Service owns contract:

```typescript
interface SearchQuery {
  query: string;
  layers: SearchLayer[];       // global | domain | context | ...
  filters: SearchFilters;
  context: SearchContext;
  pagination: { limit: number; cursor?: string };
}

interface SearchResponse {
  results: SearchResult[];
  facets: Record<string, FacetCount[]>;
  suggestions?: string[];
  explanation?: string;
}
```

**Path:** `services/search/` · `src/lib/kernel/search/`

---

## ENG-SR26 — Index Architecture

**[ENG-SR26a]** V1 index table pattern:

```sql
platform.search_index (
  id uuid PRIMARY KEY,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  title text NOT NULL,
  body tsvector,
  tags text[],
  community_scope uuid,
  visibility text NOT NULL,
  geo_point geography(point),
  indexed_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb DEFAULT '{}'
);
```

**[ENG-SR26b]** **Separate from canonical tables** — rebuild from source on drift.

**[ENG-SR26c]** Future: OpenSearch / Typesense read replica — same indexer interface.

---

## ENG-SR27 — Future AI Assistance

**[ENG-SR27]** AI may:

Summarize results · recommend related knowledge · suggest mentors · recommend communities · generate queries · surface overlooked resources

**[ENG-SR27a]** AI **assists discovery** — does not replace participant choice [AIB-001 · ENG-SR18a].

---

## ENG-SR28 — Burt Implementation Guidance

**[ENG-SR28]** Implementation should:

- **Separate indexing** from canonical storage [ENG-SR04b]
- **Respect permissions** during every search [ENG-SR22]
- **Integrate with CKG** for relationship search [ENG-SR09]
- Support **configurable ranking** [ENG-SR17]
- Design **semantic search as extension** [ENG-SR20a]
- Keep search APIs **independent** of storage [ENG-SR25]
- Wire **Discovery Engine** for proactive surfaces [DGE-001]
- Reindex on domain events [ENG-ET23]

---

## Volume Cross-References

| Document | Relationship |
|----------|--------------|
| [ENG-DS21](DOMAIN_SERVICE_ARCHITECTURE.md) | Search Service ownership |
| [ENG-008 CKG](COMMUNITY_KNOWLEDGE_GRAPH_ARCHITECTURE.md) | Relationship search |
| [ENG-009 Events](EVENT_TIMELINE_ARCHITECTURE.md) | Timeline search · reindex triggers |
| [DGE-001](DISCOVERY_ENGINE.md) | Proactive discovery |
| [LDT-001](LIVING_DIGITAL_TWIN_ARCHITECTURE.md) | Personal context for ranking |
| [PRE-001](PERMISSION_RESOLUTION_ENGINE.md) | Query authorization |
| [ENG-011 Maps](MAP_GEOGRAPHIC_ARCHITECTURE.md) | Geographic search · geo filters |

---

## AC-097 — Acceptance Criteria

Volume 1.10 is complete when:

- [x] **[AC-097a]** Search philosophy documented. `[ENG-SR02, ENG-SR04]`
- [x] **[AC-097b]** Search layers established. `[ENG-SR05–ENG-SR13]`
- [x] **[AC-097c]** Knowledge, relationship, and geographic search defined. `[ENG-SR09, ENG-SR10, ENG-SR12]`
- [x] **[AC-097d]** Privacy and explainability incorporated. `[ENG-SR21, ENG-SR22]`
- [x] **[AC-097e]** Discovery Engine specified. `[ENG-SR24, DGE-001]`
- [x] **[AC-097f]** Burt has blueprint for discovery. `[search-architecture.json]`

---

**Note:** Step **1.5 API** [ENG-005] remains pending.

**Next recommended step:** [1.5 — API Architecture](API_ARCHITECTURE.md) [ENG-005] · then [1.11 — Map & Geographic](MAP_GEOGRAPHIC_ARCHITECTURE.md) [ENG-011]

**End of Volume 1.10 — Search & Discovery Architecture.**
