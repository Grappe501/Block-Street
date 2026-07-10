# Operational Intelligence System

**Document ID:** PHASE-005.13  
**Artifact:** `OPERATIONAL_INTELLIGENCE_SYSTEM.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 5 — Action Operating System  
**Acronym:** OPIS

> **People lead. The platform assists.**

This is **not the "AI phase."** AI is already woven throughout the platform. Step 5.13 defines **how the platform thinks operationally** — the **coordination layer** that helps people notice patterns, reduce friction, and coordinate more effectively.

**Requirement:** OPIS-001 · **Supersedes:** AIN-001 (Action Intelligence) · **Governed by:** [Action Constitution ACN-001](ACTION_CONSTITUTION.md)

**Distinct from:** Phase 2 **Outreach Intelligence [OIS-001](../phase-02/STATEWIDE_OUTREACH_INTELLIGENCE.md)** — OIS surfaces community-level opportunity signals; OPIS is the **Action OS operational coordination layer** that integrates OIS signals with mission, capacity, and learning data.

**Builds On:** [Community Intelligence CIS-001](../phase-04/COMMUNITY_INTELLIGENCE_SYSTEM.md) · [Learning & Improvement LIS-001](LEARNING_IMPROVEMENT_SYSTEM.md) · [Initiative OS IOS-001](INITIATIVE_OPERATING_SYSTEM.md) · [Capacity Coordination CCS-001](CAPACITY_COORDINATION_SYSTEM.md) · [Commitment & Follow-Through CFS-001](COMMITMENT_FOLLOW_THROUGH_SYSTEM.md)

**Live spec:** `data/registry/operational-intelligence-system.json`

**Required reading for Burt.**

**Core principle:** *Local communities lead. The platform helps them see the bigger picture.*

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| OPIS-M01 | Purpose |
| OPIS-M02 | Guiding principle |
| OPIS-M03 | Operational philosophy |
| OPIS-M04 | Operational awareness |
| OPIS-M05 | Opportunity detection |
| OPIS-M06 | Risk detection |
| OPIS-M07 | Pattern recognition |
| OPIS-M08 | Recommendation engine |
| OPIS-M09 | Executive briefs |
| OPIS-M10 | Explainability |
| OPIS-M11 | Privacy & governance |
| OPIS-M12 | Human control |
| OPIS-M13 | Continuous learning |
| OPIS-M14 | Future AI capabilities |
| OPIS-M15 | OIS vs OPIS distinction |
| OPIS-M16 | Operational Graph |
| OPIS-M17 | Operations Center |
| OPIS-M18 | Command center culmination |
| OPIS-M19 | V1 scope |
| OPIS-BG | Burt implementation guidance |
| AC-060 | Step 5.13 acceptance criteria |

---

## OPIS-M01 — Purpose

**[OPIS-M01]** The **Operational Intelligence System (OPIS)** continuously analyzes the platform's **operational data** to help participants, teams, communities, and initiatives **coordinate more effectively**.

**[OPIS-M01a]** Rather than replacing organizers, OPIS acts as a **trusted operational advisor** — surfaces insights, identifies opportunities, recommends actions — **while preserving human judgment** [ACN-M06 advise don't decide].

**[OPIS-M01b]** OPIS is the **coordination layer** — not a decision engine [CDS-001 decisions remain human].

**[OPIS-M01c]** Culmination of Phase 5: from organizing tools to **Community Operating System** with human relationships and local leadership at the center.

---

## OPIS-M02 — Guiding Principle

**[OPIS-M02]**

> **Operational intelligence should make communities more capable, not more dependent.**

**[OPIS-M02a]** Technology should **reduce complexity without reducing human leadership** [CCN-M001 local autonomy, IOS-M13].

**[OPIS-M02b]** Complementary motto: **People lead. The platform assists.** [ACN-M06, ACN-M19]

---

## OPIS-M03 — Operational Philosophy

**[OPIS-M03]** The platform should **quietly answer**:

| Question | OPIS role |
|----------|-----------|
| What deserves attention today? | Briefs [OPIS-M09] |
| Where is help needed? | Risk + OEX-001 [OPIS-M06] |
| What opportunities exist? | Opportunity detection [OPIS-M05] |
| What patterns are emerging? | Pattern recognition [OPIS-M07] |
| What risks should we be aware of? | Early awareness [OPIS-M06] |
| What can we learn from similar missions? | LIS-001, MDS-M20 [OPIS-M08] |

**[OPIS-M03a]** **Guidance, not direction** — every output is dismissible [OPIS-M12 human control].

**[OPIS-M03b]** Not the "AI phase" — OPIS **orchestrates advisory signals** already specified in MDS, EOS, VDS, EEOS, IOS, CCS, CIIS, CST, LIS modules [OPIS-M13].

---

## OPIS-M04 — Operational Awareness

**[OPIS-M04]** OPIS continuously observes platform activity — **situational awareness**:

| Signal source | Data |
|---------------|------|
| Mission progress | EOS-001, CFS-001 |
| Volunteer availability | VDS-001 |
| Community health | CIS-001 |
| Upcoming deadlines | TSOS-001, CFS Commitment Compass |
| Resource utilization | CCS-001 |
| Leadership transitions | CCN-001, TWG-001 |
| Knowledge growth | LIS-001, CKLS-001 |
| Communication trends | CCNET-001, CAM-001 |

**[OPIS-M04a]** **Situational awareness** — not surveillance [CFS-M07 transparency not surveillance, KDG-001].

**[OPIS-M04b]** Aggregates into **Operational Graph** [OPIS-M16] and **Operations Center** [OPIS-M17].

---

## OPIS-M05 — Opportunity Detection

**[OPIS-M05]** OPIS identifies **opportunities** — communities free to accept or ignore:

| Opportunity | Source |
|-------------|--------|
| New volunteer matches | VDS-001, OBE-001 |
| Potential mentors | PGL-001, PRN-001 |
| Cross-campus collaboration | SCN-001 |
| Available equipment | CCS-001 Capacity Map |
| Communities needing support | OEX-001, OIS-001 outreach signals |
| Training recommendations | CKLS-001, LIS-001 |

**[OPIS-M05a]** **Explainable** — why this opportunity now [OPIS-M10].

**[OPIS-M05b]** Integrates **Opportunity Exchange** [OEX-001] and **Outreach Intelligence** [OIS-001] — OPIS coordinates, does not duplicate.

---

## OPIS-M06 — Risk Detection

**[OPIS-M06]** OPIS identifies **operational risks** — **early awareness**, not emergency response:

| Risk | Detection |
|------|-----------|
| Volunteer shortages | VDS-001, CFS-001 |
| Upcoming leadership transitions | CCN-001 succession |
| Schedule conflicts | TSOS-001, CCS-001 |
| Resource bottlenecks | CCS-001 forecasting |
| Missed milestones | EOS-001, CFS-001 |
| Knowledge not documented | LIS-001 reflection gaps |

**[OPIS-M06a]** Surfaces in **Commitment Compass** [CFS-M16], **Community Pulse** [CCC-001], **Operations Center** [OPIS-M17].

**[OPIS-M06b]** **Non-alarming** language — awareness and support, not panic [CIS-001 ethics].

---

## OPIS-M07 — Pattern Recognition

**[OPIS-M07]** OPIS learns **recurring operational patterns**:

- Successful event timing [EEOS-001, TSOS-001]
- Volunteer participation cycles [VDS-001]
- Seasonal initiatives [CLS-001, IOS-001]
- Community rhythms [CIS-001 trends]
- Frequently reused playbooks [EEOS-M17, LIS Improvement Graph]
- Common bottlenecks [LIS-001 lessons]

**[OPIS-M07a]** Patterns help **plan more effectively** [MDS-001 design, CCS-001 capacity planning].

**[OPIS-M07b]** **Advisory** — patterns suggest, never mandate [OPIS-M12].

---

## OPIS-M08 — Recommendation Engine

**[OPIS-M08]** OPIS may recommend:

Playbooks [EEOS-M17, CKLS-001] · Mission templates [MDS-M20] · Nearby partners [SCN-001] · Experienced organizers [PRN-001] · Training [CKLS-001] · Equipment [CCS-001] · Meeting times [TSOS-001] · Knowledge articles [CKLS-001]

**[OPIS-M08a]** **Every recommendation remains explainable** [OPIS-M10, CIS-M16 explainability extends].

**[OPIS-M08b]** Modular **recommendation pipelines** [OPIS-BG] — separate from business logic.

**[OPIS-M08c]** Orchestrator: `getRecommendations(context, scope)` · returns `{ recommendation, explanation, alternatives, confidence }`.

---

## OPIS-M09 — Executive Briefs

**[OPIS-M09]** Different users receive **tailored operational summaries**:

| Brief | Audience | Scope |
|-------|----------|-------|
| Participant Brief | Individual | Personal HQ [PHQ-001] |
| Team Brief | Working group | TWG-001 |
| Community Brief | Community leaders | CCC-001 |
| Initiative Brief | Initiative coordinators | ICC [IOS-M16] |
| Statewide Brief | Network organizers | Operations Center [OPIS-M17] |

**[OPIS-M09a]** Complements **Morning Brief · Community Pulse · DOB · Commitment Compass** [CFS-M17 daily stack] — OPIS adds **cross-module synthesis**.

**[OPIS-M09b]** Briefs are **permission-scoped** [OPIS-M11] — see only what you're authorized to see.

---

## OPIS-M10 — Explainability

**[OPIS-M10]** Every recommendation answers:

| Question | Required |
|----------|----------|
| What did the platform observe? | Signal sources [OPIS-M04] |
| Why is this recommendation being made? | Reasoning chain |
| What information supports it? | Evidence links |
| What alternatives exist? | Other options |

**[OPIS-M10a]** **Explainability builds trust** [CIS-001, CIIS-M10, CDS-M14 transparency].

**[OPIS-M10b]** No black-box scores — drill-down to source data [KDG-001].

---

## OPIS-M11 — Privacy & Governance

**[OPIS-M11]** OPIS respects **all platform privacy settings** [KDG-001, SEC-001]:

**[OPIS-M11a]** **Never expose** information participants are not authorized to see.

**[OPIS-M11b]** Recommendations generated **within user permissions** only — foundational, not optional.

**[OPIS-M11c]** Consent for personal data in recommendations [PEP-001, CST-001 story consent parallel].

---

## OPIS-M12 — Human Control

**[OPIS-M12]** Participants and organizers **always retain authority**:

| Action | Supported |
|--------|-----------|
| Accept recommendations | One-click apply where safe |
| Ignore recommendations | No penalty, no nagging [CAM-001] |
| Modify recommendations | Human adaptation |
| Provide feedback | Improves OPIS [OPIS-M13] |

**[OPIS-M12a]** **Operational Intelligence remains advisory** [ACN-M06 constitutional principle implements through OPIS-001].

**[OPIS-M12b]** OPIS **never auto-assigns** volunteers, **never auto-decides**, **never auto-publishes** [CDS-001, CFS-001, CST-001 boundaries].

---

## OPIS-M13 — Continuous Learning

**[OPIS-M13]** OPIS improves through platform learning systems:

| Source | Improvement |
|--------|-------------|
| Mission outcomes | CIIS-001 |
| Community reflections | LIS-001 |
| Playbook evolution | LIS Improvement Graph |
| Impact Chains | CIIS-M16 |
| Community Brain | CKLS-001 |
| Mission Library | MDS-M20 |
| User feedback | OPIS-M12 |

**[OPIS-M13a]** Platform **continually becomes a better assistant** — not a more controlling system [OPIS-M02].

---

## OPIS-M14 — Future AI Capabilities

**[OPIS-M14]** Future enhancements — **transparent and user-controlled**:

| Capability | Guardrails |
|------------|------------|
| Natural-language operational queries | Permission-scoped |
| Mission planning assistance | Advisory [MDS-001] |
| Volunteer coordination suggestions | VDS-001, human confirms |
| Meeting summaries | Consent-based |
| Action-item extraction | Review before apply |
| Knowledge retrieval | CKLS-001 citations |
| Simulation of alternative approaches | What-if, not auto-execute |

**[OPIS-M14a]** Modular intelligence services [OPIS-BG] — swap models without redesign.

---

## OPIS-M15 — OIS vs OPIS Distinction

**[OPIS-M15]** Namespace clarity:

| ID | Name | Phase | Role |
|----|------|-------|------|
| **OIS-001** | Outreach Intelligence | 2 | Community-level opportunity signals, Mission Board |
| **OPIS-001** | Operational Intelligence | 5 | Action OS coordination layer, advisory synthesis |

**[OPIS-M15a]** OPIS **consumes** OIS-001 signals — does not replace [OEX-001 three-layer stack].

**[OPIS-M15b]** CIS-001 (community health coach) and OPIS-001 (operational coordination) — CIS advises community wellbeing; OPIS advises operational coordination [CIIS-M12 parallel pattern].

---

## OPIS-M16 — Operational Graph

**[OPIS-M16]** **Signature feature.** The graph that **ties all others together** — does not replace them, **connects them**.

**[OPIS-M16a]** Existing graphs:

Relationship · Trust · Growth · Conversation · Decision · Capability · Improvement · Impact Chain

**[OPIS-M16b]** Example — operational cascade:

```text
Volunteer Shortage
        │
    affects
        │
    Mission
        │
    delays
        │
Project Milestone
        │
   creates
        │
Resource Request
        │
fulfilled by
        │
Neighboring Campus
        │
  improves
        │
Community Impact
```

**[OPIS-M16c]** Example — development path:

```text
New Participant
        │
   joined
        │
Campus Community
        │
 completed
        │
Volunteer Mission
        │
identified as
        │
Emerging Leader
        │
recommended for
        │
   Mentorship
```

**[OPIS-M16d]** Operational Graph understands **how operational events influence one another** across the ecosystem.

**[OPIS-M16e]** Edge types: `affects`, `delays`, `creates`, `fulfilled_by`, `improves`, `joined`, `completed`, `identified_as`, `recommended_for`.

**[OPIS-M16f]** Route: `/operations/graph` · Orchestrator: `getOperationalGraph(scope, filters?)`.

---

## OPIS-M17 — Operations Center

**[OPIS-M17]** **Signature feature.** Platform-wide **situational awareness center** — not a control room.

**[OPIS-M17a]** Authorized organizers see:

- Active missions
- Volunteer momentum [VDS-001]
- Communities requesting help [OEX-001]
- Capacity availability [CCS-M16]
- Upcoming statewide events [EEOS-001, IOS-001]
- Leadership transitions [CCN-001]
- Opportunity Exchange activity [OEX-001]
- Community Health summaries [CIS-001]
- Impact trends [CIIS-001]
- Learning & Improvement highlights [LIS-001]

**[OPIS-M17b]** Route: `/operations` · Orchestrator: `getOperationsCenter(scope, permissions)`.

**[OPIS-M17c]** **Not a control room** — cannot override local decisions [IOS-M13, CCN-M01].

**[OPIS-M17d]** Purpose: help people **coordinate across the statewide network** while **local communities lead** [OPIS-M02, SCN-001].

---

## OPIS-M18 — Command Center Culmination

**[OPIS-M18]** Phase 5 completes the **command center stack**:

| Layer | Center | Scope |
|-------|--------|-------|
| Personal | Personal Command Center [PCC-001] | Individual |
| Community | Community Command Center [CCC-001] | Community |
| Mission | Mission Headquarters [MPS-001] | Mission |
| Experience | Experience Headquarters [EEOS-001] | Gathering |
| Initiative | Initiative Command Center [IOS-M16] | Statewide initiative |
| **Network** | **Operations Center [OPIS-M17]** | **Platform-wide situational awareness** |

**[OPIS-M18a]** Operations Center **aggregates** from all centers — widget composition, not duplication [IOS-M16 pattern].

**[OPIS-M18b]** Natural **culmination of Phase 5** — Community Operating System with intelligence at every layer, human leadership preserved.

---

## OPIS-M19 — V1 Scope

**[OPIS-M19]** Step 5.13 deliverables:

| Capability | V1 |
|------------|-----|
| Operational Intelligence philosophy | ✅ Documented |
| Opportunity, risk, pattern detection | ✅ Spec |
| Recommendation engine + explainability | ✅ Spec |
| Privacy + human control | ✅ Spec |
| Operational Graph architecture | ✅ Spec |
| Operations Center architecture | ✅ Spec |
| Command center culmination | ✅ Spec |
| OPIS UI implementation | Stub |
| Live graph + center aggregation | v1.1 |
| NL queries + AI models | Future [OPIS-M14] |

---

## OPIS-BG — Burt Implementation Guidance

**[OPIS-BG]** Implementation should:

1. **Separate OPIS from business logic** — intelligence as service layer [OPIS-M01]
2. **Maintain explainable recommendation pipelines** [OPIS-M08, OPIS-M10]
3. **Use modular intelligence services** — pluggable advisors per domain
4. **Support future AI models without redesign** [OPIS-M14]
5. **Respect permission boundaries at every layer** [OPIS-M11]
6. **Preserve human decision-making** [OPIS-M12, ACN-M06]
7. **Implement Operational Graph as cross-graph edge store** [OPIS-M16]
8. **Operations Center as aggregator** — compose widgets from existing modules [OPIS-M17]

**[OPIS-BG-a]** Recommended structure:

```
src/lib/operations/getRecommendations.ts
src/lib/operations/detectRisks.ts
src/lib/operations/detectOpportunities.ts
src/lib/operations/getOperationalGraph.ts
src/lib/operations/getOperationsCenter.ts
src/lib/operations/generateBrief.ts
src/components/operations/OperationsCenter.tsx
src/components/operations/OperationalGraph.tsx
src/components/operations/RecommendationCard.tsx
data/registry/operational-intelligence-system.json
```

**[OPIS-BG-b]** Database: `DB-OPIS` · tables: `operational_signals`, `recommendations`, `recommendation_feedback`, `operational_graph_edges`, `brief_snapshots`.

---

## AC-060 — Acceptance Criteria

Step 5.13 is complete when:

- [x] **[AC-060a]** Operational Intelligence philosophy documented. `[OPIS-M01, OPIS-M02, OPIS-M03]`
- [x] **[AC-060b]** Opportunity, risk, and pattern detection established. `[OPIS-M05, OPIS-M06, OPIS-M07]`
- [x] **[AC-060c]** Explainability and privacy requirements defined. `[OPIS-M10, OPIS-M11]`
- [x] **[AC-060d]** Human oversight principles reinforced. `[OPIS-M12, ACN-M06]`
- [x] **[AC-060e]** Operational Graph and Operations Center specified. `[OPIS-M16, OPIS-M17, OPIS-M18]`
- [x] **[AC-060f]** Burt has blueprint for advisory operational intelligence layer. `[OPIS-BG, operational-intelligence-system.json]`

---

**Phase 5 Complete.**

*Trace: Signals observed → patterns recognized → opportunities and risks surfaced → explainable recommendations offered → human decides → feedback improves OPIS → Operations Center shows bigger picture → local communities lead*
