# Community Intelligence Fabric

**Document ID:** CIF-001  
**Artifact:** `COMMUNITY_INTELLIGENCE_FABRIC.md`  
**Status:** Canonical  
**Priority:** Critical  
**Parent:** [AI & Intelligence Technical Architecture](AI_INTELLIGENCE_ARCHITECTURE.md) [ENG-013 · ENG-AI21]

**Live spec:** `data/registry/community-intelligence-fabric.json`

> **One pattern** for every intelligence capability — AI, search, graph, twins, and analytics orchestrated together.

---

## CIF-M01 — Purpose

**[CIF-M01]** The **Community Intelligence Fabric (CIF)** coordinates AI, search, knowledge retrieval, graph queries, Digital Twins, and analytics — **not as separate silos**.

**[CIF-M01a]** Creates a **single architectural pattern** for explainable assistance grounded in canonical data and constitutional principles [ENG-AI04 · CP-010].

**[CIF-M01b]** Sits within the **AI Orchestration Layer** [ENG-AI06] — Fabric is the multi-source coordinator; Orchestrator is the entry gateway.

---

## CIF-M02 — Guiding Principle

**[CIF-M02]**

> **Ask the platform once — retrieve from everywhere authorized — answer with evidence.**

---

## CIF-M03 — Fabric Components

**[CIF-M03]** CIF orchestrates existing systems:

| Component | Role in Fabric |
|-----------|----------------|
| **Community Knowledge Graph** [ENG-008] | Relationship context · multi-hop evidence |
| **Search Service** [ENG-010] | Keyword/semantic discovery |
| **Knowledge domains** [CKLS-001] | Brain · playbooks · lessons · legacy |
| **Living Digital Twins** [LDT-001] | Entity state summaries |
| **Living History Engine** [LHE-001] | Narrative context |
| **Growth Intelligence** [CGIS-001] | Expansion signals |
| **Network Intelligence** [NISS-001] | Statewide patterns |
| **Operational Intelligence** [OPIS-001] | Mission/event situational |
| **Intelligence Service** [ENG-DS20] | Persist approved insights |
| **Calendar / maps** [ENG-011] | Scheduling · geographic context |

**[CIF-M03a]** Fabric **does not duplicate storage** — it orchestrates reads through service contracts [SRG-001].

---

## CIF-M04 — Example Query Flow

**[CIF-M04]** Participant asks:

> *"How can our county recruit more volunteers for next month's cleanup?"*

**Fabric steps:**

1. **PRE** — scope to county · participant role
2. **CKG query** — similar missions · mentor networks · partner communities
3. **Mission Library search** — past cleanup missions · outcomes
4. **Community Brain** — lessons learned · recruitment playbooks
5. **County Digital Twin** [LDT-001 · ADT-002] — gaps · existing volunteer density
6. **Growth + Leadership Intelligence** — mentorship availability · expansion history
7. **Calendar** — scheduling conflicts next month
8. **Graph** — nearby mentors · institutions · successful peer counties
9. **Synthesis** — evidence-backed recommendation with **citations** to each source
10. **Human review** — organizer approves before any mass announcement [ENG-AI14]

---

## CIF-M05 — Fabric Request Contract

```typescript
interface FabricRequest {
  query: string;
  actorId: string;
  context: {
    communityId?: string;
    countyId?: string;
    missionId?: string;
  };
  intent?: "plan" | "research" | "summarize" | "recommend" | "explore";
  maxSources?: number;
}

interface FabricResponse {
  answer: string;
  citations: Array<{
    sourceType: string;
    sourceId: string;
    excerpt: string;
    url?: string;
  }>;
  sourcesConsulted: string[];
  graphPaths?: GraphEdge[];
  twinSnapshots?: string[];
  uncertainties: string[];
  suggestedActions?: Array<{ label: string; requiresApproval: boolean }>;
}
```

---

## CIF-M06 — Capability Catalog

**[CIF-M06]** Register fabric-enabled capabilities in DCL:

```text
fabric.capability.recruit_volunteers
fabric.capability.plan_mission
fabric.capability.summarize_community_health
fabric.capability.find_mentor
fabric.capability.explore_partnerships
```

**[CIF-M06a]** Each capability declares: required sources · agent · approval rules · explainability template.

---

## CIF-M07 — Agent Routing

**[CIF-M07]** Orchestrator routes to specialized agent [ENG-AI10] · agent invokes **Fabric pipeline** for multi-source assembly:

```text
User query → Orchestrator → intent classification → Agent selection
        → CIF.assemble(request) → LLM synthesis → explainability envelope
```

**Path:** `src/lib/kernel/ai/fabric.ts`

---

## CIF-M08 — Graceful Degradation

**[CIF-M08]** If LLM unavailable, Fabric still returns:

- Search results ranked
- Graph neighbor list
- Twin summary JSON
- Playbook links

**[CIF-M08a]** **Partial fabric** beats total failure [ENG-AI15].

---

## CIF-M09 — V1 Scope

**[CIF-M09a]** V1 Fabric capabilities:

- `fabric.capability.find_playbook` — search + knowledge only
- `fabric.capability.suggest_mentor` — CKG + PRE · no LLM synthesis required V1
- `fabric.capability.summarize_mission` — mission twin + events · LLM optional

**[CIF-M09b]** Full multi-source synthesis · county recruitment example · natural language — v1.1+ with LLM.

---

## CIF-M10 — Observability

**[CIF-M10]** Log per request: `sourcesConsulted[]` · latency per source · cache hits · approval outcomes — no raw PII in aggregate logs [ENG-AI16].

---

## AC-104 — Acceptance Criteria

- [x] **[AC-104a]** CIF purpose and component map documented. `[CIF-M01, M03]`
- [x] **[AC-104b]** Example flow and request/response contract specified. `[CIF-M04, M05]`
- [x] **[AC-104c]** Capability catalog, routing, degradation, and V1 scope defined. `[CIF-M06–M09]`

---

**End of Community Intelligence Fabric.**
