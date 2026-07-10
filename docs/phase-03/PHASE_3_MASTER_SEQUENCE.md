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
| 3.9 | [Community Recognition & Appreciation](COMMUNITY_RECOGNITION_APPRECIATION.md) | Appreciation not gamification | ✅ |
| 3.10 | [Communication & Attention Management](COMMUNICATION_ATTENTION_MANAGEMENT.md) | Attention Budget — earn not abuse | ✅ |
| 3.11 | [Civic Journey Timeline](CIVIC_JOURNEY_TIMELINE.md) | Lifelong story — Memory Moments | ✅ |
| 3.12 | [Personal Digital Twin](PERSONAL_DIGITAL_TWIN.md) | Context Engine — living model | ✅ |
| 3.13 | [Opportunity & Belonging Engine](OPPORTUNITY_BELONGING_ENGINE.md) | Community Marketplace — belonging | ✅ |
| 3.14 | [Participant Experience & Lifecycle Design](PARTICIPANT_EXPERIENCE_LIFECYCLE.md) | Community Companion — emotional lifecycle | ✅ |
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

## 3.9 — Community Recognition & Appreciation System

**Requirement focus:** CRA-001 · CPP-001 · JRN-001 · OIS-M14

**Appreciation — not gamification:**

- **Community Gratitude** — peer messages: "Thank you for helping..."
- **Eight milestone categories** — unified with JRN-M07 catalog
- **Appreciation Board** — community-chosen, authentic not algorithmic
- **Impact stories** — storytelling as recognition
- **Anti-gamification** — no leaderboards, points, or popularity contests

*Live spec:* `community-recognition-appreciation.json`

---

## 3.10 — Communication & Attention Management System

**Requirement focus:** CAM-001 · PCC-001 · SEC-001 · MSG-001 (transport)

**Earn attention. Never abuse it** — how participants stay connected without becoming overwhelmed:

- **Attention Budget [CAM-M13]** — consolidate low-priority updates; high-priority still immediate
- **Smart Digest** — Morning Brief, Daily Digest, Weekly Summary, Monthly Impact Report
- **Four communication types** — Personal, Community, Platform, Emergency
- **Five priority levels** — participant-controlled delivery by priority
- **Policy vs transport** — CAM is policy; MSG (Phase 5.7) is delivery infrastructure

*Live spec:* `communication-attention-management.json` · *Integrates:* Morning Brief [PCC-M17], Trust Center prefs [SEC-001]

---

## 3.11 — Civic Journey Timeline

**Requirement focus:** CJT-001 · JRN-M09 · CPP-001 · CRA-M10

**Every act of service becomes part of your story** — not an activity log, a lifelong narrative:

- **Memory Moments [CJT-M12]** — anniversaries and firsts; Attention Budget-respecting
- **Seven categories** — Joining, Relationships, Volunteer, Leadership, Learning, Communities, Recognition
- **Civic Passport backbone** — unified append-only event sourcing
- **Reflection + privacy views** — participant-controlled sharing

*Live spec:* `civic-journey-timeline.json` · *Integrates:* Journey [JRN-M09], Recognition [CRA-M10], Growth [PGL-M10]

---

## 3.12 — Personal Digital Twin

**Requirement focus:** PDT-001 · REL-001 · ADT-001 · JRN-M10

**Living model of each participant** — where everything begins to think:

- **Participant Context Engine [PDT-M12]** — assemble session context from all People System modules
- **Six core domains** — Identity, Relationships, Communities, Activity, Growth, Preferences
- **Relationship graph** — person-centric overlay on Arkansas twin [REL-M01]
- **Explainable personalization** — assistance not prediction; reason on every suggestion
- **Composition not duplication** — twin references canonical stores

*Live spec:* `personal-digital-twin.json` · *Distinction:* ADT-001 = state landscape · PDT-001 = participant journey · *Consumer:* [Opportunity & Belonging Engine OBE-001]

---

## 3.13 — Opportunity & Belonging Engine

**Requirement focus:** OBE-001 · PDT-001 · OIS-001 · JRN-M08

**Good community organizer** — help people discover where they naturally belong:

- **Community Marketplace [OBE-M12]** — open searchable opportunities + personalized suggestions
- **Six categories** — People, Communities, Service, Learning, Leadership, Growth
- **Explainability required** — reason on every recommendation
- **Belonging over engagement** — ethical, transparent, participant-centered
- **Mission Board integration** — PCC-M07, PHQ-M11 consume `generateOpportunities()`

*Live spec:* `opportunity-belonging-engine.json` · *Consumes:* PDT Participant Context · *Extends:* OIS Mission Board [OIS-M16]

---

## 3.14 — Participant Experience & Lifecycle Design

**Requirement focus:** PEL-001 · JRN-001 · OBE-001 · CJT-M12

**The heart of Phase 3** — emotional experience, not just structure:

- **Seven lifecycle stages** — Discovery → Registration → First Hour → Week → Month → Year → Long-term
- **Community Companion [PEL-M11]** — warm guide; voice of community, not software
- **Emotional design** — welcome, connected, capable, appreciated, growing, needed, hopeful
- **Evaluation question** — does this strengthen relationships, deepen belonging, help people grow into community builders?

*Live spec:* `participant-experience-lifecycle.json` · **Required reading for Burt**

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

Step 3.15: Build Bible closeout only. Steps 3.8–3.14 design complete — Phase 3 heart locked at 3.14.

---

*Prior phase:* [Digital Arkansas Build Bible](../phase-02/PHASE_2_DIGITAL_ARKANSAS_BUILD_BIBLE.md)
