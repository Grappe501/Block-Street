# Build Volume 1.8 — Community Knowledge Graph Architecture

### Engineering Architecture Bible

**Document ID:** VOLUME-001.8 · **ENG-008**  
**Artifact:** `COMMUNITY_KNOWLEDGE_GRAPH_ARCHITECTURE.md`  
**Status:** Canonical  
**Priority:** Critical

**Companion:** [Living Digital Twin Architecture](LIVING_DIGITAL_TWIN_ARCHITECTURE.md) [LDT-001]  
**Builds on:** [1.4 Database Architecture](DATABASE_ARCHITECTURE.md) [ENG-004] · [1.7 Domain Services](DOMAIN_SERVICE_ARCHITECTURE.md) [ENG-007] · [1.6 Authorization](AUTHORIZATION_ARCHITECTURE.md) [ENG-006]  
**Phase alignment:** [NISS-001](../phase-06/NETWORK_INTELLIGENCE_STRATEGY_SYSTEM.md) · [Volume 2 Graph Model](../master/DATA_ARCHITECTURE_BIBLE.md) [DAB-M03]  
**Live spec:** `data/registry/community-knowledge-graph-architecture.json`

---

## ENG-KG01 — Purpose

**[ENG-KG01]** The Community Knowledge Graph (CKG) Architecture defines how the Community Operating System **understands relationships** between people, communities, missions, institutions, knowledge, stories, events, and every other major entity.

**[ENG-KG01a]** The CKG is **not simply a visualization** — it is the platform's **semantic understanding** of how everything is connected.

**[ENG-KG01b]** Foundation for: search · recommendations · intelligence · analytics · planning · future AI [NISS-M17 · GOS-M16 · AIB-001].

---

## ENG-KG02 — Guiding Principle

**[ENG-KG02]**

> **The platform should understand relationships—not just records.**

**[ENG-KG02a]** Records tell us **what exists**. Relationships explain **why it matters** [MAB-G · CP-013].

---

## ENG-KG03 — Philosophy

**[ENG-KG03]** Nearly every important platform question is **relational**:

| Question | Graph path |
|----------|------------|
| Who mentored this organizer? | `mentors` edge |
| Which community launched this initiative? | `organizes` · `member_of` |
| Which missions created long-term volunteers? | `participated_in` → retention |
| Which stories came from this event? | `documented_in` · `inspired` |
| Which partnerships strengthened this county? | `partners_with` · `located_in` |
| Which playbooks produce successful outcomes? | knowledge inheritance chain |

**[ENG-KG03a]** The CKG exists to **answer these questions** — not to duplicate domain service ownership [ENG-DS25].

---

## ENG-KG04 — Graph Philosophy

**[ENG-KG04a]** The graph **complements** the relational database [ENG-DB04c].

**[ENG-KG04b]** **SQL remains canonical source of truth** — graph is **derived** and optimized for relationship understanding [ENG-DB25].

**[ENG-KG04c]** Future graph database technologies may be introduced as **read projections** without changing core architecture.

```text
Domain Services → entity_relationships (SQL)
                        ↓
              Graph Projection Layer
                        ↓
         CKG Query API · Intelligence · Search · UI
```

---

## ENG-KG05 — Graph Model

**[ENG-KG05]** Three fundamental components:

```text
Node
     ↕
Relationship
     ↕
Metadata
```

**[ENG-KG05a]** Everything else builds on these concepts [DAB-M03].

---

## ENG-KG06 — Node Types

**[ENG-KG06]** Major node categories map to domain entities [DAB-001]:

### People [ENG-KG06a]

Participants · mentors · volunteers · leaders · alumni · institutional contacts  
**Owner:** Identity · Leadership · Partnership services

### Communities [ENG-KG06b]

Campus · county · committees · working groups · regional · future types [DCL-001]  
**Owner:** Community Service

### Institutions [ENG-KG06c]

Universities · community colleges · trade schools · partner orgs · libraries · museums · businesses  
**Owner:** Registry · Partnership services

### Work [ENG-KG06d]

Missions · projects · tasks · initiatives · volunteer opportunities · campaigns  
**Owner:** Mission · Opportunity services

### Experiences [ENG-KG06e]

Events · meetings · training · volunteer activities · leadership workshops · gatherings  
**Owner:** Experience Service

### Knowledge [ENG-KG06f]

Stories · lessons · playbooks · Community Brain · Mission Library · legacy · policies  
**Owner:** Knowledge · Story services

### Resources [ENG-KG06g]

Facilities · equipment · transportation · funding programs · shared assets  
**Owner:** Capacity Service

### Geography [ENG-KG06h]

State · regions · counties · cities · campuses · neighborhoods  
**Owner:** Registry Service

**[ENG-KG06i]** New node types require **DCL configuration** — not architectural redesign [ENG-KG28].

---

## ENG-KG07 — Relationship Types

**[ENG-KG07]** Relationships are **explicitly modeled** — configurable via [DCL-001](DIGITAL_CONSTITUTION_LAYER.md):

| Type | Example |
|------|---------|
| `member_of` | Participant → Community |
| `mentors` | Mentor → Participant |
| `invited` | Inviter → Invitee |
| `participated_in` | Participant → Mission/Event |
| `organized` | Organizer → Event |
| `leads` | Leader → Committee |
| `supports` | Community → Initiative |
| `partners_with` | Institution ↔ Community |
| `located_in` | Community → County |
| `attended` | Participant → Event |
| `created` | Author → Story |
| `published` | Publisher → Story |
| `inspired` | Event → Story |
| `references` | Lesson → Playbook |
| `succeeded_by` | Leader → Successor |
| `built_upon` | Mission → Mission |
| `completed` | Team → Mission |

**[ENG-KG07a]** Canonical storage: `platform.entity_relationships` [ENG-DB19 · DAB-M03b].

---

## ENG-KG08 — Relationship Metadata

**[ENG-KG08]** Every relationship may include:

| Field | Purpose |
|-------|---------|
| `valid_from` / `valid_to` | Temporal bounds |
| `status` | active · ended · pending |
| `confidence` | Intelligence-derived edges |
| `source` | system · user · import · inference |
| `visibility` | PRE-scoped [ENG-AU14] |
| `context` | community_id · initiative_id |
| `notes` | Human annotation |
| `metadata` | jsonb extensions |

**[ENG-KG08a]** Relationships **evolve over time** — never silent overwrite [ENG-DB20].

---

## ENG-KG09 — Temporal Relationships

**[ENG-KG09]** History preserved:

```text
Participant
    ↓ volunteer (2026)
    ↓ committee_chair (2027)
    ↓ mentor (2028)
    ↓ community_advisor (2030)
```

**[ENG-KG09a]** Each transition is a **new edge or effective-dated row** — history never lost [PEL-001 · CJT-001].

---

## ENG-KG10 — Multi-Hop Queries

**[ENG-KG10]** Graph supports complex discovery:

- Mentors of organizers who launched communities
- Counties connected through shared initiatives
- Stories related to a mission
- Institutions collaborating with multiple campuses
- Nearby experienced organizers

**[ENG-KG10a]** Query API abstracts storage — Cypher-like patterns over SQL projection V1 [ENG-KG26].

**Kernel path:** `src/lib/kernel/graph/query.ts`

---

## ENG-KG11 — Knowledge Inheritance

**[ENG-KG11]** Knowledge spreads through typed edges:

```text
Mission → experience_playbook → lessons_learned → community_brain → future_mission
```

**[ENG-KG11a]** `built_upon` · `references` · `derived_from` preserve **learning across generations** [LIS-001 · CKLS-001 · CLS-001].

---

## ENG-KG12 — Community Intelligence

**[ENG-KG12]** Graph feeds intelligence layers [NISS-001]:

| Layer | Graph use |
|-------|-----------|
| **Growth Intelligence** | Invitation trees · expansion edges |
| **Operational Intelligence** | Mission · event · capacity flows |
| **Leadership Intelligence** | Mentorship · succession paths |
| **Network Intelligence** | Cross-community · county bridges |
| **Impact Intelligence** | Outcome · story · volunteer chains |

**[ENG-KG12a]** Intelligence Service **consumes** graph — does not own canonical writes [ENG-DS20].

---

## ENG-KG13 — Recommendation Engine

**[ENG-KG13]** Recommendations are **graph-driven** and **explainable**:

Potential mentor · volunteer opportunity · community needing support · relevant playbook · nearby partner · shared initiative

**[ENG-KG13a]** Every recommendation returns **evidence path** — edge list + confidence [ENG-KG22 · AIB-001].

**Never:** opaque scores without relational explanation.

---

## ENG-KG14 — Story Graph

**[ENG-KG14]** Stories connect to:

People · communities · events · missions · photos · videos · knowledge · lessons [CST-001]

**[ENG-KG14a]** Stories become **navigable** through relationships — Story Atlas is a graph view [Story Service ENG-DS16].

---

## ENG-KG15 — Leadership Graph

**[ENG-KG15]** Tracks:

Mentorship · leadership development · succession · Community Builder pathway · Leadership Constellation [CLD-001]

**[ENG-KG15a]** Leadership is a **network**, not a hierarchy [OM-L1 · CGS-001].

---

## ENG-KG16 — Growth Graph

**[ENG-KG16]** Tracks:

Invitations · Impact Tree [PON-001] · community launches · expansion · belonging checkpoints · Growth Intelligence [GOS-001 · ICS-001]

**[ENG-KG16a]** Growth becomes **observable** — not inferred from counts alone.

---

## ENG-KG17 — Community Genome

**[ENG-KG17]** Every community inherits common graph structure [GOS-M10]:

Identity · leadership · knowledge · growth · capacity · stories · relationships · legacy

**[ENG-KG17a]** Communities remain **structurally compatible** while preserving uniqueness [CCN-001 · CID-001].

**Template:** DCL `community_genome_template` · instantiated per community at launch.

---

## ENG-KG18 — Signature Graphs

**[ENG-KG18]** Compose on base edges [DAB-M03c · NISS-001]:

| Signature graph | Primary edges |
|-----------------|---------------|
| **Trust** | mentors · invited · member_of |
| **Growth** | invited · launched · belongs |
| **Conversation** | participated_in · organized |
| **Capability** | skills · capacity · equipment |
| **Decision** | leads · approves · governs |
| **Improvement** | lessons · playbooks · built_upon |
| **Operational** | missions · tasks · events |
| **Impact** | stories · outcomes · legacy |

**[ENG-KG18a]** Signature graphs are **views** — not separate storage.

---

## ENG-KG19 — Explainability

**[ENG-KG19]** Every recommendation answers:

- What **relationship path** produced this?
- What **evidence** supports it?
- What **communities** contributed?
- What **historical patterns** were observed?

**[ENG-KG19a]** Explainability builds **trust** [TPS-M02 · AIB-001 · NISS-M14].

---

## ENG-KG20 — Privacy

**[ENG-KG20]** Graph queries **always respect authorization** [PRE-001 · ENG-AU14]:

- Private mentor relationships → invisible outside scope
- Community-only edges → community members only
- Public stories → public read where policy allows

**[ENG-KG20a]** Traversal **filters at each hop** — never leak via multi-hop path [TPS-001 · DG-004].

---

## ENG-KG21 — Graph Evolution

**[ENG-KG21]** New node and edge types via **DCL configuration** [DCL-001].

**Future nodes:** Scholarships · housing · career opportunities · research · legislation · public policy

**[ENG-KG21a]** Graph remains **open-ended** — schema extensible via `metadata` jsonb.

---

## ENG-KG22 — Performance

**[ENG-KG22]** Support at scale:

| Technique | Use |
|-----------|-----|
| **Caching** | Hot paths · twin summaries [LDT-001] |
| **Relationship indexes** | `(source_type, source_id)` · `(target_type, relationship_type)` |
| **Materialized views** | County bridges · mentor pools |
| **Background projections** | Incremental graph rebuild on domain events |
| **Incremental updates** | Event-driven edge upsert [ENG-DS27] |

**[ENG-KG22a]** Never sacrifice **correctness** for speed — stale projections labeled [ENG-DB27].

---

## ENG-KG23 — Living Digital Twin

**[ENG-KG23]** CKG enables **[Living Digital Twin Architecture](LIVING_DIGITAL_TWIN_ARCHITECTURE.md) [LDT-001]** — graph-derived living representations for every major entity.

**[ENG-KG23a]** Twins abstract state + relationships for dashboards, intelligence, and AI — canonical data remains in SQL [PDT-001 extends to all entity types].

---

## ENG-KG24 — Future AI Assistance

**[ENG-KG24]** AI may use the graph to:

Answer complex questions · recommend opportunities · explain organizational history · identify mentors · summarize relationships · generate strategic reports

**[ENG-KG24a]** AI **consumes** the graph — **does not redefine** it [ENG-DB16 · AIB-001 · TPS-M15].

---

## ENG-KG25 — Graph API Layer

**[ENG-KG25]** Graph APIs are **independent from storage technology**:

```typescript
// Kernel graph interface — storage-agnostic
interface GraphQuery {
  startNode: { type: string; id: string };
  pattern: EdgePattern[];
  maxDepth: number;
  context: CommunityScope;
}

interface GraphResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
  explanation?: string;
}
```

**[ENG-KG25a]** V1: SQL recursive CTEs · future: Neo4j read replica behind same interface.

**Path:** `src/lib/kernel/graph/`

---

## ENG-KG26 — Burt Implementation Guidance

**[ENG-KG26]** Implementation should:

- Treat relational database as **canonical source**
- Build graph **projections from relational data** + domain events
- Model relationships as **first-class entities** [ENG-DB19]
- **Preserve historical** relationships [ENG-KG09]
- **Respect authorization** during every traversal [PRE-001]
- Design graph APIs **independently** from storage [ENG-KG25]
- Register new edge types in **DCL** before use
- Project twins per [LDT-001](LIVING_DIGITAL_TWIN_ARCHITECTURE.md)

---

## Volume Cross-References

| Document | Relationship |
|----------|--------------|
| [ENG-004 Database](DATABASE_ARCHITECTURE.md) | entity_relationships · graph derivation |
| [DAB-M03](../master/DATA_ARCHITECTURE_BIBLE.md) | Entity catalog · edge types |
| [PRE-001](PERMISSION_RESOLUTION_ENGINE.md) | Traversal authorization |
| [LDT-001](LIVING_DIGITAL_TWIN_ARCHITECTURE.md) | Twin abstraction layer |
| [PDT-001](../phase-03/PERSONAL_DIGITAL_TWIN.md) | Participant twin (phase) |
| [NISS-001](../phase-06/NETWORK_INTELLIGENCE_STRATEGY_SYSTEM.md) | Network twin · strategic queries |
| [ENG-010 Search](SEARCH_ARCHITECTURE.md) | Discovery index · relationship search |

---

## AC-093 — Acceptance Criteria

Volume 1.8 is complete when:

- [x] **[AC-093a]** CKG philosophy documented. `[ENG-KG02, ENG-KG04]`
- [x] **[AC-093b]** Node and relationship models defined. `[ENG-KG06, ENG-KG07, ENG-KG08]`
- [x] **[AC-093c]** Graph-driven recommendations and intelligence established. `[ENG-KG12, ENG-KG13]`
- [x] **[AC-093d]** Privacy, explainability, and evolution principles incorporated. `[ENG-KG19–ENG-KG21]`
- [x] **[AC-093e]** Living Digital Twin specified. `[ENG-KG23, LDT-001]`
- [x] **[AC-093f]** Burt has blueprint for semantic relationship layer. `[community-knowledge-graph-architecture.json]`

---

**Note:** Step **1.5 API** [ENG-005] remains pending.

**Next recommended step:** [1.5 — API Architecture](API_ARCHITECTURE.md) [ENG-005] · then [1.10 — Search Architecture](SEARCH_ARCHITECTURE.md) [ENG-010]

**End of Volume 1.8 — Community Knowledge Graph Architecture.**
