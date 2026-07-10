# Build Volume 4.3 — Dashboard & Workspace Architecture

### Experience Architecture Bible

**Document ID:** VOLUME-004.3 · **UXB-004**  
**Artifact:** `DASHBOARD_ARCHITECTURE.md`  
**Status:** Canonical  
**Priority:** Foundational

**Builds on:** [4.2 Navigation Architecture](NAVIGATION_ARCHITECTURE.md) [UXB-003] · [4.1 Experience Design System](EXPERIENCE_DESIGN_SYSTEM.md) [UXB-002] · [Volume 3 Platform Behavior](../volume-03/VOLUME_3_MASTER_SEQUENCE.md) [PBA-001] · [2.6 Event Data Model](../volume-02/EVENT_DATA_MODEL.md) [DAB-007]  
**Live spec:** `data/registry/dashboard-architecture.json`

> Every dashboard should answer one question: "What should I do next?"

---

## Purpose

**[UXB-DAW01]** The Dashboard & Workspace Architecture defines how every participant experiences the Community Operating System as **a place to accomplish meaningful work**.

**[UXB-DAW01a]** Dashboards are **not** collections of charts. Workspaces are **not** collections of pages.

**[UXB-DAW01b]** Each workspace is an **operational environment** built around a person's goals, responsibilities, relationships, and community.

**[UXB-DAW01c]** **The dashboard is the front door to meaningful work.**

---

## Guiding Principle

**[UXB-DAW02]**

> **Every dashboard should answer one question: "What should I do next?"**

**[UXB-DAW02a]** A participant should **never log in wondering where to begin**.

---

## Philosophy

**[UXB-DAW03]** Traditional dashboards show: Statistics · Reports · Widgets · Graphs

**[UXB-DAW03a]** The Community Operating System shows:

Purpose · Priorities · People · Communities · Missions · Knowledge · Decisions · Growth opportunities

**[UXB-DAW03b]** **Dashboards should reduce uncertainty and create momentum** [UXB-EDS03].

---

## Workspace Philosophy

**[UXB-DAW04]** Every workspace exists to support **one operational role**:

Personal Operating System → Volunteer Success Center → Mission Operations Center → Leadership Academy → Knowledge Observatory → Executive Operations Center

**[UXB-DAW04a]** **Each workspace answers a different set of questions** [PBA-001].

---

## Universal Workspace Structure

**[UXB-DAW05]** Every workspace follows the same organizational model:

```text
Mission
      ↓
Today's Priorities
      ↓
Current Work
      ↓
People
      ↓
Calendar
      ↓
Knowledge
      ↓
Intelligence
      ↓
History
```

**[UXB-DAW05a]** **Consistency reduces learning time.**

---

## Universal Dashboard Layout

**[UXB-DAW06]** Every dashboard contains eight panels:

| # | Panel | Displays |
|---|-------|----------|
| **1** | **Mission Banner** | Current purpose · Community · Role · Current mission · Primary objective |
| **2** | **Today's Priorities** | Approvals · Meetings · Volunteer commitments · Mission deadlines · Community requests · Knowledge awaiting review |
| **3** | **Active Work** | Running workflows · Open missions · Current projects · Assignments · Leadership responsibilities |
| **4** | **Community Panel** | Communities · People · Mentors · Teams · Recent activity · Community Health summary |
| **5** | **Calendar Panel** | Today's meetings · Volunteer shifts · Upcoming deadlines · Training · Community events |
| **6** | **Knowledge Panel** | Recent stories · Lessons · Playbooks · Community Brain updates · Learning recommendations |
| **7** | **Intelligence Panel** | AI recommendations · Community Intelligence · Operational Intelligence · Digital Twin summary · Growth suggestions |
| **8** | **Activity Timeline** | Recent actions · Workflow history · Community Event Ledger · Notifications · Mission updates |

**[UXB-DAW06a]** Today's Priorities always answers: **"Start here."**

---

## Workspace Types

**[UXB-DAW07]** Eight primary workspaces:

| Workspace | Answers / Focuses On |
|-----------|----------------------|
| **Personal Operating System** | What should I do today? — Calendar, communities, growth, volunteer work, leadership, knowledge, Personal Digital Twin |
| **Volunteer Success Center** | Opportunities, commitments, training, recognition, mentorship, growth |
| **Mission Operations Center** | Mission execution, tasks, volunteers, resources, calendar, knowledge, community impact |
| **Leadership Academy** | Leadership development, mentorship, succession, learning, portfolio, community health |
| **Community Workspace** | Community health, members, calendar, knowledge, committees, partnerships, growth |
| **County Workspace** | County initiatives, communities, institutions, coverage, leadership, regional intelligence |
| **Knowledge Observatory** | Knowledge growth, playbooks, stories, lessons, Community Brain, innovation |
| **Executive Operations Center** | Operational Intelligence, Community Health, leadership, growth, platform readiness, executive briefings |

---

## Workspace Principles

**[UXB-DAW08]** Every workspace should:

Have one primary purpose · Limit cognitive load · Surface current priorities · Preserve context · Support collaboration · Encourage learning · Promote action

---

## Workspace Memory

**[UXB-DAW09]** The platform remembers:

Pinned panels · Preferred layout · Frequently used tools · Recent work · Open missions · Workspace history

**[UXB-DAW09a]** **Returning feels natural.**

---

## Personalization

**[UXB-DAW10]** Participants may customize:

Panel order · Favorites · Shortcuts · Saved searches · Pinned communities · Preferred calendar view

**[UXB-DAW10a]** **Personalization should not destroy consistency.**

---

## Dashboard Context

**[UXB-DAW11]** Dashboards adapt to:

Current role · Current mission · Leadership responsibilities · Community · Calendar · Pending workflows

**[UXB-DAW11a]** **Context is dynamic.**

---

## Workspace Relationships

**[UXB-DAW12]** Every workspace connects naturally to others:

Mission → Volunteer → Leadership → Knowledge → Community → Executive

**[UXB-DAW12a]** **Navigation reflects relationships rather than isolated applications** [UXB-NAV18].

---

## Mobile Experience

**[UXB-DAW13]** Mobile dashboards emphasize:

Today's priorities · Current mission · Quick actions · Notifications · Calendar · Community

**[UXB-DAW13a]** **Large panels become progressive views** [UXB-EDS16].

---

## AI Workspace

**[UXB-DAW14]** Every workspace includes an AI assistant aware of:

Current context · Current mission · Current community · Current calendar · Current workflow · Current knowledge

**[UXB-DAW14a]** **AI always understands where it is** [UXB-EDS17 · DAB-013].

---

## Digital Twin Integration

**[UXB-DAW15]** Each workspace surfaces the relevant Digital Twin:

| Workspace | Twin |
|-----------|------|
| Personal OS | Participant Twin |
| Mission Operations Center | Mission Twin |
| Community Workspace | Community Twin |
| Executive Operations Center | Platform Twin |

**[UXB-DAW15a]** **Digital Twins become operational companions** [ENG-008 · LDT-001].

---

## Community Event Ledger

**[UXB-DAW16]** Dashboards surface:

Recent events · Historical context · Activity · Milestones · Mission history

**[UXB-DAW16a]** **Institutional memory remains visible** [DAB-007].

---

## Major Architectural Recommendation: Adaptive Workspace Engine

**[UXB-DAW17]** Create an **Adaptive Workspace Engine (AWE)** that continuously composes each participant's workspace based on operational context — **not fixed dashboards**.

**[UXB-DAW17a]** The AWE dynamically assembles workspaces using seven composition layers:

| Layer | Sources |
|-------|---------|
| **Identity** | Role · Leadership responsibilities · Communities · Permissions |
| **Current Work** | Active missions · Workflow stage · Pending approvals · Volunteer assignments |
| **Time** | Calendar · Deadlines · Meeting preparation · Travel |
| **Intelligence** | Community Intelligence · Operational Intelligence · AI recommendations · Community Health |
| **Knowledge** | Relevant playbooks · Lessons · Community Brain · Stories |
| **Relationships** | Teams · Mentors · Volunteers · Committees · Partners |
| **Personal Preferences** | Pinned panels · Preferred layouts · Accessibility settings · Frequently used tools |

**[UXB-DAW17b]** Instead of showing the same dashboard every morning, the AWE constructs **today's workspace**:

- Before a leadership meeting → Leadership Academy emphasizes agenda, community health, unresolved approvals
- During a mission weekend → Mission Operations Center moves volunteer coordination, logistics, communication to the top
- After mission concludes → Workspace shifts to reflection, knowledge capture, recognition, follow-up

**[UXB-DAW17c]** **The workspace evolves with the participant's work** rather than requiring constant adaptation to static software.

**[UXB-DAW17d]** Architectural principle:

> **Participants should experience a living workspace that responds to their responsibilities, not a fixed dashboard that forces them to hunt for what matters.**

**[UXB-DAW17e]** Combined with the Intent Navigation Engine [UXB-NAV22], both **navigation and workspaces adapt to human purpose** — the COS feels less like an application and more like an **intelligent operating environment**.

**[UXB-DAW17f]** Live spec: `data/registry/dashboard-architecture.json` · `adaptiveWorkspaceEngine`

---

## Burt Implementation Guidance

**[UXB-DAW18]** Implementation should:

1. Treat dashboards as **operational workspaces** rather than reporting pages
2. Keep a **consistent workspace structure**
3. Surface **priorities before analytics**
4. Integrate **AI, Digital Twins, Community Event Ledger, and Community Intelligence** into every workspace
5. **Preserve context** across workspace transitions
6. Build **mobile-first**
7. Consult **Adaptive Workspace Engine** spec before dashboard-facing features

**[UXB-DAW18a]** Logical home: Experience Architecture schema — WorkspacePanel · WorkspaceType · DashboardContext · AdaptiveWorkspaceEngine.

**[UXB-DAW18b]** Foundational workspace patterns also inform [4.7 Workspace Architecture](WORKSPACE_ARCHITECTURE.md) [UXB-008] for extended workspace specialization.

---

## AC-139 — Acceptance Criteria

Volume 4.3 is complete when:

- [x] **[AC-139a]** Workspace philosophy is documented. `[UXB-DAW03–DAW05]`
- [x] **[AC-139b]** Universal dashboard layout is defined. `[UXB-DAW06]`
- [x] **[AC-139c]** All primary workspaces are specified. `[UXB-DAW07]`
- [x] **[AC-139d]** Personalization, AI, Digital Twin, Community Event Ledger, and mobile integrations are established. `[UXB-DAW09–DAW16]`
- [x] **[AC-139e]** Adaptive Workspace Engine specified. `[UXB-DAW17]`
- [x] **[AC-139f]** Burt has a complete blueprint for implementing operational workspaces across the Community Operating System. `[UXB-DAW18]`

---

**Next step:** [4.4 — User Journey Architecture](USER_JOURNEY_ARCHITECTURE.md) [UXB-005]

**End of Volume 4.3.**
