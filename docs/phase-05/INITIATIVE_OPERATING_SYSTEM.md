# Initiative Operating System

**Document ID:** PHASE-005.6  
**Artifact:** `INITIATIVE_OPERATING_SYSTEM.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 5 — Action Operating System  
**Acronym:** IOS

> **Large goals are achieved through many communities working together.**

**Campaign** is only one type of coordinated effort. The architecture must be broader. An **initiative** is any coordinated effort involving multiple people, communities, teams, projects, or missions — food drives, leadership programs, welcome weeks, service projects, civic education, and future election-related activities where appropriate [DG-001 boundaries].

**Requirement:** IOS-001 · **Supersedes:** CIN-001 (Campaign & Initiative System) · **Governed by:** [Action Constitution ACN-001](ACTION_CONSTITUTION.md)

**Builds On:** [Statewide Collaboration Network SCN-001](../phase-04/STATEWIDE_COLLABORATION_NETWORK.md) · [Mission Design System MDS-001](MISSION_DESIGN_SYSTEM.md) · [Experience & Event OS EEOS-001](EXPERIENCE_EVENT_OPERATING_SYSTEM.md) · [Community Command Center CCC-001](../phase-04/COMMUNITY_COMMAND_CENTER.md) · [Community Intelligence CIS-001](../phase-04/COMMUNITY_INTELLIGENCE_SYSTEM.md)

**Live spec:** `data/registry/initiative-operating-system.json`

**Required reading for Burt.**

**Core principle:** *Coordinate statewide. Empower locally.*

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| IOS-M01 | Purpose |
| IOS-M02 | Guiding principle |
| IOS-M03 | Initiative philosophy |
| IOS-M04 | Initiative examples |
| IOS-M05 | Initiative hierarchy |
| IOS-M06 | Initiative Headquarters |
| IOS-M07 | Participating communities |
| IOS-M08 | Initiative timeline |
| IOS-M09 | Mission coordination |
| IOS-M10 | Shared resources |
| IOS-M11 | Communication hub |
| IOS-M12 | Initiative dashboard |
| IOS-M13 | Community independence |
| IOS-M14 | Initiative legacy |
| IOS-M15 | Future AI assistance |
| IOS-M16 | Initiative Command Center |
| IOS-M17 | Command center stack |
| IOS-M18 | Platform integrations |
| IOS-M19 | V1 scope |
| IOS-BG | Burt implementation guidance |
| AC-053 | Step 5.6 acceptance criteria |

---

## IOS-M01 — Purpose

**[IOS-M01]** The **Initiative Operating System (IOS)** coordinates **large, multi-community efforts** that span multiple missions, projects, teams, campuses, counties, or regions.

**[IOS-M01a]** While missions and projects focus on **specific objectives**, initiatives provide **strategic coordination** across many related activities [MDS-M04, EOS-M04].

**[IOS-M01b]** IOS enables Arkansas communities to work together toward **shared goals while preserving local autonomy** [SCN-M01, CCN-M01 equal standing].

**[IOS-M01c]** Initiatives are **first-class entities** — not tags on missions or marketing "campaigns" [IOS-BG].

---

## IOS-M02 — Guiding Principle

**[IOS-M02]**

> **Large goals are achieved through many communities working together.**

**[IOS-M02a]** The platform should make **statewide and regional coordination as natural as local organizing** [SCN-001, OEX-001].

**[IOS-M02b]** Complementary motto: **Coordinate statewide. Empower locally.** [IOS-M16]

---

## IOS-M03 — Initiative Philosophy

**[IOS-M03]** An initiative is a **collection of coordinated missions**.

**[IOS-M03a]** Each participating community contributes in ways that match its **interests, strengths, and capacity** [CCE-001, OEX-001].

**[IOS-M03b]** IOS **connects those efforts into one larger movement** without centralizing control [IOS-M13 community independence].

**[IOS-M03c]** The word **campaign** describes one initiative *type* — not the architectural concept [IOS-M04].

---

## IOS-M04 — Initiative Examples

**[IOS-M04]** Flexible architecture — examples:

| Initiative | Scope |
|------------|-------|
| Statewide Community Service Week | Arkansas-wide |
| Campus Welcome Month | Multi-campus |
| Leadership Development Series | Regional |
| Arkansas Volunteer Day | Statewide |
| Regional Food Drive | Multi-county |
| Environmental Stewardship Initiative | Thematic |
| Student Civic Education Initiative | Education |
| Disaster Relief Coordination | Emergency |
| Community Health Awareness | Public education |
| Neighborhood Revitalization | Place-based |
| Future civic engagement initiatives | Configurable |

**[IOS-M04a]** Includes service, leadership, welcome, cleanup, research, public education, civic engagement — **not partisan architecture** [DG-001, Phase 1 boundaries].

**[IOS-M04b]** Reusable **initiative templates** [IOS-BG] — parallel Mission Library [MDS-M20] and Experience Playbook [EEOS-M17].

---

## IOS-M05 — Initiative Hierarchy

**[IOS-M05]** Strategic-to-operational hierarchy:

```text
Initiative
        ↓
Mission
        ↓
Project
        ↓
Milestone
        ↓
Task
```

**[IOS-M05a]** Keeps **strategic goals connected to operational work** [ACN-M08 action hierarchy extended upward].

**[IOS-M05b]** Initiative sits above mission — multiple missions per initiative [IOS-M09]; each mission retains MDS/EOS execution stack.

**[IOS-M05c]** Graph edges: `initiativeId` on mission records [REL-001, MPS-001].

---

## IOS-M06 — Initiative Headquarters

**[IOS-M06]** Every initiative receives its own **headquarters** — statewide coordination center.

**[IOS-M06a]** Includes:

| Section | Purpose |
|---------|---------|
| Purpose | Why this initiative exists |
| Vision | Long-term aspiration |
| Goals | Measurable statewide objectives |
| Participating communities | [IOS-M07] |
| Timeline | [IOS-M08] |
| Calendar | TSOS-001 |
| Mission map | Linked missions [IOS-M09] |
| Progress | Aggregate across communities |
| Resources | [IOS-M10] |
| Knowledge | CKLS-001 |
| Recognition | CRA-001 |
| Community stories | CLS-001 |
| Impact | CIIS-001 |

**[IOS-M06b]** Route: `/initiative/[slug]` — shell parallel to Community HQ [CCC-001] and Mission HQ [MPS-M06].

**[IOS-M06c]** Feeds **Initiative Command Center** [IOS-M16] — executive view layer.

---

## IOS-M07 — Participating Communities

**[IOS-M07]** Communities join initiatives **voluntarily** [SCN-M03 local autonomy preserved].

**[IOS-M07a]** Participant types:

- Universities
- Community colleges
- Trade schools
- County communities
- Regional partnerships
- Future high schools [Phase 9]

**[IOS-M07b]** Each community determines its **own local contribution** — missions, events, resources [IOS-M13].

**[IOS-M07c]** Orchestrator: `joinInitiative(initiativeId, communityId, contributionPlan)` · `leaveInitiative(initiativeId, communityId)`.

---

## IOS-M08 — Initiative Timeline

**[IOS-M08]** Displays the **larger journey** for every participant [TSOS-001 master timeline extension]:

Launch · Planning · Mission milestones · Regional events · Major deadlines · Celebrations · Reflection · Legacy

**[IOS-M08a]** Timeline aggregates community-local milestones without erasing local schedules [TSOS-M relationship-aware views].

**[IOS-M08b]** Surfaces on Initiative HQ and Command Center [IOS-M16].

---

## IOS-M09 — Mission Coordination

**[IOS-M09]** Initiatives coordinate **multiple missions simultaneously**.

**[IOS-M09a]** Example:

```text
Statewide Service Week (Initiative)
        ↓
UCA Campus Cleanup (Mission)
Pulaski County Food Drive (Mission)
Benton County Volunteer Fair (Mission)
Regional Leadership Summit (Mission / Experience)
```

**[IOS-M09b]** **Independent missions contribute to one shared initiative** — missions may pre-exist or spawn from initiative template [MDS-M16 fork from library].

**[IOS-M09c]** Mission map visualization on Initiative HQ [IOS-M06] and Command Center map [IOS-M16].

---

## IOS-M10 — Shared Resources

**[IOS-M10]** Participating communities share:

Playbooks · Graphics · Training · Volunteers [VDS-001 cross-community] · Equipment [CCS-001] · Knowledge [CKLS-001] · Templates [MDS-M20, EEOS-M17] · Communications [CCNET-001]

**[IOS-M10a]** **Resource sharing reduces duplicated effort** [CCE-001 Capability Graph at initiative scope].

**[IOS-M10b]** Shared resources **opt-in** — communities retain ownership [CCN-M01].

---

## IOS-M11 — Communication Hub

**[IOS-M11]** Every initiative includes organized communication:

Announcements · Discussions · Updates · Community highlights · Volunteer coordination · Recognition · Media

**[IOS-M11a]** Extends Community Communication Network [CCNET-001] — initiative-scoped conversation graph, not separate messaging product [MSG-001 transport only].

**[IOS-M11b]** CAM-001 attention budget applies — initiative announcements earn attention, never abuse.

---

## IOS-M12 — Initiative Dashboard

**[IOS-M12]** Dashboard provides **statewide situational awareness**:

- Participating communities
- Active missions
- Volunteer participation [VDS-001 aggregate]
- Upcoming events [EEOS-001]
- Current needs [OEX-001]
- Community highlights
- Impact stories [CLS-001]

**[IOS-M12a]** **Non-ranking** — health and progress, not competition [CIS-M03, COS-M09 Network Health parallel].

**[IOS-M12b]** Subset view within Initiative Command Center [IOS-M16].

---

## IOS-M13 — Community Independence

**[IOS-M13]** Each participating community retains control over:

Local leadership · Local events · Local missions · Local priorities · Local culture

**[IOS-M13a]** Participation is **collaborative rather than centralized** [SCN-001, CCN-M02 constitutional equal standing].

**[IOS-M13b]** Initiative coordinators **suggest and connect** — never override community decisions [CDS-001 local authority].

---

## IOS-M14 — Initiative Legacy

**[IOS-M14]** Every initiative contributes:

- Mission Operating Records [ACN-M26]
- Experience Playbooks [EEOS-M17]
- Community Brain [CKLS-001]
- Community Legacy [CLS-001]
- Statewide Living History [CLS-M10 Arkansas Living History]

**[IOS-M14a]** **Knowledge compounds across initiatives** [ACN-M04 Civic Operating Loop at statewide scale].

**[IOS-M14b]** Orchestrator: `archiveInitiative(initiativeId)` — publishes to legacy and playbook libraries.

---

## IOS-M15 — Future AI Assistance

**[IOS-M15]** Future AI may:

- Recommend participating communities [SCN-001]
- Suggest reusable missions [MDS-M20]
- Identify missing capacity [CCS-001, CCE-001]
- Coordinate timelines [TSOS-001]
- Highlight successful models [CKLS-001]
- Recommend cross-community partnerships [NET-001, SCN-001]

**[IOS-M15a]** AI **supports coordination while preserving local decision-making** [OPIS-001 advisory, ACN-M19].

---

## IOS-M16 — Initiative Command Center

**[IOS-M16]** **Initiative Command Center (ICC)** — signature feature of the Initiative Operating System.

**[IOS-M16a]** Executive view for statewide initiatives involving dozens of campuses and counties — **not spreadsheets**.

**[IOS-M16b]** One screen shows:

| Widget | Source |
|--------|--------|
| Map of participating communities | SCN-001 Collaboration Map |
| Missions currently underway | IOS-M09, MPS-001 |
| Volunteer momentum | VDS-001 |
| Upcoming milestones | TSOS-001, IOS-M08 |
| Capacity requests | CCS-001, OEX-001 |
| Community stories | CLS-001 |
| New participants joining | NET-001, registration feeds |
| Communities needing support | OEX-001, CIS-001 |
| Experience Playbooks being reused | EEOS-M17 |
| Real-time Community Pulse summaries | CCC-M Community Pulse |

**[IOS-M16c]** Organizers understand **health and progress of the entire initiative** — drill down to any mission, community, or team.

**[IOS-M16d]** Orchestrator: `getInitiativeCommandCenter(initiativeId)` — aggregates, never duplicates module data.

**[IOS-M16e]** Route: `/initiative/[slug]/command` — mobile-responsive for field coordinators.

**[IOS-M16f]** Database: cached snapshots in `initiative_command_center_views` · source of truth remains module registries.

---

## IOS-M17 — Command Center Stack

**[IOS-M17]** Initiative Command Center completes the **operational command stack**:

| Layer | Scope | Requirement |
|-------|-------|-------------|
| Personal Command Center | Individual | PCC-001 |
| Community Command Center | Community | CCC-001 |
| Mission Headquarters | Mission | MPS-M06, EOS-M05 |
| Experience Headquarters | Gathering | EEOS-M06 |
| **Initiative Command Center** | Statewide/regional | IOS-M16 |

**[IOS-M17a]** Same design language, increasing scope — modular widgets, six-question visit pattern parallel [CCC-M06, PCC-M].

**[IOS-M17b]** **Coordinate statewide. Empower locally.** — architectural principle embodied in ICC drill-down to local CCC/Mission HQ without central override [IOS-M13].

---

## IOS-M18 — Platform Integrations

**[IOS-M18]** IOS integrates:

| System | Integration |
|--------|-------------|
| SCN-001 | Collaboration network, map |
| MDS-001 / MDS-M20 | Mission templates under initiative |
| EEOS-001 / EEOS-M17 | Regional events, playbooks |
| EOS-001 | Cross-mission execution |
| VDS-001 | Volunteer momentum |
| TSOS-001 | Initiative timeline |
| OEX-001 | Needs across communities |
| CCE-001 | Shared capabilities |
| CKLS-001 | Initiative knowledge |
| CIS-001 | Initiative health (non-ranking) |
| CLS-001 | Statewide living history |
| CCNET-001 | Communication hub |
| ACN-M26 MOR | Per-mission records aggregate |

---

## IOS-M19 — V1 Scope

**[IOS-M19]** Step 5.6 deliverables:

| Capability | V1 |
|------------|-----|
| Initiative OS philosophy | ✅ Documented |
| Initiative hierarchy | ✅ Spec |
| Initiative HQ + participation | ✅ Spec |
| Mission coordination model | ✅ Spec |
| Shared resources + legacy | ✅ Spec |
| Initiative Command Center architecture | ✅ Spec |
| Command center stack | ✅ Spec |
| Initiative UI implementation | Stub |
| Live ICC aggregation | v1.1 |
| AI coordination | Future [IOS-M15] |

---

## IOS-BG — Burt Implementation Guidance

**[IOS-BG]** Implementation should:

1. **Treat initiatives as first-class entities** — not campaign tags [IOS-M01]
2. **Allow initiatives to contain multiple missions** — graph edges [IOS-M05, IOS-M09]
3. **Separate strategic coordination from operational execution** — IOS vs MDS/EOS [ACN-M01]
4. **Support reusable initiative templates** [IOS-M04]
5. **Preserve initiative history** — append-only archive [IOS-M14]
6. **Scale naturally local → statewide** [IOS-M07, SCN-001]
7. **Implement Initiative Command Center as aggregator** [IOS-M16] — widget composition from existing modules
8. **Never centralize local decisions** [IOS-M13, CCN-001]

**[IOS-BG-a]** Recommended structure:

```
src/lib/initiatives/createInitiative.ts
src/lib/initiatives/joinInitiative.ts
src/lib/initiatives/linkMissionToInitiative.ts
src/lib/initiatives/getInitiativeCommandCenter.ts
src/lib/initiatives/archiveInitiative.ts
src/components/initiative/InitiativeHeadquarters.tsx
src/components/initiative/InitiativeCommandCenter.tsx
src/components/initiative/MissionMapWidget.tsx
data/registry/initiative-operating-system.json
```

**[IOS-BG-b]** Database: `DB-IOS` · tables: `initiatives`, `initiative_participants`, `initiative_mission_links`.

---

## AC-053 — Acceptance Criteria

Step 5.6 is complete when:

- [x] **[AC-053a]** Initiative Operating System philosophy documented. `[IOS-M01, IOS-M02, IOS-M03]`
- [x] **[AC-053b]** Initiative hierarchy established. `[IOS-M05]`
- [x] **[AC-053c]** Community participation and coordination defined. `[IOS-M07, IOS-M09, IOS-M13]`
- [x] **[AC-053d]** Shared resources and legacy incorporated. `[IOS-M10, IOS-M14]`
- [x] **[AC-053e]** Initiative Command Center architecture specified. `[IOS-M16, IOS-M17]`
- [x] **[AC-053f]** Burt has blueprint for large-scale collaborative efforts. `[IOS-BG, initiative-operating-system.json]`

---

**Next Step:** 5.7 — Collaborative Decision System *(complete — see COLLABORATIVE_DECISION_SYSTEM.md)*

*Trace: Shared statewide goal → communities join voluntarily → local missions contribute → Command Center shows whole movement → resources shared → legacy compounds → next initiative starts stronger*
