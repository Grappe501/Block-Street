# Mission & Project System

**Document ID:** PHASE-004.5  
**Artifact:** `MISSION_PROJECT_SYSTEM.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 4 — Community Operating System

> **People volunteer for meaningful missions—not task lists.**

Another **philosophical shift**: most software treats projects as **things to manage**. ASYON treats them as **missions**.

A mission has purpose, people, outcomes, stories, memories, and legacy. A **project** is simply the organizational structure that executes the mission.

**The mission inspires people. The project organizes the work.**

**Builds On:** [Team & Working Group System](TEAM_WORKING_GROUP_SYSTEM.md) · [Community Command Center](COMMUNITY_COMMAND_CENTER.md) · [Community Growth & Sustainability](COMMUNITY_GROWTH_SUSTAINABILITY.md) · [Status & Lifecycle Framework](../phase-02/CANONICAL_STATUS_LIFECYCLE_FRAMEWORK.md)

**Live spec:** `data/registry/mission-project-system.json`

**Requirement:** MPS-001

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| MPS-M01 | Purpose |
| MPS-M02 | Guiding principle |
| MPS-M03 | Philosophy — mission / project / tasks |
| MPS-M04 | Mission types |
| MPS-M05 | Project lifecycle |
| MPS-M06 | Mission Headquarters |
| MPS-M07 | Mission statement |
| MPS-M08 | Mission goals |
| MPS-M09 | Milestones |
| MPS-M10 | Volunteer opportunities |
| MPS-M11 | Resource management |
| MPS-M12 | Reflection & lessons learned |
| MPS-M13 | Community impact |
| MPS-M14 | Project relationships |
| MPS-M15 | Mission Canvas architecture |
| MPS-M16 | TWG integration |
| MPS-M17 | CCC integration |
| MPS-M18 | STS-001 integration |
| MPS-M19 | V1 scope |
| MPS-BG | Burt implementation guidance |
| AC-038 | Step 4.5 acceptance criteria |

---

## MPS-M01 — Purpose

**[MPS-M01]** The **Mission & Project System** provides the structure communities use to turn **ideas into meaningful action**.

**[MPS-M01a]** Every mission exists to **improve a community** — campus, county, neighborhood, or statewide.

**[MPS-M01b]** Projects provide the **operational framework** that transforms missions into measurable outcomes.

**[MPS-M01c]** The platform should encourage participants to organize around **purpose** rather than simply completing tasks.

**[MPS-M01d]** Terminology: use **Mission & Project System** (not "Project System" alone). Mission is the **why**; project is the **how**.

---

## MPS-M02 — Guiding Principle

**[MPS-M02]**

> **People volunteer for meaningful missions—not task lists.**

**[MPS-M02a]** The software should **always communicate why the work matters** before describing how it will be accomplished.

**[MPS-M02b]** Complementary principles:

| Source | Principle |
|--------|-----------|
| TWG-M03 | Teams provide action; missions provide purpose |
| CGS-M07 | Institutional memory — missions become community legacy |
| OBE-001 | Belonging through meaningful contribution |
| PEL-M13 | Does this help people grow into community builders? |

---

## MPS-M03 — Philosophy

**[MPS-M03]** Three questions, three layers — **hierarchy preserved throughout every workflow**:

| Layer | Question | Role |
|-------|----------|------|
| **Mission** | Why are we doing this? | Purpose, inspiration, legacy |
| **Project** | How will we accomplish it? | Plan, timeline, structure |
| **Tasks** | What needs to happen next? | Execution steps (Phase 5+) |

**[MPS-M03a]** A mission has:

- Purpose
- People
- Outcomes
- Stories
- Memories
- Legacy

**[MPS-M03b]** A project is the **organizational structure** — tasks, timelines, resources, roles — subordinate to mission identity. Never collapse mission into a task board.

**[MPS-M03c]** Full organizing stack:

```
Community (identity) → Team (action) → Mission (purpose) → Project (execution) → Tasks (steps)
```

---

## MPS-M04 — Mission Types

**[MPS-M04]** Configurable mission categories — **future types added without redesign**:

| Type | Example |
|------|---------|
| Community Service | Food drive, neighborhood cleanup |
| Campus Improvement | Welcome week, campus beautification |
| Leadership Development | Leadership retreat, mentor program |
| Volunteer Outreach | Registration table, phone bank |
| Educational Programs | Civic education workshop |
| Civic Engagement | Debate watch, town hall |
| Fundraising | Where applicable and approved |
| Environmental Projects | Tree planting, recycling drive |
| Student Success | Tutoring, orientation support |
| Neighborhood Support | Senior check-ins, resource delivery |
| Community Celebrations | Awards ceremony, end-of-year gathering |
| Emergency Response | Future — disaster coordination |

**[MPS-M04a]** `missionType` is configurable — not locked to a fixed enum at implementation time.

---

## MPS-M05 — Project Lifecycle

**[MPS-M05]** Every project follows a lifecycle — extends [STS-001]:

```
Idea
    ↓
Proposal
    ↓
Planning
    ↓
Approved
    ↓
Recruiting
    ↓
Active
    ↓
Milestone Review
    ↓
Completed
    ↓
Celebrated
    ↓
Archived
```

**[MPS-M05a]** **Every completed mission preserved** as part of community legacy [CGS-M07, CLS-001] — never deleted on archive.

**[MPS-M05b]** Celebration and reflection are **required stages**, not optional afterthoughts [MPS-M12].

**[MPS-M05c]** Orchestrator: `deriveMissionLifecycleStage(missionId)` — independent from team lifecycle [TWG-M06] and community lifecycle [CGS-M04].

---

## MPS-M06 — Mission Headquarters

**[MPS-M06]** Every mission receives its own **workspace** — Mission Headquarters.

**[MPS-M06a]** Includes:

- Mission Statement
- Purpose
- Project Plan
- Timeline
- Team Members
- Volunteer Needs
- Resources
- Calendar
- Updates
- Photos
- Documents
- Recognition
- Lessons Learned

**[MPS-M06b]** Headquarters becomes the **operational center** for the mission — CCC-consistent shell [CCC-001]. Route: `/mission/[slug]` [PAGE-MISSION].

**[MPS-M06c]** Missions may receive Community Command Center treatment — familiar widgets, mission-scoped data, Community DNA of parent community [CID-001].

---

## MPS-M07 — Mission Statement

**[MPS-M07]** Every mission begins with a **simple statement** — visible throughout the mission lifecycle:

| Example |
|---------|
| "Provide healthy meals to local families." |
| "Welcome every new student to campus." |
| "Help register first-time voters." |
| "Beautify the community park." |

**[MPS-M07a]** Purpose remains **visible** in Mission Headquarters header, Community Pulse items, and Opportunity widget — never buried in settings.

**[MPS-M07b]** Mission statement is the **first field** in Mission Canvas [MPS-M15] — completed before project planning begins.

---

## MPS-M08 — Mission Goals

**[MPS-M08]** Each mission defines:

| Field | Emphasis |
|-------|----------|
| Objectives | What we aim to achieve |
| Expected outcomes | What changes when we succeed |
| Success indicators | How we know it worked |
| Timeline | When milestones occur |
| Community benefit | Who gains and how |

**[MPS-M08a]** Goals emphasize **impact rather than volume** — relationships formed, not just headcount [MPS-M13, OIS-M14].

---

## MPS-M09 — Milestones

**[MPS-M09]** Projects **celebrate progress** — milestones encourage momentum:

- Planning completed
- First volunteer joined
- Halfway point
- Community event held
- Mission accomplished
- Reflection completed

**[MPS-M09a]** Milestones surface in:

- Mission Headquarters timeline
- Community Feed [CCC-M10]
- Recognition widget [CCC-M16, CRA-001]
- Participant Civic Journey [CJT-001]

**[MPS-M09b]** Milestone Review lifecycle stage [MPS-M05] triggers reflection prompt [MPS-M12].

---

## MPS-M10 — Volunteer Opportunities

**[MPS-M10]** Participants easily discover ways to help:

| Role | Mission context |
|------|-----------------|
| Photography | Document the event |
| Transportation | Get volunteers to site |
| Setup | Prepare the space |
| Communications | Spread the word |
| Research | Gather information |
| Teaching | Lead a session |
| Registration | Sign people up |
| Cleanup | Close out the mission |

**[MPS-M10a]** **Every mission clearly explains where help is needed** — role, time commitment, skills, impact statement.

**[MPS-M10b]** Future: skills matching via Participant Context Engine [PDT-001] and Growth Graph [PGL-001].

**[MPS-M10c]** Volunteer opportunities surface in Opportunity widget [CCC-M08] and Opportunity & Belonging Engine [OBE-001].

---

## MPS-M11 — Resource Management

**[MPS-M11]** Projects may include:

- Files
- Graphics
- Budgets (where applicable)
- Meeting notes
- Training materials
- Checklists
- Contacts

**[MPS-M11a]** Resources remain **organized around the mission** — not scattered across generic file storage.

**[MPS-M11b]** Connects to Community Knowledge Base [4.8] and Capability Exchange [4.9] — successful mission resources may become **templates** for future missions [MPS-M15].

---

## MPS-M12 — Reflection & Lessons Learned

**[MPS-M12]** Every completed mission captures:

- What worked well
- What could improve
- Unexpected discoveries
- Community stories
- Volunteer reflections
- Future recommendations

**[MPS-M12a]** **Communities become wiser through experience** [CGS-M07] — append-only lessons learned, never overwritten.

**[MPS-M12b]** Reflection is a **required step** before archive — Celebrated → Reflection completed → Archived.

**[MPS-M12c]** Lessons feed Mission Canvas templates [MPS-M15] — future organizers inherit wisdom.

---

## MPS-M13 — Community Impact

**[MPS-M13]** Projects document **outcomes** — emphasize community improvement, not organizational achievement:

| Impact type | Example |
|-------------|---------|
| People served | Families fed, students welcomed |
| Environmental | Trees planted, acres cleaned |
| Distribution | Meals distributed, supplies delivered |
| Reach | Students reached, voters registered |
| Engagement | Volunteers engaged, hours contributed |
| Relationships | New connections formed |
| Stories | Impact narratives collected |

**[MPS-M13a]** Impact data feeds Community Intelligence [CIS-001] — **health metrics, not vanity metrics** [CGS-M08].

**[MPS-M13b]** Stories collected become [Community Legacy CLS-001] and Recognition [CRA-001] content.

---

## MPS-M14 — Project Relationships

**[MPS-M14]** Every project connects to the **Registry graph** [REL-001]:

| Relationship | Edge |
|--------------|------|
| Community | Mission belongs to campus/county |
| Team | Mission created by team [TWG-M12] |
| Participants | Volunteers, leaders, mentors |
| Events | Calendar entries [4.6] |
| Resources | Files, templates, knowledge |
| Volunteer opportunities | Open roles |
| Recognition | Milestones, appreciation |
| Timeline | Status transitions [STS-001] |

**[MPS-M14a]** The Registry **understands these relationships** — queryable, traceable, never orphaned records.

---

## MPS-M15 — Mission Canvas Architecture

**[MPS-M15]** **Signature feature.** Before a project begins, organizers complete a **Mission Canvas** — not a task list.

**[MPS-M15a]** Canvas questions:

1. Why does this mission matter?
2. Who benefits?
3. Who should be involved?
4. What skills are needed?
5. What resources are required?
6. What does success look like?
7. What risks should we anticipate?
8. How will we celebrate completion?
9. What should future organizers learn from this mission?

**[MPS-M15b]** The Mission Canvas becomes the **blueprint for every project** — stored alongside the mission record, versioned, append-only.

**[MPS-M15c]** When future communities launch similar missions, they **start with proven templates and lessons learned** [MPS-M12] — not reinventing the process.

**[MPS-M15d]** Philosophy: *Capture knowledge, develop people, and leave every community stronger than you found it.* [CGS-M02, KDG-001]

**[MPS-M15e]** Orchestrator: `createMissionCanvas(missionId)` — returns structured canvas payload linked to mission.

**[MPS-M15f]** V1: spec + canvas form stub; full template library in v1.1.

---

## MPS-M16 — Team & Working Group Integration

**[MPS-M16]** Teams create missions [TWG-M12]:

- `teamId` on every mission record
- Team Headquarters lists linked missions
- Micro Teams may spawn single missions that grow into multi-project campaigns

**[MPS-M16a]** **Missions and teams are separate entities** — a team may run many missions; a mission may involve multiple teams via cross-team collaboration [TWG-M13].

**[MPS-M16b]** Mission Canvas "Who should be involved?" links to team membership and cross-team edges.

---

## MPS-M17 — Community Command Center Integration

**[MPS-M17]** Missions surface in Community Command Center [CCC-001]:

| Surface | Content |
|---------|---------|
| **Projects widget** | Active missions, upcoming initiatives, completed work, volunteer needs |
| **Opportunity widget** | Open volunteer roles from active missions |
| **Community Pulse** | "Two missions need volunteers this week" |
| **Quick Action** | Start Mission |
| **Recognition widget** | Mission milestones and celebrations |

**[MPS-M17a]** Widget displays **mission statement first**, project status second — never task count without context [MPS-M02].

---

## MPS-M18 — STS-001 Integration

**[MPS-M18]** Mission lifecycle extends [STS-001] status timeline:

- Status transitions logged append-only
- Idea → Proposal requires Mission Canvas draft [MPS-M15]
- Completed → Celebrated → Archived requires reflection [MPS-M12]
- Dashboard queries derive from status

---

## MPS-M19 — V1 Scope

**[MPS-M19]** Jul 12 leader testing / Jul 14 launch minimum:

| Deliverable | Scope |
|-------------|-------|
| Mission philosophy & lifecycle | Documented — this step |
| Mission Canvas spec | Form stub |
| Mission entity schema | Graph node + status timeline spec |
| Missions widget | Static cards on Community Command Center |
| Mission Headquarters | Placeholder route `/mission/[slug]` |
| Full mission workspace | v1.1 |

**[MPS-M19a]** Deferred: task management, skills matching, budget tracking, template library, automated lifecycle transitions.

---

## MPS-BG — Burt Implementation Guidance

**[MPS-BG]** Implementation should:

1. **Separate mission identity from project execution** — mission record + project plan sub-records [MPS-M03]
2. **Support reusable project templates** — from completed missions + Mission Canvas [MPS-M15]
3. **Preserve project history** — append-only archive [CGS-M07]
4. **Maintain relationships** with communities, teams, participants [MPS-M14]
5. **Allow future expansion** without redesign — configurable mission types
6. **Design Mission Headquarters** using modular CCC components [MPS-M06]

**[MPS-BG-a]** Recommended file structure:

```
src/lib/missions/createMission.ts
src/lib/missions/createMissionCanvas.ts
src/lib/missions/deriveMissionLifecycleStage.ts
src/components/ccc/widgets/MissionsWidget.tsx
src/app/mission/[slug]/page.tsx
data/registry/mission-project-system.json
```

**[MPS-BG-b]** Database: `missions` table with `mission_statement`, `mission_type`, `team_id`, `community_id`, `lifecycle_status`, `canvas_id`, `impact_summary`.

**[MPS-BG-c]** **PRJ-001 references migrate to MPS-001** — project is execution layer within mission system.

---

## AC-038 — Acceptance Criteria

Step 4.5 is complete when:

- [x] **[AC-038a]** Mission-first philosophy documented. `[MPS-M01, MPS-M03]`
- [x] **[AC-038b]** Project lifecycle established. `[MPS-M05]`
- [x] **[AC-038c]** Mission Headquarters defined. `[MPS-M06, MPS-M07]`
- [x] **[AC-038d]** Reflection and community impact incorporated. `[MPS-M12, MPS-M13]`
- [x] **[AC-038e]** Mission Canvas architecture specified. `[MPS-M15]`
- [x] **[AC-038f]** TWG and CCC integration documented. `[MPS-M16, MPS-M17]`
- [x] **[AC-038g]** Burt has blueprint for purpose-driven collaboration. `[MPS-BG, mission-project-system.json]`

---

**Phase 4 Status:** Complete — [Build Bible](PHASE_4_COMMUNITY_OS_BUILD_BIBLE.md) · **Next:** Phase 5 — Action Operating System

*Trace: Identity → Team → Mission → Canvas → Project → Celebration → Reflection → Legacy → every community stronger*
