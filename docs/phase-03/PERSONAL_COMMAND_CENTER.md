# Personal Command Center

**Document ID:** PHASE-003.6  
**Artifact:** `PERSONAL_COMMAND_CENTER.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 3 — People & Relationship System

> **Every participant should immediately know what matters today.**

This is where everything built so far **comes together**:

| Step | Role |
|------|------|
| [Personal Headquarters](PARTICIPANT_PROFILE_SYSTEM.md) (3.3) | Organizing **home** — identity and belonging |
| [Personal Relationship Network](PERSONAL_RELATIONSHIP_NETWORK.md) (3.4) | Their **community** — trusted relationships |
| [Relationship Growth Engine](RELATIONSHIP_GROWTH_ENGINE.md) (3.5) | How it **expands** — trusted invitations |
| **Personal Command Center** (3.6) | Daily **workspace** — action, awareness, purpose |

**Builds On:** PHQ-001 · NET-001 · RGE-001 · JRN-001 · OIS-001 · PRM-001

**Live spec:** `data/registry/personal-command-center.json`

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| PCC-M01 | Purpose |
| PCC-M02 | Guiding principle |
| PCC-M03 | Design philosophy — six questions |
| PCC-M04 | HQ integration architecture |
| PCC-M05 | Home layout & header |
| PCC-M06 | My Mission widget |
| PCC-M07 | Mission Board widget |
| PCC-M08 | Community widget |
| PCC-M09 | Relationship widget |
| PCC-M10 | Calendar widget |
| PCC-M11 | Learning widget |
| PCC-M12 | Impact widget |
| PCC-M13 | Recognition widget |
| PCC-M14 | Communication widget |
| PCC-M15 | Growth widget |
| PCC-M16 | Quick actions |
| PCC-M17 | Morning Brief architecture |
| PCC-M18 | Mobile philosophy |
| PCC-M19 | Personalization |
| PCC-M20 | V1 scope |
| PCC-BG | Burt implementation guidance |
| AC-025 | Step 3.6 acceptance criteria |

---

## PCC-M01 — Purpose

**[PCC-M01]** The **Personal Command Center** is the participant's **primary workspace** — the page they open every day.

**[PCC-M01a]** Every participant has one, auto-provisioned on registration [PEP-M11].

**[PCC-M01b]** It combines **identity, relationships, organizing, communication, learning, growth, and opportunities** into a single experience.

**[PCC-M01c]** Terminology: use **Personal Command Center** (not "Network Board" or "dashboard"). Command Center communicates **action, awareness, and purpose** — not passive data display.

**[PCC-M01d]** The Command Center should become the **most frequently visited page** on the platform.

---

## PCC-M02 — Guiding Principle

**[PCC-M02]**

> **Every participant should immediately know what matters today.**

**[PCC-M02a]** The Command Center exists to **reduce friction** — participants should never wonder *"What should I do next?"* [PHQ-M04b, JRN-M08].

**[PCC-M02b]** Complementary principles from prior steps:

| Source | Principle |
|--------|-----------|
| PHQ-001 | Every participant deserves a place that feels like their own |
| PRN-M01 | Every participant owns a living network |
| RGE-M02 | Communities grow one trusted relationship at a time |

---

## PCC-M03 — Design Philosophy: Six Questions

**[PCC-M03]** The Command Center answers **six questions** every time a participant logs in:

### 1. Who am I?

| Element | Widget |
|---------|--------|
| Mission | My Mission [PCC-M06] |
| Communities | Community [PCC-M08] |
| Journey | Growth [PCC-M15] |
| Identity | Header + Passport link [PHQ-M13] |

### 2. What changed?

| Signal | Source |
|--------|--------|
| New members | Relationship [PCC-M09] · Morning Brief [PCC-M17] |
| Messages | Communication [PCC-M14] |
| Events | Calendar [PCC-M10] |
| Committee activity | Community [PCC-M08] |
| Volunteer opportunities | Mission Board [PCC-M07] |
| Milestones | Recognition [PCC-M13] |

### 3. What should I do today?

| Source | Widget |
|--------|--------|
| Recommended actions | Mission Board [PCC-M07] |
| Pending invitations | Relationship [PCC-M09] |
| Volunteer opportunities | Calendar · Mission Board |
| Suggested people | Growth [PCC-M15] |
| Upcoming deadlines | Calendar [PCC-M10] |

### 4. Who needs me?

| Need | Widget |
|------|--------|
| Friends waiting | Relationship · Morning Brief |
| Committees | Community |
| Campus / County | Community |
| Mentors | Growth |
| Projects | Community · Mission Board |

### 5. What have I accomplished?

| Area | Widget |
|------|--------|
| Growth | Growth [PCC-M15] |
| Volunteer work | Impact [PCC-M12] |
| Relationships | Relationship [PCC-M09] |
| Projects | Impact |
| Leadership | Recognition [PCC-M13] |
| Milestones | Recognition |

### 6. Where am I going?

| Direction | Widget |
|-----------|--------|
| Journey | Growth [PCC-M15] |
| Goals | My Mission [PCC-M06] |
| Learning | Learning [PCC-M11] |
| Leadership | Growth |
| Community Builder pathway | Journey stage [JRN-M05] |

---

## PCC-M04 — HQ Integration Architecture

**[PCC-M04]** Personal Headquarters (3.3) defines the **organizing home concept**; Personal Command Center (3.6) is its **daily operational implementation**.

```
┌─────────────────────────────────────────────────────────┐
│           Personal Command Center (PCC)                  │
│           Widget implementation layer                    │
├─────────────────────────────────────────────────────────┤
│  Morning Brief → Header → Widget Grid → Quick Actions   │
└──────────────────────────┬──────────────────────────────┘
                           │ assembleCommandCenter()
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
    PHQ sections      PRN network       RGE growth
    JRN journey       OIS opportunities  CPP passport
```

**[PCC-M04a]** Relationship to prior artifacts:

| Artifact | Role in Command Center |
|----------|------------------------|
| PHQ-001 | Section taxonomy + Quick Actions pattern |
| NET-001 / PRN | Relationship widget + network data |
| RGE-001 | Invite tools + growth analytics in Relationship widget |
| JRN-001 | Journey stage in header + Growth widget |
| OIS-001 | Mission Board opportunity cards [PCC-M07] |
| PRM-001 | My Mission widget |

**[PCC-M04b]** Route: `[PAGE-PCC]` at `/command-center` — canonical daily workspace. Aliases: `[PAGE-HQ]` `/hq` · retires `[PAGE-NETWORK]` `/dashboard/network`.

**[PCC-M04c]** Aggregator: `assembleCommandCenter(participantId)` — supersedes `assembleHeadquarters()` as the primary daily payload; HQ aggregator becomes a thin wrapper or alias.

**[PCC-M04d]** **One page, not two homes** — Command Center is the implementation; Headquarters is the philosophy.

---

## PCC-M05 — Home Layout & Header

**[PCC-M05]** The Command Center is **modular**. Every participant sees the same framework; widgets change based on participation and preferences [PCC-M19].

**[PCC-M05a]** **Header** (always visible):

| Element | Source |
|---------|--------|
| Welcome | `preferredName` + time-of-day greeting |
| Mission | One-line mission snippet [PRM-001] |
| Journey Stage | Derived [JRN-M10] |
| Campus | Institution affiliation |
| County | County affiliation |
| Quick Actions | Persistent bar [PCC-M16] |
| Notification Center | Unread count badge (future depth) |

**[PCC-M05b]** **Morning Brief** appears below header on each visit [PCC-M17] — before widget grid.

**[PCC-M05c]** **Widget grid** — responsive, collapsible on mobile [PCC-M18].

---

## PCC-M06 — My Mission Widget

**Key:** `mission` · **Requirement:** [PRM-001]

**[PCC-M06]** Displays:

- Mission Statement · Current focus · Suggested mission refinement
- Today's objective · Progress (qualitative)

**[PCC-M06a]** Maps to PHQ section `mission` [PHQ-M06] with **deeper daily focus** — today's objective is Command Center-specific.

---

## PCC-M07 — Mission Board Widget

**Key:** `missionBoard` · **Requirement:** [OIS-001, JRN-M08]

**[PCC-M07]** Displays **actionable opportunities** — the engine that keeps participants engaged [OIS-M16]:

| Example card | Journey tie |
|--------------|-------------|
| Invite one classmate | Connector [JRN-M05c] |
| Volunteer this weekend | Contributor |
| Welcome two new members | Connector |
| Join a committee | Connector |
| Start a project | Organizer |
| Help launch a nearby county | Community Builder |

**[PCC-M07a]** Cards sourced from journey orchestrator + outreach intelligence [JRN-M10, OIS-M11].

**[PCC-M07b]** V1: 2–4 static/rule-based cards; full orchestrator in v1.1.

**[PCC-M07c]** Maps to PHQ section `opportunities` [PHQ-M11] — Mission Board is the **action-oriented implementation**.

---

## PCC-M08 — Community Widget

**Key:** `community` · **Requirement:** [REG-001, REG-002]

**[PCC-M08]** Displays:

- Campus · County · Committees · Projects · Volunteer teams
- Quick navigation to community hubs

**[PCC-M08a]** Maps to PHQ section `communities` [PHQ-M07].

---

## PCC-M09 — Relationship Widget

**Key:** `relationship` · **Requirement:** [NET-001, RGE-001]

**[PCC-M09]** Displays:

- Recent invitations · People joined · Mentorship (future)
- New connections · Network health · Relationship milestones
- Invite URL + QR quick access [RGE-M04]

**[PCC-M09a]** Implements **depth** for Personal Relationship Network [PRN-M09] — previously scoped as "Network Board."

**[PCC-M09b]** Trust Graph context on hover/tap for connections [PRN-M16].

---

## PCC-M10 — Calendar Widget

**Key:** `calendar`

**[PCC-M10]** Displays:

- Today's events · Upcoming events · Volunteer opportunities
- Committee meetings · Deadlines
- Future: Google / Apple / Outlook sync

**[PCC-M10a]** Maps to PHQ section `calendar` [PHQ-M10]. V1: placeholder + county/campus links.

---

## PCC-M11 — Learning Widget

**Key:** `learning`

**[PCC-M11]** Displays:

- Leadership lessons · Training · Suggested reading · Videos · Community guides
- Future: Civic Academy integration

**[PCC-M11a]** V1: hidden or placeholder — post-launch widget slot reserved.

---

## PCC-M12 — Impact Widget

**Key:** `impact`

**[PCC-M12]** Displays:

- Volunteer hours · Projects · Events attended · People welcomed
- Committees · Communities strengthened

**[PCC-M12a]** Emphasis on **contribution rather than competition** [PHQ-M12, PEP-M13].

**[PCC-M12b]** V1: encouraging stub with zeros — never shame states.

---

## PCC-M13 — Recognition Widget

**Key:** `recognition` · **Requirement:** [CRA-001]

**[PCC-M13]** Displays:

- Milestones · Community appreciation · Volunteer recognition
- Mentorship · Leadership recognition

**[PCC-M13a]** Platform **celebrates service** — not popularity [OIS-M14].

**[PCC-M13b]** V1: recent milestones from Civic Passport [CPP-001].

---

## PCC-M14 — Communication Widget

**Key:** `communication` · **Requirement:** [MSG-001 future]

**[PCC-M14]** Displays:

- Announcements · Messages · Committee updates
- Campus news · County news · Notifications

**[PCC-M14a]** V1: placeholder — "Messages coming soon" with county/campus news links if available.

---

## PCC-M15 — Growth Widget

**Key:** `growth` · **Requirement:** [JRN-001]

**[PCC-M15]** Displays:

- Journey progress · Leadership opportunities · Suggested mentors (future)
- Next milestones · Future recommendations [Step 3.13]

**[PCC-M15a]** Maps to PHQ sections `journey` + `opportunities` [PHQ-M09, PHQ-M11].

---

## PCC-M16 — Quick Actions

**[PCC-M16]** Always available — **one or two taps** on mobile [PHQ-M17]:

| Action | V1 |
|--------|-----|
| Invite | ✅ |
| Share QR | ✅ |
| Find Event | future |
| Volunteer | future |
| Start Committee | future |
| Create Project | future |
| Message Friend | future |
| Search Arkansas | ✅ (map/county) |

**[PCC-M16a]** Persistent in header + floating thumb-zone bar on mobile [PCC-M18].

**[PCC-M16b]** Inherits PHQ Quick Actions [PHQ-M14] — Command Center adds action depth.

---

## PCC-M17 — Morning Brief Architecture

**[PCC-M17]** Introduce the **Morning Brief** — potentially the platform's most engaging daily feature.

> Instead of a static dashboard, participants receive a personalized brief each day (or whenever they next log in).

**[PCC-M17a]** Example brief items:

| Item | Source |
|------|--------|
| "Three new students joined your campus yesterday." | Community analytics |
| "Your county needs volunteers for an event this weekend." | OIS + county hub |
| "One friend accepted your invitation." | RGE lifecycle [RGE-M09] |
| "A new leadership lesson is available." | Learning widget |
| "Your committee meets tomorrow." | Calendar |
| "You're one milestone away from becoming a Mentor." | JRN orchestrator |

**[PCC-M17b]** The Morning Brief is **not a notification feed** — it is a concise, meaningful summary of:

1. What has **changed** since last visit
2. Where the participant can **make an impact**

**[PCC-M17c]** Architecture:

```
assembleMorningBrief(participantId, lastVisitAt)
  → MorningBriefItem[]  (max 5–7 items, prioritized)
  → dismissed items stored per session
```

**[PCC-M17d]** Reinforces: platform is **alive**, community is **active**, meaningful next step **always waiting** [PHQ-M04b].

**[PCC-M17e]** V1: 2–3 rule-based items (welcome back + invite reminder + county link). Full brief orchestrator v1.1.

---

## PCC-M18 — Mobile Philosophy

**[PCC-M18]** Mobile experience is **primary** [PHQ-M17].

| Principle | Implementation |
|-----------|----------------|
| Thumb zone | Header actions + Quick Actions bar |
| Widget collapse | Accordion sections; Mission Board + Morning Brief first |
| Simple navigation | No hamburger for core actions |
| Scroll reveals insight | Brief → Mission Board → widgets; essentials never buried |

**[PCC-M18a]** Widget priority order on mobile:

1. Morning Brief · 2. Mission Board · 3. Relationship · 4. Community · 5. Growth · 6. Others

---

## PCC-M19 — Personalization

**[PCC-M19]** Participants may customize:

| Setting | V1 |
|---------|-----|
| Widget order | future |
| Favorites (pinned widgets) | future |
| Theme | future |
| Notification preferences | cross-ref 3.10 |
| Mission priorities | edit mission |
| Privacy | cross-ref 3.7 |

**[PCC-M19a]** Layout remains **recognizable across the platform** — customization changes order/visibility, not architecture.

---

## PCC-M20 — V1 Scope

**[PCC-M20]** Jul 12 leader testing / Jul 14 launch minimum:

| Deliverable | Scope |
|-------------|-------|
| Command Center shell | Header + widget grid + Quick Actions |
| Morning Brief | 2–3 rule-based items |
| My Mission widget | Edit + display [PRM-001] |
| Mission Board | 2–4 static action cards [OIS-M16] |
| Community widget | County + campus cards |
| Relationship widget | Invites, QR, connection count [NET-001, RGE-001] |
| Growth widget | Journey stage + next milestone |
| Impact / Recognition | Stub + first milestones |
| Calendar / Learning / Communication | Placeholders |
| Route | `/command-center` [PAGE-PCC] |

**[PCC-M20a]** Deferred: full Morning Brief orchestrator, widget reorder, calendar sync, messaging, Civic Academy.

---

## PCC-BG — Burt Implementation Guidance

**[PCC-BG]** Implementation should:

1. **Build using independent widgets** — one React component per widget [PCC-M05]
2. **Allow future widgets without redesign** — widget registry in `personal-command-center.json`
3. **Separate widget data from presentation** — orchestrators return typed payloads
4. **Support responsive layouts** — CSS grid + mobile accordion [PCC-M18]
5. **Prioritize performance** — lazy-load below-fold widgets; cache `assembleCommandCenter()` briefly

**[PCC-BG-a]** Recommended file structure:

```
src/app/(participant)/command-center/page.tsx   # [PAGE-PCC]
src/components/pcc/CommandCenterShell.tsx
src/components/pcc/MorningBrief.tsx
src/components/pcc/widgets/                       # One file per widget
src/lib/pcc/assembleCommandCenter.ts
src/lib/pcc/assembleMorningBrief.ts
data/registry/personal-command-center.json
```

**[PCC-BG-b]** Widget registry drives render order and V1 visibility — no hardcoded widget list in page component.

**[PCC-BG-c]** Redirect `/dashboard/network` → `/command-center` for legacy URLs.

---

## AC-025 — Acceptance Criteria

Step 3.6 is complete when:

- [x] **[AC-025a]** Personal Command Center defined as primary daily workspace. `[PCC-M01, PCC-M04]`
- [x] **[AC-025b]** Six dashboard questions and core widgets documented. `[PCC-M03, PCC-M05–M15]`
- [x] **[AC-025c]** Action-oriented engagement emphasized — Mission Board + Quick Actions. `[PCC-M07, PCC-M16]`
- [x] **[AC-025d]** Morning Brief architecture specified. `[PCC-M17]`
- [x] **[AC-025e]** Mobile-first modular architecture established. `[PCC-M18, PCC-BG]`
- [x] **[AC-025f]** HQ / PRN / RGE integration documented. `[PCC-M04, PCC-M09]`
- [x] **[AC-025g]** Burt has blueprint for daily participant experience. `[PCC-BG, personal-command-center.json]`

---

**Next Step:** 3.10 — Communication Preferences (MSG-001)

*Trace: PHQ home → PRN community → RGE expansion → PCC daily workspace → Morning Brief → Mission Board → journey next step*
