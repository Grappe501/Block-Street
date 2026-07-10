# Team & Working Group System

**Document ID:** PHASE-004.4  
**Artifact:** `TEAM_WORKING_GROUP_SYSTEM.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 4 — Community Operating System

> **Communities thrive when people can easily form teams to solve real problems.**

This is one of the **biggest architectural decisions** in the project. Most organizing platforms are built around **organizations**. ASYON is built around **teams that solve problems**.

Committees are one kind of team. Projects are another. Task forces, working groups, and **Micro Teams** are others. The platform grows into many collaboration styles **without redesign**.

**Builds On:** [Community Command Center](COMMUNITY_COMMAND_CENTER.md) · [Community Constitution](COMMUNITY_CONSTITUTION.md) · [Community Growth & Sustainability](COMMUNITY_GROWTH_SUSTAINABILITY.md) · [Status & Lifecycle Framework](../phase-02/CANONICAL_STATUS_LIFECYCLE_FRAMEWORK.md)

**Live spec:** `data/registry/team-working-group-system.json`

**Requirement:** TWG-001

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| TWG-M01 | Purpose |
| TWG-M02 | Guiding principle |
| TWG-M03 | Philosophy |
| TWG-M04 | Team types |
| TWG-M05 | Team identity |
| TWG-M06 | Team lifecycle |
| TWG-M07 | Team Headquarters |
| TWG-M08 | Membership |
| TWG-M09 | Leadership |
| TWG-M10 | Team communication |
| TWG-M11 | Team resources |
| TWG-M12 | Team projects |
| TWG-M13 | Cross-team collaboration |
| TWG-M14 | Team health |
| TWG-M15 | Team discovery |
| TWG-M16 | Micro Teams architecture |
| TWG-M17 | CCC integration |
| TWG-M18 | STS-001 integration |
| TWG-M19 | V1 scope |
| TWG-BG | Burt implementation guidance |
| AC-037 | Step 4.4 acceptance criteria |

---

## TWG-M01 — Purpose

**[TWG-M01]** This document defines how participants organize into **collaborative teams** to accomplish shared goals.

**[TWG-M01a]** Rather than centering communities around rigid organizational structures, the platform encourages **flexible working groups** that can form, grow, complete their work, and evolve over time.

**[TWG-M01b]** **Teams become the primary operational units** where organizing actually happens — beneath community identity [CCN-001], above individual action [PCC-001].

**[TWG-M01c]** Terminology: use **Team & Working Group System** (not "Committee System" alone). Committees remain supported as a **team type** — not the only collaboration model.

---

## TWG-M02 — Guiding Principle

**[TWG-M02]**

> **Communities thrive when people can easily form teams to solve real problems.**

**[TWG-M02a]** The software should make **collaboration effortless** — finding a team, joining a team, starting a team, and contributing should never require bureaucratic overhead.

**[TWG-M02b]** Complementary principles:

| Source | Principle |
|--------|-----------|
| CCN-001 | People create culture; platform provides structure |
| CGS-001 | Communities are living organisms — teams evolve within them |
| CCC-001 | Command Center surfaces teams as action layer |
| PEL-M13 | Does this help people grow into community builders? |

---

## TWG-M03 — Philosophy

**[TWG-M03]** Three layers of organizing:

| Layer | Provides |
|-------|----------|
| **Communities** | Identity — who we are [CCN-001, CID-001] |
| **Teams** | Action — how we work together [TWG-001] |
| **Projects** | Purpose — what we're building [PRJ-001, Step 4.5] |

**[TWG-M03a]** Every participant should be able to **find — or create — a team** where they can contribute.

**[TWG-M03b]** Real organizing starts small: two motivated people, a shared problem, a weekend to solve it. The platform must support that path **and** the path to statewide institutions [TWG-M16].

---

## TWG-M04 — Team Types

**[TWG-M04]** Configurable team models — **future types added without redesign**:

| Type | Typical use |
|------|-------------|
| Standing Committee | Ongoing campus/county governance |
| Working Group | Time-bounded policy or planning work |
| Task Force | Urgent coordinated response |
| Planning Team | Event or initiative design |
| Volunteer Team | Service coordination |
| Event Team | Single event execution |
| Research Team | Issue investigation |
| Communications Team | Messaging and media |
| Technology Team | Platform and tools |
| Community Service Team | Local service projects |
| Campus Outreach Team | Campus-specific organizing |
| County Outreach Team | County-specific organizing |
| Leadership Team | Leader development and succession |
| **Micro Team** | Lightweight ad-hoc groups [TWG-M16] |

**[TWG-M04a]** `teamType` is a **configurable attribute** — not a hardcoded enum locked to committees.

**[TWG-M04b]** Standing Committee is the **legacy-friendly name** for permanent teams; Micro Team is the **entry point** for new organizing.

---

## TWG-M05 — Team Identity

**[TWG-M05]** Every team has:

| Field | Purpose |
|-------|---------|
| Team Name | Recognizable label |
| Mission | Why the team exists |
| Purpose | What problem it solves |
| Community | Parent campus, county, or community [REL-001] |
| Status | Lifecycle stage [TWG-M06, STS-001] |
| Members | Participants belonging to team |
| Leadership | Distributed roles [TWG-M09] |
| Projects | Linked initiatives [TWG-M12] |
| Resources | Team knowledge [TWG-M11] |
| History | Append-only institutional memory [CGS-M07] |

**[TWG-M05a]** A team should **immediately communicate why it exists** — mission visible in Team Headquarters header [TWG-M07].

---

## TWG-M06 — Team Lifecycle

**[TWG-M06]** Every team follows a lifecycle — extends [STS-001]:

```
Planning
    ↓
Recruiting
    ↓
Launching
    ↓
Active
    ↓
Growing
    ↓
Completing Work
    ↓
Archived
    ↓
Reactivated (if needed)
```

**[TWG-M06a]** **History always preserved** — archived teams retain members, projects, resources, and story [CGS-M11]. Reactivation does not delete past records.

**[TWG-M06b]** Micro Teams default to shorter lifecycle: Planning → Active → Completing Work → Archived — with **evolution path** to permanent team types [TWG-M16].

**[TWG-M06c]** Orchestrator: `deriveTeamLifecycleStage(teamId)` — feeds Team Headquarters and health indicators.

---

## TWG-M07 — Team Headquarters

**[TWG-M07]** Every team receives its own **workspace** — Team Headquarters.

**[TWG-M07a]** Includes:

- Mission
- Members
- Calendar
- Projects
- Files
- Announcements
- Resources
- Discussions
- Recognition
- Volunteer Opportunities

**[TWG-M07b]** Experience remains **consistent with Community Command Centers** [CCC-001] — same widget shell, team-scoped data. Route: `/team/[slug]` [PAGE-TEAM].

**[TWG-M07c]** Teams are **first-class community types** in the graph [REL-001] — a team belongs to a parent community and may span multiple communities for cross-campus collaboration [TWG-M08].

---

## TWG-M08 — Membership

**[TWG-M08]** Participants may belong to **multiple teams simultaneously**:

- Campus Communications Team
- County Volunteer Team
- Environmental Working Group
- Leadership Task Force
- Debate Planning Committee

**[TWG-M08a]** **Cross-campus collaboration encouraged** — membership is not locked to a single institution [CCN-M08].

**[TWG-M08b]** Join flows respect privacy [SEC-001] — open teams vs invite-only vs application teams (future).

**[TWG-M08c]** Team membership surfaces in Personal Command Center [PCC-001] and Community Command Center Teams widget [TWG-M17].

---

## TWG-M09 — Leadership

**[TWG-M09]** Leadership should be **distributed** — exists to **enable participation, not create hierarchy** [CGS-M06].

**[TWG-M09a]** Possible roles:

| Role | Enables |
|------|---------|
| Coordinator | Overall team rhythm |
| Facilitator | Meetings and inclusion |
| Project Lead | Specific initiative delivery |
| Volunteer Coordinator | Service opportunities |
| Communications Lead | Messaging and outreach |
| Training Lead | Onboarding and skill-building |
| Documentation Lead | Institutional memory |

**[TWG-M09b]** Multiple roles may be held by one person; one role may be shared. **Never depend on one individual** [CGS-M06].

**[TWG-M09c]** Leadership transitions recorded in team history — graduation does not erase contribution.

---

## TWG-M10 — Team Communication

**[TWG-M10]** Every team receives organized communication:

| Channel | Purpose |
|---------|---------|
| Announcements | Official team updates |
| Discussion space | Ongoing conversation |
| Meeting notes | Decisions and action items |
| Shared documents | Collaborative files |
| Action items | Who does what by when |
| Calendar | Rhythm and deadlines |

**[TWG-M10a]** Communication remains **organized around the team's purpose** — not a generic platform-wide feed [CAM-001 attention budget].

**[TWG-M10b]** Full community communication system in Step 4.7; team comms are **scoped subset** with team context always visible.

---

## TWG-M11 — Team Resources

**[TWG-M11]** Each team develops its own **knowledge**:

- Meeting agendas
- Templates
- Research
- Graphics
- Presentations
- Volunteer guides
- Best practices

**[TWG-M11a]** **Knowledge remains with the team** even as members change [CGS-M07] — append-only resource history.

**[TWG-M11b]** Connects to Community Knowledge Base [4.8] and Capability Exchange [4.9] — team resources may be **shared upward** to parent community when appropriate.

---

## TWG-M12 — Team Projects

**[TWG-M12]** Teams naturally create **projects** [PRJ-001, Step 4.5]:

- Food Drive
- Registration Event
- Campus Debate
- Volunteer Day
- Community Cleanup
- Leadership Retreat

**[TWG-M12a]** **Projects remain linked to the team that created them** — `teamId` on every project record.

**[TWG-M12b]** **Teams and projects are separate entities** — a team may run many projects; a project may involve multiple teams via cross-team collaboration [TWG-M13]. Do not collapse teams into projects.

---

## TWG-M13 — Cross-Team Collaboration

**[TWG-M13]** Teams should collaborate **easily**:

| Pattern | Example |
|---------|---------|
| Support | Communications Team supports Volunteer Team |
| Assist | Technology Team assists Event Team |
| Research | Research Team supports Advocacy Team |
| Coordinate | County Teams coordinate with Campus Teams |

**[TWG-M13a]** **Knowledge flows across the platform** — linked teams, shared resources, joint projects [SCN-001 Statewide Collaboration Network].

**[TWG-M13b]** Cross-team relationships are **typed edges** in the graph [REL-001] — not ad-hoc mentions.

---

## TWG-M14 — Team Health

**[TWG-M14]** Health indicators **guide improvement — they do not rank**:

- Participation
- Volunteer engagement
- Meeting rhythm
- Project completion
- Leadership development
- Knowledge sharing
- Welcoming culture

**[TWG-M14a]** Mirrors Community Health Check philosophy [CGS-M12] at team scope — reflection for team leaders, not public leaderboard.

**[TWG-M14b]** Inactive teams surface **renewal suggestions** — mentors, neighboring teams, revival resources [CGS-M09] — not deletion.

---

## TWG-M15 — Team Discovery

**[TWG-M15]** Participants discover teams through:

| Channel | Source |
|---------|--------|
| Campus pages | Community Command Center Teams widget [TWG-M17] |
| County pages | Same |
| Opportunity Exchange | [OBE-001, OEX-001] |
| Search | Platform search |
| Recommendations | Participant Context Engine [PDT-001] |
| Mentor suggestions | Growth system [PGL-001] |

**[TWG-M15a]** **Finding a place to contribute should be easy** — team discovery is a core belonging function [OBE-001].

---

## TWG-M16 — Micro Teams Architecture

**[TWG-M16]** **Signature feature.** Not every effort requires a formal committee.

**[TWG-M16a]** Participants create **Micro Teams** — lightweight groups for small, focused efforts:

- Three students planning a voter registration table
- Four volunteers organizing transportation
- Two photographers covering an event
- A temporary team preparing a campus presentation
- A group coordinating a weekend service project

**[TWG-M16b]** Micro Team characteristics:

| Property | Behavior |
|----------|----------|
| Quick to create | Minimal fields — name, purpose, community, invite link |
| Easy to join | Open or invite-only; one-tap join |
| Temporary by default | Short lifecycle; auto-suggest archive when work completes |
| Evolvable | **Graduate to Working Group, Task Force, or Standing Committee** when momentum continues |

**[TWG-M16c]** **Evolution path** without changing tools:

```
Micro Team → Working Group → Standing Committee → (spawns new Micro Teams)
```

**[TWG-M16d]** Philosophy: *Small groups of motivated people come together to solve a problem, and successful efforts often grow into lasting institutions.*

**[TWG-M16e]** Orchestrator: `createMicroTeam(params)` — returns team record with `teamType: microTeam`, default lifecycle, Team Headquarters stub.

**[TWG-M16f]** V1: spec + create flow stub; full Micro Team UI in v1.1 alongside committee features.

---

## TWG-M17 — Community Command Center Integration

**[TWG-M17]** Teams surface in Community Command Center [CCC-001]:

| Surface | Content |
|---------|---------|
| **Teams widget** (formerly Committees) | Active teams, schedules, needs, leaders, open participation |
| **Opportunity widget** | Open team membership requests |
| **Quick Action** | Start Team / Create Micro Team |
| **Community Pulse** | "Two teams need volunteers this week" |

**[TWG-M17a]** Widget key: `teams` — displays all team types; filter by type optional.

**[TWG-M17b]** Standing committees appear alongside Micro Teams in the same widget — **one system, many types**.

---

## TWG-M18 — STS-001 Integration

**[TWG-M18]** Team lifecycle extends [STS-001] status timeline pattern [STS-M16]:

- Status transitions logged append-only
- Dashboard queries derive from status
- Team lifecycle independent from community lifecycle [CGS-M04] and project lifecycle [PRJ-001]

**[TWG-M18a]** Default new team status: `planning`. Micro Team default: `active` after creation (skip lengthy recruiting for ad-hoc groups).

---

## TWG-M19 — V1 Scope

**[TWG-M19]** Jul 12 leader testing / Jul 14 launch minimum:

| Deliverable | Scope |
|-------------|-------|
| Team philosophy & types | Documented — this step |
| Micro Teams spec | `createMicroTeam()` stub |
| Team entity schema | Graph node + status timeline spec |
| Teams widget | Static cards on Community Command Center |
| Team Headquarters | Placeholder route `/team/[slug]` |
| Full team workspace | v1.1 |

**[TWG-M19a]** Deferred: full membership management, team comms, cross-team graph edges, automated lifecycle transitions.

---

## TWG-BG — Burt Implementation Guidance

**[TWG-BG]** Implementation should:

1. **Treat teams as first-class entities** — graph nodes, not tags on users
2. **Allow configurable team types** — registry in `team-working-group-system.json`
3. **Separate teams from projects** — `teamId` links; distinct lifecycles [TWG-M12]
4. **Support multiple leadership roles** — role array on membership, not single "chair"
5. **Preserve historical knowledge** — append-only team history [CGS-M07]
6. **Maintain consistent interfaces** — Team Headquarters uses CCC shell [TWG-M07]

**[TWG-BG-a]** Recommended file structure:

```
src/lib/teams/createTeam.ts
src/lib/teams/createMicroTeam.ts
src/lib/teams/deriveTeamLifecycleStage.ts
src/components/ccc/widgets/TeamsWidget.tsx
src/app/team/[slug]/page.tsx
data/registry/team-working-group-system.json
```

**[TWG-BG-b]** Database: `teams` table (replaces committee-only `committees` concept) with `team_type`, `community_id`, `lifecycle_status`, `parent_team_id` (optional).

**[TWG-BG-c]** **Committee is a team type, not a separate system** — migrate all COM-001 references to TWG-001.

---

## AC-037 — Acceptance Criteria

Step 4.4 is complete when:

- [x] **[AC-037a]** Team & Working Group philosophy documented. `[TWG-M01, TWG-M03]`
- [x] **[AC-037b]** Flexible team structures established. `[TWG-M04, TWG-M05]`
- [x] **[AC-037c]** Team lifecycle, leadership, and collaboration defined. `[TWG-M06, TWG-M09, TWG-M13]`
- [x] **[AC-037d]** Team Headquarters and resource management incorporated. `[TWG-M07, TWG-M11]`
- [x] **[AC-037e]** Micro Teams architecture specified. `[TWG-M16]`
- [x] **[AC-037f]** CCC integration documented. `[TWG-M17]`
- [x] **[AC-037g]** Burt has blueprint for collaborative organizing layer. `[TWG-BG, team-working-group-system.json]`

---

**Phase 4 Status:** Complete — [Build Bible](PHASE_4_COMMUNITY_OS_BUILD_BIBLE.md) · **Next:** Phase 5 — Action Operating System

*Trace: Identity (community) → Action (team) → Purpose (project) → Micro Team → Working Group → Committee → decades of flexible organizing*
