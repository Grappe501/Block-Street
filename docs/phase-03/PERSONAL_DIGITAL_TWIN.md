# Personal Digital Twin

**Document ID:** PHASE-003.12  
**Artifact:** `PERSONAL_DIGITAL_TWIN.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 3 — People & Relationship System

> **The platform should understand participants well enough to serve them better, while always respecting their privacy and autonomy.**

This is where everything begins to **think** — not a graph for technology's sake, but a **living model of each participant**. The participant is not reduced to data. The Digital Twin is the platform's understanding of how that person interacts with communities, relationships, and opportunities.

**Builds On:** [Participant Identity Doctrine](PARTICIPANT_IDENTITY_DOCTRINE.md) · [Personal Relationship Network](PERSONAL_RELATIONSHIP_NETWORK.md) · [Civic Journey Timeline](CIVIC_JOURNEY_TIMELINE.md) · [Personal Growth & Leadership](PERSONAL_GROWTH_LEADERSHIP.md) · [Communication & Attention Management](COMMUNICATION_ATTENTION_MANAGEMENT.md) · [Arkansas Relationship Graph](../phase-02/ARKANSAS_RELATIONSHIP_GRAPH.md) · [Arkansas Digital Twin Initialization](../phase-02/ARKANSAS_DIGITAL_TWIN_INITIALIZATION_PLAN.md)

**Live spec:** `data/registry/personal-digital-twin.json`

**Distinction:** [Arkansas Digital Twin ADT-001] models the **state organizing landscape**. [Personal Digital Twin PDT-001] models **each participant's journey within it**.

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| PDT-M01 | Purpose |
| PDT-M02 | Guiding principle |
| PDT-M03 | Philosophy |
| PDT-M04 | Core components |
| PDT-M05 | Platform understanding questions |
| PDT-M06 | Relationship graph |
| PDT-M07 | Personalization |
| PDT-M08 | Privacy |
| PDT-M09 | Explainability |
| PDT-M10 | Continuous learning |
| PDT-M11 | Future AI integration |
| PDT-M12 | Participant Context Engine architecture |
| PDT-M13 | Composition not duplication |
| PDT-M14 | Arkansas twin integration |
| PDT-M15 | V1 scope |
| PDT-BG | Burt implementation guidance |
| AC-031 | Step 3.12 acceptance criteria |

---

## PDT-M01 — Purpose

**[PDT-M01]** The Personal Digital Twin is the platform's **internal model of a participant's organizing journey**.

**[PDT-M01a]** It connects identity, relationships, communities, participation, growth, leadership, and preferences into one **continuously evolving representation**.

**[PDT-M01b]** The Digital Twin exists to help the platform **provide better experiences** — not to replace human judgment [TPS-M15, OM-L1].

**[PDT-M01c]** Terminology: **Personal Digital Twin** (not "Participant Knowledge Graph" or "user profile database").

**[PDT-M01d]** Step 3.12 defines **how all prior People System modules connect** — people, counties, schools, relationships, growth, timelines.

---

## PDT-M02 — Guiding Principle

**[PDT-M02]**

> **The platform should understand participants well enough to serve them better, while always respecting their privacy and autonomy.**

**[PDT-M02a]** Understanding serves **the participant first** — not advertisers, not surveillance, not ranking [SEC-001, CRA-M03].

**[PDT-M02b]** Complementary to Attention Budget [CAM-M13]: better understanding enables **fewer, better** communications — not more.

---

## PDT-M03 — Philosophy

**[PDT-M03]** The Digital Twin is **not**:

| Not this | Why |
|----------|-----|
| A profile | Profile is what others see [PHQ-001]; twin is internal model |
| Surveillance | No hidden scoring or monitoring [TPS-M02] |
| Scoring | No competitive rankings [CRA-M03, PGL-M05] |

**[PDT-M03a]** It **is** a structured understanding of:

| Dimension | Question answered |
|-----------|-------------------|
| **Who** | Personal identity, mission, journey stage |
| **Where** | Communities they belong |
| **Who they know** | Relationship network |
| **How they participate** | Activity, volunteer, leadership |
| **How they grow** | Skills, learning, mentorship |
| **What's next** | Opportunities that may help |

**[PDT-M03b]** Goal is **assistance — not prediction**. Recommendations suggest; participants decide [PDT-M09].

---

## PDT-M04 — Core Components

**[PDT-M04]** The Digital Twin **composes** information already defined elsewhere — it does not duplicate [PDT-M13]:

### Identity

Personal identity · Mission [PRM-001] · Journey stage [JRN-001] · Communities [PEP-M08] · Skills · Interests · Privacy settings [SEC-001] · Communication preferences [CAM-001]

*Source: PEP-001, PHQ-001, participant-identity.json*

### Relationships

People invited · Mentors · Collaborators · Volunteer partners · Committee members · Long-term relationships · Relationship history

*Source: NET-001, PRN-M12, RGE-001, Trust Graph [PRN-M16]*

### Communities

Campus · County · Committees · Projects · Volunteer teams · Future organizations

*Source: CID-001, REG-001/002, Phase 4*

### Activity

Events · Volunteer service · Projects · Learning · Leadership · Recognition · Timeline

*Source: CJT-001, EVT-001, VOL-001, CRA-001*

### Growth

Journey progression · Leadership development · Skills · Learning · Community impact · Mentorship

*Source: PGL-001, Growth Graph [PGL-M13], JRN-M10 orchestrator*

### Preferences

Notification settings · Communication channels · Volunteer interests · Project interests · Learning preferences · Future personalization

*Source: CAM-001, Trust Center [SEC-001]*

**[PDT-M04a]** Each component is a **view** over canonical stores — twin holds references and derived summaries only.

---

## PDT-M05 — Platform Understanding Questions

**[PDT-M05]** The Digital Twin helps answer:

| Question | Used for |
|----------|----------|
| What communities does this participant belong to? | HQ, Command Center widgets |
| What leadership experiences have they had? | Growth narrative, recommendations |
| Who do they collaborate with most often? | Network insights, mentorship |
| What skills are they developing? | Learning pathways [PGL-M08] |
| What opportunities align with their interests? | Mission Board, volunteer matching |
| Where might they enjoy contributing next? | Explainable suggestions [PDT-M09] |

**[PDT-M05a]** These questions power **personalization** — never opaque scoring [PDT-M09].

---

## PDT-M06 — Relationship Graph

**[PDT-M06]** Internally, the Digital Twin understands **connections** — extending [REL-M01] to person-centric traversal:

```
Participant
│
├── attends → Institution
├── lives_in → County
├── invited → Participant
├── mentors → Participant
├── volunteers_for → Project
├── belongs_to → Committee
├── attended → Event
├── learned → Skill
└── supports → Community
```

**[PDT-M06a]** The graph **evolves continuously** through participation — not batch-updated [PDT-M10].

**[PDT-M06b]** Person node connects to [Arkansas Digital Twin ADT-001] landscape — participant edges overlay state graph [REL-M03].

**[PDT-M06c]** Trust Graph [PRN-M16] is a **relationship-quality overlay** — does not rank participants.

**[PDT-M06d]** Civic Journey Timeline [CJT-001] provides **temporal narrative** over graph events — complementary, not duplicate.

---

## PDT-M07 — Personalization

**[PDT-M07]** The Digital Twin enables personalization of:

| Surface | Twin inputs |
|---------|-------------|
| **Mission Board** [PCC-M09] | Mission, stage, gaps [JRN-M10] |
| **Morning Brief** [PCC-M17] | Recent activity, Memory Moments [CJT-M12], CAM prefs |
| **Recommended events** | Communities, interests, geography |
| **Suggested committees** | Skills, volunteer history |
| **Volunteer opportunities** | Interests, county, campus |
| **Mentorship** | Growth Graph, relationship gaps |
| **Learning** | PGL domains, pathway progress |
| **Community introductions** | Trust Graph, shared communities |

**[PDT-M07a]** Every recommendation remains **explainable** [PDT-M09] — no black-box ranking.

**[PDT-M07b]** Full Recommendation Engine spec: Step 3.13 — PDT provides **context**; 3.13 provides **recommendation logic**.

---

## PDT-M08 — Privacy

**[PDT-M08]** Participants remain in control [SEC-001, TPS-M07]:

**[PDT-M08a]** The Digital Twin should **never expose private information** to other participants without permission.

**[PDT-M08b]** The twin exists **primarily to improve the participant's own experience** — not as a shared dossier.

**[PDT-M08c]** Visibility engine [TPS-M08] gates every cross-participant query — twin assembly respects viewer context.

**[PDT-M08d]** Internal model may include private reflections [CJT-M06] — never surfaced to others without explicit share.

---

## PDT-M09 — Explainability

**[PDT-M09]** Whenever recommendations are made, participants should **understand why**:

| Example explanation |
|---------------------|
| "We suggested this event because you're active in environmental projects." |
| "This committee may interest you because you've volunteered in similar activities." |
| "Your Morning Brief includes county news because you're active in Pulaski County." |

**[PDT-M09a]** Recommendations should **never feel mysterious** — `reason` field on every suggestion [CAM-M06 explainable pattern].

**[PDT-M09b]** Explainability extends to AI future [PDT-M11] — AI cites twin facts, not hidden scores.

**[PDT-M09c]** Participant may **dismiss** recommendations — feedback improves future suggestions without penalty.

---

## PDT-M10 — Continuous Learning

**[PDT-M10]** The Digital Twin **evolves through participation**:

| Action | Twin update |
|--------|-------------|
| Joining communities | New community edges |
| Volunteering | Activity + growth signals |
| Learning | Skill edges, PGL progress |
| Building relationships | PRN graph expansion |
| Organizing events | Leadership signals |
| Mentoring | Relationship + growth |

**[PDT-M10a]** Growth occurs **naturally** — no manual twin refresh; event-driven updates [CJT-M14, JRN-M10].

**[PDT-M10b]** Derived journey stage **recomputed** from twin state — not stored as sole source of truth [JRN-M10a].

---

## PDT-M11 — Future AI Integration

**[PDT-M11]** Future AI assistants may use the Digital Twin to:

- Summarize activity · Recommend opportunities · Identify mentors
- Suggest leadership pathways · Support onboarding · Generate Morning Briefs

**[PDT-M11a]** All AI interactions respect **participant privacy and platform governance** [TPS-M15].

**[PDT-M11b]** AI reads twin via **Participant Context Engine** [PDT-M12] — never raw database scraping.

**[PDT-M11c]** AI opt-in required; twin facts exposed to AI are **subset of participant-visible data** unless expanded consent.

**[PDT-M11d]** AI must **reduce noise** — Attention Budget applies to AI-generated communications [CAM-M15b].

---

## PDT-M12 — Participant Context Engine Architecture

**[PDT-M12]** **Signature architecture:** Rather than every feature independently querying dozens of tables, build a **Participant Context Engine**.

Its responsibility is to answer one question:

> **"What should the platform know right now to serve this participant well?"**

**[PDT-M12a]** The Context Engine assembles a **temporary session context** from:

| Source | Context contributed |
|--------|---------------------|
| Registry [REG-001/002] | Geographic + institution landscape |
| Personal Relationship Network [NET-001] | People, invites, Trust Graph |
| Civic Journey Timeline [CJT-001] | Recent milestones, Memory Moments |
| Growth Graph [PGL-M13] | Domains, skills, mentorship |
| Communication preferences [CAM-001] | Channels, budget, quiet hours |
| Current communities | Campus, county, committees |
| Recent activity | Events, volunteer, leadership signals |
| Journey orchestrator [JRN-M10] | Derived stage, next-step gaps |

**[PDT-M12b]** Orchestrator: `buildParticipantContext(participantId, sessionOptions?)` → `ParticipantContext`

**[PDT-M12c]** Benefits:

| Benefit | Why |
|---------|-----|
| **Faster personalization** | Single assembly per request/session |
| **Consistent recommendations** | Same understanding everywhere |
| **Simpler feature development** | Features consume context, not 12 tables |
| **Better AI integration** | Clean context boundary for LLM |
| **Reduced duplication** | Business logic centralized [PDT-M13] |

**[PDT-M12d]** Context is **ephemeral** — assembled on demand, not a duplicate participant record.

**[PDT-M12e]** Context respects **visibility** — private fields omitted when context used for cross-participant features.

**[PDT-M12f]** Cache TTL short (session-scoped) — invalidates on meaningful participant events.

---

## PDT-M13 — Composition Not Duplication

**[PDT-M13]** Build the Digital Twin as **composition of existing data** — not duplication:

```
ParticipantContext
    ← identityService.get(participantId)
    ← networkService.getGraph(participantId)
    ← timelineService.recent(participantId)
    ← growthService.getNarrative(participantId)
    ← communicationService.getPreferences(participantId)
    ← journeyOrchestrator.derive(participantId)
    → derived summaries ONLY where needed for performance
```

**[PDT-M13a]** Use **relationships rather than redundant fields** [REL-M01, REL-M13].

**[PDT-M13b]** Denormalized caches (e.g. journey stage) must be **rebuildable** from source — never sole authority.

**[PDT-M13c]** No `participants_skills_json` blob — skills are graph edges or registry refs [PGL-M06].

---

## PDT-M14 — Arkansas Twin Integration

**[PDT-M14]** Personal Digital Twin **sits within** Arkansas Digital Twin [ADT-001]:

| Layer | Scope |
|-------|-------|
| **ADT-001** | State, counties, institutions, community landscape |
| **PDT-001** | Individual participant overlay — edges into ADT nodes |

**[PDT-M14a]** Participant `attends → Institution` connects personal twin to institution node initialized by [ADT-M06].

**[PDT-M14b]** County hub personalization [OIS-M11] combines ADT county status + PDT participant activity.

**[PDT-M14c]** No participant creates geography — they **activate** existing ADT nodes [ADT-M02].

---

## PDT-M15 — V1 Scope

**[PDT-M15]** Design complete in Step 3.12; implementation post-V1 core:

| Deliverable | V1 |
|-------------|-----|
| Philosophy + Context Engine spec | ✅ this document |
| Component taxonomy + graph model | ✅ JSON |
| `buildParticipantContext()` stub | minimal — identity + network + journey |
| Full graph traversal + all personalization | v1.1+ |
| AI context boundary | v1.2+ |

**[PDT-M15a]** Jul 12/14: Command Center uses **simple context** — registration data + invite count + county/campus — not full twin engine.

**[PDT-M15b]** Step 3.13 Recommendation Engine **consumes** ParticipantContext — does not rebuild it.

---

## PDT-BG — Burt Implementation Guidance

**[PDT-BG]** Implementation should:

1. **Build twin as composition** — no duplicate participant tables [PDT-M13]
2. **Use relationships not redundant fields** — graph edges [REL-M01, PDT-M06]
3. **Support explainable recommendations** — `reason` on every suggestion [PDT-M09]
4. **Maintain strict privacy boundaries** — visibility engine on all exports [PDT-M08]
5. **Allow future capabilities** without changing core model — Context Engine API stable [PDT-M12]

**[PDT-BG-a]** Recommended file structure:

```
src/lib/context/buildParticipantContext.ts
src/lib/context/ParticipantContext.ts
src/lib/context/explainRecommendation.ts
src/lib/twin/composeTwinView.ts
```

**[PDT-BG-b]** No feature ships personalization without consuming `buildParticipantContext()` — production gate extension.

**[PDT-BG-c]** `ParticipantContext` type documents all assembled fields — single contract for PCC, recommendations, AI.

---

## AC-031 — Acceptance Criteria

Step 3.12 is complete when:

- [x] **[AC-031a]** Personal Digital Twin concept documented. `[PDT-M01, PDT-M03]`
- [x] **[AC-031b]** Core information domains defined. `[PDT-M04]`
- [x] **[AC-031c]** Personalization and explainability principles established. `[PDT-M07, PDT-M09]`
- [x] **[AC-031d]** Privacy boundaries reinforced. `[PDT-M08]`
- [x] **[AC-031e]** Participant Context Engine architecture specified. `[PDT-M12]`
- [x] **[AC-031f]** Arkansas twin integration documented. `[PDT-M14]`
- [x] **[AC-031g]** Burt has blueprint for participant-centric intelligence. `[PDT-BG, personal-digital-twin.json]`

---

**Next Step:** 3.13 — Recommendation Engine

*Trace: Participation → twin evolves → Context Engine assembles → explainable suggestion → participant chooses → trust preserved*
