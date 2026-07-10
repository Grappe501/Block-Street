# Build Volume 4.2 — Navigation Architecture

### Experience Architecture Bible

**Document ID:** VOLUME-004.2 · **UXB-003**  
**Artifact:** `NAVIGATION_ARCHITECTURE.md`  
**Status:** Canonical  
**Priority:** Foundational

**Builds on:** [4.1 Experience Design System](EXPERIENCE_DESIGN_SYSTEM.md) [UXB-002] · [Volume 4 Master Sequence](VOLUME_4_MASTER_SEQUENCE.md) [UXB-001] · [3.2 Workflow Engine](../volume-03/WORKFLOW_ENGINE.md) [PBA-003] · [2.10 Search Index Model](../volume-02/SEARCH_INDEX_MODEL.md) [DAB-011]  
**Live spec:** `data/registry/experience-navigation-architecture.json`

> People should always know where they are, why they are there, and what to do next.

---

## Purpose

**[UXB-NAV01]** The Navigation Architecture defines **how participants move through** the Community Operating System.

**[UXB-NAV01a]** Navigation is **not a menu** — it is how people understand where they are, where they can go, and how every part of the platform relates to every other part.

**[UXB-NAV01b]** **Good navigation reduces anxiety. Great navigation builds confidence** [UXB-EDS03].

---

## Guiding Principle

**[UXB-NAV02]**

> **People should always know where they are, why they are there, and what to do next.**

**[UXB-NAV02a]** Navigation should **eliminate uncertainty** rather than create discovery through complexity.

---

## Philosophy

**[UXB-NAV03]** Traditional software organizes navigation around features: Contacts · Calendar · Tasks · Reports · Settings

**[UXB-NAV03a]** The Community Operating System organizes navigation around **human questions**:

- What needs my attention?
- What should I do today?
- Who needs me?
- What community am I serving?
- What mission am I working on?
- What should I learn next?
- Where can I help?

**[UXB-NAV03b]** **Navigation follows purpose rather than software modules.**

---

## Navigation Hierarchy

**[UXB-NAV04]** Navigation is built in layers — people think about purpose first, not pages:

```text
Mission
      ↓
Workspace
      ↓
Context
      ↓
Action
      ↓
Details
```

---

## Five-Level Navigation Model

**[UXB-NAV05]** Five navigation levels:

| Level | Name | Purpose | Examples |
|-------|------|---------|----------|
| **1** | **Global Navigation** | Always available — the platform itself | Home · Communities · Missions · People · Knowledge · Calendar · Search · Notifications · Personal OS |
| **2** | **Workspace Navigation** | Current operational workspace | Mission Operations Center · Volunteer Success Center · Leadership Academy · Executive Operations Center · Knowledge Observatory · Community · County · Personal Workspace |
| **3** | **Context Navigation** | Current object — contextual | Members · Calendar · Knowledge · Leadership · Missions · Files · Partnerships · Analytics |
| **4** | **Action Navigation** | Current work — limited and intentional | Create Mission · Invite Volunteer · Publish Story · Approve Proposal · Assign Mentor · Schedule Meeting |
| **5** | **Detail Navigation** | Exploration without overwhelm | History · Versions · Relationships · Evidence · Timeline · Activity · Audit |

---

## Navigation Philosophy

**[UXB-NAV06]** Navigation should answer:

Where am I? · What belongs here? · Where can I go? · How do I return? · What deserves my attention?

**[UXB-NAV06a]** **Every page reinforces orientation.**

---

## Orientation System

**[UXB-NAV07]** Every screen displays:

Current workspace · Current community · Current mission · Current context · Navigation path

**[UXB-NAV07a]** **Participants remain grounded.**

---

## Context Awareness

**[UXB-NAV08]** Navigation adapts to:

Community · Mission · Role · Leadership · Current workflow · Calendar · Personal preferences

**[UXB-NAV08a]** **Context simplifies decision-making.**

---

## Workspace Switching

**[UXB-NAV09]** Switching workspaces should **preserve context** where practical.

Example: Viewing a mission → Switch to Executive Workspace → Executive dashboard highlights that mission

**[UXB-NAV09a]** **The participant should not lose their place.**

---

## Breadcrumb Model

**[UXB-NAV10]** Breadcrumbs describe **relationships rather than folders**:

```text
Community → Mission → Planning → Volunteer Assignments → John Smith
```

**[UXB-NAV10a]** **Relationships become visible** [DAB-004].

---

## Search-Driven Navigation

**[UXB-NAV11]** Global search acts as a **parallel navigation system**. Participants may navigate by:

People · Communities · Knowledge · Missions · Calendar · Stories · Institutions · Counties

**[UXB-NAV11a]** **Search should feel like teleportation** [DAB-011].

---

## Quick Actions

**[UXB-NAV12]** Always available:

New Mission · New Story · Invite Volunteer · Schedule Meeting · Search · AI Assistant

**[UXB-NAV12a]** **Quick actions reduce friction.**

---

## Role Awareness

**[UXB-NAV13]** Navigation adapts appropriately for:

Participant · Volunteer · Leader · Community Organizer · County Coordinator · Executive · Administrator

**[UXB-NAV13a]** Information architecture remains **consistent** while emphasizing relevant capabilities.

---

## Mobile Navigation

**[UXB-NAV14]** Mobile prioritizes:

Current work · Next action · Search · Notifications · Calendar · Personal OS

**[UXB-NAV14a]** **Thumb-friendly navigation is mandatory** [UXB-EDS16].

---

## Deep Linking

**[UXB-NAV15]** Every meaningful object has a **permanent address**:

Mission · Community · Story · Volunteer · Meeting · Knowledge object · Leadership profile

**[UXB-NAV15a]** **Links preserve context.**

---

## Navigation Memory

**[UXB-NAV16]** The platform remembers:

Recent workspaces · Recent communities · Recent missions · Frequently visited areas · Pinned resources

**[UXB-NAV16a]** **Returning should feel effortless.**

---

## AI Navigation

**[UXB-NAV17]** AI may answer:

*"Take me to..."* · *"Where do I..."* · *"What should I work on?"* · *"Who needs attention?"*

**[UXB-NAV17a]** **AI becomes a conversational navigation layer** [UXB-EDS17 · DAB-013].

---

## Cross-System Navigation

**[UXB-NAV18]** Navigation supports movement between:

Personal OS · Volunteer Success Center · Mission Operations Center · Leadership Academy · Knowledge Observatory · Executive Operations Center · Community Operating Manual

**[UXB-NAV18a]** **The experience remains continuous** [PBA-001].

---

## Attention Integration

**[UXB-NAV19]** Navigation highlights:

Pending approvals · Upcoming meetings · Mission deadlines · Community updates · Learning recommendations

**[UXB-NAV19a]** **Without becoming distracting** [PBA-011].

---

## Community Presence

**[UXB-NAV20]** Navigation should continuously reinforce:

Communities · Relationships · People · Shared missions · Belonging

**[UXB-NAV20a]** **The participant never feels isolated** [UXB-EDS18].

---

## Accessibility

**[UXB-NAV21]** Navigation supports:

Keyboard · Screen readers · Voice · Touch · Large displays · High contrast · Reduced motion

**[UXB-NAV21a]** **Navigation should be universally usable** [UXB-EDS15].

---

## Major Architectural Recommendation: Intent Navigation Engine

**[UXB-NAV22]** Introduce an **Intent Navigation Engine (INE)** that fundamentally changes how people move through the platform.

**[UXB-NAV22a]** Instead of requiring users to understand the software's structure, the INE **begins with what the user is trying to accomplish**.

**[UXB-NAV22b]** Example intents:

- *"I want to help this weekend."*
- *"Show me communities near me."*
- *"I need to approve something."*
- *"Find my mentor."*
- *"What should I do today?"*
- *"Prepare for tonight's meeting."*
- *"Show me everyone working on voter registration."*

**[UXB-NAV22c]** The INE translates goals into the appropriate workspace, context, and actions. It combines:

| Layer | Sources |
|-------|---------|
| **Context** | Current workspace · Community · Mission · Calendar · Leadership role |
| **Intelligence** | Community Intelligence · Operational Intelligence · Personal OS · Digital Twin · Community Health |
| **Navigation** | Search · Deep links · Recent history · Pinned work · AI conversation |
| **Guidance** | Complete workflow guidance — not just opening a page |

**[UXB-NAV22d]** Example guidance:

> *"You want to launch a community. I'll take you to the Community Workspace, open the proposal wizard, show similar communities, recommend a mentor, and pre-load the Community Operating Manual template."*

**[UXB-NAV22e]** This transforms navigation from a **static menu system** into a **purpose-driven guidance system**.

**[UXB-NAV22f]** People should not have to learn the software's internal organization before accomplishing meaningful work — **the platform adapts to human intent**.

**[UXB-NAV22g]** Live spec: `data/registry/experience-navigation-architecture.json` · `intentNavigationEngine`

---

## Burt Implementation Guidance

**[UXB-NAV23]** Implementation should:

1. Organize navigation around **purpose rather than features**
2. Build **layered navigation** with clear orientation
3. Support **contextual workspaces**
4. Make **search a first-class navigation mechanism**
5. **Preserve context** during navigation
6. Keep navigation **consistent across devices**
7. Consult **Intent Navigation Engine** spec before navigation-facing features

**[UXB-NAV23a]** Logical home: Experience Architecture schema — NavigationLevel · OrientationContext · DeepLink · IntentNavigationEngine.

---

## AC-138 — Acceptance Criteria

Volume 4.2 is complete when:

- [x] **[AC-138a]** Navigation philosophy is documented. `[UXB-NAV03–NAV06]`
- [x] **[AC-138b]** Five-level navigation hierarchy is established. `[UXB-NAV04–NAV05]`
- [x] **[AC-138c]** Workspace, contextual, search, AI, and mobile navigation models are defined. `[UXB-NAV09–NAV14, NAV17]`
- [x] **[AC-138d]** Orientation, accessibility, and deep-linking are incorporated. `[UXB-NAV07, NAV15, NAV21]`
- [x] **[AC-138e]** Intent Navigation Engine specified. `[UXB-NAV22]`
- [x] **[AC-138f]** Burt has a complete blueprint for implementing navigation across the Community Operating System. `[UXB-NAV23]`

---

**Next step:** [4.3 — Dashboard Architecture](DASHBOARD_ARCHITECTURE.md) [UXB-004]

**End of Volume 4.2.**
