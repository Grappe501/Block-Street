# Community Growth Intelligence System (CGIS)

**Document ID:** PHASE-006.6  
**Artifact:** `COMMUNITY_GROWTH_INTELLIGENCE_SYSTEM.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 6 — Growth Operating System  
**Acronym:** CGIS

> **Growth begins by understanding where people are—and where they are still missing.**

Step 6.6 is where the platform becomes **proactive instead of reactive** — but never directive. We built invitation [PON-001], outreach [CGO-001], leadership [CLD-001], and welcome [WBS-001]. CGIS helps communities **see where attention is needed** without telling them what they must do.

**Requirement:** CGIS-001 · **Planned alias superseded:** GIN-001 · **Extends:** [Community Intelligence CIS-001](../phase-04/COMMUNITY_INTELLIGENCE_SYSTEM.md) · **Phase umbrella:** GOS-001 · **Governed by:** [Growth Constitution GCN-001](GROWTH_CONSTITUTION.md)

**Builds On:** CIS-001 · CGO-001 · CLD-001 · WBS-001 · PON-001 · [Opportunity Exchange OEX-001](../phase-04/OPPORTUNITY_EXCHANGE.md) · [Statewide Collaboration SCN-001](../phase-04/STATEWIDE_COLLABORATION_NETWORK.md) · [Arkansas Coverage Map CGO-M16](COMMUNITY_GROWTH_OUTREACH_SYSTEM.md)

**Live spec:** `data/registry/community-growth-intelligence-system.json`

**Required reading for Burt.**

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| CGIS-M01 | Purpose |
| CGIS-M02 | Guiding principle |
| CGIS-M03 | Philosophy |
| CGIS-M04 | Growth Awareness |
| CGIS-M05 | Opportunity Detection |
| CGIS-M06 | Representation Intelligence |
| CGIS-M07 | Growth Trends |
| CGIS-M08 | Outreach Intelligence |
| CGIS-M09 | Leadership Intelligence |
| CGIS-M10 | Community Health Signals |
| CGIS-M11 | Geographic Intelligence |
| CGIS-M12 | Predictive Insights |
| CGIS-M13 | Explainability |
| CGIS-M14 | Future AI assistance |
| CGIS-M15 | Relationship to CIS-001 |
| CGIS-M16 | Arkansas Growth Observatory |
| CGIS-M17 | Deepen Before Expand rule |
| CGIS-M18 | V1 scope |
| CGIS-BG | Burt implementation guidance |
| AC-067 | Step 6.6 acceptance criteria |

---

## CGIS-M01 — Purpose

**[CGIS-M01]** The **Community Growth Intelligence System (CGIS)** continuously analyzes participation, relationships, community health, outreach, and leadership development to help communities **identify opportunities for healthy growth**.

**[CGIS-M01a]** The objective is **not maximizing membership** [GCN-M05a Belonging Over Engagement].

**[CGIS-M01b]** The objective is helping every community become **stronger, more welcoming, and more representative** [GCN-M07 Healthy Growth Indicators].

**[CGIS-M01c]** CGIS is the **statewide intelligence layer for healthy expansion** — visibility, not direction [GCN-M08 Transparency].

---

## CGIS-M02 — Guiding Principle

**[CGIS-M02]**

> **Growth begins by understanding where people are—and where they are still missing.**

**[CGIS-M02a]** **Intelligence creates awareness. Communities create action.** [ACN-M06 advisory AI, OPIS-M12]

**[CGIS-M02b]** CGIS **never tells communities what they must do** — communities choose how to respond [CCN-M004 local autonomy].

---

## CGIS-M03 — Philosophy

**[CGIS-M03]** Communities should always understand:

| Signal | CGIS module |
|--------|-------------|
| Where growth is happening | Growth Trends [CGIS-M07] |
| Where participation is slowing | Growth Awareness [CGIS-M04] |
| Which people need support | WBS Belonging Checkpoints [WBS-M11] |
| Which communities need organizers | Opportunity Detection [CGIS-M05] |
| Where new opportunities exist | OEX-001 · CGIS-M05 |
| Where leadership is emerging | Leadership Intelligence [CGIS-M09] |

**[CGIS-M03a]** The platform provides **visibility rather than direction** [GCN-M08, CIS-M03 advisory only].

**[CGIS-M03b]** Proactive — surfaces opportunities communities **might otherwise miss** [OIS-001 outreach signals extended to growth lens].

---

## CGIS-M04 — Growth Awareness

**[CGIS-M04]** The system **continuously observes** statewide growth signals:

- Community participation · invitation activity · volunteer engagement
- Mentorship · leadership development · community representation
- Returning participants · mission participation · relationship growth [PON-001, RGE-001]

**[CGIS-M04a]** Develops **statewide understanding** of community growth — not individual surveillance [SEC-001].

**[CGIS-M04b]** Orchestrator: `getGrowthAwareness(scope, period?)`.

**[CGIS-M04c]** Feeds [Living Network Graph GOS-M16] growthGraph layer.

---

## CGIS-M05 — Opportunity Detection

**[CGIS-M05]** CGIS **identifies opportunities** — communities choose response.

**[CGIS-M05a]** Examples:

- Campus without organizers · county needing volunteers
- Community ready for new committee · potential mentor matches
- Strong communities able to help others · emerging campus leaders

**[CGIS-M05b]** Distinct from [Opportunity Exchange OEX-001] — OEX lists open roles; CGIS **detects systemic gaps** and suggests where attention may help.

**[CGIS-M05c]** Orchestrator: `detectGrowthOpportunities(filters?)`.

**[CGIS-M05d]** All opportunities pass [Deepen Before Expand CGIS-M17] filter when recommending new community launches.

---

## CGIS-M06 — Representation Intelligence

**[CGIS-M06]** Platform helps communities understand **representation** [CGO-M05 Representation Map — operational; CGIS — intelligence layer].

**[CGIS-M06a]** Examples:

- Academic departments · residence halls · student organizations
- County regions · neighborhoods · future high schools · trade schools

**[CGIS-M06b]** Objective: **broad participation** and awareness of who may not yet be represented [GCN-M09 Diversity of Communities].

**[CGIS-M06c]** **Visibility — not judgment** [CGO-M12, CGO-M16g].

---

## CGIS-M07 — Growth Trends

**[CGIS-M07]** Communities view **trends** for planning:

- Weekly · semester · year-over-year participation
- Volunteer trends · leadership development · community expansion · relationship growth

**[CGIS-M07a]** Long-term trends help communities **plan** — not react in panic [GCN-M05d Long-Term Thinking].

**[CGIS-M07b]** Integrates [Community Growth Dashboard CGO-M04] and [Belonging Index GCN-M16].

**[CGIS-M07c]** Orchestrator: `getGrowthTrends(communityId | scope, period)`.

---

## CGIS-M08 — Outreach Intelligence

**[CGIS-M08]** System may highlight:

- Successful outreach events · high-performing welcome activities [WBS-001, CGO-M08]
- Communities needing follow-up · invitation patterns [PON-001]
- Seasonal opportunities · upcoming campus events

**[CGIS-M08a]** Outreach becomes **more intentional** [CGO-001] — learn what works across communities [CKLS-001 playbooks].

**[CGIS-M08b]** Does not rank communities competitively [GCN-M08].

---

## CGIS-M09 — Leadership Intelligence

**[CGIS-M09]** Communities should see:

- Emerging leaders · potential mentors [CLD-001]
- Leadership succession opportunities · training recommendations · leadership gaps

**[CGIS-M09a]** Healthy leadership development **supports healthy growth** [CLD-M10 Succession].

**[CGIS-M09b]** Integrates [Leadership Constellation CLD-M16] — where leadership is spreading.

**[CGIS-M09c]** Orchestrator: `getLeadershipIntelligence(communityId | scope)`.

---

## CGIS-M10 — Community Health Signals

**[CGIS-M10]** Growth Intelligence **integrates with Community Health** [CIS-001] — growth viewed within broader community health.

**[CGIS-M10a]** Examples:

| Signal | Interpretation |
|--------|----------------|
| High volunteer participation | Healthy engagement |
| Low event attendance | Outreach or relevance gap |
| Strong mentorship | Succession strength |
| Knowledge growth | Community Brain active [CKLS-001] |
| Inactive committees | Internal renewal needed [CGS-001] |
| Partnership opportunities | SCN-001 collaboration potential |

**[CGIS-M10b]** CGIS adds **growth lens** to CIS health — CIS asks *"Is this community healthy?"* · CGIS asks *"Where should growth attention go?"*

---

## CGIS-M11 — Geographic Intelligence

**[CGIS-M11]** The **Arkansas map becomes interactive** [extends CGO-M16 Arkansas Coverage Map].

**[CGIS-M11a]** Communities can identify:

- Counties without organizers · campuses not yet launched
- Communities requesting assistance · regional partnerships
- Nearby mentors · expansion opportunities [CEF-001 6.9]

**[CGIS-M11b]** Map supports **strategic outreach** — not territorial competition [CCN-M004 equal standing].

**[CGIS-M11c]** Route layer: `/map/coverage?layer=intelligence` · orchestrator: `getGeographicGrowthIntelligence(filters?)`.

---

## CGIS-M12 — Predictive Insights

**[CGIS-M12]** Future intelligence may identify:

- Communities likely to need support · upcoming leadership transitions
- Volunteer shortages · seasonal participation changes
- Communities ready to launch new initiatives

**[CGIS-M12a]** Predictions remain **advisory** [ACN-M06, GCN-M15] — never automated action.

**[CGIS-M12b]** Prepare architecture for predictive models [CGIS-BG] — v1.1+.

---

## CGIS-M13 — Explainability

**[CGIS-M13]** Every recommendation explains:

| Element | Required |
|---------|----------|
| What was observed | Data source cited |
| Why recommendation appears | Reasoning chain |
| Supporting information | Links to dashboards |
| Possible next steps | Suggestions only — not mandates |

**[CGIS-M13a]** **Transparency strengthens trust** [GCN-M08, OBE-M05 explainable recommendations, SEC-001].

**[CGIS-M13b]** No black-box growth scores [GCN-M05a — Belonging Index is community reflection, not individual ranking].

---

## CGIS-M14 — Future AI Assistance

**[CGIS-M14]** Future AI may **support** community judgment — never replace it [GCN-M15, CIS-M12].

**[CGIS-M14a]** May:

- Recommend outreach strategies · suggest mentorship pairings
- Identify underserved communities · recommend launch priorities
- Summarize statewide growth · detect emerging patterns

**[CGIS-M14b]** AI outputs pass [Explainability CGIS-M13] and [Deepen Before Expand CGIS-M17].

---

## CGIS-M15 — Relationship to CIS-001

**[CGIS-M15a]** **CIS-001** (Phase 4) established **Community Intelligence** — health signals, insights, advisory recommendations for community operations.

**[CGIS-M15b]** **CGIS-001** (Phase 6.6) extends CIS with **statewide growth intelligence** — opportunity detection, representation, trends, observatory.

**[CGIS-M15c]** CIS answers *"How is this community doing?"* · CGIS answers *"Where is attention needed for healthy growth across Arkansas?"*

**[CGIS-M15d]** Planned **Growth Intelligence GIN-001** superseded — CGIS reflects full scope: not just growth, but **where attention is needed**.

**[CGIS-M15e]** Distinct from [Operational Intelligence OPIS-001] (Phase 5 coordination) and [Outreach Intelligence OIS-001] (Phase 2 signals).

---

## CGIS-M16 — Arkansas Growth Observatory

**[CGIS-M16]** The **Arkansas Growth Observatory (AGO)** is the **signature executive tool** of CGIS — a **living view** of how the statewide network is evolving. Not static reports.

**[CGIS-M16a]** Authorized organizers explore five lenses:

| Lens | Questions |
|------|-----------|
| **Growth** | Which campuses expanding? Counties welcoming new participants? Invitations → active involvement? |
| **Leadership** | New organizers emerging? Strong mentorship? Areas needing leadership development? |
| **Representation** | Institutions with active communities? Counties needing organizers? Schools ready to launch? |
| **Community Health** | Volunteers active? Communities thriving? Support requests increasing? |
| **Network Expansion** | Partnerships forming? Communities collaborating? New opportunities appearing? |

**[CGIS-M16b]** Route: `/observatory/growth` · orchestrator: `getArkansasGrowthObservatory(lens?, filters?)`.

**[CGIS-M16c]** Complements [Arkansas Coverage Map CGO-M16] (coverage/gaps) · [Movement Readiness AOS-M09] · [Arkansas Network Health COS-M09] — **growth intelligence command center**.

**[CGIS-M16d]** Role-based access [SEC-001] — community organizers see their scope; statewide coordinators see aggregate.

**[CGIS-M16e]** Living, not static — refreshes from [Growth Awareness CGIS-M04] pipeline.

---

## CGIS-M17 — Deepen Before Expand Rule

**[CGIS-M17]** **Constitutional rule for Growth Intelligence** [extends GCN-M05b Community Before Scale]:

> **The platform should always recommend strengthening existing communities before creating unnecessary new ones.**

**[CGIS-M17a]** If a campus already has a **healthy community**, CGIS may suggest:

- Developing additional leaders [CLD-001]
- Expanding outreach into underrepresented student organizations [CGO-M05]
- Launching a new committee · mentoring a nearby campus [SCN-001]
- Supporting a neighboring county

**[CGIS-M17b]** **Only after local capacity is healthy** should the system encourage launching entirely new communities [CEF-001 6.9].

**[CGIS-M17c]** Keeps growth **sustainable** — deepen relationships and strengthen communities first, expand outward when foundation is ready [GCN-M02, GCN-M05d].

**[CGIS-M17d]** Enforced in `detectGrowthOpportunities()` and observatory launch recommendations [CGIS-M05d].

**[CGIS-M17e]** Reference: **CP-017** candidate — document in [Growth Constitution GCN-001] module inheritance.

---

## CGIS-M18 — V1 Scope

| Deliverable | Status |
|-------------|--------|
| CGIS philosophy documented | ✅ |
| Growth Awareness + Opportunity Detection | ✅ |
| Representation + Trends + Outreach Intelligence | ✅ |
| Leadership + Health + Geographic Intelligence | ✅ |
| Explainability + Deepen Before Expand rule | ✅ |
| Arkansas Growth Observatory architecture | ✅ |
| Live observatory aggregation | v1.1 |
| Predictive insights | v1.2 |

---

## CGIS-BG — Burt Implementation Guidance

**[CGIS-BG-a]** Implementation should:

- **Separate Growth Intelligence from operational execution** [EOS-001, CGO outreach activities]
- Integrate [CIS-001], [CLD-001], [OEX-001], [CGO-001], [WBS-001]
- Support **explainable recommendations** [CGIS-M13]
- Respect **privacy and permissions** [SEC-001]
- Prepare for **future predictive models** [CGIS-M12]
- Enforce **Deepen Before Expand** in all launch suggestions [CGIS-M17]

**[CGIS-BG-b]** Files:

```
src/lib/cgis/getGrowthAwareness.ts
src/lib/cgis/detectGrowthOpportunities.ts
src/lib/cgis/getGrowthTrends.ts
src/lib/cgis/getLeadershipIntelligence.ts
src/lib/cgis/getGeographicGrowthIntelligence.ts
src/lib/cgis/getArkansasGrowthObservatory.ts
src/lib/cgis/explainRecommendation.ts
src/components/intelligence/ArkansasGrowthObservatory.tsx
data/registry/community-growth-intelligence-system.json
```

**[CGIS-BG-c]** Database: `DB-CGIS` · tables: `growth_intelligence_signals`, `growth_opportunities`, `growth_trend_snapshots`, `observatory_cache`.

---

## AC-067 — Acceptance Criteria

Step 6.6 is complete when:

- [x] **[AC-067a]** Community Growth Intelligence philosophy documented. `[CGIS-M01, CGIS-M02, CGIS-M03]`
- [x] **[AC-067b]** Opportunity and representation intelligence established. `[CGIS-M05, CGIS-M06]`
- [x] **[AC-067c]** Geographic and leadership intelligence incorporated. `[CGIS-M09, CGIS-M11]`
- [x] **[AC-067d]** Explainability and privacy defined. `[CGIS-M13, SEC-001]`
- [x] **[AC-067e]** Deepen Before Expand rule established. `[CGIS-M17]`
- [x] **[AC-067f]** Arkansas Growth Observatory specified. `[CGIS-M16]`
- [x] **[AC-067g]** Burt has blueprint for statewide growth awareness. `[CGIS-BG, community-growth-intelligence-system.json]`

---

**Phase 6 Complete.** · **Volume 0:** [Master Architecture Bible [MAB-001]](../master/MASTER_ARCHITECTURE_BIBLE.md) — canonical source of truth; read before production code

*Trace: Observe → detect opportunity → explain → community chooses action → deepen before expand → healthy growth → observatory shows statewide progress*
