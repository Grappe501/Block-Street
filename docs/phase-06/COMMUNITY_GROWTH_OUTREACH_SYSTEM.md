# Community Growth & Outreach System

**Document ID:** PHASE-006.3  
**Artifact:** `COMMUNITY_GROWTH_OUTREACH_SYSTEM.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 6 — Growth Operating System  
**Acronym:** CGO

> **Growth doesn't happen by accident.**

We built the **Personal Organizing Network** [PON-001 6.2]. Step 6.3 scales from **individual to institution** — every campus and county gets a **living growth strategy**: not just numbers, but a plan, a pipeline, and a picture of where the community is today and where it wants to go.

**Requirement:** CGO-001 · **Planned alias superseded:** CGX-001 · **Extends:** [Community Growth & Sustainability CGS-001](../phase-04/COMMUNITY_GROWTH_SUSTAINABILITY.md) · **Phase umbrella:** GOS-001 · **Governed by:** [Growth Constitution GCN-001](GROWTH_CONSTITUTION.md)

**Builds On:** CGS-001 · [Community Command Center CCC-001](../phase-04/COMMUNITY_COMMAND_CENTER.md) · [Community Intelligence CIS-001](../phase-04/COMMUNITY_INTELLIGENCE_SYSTEM.md) · [Opportunity Exchange OEX-001](../phase-04/OPPORTUNITY_EXCHANGE.md) · [Statewide Collaboration SCN-001](../phase-04/STATEWIDE_COLLABORATION_NETWORK.md)

**Live spec:** `data/registry/community-growth-outreach-system.json`

**Required reading for Burt.**

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| CGO-M01 | Purpose |
| CGO-M02 | Guiding principle |
| CGO-M03 | Philosophy |
| CGO-M04 | Community Growth Dashboard |
| CGO-M05 | Representation Map |
| CGO-M06 | Outreach Zones |
| CGO-M07 | Growth Goals |
| CGO-M08 | Growth Campaigns |
| CGO-M09 | Outreach Activities |
| CGO-M10 | Community Readiness |
| CGO-M11 | Growth Timeline |
| CGO-M12 | Growth Heat Map |
| CGO-M13 | Growth Resources |
| CGO-M14 | Community Stories |
| CGO-M15 | Future AI assistance |
| CGO-M16 | Arkansas Coverage Map |
| CGO-M17 | Relationship to CGS-001 |
| CGO-M18 | V1 scope |
| CGO-BG | Burt implementation guidance |
| AC-064 | Step 6.3 acceptance criteria |

---

## CGO-M01 — Purpose

**[CGO-M01]** The **Community Growth & Outreach System (CGO)** helps every campus, county, and future community **intentionally expand participation, strengthen relationships, develop leaders, and ensure every part of Arkansas has an opportunity to be represented**.

**[CGO-M01a]** The objective is **sustainable community development** rather than rapid recruitment [GCN-M05b Community Before Scale].

**[CGO-M01b]** Communities **intentionally welcome people, develop leaders, and expand participation** — growth is operational, not accidental [GCN-M03].

**[CGO-M01c]** CGO is the **institutional counterpart** to [Personal Organizing Network PON-001] — individual invites become **community strategy**.

---

## CGO-M02 — Guiding Principle

**[CGO-M02]**

> **Every community deserves the opportunity to grow through relationships, service, and local leadership.**

**[CGO-M02a]** Growth should reflect the **character and needs of each community** [CCN-M004 equal standing, local autonomy].

**[CGO-M02b]** Complementary to [CGS-M02] — healthy communities develop new people; CGO provides **outreach tools to do it intentionally**.

---

## CGO-M03 — Philosophy

**[CGO-M03]** Growth **begins locally** [GCN-M05c Local Leadership, OM-L1 campus/county first].

**[CGO-M03a]** Every community should understand:

| Question | Tool |
|----------|------|
| Who is already participating? | Growth Dashboard [CGO-M04] |
| Who is missing? | Representation Map [CGO-M05] |
| Where should we reach next? | Outreach Zones [CGO-M06] · Heat Map [CGO-M12] |
| Who can help welcome new people? | Leadership Development [CLD-001 6.4] |
| How are new participants becoming active? | Belonging Index [GCN-M16] |

**[CGO-M03b]** Growth is measured by **healthy participation** [GCN-M07] — not registration counts alone.

---

## CGO-M04 — Community Growth Dashboard

**[CGO-M04]** Every community receives a **Growth Dashboard** — widget in [Community Command Center CCC-001] · route: `/community/[slug]/growth`.

**[CGO-M04a]** Displays **actionable information**:

- Total participants · new participants · returning participants
- Volunteer participation · leadership pipeline · mentorship activity
- Open opportunities · community needs [OEX-001]
- Recent growth · **growth goals** [CGO-M07]

**[CGO-M04b]** Emphasizes **plan and pipeline** — where we are · where we're going · what's next.

**[CGO-M04c]** Complements [Community Pulse CCC-M14] and [Community Health CIS-001] — growth lens, not duplicate health score.

**[CGO-M04d]** Orchestrator: `getCommunityGrowthDashboard(communityId, period?)`.

---

## CGO-M05 — Representation Map

**[CGO-M05]** Every campus and county understands its own **representation** — who is in the room, who is not.

**[CGO-M05a]** Examples:

- Residence halls represented · student organizations participating
- Academic departments represented · communities across the county
- Neighborhoods reached · future high schools connected [CEF-001 6.9]

**[CGO-M05b]** Representation helps identify **opportunities for outreach** — not shame for gaps [GCN-M08 ethics, visibility not judgment].

**[CGO-M05c]** Layer on [Arkansas Coverage Map CGO-M16] for statewide view.

---

## CGO-M06 — Outreach Zones

**[CGO-M06]** Communities may organize outreach by **configurable zones** — structured without rigid:

| Community type | Zone examples |
|----------------|---------------|
| Campus | Residence halls · academic colleges · student organizations |
| County | City neighborhoods · county communities · future school districts |

**[CGO-M06a]** Zones link to [Outreach Activities CGO-M09] and [Growth Campaigns CGO-M08].

**[CGO-M06b]** `outreachZones` configurable per community type [CGO-BG] — supports expansion beyond colleges.

---

## CGO-M07 — Growth Goals

**[CGO-M07]** Communities define **locally determined** goals:

- Welcome new participants · launch a new team · increase volunteer participation
- Expand mentorship · reach underrepresented residence hall · strengthen county representation

**[CGO-M07a]** Goals tracked in Growth Dashboard [CGO-M04] — progress visible, never platform-imposed quotas [GCN-M05b].

**[CGO-M07b]** Integrates [Commitment & Follow-Through CFS-001] for organizer accountability to **their own** goals.

---

## CGO-M08 — Growth Campaigns

**[CGO-M08]** Communities may organize **short-term outreach efforts**:

- Welcome Week · Volunteer Month · Leadership Recruitment · Mentor Drive
- Community Service Week · Student Organization Fair

**[CGO-M08a]** Emphasis remains on **relationship-building rather than marketing** [RGE-M01, GCN-M04].

**[CGO-M08b]** Campaigns link to [Experience & Event OS EEOS-001] for event execution · [Growth Timeline CGO-M11] for history.

---

## CGO-M09 — Outreach Activities

**[CGO-M09]** The platform supports many styles of outreach:

- Information tables · campus presentations · community meetings
- Service projects · coffee conversations · welcome events · peer-to-peer invitations [PON-001]

**[CGO-M09a]** Activity types logged for **Growth Timeline** and **Representation Map** updates.

**[CGO-M09b]** Detailed invitation mechanics in [Invitation & Connection System ICS-001 6.7]; CGO owns **community-level outreach planning**.

---

## CGO-M10 — Community Readiness

**[CGO-M10]** Before pursuing growth, communities review [GCN-M10 Community Readiness]:

- Active mentors · volunteer opportunities · upcoming events
- Welcome resources · Community Brain updates [CKLS-001] · orientation materials [WBS-001 6.5]

**[CGO-M10a]** **Healthy growth requires preparation** — dashboard may surface readiness checklist before campaign launch.

**[CGO-M10b]** Orchestrator: `assessCommunityGrowthReadiness(communityId)` — extends GCN-BG.

---

## CGO-M11 — Growth Timeline

**[CGO-M11]** Every community develops a **growth timeline** — part of community history [CLS-001]:

- Community founded · first organizer · growth milestones
- Major outreach efforts · leadership transitions · annual achievements

**[CGO-M11a]** Parallel to [Community Legacy CLS-001] and [Civic Journey Timeline CJT-001] — growth-specific narrative.

**[CGO-M11b]** Append-only · feeds Community Brain and Story Atlas [CST-001].

---

## CGO-M12 — Growth Heat Map

**[CGO-M12]** Communities visualize **areas of opportunity** — visibility, not judgment [CIS-M12 explainability]:

- Campus buildings with low participation · counties with few volunteers
- Communities needing mentors · residence halls without ambassadors
- Regions lacking partnerships [IPS-001 6.10]

**[CGO-M12a]** Community-scoped heat map; **Arkansas Coverage Map** [CGO-M16] provides statewide layer.

**[CGO-M12b]** Does **not** rank communities against each other [COS-M09 Network Health parallel].

---

## CGO-M13 — Growth Resources

**[CGO-M13]** Communities receive shared **growth resources** [CCE-001, CKLS-001]:

- Outreach playbooks · presentation templates · printable QR posters [NET-002]
- Welcome materials · training guides · event kits

**[CGO-M13a]** Communities should **not invent outreach from scratch** — fork and adapt from statewide library [MDS-M20 Mission Library pattern].

**[CGO-M13b]** Playbooks versioned · contributed back via [Learning & Improvement LIS-001].

---

## CGO-M14 — Community Stories

**[CGO-M14]** Growth always includes **stories** [CST-001]:

- New participant journeys · successful outreach events · mentor experiences
- Community traditions · volunteer reflections

**[CGO-M14a]** Stories **reinforce culture** — linked from Growth Dashboard and Timeline.

---

## CGO-M15 — Future AI Assistance

**[CGO-M15]** Future AI may **support thoughtful outreach** [GCN-M13, ACN-M06 advisory]:

- Identify underserved groups · recommend outreach opportunities
- Suggest mentor assignments · highlight successful growth strategies
- Recommend partnerships · surface reusable outreach playbooks

**[CGO-M15a]** AI **never replaces personal relationships** [PON-M17, RGE-M13].

---

## CGO-M16 — Arkansas Coverage Map

**[CGO-M16]** The **Arkansas Coverage Map (ACM)** is the **signature strategic tool** of CGO — statewide expansion map supporting the original goal: **every Arkansas county has a place, every college has a place**.

**[CGO-M16a]** Statewide map where every county and educational institution is visible [Phase 2 Registry CNTY-001, INST-001].

**[CGO-M16b]** For each community, organizers immediately see:

| Signal | Source |
|--------|--------|
| Community launched? | STS-001 · COS-001 |
| Participant count | CCC-001 |
| Active mentors | PGL-001 · CLD-001 |
| Active teams | TWG-001 |
| Active missions | MPS-001 · EOS-001 |
| Volunteer opportunities | OEX-001 · VDS-001 |
| Community Health | CIS-001 |
| Growth trends | CGO-M04 |
| Partnership status | IPS-001 |

**[CGO-M16c]** Geographic coverage layers:

- Counties with no organizers yet · colleges needing leadership outreach
- Trade schools not yet joined · underrepresented residence halls or student orgs
- Communities ready to mentor neighbors [SCN-001]

**[CGO-M16d]** **Shared picture** of where the network is strong, where opportunities remain, how local efforts build statewide community [SCN-M14 Collaboration Map extends].

**[CGO-M16e]** Route: `/map/coverage` · orchestrator: `getArkansasCoverageMap(filters?, layers?)`.

**[CGO-M16f]** Complements [Arkansas Network Health Dashboard COS-M09] · [Movement Readiness Dashboard AOS-M09] · [Arkansas Capacity Map CCS-M16] — **coverage and growth lens**.

**[CGO-M16g]** **Visibility — not judgment** [GCN-M08, CGO-M12]. Supports [Community Expansion Framework CEF-001 6.9] launch decisions.

---

## CGO-M17 — Relationship to CGS-001

**[CGO-M17a]** **CGS-001** (Phase 4.2) established communities as **living organisms** — lifecycle, Health Check, renewal, sustainability.

**[CGO-M17b]** **CGO-001** (Phase 6.3) operationalizes **intentional growth and outreach** on that foundation — dashboard, zones, campaigns, coverage map.

**[CGO-M17c]** CGS answers *"Is this community healthy?"* · CGO answers *"How is this community growing and where should it reach next?"*

**[CGO-M17d]** Belonging Index [GCN-M16] measures *"Are people finding belonging?"* · CGO measures *"Are we reaching who we intend to reach?"*

---

## CGO-M18 — V1 Scope

| Deliverable | Status |
|-------------|--------|
| CGO philosophy documented | ✅ |
| Community Growth Dashboard spec | ✅ |
| Representation Map + Outreach Zones | ✅ |
| Growth Goals + Campaigns + Activities | ✅ |
| Community Readiness + Timeline | ✅ |
| Growth Heat Map architecture | ✅ |
| Growth Resources + Stories integration | ✅ |
| Arkansas Coverage Map architecture | ✅ |
| Live dashboard aggregation | v1.1 |
| Full coverage map layers | v1.1 |

---

## CGO-BG — Burt Implementation Guidance

**[CGO-BG-a]** Implementation should:

- Treat community growth as **ongoing operational capability** — not one-time launch
- **Separate outreach activities** from participant management [PON-001 / USR-001]
- Support **configurable outreach zones** per community type
- Integrate [Opportunity Exchange OEX-001] and [Community Intelligence CIS-001]
- Maintain **historical growth data** for timeline and trends
- Design for **expansion beyond colleges** [CCN-M004, CEF-001]

**[CGO-BG-b]** Files:

```
src/lib/cgo/getCommunityGrowthDashboard.ts
src/lib/cgo/getRepresentationMap.ts
src/lib/cgo/getGrowthHeatMap.ts
src/lib/cgo/getArkansasCoverageMap.ts
src/components/community/CommunityGrowthDashboard.tsx
src/components/map/ArkansasCoverageMap.tsx
data/registry/community-growth-outreach-system.json
```

**[CGO-BG-c]** Database: `DB-CGO` · tables: `growth_goals`, `growth_campaigns`, `outreach_zones`, `outreach_activities`, `representation_snapshots`, `coverage_map_cache`.

---

## AC-064 — Acceptance Criteria

Step 6.3 is complete when:

- [x] **[AC-064a]** Community Growth & Outreach philosophy documented. `[CGO-M01, CGO-M02, CGO-M03]`
- [x] **[AC-064b]** Growth Dashboard and Representation Map established. `[CGO-M04, CGO-M05]`
- [x] **[AC-064c]** Outreach planning and community readiness defined. `[CGO-M06–CGO-M10]`
- [x] **[AC-064d]** Growth Heat Maps and resource sharing incorporated. `[CGO-M12, CGO-M13]`
- [x] **[AC-064e]** Arkansas Coverage Map specified. `[CGO-M16]`
- [x] **[AC-064f]** Burt has blueprint for intentional community growth across Arkansas. `[CGO-BG, community-growth-outreach-system.json]`

---

**Phase 6 Complete.** · **Volume 0:** [Master Architecture Bible [MAB-001]](../master/MASTER_ARCHITECTURE_BIBLE.md) — canonical source of truth; read before production code

*Trace: Local understanding → readiness → zones and goals → outreach → belonging → representation improves → coverage map shows statewide progress → communities mentor neighbors*
