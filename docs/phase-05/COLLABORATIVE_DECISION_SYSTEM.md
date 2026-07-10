# Collaborative Decision System

**Document ID:** PHASE-005.7  
**Artifact:** `COLLABORATIVE_DECISION_SYSTEM.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 5 — Action Operating System  
**Acronym:** CDS

> **Good decisions come from informed participation, thoughtful discussion, and transparent reasoning.**

This is **not a voting system**. It is an **Organizational Decision System** — supporting discussion, consensus-building, recommendations, and—when appropriate—formal voting. The emphasis is on **making thoughtful decisions**, not just counting votes.

**Requirement:** CDS-001 · **Supersedes:** DEC-001 (Decision System) · **Governed by:** [Action Constitution ACN-001](ACTION_CONSTITUTION.md)

**Builds On:** [Community Knowledge & Learning CKLS-001](../phase-04/COMMUNITY_KNOWLEDGE_LEARNING_SYSTEM.md) · [Community Constitution CCN-001](../phase-04/COMMUNITY_CONSTITUTION.md) · [Mission Design System MDS-001](MISSION_DESIGN_SYSTEM.md) · [Execution Operating System EOS-001](EXECUTION_OPERATING_SYSTEM.md) · [Initiative Operating System IOS-001](INITIATIVE_OPERATING_SYSTEM.md)

**Live spec:** `data/registry/collaborative-decision-system.json`

**Required reading for Burt.**

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| CDS-M01 | Purpose |
| CDS-M02 | Guiding principle |
| CDS-M03 | Decision philosophy |
| CDS-M04 | Decision lifecycle |
| CDS-M05 | Decision types |
| CDS-M06 | Decision Record |
| CDS-M07 | Proposal System |
| CDS-M08 | Discussion Space |
| CDS-M09 | Consensus Support |
| CDS-M10 | Voting (optional) |
| CDS-M11 | Decision History |
| CDS-M12 | Implementation Tracking |
| CDS-M13 | Decision Review |
| CDS-M14 | Transparency |
| CDS-M15 | Future AI assistance |
| CDS-M16 | Decision Graph |
| CDS-M17 | Platform graph stack |
| CDS-M18 | Platform integrations |
| CDS-M19 | V1 scope |
| CDS-BG | Burt implementation guidance |
| AC-054 | Step 5.7 acceptance criteria |

---

## CDS-M01 — Purpose

**[CDS-M01]** The **Collaborative Decision System (CDS)** provides a **structured process** for communities to discuss ideas, evaluate options, document reasoning, and make decisions in a **transparent and organized manner**.

**[CDS-M01a]** The goal is **not simply to reach decisions** — the goal is to **preserve the knowledge and reasoning behind them** [CKLS-M08 decision library, ACN-M19 preserve decisions].

**[CDS-M01b]** CDS treats **decisions as first-class entities** — separate from proposals, discussions, and outcomes [CDS-BG].

**[CDS-M01c]** Future organizers **inherit wisdom** rather than repeating debates [CDS-M03, CDS-M11].

---

## CDS-M02 — Guiding Principle

**[CDS-M02]**

> **Good decisions come from informed participation, thoughtful discussion, and transparent reasoning.**

**[CDS-M02a]** The platform should encourage **understanding before agreement** [CDS-M08 discussion space].

**[CDS-M02b]** Voting is **one possible method** — not the default architecture [CDS-M10].

---

## CDS-M03 — Decision Philosophy

**[CDS-M03]** Communities should remember:

| Element | Preserved |
|---------|-----------|
| The problem | Why we considered this |
| The options considered | Alternatives on record |
| The discussion | Questions, concerns, research |
| The decision | What was chosen |
| The reasoning | Why it was chosen |
| The outcomes | What happened next |

**[CDS-M03a]** Each stage contributes to **institutional knowledge** [Community Brain CKLS-M01].

**[CDS-M03b]** CDS implements the CKLS **decision library** as a **living operational system** — not static meeting minutes [CKLS-M08].

---

## CDS-M04 — Decision Lifecycle

**[CDS-M04]** Every significant decision follows a lifecycle:

```text
Question
        ↓
Discussion
        ↓
Research
        ↓
Proposal
        ↓
Review
        ↓
Decision
        ↓
Implementation
        ↓
Evaluation
        ↓
Archive
```

**[CDS-M04a]** Each stage contributes to institutional knowledge [CDS-M06 Decision Record].

**[CDS-M04b]** Lifecycle stages are **configurable** — communities may skip or combine stages based on governance style [CDS-M09].

---

## CDS-M05 — Decision Types

**[CDS-M05]** Flexible architecture — examples:

| Type | Context |
|------|---------|
| Community Planning | Strategic direction |
| Mission Approval | Launch or modify mission [MDS-001] |
| Project Direction | Execution choices [EOS-001] |
| Budget Recommendations | Where applicable |
| Leadership Selection | Where appropriate [CCN-001] |
| Policy Recommendations | Community norms |
| Meeting Decisions | Working group outcomes |
| Event Planning | Experience choices [EEOS-001] |
| Resource Allocation | People, equipment [CCS-001] |
| Strategic Planning | Long-horizon choices |
| Initiative Participation | Join or scope contribution [IOS-001] |

**[CDS-M05a]** System remains flexible for **future decision types** [CDS-BG].

---

## CDS-M06 — Decision Record

**[CDS-M06]** Every decision generates a **permanent record**:

| Field | Purpose |
|-------|---------|
| Title | Human-readable name |
| Summary | One-paragraph overview |
| Purpose | Why this decision existed |
| Community | Owning community |
| Participants | Who was involved |
| Decision type | Category [CDS-M05] |
| Date | When decided |
| Related mission | Link to mission [MDS-001] |
| Related project | Link to project [EOS-001] |
| Outcome | What was decided |
| Status | Active, implemented, superseded, archived |

**[CDS-M06a]** Decision records become part of the **Community Brain** [CKLS-M01, CKLS-M08].

**[CDS-M06b]** Records are **append-only** — superseded decisions retain history with links to replacements [CDS-M11].

---

## CDS-M07 — Proposal System

**[CDS-M07]** Every proposal contains:

| Section | Content |
|---------|---------|
| Problem statement | What needs solving |
| Background | Context and history |
| Objectives | What success looks like |
| Options | Alternatives considered |
| Advantages | Benefits per option |
| Challenges | Risks and tradeoffs |
| Community impact | Who is affected |
| Resources required | What is needed |
| Recommendation | Proposer's suggested path |
| Supporting documents | Research, attachments |

**[CDS-M07a]** The platform **encourages thoughtful proposals before action** [MDS-M02 clarity before action].

**[CDS-M07b]** Proposals are **separate entities** from decisions [CDS-BG] — a proposal may fail, be revised, or spawn multiple decisions.

---

## CDS-M08 — Discussion Space

**[CDS-M08]** Every proposal has a dedicated **discussion area** connected to the proposal — not a disconnected thread [CCNET-001].

**[CDS-M08a]** Participants may:

- Ask questions
- Offer suggestions
- Share research
- Express concerns
- Recommend improvements

**[CDS-M08b]** Discussions **remain connected** to the proposal and flow into the Decision Record [CDS-M06].

**[CDS-M08c]** Integrates **Conversation Graph** [CCNET-M13] — discussions are nodes, not ephemeral chat.

---

## CDS-M09 — Consensus Support

**[CDS-M09]** Communities may choose different governance approaches:

| Method | When used |
|--------|-----------|
| Consensus | Full agreement sought |
| General agreement | Broad support, minor dissent noted |
| Formal vote | Community chooses voting [CDS-M10] |
| Leadership decision | Delegated authority [CCN-001] |
| Working group recommendation | Expert subgroup proposes |

**[CDS-M09a]** The platform **supports multiple governance styles without imposing one** [CCN-M01 equal standing, local autonomy].

**[CDS-M09b]** Method is recorded in the Decision Record [CDS-M06] for transparency [CDS-M14].

---

## CDS-M10 — Voting (Optional)

**[CDS-M10]** Where communities **choose** to vote, the system supports:

| Capability | Notes |
|------------|-------|
| Open voting | Visible participation |
| Anonymous voting | Where appropriate |
| Ranked options | Future enhancement |
| Advisory polling | Non-binding input |
| Participation tracking | Who voted, turnout |

**[CDS-M10a]** **Voting is only one possible decision method** [CDS-M02b] — not the architectural center.

**[CDS-M10b]** Vote results attach to Decision Record with full context — not isolated tallies [CDS-M06].

---

## CDS-M11 — Decision History

**[CDS-M11]** Communities preserve:

- Previous proposals
- Past discussions
- Related decisions
- Implementation outcomes
- Lessons learned

**[CDS-M11a]** Historical context **strengthens future decisions** [CKLS-M08, LIS-001].

**[CDS-M11b]** Searchable across community and—where permitted—statewide [SCN-001, CKLS-M09 searchable knowledge].

---

## CDS-M12 — Implementation Tracking

**[CDS-M12]** Once approved, decisions connect directly to:

| Target | Link |
|--------|------|
| Missions | `linkDecisionToMission` [MDS-001] |
| Projects | `linkDecisionToProject` [EOS-001] |
| Tasks | Execution follow-through |
| Teams | TWG-001 assignments |
| Timelines | TSOS-001 milestones |
| Knowledge | Playbooks, lessons [CKLS-001] |

**[CDS-M12a]** The platform tracks **whether decisions become action** [CFS-001 commitment follow-through].

**[CDS-M12b]** Unimplemented decisions surface in **Community Pulse** and accountability views [CCC-001, CIS-001].

---

## CDS-M13 — Decision Review

**[CDS-M13]** Communities should **periodically revisit** important decisions:

- Was the objective achieved?
- What changed?
- Should the decision be updated?
- What did we learn?

**[CDS-M13a]** Reflection **improves future governance** [ACN-M04 Civic Operating Loop].

**[CDS-M13b]** Review outcomes append to Decision Record — never overwrite [CDS-M06b].

---

## CDS-M14 — Transparency

**[CDS-M14]** Participants should understand:

| Question | Visible |
|----------|---------|
| Why does this decision exist? | Purpose + problem |
| Who participated? | Participants list |
| How was it reached? | Method [CDS-M09] |
| What evidence supported it? | Proposal + discussion |
| What happens next? | Implementation links [CDS-M12] |

**[CDS-M14a]** Transparency **strengthens trust** [CCN-001, TRUST graph signals].

---

## CDS-M15 — Future AI Assistance

**[CDS-M15]** Future AI may **inform discussion without making decisions**:

| Capability | Role |
|------------|------|
| Summarize discussions | Reduce re-reading |
| Identify similar past decisions | Decision Graph [CDS-M16] |
| Highlight unanswered questions | Discussion gaps |
| Suggest relevant playbooks | CKLS-001, EEOS-M17 |
| Identify affected communities | SCN-001 |
| Surface historical context | CKLS-M08, CLS-001 |

**[CDS-M15a]** **Advisory only** — preserves local decision-making [CCN-M01, IOS-M13].

---

## CDS-M16 — Decision Graph

**[CDS-M16]** **Signature feature.** Instead of storing **isolated decisions**, the platform understands **how decisions influence one another**.

**[CDS-M16a]** Example chain:

```text
Campus Welcome Proposal
        │
    approved
        │
    created
        │
     Mission
        │
   generated
        │
Volunteer Project
        │
   produced
        │
Experience Playbook
        │
  reused by
        │
Six Other Campuses
```

**[CDS-M16b]** Example impact:

```text
Decision
        │
   affected
        │
Three Communities
        │
   created
        │
  Two New Teams
        │
  launched
        │
Statewide Initiative
```

**[CDS-M16c]** The Decision Graph answers:

- *"Why do we organize Welcome Week this way?"*
- *"Which decision started this statewide initiative?"*
- *"What projects resulted from last semester's leadership retreat?"*
- *"Has another community already solved this problem differently?"*

**[CDS-M16d]** Transforms governance from **meeting minutes** into a **living map** of how ideas became action [CDS-M03].

**[CDS-M16e]** Graph edges include: `approved`, `created`, `generated`, `produced`, `reused_by`, `affected`, `launched`, `superseded`, `implemented_as`.

**[CDS-M16f]** Route: `/community/[slug]/decisions/graph` · Orchestrator: `getDecisionGraph(communityId, filters?)`.

---

## CDS-M17 — Platform Graph Stack

**[CDS-M17]** CDS completes another layer of platform graph architecture:

| Graph | Scope | Requirement |
|-------|-------|-------------|
| Relationship Graph | People & communities | REL-001 / PRN-001 |
| Trust Graph | Reliability signals | PRN-001 |
| Growth Graph | Leadership development | PGL-001 |
| Conversation Graph | Discussions | CCNET-M13 |
| Capability Graph | Skills & resources | CCE-001 |
| **Decision Graph** | **Governance & causality** | **CDS-M16** |

**[CDS-M17a]** Decision Graph **connects to** other graphs — decisions create missions (Capability), spawn teams (Relationship), generate conversations (Conversation).

---

## CDS-M18 — Platform Integrations

**[CDS-M18]** CDS integrates:

| System | Integration |
|--------|-------------|
| CKLS-001 / CKLS-M08 | Decision library implementation |
| CCN-001 | Local governance autonomy |
| MDS-001 | Mission approval decisions |
| EOS-001 | Project direction decisions |
| IOS-001 | Initiative participation decisions |
| EEOS-001 | Event planning decisions |
| TWG-001 | Team and working group decisions |
| TSOS-001 | Timeline milestones from decisions |
| CCNET-001 | Discussion transport |
| CIS-001 | Decision health, unimplemented alerts |
| CLS-001 | Decisions in living history |
| SCN-001 | Cross-community decision discovery |
| ACN-M19 | Preserve decisions in Civic Operating Loop |
| CFS-001 | Commitment follow-through for decisions |
| LIS-001 | Lessons from decision outcomes |

---

## CDS-M19 — V1 Scope

**[CDS-M19]** Step 5.7 deliverables:

| Capability | V1 |
|------------|-----|
| Collaborative Decision philosophy | ✅ Documented |
| Decision lifecycle | ✅ Spec |
| Proposal + discussion workflows | ✅ Spec |
| Decision Record schema | ✅ Spec |
| Consensus + optional voting | ✅ Spec |
| Implementation tracking model | ✅ Spec |
| Transparency requirements | ✅ Spec |
| Decision Graph architecture | ✅ Spec |
| Platform graph stack | ✅ Spec |
| Decision UI implementation | Stub |
| Live graph traversal | v1.1 |
| AI summarization | Future [CDS-M15] |

---

## CDS-BG — Burt Implementation Guidance

**[CDS-BG]** Implementation should:

1. **Treat decisions as first-class entities** — not vote tallies [CDS-M01]
2. **Separate proposals from outcomes** [CDS-M07, CDS-M06]
3. **Maintain permanent decision history** — append-only [CDS-M06b, CDS-M11]
4. **Support multiple governance methods** [CDS-M09]
5. **Connect decisions to missions and projects** [CDS-M12]
6. **Implement Decision Graph as edge store** [CDS-M16]
7. **Prepare for future AI summarization** [CDS-M15]
8. **Never auto-decide** — AI informs, communities decide [CDS-M15a]

**[CDS-BG-a]** Recommended structure:

```
src/lib/decisions/createProposal.ts
src/lib/decisions/openDiscussion.ts
src/lib/decisions/recordDecision.ts
src/lib/decisions/linkDecisionToMission.ts
src/lib/decisions/getDecisionGraph.ts
src/lib/decisions/archiveDecision.ts
src/components/decisions/ProposalView.tsx
src/components/decisions/DecisionRecord.tsx
src/components/decisions/DecisionGraph.tsx
data/registry/collaborative-decision-system.json
```

**[CDS-BG-b]** Database: `DB-CDS` · tables: `proposals`, `decision_records`, `decision_discussions`, `decision_graph_edges`, `decision_votes`.

---

## AC-054 — Acceptance Criteria

Step 5.7 is complete when:

- [x] **[AC-054a]** Collaborative Decision philosophy documented. `[CDS-M01, CDS-M02, CDS-M03]`
- [x] **[AC-054b]** Decision lifecycle established. `[CDS-M04]`
- [x] **[AC-054c]** Proposal, discussion, and implementation workflows defined. `[CDS-M07, CDS-M08, CDS-M12]`
- [x] **[AC-054d]** Transparency and historical preservation incorporated. `[CDS-M06, CDS-M11, CDS-M14]`
- [x] **[AC-054e]** Decision Graph architecture specified. `[CDS-M16, CDS-M17]`
- [x] **[AC-054f]** Burt has blueprint for community decision-making as enduring organizational capability. `[CDS-BG, collaborative-decision-system.json]`

---

**Next Step:** 5.8 — Commitment & Follow-Through System *(complete — see COMMITMENT_FOLLOW_THROUGH_SYSTEM.md)*

*Trace: Question surfaces → thoughtful proposal → informed discussion → transparent decision → implementation tracked → outcomes evaluated → knowledge archived → Decision Graph connects past to future → next organizer starts with wisdom*
