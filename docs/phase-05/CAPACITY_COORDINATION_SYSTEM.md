# Capacity Coordination System

**Document ID:** PHASE-005.9  
**Artifact:** `CAPACITY_COORDINATION_SYSTEM.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 5 — Action Operating System  
**Acronym:** CCS

> **Communities succeed when they understand and coordinate their collective capacity.**

**Resources** is too narrow. Communities coordinate **capacity** — everything a community can bring to accomplish a mission: people, time, equipment, transportation, facilities, knowledge, skills, budget (future), partnerships, and technology. CCS is the **logistics engine** of the entire platform.

**Requirement:** CCS-001 · **Supersedes:** RCS-001 (Resource Coordination System) · **Governed by:** [Action Constitution ACN-001](ACTION_CONSTITUTION.md)

**Builds On:** [Community Capability Exchange CCE-001](../phase-04/COMMUNITY_CAPABILITY_EXCHANGE.md) · [Opportunity Exchange OEX-001](../phase-04/OPPORTUNITY_EXCHANGE.md) · [Statewide Collaboration Network SCN-001](../phase-04/STATEWIDE_COLLABORATION_NETWORK.md) · [Community Knowledge CKLS-001](../phase-04/COMMUNITY_KNOWLEDGE_LEARNING_SYSTEM.md) · [Execution Operating System EOS-001](EXECUTION_OPERATING_SYSTEM.md) · [Mission Design System MDS-001](MISSION_DESIGN_SYSTEM.md)

**Live spec:** `data/registry/capacity-coordination-system.json`

**Required reading for Burt.**

**Core questions:** *What do we already have?* · *What do we still need?*

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| CCS-M01 | Purpose |
| CCS-M02 | Guiding principle |
| CCS-M03 | Capacity philosophy |
| CCS-M04 | Capacity categories |
| CCS-M05 | Capacity Profiles |
| CCS-M06 | Capacity Requests |
| CCS-M07 | Capacity Matching |
| CCS-M08 | Capacity Planning |
| CCS-M09 | Capacity Sharing |
| CCS-M10 | Capacity Forecasting |
| CCS-M11 | Capacity History |
| CCS-M12 | Future AI assistance |
| CCS-M13 | Time & budget capacity |
| CCS-M14 | CCE relationship |
| CCS-M15 | Logistics engine role |
| CCS-M16 | Arkansas Capacity Map |
| CCS-M17 | Logistics layer stack |
| CCS-M18 | Platform integrations |
| CCS-M19 | V1 scope |
| CCS-BG | Burt implementation guidance |
| AC-056 | Step 5.9 acceptance criteria |

---

## CCS-M01 — Purpose

**[CCS-M01]** The **Capacity Coordination System (CCS)** helps communities **understand, organize, and coordinate** the people, skills, equipment, spaces, time, and other assets required to successfully complete missions.

**[CCS-M01a]** Rather than simply tracking resources, CCS provides a **real-time picture of community capacity** and helps **match available capabilities with community needs** [CCE-001, OEX-001].

**[CCS-M01b]** CCS is the platform's **logistics engine** — operational layer connecting design [MDS-001], execution [EOS-001], and statewide collaboration [SCN-001].

**[CCS-M01c]** Capacity items are **first-class entities** — separate from individual missions, many-to-many linked [CCS-BG].

---

## CCS-M02 — Guiding Principle

**[CCS-M02]**

> **Communities succeed when they understand and coordinate their collective capacity.**

**[CCS-M02a]** The platform should help organizers answer:

- **What do we already have?**
- **What do we still need?**

**[CCS-M02b]** Visibility enables **coordination without central control** [SCN-M01 local autonomy, IOS-M13].

---

## CCS-M03 — Capacity Philosophy

**[CCS-M03]** **Capacity is broader than inventory.**

**[CCS-M03a]** Every community possesses:

| Dimension | Examples |
|-----------|----------|
| People | Volunteers, mentors, leaders [VDS-001] |
| Knowledge | Playbooks, lessons [CKLS-001] |
| Experience | Past missions, alumni [CLS-001] |
| Equipment | Canopies, projectors, signage |
| Facilities | Meeting rooms, campus spaces |
| Skills | Photography, teaching, tech [CCE-001] |
| Time | Availability windows [TSOS-001] |
| Relationships | Partners, networks [PRN-001] |
| Technology | Streaming, websites, tools |
| Transportation | Rides, equipment haul |

**[CCS-M03b]** The platform should make these **visible** — not hoarded in spreadsheets [CCS-M16 Arkansas Capacity Map].

---

## CCS-M04 — Capacity Categories

**[CCS-M04]** Structured categories — extensible:

### People [CCS-M04a]

Volunteers · Mentors · Subject matter experts · Leaders · Supporters · Partner organizations · Future alumni [VDS-001, PGL-001]

### Skills [CCS-M04b]

Photography · Teaching · Writing · Technology · Translation · Public speaking · Event planning · Research · Design · Leadership · Medical training (future) — overlaps **Capability Graph** [CCE-001] with CCS as **operational coordination layer**

### Facilities [CCS-M04c]

Meeting rooms · Campus spaces · Community centers · Libraries · Outdoor venues · Training locations · Storage

### Equipment [CCS-M04d]

Canopies · Tables · Projectors · Microphones · Cameras · Printers · Laptops · Signage · Extension cords · Future inventory tracking

### Transportation [CCS-M04e]

Personal vehicles (optional) · Ride coordination · Equipment transport · Supply delivery · Travel planning · Future mileage tracking

### Technology [CCS-M04f]

Websites · Presentation systems · Internet access · Streaming equipment · Computers · QR scanners · Software tools

### Partnerships [CCS-M04g]

Community organizations · Campus organizations · Faith communities · Businesses · Nonprofits · Government agencies (where appropriate) · Educational institutions — **partnerships expand capacity**

---

## CCS-M05 — Capacity Profiles

**[CCS-M05]** Every capacity item has a **profile**:

| Field | Purpose |
|-------|---------|
| Name | Human-readable identifier |
| Category | [CCS-M04] category |
| Description | What this capacity provides |
| Owner | Community or participant |
| Community | Owning community |
| Availability | When available [TSOS-001] |
| Location | Geographic anchor [SCN-001] |
| Usage restrictions | Terms, policies |
| Related missions | Active links [MDS-001, EOS-001] |
| Contact information | Coordination path |
| Current status | Available, reserved, in use, unavailable |

**[CCS-M05a]** The system understands **how every asset contributes to community work** [ACN-M26 MOR resource sections].

---

## CCS-M06 — Capacity Requests

**[CCS-M06]** Communities may **publish needs**:

| Request | Example |
|---------|---------|
| Need projector | Equipment |
| Need photographer | Skills |
| Need meeting room | Facilities |
| Need volunteers | People [VDS-001] |
| Need transportation | Transportation |
| Need training | Knowledge [CKLS-001] |
| Need technology | Technology |

**[CCS-M06a]** Requests become **visible across the statewide network** [OEX-001, SCN-001] — opt-in sharing [CCE-001].

**[CCS-M06b]** Connects to **Commitment support requests** [CFS-M09] and **Initiative shared resources** [IOS-M10].

---

## CCS-M07 — Capacity Matching

**[CCS-M07]** The platform matches:

```text
Community needs
        ↓
Available capacity
```

**[CCS-M07a]** Examples:

- Nearby campus has equipment
- Neighboring county has volunteers
- Experienced organizer available
- Unused meeting room nearby

**[CCS-M07b]** **Matching encourages collaboration** — not competition [SCN-001, CCN-M01 equal standing].

**[CCS-M07c]** Orchestrator: `matchCapacity(needId, filters?)` · surfaces in **Arkansas Capacity Map** [CCS-M16].

---

## CCS-M08 — Capacity Planning

**[CCS-M08]** Mission designers should see **before execution** [MDS-M11]:

- Current capacity
- Projected shortages
- Volunteer needs [VDS-001]
- Facility availability
- Equipment conflicts
- Transportation requirements

**[CCS-M08a]** **Capacity planning begins before execution** — integrated into Mission Canvas resources section [MDS-M11].

**[CCS-M08b]** Surfaces in Mission Design and **Daily Operations Brief** resource gaps [EOS-M17].

---

## CCS-M09 — Capacity Sharing

**[CCS-M09]** Communities should easily share:

Equipment · Knowledge · Facilities · Training · Templates · Volunteers · Partnerships

**[CCS-M09a]** **Sharing strengthens the statewide ecosystem** [CCE-001 share/request/discover, IOS-M10 initiative resources].

**[CCS-M09b]** Sharing is **voluntary** — communities control what is visible [CCN-001, KDG-001].

---

## CCS-M10 — Capacity Forecasting

**[CCS-M10]** Future intelligence may identify:

- Volunteer shortages
- Facility conflicts
- Transportation bottlenecks
- Busy seasons [TSOS-001]
- Technology needs
- Leadership gaps

**[CCS-M10a]** Forecasts remain **advisory** [CIS-001, OPIS-001] — never mandatory reallocation.

**[CCS-M10b]** Community Coach may surface forecast signals [CIS-M01].

---

## CCS-M11 — Capacity History

**[CCS-M11]** The platform preserves:

- Equipment usage
- Volunteer utilization
- Facility history
- Partnership activity
- Resource sharing events
- Community capacity growth

**[CCS-M11a]** Historical data **improves future planning** [ACN-M04 Civic Operating Loop, CKLS-001 lessons learned].

**[CCS-M11b]** Contributes to **Mission Operating Records** [ACN-M26] and **Community Legacy** [CLS-001].

---

## CCS-M12 — Future AI Assistance

**[CCS-M12]** Future AI may **help organizers see possibilities they may overlook**:

| Capability | Role |
|------------|------|
| Recommend available resources | Matching [CCS-M07] |
| Predict shortages | Forecasting [CCS-M10] |
| Suggest partnerships | Partnership category |
| Optimize equipment usage | Conflict reduction |
| Identify underused capacity | Ecosystem health |
| Recommend neighboring communities | SCN-001 map |

**[CCS-M12a]** **Advisory only** — preserves local decision-making [ACN-M06, CCN-M01].

---

## CCS-M13 — Time & Budget Capacity

**[CCS-M13]** **Time** is capacity — availability windows, volunteer hours, event slots [TSOS-001].

**[CCS-M13a]** **Budget** (future) — where applicable, financial capacity tracked without becoming the platform's center of gravity [DG-001 boundaries].

**[CCS-M13b]** Time conflicts surface in capacity planning [CCS-M08] alongside facility and equipment conflicts.

---

## CCS-M14 — CCE Relationship

**[CCS-M14]** **Community Capability Exchange [CCE-001]** catalogs *what communities can do* — skills, expertise, willingness.

**[CCS-M14a]** **Capacity Coordination [CCS-001]** operationalizes *what communities have available right now* — equipment, rooms, rides, schedules.

**[CCS-M14b]** Together: CCE = capability graph · CCS = logistics engine · **Arkansas Capacity Map** = unified operational view [CCS-M16].

**[CCS-M14c]** Neither duplicates the other — CCS links to CCE skills when matching people/skills needs [CCS-M07].

---

## CCS-M15 — Logistics Engine Role

**[CCS-M15]** CCS sits at the center of mission logistics:

```text
Mission Design (needs identified)
        ↓
Capacity Planning (CCS-M08)
        ↓
Capacity Requests + Matching (CCS-M06, CCS-M07)
        ↓
Execution (EOS-001)
        ↓
Capacity History (CCS-M11)
```

**[CCS-M15a]** Transforms logistics from **phone calls and spreadsheets** into a **shared statewide picture** [CCS-M16].

---

## CCS-M16 — Arkansas Capacity Map

**[CCS-M16]** **Signature feature.** A live map of Arkansas showing the **collective capacity of the statewide network** — not just counties and campuses [SCN-001 extends].

**[CCS-M16a]** Map reveals:

- Communities with trained event volunteers
- Campuses with available meeting space
- Counties with photography equipment
- Experienced mentors willing to travel
- Partner organizations offering training
- Communities that can host regional events

**[CCS-M16b]** Filter by:

Skills · Equipment · Facilities · Volunteers · Partnerships · Transportation · Technology · **Geographic radius**

**[CCS-M16c]** Immediately answers:

- *"Who can help us this weekend?"*
- *"Where is the nearest projector?"*
- *"Which campus has organizers experienced in Welcome Week?"*
- *"Which county has hosted a similar initiative before?"*

**[CCS-M16d]** Route: `/map/capacity` · Orchestrator: `getCapacityMap(filters?)` · integrates **Arkansas Collaboration Map** [SCN-M04].

**[CCS-M16e]** Combined with Community Brain [CKLS-001], Capability Exchange [CCE-001], Opportunity Exchange [OEX-001], and Collaboration Network [SCN-001] — the **operational logistics layer** for statewide accomplishment.

---

## CCS-M17 — Logistics Layer Stack

**[CCS-M17]** CCS completes the logistics intelligence stack:

| Layer | System | Role |
|-------|--------|------|
| Knowledge | Community Brain [CKLS-001] | What we know |
| Capabilities | Capability Exchange [CCE-001] | What we can do |
| Needs | Opportunity Exchange [OEX-001] | What we need |
| Network | Collaboration Network [SCN-001] | Who we connect with |
| **Operations** | **Arkansas Capacity Map [CCS-M16]** | **What we have available now** |

**[CCS-M17a]** Initiative Command Center [IOS-M16] pulls capacity widgets from this stack.

---

## CCS-M18 — Platform Integrations

**[CCS-M18]** CCS integrates:

| System | Integration |
|--------|-------------|
| CCE-001 | Skills and capability matching |
| OEX-001 | Needs publishing and discovery |
| SCN-001 | Geographic and collaboration context |
| CKLS-001 | Knowledge as capacity |
| MDS-001 | Mission Canvas resources [MDS-M11] |
| EOS-001 | Execution resource status |
| VDS-001 | People/volunteer capacity |
| EEOS-001 | Event resource requirements |
| IOS-001 | Initiative shared resources |
| CFS-001 | Support request fulfillment |
| CDS-001 | Resource allocation decisions |
| TSOS-001 | Availability and scheduling |
| CIS-001 | Shortage forecasting signals |
| CLS-001 | Historical capacity patterns |
| TWG-001 | Team equipment assignments |

---

## CCS-M19 — V1 Scope

**[CCS-M19]** Step 5.9 deliverables:

| Capability | V1 |
|------------|-----|
| Capacity Coordination philosophy | ✅ Documented |
| Capacity categories | ✅ Spec |
| Capacity Profiles schema | ✅ Spec |
| Requests + matching model | ✅ Spec |
| Planning + sharing principles | ✅ Spec |
| Forecasting + history | ✅ Spec |
| Arkansas Capacity Map architecture | ✅ Spec |
| Logistics layer stack | ✅ Spec |
| Capacity UI implementation | Stub |
| Live map aggregation | v1.1 |
| AI matching | Future [CCS-M12] |

---

## CCS-BG — Burt Implementation Guidance

**[CCS-BG]** Implementation should:

1. **Treat capacity as structured platform entities** [CCS-M01c]
2. **Separate capacity from individual missions** — many-to-many [CCS-M05]
3. **Support many-to-many relationships** — one projector, many missions over time
4. **Maintain availability history** [CCS-M11]
5. **Integrate with Opportunity Exchange and Community Intelligence** [OEX-001, CIS-001]
6. **Design for future logistics automation** — reservations, conflict detection
7. **Extend existing `/map` route** toward capacity layers [CCS-M16]
8. **Do not duplicate CCE** — link skills via CCE, coordinate assets via CCS [CCS-M14]

**[CCS-BG-a]** Recommended structure:

```
src/lib/capacity/createCapacityProfile.ts
src/lib/capacity/publishCapacityRequest.ts
src/lib/capacity/matchCapacity.ts
src/lib/capacity/planMissionCapacity.ts
src/lib/capacity/getCapacityMap.ts
src/components/capacity/ArkansasCapacityMap.tsx
src/components/capacity/CapacityProfile.tsx
src/components/capacity/CapacityRequestBoard.tsx
data/registry/capacity-coordination-system.json
```

**[CCS-BG-b]** Database: `DB-CCS` · tables: `capacity_profiles`, `capacity_requests`, `capacity_matches`, `capacity_availability_history`.

---

## AC-056 — Acceptance Criteria

Step 5.9 is complete when:

- [x] **[AC-056a]** Capacity Coordination philosophy documented. `[CCS-M01, CCS-M02, CCS-M03]`
- [x] **[AC-056b]** Capacity categories established. `[CCS-M04]`
- [x] **[AC-056c]** Matching and forecasting incorporated. `[CCS-M07, CCS-M10]`
- [x] **[AC-056d]** Sharing and planning principles defined. `[CCS-M08, CCS-M09]`
- [x] **[AC-056e]** Arkansas Capacity Map architecture specified. `[CCS-M16, CCS-M17]`
- [x] **[AC-056f]** Burt has blueprint for statewide capacity coordination. `[CCS-BG, capacity-coordination-system.json]`

---

**Next Step:** 5.10 — Community Impact Intelligence System *(complete — see COMMUNITY_IMPACT_INTELLIGENCE_SYSTEM.md)*

*Trace: Mission needs identified → capacity visible on map → requests published → matches found → resources shared → mission executes → history captured → next mission plans smarter*
