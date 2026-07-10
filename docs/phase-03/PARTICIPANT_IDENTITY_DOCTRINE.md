# Participant Identity Doctrine

**Document ID:** PHASE-003.1  
**Artifact:** `PARTICIPANT_IDENTITY_DOCTRINE.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 3 — People & Relationship System

> **Most platforms start with users. We start with people.**

A **user** logs into software. A **person** has relationships, aspirations, interests, skills, communities, and a story. The software simply serves that person.

**Builds On:** [Organizing Model](../build-steps/PHASE-001.5-ORGANIZING-MODEL.md) · [OM-L1](../build-steps/PHASE-001.5-ORGANIZING-MODEL.md) · [Living Systems](../master/LIVING-SYSTEMS-ARCHITECTURE.md) · [Digital Arkansas](../phase-02/PHASE_2_DIGITAL_ARKANSAS_BUILD_BIBLE.md)

**Live spec:** `data/registry/participant-identity.json`

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| PEP-M01 | Purpose |
| PEP-M02 | Guiding principle — people not users |
| PEP-M03 | What is a participant |
| PEP-M04 | Personal identity |
| PEP-M05 | Profile philosophy |
| PEP-M06 | Belonging |
| PEP-M07 | Communities |
| PEP-M08 | Life stages |
| PEP-M09 | Privacy philosophy |
| PEP-M10 | Personal Mission architecture |
| PEP-M11 | Person vs account separation |
| PEP-M12 | Relationship-first design |
| PEP-M13 | Digital identity components |
| PEP-M14 | V1 scope |
| PEP-BG | Burt implementation guidance |
| AC-020 | Step 3.1 acceptance criteria |

---

## PEP-M01 — Purpose

**[PEP-M01]** This document is the **constitutional document for people** — the foundation of Phase 3.

**[PEP-M01a]** Phase 3 answers:

> **Who is this person, how do they grow, and how do they connect to others?**

**[PEP-M01b]** Phase 3 becomes the **heart of the platform** — not an auth layer bolted onto a registry.

**[PEP-M01c]** Official phase name: **People & Relationship System**.

---

## PEP-M02 — Guiding Principle

**[PEP-M02]**

> **Start with people, not users.**

| User mindset | People mindset |
|--------------|----------------|
| Account credentials | Identity + story |
| Login metrics | Relationship growth |
| Feature adoption | Journey progression |
| Database row | Person in a network |

**[PEP-M02a]** The individual is the **root of the knowledge graph** [OM-L1] — not an afterthought.

**[PEP-M02b]** Every Phase 3 feature serves the **whole person** — not just authentication.

---

## PEP-M03 — What Is a Participant

**[PEP-M03]** A **participant** is any person engaged with ASYON — registered or browsing.

| Type | Description |
|------|-------------|
| **Visitor** | No account — exploring Arkansas |
| **Participant** | Registered person — county/campus assigned |
| **Organizer** | Journey stage — building community (not a separate account type) |

**[PEP-M03a]** No privileged account tiers that bypass community governance [CP-003, DG-001].

**[PEP-M03b]** Honor-system affiliation at V1 — participant selects county/campus [USR-001].

**[PEP-M03c]** Permanent participant ID: `PRT-{uuid}` — immutable graph node.

---

## PEP-M04 — Personal Identity

**[PEP-M04]** Personal identity includes:

| Dimension | Examples |
|-----------|----------|
| Name & display | How they present |
| County & campus | Where they belong |
| Age bracket | 16–24 youth organizing scope |
| Interests & passions | What they care about |
| Skills | What they bring |
| **Personal Mission** | Living statement of purpose [PEP-M10] |
| Story | Timeline of contribution [Step 3.11] |

**[PEP-M04a]** Identity is **participant-controlled** — not inferred from institution affiliation alone.

**[PEP-M04b]** Identity evolves — stored with version history where meaningful [KDG-M12].

---

## PEP-M05 — Profile Philosophy

**[PEP-M05]** The profile is a **digital identity** — not a social media performance.

| Principle | Meaning |
|-----------|---------|
| Authentic | Real person, real communities |
| Purposeful | Mission-forward, not vanity |
| Private by default | Participant chooses visibility [Step 3.7] |
| Organizing-focused | Skills, availability, volunteer interests |
| Connected | Links to network, communities, timeline |

**[PEP-M05a]** Full profile spec: Step 3.3 Participant Profile System.

**[PEP-M05b]** V1 profile minimum: name, county, campus (if student), interests, mission statement, privacy level.

---

## PEP-M06 — Belonging

**[PEP-M06]** Belonging connects people to **places** from Digital Arkansas:

```
Participant —resides_in→ County
Participant —attends→ Institution (students)
Participant —member_of→ Committee (future)
```

**[PEP-M06a]** A participant always has a **county home** — even non-students [LS-Q1].

**[PEP-M06b]** Belonging is **declared at registration** — validated against Registry, not free-text.

**[PEP-M06c]** Multiple belonging: county + campus + committees — graph edges, not duplicate records.

---

## PEP-M07 — Communities

**[PEP-M07]** Participants exist within **communities** — not in isolation.

| Community | Connection |
|-----------|------------|
| County | Geographic organizing home |
| Campus | Educational community |
| Committee | Action team (future) |
| Network | Personal relationship web |

**[PEP-M07a]** Community pages from Phase 2 [CID-M01] — participant profiles link **into** communities, not replace them.

---

## PEP-M08 — Life Stages

**[PEP-M08]** Life stages intersect with [Participant Journey](PARTICIPANT_JOURNEY.md):

| Life context | Platform handling |
|--------------|-------------------|
| High school student | Future expansion [Phase 9] |
| College student | Primary V1 audience |
| Non-student youth 16–24 | County-only path |
| Alumni | Journey stage — stays connected |
| Mentor | Journey stage — develops others |

**[PEP-M08a]** Journey stage (engagement depth) ≠ life stage (life context) — both tracked.

---

## PEP-M09 — Privacy Philosophy

**[PEP-M09]** Privacy is a **trust foundation** — not a settings afterthought.

| Principle | Detail |
|-----------|--------|
| Participant control | Visibility, contact, messaging |
| Minor protections | Age-appropriate defaults [DG-*] |
| No surprise sharing | Explicit consent for network visibility |
| Class B data | Operational — separate governance [KDG-M05] |
| Future guardian controls | Documented in Step 3.7 |

**[PEP-M09a]** Full spec: Step 3.7 Privacy & Trust System.

---

## PEP-M10 — Personal Mission Architecture

**[PEP-M10]** **Signature feature:** **Personal Mission** — a short, evolving statement of purpose.

**Not a resume.** A living declaration of why this person organizes.

**Examples:**

```
"I'm helping organize students at UCA."
"I'm building youth engagement in Saline County."
"I want to connect students interested in environmental conservation."
"I'm recruiting first-time volunteers across Southeast Arkansas."
```

**[PEP-M10a]** Platform uses Personal Mission to:

| Use | Benefit |
|-----|---------|
| Introduce participants | Human connection |
| Recommend collaborators | Complementary teams |
| Build teams | Shared purpose matching |
| Help new members belong | Find their people |
| Show progress | Mission evolves with journey |

**[PEP-M10b]** Structure:

| Field | Description |
|-------|-------------|
| `missionStatement` | Free text, 280–500 chars recommended |
| `updatedAt` | When last revised |
| `visibility` | public · community · network · private |
| `versionHistory` | Optional — track evolution |

**[PEP-M10c]** Mission displayed on profile, network board, and introduction cards — never required to be polished prose.

**[PEP-M10d]** Requirement: **PRM-001** Personal Mission

---

## PEP-M11 — Person vs Account Separation

**[PEP-M11]** Architecture separates:

| Layer | Contains |
|-------|----------|
| **Person** (participant record) | Identity, mission, journey, graph node |
| **Account** (auth credentials) | Email, session, login — Phase 7 Platform Services |
| **Profile** (presentation) | What others see — privacy-filtered view |

**[PEP-M11a]** V1: honor-system signup may collapse person+account — but **data model** keeps separation for future auth [Phase 7].

---

## PEP-M12 — Relationship-First Design

**[PEP-M12]** Every participant owns a **network** [Step 3.4] — the family tree of organizers.

| Asset | Owner |
|-------|-------|
| Network | Participant |
| Invite URL | Participant |
| QR Code | Participant |
| Relationship tree | Participant |
| Referral attribution | Participant's graph edges |

**[PEP-M12a]** Relational organizing [OM-L2] — growth through **relationships**, not broadcast.

---

## PEP-M13 — Digital Identity Components

**[PEP-M13]** Complete participant digital identity (Phase 3 deliverables):

| Component | Step |
|-----------|------|
| Identity doctrine | 3.1 ✅ |
| Journey framework | 3.2 |
| Profile system | 3.3 |
| Personal network | 3.4 |
| Recruitment engine | 3.5 |
| Network board | 3.6 |
| Privacy & trust | 3.7 |
| Skills & leadership | 3.8 |
| Recognition | 3.9 |
| Communication prefs | 3.10 |
| Timeline | 3.11 |
| Knowledge graph | 3.12 |
| Recommendations | 3.13 |
| Experience / onboarding | 3.14 |
| Phase 3 Build Bible | 3.15 |

---

## PEP-M14 — V1 Scope

**[PEP-M14]** Jul 12–14 minimum:

| Deliverable | Step |
|-------------|------|
| Identity doctrine | 3.1 ✅ |
| Journey stages | 3.2 ✅ |
| Basic profile + mission | 3.3 |
| Network + invite URL + QR | 3.4–3.5 |
| Network board (core) | 3.6 |
| Basic privacy | 3.7 |
| Registration → `registered` | 3.3 implementation |

**[PEP-M14b]** Skills, full timeline, recommendations, AI — post-V1 steps.

---

## PEP-BG — Burt Implementation Guidance

**[PEP-BG]** Implementation should:

| # | Rule |
|---|------|
| 1 | **Person-first** data model — `PRT-*` graph node from registration |
| 2 | **Personal Mission** field on every profile — encouraged at signup |
| 3 | **Never say "user"** in participant-facing copy — say "participant" or "organizer" |
| 4 | Profile = filtered view of person record — not duplicate data |
| 5 | All person edges in relationship graph [Step 3.12] |
| 6 | Privacy defaults conservative for minors |
| 7 | Journey stage derived from signals [JRN-M06] — not manual rank |

---

## AC-020 — Acceptance Criteria

Step 3.1 is complete when:

- [x] **[AC-020a]** Participant defined — people not users. `[PEP-M02, PEP-M03]`
- [x] **[AC-020b]** Identity, belonging, communities documented. `[PEP-M04–M07]`
- [x] **[AC-020c]** Privacy philosophy established. `[PEP-M09]`
- [x] **[AC-020d]** Personal Mission architecture specified. `[PEP-M10]`
- [x] **[AC-020e]** Phase 3 digital identity roadmap defined. `[PEP-M13]`
- [x] **[AC-020f]** Burt has constitutional document for people. `[PEP-BG, participant-identity.json]`

---

**Next Step:** 3.2 — [Participant Journey Framework](PARTICIPANT_JOURNEY.md)

*Trace: OM-L1 → PEP-M03 → PRT graph node → Personal Mission [PRM-001]*
