# Living Digital Twin Architecture

**Document ID:** LDT-001  
**Artifact:** `LIVING_DIGITAL_TWIN_ARCHITECTURE.md`  
**Status:** Canonical  
**Priority:** Critical  
**Parent:** [Community Knowledge Graph Architecture](COMMUNITY_KNOWLEDGE_GRAPH_ARCHITECTURE.md) [ENG-008 · ENG-KG23]

**Live spec:** `data/registry/living-digital-twin-architecture.json`

> A **consistent architectural pattern** — every major entity has a living graph-derived representation for intelligence, dashboards, and AI.

---

## LDT-M01 — Purpose

**[LDT-M01]** The **Living Digital Twin** architecture provides a graph-derived **living representation** for every major entity in the COS.

**[LDT-M01a]** Not just individuals — **participants, communities, institutions, missions, initiatives, partnerships, and counties** each have a twin.

**[LDT-M01b]** Intelligence systems, dashboards, planning tools, and AI assistants interact with **twins** rather than reassembling the same information repeatedly.

**[LDT-M01c]** Canonical data remains anchored in **SQL** · relationships in **CKG** · twins are **projections** [ENG-KG04].

---

## LDT-M02 — Guiding Principle

**[LDT-M02]**

> **Understand the whole entity — current state, history, and connections — through one consistent abstraction.**

**[LDT-M02a]** Extends [PDT-001](../phase-03/PERSONAL_DIGITAL_TWIN.md) Personal Digital Twin to **all entity types** · aligns with [NISS-M16](../phase-06/NETWORK_INTELLIGENCE_STRATEGY_SYSTEM.md) Statewide Network Twin · [ADT-001](../phase-02/ARKANSAS_DIGITAL_TWIN_INITIALIZATION_PLAN.md) geographic initialization.

---

## LDT-M03 — Twin Dimensions

**[LDT-M03]** Every twin continuously understands:

| Dimension | Source |
|-----------|--------|
| **Current state** | Owning domain service |
| **Historical timeline** | domain_events + temporal edges [ENG-009] |
| **Relationships** | CKG traversal |
| **Participation** | membership · attendance edges |
| **Growth** | Growth graph [ENG-KG16] |
| **Leadership** | Leadership graph [ENG-KG15] |
| **Stories** | Story graph [ENG-KG14] |
| **Knowledge** | Knowledge inheritance [ENG-KG11] |
| **Capacity** | Capacity service |
| **Opportunities** | Opportunity service |

---

## LDT-M04 — Twin Types

**[LDT-M04a]** **Participant Twin** [PDT-001]

Communities · volunteer history · mentorships · skills · stories · leadership journey · civic passport [CJT-001]

**[LDT-M04b]** **Community Twin**

Members · traditions · health metrics · partnerships · growth stage · institutional knowledge · genome [ENG-KG17]

**[LDT-M04c]** **County Twin**

Local communities · institutional partners · volunteer opportunities · service gaps · regional collaborations [CNTY-001]

**[LDT-M04d]** **Institution Twin**

Campus communities · partnerships · student participation · outreach footprint [INST-001]

**[LDT-M04e]** **Mission Twin**

Tasks · participants · outcomes · lessons · related stories · impact chain

**[LDT-M04f]** **Partnership Twin**

Collaborating entities · shared initiatives · facilities · mentor links [IPS-001]

**[LDT-M04g]** **Statewide Network Twin** [NISS-M16]

Arkansas-wide aggregate — strategic queries · health · gaps · cross-county bridges

---

## LDT-M05 — Twin Schema Pattern

**[LDT-M05a]** Projection record (not canonical):

```sql
platform.digital_twins (
  id uuid PRIMARY KEY,
  entity_type text NOT NULL,      -- participant, community, county, ...
  entity_id uuid NOT NULL,
  summary jsonb NOT NULL,         -- current state snapshot
  relationship_counts jsonb,      -- edge type tallies
  timeline_cursor timestamptz,    -- last event processed
  graph_version integer,
  refreshed_at timestamptz NOT NULL,
  UNIQUE (entity_type, entity_id)
);
```

**[LDT-M05b]** `summary` is **derived** — rebuild from source on demand or incrementally on domain events.

---

## LDT-M06 — Refresh Strategy

**[LDT-M06a]** **Event-driven incremental** — domain events trigger twin partial update [ENG-DS27].

**[LDT-M06b]** **Scheduled full rebuild** — nightly for drift correction · labeled `stale_after` in API responses.

**[LDT-M06c]** **On-demand refresh** — admin or intelligence service explicit request.

**[LDT-M06d]** Never write business facts **into** twin table — only read projections.

---

## LDT-M07 — Twin API

**[LDT-M07a]** Kernel interface:

```typescript
interface DigitalTwin {
  entityType: string;
  entityId: string;
  currentState: Record<string, unknown>;
  relationships: GraphEdgeSummary[];
  timeline: TimelineEntry[];
  refreshedAt: string;
  graphVersion: number;
}

getTwin(entityType, entityId, scope): Promise<DigitalTwin>;
getTwinRelationships(entityType, entityId, edgeTypes, depth): Promise<GraphResult>;
```

**Path:** `src/lib/kernel/twin/`

**[LDT-M07b]** All twin reads pass through **PRE** — same authorization as source entities [ENG-KG20].

---

## LDT-M08 — Consumers

| Consumer | Use |
|----------|-----|
| **Personal Headquarters** [PHQ-001] | Participant Twin |
| **Community dashboard** [COS-001] | Community Twin |
| **County organizing** [CNTY-001] | County Twin |
| **Intelligence Service** [ENG-DS20] | All twins · strategic queries |
| **AI assistants** [AIB-001] | Context assembly · never canonical write |
| **Network graph UI** [NISS-001] | Statewide Network Twin |

---

## LDT-M09 — V1 Scope

**[LDT-M09a]** V1 twins: **Participant** · **Community** · **County** (matches Digital Arkansas launch).

**[LDT-M09b]** Institution · Mission · Partnership twins — schema ready · full projection v1.1+.

**[LDT-M09c]** Transitional: PHQ assembles participant context manually until twin projection live [PDT-001].

---

## LDT-M10 — Composition Not Duplication

**[LDT-M10]** Twins **compose** from domain services and CKG — they do not **duplicate** ownership [PDT-M08 composition principle].

**Rule:** If a fact changes, update the **owning service** — twin refreshes on event.

---

## AC-094 — Acceptance Criteria

- [x] **[AC-094a]** LDT purpose and twin types documented. `[LDT-M01, M04]`
- [x] **[AC-094b]** Twin dimensions and schema pattern specified. `[LDT-M03, M05]`
- [x] **[AC-094c]** Refresh strategy, API, and V1 scope defined. `[LDT-M06, M07, M09]`

---

**End of Living Digital Twin Architecture.**
