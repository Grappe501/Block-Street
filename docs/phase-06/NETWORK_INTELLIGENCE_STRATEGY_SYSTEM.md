# Network Intelligence & Strategy System

**Document ID:** PHASE-006.13  
**Artifact:** `NETWORK_INTELLIGENCE_STRATEGY_SYSTEM.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 6 — Growth Operating System  
**Acronym:** NISS

> **The strongest networks understand themselves without controlling themselves.**

Step 6.13 is where everything built across six phases **comes together**. This is **not** simply analytics — it is the platform **becoming aware of itself**. People, communities, missions, stories, knowledge, leadership, growth, and relationships — now unified into statewide **strategic intelligence** that helps everyone see the bigger picture without controlling local leadership.

**Requirement:** NISS-001 · **Planned alias superseded:** NIN-001 · **Implements:** [Living Network Graph GOS-M16](PHASE_6_MASTER_SEQUENCE.md) · **Phase umbrella:** GOS-001 · **Governed by:** [Growth Constitution GCN-001](GROWTH_CONSTITUTION.md)

**Builds On:** All Phase 1–6 systems · [Community Growth Intelligence CGIS-001](COMMUNITY_GROWTH_INTELLIGENCE_SYSTEM.md) · [Operational Intelligence OPIS-001](../phase-05/OPERATIONAL_INTELLIGENCE_SYSTEM.md) · [Community Impact Intelligence CIIS-001](../phase-05/COMMUNITY_IMPACT_INTELLIGENCE_SYSTEM.md) · [Community Intelligence CIS-001](../phase-04/COMMUNITY_INTELLIGENCE_SYSTEM.md) · [Personal Digital Twin PDT-001](../phase-03/PERSONAL_DIGITAL_TWIN.md) · [Knowledge & Data Governance KDG-001](../phase-03/KNOWLEDGE_DATA_GOVERNANCE.md)

**Live spec:** `data/registry/network-intelligence-strategy-system.json`

**Required reading for Burt.**

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| NISS-M01 | Purpose |
| NISS-M02 | Guiding principle |
| NISS-M03 | Philosophy |
| NISS-M04 | Strategic Awareness |
| NISS-M05 | Statewide Coverage |
| NISS-M06 | Community Health Intelligence |
| NISS-M07 | Leadership Intelligence |
| NISS-M08 | Collaboration Intelligence |
| NISS-M09 | Opportunity Intelligence |
| NISS-M10 | Knowledge Intelligence |
| NISS-M11 | Strategic Forecasting |
| NISS-M12 | Explainability |
| NISS-M13 | Privacy & Governance |
| NISS-M14 | Future AI assistance |
| NISS-M15 | Relationship to GOS-M16 |
| NISS-M16 | Statewide Network Twin |
| NISS-M17 | Community Knowledge Graph |
| NISS-M18 | V1 scope |
| NISS-BG | Burt implementation guidance |
| AC-074 | Step 6.13 acceptance criteria |

---

## NISS-M01 — Purpose

**[NISS-M01]** The **Network Intelligence & Strategy System (NISS)** continuously observes the health, relationships, growth, collaboration, leadership development, and operational activity of the statewide network to help communities make **better strategic decisions**.

**[NISS-M01a]** Objective: help the network **understand itself while preserving local leadership and community autonomy** [CCN-M004, GCN-M05 Community Before Scale].

**[NISS-M01b]** NISS is the **statewide strategic intelligence layer** — from student organizer to statewide coordinator, everyone can see the bigger picture [NISS-M02].

**[NISS-M01c]** NISS **does not control the network** — it provides **shared awareness** [NISS-M03].

---

## NISS-M02 — Guiding Principle

**[NISS-M02]**

> **The strongest networks understand themselves without controlling themselves.**

**[NISS-M02a]** **Awareness creates better collaboration** [SCN-001, IPS-001 partnership intelligence] — insight without hierarchy.

**[NISS-M02b]** Strategic intelligence **advises; communities decide** [CDS-001 collaborative decisions, CCN-M004 local autonomy].

---

## NISS-M03 — Philosophy

**[NISS-M03]** Communities should be able to answer:

- Where are we strongest? · Where are opportunities?
- Where do people need help? · How is the network evolving?
- What patterns are emerging? · What should we learn?

**[NISS-M03a]** Platform becomes a **statewide source of shared awareness** — not a command center [OPIS-M17 Operations Center is operational; NISS is strategic].

**[NISS-M03b]** Not analytics dashboards for metrics' sake [GCN-M03 Belonging Over Engagement] — intelligence in service of **community building**.

---

## NISS-M04 — Strategic Awareness

**[NISS-M04]** The system continuously understands:

| Domain | Source systems |
|--------|----------------|
| Community growth | CGO-001 · CGIS-001 |
| Volunteer participation | VDS-001 · OEX-001 |
| Leadership development | CLD-001 |
| Mission activity | MPS-001 · IOS-001 · ACN-001 |
| Partnerships | IPS-001 · SCN-001 |
| Storytelling | CST-001 |
| Knowledge creation | CKLS-001 · LIS-001 |
| Community health | CIS-001 · COS-M09 |
| Operational readiness | OPIS-001 · AOS-001 |
| Relationship expansion | PON-001 · PRN-001 |

**[NISS-M04a]** **Network develops strategic awareness** over time — aggregation layer, not duplicate data [NISS-BG].

**[NISS-M04b]** Orchestrator: `getStrategicAwareness(scope, domains?, filters?)`.

---

## NISS-M05 — Statewide Coverage

**[NISS-M05]** Visualize:

- Every county · every campus · every trade school · future high schools
- Community launch status · representation · mentorship · regional collaboration

**[NISS-M05a]** **Coverage becomes immediately visible** [Arkansas Coverage Map CGO-M16 · Community Explorer PCN-M16 · Civic Ecosystem Map IPS-M13 — NISS unifies strategic lens].

**[NISS-M05b]** Orchestrator: `getStatewideCoverage(filters?, layers?)`.

**[NISS-M05c]** Gap analysis: counties without communities · institutions without partners · mentorship deserts [CGIS-M Deepen Before Expand].

---

## NISS-M06 — Community Health Intelligence

**[NISS-M06]** Integrates into **unified community health picture**:

| Lens | System |
|------|--------|
| Community Health | CIS-001 · COS-M09 |
| Growth Intelligence | CGIS-001 |
| Operational Intelligence | OPIS-001 |
| Impact Intelligence | CIIS-001 |
| Leadership Development | CLD-001 |
| Belonging | WBS-001 · GCN-M16 Belonging Index |
| Learning | CKLS-001 · LIS-001 |

**[NISS-M06a]** Not siloed dashboards — **holistic health** for strategic conversation [CCN-M community self-assessment].

**[NISS-M06b]** Orchestrator: `getCommunityHealthIntelligence(communityId)`.

---

## NISS-M07 — Leadership Intelligence

**[NISS-M07]** Understand:

- Emerging leaders · mentorship pipelines · succession planning
- Leadership development · communities needing support · cross-campus mentoring

**[NISS-M07a]** **Leadership becomes visible statewide** [Leadership Constellation CLD-M16 · Generational Network LCN-M16].

**[NISS-M07b]** Orchestrator: `getLeadershipIntelligence(scope, filters?)`.

**[NISS-M07c]** Identifies communities ready to mentor others [CGIS-M13 explainable recommendations].

---

## NISS-M08 — Collaboration Intelligence

**[NISS-M08]** Observe:

- Cross-campus projects · county partnerships · shared initiatives
- Volunteer exchanges · knowledge sharing · institutional partnerships

**[NISS-M08a]** Network understands **collaboration patterns** [SCN-001 · IPS-001 · not ownership].

**[NISS-M08b]** Orchestrator: `getCollaborationIntelligence(scope, filters?)`.

**[NISS-M08c]** Highlights under-collaborating regions and successful collaboration models [CKLS-001 playbooks].

---

## NISS-M09 — Opportunity Intelligence

**[NISS-M09]** Surface (communities **choose how to respond**):

- Communities requesting help · volunteer shortages · partnership opportunities
- Expansion readiness · knowledge gaps · mentorship opportunities

**[NISS-M09a]** **Advisory only** — no automated assignment [OBE-001 opt-in matching, SEC-001 consent].

**[NISS-M09b]** Integrates [Opportunity Exchange OEX-001] · [IPS-001 partnership requests] · [CEF-001 expansion readiness].

**[NISS-M09c]** Orchestrator: `getOpportunityIntelligence(scope, filters?)`.

---

## NISS-M10 — Knowledge Intelligence

**[NISS-M10]** Track:

- Community Brain growth · Mission Library usage · Experience Playbooks
- Story Atlas · lessons learned · knowledge reuse

**[NISS-M10a]** **Knowledge becomes measurable as community capacity** [CCE-001 capability exchange, CCS-001 capacity].

**[NISS-M10b]** Orchestrator: `getKnowledgeIntelligence(scope, filters?)`.

**[NISS-M10c]** Identifies knowledge gaps and high-reuse playbooks [LIS-001 improvement graph].

---

## NISS-M11 — Strategic Forecasting

**[NISS-M11]** Future intelligence may identify (all **advisory**):

- Leadership transitions · expansion opportunities · growing communities
- Communities at risk of losing momentum · regional collaboration opportunities · training priorities

**[NISS-M11a]** **Forecasts remain advisory** [CGIS-M13 explainability · NISS-M12] — never automated decisions.

**[NISS-M11b]** v1.1+ · orchestrator: `getStrategicForecasts(scope, horizon?)`.

---

## NISS-M12 — Explainability

**[NISS-M12]** Every insight answers:

| Question | Required |
|----------|----------|
| What happened? | Factual summary |
| Why is this important? | Strategic context |
| What evidence supports this? | Source systems · data lineage [KDG-001] |
| What actions could communities consider? | Suggestions, not commands |

**[NISS-M12a]** **Transparency builds confidence** [CGIS-M13 · GCN-M15 AI governance].

**[NISS-M12b]** No black-box scores [GCN-M03] — explainable recommendation pipelines [NISS-BG].

**[NISS-M12c]** Orchestrator: `explainInsight(insightId)`.

---

## NISS-M13 — Privacy & Governance

**[NISS-M13]** Network Intelligence only uses information participants are **authorized to access** [SEC-001, KDG-001].

**[NISS-M13a]** Strategic summaries **protect individual privacy** while providing useful organizational awareness [KDG-M16 aggregation rules].

**[NISS-M13b]** Role-based dashboards [NISS-BG] — student organizer sees their scope; statewide coordinator sees aggregated statewide view.

**[NISS-M13c]** **Privacy is foundational** — never expose member lists, private discussions, or sensitive stories in strategic layer [PCN-M14, OPIS-001 boundaries].

---

## NISS-M14 — Future AI Assistance

**[NISS-M14]** Future AI **supports planning while leaving decisions to people** [GCN-M15].

**[NISS-M14a]** May:

- Summarize statewide trends · recommend partnerships
- Suggest leadership development opportunities · identify communities ready to mentor
- Generate annual statewide reports · recommend strategic priorities from observable patterns

**[NISS-M14b]** All AI outputs **explainable** [NISS-M12] and **role-appropriate** [NISS-M13].

---

## NISS-M15 — Relationship to GOS-M16

**[NISS-M15a]** **GOS-M16** (Phase 6 umbrella) established the **Living Network Graph (LNG)** vision — master model unifying specialized graphs so the platform understands itself.

**[NISS-M15b]** **NISS-001** (Phase 6.13) **implements that vision** through:

1. **[Community Knowledge Graph NISS-M17]** — foundational unified graph architecture
2. **[Statewide Network Twin NISS-M16]** — strategic query and awareness interface
3. **Intelligence domains M04–M10** — aggregation layers feeding the graph

**[NISS-M15c]** Planned **Network Intelligence NIN-001** superseded — renamed **Network Intelligence & Strategy System** with full strategic scope.

**[NISS-M15d]** GOS-M16 asked *"Can the platform understand itself?"* · NISS asks *"How does shared strategic awareness help every community lead better?"*

**[NISS-M15e]** `getLivingNetworkGraph()` remains as orchestrator alias → `getCommunityKnowledgeGraph()` [NISS-M17 backward compatibility].

---

## NISS-M16 — Statewide Network Twin

**[NISS-M16]** The **Statewide Network Twin (SNT)** is the **signature strategic experience** of NISS — a living model of the entire ecosystem, analogous to [Personal Digital Twin PDT-001] for individuals.

**[NISS-M16a]** Continuously understands:

- People · communities · missions · leadership · relationships
- Partnerships · knowledge · stories · capacity · opportunities · growth

**[NISS-M16b]** One screen, strategic questions:

- "Show me counties that could mentor neighboring counties."
- "Which campuses consistently develop new leaders?"
- "Where are Welcome Week playbooks producing strongest long-term participation?"
- "Which initiatives create the most cross-campus collaboration?"
- "Which educational institutions still have no community launched?"
- "Where are communities requesting mentors?"

**[NISS-M16c]** Network Twin **doesn't just display data** — it understands **relationships between everything built** [NISS-M17 Community Knowledge Graph].

**[NISS-M16d]** Route: `/network/twin` · orchestrator: `getStatewideNetworkTwin(query?, scope?, filters?)`.

**[NISS-M16e]** Role-configurable views [NISS-BG] — campus organizer · county coordinator · statewide strategist.

**[NISS-M16f]** Complements [Arkansas Growth Observatory CGIS-M16] (growth lens) · [Operations Center OPIS-M17] (operational lens) · **SNT is strategic lens**.

---

## NISS-M17 — Community Knowledge Graph

**[NISS-M17]** The **Community Knowledge Graph (CKG)** is the **foundational unified graph architecture** — the architectural idea that elevates the project from civic website to true **Community Operating System**.

**[NISS-M17a]** Unifies every graph designed across six phases:

| Graph | Phase | Role |
|-------|-------|------|
| Relationship Graph | 2–3 | Who knows whom · invites · mentorship |
| Trust Graph | 3 | Depth of connection |
| Growth Graph | 3–6 | Personal and community development |
| Conversation Graph | 4 | Communication patterns |
| Capability Graph | 4 | What communities can share |
| Decision Graph | 5 | How choices became action |
| Improvement Graph | 5 | How lessons spread |
| Operational Graph | 5 | How operational events connect |
| Impact Chain | 5 | How actions led to change |
| Generational Graph | 6 | Mentorship lineages [LCN-M16] |
| Partnership Graph | 6 | Institutional connections [IPS-M13] |
| **Community Knowledge Graph** | **6** | **Unified node-edge model — everything interconnected** |

**[NISS-M17b]** Every **person, community, institution, mission, story, event, playbook, capability, decision, and relationship** becomes a **node**; influence and connection become **edges**.

**[NISS-M17c]** Platform answers questions **no traditional CRM or volunteer system can answer** — because it understands **how people, communities, and ideas influence one another over time** [GOS-001 vision].

**[NISS-M17d]** **Foundation for future capabilities** without architectural redesign [CEF-M01 extensibility, scalability target 2→20,000].

**[NISS-M17e]** Route: `/network/graph` (admin/analyst) · orchestrator: `getCommunityKnowledgeGraph(scope, filters?, nodeTypes?, edgeTypes?)`.

**[NISS-M17f]** Implements [Living Network Graph GOS-M16] — LNG is the **public name**; CKG is the **implementation architecture** [NISS-M15].

**[NISS-M17g]** Not primary end-user UI most of the time — **underlying model** powering Network Twin, Growth Observatory, and future intelligence [GOS-M16 design intent preserved].

---

## NISS-M18 — V1 scope

| Deliverable | Status |
|-------------|--------|
| NISS philosophy documented | ✅ |
| Strategic awareness categories | ✅ |
| Health, leadership, collaboration, knowledge intelligence | ✅ |
| Explainability and privacy | ✅ |
| Community Knowledge Graph architecture | ✅ |
| Statewide Network Twin spec | ✅ |
| Live graph aggregation | v1.1 |
| Predictive forecasting | v1.2 |

---

## NISS-BG — Burt Implementation Guidance

**[NISS-BG-a]** Implementation should:

- Treat Network Intelligence as **aggregation layer built on existing systems** — no duplicate source of truth
- **Separate strategic summaries from operational execution** [OPIS vs NISS]
- Support **configurable dashboards for different roles** [campus · county · statewide]
- Maintain **explainable recommendation pipelines** [NISS-M12]
- **Respect all permission boundaries** [SEC-001, KDG-001 at query layer]
- Prepare for **future predictive analytics** [NISS-M11]
- Implement **Community Knowledge Graph** as unified graph store with typed nodes and edges [NISS-M17]

**[NISS-BG-b]** Files:

```
src/lib/niss/getStrategicAwareness.ts
src/lib/niss/getCommunityHealthIntelligence.ts
src/lib/niss/getLeadershipIntelligence.ts
src/lib/niss/getCollaborationIntelligence.ts
src/lib/niss/getOpportunityIntelligence.ts
src/lib/niss/getKnowledgeIntelligence.ts
src/lib/niss/getStatewideNetworkTwin.ts
src/lib/niss/getCommunityKnowledgeGraph.ts
src/lib/niss/explainInsight.ts
src/lib/graph/getLivingNetworkGraph.ts  // alias → getCommunityKnowledgeGraph
src/components/network/StatewideNetworkTwin.tsx
src/components/network/CommunityKnowledgeGraphView.tsx
data/registry/network-intelligence-strategy-system.json
```

**[NISS-BG-c]** Database: `DB-NISS` · tables: `ckg_nodes`, `ckg_edges`, `strategic_insights`, `network_twin_cache`, `intelligence_snapshots`.

---

## AC-074 — Acceptance Criteria

Step 6.13 is complete when:

- [x] **[AC-074a]** Network Intelligence & Strategy philosophy documented. `[NISS-M01, NISS-M02, NISS-M03]`
- [x] **[AC-074b]** Strategic awareness categories established. `[NISS-M04, NISS-M05]`
- [x] **[AC-074c]** Community, leadership, collaboration, and knowledge intelligence defined. `[NISS-M06–M10]`
- [x] **[AC-074d]** Explainability and privacy incorporated. `[NISS-M12, NISS-M13]`
- [x] **[AC-074e]** Community Knowledge Graph specified. `[NISS-M17]`
- [x] **[AC-074f]** Statewide Network Twin specified. `[NISS-M16]`
- [x] **[AC-074g]** Burt has blueprint for statewide strategic awareness. `[NISS-BG, network-intelligence-strategy-system.json]`

---

**Phase 6 Complete.** · **Volume 0:** [Master Architecture Bible [MAB-001]](../master/MASTER_ARCHITECTURE_BIBLE.md) — canonical source of truth; read before production code

*Trace: Six phases of data → Community Knowledge Graph → strategic intelligence → Network Twin queries → communities decide → network grows wiser*
