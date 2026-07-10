# Welcome & Belonging System

**Document ID:** PHASE-006.5  
**Artifact:** `WELCOME_BELONGING_SYSTEM.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 6 — Growth Operating System  
**Acronym:** WBS

> **People join because they are invited. They stay because they belong.**

Step 6.5 is the **most important step in the Growth Operating System**. Almost every organization spends enormous energy getting people to sign up — and very little helping them **belong**. If we get this wrong, everything else becomes harder.

We built the **Personal Organizing Network** [PON-001 6.2], **Community Growth & Outreach** [CGO-001 6.3], and **Leadership Development** [CLD-001 6.4]. Step 6.5 connects invitation to lasting participation — one of the **defining experiences** of the platform.

**Requirement:** WBS-001 · **Planned alias superseded:** ONB-001 · **Extends:** [Participant Journey JRN-001](../phase-03/PARTICIPANT_JOURNEY.md) · [Participant Experience & Lifecycle PEL-001](../phase-03/PARTICIPANT_EXPERIENCE_LIFECYCLE.md) · [Opportunity & Belonging Engine OBE-001](../phase-03/OPPORTUNITY_BELONGING_ENGINE.md) · **Phase umbrella:** GOS-001 · **Governed by:** [Growth Constitution GCN-001](GROWTH_CONSTITUTION.md)

**Builds On:** JRN-001 · PEL-001 · OBE-001 · [Personal HQ PHQ-001](../phase-03/PARTICIPANT_PROFILE_SYSTEM.md) · [Personal Civic Center PCC-001](../phase-03/PERSONAL_CIVIC_CENTER.md) · PON-001 · CGO-001 · CLD-001 · [Belonging Index GCN-M16](GROWTH_CONSTITUTION.md)

**Live spec:** `data/registry/welcome-belonging-system.json`

**Required reading for Burt.**

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| WBS-M01 | Purpose |
| WBS-M02 | Guiding principle |
| WBS-M03 | Philosophy |
| WBS-M04 | Welcome Journey |
| WBS-M05 | Personalized Welcome |
| WBS-M06 | Welcome Guide |
| WBS-M07 | First Week Experience |
| WBS-M08 | Community Introduction |
| WBS-M09 | First Mission Recommendation |
| WBS-M10 | Relationship Builder |
| WBS-M11 | Belonging Checkpoints |
| WBS-M12 | Welcome Resources |
| WBS-M13 | Feedback Loop |
| WBS-M14 | Future AI assistance |
| WBS-M15 | Relationship to JRN, PEL, OBE |
| WBS-M16 | First 30 Days Journey |
| WBS-M17 | V1 scope |
| WBS-BG | Burt implementation guidance |
| AC-066 | Step 6.5 acceptance criteria |

---

## WBS-M01 — Purpose

**[WBS-M01]** The **Welcome & Belonging System (WBS)** helps every new participant become a **confident, connected, and active member** of their community.

**[WBS-M01a]** Joining the platform is **only the beginning** [GCN-M06 Growth Lifecycle — invitation through legacy].

**[WBS-M01b]** The goal is for every participant to quickly discover **people, opportunities, and communities where they feel they belong** [OBE-001, GCN-M05a Belonging Over Engagement].

**[WBS-M01c]** Not HR onboarding. Not a checklist. A **participant-centered welcome experience** that reduces uncertainty and encourages participation.

---

## WBS-M02 — Guiding Principle

**[WBS-M02]**

> **People join because they are invited. They stay because they belong.**

**[WBS-M02a]** Belonging is the **foundation of long-term participation** [GCN-M02, PEL-M01].

**[WBS-M02b]** The goal is not simply to register people — it is to help them become **active members of communities that grow through relationships, service, and shared purpose**.

---

## WBS-M03 — Philosophy

**[WBS-M03]** The platform should answer these questions for every new participant:

| Question | WBS mechanism |
|----------|---------------|
| Who welcomed me? | Welcome Guide [WBS-M06] · PON invite attribution |
| Where do I fit? | Community Introduction [WBS-M08] · OBE-001 |
| What can I do today? | First Mission [WBS-M09] |
| Who can help me? | Welcome Guide · Relationship Builder [WBS-M10] |
| How can I contribute? | Opportunities [OEX-001] |
| What happens next? | First 30 Days Journey [WBS-M16] |

**[WBS-M03a]** The first experience should **reduce uncertainty** and **encourage participation** — not overwhelm [PEL-M04 emotional design].

**[WBS-M03b]** **Separate registration from belonging** [WBS-BG] — USR-001 registers; WBS welcomes.

---

## WBS-M04 — Welcome Journey

**[WBS-M04]** Every participant follows the same **high-level journey**:

```text
Invitation
        ↓
Registration
        ↓
Welcome
        ↓
First Community
        ↓
First Connection
        ↓
First Mission
        ↓
First Volunteer Experience
        ↓
Returning Participant
        ↓
Leadership Development
```

**[WBS-M04a]** Journey emphasizes **participation over completion** — no forced checklist [GCN-M07 Voluntary Participation].

**[WBS-M04b]** Aligns with [Growth Lifecycle GCN-M06] and [Participant Journey JRN-001] — WBS operationalizes the **welcome-through-first-contribution** segment.

**[WBS-M04c]** Terminal stage feeds [Leadership Development CLD-001 6.4] — belonging precedes leadership.

**[WBS-M04d]** Orchestrator: `getWelcomeJourney(participantId)`.

---

## WBS-M05 — Personalized Welcome

**[WBS-M05]** Every participant receives a **personalized welcome** — feels personal, not automated [PEL-M05 delight moments].

**[WBS-M05a]** Includes:

- Welcome message · introduction to their community
- **Personal Command Center** [PCC-001 · PHQ-001]
- Suggested first actions · upcoming opportunities
- Friendly explanation of what the platform is [not jargon]

**[WBS-M05b]** Uses invite context from [PON-001] — who invited them, which community, which event.

**[WBS-M05c]** Route: `/welcome` · orchestrator: `getPersonalizedWelcome(participantId)`.

---

## WBS-M06 — Welcome Guide

**[WBS-M06]** Every new participant is connected with a **Welcome Guide** — a person, not a bot.

**[WBS-M06a]** Guide may be:

- The person who invited them [PON-001]
- A mentor · volunteer · community organizer
- A designated welcome team member

**[WBS-M06b]** Guide helps **answer questions and make introductions** [PON-M09 Welcome Workflow].

**[WBS-M06c]** Guide relationship is **opt-in and lightweight** — not a permanent assignment unless both choose [SEC-001].

**[WBS-M06d]** Communities configure welcome team via [CGO-001] readiness [CGO-M10].

---

## WBS-M07 — First Week Experience

**[WBS-M07]** The platform **gently encourages** during the first week:

- Completing a profile · joining a community · meeting people
- Exploring opportunities · attending an event · volunteering
- Introducing themselves **if they choose** [never required]

**[WBS-M07a]** First week should feel **encouraging rather than overwhelming** [PEL-M03].

**[WBS-M07b]** Surfaces in [Personal HQ PHQ-001] and First 30 Days Journey [WBS-M16] — Week 1 module.

**[WBS-M07c]** No notification spam [GCN-M08 Growth Ethics].

---

## WBS-M08 — Community Introduction

**[WBS-M08]** Participants quickly understand **their campus or county community**:

- What the community does · current missions · upcoming events
- Active teams · ways to help · community traditions
- Leadership opportunities [CLD-001]

**[WBS-M08a]** Goal: help participants **see themselves as part of the community** [CCN-M001 community identity].

**[WBS-M08b]** Pulls from [Community Command Center CCC-001] · [Community Stories CST-001].

**[WBS-M08c]** Route segment: `/welcome/community/[slug]`.

---

## WBS-M09 — First Mission Recommendation

**[WBS-M09]** Platform recommends a **simple first opportunity** [OBE-001 · OEX-001].

**[WBS-M09a]** Examples:

- Attend a welcome event · volunteer for one hour
- Join a committee meeting · help with an upcoming project · meet a mentor

**[WBS-M09b]** **Small first experiences build confidence** [PEL-M06].

**[WBS-M09c]** Recommendations are **explainable** [OBE-M05] — why this fits you.

**[WBS-M09d]** Orchestrator: `recommendFirstMission(participantId)`.

---

## WBS-M10 — Relationship Builder

**[WBS-M10]** System encourages **meaningful introductions** — naturally, not forced.

**[WBS-M10a]** Examples:

- People with similar interests · same campus · nearby counties
- Potential mentors · volunteer teammates

**[WBS-M10b]** Extends [Personal Relationship Network PRN-001] and [PON-001] — welcome is where relationships begin.

**[WBS-M10c]** Not speed-networking or mandatory intros [GCN-M08].

**[WBS-M10d]** Orchestrator: `suggestIntroductions(participantId, limit?)`.

---

## WBS-M11 — Belonging Checkpoints

**[WBS-M11]** Instead of asking only whether someone registered, platform tracks **belonging signals**:

| Checkpoint | Question |
|------------|----------|
| Community joined? | First community |
| Volunteered? | First volunteer experience |
| Met someone? | First connection |
| Returned? | Second visit / week 2 |
| Found mentor? | Welcome Guide or CLD mentor |
| Contributed? | First mission or reflection |

**[WBS-M11a]** Checkpoints help communities identify participants who may need **additional support** — not surveillance [SEC-001, GCN-M08].

**[WBS-M11b]** Feed [Belonging Index GCN-M16] — community reflection on whether people are finding belonging.

**[WBS-M11c]** Feed [Community Growth Dashboard CGO-M04] — returning participants, mentorship activity.

**[WBS-M11d]** Orchestrator: `getBelongingCheckpoints(participantId | communityId)`.

---

## WBS-M12 — Welcome Resources

**[WBS-M12]** Communities receive **reusable welcome materials** [CGO-M13 Growth Resources pattern]:

- Welcome message templates · orientation guides · campus introductions
- Community FAQs · short videos · printable QR cards · presentation slides

**[WBS-M12a]** Communities shouldn't have to recreate these from scratch [CKLS-001].

**[WBS-M12b]** Configurable per community type [campus · county · trade school · future high school].

---

## WBS-M13 — Feedback Loop

**[WBS-M13]** New participants may easily share:

- Questions · suggestions · challenges · ideas · first impressions

**[WBS-M13a]** Feedback **improves the welcome experience** — feeds [Community Intelligence CIS-001] and [Continuous Improvement LIS-001].

**[WBS-M13b]** Optional, low-friction, private by default [SEC-001].

---

## WBS-M14 — Future AI Assistance

**[WBS-M14]** Future AI may **support** welcome — human relationships remain central [GCN-M02, PON-M17].

**[WBS-M14a]** May:

- Answer common questions · recommend communities · suggest first missions
- Identify participants who may benefit from outreach
- Recommend mentors · summarize welcome progress

**[WBS-M14b]** Prepare for **future conversational guidance** [PDT-001, OBE-001] — AI never replaces Welcome Guide [WBS-M06].

---

## WBS-M15 — Relationship to JRN, PEL, OBE

**[WBS-M15a]** **JRN-001** (Phase 3) defined participant journey stages — WBS operationalizes **welcome through first contribution**.

**[WBS-M15b]** **PEL-001** defined emotional lifecycle design — WBS implements **how the first hours and weeks should feel**.

**[WBS-M15c]** **OBE-001** defined belonging-first discovery — WBS is the **primary consumer** of OBE recommendations during welcome.

**[WBS-M15d]** Planned **Onboarding System ONB-001** superseded — "onboarding" sounds like HR; **Welcome & Belonging** reflects the actual purpose.

**[WBS-M15e]** JRN/PEL/OBE ask *"What should the journey feel like?"* · WBS asks *"How do we welcome every new person into belonging?"*

---

## WBS-M16 — First 30 Days Journey

**[WBS-M16]** The **First 30 Days Journey (F30)** is the **signature experience** of WBS — gently guides new participants through their first month instead of leaving them to figure everything out.

**[WBS-M16a]** **Not a checklist that must be completed.** A **guided experience** at a comfortable pace — participation over completion [WBS-M04a].

**[WBS-M16b]** Possible journey:

| Period | Gentle suggestions |
|--------|-------------------|
| **Day 1** | Welcome message · meet your community · meet your Welcome Guide |
| **Week 1** | Attend one event · explore one mission · meet two new people |
| **Week 2** | Volunteer once · learn about a committee · record first reflection [PGL-001] |
| **Week 3** | Join a project · attend community meeting · invite a friend if it feels right [PON-001] |
| **Week 4** | Reflect on first month · meet a mentor [CLD-001] · explore leadership opportunities |

**[WBS-M16c]** After 30 days, participants should feel they **know people, understand their community, and have clear ways to stay involved**.

**[WBS-M16d]** Route: `/welcome/first-30-days` · orchestrator: `getFirst30DaysJourney(participantId)`.

**[WBS-M16e]** Surfaces in [Personal HQ PHQ-001] as primary new-participant experience — not buried in settings.

**[WBS-M16f]** Communities see aggregate F30 progress in [Growth Dashboard CGO-M04] — where welcome is working, where support is needed.

**[WBS-M16g]** Complements [Impact Tree PON-M16] (later) and [Belonging Index GCN-M16] — **early belonging lens**.

---

## WBS-M17 — V1 Scope

| Deliverable | Status |
|-------------|--------|
| WBS philosophy documented | ✅ |
| Welcome Journey + Belonging Checkpoints | ✅ |
| Personalized Welcome + Welcome Guide | ✅ |
| First Week + Community Introduction | ✅ |
| First Mission + Relationship Builder | ✅ |
| Welcome Resources + Feedback Loop | ✅ |
| First 30 Days Journey architecture | ✅ |
| Live F30 progress tracking | v1.1 |
| Automated Welcome Guide matching | v1.1 |

---

## WBS-BG — Burt Implementation Guidance

**[WBS-BG-a]** Implementation should:

- Treat welcoming as an **ongoing process** — not a single screen
- **Separate registration from belonging** [USR-001 vs WBS-001]
- Integrate [PON-001], [CGO-001], [CLD-001], [OBE-001], [PHQ-001]
- Support **configurable welcome flows** per community type
- Prepare for **future conversational guidance** [PDT-001]

**[WBS-BG-b]** Files:

```
src/lib/wbs/getWelcomeJourney.ts
src/lib/wbs/getPersonalizedWelcome.ts
src/lib/wbs/recommendFirstMission.ts
src/lib/wbs/getBelongingCheckpoints.ts
src/lib/wbs/getFirst30DaysJourney.ts
src/lib/wbs/suggestIntroductions.ts
src/components/welcome/PersonalizedWelcome.tsx
src/components/welcome/First30DaysJourney.tsx
src/components/welcome/WelcomeGuideCard.tsx
data/registry/welcome-belonging-system.json
```

**[WBS-BG-c]** Database: `DB-WBS` · tables: `welcome_guides`, `belonging_checkpoints`, `first_30_days_progress`, `welcome_feedback`, `welcome_resources`.

---

## AC-066 — Acceptance Criteria

Step 6.5 is complete when:

- [x] **[AC-066a]** Welcome & Belonging philosophy documented. `[WBS-M01, WBS-M02, WBS-M03]`
- [x] **[AC-066b]** Welcome Journey and Belonging Checkpoints established. `[WBS-M04, WBS-M11]`
- [x] **[AC-066c]** Welcome Guides and first mission recommendations defined. `[WBS-M06, WBS-M09]`
- [x] **[AC-066d]** Community introductions and feedback loops incorporated. `[WBS-M08, WBS-M13]`
- [x] **[AC-066e]** First 30 Days Journey specified. `[WBS-M16]`
- [x] **[AC-066f]** Burt has blueprint for participant-centered welcome experience. `[WBS-BG, welcome-belonging-system.json]`

---

**Phase 6 Complete.** · **Volume 0:** [Master Architecture Bible [MAB-001]](../master/MASTER_ARCHITECTURE_BIBLE.md) — canonical source of truth; read before production code

*Trace: Invitation → welcome → first connection → first mission → belonging checkpoints → returning participant → leadership pipeline → community grows through people who stay*
