# Execution Operating System

**Document ID:** PHASE-005.3  
**Artifact:** `EXECUTION_OPERATING_SYSTEM.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 5 — Action Operating System  
**Acronym:** EOS

> **People complete missions. Tasks simply describe the work.**

This may be the **single largest module** in the platform — where most organizing software becomes complicated. EOS avoids that trap by building an **Execution System**, not a task manager.

**Requirement:** EOS-001 · **Supersedes:** TWS-001 (Task & Workflow System) · **Governed by:** [Action Constitution ACN-001](ACTION_CONSTITUTION.md)

**Builds On:** [Mission Design System MDS-001](MISSION_DESIGN_SYSTEM.md) · [Mission & Project System MPS-001](../phase-04/MISSION_PROJECT_SYSTEM.md) · [Personal Command Center PCC-001](../phase-03/PERSONAL_COMMAND_CENTER.md) · [Mission Operating Record ACN-M26](ACTION_CONSTITUTION.md)

**Live spec:** `data/registry/execution-operating-system.json`

**Required reading for Burt.**

**Note:** [Experience & Event OS EEOS-001](EXPERIENCE_EVENT_OPERATING_SYSTEM.md) [5.5] — experiences as first-class entities; event-day execution integrates with EOS and VDS.

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| EOS-M01 | Purpose |
| EOS-M02 | Guiding principle |
| EOS-M03 | Execution philosophy |
| EOS-M04 | Execution hierarchy |
| EOS-M05 | Mission Dashboard |
| EOS-M06 | Milestone System |
| EOS-M07 | Work Packages |
| EOS-M08 | Task System |
| EOS-M09 | Task states |
| EOS-M10 | Dependencies |
| EOS-M11 | Assignments |
| EOS-M12 | Adaptive planning |
| EOS-M13 | Automation |
| EOS-M14 | Mobile execution |
| EOS-M15 | Execution history |
| EOS-M16 | Future AI assistance |
| EOS-M17 | Daily Operations Brief |
| EOS-M18 | Three-brief stack |
| EOS-M19 | MDS-001 relationship |
| EOS-M20 | Platform integrations |
| EOS-M21 | V1 scope |
| EOS-BG | Burt implementation guidance |
| AC-050 | Step 5.3 acceptance criteria |

---

## EOS-M01 — Purpose

**[EOS-M01]** The **Execution Operating System** coordinates every action required to move a mission from **planning to successful completion**.

**[EOS-M01a]** Rather than functioning as a traditional task manager, EOS organizes work around **missions, people, milestones, and community impact**.

**[EOS-M01b]** The objective is to make execution **clear, collaborative, and adaptive** [ACN-M14 accountability, ACN-M15 adaptability].

**[EOS-M01c]** Everything that transforms a mission into **completed work** lives here — tasks are one piece, not the product [EOS-M02].

---

## EOS-M02 — Guiding Principle

**[EOS-M02]**

> **People complete missions. Tasks simply describe the work.**

**[EOS-M02a]** People don't wake up wanting to manage tasks — they wake up wanting to **accomplish something meaningful** [PEL-M01, MPS-M01].

**[EOS-M02b]** The platform should **always keep the mission visible** while organizing execution [MPS-M06 Mission HQ, EOS-M05 Mission Dashboard].

---

## EOS-M03 — Execution Philosophy

**[EOS-M03]** Execution should answer:

| Question | EOS component |
|----------|---------------|
| What are we trying to accomplish? | Mission Dashboard [EOS-M05] |
| What needs to happen next? | Daily Operations Brief [EOS-M17] |
| Who can help? | Assignments [EOS-M11] · VDS-001 |
| What capacity is needed? | CCS-001 · work packages [EOS-M07] |
| Are we making progress? | Milestones [EOS-M06] |
| What should we learn? | Execution history [EOS-M15] → MOR [ACN-M26] |

---

## EOS-M04 — Execution Hierarchy

**[EOS-M04]** Every mission follows the same structure:

```text
Mission
        ↓
Project
        ↓
Milestone
        ↓
Work Package
        ↓
Task
        ↓
Activity
        ↓
Completion
```

**[EOS-M04a]** Extends Action Hierarchy [ACN-M08] with **Work Package** — tasks naturally belong together [EOS-M07].

**[EOS-M04b]** Every participant should understand **where their work fits** within the larger mission [MDS-M08, MPS-M03].

**[EOS-M04c]** **No orphan tasks** — every task links: mission → project → milestone → work package [ACN-M19 mission-first].

---

## EOS-M05 — Mission Dashboard

**[EOS-M05]** Every mission receives an **operational dashboard** — the mission's command center.

**[EOS-M05a]** Displays:

| Widget | Content |
|--------|---------|
| Mission status | Lifecycle stage [MDS-M04] |
| Current milestone | Active phase [EOS-M06] |
| Upcoming work | Next tasks and packages |
| Volunteer needs | Open roles [VDS-001] |
| Timeline | TSOS-001 integration |
| Community impact | Progress toward canvas indicators [MDS-M13] |
| Risks | From canvas [MDS-M12] + live blockers |
| Capacity | CCS-001 status |
| Recent activity | Execution feed |
| Quick actions | Confirm, remind, upload, assign |

**[EOS-M05b]** Extends Mission HQ [MPS-M06] with **execution-layer widgets** — mission statement always visible first [MPS-M17a].

**[EOS-M05c]** Route: `/mission/[slug]` — Mission Dashboard is primary execution view.

---

## EOS-M06 — Milestone System

**[EOS-M06]** Milestones divide large missions into **manageable phases** — creating momentum [MPS-M08].

**[EOS-M06a]** Examples:

- Planning Complete
- Venue Reserved
- Volunteers Recruited
- Training Completed
- Event Day
- Follow-up
- Reflection
- Knowledge Archive

**[EOS-M06b]** Milestone completion triggers **celebration** [ACN-M16] and progress updates on Mission Dashboard [EOS-M05].

**[EOS-M06c]** Orchestrator: `advanceMilestone(missionId, milestoneId)` · `getMilestoneProgress(missionId)`.

---

## EOS-M07 — Work Packages

**[EOS-M07]** **Work Packages** — tasks naturally belong together; communities organize work into **meaningful packages**, not dozens of isolated tasks.

**[EOS-M07a]** Examples:

| Package | Typical tasks |
|---------|---------------|
| Communications | Announcements, reminders, social posts |
| Volunteer | Recruitment, training, scheduling |
| Technology | AV setup, registration systems |
| Logistics | Venue, transportation, supplies |
| Photography | Coverage, uploads, permissions |
| Training | Materials, sessions, checklists |

**[EOS-M07b]** Packages are **reusable templates** — fork from Mission Library [MDS-M20] or prior MORs [ACN-M26].

**[EOS-M07c]** Assignment at package level optional — primary owner for whole package plus task-level owners [EOS-M11].

**[EOS-M07d]** Orchestrator: `createWorkPackage(missionId, templateKey)` · `assignWorkPackage(packageId, ownerId)`.

---

## EOS-M08 — Task System

**[EOS-M08]** Every task includes:

| Field | Purpose |
|-------|---------|
| Title | Short description |
| Purpose | Why this task matters to the mission |
| Description | How to complete |
| Mission | Parent mission ID |
| Project | Parent project ID |
| Milestone | Parent milestone ID |
| Work Package | Parent package ID |
| Owner | Primary steward [EOS-M11] |
| Collaborators | Supporting participants |
| Priority | Relative urgency |
| Status | [EOS-M09] |
| Dependencies | [EOS-M10] |
| Estimated effort | Planning aid |
| Due date | Timeline alignment [TSOS-001] |
| Completion notes | Knowledge capture |
| Related files | Resource links |
| Knowledge links | Playbooks [CKLS-001] |

**[EOS-M08a]** Tasks **remain connected to the larger mission** — purpose field required, not optional [EOS-M02].

**[EOS-M08b]** Subtasks supported as **activities** [EOS-M04] — lightweight, no deep nesting.

---

## EOS-M09 — Task States

**[EOS-M09]** Suggested workflow — communicates progress **without unnecessary complexity**:

```text
Not Started → Ready → In Progress → Waiting → Blocked → Needs Review → Completed → Archived
```

| State | Meaning |
|-------|---------|
| Not Started | Defined but not begun |
| Ready | Dependencies met, can start |
| In Progress | Active work |
| Waiting | Blocked on external input |
| Blocked | Dependency or resource issue |
| Needs Review | Complete, awaiting approval |
| Completed | Done |
| Archived | Historical — feeds MOR [ACN-M26] |

**[EOS-M09a]** State transitions logged append-only [STS-001, execution history EOS-M15].

---

## EOS-M10 — Dependencies

**[EOS-M10]** The platform understands **relationships between tasks**.

**[EOS-M10a]** Examples:

- Task B cannot begin until Task A finishes
- Volunteer training precedes event setup
- Venue confirmation precedes public announcement

**[EOS-M10b]** Dependencies help communities **coordinate effectively** — surfaced on Mission Dashboard and Daily Operations Brief [EOS-M17].

**[EOS-M10c]** Orchestrator: `addTaskDependency(taskId, dependsOnTaskId)` · `getBlockedTasks(missionId)` · `detectDependencyConflicts(missionId)`.

**[EOS-M10d]** Blocked tasks auto-transition to **Blocked** or **Waiting** state [EOS-M09].

---

## EOS-M11 — Assignments

**[EOS-M11]** Assignments emphasize **collaboration** — not single-owner silos [ACN-M11].

**[EOS-M11a]** Roles:

| Role | Responsibility |
|------|----------------|
| Primary owner | Stewardship, follow-through [ACN-M09] |
| Supporting participant | Contributes to completion |
| Mentor | Guidance [PGL-001] |
| Reviewer | Approves Needs Review tasks |
| Observer | Visibility without ownership |

**[EOS-M11b]** Participants may have **different responsibilities within the same task** — multiple roles supported.

---

## EOS-M12 — Adaptive Planning

**[EOS-M12]** Execution should remain **flexible** [ACN-M15 adaptability].

**[EOS-M12a]** Plans adapt when:

- Volunteers unavailable
- Weather changes
- Resources delayed
- Community priorities shift

**[EOS-M12b]** Adaptation **without losing historical context** — original plan preserved; changes versioned append-only [EOS-M15, MOR].

**[EOS-M12c]** Milestone dates may shift; tasks re-prioritized; work packages reorganized — mission purpose unchanged [MDS-M05].

---

## EOS-M13 — Automation

**[EOS-M13]** Future automation may include:

- Recurring tasks
- Automatic reminders [CFS-001]
- Checklist generation from templates
- Milestone progression triggers
- Volunteer scheduling [VDS-001]
- Template reuse [MDS-M16]

**[EOS-M13a]** Automation removes **repetitive work — not decision-making** [ACN-M19 advise don't decide].

**[EOS-M13b]** All automation **opt-in per community** with visible rules.

---

## EOS-M14 — Mobile Execution

**[EOS-M14]** Mobile experience emphasizes **action** — field work easy from a phone [CCC-M mobile-first parallel].

**[EOS-M14a]** Mobile capabilities:

- Check off work
- Upload photos [CST-001]
- Record notes
- Request help
- Scan QR codes [EEOS-001 events]
- View today's priorities [EOS-M17 Daily Operations Brief]

**[EOS-M14b]** Daily Operations Brief is **mobile-first primary surface** for execution [EOS-M17].

---

## EOS-M15 — Execution History

**[EOS-M15]** Every completed task contributes to:

| Destination | Requirement |
|-------------|-------------|
| Mission Operating Record | ACN-M26 |
| Community Brain | CKLS-001 |
| Community Legacy | CLS-001 |
| Participant Timeline | CJT-001 |
| Capability Graph | CCE-001 |
| Knowledge Library | CKLS-001 · MDS-M20 |

**[EOS-M15a]** **Execution creates institutional memory** — nothing completed is discarded [ACN-M17 preservation].

**[EOS-M15b]** Append-only task history — who did what, when, with what outcome.

---

## EOS-M16 — Future AI Assistance

**[EOS-M16]** Future AI may:

- Suggest next tasks
- Identify bottlenecks
- Recommend volunteers [VDS-001]
- Surface relevant playbooks [CKLS-001]
- Estimate timelines
- Detect dependency conflicts [EOS-M10]
- Recommend process improvements

**[EOS-M16a]** AI **assists execution without taking control** [OPIS-001 advisory only, ACN-M19].

**[EOS-M16b]** All suggestions **explainable** — show reasoning and source data.

---

## EOS-M17 — Daily Operations Brief

**[EOS-M17]** **Daily Operations Brief (DOB)** — signature feature of the Execution Operating System.

**[EOS-M17a]** Rather than opening a list of tasks, participants see a **personalized Daily Operations Brief** — the most frequently used execution screen on the platform.

**[EOS-M17b]** Example:

```text
Good morning, Sarah.

Today's priorities:
· Food Drive setup begins at 3:00 PM
· Three volunteers still need transportation
· Your Communications Work Package has two remaining tasks
· Photography is fully staffed
· Weather forecast looks favorable
· Your team completed 82% of this week's milestone
· One new participant volunteered yesterday — could use a welcome message

Quick actions:
· Confirm volunteer arrival
· Send event reminder
· Upload today's photos
· Review tomorrow's schedule
```

**[EOS-M17c]** The participant **doesn't search for work** — the platform surfaces **what matters today** [PCC-M Morning Brief parallel at mission scope].

**[EOS-M17d]** DOB aggregates: timeline [TSOS-001] · tasks [EOS-M08] · volunteers [VDS-001] · milestones [EOS-M06] · weather/context · team progress · new participants [NET-001].

**[EOS-M17e]** Orchestrator: `generateDailyOperationsBrief(participantId, missionId?, date)` — mission-scoped or cross-mission for active assignments.

**[EOS-M17f]** Database: `DB-DOB` · table: `daily_operations_briefs` (cached snapshots, regenerated on demand).

---

## EOS-M18 — Three-Brief Stack

**[EOS-M18]** Daily Operations Brief completes the **three-brief operational stack**:

| Brief | Scope | Requirement | Question answered |
|-------|-------|-------------|-------------------|
| **Morning Brief** | Personal | PCC-001 | What matters to me today? |
| **Community Pulse** | Community | CCC-001 | How is my community doing? |
| **Daily Operations Brief** | Mission execution | EOS-M17 | What work needs doing today? |

**[EOS-M18a]** Together they create a platform that feels **aware, organized, and supportive** — not overwhelming [CAM-001 attention budget].

**[EOS-M18b]** Intelligent operational companion — not traditional project management [EOS-M02].

---

## EOS-M19 — MDS-001 Relationship

**[EOS-M19]** Execution begins **after** Mission Design [MDS-M04] — no tasks until Design → Review complete.

| MDS-001 (Design) | EOS-001 (Execution) |
|------------------|---------------------|
| Mission Canvas 10 sections | Work packages and tasks |
| Success indicators defined | Progress measured against them |
| Knowledge capture planned | Completion notes captured |
| Risks identified | Blocked states when risks materialize |
| Skills/capacity needed | Assignments and CCS-001 |

**[EOS-M19a]** Mission Dashboard [EOS-M05] displays canvas summary — purpose always visible [MDS-M05 mission statement].

---

## EOS-M20 — Platform Integrations

**[EOS-M20]** Execution Operating System integrates:

| System | Integration |
|--------|-------------|
| ACN-001 | Mission-first; execution history → MOR |
| MDS-001 | Design complete before tasks |
| MPS-001 | Mission HQ shell, project layer |
| TSOS-001 | Timeline, due dates, DOB schedule |
| VDS-001 | Volunteer needs on dashboard and DOB |
| CCS-001 | Capacity status |
| EEOS-001 | Event-day execution, QR check-in |
| PCC-001 | Morning Brief ↔ DOB personal layer |
| CCC-001 | Community Pulse ↔ mission progress |
| OPIS-001 | Advisory execution assistance |

---

## EOS-M21 — V1 Scope

**[EOS-M21]** Step 5.3 deliverables:

| Capability | V1 |
|------------|-----|
| Execution OS philosophy | ✅ Documented |
| Execution hierarchy with work packages | ✅ Spec |
| Mission Dashboard architecture | ✅ Spec |
| Milestones, tasks, dependencies, assignments | ✅ Spec |
| Daily Operations Brief architecture | ✅ Spec |
| Three-brief stack | ✅ Spec |
| Mobile-first execution principles | ✅ Spec |
| Task UI implementation | Stub |
| DOB generation | v1.1 |
| Automation | Future [EOS-M13] |

---

## EOS-BG — Burt Implementation Guidance

**[EOS-BG]** Implementation should:

1. **Build EOS around missions** — not isolated task lists [EOS-M01, EOS-M04]
2. **Support reusable work package templates** [EOS-M07, MDS-M16]
3. **Separate task execution from mission planning** [MDS-M04, EOS-M19]
4. **Maintain complete execution history** — append-only [EOS-M15, ACN-M26]
5. **Optimize mobile workflows** — DOB as primary mobile surface [EOS-M14, EOS-M17]
6. **Prepare for future AI orchestration** — advisory hooks [EOS-M16]
7. **Implement Daily Operations Brief** — aggregate, don't duplicate module data [EOS-M17]
8. **Keep mission statement visible** on every execution view [EOS-M02, MPS-M07]

**[EOS-BG-a]** Recommended structure:

```
src/lib/execution/createWorkPackage.ts
src/lib/execution/createTask.ts
src/lib/execution/advanceMilestone.ts
src/lib/execution/addTaskDependency.ts
src/lib/execution/generateDailyOperationsBrief.ts
src/components/mission/MissionDashboard.tsx
src/components/mission/WorkPackageBoard.tsx
src/components/mission/DailyOperationsBrief.tsx
src/components/mission/TaskCard.tsx
data/registry/execution-operating-system.json
```

**[EOS-BG-b]** Database: `DB-EOS` — tables: `milestones`, `work_packages`, `execution_tasks`, `task_dependencies`, `task_assignments`.

---

## AC-050 — Acceptance Criteria

Step 5.3 is complete when:

- [x] **[AC-050a]** Execution Operating System philosophy documented. `[EOS-M01, EOS-M02, EOS-M03]`
- [x] **[AC-050b]** Mission-centered execution hierarchy established. `[EOS-M04, EOS-M05]`
- [x] **[AC-050c]** Work packages, tasks, milestones, and dependencies defined. `[EOS-M06, EOS-M07, EOS-M08, EOS-M09, EOS-M10]`
- [x] **[AC-050d]** Mobile-first execution and adaptive planning incorporated. `[EOS-M12, EOS-M14]`
- [x] **[AC-050e]** Daily Operations Brief architecture specified. `[EOS-M17, EOS-M18]`
- [x] **[AC-050f]** Burt has blueprint for operational engine powering every mission. `[EOS-BG, execution-operating-system.json]`

---

**Next Step:** 5.4 — Volunteer Development System

*Trace: Designed mission → work packages → tasks with purpose → Daily Operations Brief surfaces today's work → milestones mark progress → execution history feeds MOR → next mission starts stronger*
