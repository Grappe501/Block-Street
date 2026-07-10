# Build Volume 2.5 — Community Knowledge Graph Schema

### Data Architecture Bible

**Document ID:** VOLUME-002.5 · **DAB-006**  
**Artifact:** `KNOWLEDGE_GRAPH_SCHEMA.md`  
**Status:** Canonical  
**Priority:** Critical

**Builds on:** [2.4 Database Schema Blueprint](DATABASE_SCHEMA_BLUEPRINT.md) [DAB-005] · [2.3 Relationship Data Model](RELATIONSHIP_DATA_MODEL.md) [DAB-004] · [1.8 CKG Architecture](../volume-01/COMMUNITY_KNOWLEDGE_GRAPH_ARCHITECTURE.md) [ENG-008]  
**Live spec:** `data/registry/knowledge-graph-schema.json`

> The Community Knowledge Graph is **not** a second database. It is a semantic projection of the canonical relational database.

---

## Purpose

**[DAB-KGS01]** The Community Knowledge Graph Schema defines how the Community Operating System transforms relational data into an **intelligent network of connected knowledge**.

**[DAB-KGS01a]** The graph enables:

- Discovery
- Intelligence
- Explainable AI
- Strategic planning
- Relationship-centered community building

**[DAB-KGS01b]** Every graph relationship **originates from canonical platform data** [DAB-PH04 · DAB-REL02].

---

## Guiding Principle

**[DAB-KGS02]**

> **The relational database stores truth. The Knowledge Graph understands truth.**

**[DAB-KGS02a]** SQL remains canonical. The graph is derived, permission-aware, and rebuildable.

---

## Philosophy

**[DAB-KGS03]** A traditional database answers:

- What exists?
- Where is it?
- What are its attributes?

**[DAB-KGS03a]** The Community Knowledge Graph also answers:

- How is it connected?
- Why is it important?
- What influenced it?
- What might happen next?
- What knowledge can be reused?

**[DAB-KGS03b]** The graph transforms **information into understanding**.

---

## Graph Philosophy

**[DAB-KGS04]** The graph should be:

| Principle | Meaning |
|-----------|---------|
| **Derived** | Projected from canonical relational data — never authoritative |
| **Permission-aware** | Authorization before traversal |
| **Explainable** | Every recommendation cites evidence paths |
| **Historical** | Temporal relationships preserved |
| **Observable** | Projection health, lag, and failures monitored |
| **Continuously synchronized** | Event-driven updates wherever practical |

**[DAB-KGS04a]** Graph projections **never become canonical records** [DAB-PH04 · DAB-SCH16a].

---

## Graph Architecture

**[DAB-KGS05]** The graph consists of four fundamental components:

```text
Node
     ↓
Relationship
     ↓
Context
     ↓
History
```

**[DAB-KGS05a]** Every graph object follows this model.

**[DAB-KGS05b]** Context captures community scope, mission context, and visibility. History captures temporal stages and audit trail.

---

## Node Categories

**[DAB-KGS06]** The graph recognizes eight major node classes.

### Identity Nodes

**[DAB-KGS06a]** Examples: Participant · Mentor · Volunteer · Leader · Alumni · Institution Contact

### Community Nodes

**[DAB-KGS06b]** Examples: Community · Committee · Working Group · Campus · County Community · Regional Network

### Registry Nodes

**[DAB-KGS06c]** Examples: County · City · Institution · Region · Venue · Service Area

### Mission Nodes

**[DAB-KGS06d]** Examples: Mission · Initiative · Project · Task · Milestone

### Experience Nodes

**[DAB-KGS06e]** Examples: Event · Training · Workshop · Volunteer Activity · Meeting · Celebration

### Knowledge Nodes

**[DAB-KGS06f]** Examples: Story · Lesson · Experience Playbook · Community Brain Entry · Mission Library · Legacy Record · Policy

### Resource Nodes

**[DAB-KGS06g]** Examples: Skill · Equipment · Facility · Transportation · Funding Source · Technology

### Intelligence Nodes

**[DAB-KGS06h]** Examples: Insight · Recommendation · Digital Twin · Growth Pattern · Leadership Pattern · Operational Observation

**[DAB-KGS06i]** Node types map to [CANONICAL_ENTITY_DICTIONARY](CANONICAL_ENTITY_DICTIONARY.md) entities [DAB-003]. Role labels (Mentor, Leader) are **projected roles**, not separate canonical entities.

---

## Relationship Categories

**[DAB-KGS07]** Every relationship has meaning. Examples:

Member Of · Mentors · Invited · Leads · Supports · Created · Published · Attended · Collaborated With · Located In · Uses · Improves · Inspired · Succeeded By · References

**[DAB-KGS07a]** Each relationship type is **configurable** — aligned with [DAB-REL03](RELATIONSHIP_DATA_MODEL.md) edge types and Relationship Ledger [DAB-REL02].

**[DAB-KGS07b]** Full edge catalog: `data/registry/relationship-data-model.json` · canonical store: Relationship Ledger → `graph.entity_relationships`

---

## Edge Metadata

**[DAB-KGS08]** Every edge stores:

| Field | Purpose |
|-------|---------|
| Relationship Type | Configurable edge type |
| Source | Source node reference |
| Target | Target node reference |
| Created Date | When relationship established |
| Updated Date | Last material change |
| Status | Lifecycle state |
| Visibility | Permission class |
| Confidence | When appropriate (AI/import) |
| Context | Community, mission, or event scope |
| Weight | Optional strength signal |
| Audit Reference | Link to audit trail |

**[DAB-KGS08a]** Edges are **rich objects** — not dumb foreign keys [DAB-REL21].

---

## Relationship Weight

**[DAB-KGS09]** Relationship strength is derived from **evidence**, not arbitrary scores.

Possible signals:

- Shared missions
- Mentorship duration
- Volunteer hours
- Leadership collaboration
- Knowledge sharing
- Repeated participation
- Community involvement

**[DAB-KGS09a]** Weights remain **explainable** — every weight cites contributing signals [DAB-REL strengthSignals].

---

## Temporal Graph

**[DAB-KGS10]** Relationships preserve time.

Example pathway:

```text
Volunteer
     ↓
Committee Member
     ↓
Committee Chair
     ↓
Mentor
     ↓
Regional Advisor
```

**[DAB-KGS10a]** The graph retains **every stage** — `valid_from` / `valid_to` on edges, history tables in domain schemas [DAB-SCH28].

---

## Graph Projection Pipeline

**[DAB-KGS11]** The graph is continuously synchronized:

```text
SQL Database
        ↓
Domain Events
        ↓
Projection Engine
        ↓
Knowledge Graph
        ↓
Search
        ↓
AI
        ↓
Analytics
```

**[DAB-KGS11a]** Synchronization is **event-driven** whenever practical [ENG-009 · DAB-007].

**[DAB-KGS11b]** Lag SLA V1: < 60 seconds — monitored in CRCC intelligence readiness [CRCC-001].

---

## Projection Rules

**[DAB-KGS12]** Graph projections should:

- Never modify canonical data
- Remain idempotent
- Support replay
- Recover automatically after failure
- Be independently testable

**[DAB-KGS12a]** Full rebuild from SQL supported — required after schema migration [ENG-KG04].

---

## Unified Graph Projection Engine

**[DAB-KGS13]** **Major Architectural Recommendation:** Maintain a **Unified Graph Projection Engine** as the single mechanism for every derived graph.

**[DAB-KGS13a]** Instead of each feature generating relationships independently, every domain service publishes **canonical events** to the Projection Engine.

**[DAB-KGS13b]** The engine updates:

- Community Knowledge Graph
- Participant Graphs
- County Graphs
- Leadership Graphs
- Growth Graphs
- Knowledge Graphs
- Partnership Graphs
- Digital Twins
- Search relationship indexes
- AI retrieval context

**[DAB-KGS13c]** Advantages:

| Advantage | Benefit |
|-----------|---------|
| **Consistency** | Every projection built from same canonical events |
| **Recoverability** | Graphs rebuilt by replaying event history |
| **Scalability** | New graph types without modifying existing services |
| **Observability** | Central monitoring of projection health, lag, failures |
| **Future flexibility** | Graph storage technology changes — only engine changes |

**[DAB-KGS13d]** Principle: **Write once to canonical data, project many times for specialized purposes.**

**[DAB-KGS13e]** Live spec: `data/registry/knowledge-graph-schema.json` · `unifiedGraphProjectionEngine`

---

## Graph Queries

**[DAB-KGS14]** Support:

- Neighborhood search
- Relationship traversal
- Shortest path
- Shared connections
- Leadership lineage
- Knowledge lineage
- Community influence
- Mentorship chains

**[DAB-KGS14a]** Queries remain **permission-aware** — authorization before traversal [PRE-001].

**[DAB-KGS14b]** V1: Postgres recursive CTEs on projected edges + materialized views [ENG-004]. V1.1+: optional dedicated graph read replica — still derived from SQL.

---

## Signature Subgraphs

### Community Graph

**[DAB-KGS15a]** Every community generates its own subgraph: Members · Leadership · Stories · Knowledge · Events · Missions · Capacity · Partners · Growth

**[DAB-KGS15b]** Communities remain connected while preserving local identity.

### Participant Graph

**[DAB-KGS16a]** Every participant has a graph: Communities · Volunteer history · Mentorship · Skills · Stories · Events · Knowledge · Leadership

**[DAB-KGS16b]** The Participant Graph is the foundation of the **Participant Digital Twin** [LDT-001].

### County Graph

**[DAB-KGS17a]** Every county generates: Communities · Institutions · Partners · Events · Stories · Capacity · Volunteer activity · Growth

**[DAB-KGS17b]** County intelligence becomes possible [ADT-002].

### Knowledge Graph

**[DAB-KGS18a]** Knowledge connects: Stories · Lessons · Playbooks · Community Brain · Mission Library · Legacy

**[DAB-KGS18b]** Knowledge compounds over time [DAB-REL07h–i].

### Leadership Graph

**[DAB-KGS19a]** Tracks: Leadership pathways · Mentorship · Succession · Community Builder development · Cross-community leadership

**[DAB-KGS19b]** Leadership intelligence becomes explainable.

### Growth Graph

**[DAB-KGS20a]** Tracks: Invitations · Belonging · Community launches · Expansion · Referral trees · Volunteer pathways

**[DAB-KGS20b]** Growth becomes measurable [PON-001 · WBS-001].

---

## Explainability

**[DAB-KGS21]** Every graph-based recommendation should answer:

- Which nodes were examined?
- Which relationships mattered?
- What evidence supported this?
- What historical patterns contributed?

**[DAB-KGS21a]** Participants should understand **how conclusions were reached** [ENG-KG18 · CIF-001].

**[DAB-KGS21b]** Graph-driven UI surfaces return **path evidence** — node IDs and edge types cited in responses.

---

## Privacy

**[DAB-KGS22]** Graph traversal always respects:

- Visibility
- Permissions
- Community boundaries
- Private relationships
- Restricted knowledge

**[DAB-KGS22a]** **Authorization occurs before traversal** — never after [DAB-PH08 · PRE-001].

---

## AI Integration

**[DAB-KGS23]** The Community Intelligence Fabric consumes:

- Node relationships
- Historical patterns
- Knowledge flows
- Leadership pathways
- Growth signals
- Community health

**[DAB-KGS23a]** The graph **supports AI** — it does not replace canonical records [DAB-013 · CIF-001].

**[DAB-KGS23b]** AI capabilities enabled: mentor recommendations · collaboration opportunities · partnership introductions · relationship history summaries · leadership succession [DAB-REL AI capabilities].

---

## Graph Evolution

**[DAB-KGS24]** Future node types may include:

Scholarships · Housing · Employment · Research · Legislation · Public Policy · Healthcare

**[DAB-KGS24a]** The graph should expand through **addition** without structural redesign [DAB-SCH31].

---

## Performance

**[DAB-KGS25]** Optimize for:

- Traversal
- Relationship lookup
- Projection speed
- Caching
- Incremental updates
- Read scalability

**[DAB-KGS25a]** Performance should support **statewide growth** — incremental projection preferred over full rebuilds in steady state.

---

## Burt Implementation Guidance

**[DAB-KGS26]** Implementation should:

1. Keep SQL as the canonical source
2. Build graph projections through the **Unified Graph Projection Engine**
3. Model edges as first-class objects with metadata
4. Preserve historical relationships
5. Respect authorization before traversal
6. Keep graph storage technology replaceable
7. Consult `knowledge-graph-schema.json` before any projection change

**[DAB-KGS26a]** Implementation detail for physical storage: [ENG-008](../volume-01/COMMUNITY_KNOWLEDGE_GRAPH_ARCHITECTURE.md) · kernel path: `src/lib/kernel/graph/`

---

## AC-111 — Acceptance Criteria

Volume 2.5 is complete when:

- [x] **[AC-111a]** Graph philosophy is documented. `[DAB-KGS04]`
- [x] **[AC-111b]** Node and relationship schemas are defined. `[DAB-KGS06–KGS08]`
- [x] **[AC-111c]** Projection architecture is established. `[DAB-KGS11–KGS13]`
- [x] **[AC-111d]** Explainability, privacy, and AI integration are incorporated. `[DAB-KGS21–KGS23]`
- [x] **[AC-111e]** Unified Graph Projection Engine specified. `[DAB-KGS13]`
- [x] **[AC-111f]** Burt has a complete blueprint for implementing the CKG as the semantic layer. `[DAB-KGS26]`

---

**Next step:** [2.6 — Event Data Model](EVENT_DATA_MODEL.md) [DAB-007]

**End of Volume 2.5.**
