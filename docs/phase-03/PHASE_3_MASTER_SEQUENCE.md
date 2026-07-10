# Phase 3 — People & Relationship System

## Master Build Sequence

**Document ID:** PHASE-003.0  
**Artifact:** `PHASE_3_MASTER_SEQUENCE.md`  
**Status:** Canonical  
**Priority:** Critical

> **Question answered:** *Who is this person, how do they grow, and how do they connect to others?*

This phase is the **heart of the platform**.

**Constitution for people:** [Participant Identity Doctrine](PARTICIPANT_IDENTITY_DOCTRINE.md)

**Live index:** `data/people/people-relationship-system.json`

---

## What Phase 3 Builds

When complete, every participant receives:

- A beautiful **profile**
- A personal **organizing home** (network board)
- A **QR Code** and **invite URL**
- Their own **network** and **relationship tree**
- Their own **dashboard**, **story**, and **timeline**
- Their own **leadership journey** and **Personal Mission**
- Their own **place in Arkansas**

---

## Step Sequence

| Step | Document | Focus | Status |
|------|----------|-------|--------|
| 3.1 | [Participant Identity Doctrine](PARTICIPANT_IDENTITY_DOCTRINE.md) | Constitutional document for people | ✅ |
| 3.2 | [Participant Journey Framework](PARTICIPANT_JOURNEY.md) | Lifecycle stages — growth not rank | ✅ |
| 3.3 | [Personal Headquarters & Profile System](PARTICIPANT_PROFILE_SYSTEM.md) | Organizing home — not a profile page | ✅ |
| 3.4 | [Personal Relationship Network](PERSONAL_RELATIONSHIP_NETWORK.md) | Participant-owned living network + Trust Graph | ✅ |
| 3.5 | [Relationship Growth Engine](RELATIONSHIP_GROWTH_ENGINE.md) | Self-expanding through trusted relationships | ✅ |
| 3.6 | [Personal Command Center](PERSONAL_COMMAND_CENTER.md) | Daily workspace — Morning Brief + widgets | ✅ |
| 3.7 | [Trust, Privacy & Digital Safety](TRUST_PRIVACY_DIGITAL_SAFETY.md) | Trust Center — trust as infrastructure | ✅ |
| 3.8 | [Personal Growth & Leadership](PERSONAL_GROWTH_LEADERSHIP.md) | Growth Graph — leadership operating system | ✅ |
| 3.9 | Recognition & Milestones | Celebrate development — not popularity | Pending |
| 3.10 | Communication Preferences | Email, text, push — participant controlled | Pending |
| 3.11 | Participant Timeline | One timeline — everything | Pending |
| 3.12 | Participant Knowledge Graph | Person as graph node — all edges | Pending |
| 3.13 | Recommendation Engine | People, events, mentors, opportunities | Pending |
| 3.14 | Participant Experience | Onboarding journey — first week to first leadership | Pending |
| 3.15 | Phase 3 Build Bible | Complete People System closeout | Pending |

---

## 3.3 — Personal Headquarters & Profile System

**Requirement focus:** PHQ-001 · USR-001 · USR-002 · PRM-001

The participant's **organizing home** — not a profile page:

- **Eight sections:** Mission · Communities · Network · Journey · Calendar · Opportunities · Impact · Passport
- **Platform center** — every feature surfaces back to HQ
- **Registration** seeds HQ immediately — no dead ends [USR-001]
- **Mobile-first** — thumb zone, quick actions, minimal scroll

*Route:* `/hq` [PAGE-HQ] · *Live spec:* `personal-headquarters.json`

---

## 3.4 — Personal Relationship Network

**Requirement focus:** NET-001 · NET-002 · NET-003 · PRN-M16 Trust Graph

The platform's **signature feature** — every participant owns a living network:

- **Auto-provisioned** on registration — network ID, invite URL, QR, dashboard
- **Relationship types** — invited, connected, mentored, collaborator, and more
- **Trust Graph** — understands how people grew together; does not rank
- **Participant-owned** — not an org CRM; relationships, not contacts
- **HQ integration** — lives in My Network section [PHQ-M08]

*Live spec:* `personal-relationship-network.json` · *Hook:* `createPersonalNetwork(participantId)`

---

## 3.5 — Relationship Growth Engine

**Requirement focus:** RGE-001 · NET-002 · NET-003

Where the platform becomes **self-expanding** — through relationships, not campaigns:

- **Invitation toolkit** — URL, QR, share card auto-provisioned
- **Personalized landing** — introduction from trusted inviter [PAGE-SHARE]
- **Referral attribution** — `invited_by` + lifecycle tracking
- **Organizing Circles** — private real-life groups for outreach [RGE-M15]
- **Healthy growth** — no spam incentives, no recruit leaderboards

*Live spec:* `relationship-growth-engine.json` · *Hook:* `createInvitationToolkit(participantId)`

---

## 3.6 — Personal Command Center

**Requirement focus:** PCC-001 · PHQ-001 · NET-001 · OIS-001 · JRN-001

Where **everything comes together** — the daily workspace participants open every day:

- **Six login questions** — identity, changes, today, who needs me, accomplishments, direction
- **Morning Brief** — personalized summary on each login [PCC-M17]
- **11 modular widgets** — Mission Board, Relationship, Community, Growth, and more
- **Implements HQ** — one page, not two homes; retires Network Board
- **Mobile-first** — thumb zone, widget priority order

*Route:* `/command-center` [PAGE-PCC] · *Live spec:* `personal-command-center.json`

---

## 3.7 — Trust, Privacy & Digital Safety Framework

**Requirement focus:** SEC-001 · CP-007 · DG-004

The most important **trust document** in the project — trust as infrastructure:

- **Trust Center** — single place for privacy, visibility, data inventory [PAGE-TRUST]
- **Six visibility levels** — participant-controlled, simple defaults
- **Data minimization** — four questions before collecting any field
- **Community safety** — report, block, mute architecture
- **Ethical use + future AI** — human judgment primary

*Live spec:* `trust-privacy-safety.json` · *Engine:* `visibilityEngine(element, viewer)`

---

## 3.8 — Personal Growth & Leadership Development System

**Requirement focus:** PGL-001 · JRN-001 · CPP-001

**Leadership operating system** — develop people, not just organize them:

- **Five growth domains** — Civic, Organizing, Leadership, Personal, Community Impact
- **Growth Graph [PGL-M13]** — how experiences connect; "How has this participant grown?"
- **Skills + interests** — extensible registry; no competitive scoring
- **Mentorship + reflection** — relationships accelerate growth
- **Learning pathways** — future Arkansas Civic Academy

*Live spec:* `personal-growth-leadership.json` · *Orchestrator:* `buildGrowthNarrative(participantId)`

---

## 3.9 — Recognition & Milestones

Celebrate: helping people · mentoring · recruitment · volunteerism · projects · leadership · community service

**Not popularity.** [OIS-M14, JRN-M09]

---

## 3.10 — Communication Preferences

Email · Text · Push · Digest · Emergency · Committee · County · Campus · Personal messages

Everything **participant controlled**.

---

## 3.11 — Participant Timeline

One timeline — everything:

Joined · Events · Volunteer · Projects · Committees · Training · Milestones · Photos · Future portfolio

*Append-only pattern [STS-M16, KDG-M07]*

---

## 3.12 — Participant Knowledge Graph

Everything connected. Example:

```
Steve —attends→ UCA
Steve —lives_in→ Faulkner County
Steve —invited→ Sarah
Steve —volunteers_for→ Food Drive
Steve —chairs→ Communications Committee
Steve —attended→ Leadership Summit
```

The software **understands the participant** — extends [REL-M01] graph to person-centric queries.

---

## 3.13 — Recommendation Engine

Recommend: people · events · committees · volunteer opportunities · nearby campuses · nearby counties · training · mentors · future AI coaching

*Uses Mission + journey stage + graph proximity [OIS-M11, JRN-M10]*

---

## 3.14 — Participant Experience

Onboarding journey:

First login · First week · First month · First event · First committee · First recruit · First leadership role · First mentorship

*Experience design — not just feature list.*

---

## 3.15 — Phase 3 Build Bible

Closeout index — everything Burt needs:

Identity · Journey · Profiles · Networks · Recruitment · Recognition · Privacy · Leadership · Recommendations · Timeline · Relationship Graph · Personal Mission

---

## V1 Critical Path (Jul 12–14)

| Step | V1 minimum |
|------|------------|
| 3.1–3.2 | Philosophy ✅ |
| 3.3 | Register + basic profile + mission |
| 3.4–3.5 | Invite URL + QR + referral |
| 3.6 | Command Center core | ✅ design |
| 3.7 | Basic privacy + Trust Center | ✅ design |

Steps 3.9–3.14: design now, implement post-launch. Step 3.8 design complete.

---

*Prior phase:* [Digital Arkansas Build Bible](../phase-02/PHASE_2_DIGITAL_ARKANSAS_BUILD_BIBLE.md)
