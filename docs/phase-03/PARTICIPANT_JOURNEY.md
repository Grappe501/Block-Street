# Participant Journey Framework

**Document ID:** PHASE-003.2  
**Artifact:** `PARTICIPANT_JOURNEY.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 3 — People & Relationship System

> **Most software tracks accounts. This platform tracks growth.**

The journey begins the participant's **lifelong path** through the platform — not to rank people, but to help every participant discover their next opportunity to learn, contribute, and lead.

**Builds On:** [Participant Identity Doctrine](PARTICIPANT_IDENTITY_DOCTRINE.md) · [Organizing Model](../build-steps/PHASE-001.5-ORGANIZING-MODEL.md) · [Growth Model](../build-steps/PHASE-001.6-GROWTH-MODEL.md) · [Civic Passport](PARTICIPANT_IDENTITY_DOCTRINE.md#pep-m20--civic-passport-architecture)

**Live spec:** `data/registry/participant-journey.json`

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| JRN-M01 | Purpose |
| JRN-M02 | Guiding principle |
| JRN-M03 | Journey philosophy |
| JRN-M04 | Journey stages overview |
| JRN-M05 | Stage definitions (1–9) |
| JRN-M06 | Journey is not linear |
| JRN-M07 | Progress signals & milestones |
| JRN-M08 | Personalized next steps |
| JRN-M09 | Journey timeline & Civic Passport |
| JRN-M10 | Orchestration layer architecture |
| JRN-M11 | Three pillars integration |
| JRN-M12 | Status framework integration |
| JRN-M13 | Privacy by stage |
| JRN-M14 | V1 scope |
| JRN-BG | Burt implementation guidance |
| AC-021 | Step 3.2 acceptance criteria |

---

## JRN-M01 — Purpose

**[JRN-M01]** This document defines the **lifecycle of every participant** within ASYON.

**[JRN-M01a]** The journey framework provides a shared model for participant development — from **first discovery** through **long-term community leadership**.

**[JRN-M01b]** Every feature should support participants in taking **meaningful next steps** rather than remaining passive users.

**[JRN-M01c]** Purpose is **not to rank people** — it is to help every participant discover their next opportunity to **learn, contribute, and lead**.

---

## JRN-M02 — Guiding Principle

**[JRN-M02]**

> **The platform exists to help people grow.**

**[JRN-M02a]** Growth is measured by **participation, relationships, service, and leadership** — not by popularity [PEP-M13, OIS-M14].

**[JRN-M02b]** Complementary principle:

> **One step forward.** — always a visible next opportunity [JRN-M08].

---

## JRN-M03 — Journey Philosophy

**[JRN-M03]** Participants should always know:

| Question | Source |
|----------|--------|
| **Where am I?** | Derived journey stage [JRN-M10] |
| **What have I accomplished?** | Milestones + Civic Passport [JRN-M09] |
| **What's available next?** | Personalized recommendations [JRN-M08] |

**[JRN-M03a]** The platform **gently encourages progress** — without pressure or competition [PEP-M13].

**[JRN-M03b]** Journey reflects **growth, not rank** [JRN-M06].

---

## JRN-M04 — Journey Stages Overview

**[JRN-M04]** Nine canonical stages:

```
Explorer → Member → Connector → Contributor → Organizer
    → Leader → Mentor → Community Builder → Alumni
```

**[JRN-M04a]** Stages describe **engagement depth** — not account types. Every registered person is a **participant** [PEP-M05].

**[JRN-M04b]** Legacy aliases: `visitor`/`interested` → `explorer` · `registered`/`member` → `member` · `connected` → `connector`

---

## JRN-M05 — Stage Definitions

### Stage 1 — Explorer

**Key:** `explorer`

**[JRN-M05a]** Participant has **discovered** the platform — no account required.

| Objectives | Platform focus |
|------------|----------------|
| Learn the mission | Welcome |
| Explore counties and campuses | Inspiration |
| Understand organizing model | Discovery |
| Decide whether to join | Join CTA |

---

### Stage 2 — Member

**Key:** `member`

**[JRN-M05b]** Participant has **registered**.

| Objectives | Platform focus |
|------------|----------------|
| Complete profile | Belonging |
| Select campus and/or county | Orientation |
| Meet the community | |
| Receive **Civic Passport** [CPP-001] | |
| Receive **Network Board** | |
| Receive invite link and QR code | |

**V1 target stage** after registration [Step 3.3].

---

### Stage 3 — Connector

**Key:** `connector`

**[JRN-M05c]** Participant begins **building relationships**.

| Examples | Platform focus |
|----------|----------------|
| Invites friends | Relationships |
| Joins discussions | |
| Attends an event | |
| Joins a committee | |
| Connects with other members | |

---

### Stage 4 — Contributor

**Key:** `contributor`

**[JRN-M05d]** Participant **actively helps** the community.

| Examples | Platform focus |
|----------|----------------|
| Volunteers | Contribution |
| Assists with events | |
| Shares resources | |
| Welcomes new members | |
| Participates in projects | |

---

### Stage 5 — Organizer

**Key:** `organizer`

**[JRN-M05e]** Participant begins **creating opportunities**.

| Examples | Platform focus |
|----------|----------------|
| Organizes an event | Ownership |
| Starts a committee | |
| Recruits volunteers | |
| Coordinates projects | |
| Helps build campus or county | |

**[JRN-M05f]** First organizer at a campus also advances **community organizing status** [JRN-M12].

---

### Stage 6 — Leader

**Key:** `leader`

**[JRN-M05g]** Participant **develops people**.

| Examples | Platform focus |
|----------|----------------|
| Mentors organizers | Leadership development |
| Coordinates teams | |
| Solves community problems | |
| Leads initiatives | |
| Builds sustainable systems | |

---

### Stage 7 — Mentor

**Key:** `mentor`

**[JRN-M05h]** Participant **intentionally develops future leaders**.

| Examples | Platform focus |
|----------|----------------|
| Coaches new members | Multiplication |
| Shares experience | |
| Connects people | |
| Helps new communities launch | |

---

### Stage 8 — Community Builder

**Key:** `community_builder`

**[JRN-M05i]** Participant **strengthens the entire network**.

| Examples | Platform focus |
|----------|----------------|
| Launches new communities | Legacy |
| Builds partnerships | |
| Improves the platform | |
| Documents knowledge | |
| Creates lasting infrastructure | |

---

### Stage 9 — Alumni

**Key:** `alumni`

**[JRN-M05j]** Life circumstances change — **relationships remain** [PEP-M16].

| Examples | Platform focus |
|----------|----------------|
| Graduated · Changed careers · Moved | Continuity |
| Continues mentoring | |
| Supports future organizers | |

**[JRN-M05k]** Alumni is not an end — it is a **continuing relationship** with the network.

---

## JRN-M06 — Journey Is Not Linear

**[JRN-M06]** Participants may **move forward, pause, or return** to earlier forms of participation.

| Example | Meaning |
|---------|---------|
| A mentor also volunteers | Multiple active modes |
| A leader joins a new committee as learner | Growth continues |
| An alumnus organizes a new initiative | Re-engagement |

**[JRN-M06a]** Journey reflects **growth, not rank** — no leaderboard, no forced progression [PEP-M13].

**[JRN-M06b]** Orchestration layer supports **multiple concurrent activity types** [JRN-M10].

---

## JRN-M07 — Progress Signals & Milestones

**[JRN-M07]** Celebrate **meaningful milestones** — participation, not competition:

| Milestone | Signal |
|-----------|--------|
| First login | `first_login` |
| First completed profile | `profile_complete` |
| First invitation accepted | `first_invite_accepted` |
| First event attended | `first_event_attended` |
| First volunteer activity | `first_volunteer` |
| First committee joined | `first_committee` |
| First event organized | `first_event_organized` |
| First person mentored | `first_mentorship` |
| First community project completed | `first_project_complete` |

**[JRN-M07a]** Milestones append to **journey timeline** and **Civic Passport** [JRN-M09].

**[JRN-M07b]** Stored as **journey events** — append-only [STS-M16, KDG-M07].

---

## JRN-M08 — Personalized Next Steps

**[JRN-M08]** Every participant always receives a **recommendation** — the journey never dead-ends [OIS-M15].

| Example next step |
|-------------------|
| Complete your profile |
| Meet people from your campus |
| Attend an event |
| Join a committee |
| Invite a friend |
| Volunteer this month |
| Mentor a new member |

**[JRN-M08a]** Recommendations derived from **orchestration layer** — stage + gaps + Mission Board [JRN-M10, OIS-M16].

**[JRN-M08b]** One primary CTA visible on network board — additional options secondary.

---

## JRN-M09 — Journey Timeline & Civic Passport

**[JRN-M09]** Every milestone becomes part of the participant's **Civic Passport** [CPP-001].

The timeline tells the story of:

- Relationships built · Communities joined · Service performed
- Leadership developed · Impact created

**[JRN-M09a]** Timeline is the **narrative backbone** of the passport — not a scorecard [PEP-M20].

**[JRN-M09b]** Full timeline spec: [Civic Journey Timeline](CIVIC_JOURNEY_TIMELINE.md) [CJT-001].

---

## JRN-M10 — Orchestration Layer Architecture

**[JRN-M10]** **Signature architecture:** Journey is an **orchestration layer** — not a single database field.

**[JRN-M10a]** Instead of storing `"stage": "organizer"`, the platform **derives** journey from real experiences:

```
Journey Orchestrator
    ← relationships formed (graph edges)
    ← events attended / organized
    ← projects completed
    ← volunteer service hours
    ← mentoring activity
    ← leadership activities
    ← milestones achieved
    → derived primary stage
    → derived next-step recommendations
    → Civic Passport updates
```

**[JRN-M10b]** Benefits:

| Benefit | Why |
|---------|-----|
| **Authentic** | Stage reflects what person actually did |
| **Evolves naturally** | No manual stage updates |
| **Better recommendations** | Based on real participation gaps |
| **Non-linear** | Multiple activity types coexist [JRN-M06] |

**[JRN-M10c]** Implementation:

| Component | Role |
|-----------|------|
| `journey_events` table | Append-only milestone log |
| `deriveJourneyStage(participantId)` | Query graph + operational data |
| `suggestedNextSteps(participantId)` | Orchestrator output |
| `primaryStage` cache | Optional denormalized cache — **derived**, refreshable |

**[JRN-M10d]** V1: simple rules on registration + invite signals. Full orchestrator post-launch.

---

## JRN-M11 — Three Pillars Integration

**[JRN-M11]** Journey connects the three pillars [PEP-M06]:

```
Place (Registry)     →  Explorer discovers, Member belongs
Relationships (Net)  →  Connector builds, Contributor strengthens
Purpose (Journey)    →  Every stage has next step + Mission alignment
```

**[JRN-M11a]** Personal Mission [PRM-001] informs recommendations at every stage.

---

## JRN-M12 — Status Framework Integration

**[JRN-M12]** Journey stage ≠ organizing status:

| Concept | Scope |
|---------|-------|
| **Journey stage** | Individual participant growth |
| **Organizing status** | County, institution, committee health [STS-M01] |
| **Verification status** | Data quality [KDG-M09] |

**[JRN-M12a]** First organizer at campus: participant → `organizer`, institution → `building`.

---

## JRN-M13 — Privacy by Stage

**[JRN-M13]** Journey visibility is **participant-controlled** [PEP-M15]:

- Stage may be private, network-visible, or community-visible
- Milestones follow same privacy rules
- Never expose journey data to create pressure or comparison

---

## JRN-M14 — V1 Scope

**[JRN-M14]** Jul 12–14:

| Deliverable | V1 |
|-------------|-----|
| Journey philosophy & 9 stages | ✅ This document |
| Orchestration architecture spec | ✅ |
| Milestones catalog | ✅ JSON |
| Member stage on registration | Step 3.3 |
| Connector + contributor signals | Steps 3.4–3.5 |
| Simple derivation rules | Step 3.3–3.6 implementation |
| Full orchestrator | V1.1+ |

---

## JRN-BG — Burt Implementation Guidance

**[JRN-BG]** Implementation should:

| # | Rule |
|---|------|
| 1 | **Derive** journey from experiences — orchestration layer [JRN-M10] |
| 2 | Store stage **separately from authentication** [PEP-M21] |
| 3 | Allow **flexible movement** between stages [JRN-M06] |
| 4 | Base recommendations on **actual participation** — not vanity metrics |
| 5 | **Preserve historical milestones** — append-only timeline |
| 6 | Make progression **visible but never mandatory** |
| 7 | Every milestone → **Civic Passport** stamp [CPP-001] |
| 8 | Never gate **belonging** behind advanced stages [PEP-M12] |
| 9 | Mission Board cards use orchestrator output [OIS-M16] |

---

## AC-021 — Acceptance Criteria

Step 3.2 is complete when:

- [x] **[AC-021a]** Participant lifecycle fully defined. `[JRN-M04, JRN-M05]`
- [x] **[AC-021b]** Stages emphasize growth through service and relationships. `[JRN-M02, JRN-M05]`
- [x] **[AC-021c]** Milestones and next-step recommendations documented. `[JRN-M07, JRN-M08]`
- [x] **[AC-021d]** Non-linear journey and lifelong participation supported. `[JRN-M06, JRN-M05j]`
- [x] **[AC-021e]** Orchestration layer architecture specified. `[JRN-M10]`
- [x] **[AC-021f]** Burt has blueprint for journey system. `[JRN-BG, participant-journey.json]`

---

**Next Step:** 3.14 — Participant Experience

*Trace: USR-001 registration → PHQ shell → NET-002/003 invite tools → JRN orchestrator → CPP timeline*
