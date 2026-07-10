# Community Impact Intelligence System

**Document ID:** PHASE-005.10  
**Artifact:** `COMMUNITY_IMPACT_INTELLIGENCE_SYSTEM.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 5 — Action Operating System  
**Acronym:** CIIS

> **Success is measured by stronger people, stronger relationships, and stronger communities.**

**Impact Measurement** sounds like reporting. This module answers something deeper: *Did we actually make our communities stronger?* That is **Community Impact Intelligence** — understanding whether missions create **meaningful change**, not just activity.

**Requirement:** CIIS-001 · **Supersedes:** IMS-001 (Impact Measurement System) · **Governed by:** [Action Constitution ACN-001](ACTION_CONSTITUTION.md)

**Builds On:** [Community Intelligence CIS-001](../phase-04/COMMUNITY_INTELLIGENCE_SYSTEM.md) · [Community Legacy CLS-001](../phase-04/COMMUNITY_LEGACY_SYSTEM.md) · [Community Knowledge CKLS-001](../phase-04/COMMUNITY_KNOWLEDGE_LEARNING_SYSTEM.md) · [Personal Growth & Leadership PGL-001](../phase-03/PERSONAL_GROWTH_LEADERSHIP.md) · [Mission Design System MDS-001](MISSION_DESIGN_SYSTEM.md) · [Collaborative Decision System CDS-001](COLLABORATIVE_DECISION_SYSTEM.md)

**Live spec:** `data/registry/community-impact-intelligence-system.json`

**Required reading for Burt.**

**Core question:** *Did we actually make our communities stronger?*

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| CIIS-M01 | Purpose |
| CIIS-M02 | Guiding principle |
| CIIS-M03 | Impact philosophy |
| CIIS-M04 | Impact framework |
| CIIS-M05 | Mission Impact Report |
| CIIS-M06 | Community Impact Dashboard |
| CIIS-M07 | Story-based measurement |
| CIIS-M08 | Long-term impact |
| CIIS-M09 | Community reflection |
| CIIS-M10 | Explainability |
| CIIS-M11 | Future AI assistance |
| CIIS-M12 | CIS relationship |
| CIIS-M13 | Outputs vs outcomes |
| CIIS-M14 | Learning system role |
| CIIS-M15 | MOR integration |
| CIIS-M16 | Impact Chain |
| CIIS-M17 | Impact intelligence stack |
| CIIS-M18 | Platform integrations |
| CIIS-M19 | V1 scope |
| CIIS-BG | Burt implementation guidance |
| AC-057 | Step 5.10 acceptance criteria |

---

## CIIS-M01 — Purpose

**[CIIS-M01]** The **Community Impact Intelligence System (CIIS)** helps participants and communities understand the **real effects of their work** by connecting activities, outcomes, relationships, leadership development, and long-term community change.

**[CIIS-M01a]** The objective is **not to measure busyness** — the objective is to **understand meaningful impact** [ACN-M06 service before status].

**[CIIS-M01b]** CIIS connects **qualitative stories** with **quantitative signals** — neither alone tells the full story [CIIS-M07].

**[CIIS-M01c]** Reports must be **understandable by participants**, not just administrators [CIIS-BG].

---

## CIIS-M02 — Guiding Principle

**[CIIS-M02]**

> **Success is measured by stronger people, stronger relationships, and stronger communities.**

**[CIIS-M02a]** The platform should continually ask whether its work is creating **lasting value** [PEL-M13 evaluation question, ACN-M04 Civic Operating Loop].

**[CIIS-M02b]** Aligns with North Star: relationships, belonging, community builders [NS-002].

---

## CIIS-M03 — Impact Philosophy

**[CIIS-M03]** **Activities produce outputs. Communities experience outcomes.** The system must distinguish between the two.

**[CIIS-M03a]** Examples:

| Output (activity) | Outcome (change) |
|-------------------|------------------|
| Held four events | New friendships formed |
| Recruited twenty volunteers | Participants became leaders |
| Hosted three meetings | Communities solved problems together |
| Published twelve posts | New campus partnerships emerged |
| Logged 200 volunteer hours | Participants returned to volunteer again |

**[CIIS-M03b]** **Outcomes matter most** [MDS-M13, ACN-M06] — outputs provide context, not success definition.

**[CIIS-M03c]** Non-ranking — no leaderboard of "most impactful communities" [CIS-001, COS-001 ethics].

---

## CIIS-M04 — Impact Framework

**[CIIS-M04]** Every mission contributes to one or more **impact dimensions**:

### People [CIIS-M04a]

New participants welcomed · Volunteer growth [VDS-001] · Leadership development [PGL-001] · Mentorship · Skill development · Participant confidence · Sense of belonging [PEL-001]

### Relationships [CIIS-M04b]

New friendships [PRN-001] · Cross-campus connections [SCN-001] · County partnerships · Mentorship relationships · Collaboration · Community trust [Trust Graph] · Network growth

### Communities [CIIS-M04c]

Projects completed · Communities served · Traditions established [CLS-001] · Knowledge preserved [CKLS-001] · Volunteer culture strengthened · Community resilience

### Knowledge [CIIS-M04d]

Playbooks created [EEOS-M17, CKLS-001] · Lessons documented · Training delivered · Community Brain expanded · Resources shared [CCE-001] · Experience preserved

### Leadership [CIIS-M04e]

New leaders emerged [PGL-001] · Mentors developed · Committees formed [TWG-001] · Leadership succession [CCN-001] · Community ownership increased

### Statewide Network [CIIS-M04f]

Communities collaborating [SCN-001] · Shared initiatives [IOS-001] · Cross-county support · Cross-campus participation · Capability sharing [CCE-001] · Volunteer exchanges — **the statewide ecosystem becomes stronger**

---

## CIIS-M05 — Mission Impact Report

**[CIIS-M05]** Every mission **automatically generates** a Mission Impact Report:

| Section | Content |
|---------|---------|
| Mission purpose | From Canvas [MDS-001] |
| People involved | Participants, volunteers [VDS-001] |
| Communities represented | Geographic and organizational scope |
| Outcomes achieved | By dimension [CIIS-M04] |
| Stories collected | Qualitative evidence [CIIS-M07] |
| Lessons learned | For Community Brain [CKLS-001] |
| Recommendations | For future organizers |
| Community reflections | Participant voices [CIIS-M09] |

**[CIIS-M05a]** Future organizers **immediately understand what changed** — attached to Mission Operating Record [ACN-M26].

**[CIIS-M05b]** Orchestrator: `generateMissionImpactReport(missionId)` · Route: `/mission/[slug]/impact`.

---

## CIIS-M06 — Community Impact Dashboard

**[CIIS-M06]** Every community receives a **living impact dashboard**:

- People served
- Relationships formed
- Volunteer development
- Knowledge created
- Projects completed
- Community stories
- Leadership growth
- Long-term trends

**[CIIS-M06a]** Dashboards emphasize **community growth rather than statistics alone** [CIIS-M07 stories].

**[CIIS-M06b]** Route: `/community/[slug]/impact` · Complements Community Command Center [CCC-001] — not a vanity metrics page.

**[CIIS-M06c]** **Non-ranking** across communities [CCN-M01 equal standing].

---

## CIIS-M07 — Story-Based Measurement

**[CIIS-M07]** Every mission should **collect stories**:

- Volunteer reflections
- Participant experiences
- Community testimonials
- Lessons learned
- Unexpected successes

**[CIIS-M07a]** Stories provide **meaning behind the numbers** [CST-001 storytelling pipeline].

**[CIIS-M07b]** Stories are **first-class impact evidence** — searchable, linkable, preserved in Community Brain [CKLS-001].

---

## CIIS-M08 — Long-Term Impact

**[CIIS-M08]** Some outcomes appear **months or years later**:

- Former volunteer becomes mentor
- Committee launches statewide initiative [IOS-001]
- Campus develops annual tradition [CLS-001]
- Partnership expands [SCN-001]
- Knowledge reused statewide [CKLS-001, EEOS-M17]

**[CIIS-M08a]** Long-term impact preserved through **Community Legacy System** [CLS-001] and **Impact Chain** [CIIS-M16].

**[CIIS-M08b]** Platform supports **delayed outcome linking** — connect today's mission to future events [CIIS-M16 edge type `led_to`].

---

## CIIS-M09 — Community Reflection

**[CIIS-M09]** Communities should periodically ask:

- What changed?
- Who benefited?
- What surprised us?
- What should continue?
- What should improve?

**[CIIS-M09a]** Reflection drives **continuous improvement** [ACN-M04, LIS-001].

**[CIIS-M09b]** Reflection outcomes append to Mission Impact Report and Community Brain — never overwrite [CDS-M06b append-only pattern].

---

## CIIS-M10 — Explainability

**[CIIS-M10]** Every reported impact should be **understandable** [CIS-M16 explainability extends to impact]:

| Question | Visible |
|----------|---------|
| What was measured? | Dimensions and indicators [CIIS-M04] |
| Why does it matter? | Connection to mission purpose |
| How were conclusions reached? | Methodology, sources |
| What evidence supports them? | Stories + data links |

**[CIIS-M10a]** **Transparency builds trust** [ACN-M10, CCN-001].

**[CIIS-M10b]** No black-box impact scores — participants can drill into evidence [CIS-001 intelligence ethics].

---

## CIIS-M11 — Future AI Assistance

**[CIIS-M11]** Future AI may **assist understanding without replacing community interpretation**:

| Capability | Role |
|------------|------|
| Summarize impact | Reduce synthesis burden |
| Connect related stories | Narrative threads |
| Identify emerging trends | Advisory signals [CIS-001] |
| Recommend improvements | For next mission |
| Highlight overlooked outcomes | Impact Chain gaps |
| Generate annual community reports | With human review |

**[CIIS-M11a]** **Advisory only** — communities interpret their own impact [ACN-M06, CCN-M01].

---

## CIIS-M12 — CIS Relationship

**[CIIS-M12]** **Community Intelligence [CIS-001]** (Phase 4) provides **health, trends, and advisory coaching** — *how is the community doing?*

**[CIIS-M12a]** **Community Impact Intelligence [CIIS-001]** (Phase 5) provides **outcome understanding and impact chains** — *what changed because of our work?*

**[CIIS-M12b]** Together: CIS = situational awareness · CIIS = impact understanding · **Neither ranks communities** [COS-001].

**[CIIS-M12c]** CIS Community Coach may reference CIIS Impact Reports — CIIS feeds CIS trend analysis [CIS-M01].

---

## CIIS-M13 — Outputs vs Outcomes

**[CIIS-M13]** CIIS **explicitly separates** output metrics from outcome indicators in all reports and dashboards [CIIS-M03].

**[CIIS-M13a]** Mission Canvas success criteria [MDS-M07] define **intended outcomes at design time** — CIIS measures against them at completion [MDS-001 → CIIS-001 pipeline].

**[CIIS-M13b]** Output metrics (event count, hours logged) appear in **context sections** — never as primary success headline.

---

## CIIS-M14 — Learning System Role

**[CIIS-M14]** CIIS makes the platform a **learning system** where every completed mission strengthens the next generation of organizers [ACN-M04].

**[CIIS-M14a]** Impact intelligence compounds through:

- Mission Library [MDS-M20] — proven missions with impact evidence
- Experience Playbook [EEOS-M17] — gatherings with outcome history
- Initiative legacy [IOS-M14] — statewide movement outcomes

**[CIIS-M14b]** Question for every archived mission: *What should the next organizer know about what actually changed?*

---

## CIIS-M15 — MOR Integration

**[CIIS-M15]** Mission Impact Reports are a **core section of the Mission Operating Record** [ACN-M26]:

```text
MOR sections include:
  ... execution history ...
  → Mission Impact Report [CIIS-M05]
  → Impact Chain [CIIS-M16]
  → Stories [CIIS-M07]
  → Reflection [CIIS-M09]
```

**[CIIS-M15a]** MOR without impact intelligence is **incomplete operational history** [ACN-M26 purpose].

---

## CIIS-M16 — Impact Chain

**[CIIS-M16]** **Signature feature.** Instead of recording **isolated results**, every mission creates an **Impact Chain** tracing how one action leads to another.

**[CIIS-M16a]** Example — leadership development:

```text
Campus Welcome Week
        ↓
45 New Participants
        ↓
18 Joined Volunteer Teams
        ↓
6 Became Team Leaders
        ↓
2 Started New Community Projects
        ↓
1 Regional Initiative Created
```

**[CIIS-M16b]** Example — community tradition:

```text
Food Drive
        ↓
120 Families Served
        ↓
New Community Partnership
        ↓
Monthly Volunteer Program
        ↓
Annual Community Tradition
```

**[CIIS-M16c]** The Impact Chain answers:

- *Which missions consistently develop new leaders?*
- *Which experiences lead to long-term participation?*
- *Which partnerships produce sustained collaboration?*
- *Which playbooks create lasting traditions?*
- *How do small local efforts grow into statewide initiatives?*

**[CIIS-M16d]** Edge types: `welcomed`, `joined`, `became`, `started`, `created`, `served`, `partnered`, `established`, `led_to`, `reused_by`.

**[CIIS-M16e]** Route: `/mission/[slug]/impact/chain` · Orchestrator: `getImpactChain(missionId | communityId, filters?)`.

**[CIIS-M16f]** Graph nodes connect to: participants [PDT-001], missions, teams, initiatives [IOS-001], playbooks, legacy events [CLS-001].

---

## CIIS-M17 — Impact Intelligence Stack

**[CIIS-M17]** Impact Chain ties together platform intelligence layers:

| Layer | System | Role in impact |
|-------|--------|----------------|
| Operational history | Mission Operating Record [ACN-M26] | What happened |
| Knowledge | Community Brain [CKLS-001] | What we learned |
| Legacy | Community Legacy [CLS-001] | What endures |
| Personal growth | Personal Digital Twin [PDT-001] | Individual trajectories |
| Leadership | Growth Graph [PGL-001] | Development paths |
| Governance | Decision Graph [CDS-M16] | Decisions that shaped outcomes |
| Capabilities | Capability Graph [CCE-001] | Skills gained and shared |
| **Causality** | **Impact Chain [CIIS-M16]** | **How actions led to change** |

**[CIIS-M17a]** Together: understand not only **what happened**, but **how today's actions influence tomorrow's communities**.

---

## CIIS-M18 — Platform Integrations

**[CIIS-M18]** CIIS integrates:

| System | Integration |
|--------|-------------|
| ACN-M26 MOR | Impact Report as MOR section |
| MDS-001 | Success criteria at design, impact at completion |
| VDS-001 | Volunteer development outcomes |
| PGL-001 / PDT-001 | Leadership and personal growth |
| PRN-001 | Relationship outcomes |
| CDS-001 | Decision Graph → Impact Chain |
| CCE-001 | Capability outcomes |
| CKLS-001 | Knowledge impact dimension |
| CLS-001 | Long-term legacy |
| CIS-001 | Trend enrichment, advisory |
| SCN-001 | Statewide network dimension |
| IOS-001 | Initiative-level impact aggregation |
| EEOS-001 | Experience outcomes |
| CRA-001 | Recognition of impact |
| CST-001 | Story pipeline |
| LIS-001 | Lessons feed impact |
| CCC-001 | Community Impact Dashboard widget |

---

## CIIS-M19 — V1 Scope

**[CIIS-M19]** Step 5.10 deliverables:

| Capability | V1 |
|------------|-----|
| Community Impact Intelligence philosophy | ✅ Documented |
| Impact framework (6 dimensions) | ✅ Spec |
| Mission Impact Report schema | ✅ Spec |
| Community Impact Dashboard spec | ✅ Spec |
| Story-based + long-term impact | ✅ Spec |
| Explainability requirements | ✅ Spec |
| Impact Chain architecture | ✅ Spec |
| Impact intelligence stack | ✅ Spec |
| Impact UI implementation | Stub |
| Live chain traversal | v1.1 |
| AI impact summarization | Future [CIIS-M11] |

---

## CIIS-BG — Burt Implementation Guidance

**[CIIS-BG]** Implementation should:

1. **Separate outputs from outcomes** in all UI and reports [CIIS-M13]
2. **Connect impact directly to missions** — auto-generate on mission completion [CIIS-M05]
3. **Preserve qualitative stories alongside quantitative signals** [CIIS-M07]
4. **Integrate with CIS, CLS, and Community Brain** [CIIS-M12, CIIS-M18]
5. **Design reports understandable by participants** — not admin-only dashboards [CIIS-M01c]
6. **Implement Impact Chain as edge store** — parallel Decision Graph [CDS-M16]
7. **Never rank communities by impact** [CIIS-M03c, CCN-M01]
8. **Support delayed outcome linking** [CIIS-M08]

**[CIIS-BG-a]** Recommended structure:

```
src/lib/impact/generateMissionImpactReport.ts
src/lib/impact/collectImpactStory.ts
src/lib/impact/getImpactChain.ts
src/lib/impact/getCommunityImpactDashboard.ts
src/lib/impact/linkDelayedOutcome.ts
src/components/impact/MissionImpactReport.tsx
src/components/impact/CommunityImpactDashboard.tsx
src/components/impact/ImpactChain.tsx
data/registry/community-impact-intelligence-system.json
```

**[CIIS-BG-b]** Database: `DB-CIIS` · tables: `mission_impact_reports`, `impact_stories`, `impact_chain_edges`, `community_impact_snapshots`.

---

## AC-057 — Acceptance Criteria

Step 5.10 is complete when:

- [x] **[AC-057a]** Community Impact Intelligence philosophy documented. `[CIIS-M01, CIIS-M02, CIIS-M03]`
- [x] **[AC-057b]** Impact dimensions established. `[CIIS-M04]`
- [x] **[AC-057c]** Mission Impact Reports defined. `[CIIS-M05, CIIS-M15]`
- [x] **[AC-057d]** Story-based measurement and long-term impact incorporated. `[CIIS-M07, CIIS-M08]`
- [x] **[AC-057e]** Impact Chain architecture specified. `[CIIS-M16, CIIS-M17]`
- [x] **[AC-057f]** Burt has blueprint for meaningful community impact analysis. `[CIIS-BG, community-impact-intelligence-system.json]`

---

**Next Step:** 5.11 — Community Storytelling System *(complete — see COMMUNITY_STORYTELLING_SYSTEM.md)*

*Trace: Mission completes → outcomes distinguished from outputs → stories collected → Impact Report generated → Impact Chain links to future → legacy preserved → next mission designs smarter → communities grow stronger*
