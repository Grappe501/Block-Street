# Participant Identity Doctrine

**Document ID:** PHASE-003.1  
**Artifact:** `PARTICIPANT_IDENTITY_DOCTRINE.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 3 — People & Relationship System

> **Phase 1 defined the platform. Phase 2 defined Arkansas. Phase 3 begins by defining the person.**

This is the most important document after the Constitution.

**Builds On:** [Organizing Model](../build-steps/PHASE-001.5-ORGANIZING-MODEL.md) · [Living Systems](../master/LIVING-SYSTEMS-ARCHITECTURE.md) · [Digital Arkansas](../phase-02/PHASE_2_DIGITAL_ARKANSAS_BUILD_BIBLE.md) · [Participant Journey](PARTICIPANT_JOURNEY.md)

**Live spec:** `data/registry/participant-identity.json`

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| PEP-M01 | Purpose |
| PEP-M02 | Core design question |
| PEP-M03 | Guiding principles |
| PEP-M04 | Identity philosophy |
| PEP-M05 | What is a participant |
| PEP-M06 | Identity layers overview |
| PEP-M07 | Personal identity layer |
| PEP-M08 | Community identity layer |
| PEP-M09 | Relationship identity layer |
| PEP-M10 | Leadership identity layer |
| PEP-M11 | Journey identity layer |
| PEP-M12 | Every participant has a home |
| PEP-M13 | Equal opportunity |
| PEP-M14 | Identity is dynamic |
| PEP-M15 | Trust |
| PEP-M16 | Identity persistence |
| PEP-M17 | Identity beyond biography |
| PEP-M18 | Participant Promise |
| PEP-M19 | Personal Mission |
| PEP-M20 | Civic Passport architecture |
| PEP-M21 | Person vs account separation |
| PEP-M22 | Relationship-first design |
| PEP-M23 | Phase 3 roadmap |
| PEP-M24 | V1 scope |
| PEP-BG | Burt implementation guidance |
| AC-020 | Step 3.1 acceptance criteria |

---

## PEP-M01 — Purpose

**[PEP-M01]** This document establishes the **philosophy, structure, and identity model** for every participant within ASYON.

**[PEP-M01a]** The platform recognizes participants as **people first** and software users second.

**[PEP-M01b]** Identity is not limited to authentication credentials or profile information.

**[PEP-M01c]** Identity represents a participant's **relationships, interests, communities, experiences, growth, and contributions** throughout their journey.

**[PEP-M01d]** Phase 3 answers:

> **Who is this person, how do they grow, and how do they connect to others?**

---

## PEP-M02 — Core Design Question

**[PEP-M02]** Most software asks:

> "What information do we need about this user?"

**[PEP-M02a]** We ask a different question:

> **"What does this person need from us to become successful?"**

**[PEP-M02b]** This one question influences **every screen** Burt builds.

| Old framing | New framing |
|-------------|-------------|
| Collect fields | Enable belonging |
| Complete profile | Find their home |
| User onboarding | Journey beginning |
| Feature adoption | Relationship growth |

---

## PEP-M03 — Guiding Principles

**[PEP-M03a]**

> **Start with people, not users.**

A **user** logs into software. A **person** has relationships, aspirations, interests, skills, communities, and a story.

**[PEP-M03b]**

> **Every participant matters before they contribute.**

A participant's value is **never** determined by:

- Popularity · Recruitment numbers · Volunteer hours
- Leadership position · Time on the platform

**[PEP-M03c]** Every participant begins with **equal dignity**, **equal opportunity**, and **equal access** to build relationships and contribute [PEP-M13].

**[PEP-M03d]** The individual is the **root of the knowledge graph** [OM-L1].

---

## PEP-M04 — Identity Philosophy

**[PEP-M04]** Participants are **not database records**. Participants are **community builders**.

**[PEP-M04a]** The platform exists to help each person:

| Need | Platform response |
|------|-------------------|
| Find belonging | Registry homes + county/campus |
| Build relationships | Personal network [Step 3.4] |
| Develop leadership | Journey + growth [Steps 3.2, 3.8 PGL-001] |
| Discover opportunities | Mission Board [OIS-M16] |
| Strengthen communities | Organizing tools [Phase 5] |
| Leave lasting impact | Civic Passport [PEP-M20] |

---

## PEP-M05 — What Is a Participant

**[PEP-M05]** A **participant** is any person engaged with ASYON.

| State | Description |
|-------|-------------|
| Visitor | Exploring — no account |
| Participant | Registered — full identity model applies |
| Journey stages | Descriptive labels — not separate account types |

**[PEP-M05a]** Permanent ID: `PRT-{uuid}` — immutable graph node.

**[PEP-M05b]** No privileged tiers bypassing community governance [CP-003, DG-001].

**[PEP-M05c]** Honor-system county/campus at V1 [USR-001].

---

## PEP-M06 — Identity Layers Overview

**[PEP-M06]** Every participant has **five identity dimensions** — integrated, not siloed.

| Layer | Question |
|-------|----------|
| **Personal** [PEP-M07] | Who am I? |
| **Community** [PEP-M08] | Where do I belong? |
| **Relationship** [PEP-M09] | Who do I know? |
| **Leadership** [PEP-M10] | How am I growing? |
| **Journey** [PEP-M11] | Where am I in my journey? |

**[PEP-M06a]** All layers compose the **Civic Passport** [PEP-M20] — the living record of civic participation.

---

## PEP-M07 — Personal Identity Layer

**[PEP-M07]** *Who am I?*

| Element | V1 | Future |
|---------|-----|--------|
| Preferred name | ✅ | |
| Pronouns (optional) | ✅ | |
| Profile photo (optional) | Partial | |
| Biography | Partial | |
| **Mission statement** | ✅ [PEP-M19] | |
| Personal interests | ✅ | |
| Skills | Partial | Step 3.8 [PGL-001] |
| Goals | Future | |
| Communication preferences | Future | CAM-001 [Step 3.10] |
| Privacy settings | ✅ | Step 3.7 |

**[PEP-M07a]** Participant-controlled — never inferred from institution alone.

---

## PEP-M08 — Community Identity Layer

**[PEP-M08]** *Where do I belong?*

| Affiliation | Graph edge |
|-------------|------------|
| Educational institution | `attends` |
| County | `resides_in` |
| Committees | `member_of` (future) |
| Projects | `contributes_to` (future) |
| Volunteer teams | future |

**[PEP-M08a]** Participants may belong to **multiple communities simultaneously** — edges, not duplicate records.

**[PEP-M08b]** Every participant has a **county home** — always [LS-Q1].

---

## PEP-M09 — Relationship Identity Layer

**[PEP-M09]** *Who do I know?*

| Relationship | Meaning |
|--------------|---------|
| Personal network | People they've connected |
| Mentors | `mentored_by` edges (future) |
| People invited | Referral subgraph |
| Collaborators | Shared projects |
| Committee members | Shared committees |

**[PEP-M09a]** **Relationships become a defining part of identity** — not a sidebar metric [OM-L2].

**[PEP-M09b]** Full spec: Step 3.4 [Personal Relationship Network](PERSONAL_RELATIONSHIP_NETWORK.md).

---

## PEP-M10 — Leadership Identity Layer

**[PEP-M10]** *How am I growing?*

Leadership is **descriptive rather than hierarchical**.

| Role descriptor | Meaning |
|-----------------|---------|
| Organizer | Building community |
| Mentor | Developing others |
| Volunteer | Giving time |
| Project leader | Leading action |
| Committee facilitator | Enabling group process |

**[PEP-M10a]** Derived from **participation signals** [JRN-M06] — not assigned titles alone.

**[PEP-M10b]** Leadership milestones tracked in Civic Passport [PEP-M20] — not rank badges.

---

## PEP-M11 — Journey Identity Layer

**[PEP-M11]** *Where am I in my journey?*

Evolves continuously — full spec: [Participant Journey](PARTICIPANT_JOURNEY.md).

```
Visitor → Interested → Registered → Connected → Contributor
    → Organizer → Leader → Mentor → Alumni → Community Builder
```

**[PEP-M11a]** Journey stage may differ per community context — campus vs county.

---

## PEP-M12 — Every Participant Has a Home

**[PEP-M12]** Immediately after registration, every participant receives:

| Asset | V1 |
|-------|-----|
| Personal dashboard / command center | Step 3.6 [PCC-001] |
| Personal network | Step 3.4 |
| County affiliation | ✅ Registry |
| Educational affiliation (if applicable) | ✅ Registry |
| Mission board (personal cards) | Partial |
| Activity timeline | CJT-001 [Step 3.11] |
| Profile / Civic Passport | Step 3.3 |
| Growth recommendations | OBE-001 |

**[PEP-M12a]** **No participant arrives at an empty experience** [CID-M09, ADT-M10].

**[PEP-M12b]** Arkansas already exists [Phase 2] — the person steps into a **home waiting for them**.

---

## PEP-M13 — Equal Opportunity

**[PEP-M13]** Every participant begins with **identical platform capabilities**.

**[PEP-M13a]** Differences emerge through **participation** — not administrative privilege.

**[PEP-M13b]** Platform encourages **growth rather than ranking** [OIS-M14, CP-003].

**[PEP-M13c]** No leaderboards. No vanity metrics. Recognition celebrates **contribution**, not popularity [Community Recognition & Appreciation](COMMUNITY_RECOGNITION_APPRECIATION.md) [CRA-001].

---

## PEP-M14 — Identity Is Dynamic

**[PEP-M14]** Profiles **evolve** — never static.

| What changes | How platform reflects it |
|--------------|--------------------------|
| Skills grow | Skills layer updates |
| Communities change | Graph edges update |
| Volunteer history expands | Civic Passport stamps |
| Leadership develops | Journey stage advances |
| Relationships deepen | Network graph grows |

**[PEP-M14a]** Identity reflects **ongoing journey** — append-only history where meaningful [KDG-M12, CJT-001].

---

## PEP-M15 — Trust

**[PEP-M15]** Participants **control how they are represented**.

| Control | Detail |
|---------|--------|
| Visibility | Who sees what |
| Contact preferences | How others reach them |
| Profile sharing | Network vs public |
| Notifications | CAM-001 [Step 3.10] |
| Community participation | Opt-in to committees, events |

**[PEP-M15a]** Trust is earned through **transparency** — full spec [Trust, Privacy & Digital Safety Framework](TRUST_PRIVACY_DIGITAL_SAFETY.md).

**[PEP-M15b]** Minor protections — conservative defaults [DG-*].

---

## PEP-M16 — Identity Persistence

**[PEP-M16]** Identity remains **meaningful over time**.

| Life change | Platform behavior |
|-------------|-------------------|
| Graduating from school | → Alumni journey stage; relationships preserved |
| Moving counties | History preserved; new `resides_in` edge |
| Changing roles | Achievements preserved in Civic Passport |
| Years later | Full narrative still accessible |

**[PEP-M16a]** The platform **accompanies participants through different stages of life** — not a semester-only tool.

**[PEP-M16b]** Nothing important is **destructively deleted** [KDG-M12].

---

## PEP-M17 — Identity Beyond Biography

**[PEP-M17]** Future Civic Passport elements:

- Volunteer portfolio · Projects completed · Community impact
- Recognition · Recommendations · Training completed
- Leadership pathway · Personal reflections

**[PEP-M17a]** Identity should **tell a story** — narrative of civic participation, not a form dump.

---

## PEP-M18 — The Participant Promise

**[PEP-M18]** Every participant should feel:

> **I belong here.**  
> **My voice matters.**  
> **I can help.**  
> **I can grow.**  
> **I can lead.**  
> **I can leave this community stronger than I found it.**

**[PEP-M18a]** Every screen, notification, and empty state should reinforce this promise — or be redesigned.

---

## PEP-M19 — Personal Mission

**[PEP-M19]** **Personal Mission** — forward-looking statement of purpose [PRM-001].

**Not a resume.** Why this person organizes **today**.

**Examples:**

```
"I'm helping organize students at UCA."
"I'm building youth engagement in Saline County."
"I want to connect students interested in environmental conservation."
```

**[PEP-M19a]** Mission is the **opening chapter** of the Civic Passport — intent before history.

---

## PEP-M20 — Civic Passport Architecture

**[PEP-M20]** **Signature experience:** **Civic Passport** — not just a profile, but a **living record of civic participation**.

**[PEP-M20a]** Every participant carries a passport that **grows with them**:

| Stamp / chapter | Source |
|-----------------|--------|
| Communities joined | Graph edges |
| Volunteer experiences | Operational data |
| Events attended | Event module |
| Committees served | Committee module |
| Projects completed | Project module |
| Skills learned | Skills system |
| People mentored | Mentorship edges |
| Organizers developed | Referral subgraph |
| Milestones reached | Journey + recognition |

**[PEP-M20b]** It is **not a scorecard**. It is a **narrative** of how someone became involved, what they helped build, and the relationships they formed.

**[PEP-M20c]** Years later, a participant looks back and sees their **story** — aligning with long-term youth organizing infrastructure that develops **people**, not just campaigns.

**[PEP-M20d]** Structure:

```
Civic Passport
    ├── Personal Mission (forward-looking)
    ├── Identity layers (five dimensions)
    ├── Timeline stamps (append-only)
    ├── Recognition (contribution-based)
    └── Privacy-filtered public view
```

**[PEP-M20e]** Requirement: **CPP-001** Civic Passport

**[PEP-M20f]** V1: profile + mission + county/campus + network stub. Full passport grows through Phase 3 steps.

---

## PEP-M21 — Person vs Account Separation

**[PEP-M21]** Separate **authentication** from **participant identity** [PEP-BG].

| Layer | Contains |
|-------|----------|
| **Person** | Identity, passport, journey, graph node |
| **Account** | Email, session — Phase 7 |
| **Profile** | Privacy-filtered passport view |

---

## PEP-M22 — Relationship-First Design

**[PEP-M22]** Every participant owns: network · invite URL · QR code · relationship tree [Step 3.4].

Relational organizing [OM-L2] — the **family tree of organizers**.

---

## PEP-M23 — Phase 3 Roadmap

**[PEP-M23]** Identity doctrine enables Steps 3.2–3.15 — see [PHASE_3_MASTER_SEQUENCE.md](PHASE_3_MASTER_SEQUENCE.md).

---

## PEP-M24 — V1 Scope

**[PEP-M24]** Jul 12–14 minimum:

| Deliverable | Step |
|-------------|------|
| Identity doctrine + Civic Passport spec | 3.1 ✅ |
| Journey framework | 3.2 ✅ |
| Profile + mission (passport seed) | 3.3 |
| Network + invite + QR | 3.4–3.5 |
| Command Center home | 3.6 |
| Basic privacy | 3.7 [SEC-001] |

---

## PEP-BG — Burt Implementation Guidance

**[PEP-BG]** Implementation should:

| # | Rule |
|---|------|
| 1 | Ask **"What does this person need?"** on every screen [PEP-M02] |
| 2 | **Separate authentication from identity** [PEP-M21] |
| 3 | **Civic Passport** — not a static profile form [PEP-M20] |
| 4 | Allow identity to **evolve** — version history, append-only timeline |
| 5 | Support **multiple community memberships** — graph edges |
| 6 | **Preserve historical participation** — graduation doesn't erase [PEP-M16] |
| 7 | **Respect privacy** — participant controls representation [PEP-M15] |
| 8 | **Never say "user"** in participant-facing copy |
| 9 | **Equal capabilities at start** — no pay-to-lead [PEP-M13] |
| 10 | Design for **future expansion** — passport stamps from new modules |

---

## AC-020 — Acceptance Criteria

Step 3.1 is complete when:

- [x] **[AC-020a]** Participant identity philosophy documented. `[PEP-M01, PEP-M04]`
- [x] **[AC-020b]** Core design question established. `[PEP-M02]`
- [x] **[AC-020c]** Identity layers defined. `[PEP-M06–M11]`
- [x] **[AC-020d]** Equal opportunity reinforced. `[PEP-M13]`
- [x] **[AC-020e]** Identity persistence defined. `[PEP-M16]`
- [x] **[AC-020f]** Civic Passport architecture specified. `[PEP-M20]`
- [x] **[AC-020g]** Participant Promise documented. `[PEP-M18]`
- [x] **[AC-020h]** Burt has conceptual model for participant identity. `[PEP-BG, participant-identity.json]`

---

**Next Step:** 3.2 — [Participant Journey Framework](PARTICIPANT_JOURNEY.md)

*Trace: OM-L1 → PEP-M02 → Civic Passport [CPP-001] → Personal Mission [PRM-001]*
