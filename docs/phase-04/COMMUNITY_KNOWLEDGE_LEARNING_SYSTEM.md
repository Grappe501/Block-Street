# Community Knowledge & Learning System

**Document ID:** PHASE-004.8  
**Artifact:** `COMMUNITY_KNOWLEDGE_LEARNING_SYSTEM.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 4 — Community Operating System  
**Acronym:** CKLS

> **Knowledge shared becomes community strength.**

Most platforms treat documents as **files**. ASYON treats **knowledge as a living asset**.

A document isn't valuable. **What people learn from it is.**

We're not just storing information — we're continuously building **community intelligence**.

**Requirement:** CKLS-001 *(implements community knowledge layer; governed by [KDG-001](../phase-02/KNOWLEDGE_DATA_GOVERNANCE.md) Phase 2)*

**Builds On:** [Community Communication Network](COMMUNITY_COMMUNICATION_NETWORK.md) · [Mission & Project System](MISSION_PROJECT_SYSTEM.md) · [Community Growth & Sustainability](COMMUNITY_GROWTH_SUSTAINABILITY.md) · [Personal Digital Twin](../phase-03/PERSONAL_DIGITAL_TWIN.md) · [Knowledge & Data Governance](../phase-02/KNOWLEDGE_DATA_GOVERNANCE.md)

**Live spec:** `data/registry/community-knowledge-learning-system.json`

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| CKLS-M01 | Purpose |
| CKLS-M02 | Guiding principle |
| CKLS-M03 | Philosophy |
| CKLS-M04 | Knowledge categories |
| CKLS-M05 | Knowledge structure |
| CKLS-M06 | Community Wiki |
| CKLS-M07 | Playbooks |
| CKLS-M08 | Decision Library |
| CKLS-M09 | Lessons Learned |
| CKLS-M10 | Searchable knowledge |
| CKLS-M11 | Knowledge relationships |
| CKLS-M12 | Learning paths |
| CKLS-M13 | Community memory |
| CKLS-M14 | AI Knowledge Assistant (future) |
| CKLS-M15 | Community Brain architecture |
| CKLS-M16 | Platform integrations |
| CKLS-M17 | V1 scope |
| CKLS-BG | Burt implementation guidance |
| AC-041 | Step 4.8 acceptance criteria |

---

## CKLS-M01 — Purpose

**[CKLS-M01]** The **Community Knowledge & Learning System (CKLS)** captures, organizes, preserves, and shares the **collective knowledge** of every community.

**[CKLS-M01a]** Knowledge should **never disappear** because someone graduates, moves away, or steps down from leadership [CGS-M06, CGS-M07].

**[CKLS-M01b]** **Every generation should leave the next generation better prepared** than they were.

**[CKLS-M01c]** CKLS is where the platform becomes **unlike anything else** — living community intelligence, not a file cabinet.

---

## CKLS-M02 — Guiding Principle

**[CKLS-M02]**

> **Knowledge shared becomes community strength.**

**[CKLS-M02a]** The platform exists to:

- **Preserve experience**
- **Reduce repeated mistakes**
- **Accelerate future success**

**[CKLS-M02b]** Complementary principles:

| Source | Principle |
|--------|-----------|
| KDG-001 | Trustworthy data — provenance and governance |
| CGS-M07 | Institutional memory — append-only |
| CCNET-M07 | Discussions become knowledge |
| MPS-M12 | Mission reflection feeds lessons learned |

---

## CKLS-M03 — Philosophy

**[CKLS-M03]** Knowledge is **not documentation**.

**[CKLS-M03a]** Knowledge is the **accumulated experience** of a community:

| Type | Example |
|------|---------|
| What worked | Successful voter registration playbook |
| What failed | First attempt at county launch — lessons |
| Why decisions were made | Decision Library entry |
| Lessons learned | Post-mission reflection |
| Community traditions | Annual welcome week |
| Proven practices | Mentor onboarding flow |
| Local wisdom | "Always coordinate with county before campus events" |

**[CKLS-M03b]** The system should help communities **continuously learn** — not archive and forget.

**[CKLS-M03c]** **Structured content, not file storage** [CKLS-BG] — relationships, version history, search from day one.

---

## CKLS-M04 — Knowledge Categories

**[CKLS-M04]** Configurable categories — every community develops knowledge:

- Community Guides · Volunteer Guides · Event Playbooks
- Meeting Notes · Training · Templates · FAQs
- Research · Community History · Leadership Transition Guides
- Project Playbooks · Policies

**[CKLS-M04a]** Future categories added without redesign — `knowledgeCategory` attribute on knowledge objects.

---

## CKLS-M05 — Knowledge Structure

**[CKLS-M05]** Every knowledge item contains:

| Field | Purpose |
|-------|---------|
| Title | Discoverable label |
| Summary | Quick understanding |
| Purpose | Why this exists |
| Community | Parent community scope |
| Author(s) | Original contributors |
| Contributors | Collaborative editors |
| Last Updated | Freshness signal |
| Related Projects | Graph links [MPS-001] |
| Related Teams | Graph links [TWG-001] |
| Related Capabilities | Links to Step 4.9 Capability Exchange |
| Related Timeline Events | Links to [TSOS-001] |

**[CKLS-M05a]** Knowledge is **interconnected rather than isolated** — graph-native, not folder hierarchy.

**[CKLS-M05b]** Version history maintained — who changed what, when [KDG-001 provenance].

---

## CKLS-M06 — Community Wiki

**[CKLS-M06]** Every community should eventually have a **living wiki**:

- How our community works
- Annual traditions
- Common questions
- Leadership contacts
- Volunteer expectations
- Project history
- Best practices

**[CKLS-M06a]** Wiki **evolves continuously** — collaborative editing, append-only history, never delete institutional knowledge [CGS-M11].

**[CKLS-M06b]** Wiki is the **entry point** to Community Brain [CKLS-M15] — structured index of community knowledge.

---

## CKLS-M07 — Playbooks

**[CKLS-M07]** **One of the most valuable forms of knowledge** — transforms experience into repeatable success.

| Playbook | Community |
|----------|-----------|
| Voter registration drive | Campus/county |
| Welcome new members | Any community |
| Debate watch party | Civic engagement |
| Campus cleanup | Service |
| Launch a county team | Outreach |

**[CKLS-M07a]** Playbooks link to **Mission Canvas templates** [MPS-M15] — proven missions become starting points.

**[CKLS-M07b]** Playbooks are **first-class knowledge objects** — not attachments in a folder.

---

## CKLS-M08 — Decision Library

**[CKLS-M08]** Communities preserve **important decisions** with full context:

| Field | Why |
|-------|-----|
| Decision made | What was chosen |
| Why it was made | Rationale preserved |
| Alternatives considered | Options not lost |
| Who participated | Accountability + credit |
| Related projects | Mission context |
| Related discussions | Conversation Graph link [CCNET-M13] |

**[CKLS-M08a]** **Future leaders understand context rather than guessing** — deepest form of institutional memory.

**[CKLS-M08b]** Decisions promoted from Conversation Graph when discussions produce outcomes [CCNET-M13].

---

## CKLS-M09 — Lessons Learned

**[CKLS-M09]** Every **major project contributes knowledge** [MPS-M12]:

- What surprised us
- What worked well
- What failed
- Recommendations
- Resources created

**[CKLS-M09a]** **Communities become smarter over time** — lessons feed playbooks, wikis, and Community Brain.

**[CKLS-M09b]** Required step in mission lifecycle before archive [MPS-M05 Celebrated → Reflection → Archived].

---

## CKLS-M10 — Searchable Knowledge

**[CKLS-M10]** Participants easily discover:

- Guides · Training · Projects · Meeting notes
- Community stories · Policies · FAQs

**[CKLS-M10a]** **Everything searchable** — full-text + graph traversal + category filters.

**[CKLS-M10b]** Orchestrator: `searchCommunityKnowledge(communityId, query)` — powers Resources widget and Community Brain queries.

**[CKLS-M10c]** Search indexes **structured fields and relationships**, not just document bodies.

---

## CKLS-M11 — Knowledge Relationships

**[CKLS-M11]** Knowledge connects to the **Registry graph** [REL-001]:

| Edge | Example |
|------|---------|
| Knowledge → Project | Playbook for food drive |
| Knowledge → Team | Communications team guide |
| Knowledge → Community | Campus wiki home |
| Knowledge → Participant | Author, contributor |
| Knowledge → Timeline | Event debrief notes |
| Knowledge → Resource | Template file in library |
| Knowledge → Training | Learning path module |

**[CKLS-M11a]** Registry **understands these relationships** — queryable, traceable, supports Community Brain traversal.

---

## CKLS-M12 — Learning Paths

**[CKLS-M12]** Knowledge naturally supports **learning**:

| Path | Audience |
|------|----------|
| New Organizer Path | First-time leaders |
| Volunteer Orientation | New participants |
| Committee Leadership | Team facilitators |
| Project Management | Mission organizers |
| Community Building | Growth-focused |
| Mentorship | Pairs and programs |
| Future Civic Academy | [PGL-001] statewide |

**[CKLS-M12a]** **Learning grows directly from community experience** — not generic LMS content divorced from local context.

**[CKLS-M12b]** Learning paths compose knowledge items + missions + mentorship edges — sequenced journeys through Community Brain.

---

## CKLS-M13 — Knowledge Legacy

**[CKLS-M13]** Knowledge becomes **institutional memory** [CGS-M07, CLS-001]:

- Annual reports · Leadership transitions · Traditions
- Historic projects · Volunteer stories · Important milestones

**[CKLS-M13a]** **Communities remember their own history** — CKLS is the structured knowledge layer; [Community Legacy System CLS-001] is the narrative/timeline layer.

**[CKLS-M13b]** Historical timeline events [TSOS-M15] link to knowledge artifacts — "what we learned from that event."

---

## CKLS-M14 — AI Knowledge Assistant (Future)

**[CKLS-M14]** Future AI may:

- Recommend guides · Answer community questions
- Suggest relevant playbooks · Summarize documentation
- Connect similar knowledge · Identify outdated resources

**[CKLS-M14a]** AI **assists knowledge discovery — not replaces community wisdom** [CCNET-M12, CAM-M15].

**[CKLS-M14b]** AI **consults Community Brain** [CKLS-M15] — grounded in community's own knowledge, not generic training data.

---

## CKLS-M15 — Community Brain Architecture

**[CKLS-M15]** **Signature feature.** Every community has its own **Community Brain**.

**[CKLS-M15a]** The Community Brain is **not an AI model**. It is the **organized memory** of that community — structured knowledge corpus that AI assistants consult.

**[CKLS-M15b]** Platform twin architecture:

| Entity | Memory system |
|--------|---------------|
| **Participant** | Personal Digital Twin [PDT-001] |
| **Community** | **Community Brain** [CKLS-M15] |

**[CKLS-M15c]** Community Brain knows:

- How the community operates
- Past projects and outcomes
- Annual traditions
- Successful playbooks
- Leadership history
- Volunteer knowledge
- Frequently asked questions
- Community vocabulary (local terms, traditions)
- Lessons learned

**[CKLS-M15d]** Example queries — grounded in **that community's own knowledge**:

> "How did UCA organize last year's leadership summit?"  
> "What usually happens during the Benton County fall volunteer drive?"  
> "Show me the playbook Philander Smith used for welcoming first-year students."

**[CKLS-M15e]** Future AI assistants **don't search random documents** — they **consult the Community Brain**.

**[CKLS-M15f]** Orchestrator: `queryCommunityBrain(communityId, question)` — graph traversal + search over community-scoped knowledge objects.

**[CKLS-M15g]** Philosophy: *Together, PDT and Community Brain create a platform that doesn't just organize work — it remembers how communities learn, adapt, and improve over time.*

**[CKLS-M15h]** Designing for this **now** gives Burt powerful long-term architecture — institutional memory is extraordinarily difficult to build after the fact.

**[CKLS-M15i]** V1: knowledge graph schema + stub query; full Brain UI and AI integration in v1.2+.

---

## CKLS-M16 — Platform Integrations

**[CKLS-M16]** CKLS receives knowledge from across the platform:

| Source | Flow |
|--------|------|
| CCNET [CCNET-M07] | `promoteDiscussionToKnowledge()` |
| Missions [MPS-M12] | Reflection + lessons learned on completion |
| CGS [CGS-M07] | Institutional memory philosophy |
| Conversation Graph [CCNET-M13] | Decisions → Decision Library |
| Mission Canvas [MPS-M15] | Completed canvases → playbook templates |
| Capability Exchange [4.9] | Capabilities linked as related assets |
| KDG-001 | Governance, provenance, attribution |

**[CKLS-M16a]** Community Command Center **Resources widget** [CCC-M15] surfaces Community Brain highlights — not raw file list.

---

## CKLS-M17 — V1 Scope

**[CKLS-M17]** Jul 12 leader testing / Jul 14 launch minimum:

| Deliverable | Scope |
|-------------|-------|
| CKLS philosophy & categories | Documented — this step |
| Community Brain spec | Schema + stub query |
| Knowledge entity schema | Graph nodes + relationships |
| Wiki stub | Static community guide placeholder |
| Full collaborative editing | v1.1 |

**[CKLS-M17a]** Deferred: full search index, AI assistant, learning path UI, collaborative wiki editor.

---

## CKLS-BG — Burt Implementation Guidance

**[CKLS-BG]** Implementation should:

1. **Treat knowledge as structured content** — not file storage [CKLS-M03]
2. **Support relationships between knowledge objects** — graph-native [CKLS-M11]
3. **Maintain version history** — append-only edits [KDG-001]
4. **Enable collaborative editing** — future wiki/playbook co-authoring
5. **Support future AI retrieval** — Community Brain as RAG corpus [CKLS-M15]
6. **Design search from the beginning** — indexed at creation, not bolted on [CKLS-M10]

**[CKLS-BG-a]** Recommended file structure:

```
src/lib/ckls/queryCommunityBrain.ts
src/lib/ckls/promoteToKnowledge.ts
src/lib/ckls/searchCommunityKnowledge.ts
src/components/ccc/widgets/ResourcesWidget.tsx
data/registry/community-knowledge-learning-system.json
```

**[CKLS-BG-b]** Database: `knowledge_items` with `community_id`, `category`, `content_structured`, `version_history`, graph edges to projects/teams/missions/threads.

**[CKLS-BG-c]** **KDG-001 governs; CKLS-001 implements** — provenance, attribution, approved sources apply to all knowledge objects.

---

## AC-041 — Acceptance Criteria

Step 4.8 is complete when:

- [x] **[AC-041a]** Community Knowledge & Learning philosophy documented. `[CKLS-M01, CKLS-M03]`
- [x] **[AC-041b]** Knowledge categories and relationships defined. `[CKLS-M04, CKLS-M05, CKLS-M11]`
- [x] **[AC-041c]** Wiki, playbook, and decision library incorporated. `[CKLS-M06, CKLS-M07, CKLS-M08]`
- [x] **[AC-041d]** Search and AI assistance anticipated. `[CKLS-M10, CKLS-M14]`
- [x] **[AC-041e]** Community Brain architecture specified. `[CKLS-M15]`
- [x] **[AC-041f]** Platform integrations documented. `[CKLS-M16]`
- [x] **[AC-041g]** Burt has blueprint for living knowledge ecosystem. `[CKLS-BG, community-knowledge-learning-system.json]`

---

**Phase 4 Status:** Complete — [Build Bible](PHASE_4_COMMUNITY_OS_BUILD_BIBLE.md) · **Next:** Phase 5 — Action Operating System

*Trace: Conversations → Knowledge → Playbooks → Community Brain → every generation better prepared → institutional memory that survives leadership change*
