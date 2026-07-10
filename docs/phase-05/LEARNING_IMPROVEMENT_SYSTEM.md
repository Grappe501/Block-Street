# Learning & Improvement System

**Document ID:** PHASE-005.12  
**Artifact:** `LEARNING_IMPROVEMENT_SYSTEM.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 5 — Action Operating System  
**Acronym:** LIS

> **Every mission should leave behind more wisdom than work.**

**After Action Review** is military language. This module is the **Learning & Improvement System** — helping every mission make the next mission better. Almost every organization finishes a project and moves on; that is where enormous knowledge is lost.

**Requirement:** LIS-001 · **Supersedes:** AAR-001 (After Action Review System) · **Governed by:** [Action Constitution ACN-001](ACTION_CONSTITUTION.md)

**Builds On:** [Community Knowledge CKLS-001](../phase-04/COMMUNITY_KNOWLEDGE_LEARNING_SYSTEM.md) · [Community Legacy CLS-001](../phase-04/COMMUNITY_LEGACY_SYSTEM.md) · [Mission Design System MDS-001](MISSION_DESIGN_SYSTEM.md) · [Community Impact Intelligence CIIS-001](COMMUNITY_IMPACT_INTELLIGENCE_SYSTEM.md) · [Community Storytelling CST-001](COMMUNITY_STORYTELLING_SYSTEM.md)

**Live spec:** `data/registry/learning-improvement-system.json`

**Required reading for Burt.**

**Defining characteristic:** Every completed mission becomes an **investment in the success of future communities**.

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| LIS-M01 | Purpose |
| LIS-M02 | Guiding principle |
| LIS-M03 | Learning philosophy |
| LIS-M04 | Learning lifecycle |
| LIS-M05 | Reflection framework |
| LIS-M06 | Community reflection |
| LIS-M07 | Lessons learned |
| LIS-M08 | Playbook updates |
| LIS-M09 | Improvement recommendations |
| LIS-M10 | Community Learning Dashboard |
| LIS-M11 | Cross-community learning |
| LIS-M12 | Learning library |
| LIS-M13 | Continuous improvement cycle |
| LIS-M14 | Future AI assistance |
| LIS-M15 | Not military AAR |
| LIS-M16 | Improvement Graph |
| LIS-M17 | Learning architecture stack |
| LIS-M18 | Platform integrations |
| LIS-M19 | V1 scope |
| LIS-BG | Burt implementation guidance |
| AC-059 | Step 5.12 acceptance criteria |

---

## LIS-M01 — Purpose

**[LIS-M01]** The **Learning & Improvement System (LIS)** ensures that every mission, event, project, initiative, and community experience **contributes knowledge that improves future work**.

**[LIS-M01a]** Rather than ending when a mission is completed, every experience becomes an opportunity for **reflection, learning, and continuous improvement** [ACN-M04 Civic Operating Loop].

**[LIS-M01b]** The platform should become **wiser with every completed mission** [ACN-M19 preservation, CKLS-001].

**[LIS-M01c]** LIS implements CKLS **lessons learned** as a **living operational system** — not a post-mortem checkbox [CKLS-M09].

---

## LIS-M02 — Guiding Principle

**[LIS-M02]**

> **Every mission should leave behind more wisdom than work.**

**[LIS-M02a]** Communities should **never repeat avoidable mistakes** [Mission Library MDS-M20, Experience Playbook EEOS-M17].

**[LIS-M02b]** Complementary to ACN execution mantra: **Learning before perfection** — progress over polish [ACN-M06].

---

## LIS-M03 — Learning Philosophy

**[LIS-M03]** **Completion is not the end.** Reflection is the **final phase of every mission** [ACN-M08 Action Cycle: Reflection → Knowledge → Legacy].

**[LIS-M03a]** The platform helps communities ask:

- What happened?
- Why did it happen?
- What surprised us?
- What should we keep doing?
- What should we change?

**[LIS-M03b]** Reflection should be **constructive rather than critical** [LIS-M05, CFS-M14 healthy accountability].

**[LIS-M03c]** Every completed mission is an **investment in future communities** [LIS-M16 Improvement Graph].

---

## LIS-M04 — Learning Lifecycle

**[LIS-M04]** Every completed mission follows:

```text
Mission Complete
        ↓
Reflection
        ↓
Lessons Captured
        ↓
Knowledge Organized
        ↓
Playbooks Updated
        ↓
Recommendations Created
        ↓
Future Missions Improved
```

**[LIS-M04a]** Learning becomes **part of the operational cycle** — not optional admin [ACN-M08, EOS-001 mission closeout].

**[LIS-M04b]** Triggers on mission status `completed` [EOS-001] — prompts before archive [ACN-M26 MOR finalization].

---

## LIS-M05 — Reflection Framework

**[LIS-M05]** Every mission encourages reflection with suggested questions:

| Question | Focus |
|----------|-------|
| What went well? | Strengths to repeat |
| What challenges did we encounter? | Honest assessment |
| What surprised us? | Unexpected learning |
| What decisions proved valuable? | Links to Decision Graph [CDS-M16] |
| What would we do differently? | Improvement seeds |
| What should future organizers know? | Direct advice |

**[LIS-M05a]** **Constructive rather than critical** — no blame culture [ACN-M14, CFS-001].

**[LIS-M05b]** Individual and team reflections aggregate into mission-level synthesis [LIS-M06].

---

## LIS-M06 — Community Reflection

**[LIS-M06]** Communities reflect **together**:

| Format | Context |
|--------|---------|
| Mission debrief | Core team |
| Volunteer discussion | Broad participation [VDS-001] |
| Leadership review | TWG-001, CCN-001 |
| Participant feedback | Inclusive input |
| Partner feedback | SCN-001 collaborations |

**[LIS-M06a]** **Shared reflection often reveals insights individuals miss** [CCNET-001 discussions].

**[LIS-M06b]** Collaborative reflection supported — async and live [TWG-001 working groups].

---

## LIS-M07 — Lessons Learned

**[LIS-M07]** Lessons are **structured entities**:

| Field | Purpose |
|-------|---------|
| Title | Short name |
| Description | Full lesson |
| Context | When/where it applies |
| Recommendation | Actionable guidance |
| Related mission | Source mission [MDS-001] |
| Related community | Owning community |
| Tags | Discovery [LIS-M12] |
| Supporting evidence | Stories, data [CST-001, CIIS-001] |
| Future applicability | Scope of reuse |

**[LIS-M07a]** Lessons become **searchable knowledge** [CKLS-001, LIS-M12 Learning Library].

**[LIS-M07b]** Orchestrator: `captureLesson(missionId, payload)` · append-only edits with version history.

---

## LIS-M08 — Playbook Updates

**[LIS-M08]** Every reflection asks:

- Should an existing playbook be improved? [EEOS-M17, CKLS-M07]
- Should a new playbook be created?
- Should a checklist change? [EOS-001]
- Should templates be updated? [MDS-M20 Mission Library]

**[LIS-M08a]** Communities **continuously refine knowledge** — playbook **version history** preserved [LIS-BG].

**[LIS-M08b]** Orchestrator: `proposePlaybookUpdate(lessonId, playbookId, changes)`.

---

## LIS-M09 — Improvement Recommendations

**[LIS-M09]** Recommendations may include:

Better communication · Different volunteer structure [VDS-001] · Earlier planning [MDS-001] · Improved logistics [CCS-001] · Additional training [CKLS-001] · Resource improvements · Leadership development [PGL-001]

**[LIS-M09a]** Recommendations help **future organizers succeed** — surfaced in Mission Design [MDS-M11] and Daily Operations Brief [EOS-M17] when relevant.

**[LIS-M09b]** Track **adoption** — which recommendations were applied [LIS-M10 dashboard].

---

## LIS-M10 — Community Learning Dashboard

**[LIS-M10]** Every community receives a **Learning Dashboard**:

- Lessons collected
- Playbooks updated
- Recommendations adopted
- Reflection participation
- Knowledge growth over time

**[LIS-M10a]** Communities **visibly become more experienced** — growth narrative, not ranking [CCN-M01, CIS-001 non-ranking ethics].

**[LIS-M10b]** Route: `/community/[slug]/learning` · Widget in Community Command Center [CCC-001].

---

## LIS-M11 — Cross-Community Learning

**[LIS-M11]** Lessons **spread across the network** [SCN-001]:

| Example | Spread |
|---------|--------|
| Campus improves orientation | Other campuses benefit |
| County develops food drive | Other counties reuse model |
| Experience Playbook refined | Statewide adoption [EEOS-M17] |
| Mission Library entry updated | Mission Design templates [MDS-M20] |

**[LIS-M11a]** **Knowledge compounds statewide** — opt-in sharing [CCE-001, CKLS-001 governance KDG-001].

**[LIS-M11b]** Connects to **Improvement Graph** [LIS-M16] — trace adoption paths.

---

## LIS-M12 — Learning Library

**[LIS-M12]** Searchable library — every lesson contributes:

Search by: Mission type · Community · Topic · Challenge · Recommendation · Tags

**[LIS-M12a]** **Learning becomes discoverable** — integrated with Community Brain search [CKLS-M09].

**[LIS-M12b]** Route: `/learn` · `/community/[slug]/lessons` · Orchestrator: `searchLearningLibrary(query, filters?)`.

---

## LIS-M13 — Continuous Improvement Cycle

**[LIS-M13]** Platform encourages:

```text
Design → Execute → Reflect → Learn → Improve → Repeat
```

**[LIS-M13a]** This cycle is **part of every mission** [ACN-M04 Civic Operating Loop, ACN-M08 Action Cycle].

**[LIS-M13b]** Mission Design [MDS-001] reads prior lessons · Execution [EOS-001] captures mid-mission notes · LIS closes the loop at completion.

---

## LIS-M14 — Future AI Assistance

**[LIS-M14]** Future AI may **support learning without replacing human reflection**:

| Capability | Role |
|------------|------|
| Summarize reflections | Synthesis aid |
| Identify recurring themes | Pattern detection |
| Recommend playbook updates | Draft suggestions |
| Detect common challenges | Advisory [CIS-001] |
| Connect similar lessons | Learning Library links |
| Suggest improvements | Non-binding |

**[LIS-M14a]** **Advisory only** — communities own interpretation [ACN-M06, OPIS-001 boundaries].

---

## LIS-M15 — Not Military AAR

**[LIS-M15]** LIS **supersedes** "After Action Review" terminology [AAR-001] — universal **learning and improvement** language [LIS-M03].

**[LIS-M15a]** No blame-oriented debrief culture · No mandatory military-style formats · **Constructive learning** for civic and campus communities [ACN-M14, CCN-001].

**[LIS-M15b]** ACN constitutional principle **review and learn** [ACN-M04] implements through **LIS-001** — principle unchanged, module renamed.

---

## LIS-M16 — Improvement Graph

**[LIS-M16]** **Signature feature.** The **final graph** completing the platform's learning architecture. Instead of **isolated lessons**, the platform understands **how improvements spread across the network**.

**[LIS-M16a]** Example — training improvement:

```text
Campus Welcome Week
        │
   Reflection
        │
  identified
        │
Need Earlier Volunteer Training
        │
    updated
        │
Experience Playbook
        │
  adopted by
        │
   12 Campuses
        │
   improved
        │
Volunteer Retention
```

**[LIS-M16b]** Example — mission reuse:

```text
Food Drive
        │
Lesson Learned
        │
  added to
        │
Mission Library
        │
  reused by
        │
 Five Counties
        │
  created
        │
Regional Initiative
```

**[LIS-M16c]** The Improvement Graph answers:

- *Which lessons had the greatest statewide impact?*
- *Which playbooks are improving over time?*
- *Which communities develop innovations others adopt?*
- *How has a mission evolved over multiple years?*
- *What improvements became standard practice across Arkansas?*

**[LIS-M16d]** Edge types: `reflected`, `identified`, `updated`, `adopted_by`, `improved`, `added_to`, `reused_by`, `created`, `became_standard`.

**[LIS-M16e]** Route: `/learn/improvements` · Orchestrator: `getImprovementGraph(filters?)`.

**[LIS-M16f]** Completes the **learning loop** with Community Brain, Mission Library, Experience Playbooks, Decision Graph, Impact Chain, and Community Legacy [LIS-M17].

---

## LIS-M17 — Learning Architecture Stack

**[LIS-M17]** LIS completes platform learning architecture:

| Layer | System | Role |
|-------|--------|------|
| Knowledge | Community Brain [CKLS-001] | What we know |
| Templates | Mission Library [MDS-M20] | Proven missions |
| Gatherings | Experience Playbooks [EEOS-M17] | Proven experiences |
| Governance | Decision Graph [CDS-M16] | Why we decided |
| Outcomes | Impact Chain [CIIS-M16] | What changed |
| History | Community Legacy [CLS-001] | What endures |
| Stories | Story Atlas [CST-M16] | Human experience |
| **Spread** | **Improvement Graph [LIS-M16]** | **How wisdom propagates** |

**[LIS-M17a]** Platform doesn't just preserve the past — it **continuously evolves** because every community contributes to making the next mission better.

---

## LIS-M18 — Platform Integrations

**[LIS-M18]** LIS integrates:

| System | Integration |
|--------|-------------|
| ACN-M04 / ACN-M08 | Civic Operating Loop, Action Cycle reflection |
| ACN-M26 MOR | Lessons as MOR section [LIS-M07] |
| MDS-001 / MDS-M20 | Design reads lessons; Library updates |
| EOS-001 | Mission complete trigger |
| EEOS-001 | Experience Playbook updates |
| VDS-001 | Volunteer reflection |
| CFS-001 | Commitment reflection feed |
| CDS-001 | Decision outcomes → lessons |
| CIIS-001 | Impact reflection synthesis |
| CST-001 | Stories as evidence |
| CKLS-001 | Lessons learned implementation |
| CLS-001 | Long-term improvement history |
| SCN-001 | Cross-community spread |
| CIS-001 | Theme detection advisory |
| IOS-001 | Initiative-level learning |
| CCC-001 | Learning Dashboard widget |

---

## LIS-M19 — V1 Scope

**[LIS-M19]** Step 5.12 deliverables:

| Capability | V1 |
|------------|-----|
| Learning & Improvement philosophy | ✅ Documented |
| Learning lifecycle | ✅ Spec |
| Reflection framework | ✅ Spec |
| Lessons + playbook updates | ✅ Spec |
| Community Learning Dashboard | ✅ Spec |
| Cross-community learning | ✅ Spec |
| Improvement Graph architecture | ✅ Spec |
| Learning architecture stack | ✅ Spec |
| Learning UI implementation | Stub |
| Live graph traversal | v1.1 |
| AI theme detection | Future [LIS-M14] |

---

## LIS-BG — Burt Implementation Guidance

**[LIS-BG]** Implementation should:

1. **Treat lessons as structured entities** [LIS-M07]
2. **Connect lessons to MOR** [ACN-M26, LIS-M07]
3. **Support collaborative reflection** [LIS-M06]
4. **Maintain playbook version history** [LIS-M08]
5. **Integrate with Community Brain and Legacy** [CKLS-001, CLS-001]
6. **Design search from the beginning** [LIS-M12]
7. **Implement Improvement Graph as edge store** [LIS-M16]
8. **Trigger reflection on mission complete** — gentle prompts, not blockers [LIS-M04]

**[LIS-BG-a]** Recommended structure:

```
src/lib/learning/captureReflection.ts
src/lib/learning/captureLesson.ts
src/lib/learning/proposePlaybookUpdate.ts
src/lib/learning/getImprovementGraph.ts
src/lib/learning/searchLearningLibrary.ts
src/components/learning/ReflectionWizard.tsx
src/components/learning/CommunityLearningDashboard.tsx
src/components/learning/ImprovementGraph.tsx
data/registry/learning-improvement-system.json
```

**[LIS-BG-b]** Database: `DB-LIS` · tables: `reflections`, `lessons`, `improvement_recommendations`, `playbook_updates`, `improvement_graph_edges`.

---

## AC-059 — Acceptance Criteria

Step 5.12 is complete when:

- [x] **[AC-059a]** Learning & Improvement philosophy documented. `[LIS-M01, LIS-M02, LIS-M03, LIS-M15]`
- [x] **[AC-059b]** Reflection framework established. `[LIS-M05, LIS-M06]`
- [x] **[AC-059c]** Lesson management and playbook updates defined. `[LIS-M07, LIS-M08, LIS-M09]`
- [x] **[AC-059d]** Cross-community learning incorporated. `[LIS-M11, LIS-M12]`
- [x] **[AC-059e]** Improvement Graph architecture specified. `[LIS-M16, LIS-M17]`
- [x] **[AC-059f]** Burt has blueprint for continuous organizational learning. `[LIS-BG, learning-improvement-system.json]`

---

**Next Step:** Phase 6 — Intelligence Layer

*Trace: Mission completes → reflection invited → lessons captured → playbooks updated → recommendations created → Improvement Graph traces spread → next mission designs smarter → platform grows wiser*
