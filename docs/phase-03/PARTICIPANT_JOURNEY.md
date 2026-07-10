# Participant Journey

**Document ID:** PHASE-003.2  
**Artifact:** `PARTICIPANT_JOURNEY.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 3 — People & Relationship System

> **Everything in the platform should help someone move one step forward.**

**Builds On:** [Participant Identity Doctrine](PARTICIPANT_IDENTITY_DOCTRINE.md) · [Organizing Model](../build-steps/PHASE-001.5-ORGANIZING-MODEL.md) · [Growth Model](../build-steps/PHASE-001.6-GROWTH-MODEL.md) · [Status Framework](../phase-02/CANONICAL_STATUS_LIFECYCLE_FRAMEWORK.md)

**Live spec:** `data/registry/participant-journey.json`

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| JRN-M01 | Purpose |
| JRN-M02 | Guiding principle |
| JRN-M03 | Three pillars |
| JRN-M04 | Journey stages |
| JRN-M05 | Stage definitions |
| JRN-M06 | Progression signals |
| JRN-M07 | Platform behaviors per stage |
| JRN-M08 | Journey + status integration |
| JRN-M09 | Recognition & milestones |
| JRN-M10 | Suggested next actions |
| JRN-M11 | Privacy & consent by stage |
| JRN-M12 | V1 scope |
| JRN-BG | Burt implementation guidance |
| AC-021 | Step 3.2 acceptance criteria |

---

## JRN-M01 — Purpose

**[JRN-M01]** The **Participant Journey** defines how every user progresses through the platform — from first visit to long-term community leadership.

**[JRN-M01a]** Counties, schools, and networks are **places and relationships**. The Journey is what people **experience every day** — their path toward purpose.

**[JRN-M01b]** Every feature in Phases 3–9 should answer: *Does this help someone move one step forward?*

---

## JRN-M02 — Guiding Principle

**[JRN-M02]**

> **One step forward.**

**[JRN-M02a]** No dead ends. No vanity metrics. Every dashboard, notification, and Mission Board card should suggest a **meaningful next step** aligned with the participant's current stage.

**[JRN-M02b]** Leadership develops **naturally** through participation — not assigned titles alone [OM-L5, GM-P7].

---

## JRN-M03 — Three Pillars

**[JRN-M03]** The platform serves participants through three integrated pillars:

| Pillar | Phase | Gives people |
|--------|-------|--------------|
| **Place** | Digital Arkansas (2) | County, campus, community home |
| **Relationships** | People (3) | Network, invites, referrals |
| **Purpose** | Journey (3+) | Stage, growth, next action |

```
Registry  →  "Where do I belong?"
Network   →  "Who do I know?"
Journey   →  "What should I do next?"
```

**[JRN-M03a]** A student at UCA has a **place** (campus page), will build **relationships** (network board), and follows a **journey** (Visitor → Member → Organizer → …).

---

## JRN-M04 — Journey Stages

**[JRN-M04]** Canonical progression:

```
Visitor
    ↓
Interested
    ↓
Registered
    ↓
Connected
    ↓
Contributor
    ↓
Organizer
    ↓
Leader
    ↓
Mentor
    ↓
Alumni
    ↓
Community Builder
```

**[JRN-M04a]** Stages reflect **engagement depth** — not account types. A person is always a **participant** [PEP-M03].

**[JRN-M04b]** Legacy alias: `member` → `registered` in code until migration.

---

## JRN-M05 — Stage Definitions

| Stage | Key | Description |
|-------|-----|-------------|
| **Visitor** | `visitor` | Browsing — no account |
| **Interested** | `interested` | Started signup or saved intent |
| **Registered** | `registered` | Account created — belongs to county/campus |
| **Connected** | `connected` | Active in network — knows others, invited |
| **Contributor** | `contributor` | Invites, events, projects — giving back |
| **Organizer** | `organizer` | Building community — recruitment, coordination |
| **Leader** | `leader` | Sustained leadership — committees, campaigns |
| **Mentor** | `mentor` | Developing others — mentorship edges |
| **Alumni** | `alumni` | Graduated / moved on — stays connected |
| **Community Builder** | `community_builder` | Cross-community impact — regional/statewide |

**[JRN-M05a]** V1 implements through **`registered`** with signals toward **`connected`** and **`contributor`**. Full stage automation in later steps.

---

## JRN-M06 — Progression Signals

**[JRN-M06]** Stage advancement derived from **behavior**, not manual assignment alone:

| Signal | Suggests stage |
|--------|----------------|
| Account created + county/campus | `registered` |
| First invite accepted / network link | `connected` |
| First invite sent / active participation | `contributor` |
| N invites / network depth | `contributor` → `organizer` |
| Committee join / event host | `organizer` |
| Sustained recruitment + projects | `leader` |
| Mentorship relationships | `mentor` |
| Graduation / age transition | `alumni` |
| Multi-community leadership | `community_builder` |

**[JRN-M06a]** Signals stored as **journey events** — append-only [KDG-M07, STS-M16 pattern].

---

## JRN-M07 — Platform Behaviors Per Stage

| Stage | Platform experience |
|-------|---------------------|
| Visitor | Map, campus/county pages, WHY, join CTA |
| Interested | Resume signup, county/campus preselect |
| Registered | Network board, invite tools, Personal Mission, Mission Board cards |
| Connected | See who you know, suggested connections |
| Contributor | Milestones, recognition, suggested invites |
| Organizer | Campus/county dashboard tools, outreach priorities |
| Leader | Committee/project creation, moderation |
| Mentor | Mentorship matching, new member welcome |
| Alumni | Alumni network, advisory roles |
| Community Builder | Cross-county opportunities, statewide Mission Board |

**[JRN-M07a]** Features **unlock by stage** where appropriate — never gate basic belonging [CP-006].

---

## JRN-M08 — Journey + Status Integration

**[JRN-M08]** Participant Journey integrates with [Status Framework](../phase-02/CANONICAL_STATUS_LIFECYCLE_FRAMEWORK.md):

| Concept | Scope |
|---------|-------|
| **Organizing status** | County, institution, committee — community health |
| **Journey stage** | Individual participant — personal progression |
| **Verification status** | Data quality — separate from journey |

**[JRN-M08a]** First organizer at a campus advances **both**: participant → `organizer`, institution → `building`.

**[JRN-M08b]** Journey stage stored on participant record + timeline — not inferred from page logic alone.

---

## JRN-M09 — Recognition & Milestones

**[JRN-M09]** Celebrate progression [OIS-M14, CP-003]:

| Milestone | Example |
|-----------|---------|
| First invite | Contributor badge |
| Network of 5 | Growing organizer |
| First campus organizer | Community launch |
| Mentor match | Leadership development |

**[JRN-M09a]** Recognition encourages **collaboration** — not unhealthy competition.

---

## JRN-M10 — Suggested Next Actions

**[JRN-M10]** Every personal dashboard ends with **one clear next step** [OIS-M15]:

| Stage | Example next action |
|-------|---------------------|
| Registered | "Invite 3 classmates" |
| Connected | "Meet organizers at your campus" |
| Contributor | "Join the team building at UCA" |
| Organizer | "Host your first event" |
| Mentor | "Welcome a new member" |

**[JRN-M10a]** Mission Board personal cards driven by journey stage + network state [OIS-M16].

---

## JRN-M11 — Privacy & Consent by Stage

**[JRN-M11]** Journey data follows privacy rules:

| Rule | Detail |
|------|--------|
| Public profile scope | Participant controls visibility |
| Journey stage | May be private or community-visible |
| Network graph | Referral attribution with consent |
| Minor protections | Age-appropriate defaults [DG-*] |

---

## JRN-M12 — V1 Scope

**[JRN-M12]** Version 1 (Jul 12–14):

| Deliverable | V1 |
|-------------|-----|
| Journey philosophy & stages | ✅ This document |
| `participant-journey.json` catalog | ✅ |
| Registration → `registered` | Step 3.3 implementation |
| Connected + contributor signals | Steps 3.4–3.5 |
| Full stage automation | V1.1+ |
| Mentor / alumni / community builder | Future |

---

## JRN-BG — Burt Implementation Guidance

**[JRN-BG]** Implementation should:

| # | Rule |
|---|------|
| 1 | Store journey stage on participant + **append-only journey timeline** |
| 2 | Derive stage suggestions from **signals** — allow steward override |
| 3 | Every Phase 3+ feature maps to **at least one journey stage** |
| 4 | Personal dashboard: **Place + Relationships + Purpose** sections |
| 5 | Mission Board cards filtered by journey stage |
| 6 | Do not gate county/campus **belonging** behind advanced stages |
| 7 | Integrate with status timeline pattern [STS-M16] |

---

## AC-019 — Acceptance Criteria

Step 3.2 is complete when:

- [x] **[AC-021a]** Participant Journey purpose documented. `[JRN-M01]`
- [x] **[AC-021b]** Three pillars defined. `[JRN-M03]`
- [x] **[AC-021c]** Journey stages specified. `[JRN-M04, JRN-M05]`
- [x] **[AC-021d]** Progression signals and platform behaviors defined. `[JRN-M06, JRN-M07]`
- [x] **[AC-021e]** Integration with status framework documented. `[JRN-M08]`
- [x] **[AC-021f]** Burt has framework for Phase 3+ feature design. `[JRN-BG, participant-journey.json]`

---

**Next Step:** 3.3 — Participant Profile System (USR-001)

*Trace: OM-L1 → JRN-M04 → NET-001 → Mission Board personal cards [OIS-M16]*
