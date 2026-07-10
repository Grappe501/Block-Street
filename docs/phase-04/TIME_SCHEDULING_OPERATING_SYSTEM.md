# Time & Scheduling Operating System

**Document ID:** PHASE-004.6  
**Artifact:** `TIME_SCHEDULING_OPERATING_SYSTEM.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 4 — Community Operating System  
**Acronym:** TSOS

> **One timeline. Personalized for every participant.**

Step 4.6 is **much bigger than a calendar**. ASYON does not build a calendar — it builds the **Time Operating System** for the entire platform.

> **Everything should exist in one master calendar. The platform knows everything. It simply surfaces what each person needs to see.**

This becomes one of the **foundational engines** that every other module depends on.

**Builds On:** [Community Command Center](COMMUNITY_COMMAND_CENTER.md) · [Mission & Project System](MISSION_PROJECT_SYSTEM.md) · [Team & Working Group System](TEAM_WORKING_GROUP_SYSTEM.md) · [Communication & Attention Management](../phase-03/COMMUNICATION_ATTENTION_MANAGEMENT.md) · [Relationship Graph](../phase-02/REGISTRY_RELATIONSHIP_MODEL.md)

**Live spec:** `data/registry/time-scheduling-operating-system.json`

**Requirement:** TSOS-001

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| TSOS-M01 | Purpose |
| TSOS-M02 | Guiding principle |
| TSOS-M03 | Philosophy |
| TSOS-M04 | Master Timeline |
| TSOS-M05 | Personal views |
| TSOS-M06 | Community views |
| TSOS-M07 | Event categories |
| TSOS-M08 | Relationship awareness |
| TSOS-M09 | Smart scheduling (future) |
| TSOS-M10 | Recurring activities |
| TSOS-M11 | Platform integrations |
| TSOS-M12 | External integration (future) |
| TSOS-M13 | Notifications |
| TSOS-M14 | Time intelligence (future) |
| TSOS-M15 | Historical timeline |
| TSOS-M16 | Rhythm Engine architecture |
| TSOS-M17 | V1 scope |
| TSOS-BG | Burt implementation guidance |
| AC-039 | Step 4.6 acceptance criteria |

---

## TSOS-M01 — Purpose

**[TSOS-M01]** The **Time & Scheduling Operating System (TSOS)** manages **every time-based activity** within ASYON.

**[TSOS-M01a]** Rather than maintaining separate calendars for campuses, counties, teams, missions, and participants, the platform maintains **one unified scheduling engine**.

**[TSOS-M01b]** Every participant experiences a **personalized view** of the same underlying timeline.

**[TSOS-M01c]** TSOS is a **foundational engine** — Personal Command Center [PCC-001], Community Command Center [CCC-001], Mission Headquarters [MPS-001], Morning Brief [PCC-M17], and Community Pulse [CCC-M20] all consume timeline data from TSOS.

**[TSOS-M01d]** Terminology: use **Time & Scheduling Operating System** (not "Community Calendar System" or "Events module"). Calendar widgets are **views** — not separate data stores.

---

## TSOS-M02 — Guiding Principle

**[TSOS-M02]**

> **One timeline. Personalized for every participant.**

**[TSOS-M02a]** The platform **understands everything that is happening**.

**[TSOS-M02b]** Participants see **only what is relevant to them** — filtered by relationships, roles, and preferences [REL-001, CAM-001].

**[TSOS-M02c]** Complementary principles:

| Source | Principle |
|--------|-----------|
| CAM-001 | Attention budget — surface what matters, not everything |
| CGS-M07 | Historical events preserved as institutional memory |
| PEL-M13 | Does scheduling strengthen belonging and participation? |

---

## TSOS-M03 — Philosophy

**[TSOS-M03]** Time is a **shared platform resource**.

**[TSOS-M03a]** The platform no longer asks:

> *"What calendar is this on?"*

**[TSOS-M03b]** The platform asks:

> *"Who needs to know about this?"*

**[TSOS-M03c]** This creates **one unified scheduling architecture** — events are graph-connected entities; views are filtered projections.

**[TSOS-M03d]** Implementation rule: **never duplicate scheduled items** across campus/county/team/mission calendars. Write once to Master Timeline; filter for each view.

---

## TSOS-M04 — Master Timeline

**[TSOS-M04]** **Single source of truth.** Every scheduled item exists within one **canonical Master Timeline**.

**[TSOS-M04a]** Item types on the Master Timeline:

| Type | Source module |
|------|---------------|
| Events | Community, campus, county |
| Team meetings | [TWG-001] |
| Volunteer shifts | [MPS-001] |
| Project milestones | [MPS-001] |
| Training | [PGL-001] |
| Deadlines | Missions, projects |
| Community celebrations | [CRA-001] |
| Office hours | Leadership teams |
| Recurring programs | [TSOS-M10] |

**[TSOS-M04b]** Orchestrator: `queryMasterTimeline(filters)` — all views derive from this query.

**[TSOS-M04c]** **Separate events from calendar views** — timeline records are entities; calendar widgets are read-only filtered projections [TSOS-BG].

---

## TSOS-M05 — Personal Views

**[TSOS-M05]** Every participant receives a **personalized calendar** — never manages multiple calendars.

**[TSOS-M05a]** Personal view examples:

- My Events
- My Teams
- My Missions
- My Volunteer Shifts
- My Campus
- My County
- Recommended Opportunities

**[TSOS-M05b]** Orchestrator: `assemblePersonalTimeline(participantId, range)` — relationship-aware filter over Master Timeline [TSOS-M08].

**[TSOS-M05c]** Surfaces in:

- Personal Headquarters calendar section [PHQ-001]
- Personal Command Center Calendar widget [PCC-M10]
- Morning Brief items [PCC-M17] — "Your committee meets tomorrow"

---

## TSOS-M06 — Community Views

**[TSOS-M06]** Communities receive **filtered timeline views** — every view references the Master Timeline.

**[TSOS-M06a]** Community view examples:

- Campus Calendar
- County Calendar
- Team Calendar
- Mission Calendar
- Volunteer Calendar
- Leadership Calendar

**[TSOS-M06b]** Orchestrator: `assembleCommunityTimeline(communityId, range)`.

**[TSOS-M06c]** Community Command Center Calendar widget [CCC-M09] is a **community view** — not a separate calendar store.

---

## TSOS-M07 — Event Categories

**[TSOS-M07]** Every scheduled item belongs to one or more **categories** — configurable:

| Category | Typical use |
|----------|-------------|
| Meeting | Team, committee, leadership |
| Volunteer | Shifts, service days |
| Training | Leadership, skills |
| Community Event | Campus/county gatherings |
| Planning Session | Mission planning |
| Social Gathering | Celebrations, welcome events |
| Project Milestone | Mission progress markers |
| Deadline | Registration, submission |
| Celebration | Mission completed, traditions |

**[TSOS-M07a]** Categories enable filtering, Pulse/Brief prioritization, and Rhythm Engine pattern detection [TSOS-M16].

---

## TSOS-M08 — Relationship Awareness

**[TSOS-M08]** Scheduling **understands relationships** [REL-001] — participants do not manually subscribe to dozens of calendars.

**[TSOS-M08a]** Automatic visibility rules:

| Relationship | Effect |
|--------------|--------|
| Participant belongs to team | Team meetings appear automatically |
| Volunteer joins mission | Mission milestones appear automatically |
| Campus event published | Visible to campus members |
| County event published | Visible to county participants |
| Cross-team collaboration | Shared events visible to both teams |

**[TSOS-M08b]** Orchestrator: `filterTimelineByRelationships(participantId, timelineItems)` — graph traversal, not manual subscription lists.

**[TSOS-M08c]** Privacy [SEC-001]: relationship rules respect visibility settings — not all events are public.

---

## TSOS-M09 — Smart Scheduling (Future)

**[TSOS-M09]** Future capabilities — platform becomes an **organizing assistant**:

- Conflict detection
- Travel time estimation
- Meeting recommendations
- Volunteer availability
- Leadership availability
- Project coordination
- Schedule optimization

**[TSOS-M09a]** V1: spec only. V1.2+: incremental smart features post-Master Timeline implementation.

---

## TSOS-M10 — Recurring Activities

**[TSOS-M10]** Support recurring patterns:

- Weekly meetings
- Monthly gatherings
- Semester schedules
- Annual traditions
- Recurring volunteer opportunities
- Leadership rotations
- Historical anniversaries

**[TSOS-M10a]** Recurring events remain **connected to community history** [CGS-M07, TSOS-M15] — not orphaned RRULE records.

**[TSOS-M10b]** Feeds **Rhythm Engine** [TSOS-M16] — patterns detected from recurrence rules and attendance history.

---

## TSOS-M11 — Platform Integrations

**[TSOS-M11]** TSOS integrates with — timeline becomes the **heartbeat of the platform**:

| Consumer | Integration |
|----------|-------------|
| Personal Headquarters [PHQ-001] | My Calendar section |
| Personal Command Center [PCC-001] | Calendar widget + Morning Brief |
| Community Command Center [CCC-001] | Calendar widget + Community Pulse |
| Mission Headquarters [MPS-001] | Mission timeline + milestones |
| Team Headquarters [TWG-001] | Meeting schedules |
| Opportunity Marketplace [OBE-001] | Upcoming volunteer/event opportunities |
| Civic Journey Timeline [CJT-001] | Event participation milestones |

**[TSOS-M11a]** Morning Brief and Community Pulse **pull from TSOS** — never maintain separate "upcoming events" lists.

---

## TSOS-M12 — External Integration (Future)

**[TSOS-M12]** Future synchronization — **extension layer**, not core architecture:

- Google Calendar
- Apple Calendar
- Microsoft Outlook
- ICS feeds
- LocalBrain synchronization

**[TSOS-M12a]** **Participants remain in control** — opt-in sync, direction configurable (read-only vs two-way).

**[TSOS-M12b]** Master Timeline remains canonical — external calendars are **mirrors**, not sources of truth.

---

## TSOS-M13 — Notifications

**[TSOS-M13]** TSOS works with [Communication & Attention Management](../phase-03/COMMUNICATION_ATTENTION_MANAGEMENT.md) [CAM-001]:

| Notification | Trigger |
|--------------|---------|
| Morning Brief item | Upcoming personal event |
| Event reminder | Configurable lead time |
| Volunteer reminder | Shift approaching |
| Schedule change | Timeline item modified |
| Meeting follow-up | Post-meeting action prompt |

**[TSOS-M13a]** Notification frequency **respects participant preferences** [CAM-001 attention budget] — never notification spam.

---

## TSOS-M14 — Time Intelligence (Future)

**[TSOS-M14]** Future analytics identify:

- Volunteer availability patterns
- Scheduling conflicts across communities
- Busy periods (exam weeks, holidays)
- Participation patterns
- Optimal meeting times
- Community rhythms

**[TSOS-M14a]** Objective: **help communities coordinate more effectively** — guides support, not surveillance [CGS-M08].

**[TSOS-M14b]** Feeds Community Intelligence [CIS-001] and Rhythm Engine [TSOS-M16].

---

## TSOS-M15 — Historical Timeline

**[TSOS-M15]** Completed events remain part of platform memory — **append-only**:

| Destination | Content |
|-------------|---------|
| Community History | Campus/county events archive |
| Mission History | Mission-linked milestones |
| Participant Timeline | Personal Civic Journey [CJT-001] |
| Civic Passport | Participation stamps [CPP-001] |
| Institutional Memory | Traditions, anniversaries [CGS-M07] |

**[TSOS-M15a]** The platform **remembers what communities accomplished together** — archived events never deleted.

---

## TSOS-M16 — Rhythm Engine Architecture

**[TSOS-M16]** **Signature feature.** Communities naturally develop **rhythms**:

- Campus leadership meets every Monday
- County volunteers serve on the second Saturday each month
- Environmental team hosts quarterly cleanups
- Annual traditions happen every spring
- Debate watch parties occur during election season

**[TSOS-M16a]** The **Rhythm Engine** learns recurring patterns and helps communities **maintain them** across leadership changes.

**[TSOS-M16b]** Capabilities:

| Capability | Benefit |
|------------|---------|
| Suggest future meeting dates | Leaders don't start from blank calendar |
| Remind about recurring traditions | Annual events not forgotten |
| Highlight approaching anniversaries | Institutional memory alive |
| Help new organizers inherit schedules | Succession without rhythm loss [CGS-M06] |
| Recommend avoiding conflicts | Coordinate across teams/communities |

**[TSOS-M16c]** Philosophy: *Communities shouldn't have to rediscover their rhythm every time leadership changes. The platform should remember it for them.*

**[TSOS-M16d]** Transforms scheduling from **passive tool** into **engine preserving community habits and traditions**.

**[TSOS-M16e]** Orchestrator: `deriveCommunityRhythms(communityId)` — analyzes recurrence rules, attendance history, Rhythm Engine templates.

**[TSOS-M16f]** V1: spec + recurrence rule stub; full pattern learning in v1.2+.

---

## TSOS-M17 — V1 Scope

**[TSOS-M17]** Jul 12 leader testing / Jul 14 launch minimum:

| Deliverable | Scope |
|-------------|-------|
| TSOS philosophy & Master Timeline | Documented — this step |
| Rhythm Engine spec | Recurrence rule stub |
| Personal timeline stub | `assemblePersonalTimeline()` returns empty + county links |
| Community timeline stub | CCC Calendar widget placeholder |
| Relationship-aware filtering | Spec documented |
| External sync / smart scheduling | Future |

**[TSOS-M17a]** Deferred: full Master Timeline DB, Google/Apple sync, conflict detection, Time Intelligence analytics.

---

## TSOS-BG — Burt Implementation Guidance

**[TSOS-BG]** Implementation should:

1. **Maintain one canonical scheduling engine** — single `timeline_events` table (or equivalent)
2. **Separate events from calendar views** — views are filtered queries, not copies
3. **Support relationship-aware filtering** — graph-based visibility [TSOS-M08]
4. **Design synchronization as extension layer** — external calendars mirror Master Timeline [TSOS-M12]
5. **Preserve historical events** — append-only archive [TSOS-M15]
6. **Optimize mobile scheduling** — thumb-friendly date navigation, today/upcoming first

**[TSOS-BG-a]** Recommended file structure:

```
src/lib/tsos/queryMasterTimeline.ts
src/lib/tsos/assemblePersonalTimeline.ts
src/lib/tsos/assembleCommunityTimeline.ts
src/lib/tsos/filterTimelineByRelationships.ts
src/lib/tsos/deriveCommunityRhythms.ts
data/registry/time-scheduling-operating-system.json
```

**[TSOS-BG-b]** Database: `timeline_events` table with `starts_at`, `ends_at`, `categories[]`, `visibility_rules`, `recurrence_rule`, `community_id`, `team_id`, `mission_id`, `created_by`.

**[TSOS-BG-c]** **EVT-001 references migrate to TSOS-001** — events are timeline items; TSOS is the engine.

---

## AC-039 — Acceptance Criteria

Step 4.6 is complete when:

- [x] **[AC-039a]** One unified scheduling philosophy documented. `[TSOS-M01, TSOS-M03]`
- [x] **[AC-039b]** Master Timeline architecture established. `[TSOS-M04]`
- [x] **[AC-039c]** Personalized and community views defined. `[TSOS-M05, TSOS-M06]`
- [x] **[AC-039d]** Relationship-aware scheduling incorporated. `[TSOS-M08]`
- [x] **[AC-039e]** Rhythm Engine architecture specified. `[TSOS-M16]`
- [x] **[AC-039f]** Platform integrations documented. `[TSOS-M11, TSOS-M13]`
- [x] **[AC-039g]** Burt has blueprint for platform-wide Time OS. `[TSOS-BG, time-scheduling-operating-system.json]`

---

**Phase 4 Status:** Complete — [Build Bible](PHASE_4_COMMUNITY_OS_BUILD_BIBLE.md) · **Next:** Phase 5 — Action Operating System

*Trace: One Master Timeline → personalized views → relationship-aware → Rhythm Engine → communities never lose their beat*
