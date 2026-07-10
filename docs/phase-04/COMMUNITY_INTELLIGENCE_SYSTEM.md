# Community Intelligence System

**Document ID:** PHASE-004.10  
**Artifact:** `COMMUNITY_INTELLIGENCE_SYSTEM.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 4 — Community Operating System  
**Acronym:** CIS

> **Information becomes valuable when it helps communities take meaningful action.**

Most software builds **analytics**. ASYON builds **Community Intelligence**.

- Analytics tell you **what happened**.
- Intelligence helps you decide **what to do next**.

That is a huge difference. This module becomes the **brain for every community** — a planning partner, not a spreadsheet.

**Requirement:** CIS-001 *(distinct from Phase 6 [ANL-001](../build-steps/00-ID-CONVENTION.md) statewide analytics layer)*

**Builds On:** [Community Growth & Sustainability](COMMUNITY_GROWTH_SUSTAINABILITY.md) · [Community Command Center](COMMUNITY_COMMAND_CENTER.md) · [Mission & Project System](MISSION_PROJECT_SYSTEM.md) · [Community Knowledge & Learning](COMMUNITY_KNOWLEDGE_LEARNING_SYSTEM.md) · [Community Capability Exchange](COMMUNITY_CAPABILITY_EXCHANGE.md) · [Personal Digital Twin](../phase-03/PERSONAL_DIGITAL_TWIN.md)

**Live spec:** `data/registry/community-intelligence-system.json`

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| CIS-M01 | Purpose |
| CIS-M02 | Guiding principle |
| CIS-M03 | Philosophy |
| CIS-M04 | Intelligence categories |
| CIS-M05 | Community Health Report |
| CIS-M06 | Community Pulse integration |
| CIS-M07 | Trend analysis |
| CIS-M08 | Opportunity intelligence |
| CIS-M09 | Predictive assistance |
| CIS-M10 | Community comparisons |
| CIS-M11 | Storytelling |
| CIS-M12 | Explainability |
| CIS-M13 | Future AI assistance |
| CIS-M14 | Community Coach architecture |
| CIS-M15 | Platform integrations |
| CIS-M16 | V1 scope |
| CIS-BG | Burt implementation guidance |
| AC-043 | Step 4.10 acceptance criteria |

---

## CIS-M01 — Purpose

**[CIS-M01]** The **Community Intelligence System (CIS)** continuously helps communities understand their **health, momentum, opportunities, challenges, and future priorities**.

**[CIS-M01a]** Rather than producing dashboards full of numbers, the system **transforms information into actionable insights**.

**[CIS-M01b]** Objective: **help communities make better decisions** — technology strengthens people and communities, not replaces their judgment [PEL-M13].

**[CIS-M01c]** CIS is the **community-level decision-support layer** — distinct from Phase 6 statewide analytics [ANL-001].

---

## CIS-M02 — Guiding Principle

**[CIS-M02]**

> **Information becomes valuable when it helps communities take meaningful action.**

**[CIS-M02a]** The platform should **explain what is happening** and **suggest where attention may be helpful** — never manipulate or score communities for competition.

---

## CIS-M03 — Philosophy

**[CIS-M03]** Analytics answer: **What happened?**

**[CIS-M03a]** Community Intelligence answers:

- **Why?**
- **What does it mean?**
- **What should we do next?**

**[CIS-M03b]** The software becomes a **planning partner** — not a reporting tool.

**[CIS-M03c]** **Health metrics, not vanity metrics** [CGS-M08, OIS-M14, CCN-M14] — every insight must serve community benefit.

**[CIS-M03d]** **Guides, not judges** [CGS-M08a] — intelligence supports growth; it does not rank or shame.

---

## CIS-M04 — Intelligence Categories

**[CIS-M04]** CIS organizes insights across six categories:

### Community Health [CIS-M04a]

Participation · volunteer engagement · leadership development · team activity · project completion · relationship growth · knowledge sharing · community resilience

### Growth [CIS-M04b]

New participants · retention · returning volunteers · mentorship · community expansion · campus representation · county representation

### Opportunities [CIS-M04c]

Communities needing support · projects needing volunteers · leadership opportunities · training needs · knowledge gaps · open missions

### Relationships [CIS-M04d]

New relationships · mentorship growth · cross-community collaboration · network health · partnership development

### Leadership [CIS-M04e]

Emerging leaders · mentorship pipeline · leadership succession · training progress · team development · volunteer development

### Knowledge [CIS-M04f]

Frequently used playbooks · knowledge gaps · capability reuse [CCE-001] · Community Brain growth [CKLS-001] · learning participation · documentation quality

---

## CIS-M05 — Community Health Report

**[CIS-M05]** Every community receives a **living health report** — updated as platform data evolves.

**[CIS-M05a]** Report sections:

| Section | Purpose |
|---------|---------|
| Strengths | What is working well |
| Challenges | Areas needing attention |
| Momentum | Direction of change |
| Risks | Early warning signals |
| Suggestions | Actionable recommendations |
| Milestones | Recent accomplishments |
| Support opportunities | Where others could help |

**[CIS-M05b]** The report should read like a **community coach** rather than a spreadsheet [CIS-M14].

**[CIS-M05c]** Integrates [Community Health Check CGS-M05] lifecycle stage with qualitative narrative.

**[CIS-M05d]** Orchestrator: `generateCommunityHealthReport(communityId)`.

---

## CIS-M06 — Community Pulse Integration

**[CIS-M06]** CIS **feeds** the [Community Pulse CCC-M20] — it does not replace it.

**[CIS-M06a]** Pulse provides **immediate situational awareness** at Command Center entry:

- Volunteer momentum
- Upcoming events
- Growing teams
- Projects at risk
- Communities needing attention

**[CIS-M06b]** CCC widget `pulse` displays CIS-summarized insights; CCC widget `health` displays health report highlights [CCC-M15].

**[CIS-M06c]** Orchestrator: `assembleCommunityPulse(communityId, lastVisitAt)` — enriched by CIS intelligence layer.

---

## CIS-M07 — Trend Analysis

**[CIS-M07]** Communities should see **trends** — understanding direction rather than isolated numbers.

**[CIS-M07a]** Examples:

- Participation increasing or declining
- Volunteer retention patterns
- Team growth over time
- Project completion rates
- Leadership development trajectory
- Relationship building momentum

**[CIS-M07b]** Trends include **narrative context** — not just charts.

**[CIS-M07c]** Orchestrator: `analyzeCommunityTrends(communityId, window)`.

---

## CIS-M08 — Opportunity Intelligence

**[CIS-M08]** The platform **identifies opportunities** — making hidden needs visible.

**[CIS-M08a]** Examples:

- No active organizer at this campus
- County lacking volunteers
- Community ready to launch a team
- Project requires additional help
- Knowledge should be shared across counties

**[CIS-M08b]** Opportunities become **visible collaboration invitations** — connects to [Capability Exchange CCE-001] requests and [Opportunity Exchange OEX-001].

**[CIS-M08c]** Orchestrator: `identifyCommunityOpportunities(communityId)`.

---

## CIS-M09 — Predictive Assistance

**[CIS-M09]** Future capabilities may identify:

- Volunteer shortages
- Leadership transitions approaching
- Busy seasons ahead
- Community burnout risk
- Knowledge preservation risks
- Scheduling conflicts

**[CIS-M09a]** Predictions remain **advisory** — human judgment remains primary [CIS-M02].

**[CIS-M09b]** No manipulative scoring or gamified pressure [CRA-001, PEL-M13].

---

## CIS-M10 — Community Comparisons

**[CIS-M10]** Comparisons should **encourage learning — not competition**.

**[CIS-M10a]** Examples:

- "This county successfully launched a mentorship program."
- "This campus solved a similar problem."
- "Here's a playbook another community found useful."

**[CIS-M10b]** Communities **learn from each other** rather than compete for rankings [CCN-M08 cross-community spirit].

**[CIS-M10c]** Orchestrator: `findSimilarCommunitySuccesses(communityId, challenge)`.

---

## CIS-M11 — Storytelling

**[CIS-M11]** Intelligence should include **stories** — context for numbers.

**[CIS-M11a]** Examples:

- Volunteer highlights
- Leadership growth narratives
- Successful project stories
- Community milestones
- Recognition moments [CRA-001]

**[CIS-M11b]** Stories feed [Community Legacy System CLS-001] and Command Center recognition widget.

---

## CIS-M12 — Explainability

**[CIS-M12]** Every insight must answer:

| Question | Requirement |
|----------|-------------|
| Why is this being shown? | Transparent reasoning |
| What information supports it? | Source attribution |
| What action might help? | Actionable suggestion |

**[CIS-M12a]** Participants should **understand the reasoning** behind recommendations [PDT-001 explainability parallel].

**[CIS-M12b]** No black-box scores — `explainInsight(insightId)` returns sources and rationale.

**[CIS-M12c]** Privacy preserved — insights never expose individual data inappropriately [TPS-001].

---

## CIS-M13 — Future AI Assistance

**[CIS-M13]** Future AI may:

- Summarize community health
- Recommend resources and capabilities
- Identify opportunities
- Generate health reports
- Suggest mentors
- Recommend collaboration

**[CIS-M13a]** AI remains **transparent and explainable** [KDG-M16, CIS-M12] — increases discovery, does not replace human collaboration.

---

## CIS-M14 — Community Coach Architecture

**[CIS-M14]** **Community Coach** — signature feature of CIS.

**[CIS-M14a]** Unlike the **Community Companion** [PEL-M01], which helps **individual participants**, the Community Coach helps the **community itself**.

**[CIS-M14b]** The Coach **observes, explains, and suggests** — it does **not make decisions**.

**[CIS-M14c]** Example Coach messages:

- "Your volunteer participation has been steadily growing over the last three months."
- "You have several experienced members who may be ready to mentor newer organizers."
- "Three nearby campuses recently completed similar projects. Would you like to see their playbooks?"
- "Your annual leadership transition is approaching. Consider documenting meeting notes and assigning successors."
- "You've welcomed many new participants this semester. This may be a good time to schedule an orientation event."

**[CIS-M14d]** Over time, communities gain a **trusted advisor** that helps them remain healthy, preserve institutional knowledge, and identify opportunities before problems become crises.

**[CIS-M14e]** Coach draws from all platform graphs and modules:

```text
Community Coach
        │
        ├── Community Health Report [CIS-M05]
        ├── Trend Analysis [CIS-M07]
        ├── Opportunity Intelligence [CIS-M08]
        ├── Capability Graph [CCE-M13]
        ├── Community Brain [CKLS-M14]
        ├── Growth Graph [PGL-001]
        └── Relationship Graph [REL-001]
```

**[CIS-M14f]** Orchestrator: `getCommunityCoachInsights(communityId, context?)`.

**[CIS-M14g]** V1: spec + insight schema stub — full conversational Coach is future.

---

## CIS-M15 — Platform Integrations

**[CIS-M15]** CIS integrates across the Community OS:

| Module | Integration |
|--------|-------------|
| [CCC-001](COMMUNITY_COMMAND_CENTER.md) | Pulse + Health widgets |
| [CGS-001](COMMUNITY_GROWTH_SUSTAINABILITY.md) | Health Check + lifecycle stage |
| [MPS-001](MISSION_PROJECT_SYSTEM.md) | Project completion + impact data |
| [TWG-001](TEAM_WORKING_GROUP_SYSTEM.md) | Team activity + leadership pipeline |
| [TSOS-001](TIME_SCHEDULING_OPERATING_SYSTEM.md) | Event density + scheduling conflicts |
| [CCNET-001](COMMUNITY_COMMUNICATION_NETWORK.md) | Communication activity signals |
| [CKLS-001](COMMUNITY_KNOWLEDGE_LEARNING_SYSTEM.md) | Knowledge gaps + Brain growth |
| [CCE-001](COMMUNITY_CAPABILITY_EXCHANGE.md) | Capability reuse + requests |
| [CRA-001](../phase-03/COMMUNITY_RECOGNITION_APPRECIATION.md) | Recognition + storytelling |
| [PEL-001](../phase-03/PARTICIPANT_EXPERIENCE_LIFECYCLE.md) | Community Companion parallel |
| [OBE-001](../phase-03/OPPORTUNITY_BELONGING_ENGINE.md) | Opportunity surfacing |
| [ANL-001](../build-steps/00-ID-CONVENTION.md) | Phase 6 statewide layer — CIS feeds, does not duplicate |

---

## CIS-M16 — V1 Scope

**[CIS-M16]** V1 deliverables:

| Capability | V1 |
|------------|-----|
| Philosophy + categories | ✅ Documented |
| Community Coach spec | ✅ Architecture + schema stub |
| Health report structure | ✅ Spec |
| Pulse enrichment contract | ✅ CCC integration defined |
| Explainability requirement | ✅ Required from day one |
| Trend analysis | Stub |
| Opportunity intelligence | Stub |
| Predictive assistance | Future |
| Full AI Coach | Future |

---

## CIS-BG — Burt Implementation Guidance

**[CIS-BG]** Implementation should:

1. **Separate intelligence from raw analytics** — insights layer over data, not dashboards first
2. **Generate insights from existing platform data** — missions, teams, events, relationships, knowledge, capabilities
3. **Support explainable recommendations** — every insight traceable to sources [CIS-M12]
4. **Design reusable intelligence components** — Coach, Health Report, Pulse enrichment share core engine
5. **Preserve participant privacy** — aggregate where appropriate [TPS-001]
6. **Avoid manipulative scoring systems** — no community leaderboards [CIS-M03d]

**[CIS-BG-a]** Suggested files:

- `src/lib/cis/generateCommunityHealthReport.ts`
- `src/lib/cis/getCommunityCoachInsights.ts`
- `src/lib/cis/analyzeCommunityTrends.ts`
- `src/lib/cis/identifyCommunityOpportunities.ts`
- `src/lib/cis/explainInsight.ts`
- `src/components/ccc/widgets/HealthWidget.tsx` — CIS-powered

---

## AC-043 — Acceptance Criteria

Step 4.10 is complete when:

- [x] **[AC-043a]** Community Intelligence philosophy documented. `[CIS-M01, CIS-M03]`
- [x] **[AC-043b]** Intelligence categories established. `[CIS-M04]`
- [x] **[AC-043c]** Health reporting and Community Pulse incorporated. `[CIS-M05, CIS-M06]`
- [x] **[AC-043d]** Explainability required. `[CIS-M12]`
- [x] **[AC-043e]** Community Coach architecture specified. `[CIS-M14]`
- [x] **[AC-043f]** Platform integrations documented. `[CIS-M15]`
- [x] **[AC-043g]** Burt has blueprint for decision-support rather than simple reporting. `[CIS-BG, community-intelligence-system.json]`

---

**Phase 4 Status:** Complete — [Build Bible](PHASE_4_COMMUNITY_OS_BUILD_BIBLE.md) · **Next:** Phase 5 — Action Operating System

*Trace: Platform data → intelligence engine → explainable insights → Community Coach suggests → communities decide → healthier statewide network*
