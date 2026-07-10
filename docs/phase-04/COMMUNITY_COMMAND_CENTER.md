# Community Command Center

**Document ID:** PHASE-004.3  
**Artifact:** `COMMUNITY_COMMAND_CENTER.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 4 — Community Operating System

> **Every community deserves a home that feels alive.**

Every participant has a **Personal Command Center** [PCC-001]. Every community deserves a **Community Command Center** — the digital headquarters where people coordinate, not just a webpage.

Whether it is University of Central Arkansas, Philander Smith University, Benton County, Mississippi County, a Volunteer Committee, or a Debate Watch Party Project — the experience should feel **familiar** while reflecting that community's **unique identity** [CID-001].

**Builds On:** [Community Constitution](COMMUNITY_CONSTITUTION.md) · [Community Growth & Sustainability](COMMUNITY_GROWTH_SUSTAINABILITY.md) · [Personal Command Center](../phase-03/PERSONAL_COMMAND_CENTER.md) · [Community Identity](../phase-02/COMMUNITY_IDENTITY_PERSONALIZATION_SYSTEM.md)

**Live spec:** `data/registry/community-command-center.json`

**Requirement:** CCC-001

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| CCC-M01 | Purpose |
| CCC-M02 | Guiding principle |
| CCC-M03 | Philosophy |
| CCC-M04 | Primary questions |
| CCC-M05 | PCC parallel architecture |
| CCC-M06 | Community Header |
| CCC-M07 | Mission Widget |
| CCC-M08 | Opportunity Widget |
| CCC-M09 | Community Calendar |
| CCC-M10 | Community Feed |
| CCC-M11 | People Widget |
| CCC-M12 | Projects Widget |
| CCC-M13 | Committee Widget |
| CCC-M14 | Community Health Widget |
| CCC-M15 | Resource Widget |
| CCC-M16 | Recognition Widget |
| CCC-M17 | Quick Actions |
| CCC-M18 | Community Story |
| CCC-M19 | Mobile philosophy |
| CCC-M20 | Community Pulse architecture |
| CCC-M21 | Identity & customization |
| CCC-M22 | V1 scope |
| CCC-BG | Burt implementation guidance |
| AC-036 | Step 4.3 acceptance criteria |

---

## CCC-M01 — Purpose

**[CCC-M01]** The **Community Command Center** is the **primary workspace** for every organizing community on ASYON.

**[CCC-M01a]** It serves as the **operational headquarters** for campuses, counties, committees, projects, and future community types [CCN-M01, COS-001].

**[CCC-M01b]** The Command Center provides participants with a complete view of:

- What is happening
- Who is involved
- What opportunities exist
- Where help is needed

**[CCC-M01c]** Terminology: use **Community Command Center** (not "Community Headquarters," "hub page," or "dashboard"). Command Center communicates **coordination, awareness, and purpose** — communities don't just exist, they coordinate people, projects, events, and ideas.

**[CCC-M01d]** The Community Command Center should become the **most visited community page** on the platform — second only to the Personal Command Center [PCC-M01d].

---

## CCC-M02 — Guiding Principle

**[CCC-M02]**

> **Every community deserves a home that feels alive.**

**[CCC-M02a]** Every visit should immediately communicate:

| Signal | Source |
|--------|--------|
| Who we are | Header · Mission · Story [CCC-M06, CCC-M07, CCC-M18] |
| What we're working on | Projects · Committees · Calendar [CCC-M12, CCC-M13, CCC-M09] |
| How to get involved | Opportunity · Quick Actions [CCC-M08, CCC-M17] |
| Who needs help | Opportunity · Pulse [CCC-M08, CCC-M20] |
| What's happening next | Pulse · Calendar · Feed [CCC-M20, CCC-M09, CCC-M10] |

**[CCC-M02b]** Complementary principles:

| Source | Principle |
|--------|-----------|
| CCN-001 | Communities are built by people, sustained by shared purpose |
| CGS-001 | Communities are living organisms — evolve over time |
| CID-001 | Every community feels like theirs |
| PEL-M13 | Does this strengthen relationships and belonging? |

---

## CCC-M03 — Philosophy

**[CCC-M03]** The Community Command Center is **not a webpage**.

**[CCC-M03a]** It is the community's **living headquarters** — evolving as the community evolves [CGS-M03].

**[CCC-M03b]** It should feel like walking into an organizing space where:

- The mission is visible on the wall
- The calendar shows what's next
- People know who to ask
- Opportunities are obvious
- The community's story is honored

**[CCC-M03c]** Same **interaction patterns** across all community types; unique **identity** per community [CID-001, CCC-M21].

---

## CCC-M04 — Primary Questions

**[CCC-M04]** Every visit answers **six questions**:

### 1. Who are we?

| Element | Widget |
|---------|--------|
| Name, type, status | Header [CCC-M06] |
| Mission, charter, priorities | Mission [CCC-M07] |
| History, traditions | Story [CCC-M18] |

### 2. What has changed?

| Signal | Widget |
|--------|--------|
| New members, announcements | Pulse · Feed · People [CCC-M20, CCC-M10, CCC-M11] |
| Accomplishments, recognition | Feed · Recognition [CCC-M10, CCC-M16] |
| Projects launched | Pulse · Projects [CCC-M20, CCC-M12] |

### 3. What needs attention?

| Signal | Widget |
|--------|--------|
| Volunteer gaps, committee needs | Opportunity · Pulse [CCC-M08, CCC-M20] |
| Health signals, lifecycle stage | Health [CCC-M14] |
| Deadlines | Calendar [CCC-M09] |

### 4. How can I help?

| Source | Widget |
|--------|--------|
| Volunteer needs, open committees | Opportunity [CCC-M08] |
| Projects seeking help | Projects [CCC-M12] |
| One-tap actions | Quick Actions [CCC-M17] |

### 5. What opportunities exist?

| Source | Widget |
|--------|--------|
| Leadership, mentorship, training | Opportunity [CCC-M08] |
| Events, committees, projects | Calendar · Committees · Projects [CCC-M09, CCC-M13, CCC-M12] |

### 6. Where are we going?

| Source | Widget |
|--------|--------|
| Priorities, goals | Mission [CCC-M07] |
| Lifecycle stage, momentum | Health [CCC-M14] |
| Upcoming initiatives | Projects · Story [CCC-M12, CCC-M18] |

---

## CCC-M05 — PCC Parallel Architecture

**[CCC-M05]** The Community Command Center mirrors the Personal Command Center architecture [PCC-001]:

| Layer | Personal | Community |
|-------|----------|-----------|
| Daily workspace | Personal Command Center [PCC-001] | Community Command Center [CCC-001] |
| Opening summary | Morning Brief [PCC-M17] | Community Pulse [CCC-M20] |
| Aggregator | `assembleCommandCenter()` | `assembleCommunityCommandCenter()` |
| Pulse aggregator | `assembleMorningBrief()` | `assembleCommunityPulse()` |
| Widget pattern | Independent registry | Independent registry |

**[CCC-M05a]** **One page, not two homes** — institution/county pages **implement** the Command Center; they are not separate "hub" and "dashboard" experiences.

**[CCC-M05b]** Personal Command Center surfaces **links into** community Command Centers via Community widget [PCC-M08]. Community Command Center surfaces **paths back** to Personal Command Center via Join · Volunteer · Quick Actions.

---

## CCC-M06 — Community Header

**[CCC-M06]** Always-visible header establishes identity:

| Element | Source |
|---------|--------|
| Community Name | Registry [REG-001, REG-002] |
| Community Type | campus · county · committee · project |
| Mission | Community Charter [CCN-M17] |
| Current Status | Lifecycle stage [CGS-M04, STS-001] |
| County / Institution | Relationship graph [REL-001] |
| Community Charter | Link to living charter document |
| Join Button | Membership flow [USR-001] |
| Share Button | Invite / QR [RGE-001] |
| Quick Actions | [CCC-M17] |

**[CCC-M06a]** Identity must be **immediately recognizable** — Community DNA colors, imagery, motto [CID-001].

---

## CCC-M07 — Mission Widget

**[CCC-M07]** Displays:

- Mission Statement
- Current priorities
- Goals
- Community Charter (summary + link)
- Leadership message
- Suggested mission of the week

**[CCC-M07a]** Participants should understand the community's **purpose within seconds**.

**[CCC-M07b]** Mission content lives in Community Charter [CCN-M17] — widget reads, never duplicates source of truth.

---

## CCC-M08 — Opportunity Widget

**[CCC-M08]** One of the **most active** parts of the page. Displays:

- Volunteer needs
- Open committees
- Projects seeking help
- Upcoming events
- Leadership opportunities
- Mentorship requests

**[CCC-M08a]** Integrates [Opportunity & Belonging Engine](../phase-03/OPPORTUNITY_BELONGING_ENGINE.md) [OBE-001] at community scope — complements Phase 3 participant discovery.

**[CCC-M08b]** [Opportunity Exchange OEX-001] allows communities to **publish needs**; Opportunity widget is the primary surface.

---

## CCC-M09 — Community Calendar

**[CCC-M09]** Displays:

- Meetings
- Events
- Volunteer opportunities
- Deadlines
- Training
- Celebrations

**[CCC-M09a]** Time & Scheduling Operating System in Step 4.6 [TSOS-001]. Calendar widget is a **filtered view** of Master Timeline — not a separate calendar store.

**[CCC-M09b]** Future: Google / Apple / Microsoft + LocalBrain sync.

---

## CCC-M10 — Community Feed

**[CCC-M10]** Displays:

- Announcements
- Community stories
- Recent accomplishments
- New members
- Volunteer highlights
- Recognition

**[CCC-M10a]** Feed should **reinforce community identity** — not a generic activity stream [CAM-001 attention budget applies].

**[CCC-M10b]** Full communication network in Step 4.7 [CCNET-001]; feed widget is **curated CCNET view** — not a separate message store.

---

## CCC-M11 — People Widget

**[CCC-M11]** Displays:

- Recent participants
- Mentors
- Community leaders
- Committee facilitators
- Volunteer coordinators
- New members

**[CCC-M11a]** Future: full member directory subject to **privacy settings** [SEC-001].

**[CCC-M11b]** Never expose private contact details without consent.

---

## CCC-M12 — Projects Widget

**[CCC-M12]** Displays:

- Active projects
- Upcoming initiatives
- Completed work
- Volunteer needs
- Resources
- Project history

**[CCC-M12a]** Full project system in Step 4.5 [PRJ-001]. Projects may themselves receive Command Centers [CCC-M01a].

---

## CCC-M13 — Committee Widget

**[CCC-M13]** Displays:

- Active committees
- Meeting schedules
- Current needs
- Committee leaders
- Projects
- Open participation

**[CCC-M13a]** Full committee system in Step 4.4 [COM-001]. Committees may themselves receive Command Centers.

---

## CCC-M14 — Community Health Widget

**[CCC-M14]** Displays:

- Participation trends
- Volunteer engagement
- Leadership development
- Project activity
- Community Health Check [CGS-M12]
- Momentum indicators

**[CCC-M14a]** Health metrics **guide support — they do not judge** [CGS-M08, CGS-M12].

**[CCC-M14b]** Powered by [Community Intelligence System](COMMUNITY_INTELLIGENCE_SYSTEM.md) [CIS-001] — integrates lifecycle stage from [Community Growth & Sustainability](COMMUNITY_GROWTH_SUSTAINABILITY.md) [CGS-001].

**[CCC-M14c]** Community Coach suggestions may appear here — observes and suggests, never judges [CIS-M14].

---

## CCC-M15 — Resource Widget

**[CCC-M15]** Displays:

- Guides
- Templates
- Training materials
- Photos
- Documents
- Knowledge Base links

**[CCC-M15a]** Capability Exchange in Step 4.9 [CCE-001]; knowledge & learning in Step 4.8 [CKLS-001] — Capability Graph connects both.

**[CCC-M15b]** Supports **institutional memory** [CGS-M07] — future organizers inherit knowledge.

---

## CCC-M16 — Recognition Widget

**[CCC-M16]** Displays:

- Volunteer appreciation
- Community milestones
- Project celebrations
- Stories of impact
- Mentorship highlights

**[CCC-M16a]** Integrates [Community Recognition & Appreciation](../phase-03/COMMUNITY_RECOGNITION_APPRECIATION.md) [CRA-001].

**[CCC-M16b]** Recognition **strengthens community culture** — not gamification.

---

## CCC-M17 — Quick Actions

**[CCC-M17]** Always visible — most common actions **never more than one or two taps away**:

| Action | V1 |
|--------|-----|
| Join Community | ✓ |
| Volunteer | Future |
| Register for Event | Future |
| Invite Friend | ✓ |
| Start Committee | Future |
| Create Project | Future |
| Ask for Help | Future |
| Contact Organizers | ✓ |

**[CCC-M17a]** Quick Actions bar in header on mobile [CCC-M19] — thumb zone priority.

---

## CCC-M18 — Community Story

**[CCC-M18]** Every community develops its own **narrative**:

- History
- Traditions
- Milestones
- Photos
- Annual achievements
- Leadership transitions

**[CCC-M18a]** Community stories make organizing **personal** — connects to [Community Legacy System CLS-001] and institutional memory [CGS-M07].

**[CCC-M18b]** Append-only history — leadership transitions preserved, never erased [CGS-M11].

---

## CCC-M19 — Mobile Philosophy

**[CCC-M19]** Designed **primarily for mobile devices** [PHQ-M19, PCC-M18]:

| Principle | Implementation |
|-----------|----------------|
| Critical info immediate | Pulse + Opportunity above fold |
| Widgets collapse gracefully | Accordion on narrow viewports |
| Thumb-friendly navigation | Quick Actions in thumb zone |
| Equal productivity | Phone and desktop parity |

**[CCC-M19a]** Mobile priority order: Pulse → Opportunity → Mission → Calendar → Feed → People → others.

---

## CCC-M20 — Community Pulse Architecture

**[CCC-M20]** **Signature feature.** Every Community Command Center opens with a **Community Pulse** — not a static dashboard.

**[CCC-M20a]** The Pulse is a **concise summary of what's happening right now** — conversational, timely, action-oriented.

**[CCC-M20b]** Community equivalent of **Morning Brief** [PCC-M17] — focused on **health and momentum of the group**, not the individual alone.

**[CCC-M20c]** Example Pulse items:

- "12 new members joined this month."
- "Three volunteer opportunities need help this week."
- "Your next committee meeting is Thursday."
- "Two new projects launched."
- "Five members completed leadership training."
- "Welcome our newest organizers."

**[CCC-M20d]** Should feel like **walking into a room** where someone immediately catches you up on everything important.

**[CCC-M20e]** Unlike a traditional dashboard full of charts, the Pulse is:

- Conversational
- Timely
- Action-oriented

**[CCC-M20f]** Orchestrator: `assembleCommunityPulse(communityId, lastVisitAt)` — enriched by CIS intelligence layer [CIS-001]; max 7 items; respects attention budget [CAM-001].

**[CCC-M20g]** V1: rule-based items from lifecycle stage, recent activity, and open opportunities. V1.1: richer orchestration with Health Check integration.

---

## CCC-M21 — Identity & Customization

**[CCC-M21]** Every community type shares **consistent interaction patterns**; each community reflects **unique identity** [CID-001]:

| Shared | Unique |
|--------|--------|
| Widget layout patterns | Community DNA (colors, imagery) |
| Quick Actions behavior | Mission, charter, story |
| Pulse format | Traditions, local language |
| Navigation structure | County/campus context |

**[CCC-M21a]** Future: configurable widget order per community — leaders prioritize what matters locally.

**[CCC-M21b]** One flexible renderer [CID-M15] — not separate page templates per type.

---

## CCC-M22 — V1 Scope

**[CCC-M22]** Jul 12 leader testing / Jul 14 launch minimum:

| Deliverable | Scope |
|-------------|-------|
| Command Center shell | Header + widget grid + Quick Actions |
| Community Pulse | 2–5 rule-based items |
| Mission widget | Charter summary + priorities |
| Opportunity widget | Static volunteer/committee cards |
| Feed widget | Announcements stub |
| People widget | Leaders stub |
| Health widget | Lifecycle stage + Health Check link |
| Recognition / Story | Stub + first milestones |
| Calendar / Projects / Committees / Resources | Placeholders |
| Routes | `/schools/[slug]` · `/county/[slug]` [PAGE-CCC] |

**[CCC-M22a]** Deferred: full widget orchestrator, committee/project systems, calendar sync, member directory, configurable layouts.

---

## CCC-BG — Burt Implementation Guidance

**[CCC-BG]** Implementation should:

1. **Build using reusable widgets** — one React component per widget; registry in `community-command-center.json`
2. **Separate widget content from presentation** — orchestrators return typed payloads
3. **Support configurable layouts** — widget order from registry; future per-community override
4. **Allow community-specific customization** — Community DNA via CID renderer [CCC-M21]
5. **Maintain consistent interaction patterns** — same shell for campus, county, committee, project
6. **Optimize performance for growing communities** — lazy-load below-fold widgets; cache aggregators briefly

**[CCC-BG-a]** Recommended file structure:

```
src/components/ccc/CommunityCommandCenterShell.tsx
src/components/ccc/CommunityPulse.tsx
src/components/ccc/widgets/                       # One file per widget
src/lib/ccc/assembleCommunityCommandCenter.ts
src/lib/ccc/assembleCommunityPulse.ts
data/registry/community-command-center.json
```

**[CCC-BG-b]** Refactor existing `/schools/[slug]` and `/county/[slug]` pages to use Command Center shell — not separate hub templates.

**[CCC-BG-c]** `deriveCommunityLifecycleStage()` [CGS-001] feeds Pulse and Health widget.

---

## AC-036 — Acceptance Criteria

Step 4.3 is complete when:

- [x] **[AC-036a]** Community Command Center philosophy documented. `[CCC-M01, CCC-M03]`
- [x] **[AC-036b]** Core operational widgets defined. `[CCC-M06–M16]`
- [x] **[AC-036c]** Quick actions and community storytelling incorporated. `[CCC-M17, CCC-M18]`
- [x] **[AC-036d]** Mobile-first design principles established. `[CCC-M19, CCC-BG]`
- [x] **[AC-036e]** Community Pulse architecture specified. `[CCC-M20]`
- [x] **[AC-036f]** PCC parallel and identity customization documented. `[CCC-M05, CCC-M21]`
- [x] **[AC-036g]** Burt has blueprint for operational headquarters of every community. `[CCC-BG, community-command-center.json]`

---

**Phase 4 Status:** Complete — [Build Bible](PHASE_4_COMMUNITY_OS_BUILD_BIBLE.md) · **Next:** Phase 5 — Action Operating System

*Trace: Constitution → Growth & Sustainability → Command Center → Pulse → Opportunity → Committee → Project → decades of coordinated organizing*
