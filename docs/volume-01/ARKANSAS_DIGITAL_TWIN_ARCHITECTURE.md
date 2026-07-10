# Arkansas Digital Twin Architecture

**Document ID:** ADT-002  
**Artifact:** `ARKANSAS_DIGITAL_TWIN_ARCHITECTURE.md`  
**Status:** Canonical  
**Priority:** Critical  
**Parent:** [Map & Geographic Architecture](MAP_GEOGRAPHIC_ARCHITECTURE.md) [ENG-011 · ENG-MG25]

**Initialization:** [Arkansas Digital Twin Initialization Plan](../phase-02/ARKANSAS_DIGITAL_TWIN_INITIALIZATION_PLAN.md) [ADT-001]  
**Live spec:** `data/registry/arkansas-digital-twin-architecture.json`

> A **living geographic model** of the statewide ecosystem — not just a map.

---

## ADT2-M01 — Purpose

**[ADT2-M01]** The **Arkansas Digital Twin (ADT)** is a continuously updated **statewide geographic and relational model** — every county, institution, community, initiative, partner, event, and mission represented within it.

**[ADT2-M01a]** **Not just a map** — a decision-support model that helps organizers understand **how communities interact across Arkansas** and where thoughtful action has greatest impact [NISS-M16 · CGIS-001].

**[ADT2-M01b]** **Builds on** [ADT-001](../phase-02/ARKANSAS_DIGITAL_TWIN_INITIALIZATION_PLAN.md) initialization — birth blueprint becomes **living system** at runtime.

**[ADT2-M01c]** Distinct from [LDT-001](LIVING_DIGITAL_TWIN_ARCHITECTURE.md) entity twins — ADT is the **statewide aggregate**; LDT covers per-entity projections.

---

## ADT2-M02 — Guiding Principle

**[ADT2-M02]**

> **Geography is an active part of decision-making — not a passive backdrop.**

---

## ADT2-M03 — Continuous Understanding

**[ADT2-M03]** ADT continuously understands:

| Dimension | Sources |
|-----------|---------|
| Community locations | Registry · Community Service |
| Growth patterns | Growth Map · domain events |
| Leadership distribution | Leadership graph · CKG |
| Volunteer activity | Opportunity · Experience services |
| Institutional partnerships | Partnership Service |
| Opportunity density | Opportunity Map · search index |
| Service gaps | Coverage Map · intelligence |
| Resource availability | Capacity Map |
| Community health | Intelligence · CGS stages |
| Historical development | LHE · domain_events |

---

## ADT2-M04 — Strategic Queries

**[ADT2-M04]** Authorized organizers may ask:

- Which counties have no active campus communities?
- Where are mentorship resources concentrated?
- Which regions have greatest unmet volunteer needs?
- Which institutions collaborate across county lines?
- Where should a new community launch next?

**[ADT2-M04a]** Query interface combines **geo filters + CKG traversal + intelligence aggregates** [NISS-001 strategic query API].

```typescript
interface AdtQuery {
  question: string;              // natural language (future AI)
  geoScope?: { county?: string; region?: string };
  layers: AdtLayer[];
  timeRange?: { from: string; to: string };
}

interface AdtQueryResult {
  summary: string;
  features: GeoFeature[];
  evidence: { events: string[]; edges: GraphEdge[] };
  gaps?: GapAnalysis[];
}
```

---

## ADT2-M05 — Architecture

```text
ADT-001 Initialization (seed registry + relationships)
        ↓
Domain events + service updates (continuous)
        ↓
Statewide projection (platform.arkansas_twin_snapshot)
        ↓
Map layers (8 core maps) + strategic query API
        ↓
Organizer dashboards · NISS · AI (read-only)
```

**[ADT2-M05a]** Snapshot **refreshed incrementally** — same pattern as LDT-001 [LDT-M06].

---

## ADT2-M06 — Storage Pattern

```sql
platform.arkansas_twin_snapshot (
  id uuid PRIMARY KEY,
  snapshot_type text NOT NULL,    -- coverage, growth, gaps, health
  geo_scope text NOT NULL,        -- statewide, region, county
  geo_scope_id text,
  summary jsonb NOT NULL,
  feature_collection jsonb,       -- GeoJSON FeatureCollection
  evidence_refs jsonb NOT NULL,
  computed_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1
);
```

**[ADT2-M06a]** Snapshots are **derived** — rebuild from canonical sources on demand.

---

## ADT2-M07 — Integration Stack

**[ADT2-M07]** ADT combines:

| System | Role |
|--------|------|
| **Registry** [ENG-DS08] | Canonical geography |
| **CKG** [ENG-008] | Cross-entity relationships |
| **LHE** [LHE-001] | Historical narratives |
| **Growth Intelligence** [CGIS-001] | Expansion signals |
| **Network Intelligence** [NISS-001] | Statewide patterns |
| **Search** [ENG-010] | Discovery + geo filters |
| **PRE** [PRE-001] | Query authorization |

---

## ADT2-M08 — Surfaces

| Surface | Use |
|---------|-----|
| `/map` | Primary ADT visualization |
| `/network/twin` | Statewide Network Twin [NISS-M16] |
| County organizer tools | County-scoped ADT slice |
| Regional coordinator dashboard | Multi-county view |
| Launch planning [CEF-001] | Gap analysis for new communities |

---

## ADT2-M09 — V1 Scope

**[ADT2-M09a]** V1 ADT:

- Arkansas Community Map + Coverage Map on `/map`
- County + institution pins from registry seeds [ADT-001]
- Community status overlay when communities exist
- **3 strategic queries** hardcoded (counties without communities, institutions without communities, communities by county)

**[ADT2-M09b]** Full snapshot pipeline · AI natural language queries · impact/growth layers — v1.1+.

**Path:** `src/lib/kernel/geo/arkansas-twin.ts`

---

## ADT2-M10 — Privacy & Authority

**[ADT2-M10a]** Strategic queries require **regional_coordinator** or **system_administrator** for statewide gaps · **community_administrator** for local scope [ENG-AU10].

**[ADT2-M10b]** Public map layers show **only public-profile communities** and aggregated stats — never private participant locations [ENG-MG22].

---

## AC-100 — Acceptance Criteria

- [x] **[AC-100a]** ADT purpose and distinction from ADT-001/LDT-001 documented. `[ADT2-M01]`
- [x] **[AC-100b]** Continuous dimensions and strategic queries specified. `[ADT2-M03, M04]`
- [x] **[AC-100c]** Architecture, storage, integration, V1 scope defined. `[ADT2-M05–M09]`

---

**End of Arkansas Digital Twin Architecture.**
