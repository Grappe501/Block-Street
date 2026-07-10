# Personal Headquarters & Participant Profile System

**Document ID:** PHASE-003.3  
**Artifact:** `PARTICIPANT_PROFILE_SYSTEM.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 3 — People & Relationship System

> **Most platforms have a profile page. This platform has a Personal Headquarters.**

When a participant logs in, they should not feel like they are editing an account. They should feel like they are walking into **their own organizing headquarters**. That subtle difference changes every design decision.

**Builds On:** [Participant Identity Doctrine](PARTICIPANT_IDENTITY_DOCTRINE.md) · [Participant Journey Framework](PARTICIPANT_JOURNEY.md) · [Organizing Model](../build-steps/PHASE-001.5-ORGANIZING-MODEL.md)

**Live spec:** `data/registry/personal-headquarters.json`

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| PHQ-M01 | Purpose |
| PHQ-M02 | Guiding principle |
| PHQ-M03 | Headquarters philosophy |
| PHQ-M04 | Home screen |
| PHQ-M05 | Core sections overview |
| PHQ-M06 | My Mission |
| PHQ-M07 | My Communities |
| PHQ-M08 | My Network |
| PHQ-M09 | My Journey |
| PHQ-M10 | My Calendar |
| PHQ-M11 | My Opportunities |
| PHQ-M12 | My Impact |
| PHQ-M13 | My Passport |
| PHQ-M14 | Quick actions |
| PHQ-M15 | Customization |
| PHQ-M16 | Privacy |
| PHQ-M17 | Mobile first |
| PHQ-M18 | Platform center architecture |
| PHQ-M19 | Registration & profile data [USR-001] |
| PHQ-M20 | V1 scope |
| PHQ-BG | Burt implementation guidance |
| AC-022 | Step 3.3 acceptance criteria |

---

## PHQ-M01 — Purpose

**[PHQ-M01]** This document defines the participant's **Personal Headquarters** — the central operating space for every participant.

**[PHQ-M01a]** The Personal Headquarters combines **identity, relationships, organizing activity, leadership development, communication, and future opportunities** into one unified experience.

**[PHQ-M01b]** The Headquarters should become the page participants visit **most often** — not a settings screen they avoid.

**[PHQ-M01c]** Registration and profile data [USR-001] **seed** the Headquarters; they do not replace it.

---

## PHQ-M02 — Guiding Principle

**[PHQ-M02]**

> **Every participant deserves a place that feels like their own.**

**[PHQ-M02a]** The Personal Headquarters should be **welcoming, purposeful, and motivating**.

**[PHQ-M02b]** It helps participants answer:

| Question | Section |
|----------|---------|
| **Who am I?** | My Mission · My Passport |
| **What am I working on?** | My Communities · My Calendar |
| **Who am I connected to?** | My Network |
| **Where can I help today?** | My Opportunities · Quick Actions |
| **How am I growing?** | My Journey · My Impact |

---

## PHQ-M03 — Headquarters Philosophy

**[PHQ-M03]** The Headquarters is **not an account settings page**.

**[PHQ-M03a]** It is the participant's **organizing home** — a workspace, not a form.

**[PHQ-M03b]** Everything important to that participant should eventually be **discoverable from this space** [PHQ-M18].

**[PHQ-M03c]** Terminology:

| Avoid | Use |
|-------|-----|
| Profile page | Personal Headquarters |
| Account dashboard | Organizing home |
| Edit profile | Update your mission / Customize your HQ |
| User settings | Privacy & preferences |

**[PHQ-M03d]** Cross-ref [PEP-M05]: every registered person is a **participant** — the HQ reflects a person, not a user record.

---

## PHQ-M04 — The Home Screen

**[PHQ-M04]** Upon login, participants arrive at their **Personal Headquarters** — default route `[PAGE-HQ]` (alias: `[PAGE-NETWORK]` during V1 migration).

**[PHQ-M04a]** The first screen should immediately communicate:

1. **Welcome back** — personal greeting, not generic dashboard
2. **Here's what's happening** — activity since last visit
3. **Here's your progress** — journey + mission momentum
4. **Here's what needs your attention** — actionable items
5. **Here's how you can help today** — opportunities surfaced first

**[PHQ-M04b]** The three questions every return visit must answer [PHQ-M18]:

1. **What has changed since I was here last?**
2. **What should I do next?**
3. **How am I helping my community?**

---

## PHQ-M05 — Core Sections Overview

**[PHQ-M05]** Eight modular sections compose the Headquarters. Each section maps to identity layers [PEP-M04] and journey orchestration [JRN-M10].

```
┌─────────────────────────────────────────────────────────┐
│  Personal Headquarters                                   │
├──────────────┬──────────────┬──────────────┬────────────┤
│  My Mission  │ My Communities│  My Network  │ My Journey │
├──────────────┼──────────────┼──────────────┼────────────┤
│ My Calendar  │My Opportunities│  My Impact  │ My Passport│
└──────────────┴──────────────┴──────────────┴────────────┘
         Quick Actions bar (always visible, thumb zone)
```

| Section | Key | Identity layer | V1 |
|---------|-----|----------------|-----|
| My Mission | `mission` | Personal | ✅ core |
| My Communities | `communities` | Community | ✅ county/campus |
| My Network | `network` | Relationship | ✅ stub + invite |
| My Journey | `journey` | Journey | ✅ stage + next step |
| My Calendar | `calendar` | — | placeholder |
| My Opportunities | `opportunities` | — | ✅ next-step cards |
| My Impact | `impact` | Leadership | summary stub |
| My Passport | `passport` | Personal + Journey | ✅ mission + timeline seed |

---

## PHQ-M06 — My Mission

**Key:** `mission` · **Requirement:** [PRM-001]

**[PHQ-M06]** Displays:

| Element | Description |
|---------|-------------|
| Personal Mission Statement | Forward-looking purpose [PRM-001] |
| Current focus | What they're working toward now |
| Suggested next action | From journey orchestrator [JRN-M08] |
| Mission progress | Qualitative momentum — not a score |

**[PHQ-M06a]** Participants should **always have a visible purpose** — even a draft mission counts.

**[PHQ-M06b]** Mission is the **opening chapter** of the Civic Passport [CPP-001, PEP-M20].

**[PHQ-M06c]** V1: editable mission text + welcome prompt if empty.

---

## PHQ-M07 — My Communities

**Key:** `communities` · **Requirement:** [REG-001, REG-002]

**[PHQ-M07]** Displays:

- **Campus** — institution affiliation [USR-001]
- **County** — geographic home [USR-001]
- **Committees** — future [COM-001]
- **Projects** — future
- **Volunteer teams** — future [VOL-001]
- **Future communities** — discovery CTA

**[PHQ-M07a]** One participant may belong to **multiple communities** simultaneously.

**[PHQ-M07b]** V1: county + campus cards with links to community hubs.

---

## PHQ-M08 — My Network

**Key:** `network` · **Requirement:** [NET-001, NET-002, NET-003]

**[PHQ-M08]** Displays:

| Element | V1 |
|---------|-----|
| People invited | count stub |
| Mentors | future |
| Connections | future |
| New members in network | future |
| Relationship growth | invite count |
| Quick invite tools | ✅ |
| QR code | ✅ [NET-003] |
| Share link | ✅ [NET-002] |

**[PHQ-M08a]** Absorbs the **Network Board** concept [NET-001] — Step 3.6 implements network depth; HQ provides the shell and primary entry [PHQ-M18].

**[PHQ-M08b]** Network is a **relationship graph view**, not a follower count [PEP-M13, OIS-M14].

---

## PHQ-M09 — My Journey

**Key:** `journey` · **Requirement:** [JRN-001]

**[PHQ-M09]** Displays:

- **Journey stage** — derived, not stored [JRN-M10]
- **Milestones** — achieved + upcoming
- **Volunteer history** — future
- **Leadership development** — future
- **Recognition** — future [Step 3.9]
- **Timeline** — Civic Passport excerpt
- **Growth opportunities** — next steps [JRN-M08]

**[PHQ-M09a]** Journey section makes growth **visible but never mandatory** [JRN-M03a].

---

## PHQ-M10 — My Calendar

**Key:** `calendar`

**[PHQ-M10]** Displays:

- Upcoming events · Volunteer opportunities · Committee meetings
- Deadlines · Personal reminders
- Future: external calendar synchronization

**[PHQ-M10a]** V1: placeholder card — "Events coming in Phase 5" with link to county/campus if events exist.

---

## PHQ-M11 — My Opportunities

**Key:** `opportunities` · **Requirement:** [OIS-001, ANL-001 future]

**[PHQ-M11]** Displays recommended:

- Events · Committees · Volunteer opportunities
- Nearby projects · People to meet · Communities needing help

**[PHQ-M11a]** The platform should **always suggest meaningful next steps** [JRN-M08, OIS-M11].

**[PHQ-M11b]** V1: static next-step cards from journey rules — "Complete your profile," "Invite a friend," "Explore your county."

**[PHQ-M11c]** Full recommendation engine: Step 3.13 — surfaces back to HQ [PHQ-M18].

---

## PHQ-M12 — My Impact

**Key:** `impact`

**[PHQ-M12]** Displays contribution metrics:

| Metric | Emphasis |
|--------|----------|
| Relationships built | People connected |
| Volunteer hours | Service |
| Projects completed | Contribution |
| Events organized | Leadership |
| People mentored | Multiplication |
| Communities strengthened | Legacy |

**[PHQ-M12a]** Impact emphasizes **contribution rather than competition** [PEP-M13, OIS-M14].

**[PHQ-M12b]** V1: welcome message + zeros with encouraging copy — never empty shame states.

---

## PHQ-M13 — My Passport

**Key:** `passport` · **Requirement:** [CPP-001]

**[PHQ-M13]** Displays the **Civic Passport** — permanent record of participation:

- Community history · Achievements · Milestones
- Leadership experiences · Training · Personal timeline

**[PHQ-M13a]** Passport is a **narrative, not a scorecard** [CPP-001, PEP-M20].

**[PHQ-M13b]** V1: mission + registration stamp + county/campus affiliation as first timeline entries.

**[PHQ-M13c]** All milestones [JRN-M07] append here — append-only [KDG-M07, STS-M16].

---

## PHQ-M14 — Quick Actions

**[PHQ-M14]** The Headquarters should always provide **immediate actions** — accessible within one or two taps on mobile [PHQ-M17].

| Action | V1 |
|--------|-----|
| Invite a friend | ✅ |
| Share QR code | ✅ |
| Join an event | future |
| Volunteer | future |
| Create a committee | future |
| Start a project | future |
| Send a message | future |
| View county | ✅ |
| View campus | ✅ (if student) |

**[PHQ-M14a]** Quick Actions bar is **persistent** in the thumb zone on mobile.

---

## PHQ-M15 — Customization

**[PHQ-M15]** Participants may personalize:

| Setting | V1 |
|---------|-----|
| Mission statement | ✅ |
| Profile image | optional |
| Theme | future |
| Favorite communities | future |
| Notification preferences | cross-ref CAM-001 |
| Dashboard layout | future (widget order) |
| Privacy settings | basic — Step 3.7 depth |

**[PHQ-M15a]** Headquarters should feel **personal without becoming complicated**.

---

## PHQ-M16 — Privacy

**[PHQ-M16]** Participants control:

- Public visibility · Profile information · Contact methods
- Community participation · Messaging permissions · Personal data sharing

**[PHQ-M16a]** Privacy should be **understandable and participant-controlled** — full framework in [Trust, Privacy & Digital Safety](TRUST_PRIVACY_DIGITAL_SAFETY.md) [SEC-001]. Trust Center at `/trust-center`.

**[PHQ-M16b]** V1: sensible defaults — name + county visible; contact private.

---

## PHQ-M17 — Mobile First

**[PHQ-M17]** The Personal Headquarters is designed for **phones before desktops**.

**[PHQ-M17a]** Important information appears within the **thumb zone**.

**[PHQ-M17b]** Navigation requires **minimal scrolling** for essential actions [PHQ-M14].

**[PHQ-M17c]** Section layout: single-column stack on mobile; responsive grid on tablet/desktop.

**[PHQ-M17d]** Touch targets ≥ 44px; Quick Actions always reachable.

---

## PHQ-M18 — Platform Center Architecture

**[PHQ-M18]** The Personal Headquarters is the **center of the entire platform** — an orchestration **presentation layer** that aggregates participant-centric data from all systems.

```
                    ┌─────────────────────┐
                    │  Personal HQ (PHQ)  │
                    │  Presentation Layer │
                    └──────────┬──────────┘
         ┌──────────┬───────────┼───────────┬──────────┐
         ▼          ▼           ▼           ▼          ▼
    Identity    Journey     Network    Communities  Organizing
    [PEP-001]   [JRN-001]   [NET-*]    [REG-*]      [EVT/COM]
         │          │           │           │          │
         └──────────┴───────────┴───────────┴──────────┘
                    Participant Knowledge Graph
                         [Step 3.12]
```

**[PHQ-M18a]** Rather than navigating primarily through menus, participants **naturally return to HQ** because it answers the three login questions [PHQ-M04b].

**[PHQ-M18b]** Every future feature — events, committees, messaging, volunteer projects, learning, recognition, recommendations — should **surface meaningful information back to the Personal Headquarters**.

**[PHQ-M18c]** Implementation pattern:

| Layer | Responsibility |
|-------|----------------|
| **Data sources** | Users, networks, journey events, communities, passport |
| **Orchestrators** | Journey stage, next steps, impact summary, since-last-visit |
| **HQ aggregator** | `assembleHeadquarters(participantId)` → section payloads |
| **Presentation** | Modular React sections — widgets swappable without data redesign |

**[PHQ-M18d]** If done well, the platform won't feel like a collection of pages. It will feel like a **living workspace** that grows with each participant throughout their organizing journey.

**[PHQ-M18e]** Step 3.6 [Personal Command Center](PERSONAL_COMMAND_CENTER.md) **implements** HQ as the daily widget workspace [PCC-001] — one page, not two homes.

---

## PHQ-M19 — Registration & Profile Data [USR-001]

**[PHQ-M19]** Registration creates the participant record and **immediately provisions** a Personal Headquarters [USR-001, USR-002].

**[PHQ-M19a]** County-first flow [USR-001]:

1. Student: select county → select school → basic info → mission prompt → **HQ welcome**
2. Non-student (16–24): select county → basic info → mission prompt → **HQ welcome**

**[PHQ-M19b]** Profile data stored separately from HQ presentation [PHQ-BG]:

| Field | Storage | HQ section |
|-------|---------|------------|
| preferredName | `users` | Home greeting |
| countyId | `users` | My Communities |
| institutionId | `users` | My Communities |
| missionStatement | `users` / `personal_missions` | My Mission |
| avatarUrl | `users` | Header |
| privacySettings | `users` | Settings |

**[PHQ-M19c]** Registration must produce **no dead ends** [USR-002] — HQ loads with welcome state, next steps, and invite tools ready.

**[PHQ-M19d]** Honor-system county/campus at V1 [PEP-M05c] — no verification gate.

---

## PHQ-M20 — V1 Scope

**[PHQ-M20]** Jul 12 leader testing / Jul 14 launch minimum:

| Deliverable | Scope |
|-------------|-------|
| HQ shell | Mobile-first layout, 8 section cards |
| My Mission | Edit + display [PRM-001] |
| My Communities | County + campus cards |
| My Network | Invite link + QR stub [NET-002, NET-003] |
| My Journey | Member stage + 2–3 next steps |
| My Opportunities | Static recommendation cards |
| My Passport | Mission + registration timeline stamp [CPP-001] |
| Quick Actions | Invite, share, view county/campus |
| Registration | County-first signup → HQ [USR-001] |

**[PHQ-M20a]** Deferred post-V1: calendar, impact metrics, full widgets, theme, layout customization, full orchestrator.

---

## PHQ-BG — Burt Implementation Guidance

**[PHQ-BG]** Implementation should:

1. **Build HQ as a modular dashboard** — one component per section [PHQ-M05]
2. **Support future dashboard widgets** — registry-driven section config in `personal-headquarters.json`
3. **Separate presentation from participant data** — `assembleHeadquarters()` aggregator [PHQ-M18c]
4. **Allow personalization without requiring redesign** — prefs change widget visibility, not architecture
5. **Keep performance fast** — lazy-load non-critical sections; cache aggregator output briefly

**[PHQ-BG-a]** File structure (recommended):

```
src/app/(participant)/hq/page.tsx          # Route [PAGE-HQ]
src/components/hq/HQShell.tsx              # Layout + Quick Actions
src/components/hq/sections/                # One file per section
src/lib/hq/assembleHeadquarters.ts         # Aggregator
data/registry/personal-headquarters.json    # Section registry
```

**[PHQ-BG-b]** Database: extend `users` per [USR-001]; no `headquarters` table — HQ is computed.

**[PHQ-BG-c]** Admin preview: `AdminPersonalHeadquarters` tab shows section registry and V1 scope.

---

## AC-022 — Acceptance Criteria

Step 3.3 is complete when:

- [x] **[AC-022a]** Personal Headquarters concept defined — not a profile page. `[PHQ-M01, PHQ-M03]`
- [x] **[AC-022b]** Core dashboard sections documented (8 sections). `[PHQ-M05–M13]`
- [x] **[AC-022c]** Identity, relationships, opportunities, and impact unified. `[PHQ-M02, PHQ-M18]`
- [x] **[AC-022d]** Mobile-first principles incorporated. `[PHQ-M17]`
- [x] **[AC-022e]** Platform center architecture specified. `[PHQ-M18]`
- [x] **[AC-022f]** Registration → HQ flow documented [USR-001]. `[PHQ-M19]`
- [x] **[AC-022g]** Burt has blueprint for primary participant experience. `[PHQ-BG, personal-headquarters.json]`

---

**Next Step:** 3.11 — Participant Timeline

*Trace: USR-001 registration → PHQ shell → NET-002/003 invite tools → JRN orchestrator → CPP timeline*
