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
| 3.2 | [Participant Journey Framework](PARTICIPANT_JOURNEY.md) | Lifecycle stages — one step forward | ✅ |
| 3.3 | Participant Profile System | Digital identity — interests, skills, mission | Pending |
| 3.4 | Personal Network System | Network, invite URL, QR, relationship tree | Pending |
| 3.5 | Recruitment Engine | Invitations, attribution, growth tracking | Pending |
| 3.6 | Network Board | Personal organizing dashboard | Pending |
| 3.7 | Privacy & Trust System | Visibility, permissions, minor protections | Pending |
| 3.8 | Skills & Leadership System | Skills, training, volunteer specialties | Pending |
| 3.9 | Recognition & Milestones | Celebrate contribution — not popularity | Pending |
| 3.10 | Communication Preferences | Email, text, push — participant controlled | Pending |
| 3.11 | Participant Timeline | One timeline — everything | Pending |
| 3.12 | Participant Knowledge Graph | Person as graph node — all edges | Pending |
| 3.13 | Recommendation Engine | People, events, mentors, opportunities | Pending |
| 3.14 | Participant Experience | Onboarding journey — first week to first leadership | Pending |
| 3.15 | Phase 3 Build Bible | Complete People System closeout | Pending |

---

## 3.3 — Participant Profile System

**Requirement focus:** USR-001 · USR-002 · PRM-001

Everything about a participant:

- Basic information · Interests · Skills · Passions
- Privacy settings · Communities · History
- Future aspirations · Volunteer interests · Availability
- Communication preferences (cross-ref 3.10)
- **Personal Mission** — living statement of purpose

*Becomes their digital identity.*

---

## 3.4 — Personal Network System

**Requirement focus:** NET-001 · NET-002 · NET-003

**Most important implementation document.**

Every participant owns:

- **Network** · **Invite URL** · **QR Code**
- **Relationship tree** · **Mentorship** edges
- **Growth** metrics · **Activity** feed
- Future **family tree of organizers**

---

## 3.5 — Recruitment Engine

Invitation philosophy · QR codes · Referral links · Welcome flow · Relationship attribution · Growth tracking · Recruitment analytics

---

## 3.6 — Network Board

Every participant's personal organizing home:

Dashboard · People · Growth · Events · Volunteer · Committees · Projects · Messages · Milestones · Recognition · Goals · **Mission Board**

*Route:* `/dashboard/network` [PAGE-NETWORK]

---

## 3.7 — Privacy & Trust System

Visibility · Profile permissions · Contact sharing · Messaging permissions · Minor protections · Future guardian controls · Trust philosophy

---

## 3.8 — Skills & Leadership System

Skills · Experience · Interests · Training · Leadership · Volunteer specialties · Future certifications · Future civic academy

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
| 3.6 | Network board core |
| 3.7 | Basic privacy defaults |

Steps 3.8–3.14: design now, implement post-launch.

---

*Prior phase:* [Digital Arkansas Build Bible](../phase-02/PHASE_2_DIGITAL_ARKANSAS_BUILD_BIBLE.md)
