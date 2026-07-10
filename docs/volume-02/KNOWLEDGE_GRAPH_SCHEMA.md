# Build Volume 2.5 — Community Knowledge Graph Schema

### Data Architecture Bible

**Document ID:** VOLUME-002.5 · **DAB-006**  
**Artifact:** `KNOWLEDGE_GRAPH_SCHEMA.md`  
**Status:** Canonical  
**Priority:** Critical

**Builds on:** [1.8 CKG Architecture](../volume-01/COMMUNITY_KNOWLEDGE_GRAPH_ARCHITECTURE.md) [ENG-008] · [2.3 Relationships](RELATIONSHIP_DATA_MODEL.md) [DAB-004]  
**Live spec:** `data/registry/knowledge-graph-schema.json`

---

## DAB-KGS01 — Purpose

**[DAB-KGS01]** Defines how **relational data becomes graph data** — nodes, edges, metadata, projections, sync, and query model.

**[DAB-KGS01a]** SQL is canonical; the graph is a **derived, queryable view** of relationships and entities [ENG-KG04].

---

## DAB-KGS02 — Node Model

**[DAB-KGS02a]** Graph nodes mirror canonical entities with graph-specific envelope:

```text
graph_nodes (
  id              uuid PK          -- same as entity id
  node_type       text NOT NULL    -- Participant, Community, Mission, ...
  label           text             -- display label
  community_scope uuid
  metadata        jsonb            -- degree, badges, twin refs
  source_table    text             -- provenance
  indexed_at      timestamptz
  source_version  int
)
```

**[DAB-KGS02b]** Node types map 1:1 to [CANONICAL_ENTITY_DICTIONARY](CANONICAL_ENTITY_DICTIONARY.md) primary entities [ENG-KG06].

---

## DAB-KGS03 — Edge Model

**[DAB-KGS03a]** Graph edges **project from** `graph.entity_relationships` [DAB-REL02]:

```text
graph_edges (
  id, source_node_id, target_node_id, edge_type,
  weight, metadata, valid_from, valid_to, community_scope, indexed_at
)
```

**[DAB-KGS03b]** Edge types: full set from [DAB-REL03](RELATIONSHIP_DATA_MODEL.md).

**[DAB-KGS03c]** Signature graphs filter edge subsets [NISS-M17 · ENG-KG12].

---

## DAB-KGS04 — Node Metadata

**[DAB-KGS04]** Optional metadata per node type:

| Node type | Metadata examples |
|-----------|-------------------|
| Participant | journey_stage, skills[], mentor_count |
| Community | growth_stage, member_count, health_score |
| Mission | status, participant_count, outcome_ref |
| Story | published_at, visibility, impact_tags[] |

**[DAB-KGS04a]** Metadata is **denormalized for query** — rebuilt on sync from canonical tables.

---

## DAB-KGS05 — Graph Projections

**[DAB-KGS05a]** **Full graph** — all nodes and edges for admin/explorer.

**[DAB-KGS05b]** **Community subgraph** — scoped by `community_scope`.

**[DAB-KGS05c]** **Participant ego network** — N-hop from participant node.

**[DAB-KGS05d]** **Signature projections** — trust, growth, operational, etc. [ENG-KG12].

**[DAB-KGS05e]** **Digital Twin projection** — county/state aggregate [LDT-001 · ADT-002].

---

## DAB-KGS06 — Synchronization

**[DAB-KGS06a]** **Trigger:** domain_events on entity/relationship change [ENG-ET].

**[DAB-KGS06b]** **Worker:** graph sync job upserts nodes/edges, updates metadata counts.

**[DAB-KGS06c]** **Lag SLA:** < 60 seconds V1; monitored in CRCC intelligence readiness [CRCC-001].

**[DAB-KGS06d]** **Full rebuild:** supported from SQL — required after schema migration.

---

## DAB-KGS07 — Query Model

**[DAB-KGS07a]** V1 queries via Postgres recursive CTEs on `graph_edges` + materialized views.

**[DAB-KGS07b]** Common patterns:

- Shortest path between participants
- Community member graph
- Mission participation cluster
- Invite tree traversal [PON-001]

**[DAB-KGS07c]** V1.1+: optional Neo4j/Memgraph read replica — still derived from SQL.

---

## DAB-KGS08 — Explainability

**[DAB-KGS08a]** Every graph-driven UI surface returns **path evidence** — which edges support the view [ENG-KG18].

**[DAB-KGS08b]** AI graph queries cite node IDs and edge types in responses [CIF-001].

---

## AC-111 — Acceptance Criteria

- [x] **[AC-111a]** Node and edge schema documented. `[DAB-KGS02, KGS03]`
- [x] **[AC-111b]** Projections and synchronization model defined. `[DAB-KGS05, KGS06]`
- [x] **[AC-111c]** Query model and explainability requirements specified. `[DAB-KGS07, KGS08]`

---

**Next step:** [2.6 — Event Data Model](EVENT_DATA_MODEL.md) [DAB-007]

**End of Volume 2.5.**
