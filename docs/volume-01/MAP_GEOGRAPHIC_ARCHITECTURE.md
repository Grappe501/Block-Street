# Build Volume 1.11 — Map & Geographic Architecture

### Engineering Architecture Bible

**Document ID:** VOLUME-001.11 · **ENG-011**  
**Artifact:** `MAP_GEOGRAPHIC_ARCHITECTURE.md`  
**Status:** Canonical  
**Priority:** Critical

**Companion:** [Arkansas Digital Twin Architecture](ARKANSAS_DIGITAL_TWIN_ARCHITECTURE.md) [ADT-002]  
**Builds on:** [1.4 Database Architecture](DATABASE_ARCHITECTURE.md) [ENG-004] · [Registry Service](DOMAIN_SERVICE_ARCHITECTURE.md) [ENG-DS08] · [1.8 CKG](COMMUNITY_KNOWLEDGE_GRAPH_ARCHITECTURE.md) [ENG-008] · [1.10 Search](SEARCH_ARCHITECTURE.md) [ENG-010]  
**Phase alignment:** [Arkansas Digital Twin Initialization](../phase-02/ARKANSAS_DIGITAL_TWIN_INITIALIZATION_PLAN.md) [ADT-001] · [County Model](../phase-02/COUNTY_REGISTRY_MODEL.md) [CNTY-001] · [Institution Model](../phase-02/INSTITUTION_REGISTRY_MODEL.md) [INST-001]  
**Live spec:** `data/registry/map-geographic-architecture.json`

---

## ENG-MG01 — Purpose

**[ENG-MG01]** The Map & Geographic Architecture defines how **geography is represented** throughout the Community Operating System.

**[ENG-MG01a]** Maps are **not decorative** — they are a primary way participants understand communities, opportunities, relationships, coverage, and growth across Arkansas [Phase 2 Digital Arkansas · ADT-001].

**[ENG-MG01b]** **Geography is a first-class architectural concept** — every major entity has geographic context.

---

## ENG-MG02 — Guiding Principle

**[ENG-MG02]**

> **Communities exist in places, but relationships connect those places.**

**[ENG-MG02a]** Maps should visualize **both geography and relationships** [ENG-KG · ARKANSAS_RELATIONSHIP_GRAPH].

---

## ENG-MG03 — Philosophy

**[ENG-MG03]** Traditional maps answer: *Where is it?*

**The COS also answers:**

| Question | Map / twin source |
|----------|-------------------|
| Where are communities growing? | Growth Map · ADT-002 |
| Where are volunteers needed? | Opportunity Map |
| Which counties are connected? | Partnership Map · CKG |
| Which campuses collaborate? | Partnership Map |
| Where should I help next? | Discovery + Opportunity |
| Where are opportunities emerging? | Growth Map · Intelligence |

**[ENG-MG03a]** Maps become **decision-support tools** — not passive backdrops [NISS-001 · CGIS-001].

---

## ENG-MG04 — Geographic Philosophy

**[ENG-MG04]** Geography as **multiple interconnected layers**:

State · region · county · city · campus · neighborhood (future) · community · institution · venue

**[ENG-MG04a]** Every entity carries **geographic context** — coordinates optional but hierarchy required.

---

## ENG-MG05 — Geographic Hierarchy

**[ENG-MG05]**

```text
United States (future)
        ↓
State (Arkansas)
        ↓
Region
        ↓
County
        ↓
City
        ↓
Institution
        ↓
Community
        ↓
Venue
```

**[ENG-MG05a]** Every level **inherits context** from above [CNTY-001 · INST-001 · REG-001].

**Storage:** `registry.geo_hierarchy` · PostGIS `geography` where coordinates exist

---

## ENG-MG06 — Canonical Geographic Registry

**[ENG-MG06]** **Registry Service** [ENG-DS08] is authoritative for:

Counties · cities · educational institutions · community boundaries · regions · service areas · public facilities · administrative geography

**[ENG-MG06a]** **All geographic references originate in Registry** — domain services store `geo_ref_id`, not duplicate boundaries [RCN-001].

**V1 transitional:** `data/registry/counties.json` · `institutions.json` → seed on deploy [ADT-001].

---

## ENG-MG07 — Core Maps Overview

**[ENG-MG07]** Platform provides **eight specialized maps** — composable layers on shared map engine.

| Map | Primary data | Route (V1) |
|-----|--------------|------------|
| Arkansas Community Map | Communities · status · growth | `/map` |
| Community Coverage Map | Launches · gaps · readiness | `/map/coverage` |
| Growth Map | Participants · launches · belonging | `/map/growth` |
| Opportunity Map | Volunteers · events · needs | `/map/opportunities` |
| Partnership Map | Institutions · partners · facilities | `/map/partnerships` |
| Capacity Map | Spaces · equipment · transport | `/map/capacity` |
| Story Atlas | Stories · milestones · traditions | `/map/stories` |
| Impact Map | Missions · hours · outcomes | `/map/impact` |

**[ENG-MG07a]** Shared rendering engine — **map logic separate from business logic** [ENG-MG26].

---

## ENG-MG08 — Arkansas Community Map

**[ENG-MG08]** Primary **statewide view** displays:

Campus communities · county communities · community status · growth · leadership · health · public profiles [COS-001 · CGS-001]

**[ENG-MG08a]** Default landing map for `/map` — aligns with live Netlify map scaffold.

---

## ENG-MG09 — Community Coverage Map

**[ENG-MG09]** Visualizes:

Communities launched · communities planned · counties without organizers · institutions without communities · expansion readiness [GOS-001 · CEF-001]

**[ENG-MG09a]** Coverage becomes **immediately understandable** — strategic planning surface [NISS-001].

---

## ENG-MG10 — Growth Map

**[ENG-MG10]** Displays geographically:

Participant growth · leadership growth · volunteer growth · community launches · invitation activity · belonging indicators [ICS-001 · GCN-001]

---

## ENG-MG11 — Opportunity Map

**[ENG-MG11]** Displays:

Volunteer opportunities · events · projects · community requests · mentorship needs · open committees [OEX-001 · ENG-SR11]

**[ENG-MG11a]** Participants discover **nearby opportunities** — integrates Discovery Engine [DGE-001].

---

## ENG-MG12 — Partnership Map

**[ENG-MG12]** Displays:

Partner institutions · libraries · museums · community orgs · businesses · shared facilities · partnership relationships [IPS-001 · SCN-001]

---

## ENG-MG13 — Capacity Map

**[ENG-MG13]** Displays:

Meeting spaces · equipment · transportation · shared resources · training facilities · community assets [CCS-001 · CCE-001]

---

## ENG-MG14 — Story Atlas

**[ENG-MG14]** Displays geographically [CST-001 · Story Service ENG-DS16]:

Community stories · mission stories · historic milestones · volunteer experiences · leadership stories · traditions

**[ENG-MG14a]** History becomes **geographic** — links to LHE narratives [LHE-001].

---

## ENG-MG15 — Impact Map

**[ENG-MG15]** Displays:

Completed missions · service projects · community improvements · volunteer hours · community outcomes [CIIS-001 · ANL-001]

---

## ENG-MG16 — Geographic Objects

**[ENG-MG16]** Every mapped object includes:

| Field | Purpose |
|-------|---------|
| `id` | Stable UUID |
| `coordinates` | lat/lng or PostGIS point (nullable for county centroids) |
| `region` | Region slug |
| `county_id` | Registry FK |
| `visibility` | PRE-scoped [ENG-AU14] |
| `type` | entity type for layer |
| `status` | lifecycle status |
| `related_entities` | CKG edge refs |
| `metadata` | jsonb extensions |

**[ENG-MG16a]** Geographic **consistency** simplifies multi-state expansion [GOS-M07].

---

## ENG-MG17 — Geographic Relationships

**[ENG-MG17]** Maps visualize **relationships**, not only pins [ENG-KG]:

Mentorship · partnerships · shared initiatives · volunteer exchanges · institution collaboration · leadership support

**[ENG-MG17a]** Edge overlays on map — line layers from `entity_relationships` with geo endpoints.

---

## ENG-MG18 — Layer Architecture

**[ENG-MG18]** Configurable layers — participants toggle:

Communities · events · stories · knowledge · volunteer opportunities · leadership · partnerships · capacity · boundaries

**[ENG-MG18a]** Layer config in DCL · persisted user preferences in `identity.map_preferences`.

---

## ENG-MG19 — Geographic Filtering

**[ENG-MG19]** Filter by:

County · institution · community · topic · mission · status · date · region · active layers

**[ENG-MG19a]** Same filter DSL as search [ENG-SR14] — `geo` facet shared.

---

## ENG-MG20 — Time-Aware Maps

**[ENG-MG20]** Historical views [ENG-009]:

Community launches by year · growth over time · historic missions · leadership history · partnership evolution

**[ENG-MG20a]** Maps become **historical narratives** — time slider · event replay from `domain_events`.

---

## ENG-MG21 — Geographic Search Integration

**[ENG-MG21]** Maps integrate with [ENG-010]:

Global · community · opportunity · story · knowledge search — **map bounds** as search filter · search results **pan map**

**[ENG-MG21a]** Map and search **operate together** — unified discovery experience.

---

## ENG-MG22 — Privacy

**[ENG-MG22]** Never expose through maps [PRE-001 · TPS-001]:

Private residences · private mentor relationships · sensitive meetings · restricted facilities

**[ENG-MG22a]** Coordinates for private venues **aggregated to community/county** level on public layers.

---

## ENG-MG23 — Future Geographic Capabilities

**[ENG-MG23]** Architecture remains extensible:

Walking routes · volunteer logistics · public transit · accessibility routes · disaster response · service area optimization · GIS integration · offline maps

**[ENG-MG23a]** Map engine **provider-swappable** — Mapbox GL V1 · future ArcGIS / OSM tiles behind interface.

---

## ENG-MG24 — Explainability

**[ENG-MG24]** Location recommendations explain:

Why this appears · how it relates to participant · which communities contributed · what opportunities exist [ENG-KG19 · DGE-001]

---

## ENG-MG25 — Arkansas Digital Twin

**[ENG-MG25]** Map architecture enables **[Arkansas Digital Twin Architecture](ARKANSAS_DIGITAL_TWIN_ARCHITECTURE.md) [ADT-002]** — living statewide geographic model.

**[ENG-MG25a]** Extends [ADT-001](../phase-02/ARKANSAS_DIGITAL_TWIN_INITIALIZATION_PLAN.md) initialization into **continuous operational twin** — not just seed data.

**[ENG-MG25b]** Combines geography + CKG + LHE + Growth Intelligence + Network Intelligence [NISS-M16].

---

## ENG-MG26 — Map Rendering Architecture

**[ENG-MG26a]** **Separate rendering from business logic:**

```text
Domain Services (geo facts)
        ↓
Registry + geo index
        ↓
Map Data API (GeoJSON features)
        ↓
Map Renderer (Mapbox GL / client)
        ↓
Layer UI (toggle · filter · time)
```

**Paths:** `packages/maps/` · `src/app/map/` · `src/lib/kernel/geo/`

**[ENG-MG26b]** Business rules stay in services — map package only renders features + handles interaction.

---

## ENG-MG27 — Future AI Assistance

**[ENG-MG27]** AI may:

Recommend nearby opportunities · suggest regional collaboration · identify underserved counties · recommend expansion priorities · highlight travel efficiencies · summarize regional activity

**[ENG-MG27a]** AI **assists geographic understanding** — does not make operational decisions [AIB-001 · DG-003].

---

## ENG-MG28 — Burt Implementation Guidance

**[ENG-MG28]** Implementation should:

- Treat geography as **shared platform service** [Registry + kernel/geo]
- Keep geographic data in **Registry** [ENG-MG06]
- **Separate map rendering** from business logic [ENG-MG26]
- Support **configurable layers** [ENG-MG18]
- Build **time-aware** mapping [ENG-MG20]
- **Integrate with CKG** for relationship overlays [ENG-MG17]
- Wire **ADT-002** for statewide strategic queries
- Respect **PRE** on every feature request

---

## Volume Cross-References

| Document | Relationship |
|----------|--------------|
| [ADT-001](../phase-02/ARKANSAS_DIGITAL_TWIN_INITIALIZATION_PLAN.md) | Initialization / birth |
| [ADT-002](ARKANSAS_DIGITAL_TWIN_ARCHITECTURE.md) | Living statewide model |
| [LDT-001](LIVING_DIGITAL_TWIN_ARCHITECTURE.md) | County twin dimension |
| [ENG-010 Search](SEARCH_ARCHITECTURE.md) | Geographic search |
| [NISS-001](../phase-06/NETWORK_INTELLIGENCE_STRATEGY_SYSTEM.md) | Network twin queries |

---

## AC-099 — Acceptance Criteria

Volume 1.11 is complete when:

- [x] **[AC-099a]** Geographic philosophy documented. `[ENG-MG02, ENG-MG04]`
- [x] **[AC-099b]** Core maps defined (8 maps). `[ENG-MG07–ENG-MG15]`
- [x] **[AC-099c]** Geographic hierarchy and registry established. `[ENG-MG05, ENG-MG06]`
- [x] **[AC-099d]** Layering, filtering, history, and privacy incorporated. `[ENG-MG18–ENG-MG22]`
- [x] **[AC-099e]** Arkansas Digital Twin specified. `[ENG-MG25, ADT-002]`
- [x] **[AC-099f]** Burt has blueprint for geography. `[map-geographic-architecture.json]`

---

**Note:** Step **1.5 API** [ENG-005] remains pending.

**Next recommended step:** [1.5 — API Architecture](API_ARCHITECTURE.md) [ENG-005] · then [1.12 — Communication](COMMUNICATION_ARCHITECTURE.md) [ENG-012]

**End of Volume 1.11 — Map & Geographic Architecture.**
