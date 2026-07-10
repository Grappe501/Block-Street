# Participant Experience & Lifecycle Design

**Document ID:** PHASE-003.14  
**Artifact:** `PARTICIPANT_EXPERIENCE_LIFECYCLE.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 3 — People & Relationship System

> **People remember how a community made them feel long after they forget what buttons they clicked.**

Everything designed in Phase 3 until now has been **structural**. This document defines the **emotional experience** — how someone should feel during their **first hour, first month, first year, and fifth year**.

**Required reading for Burt.** Every feature implementation should be evaluated against this document.

**Builds On:** [Participant Journey Framework](PARTICIPANT_JOURNEY.md) · [Opportunity & Belonging Engine](OPPORTUNITY_BELONGING_ENGINE.md) · [Civic Journey Timeline](CIVIC_JOURNEY_TIMELINE.md) · [Personal Command Center](PERSONAL_COMMAND_CENTER.md) · [Community Recognition & Appreciation](COMMUNITY_RECOGNITION_APPRECIATION.md)

**Live spec:** `data/registry/participant-experience-lifecycle.json`

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| PEL-M01 | Purpose |
| PEL-M02 | Guiding principle |
| PEL-M03 | Experience philosophy |
| PEL-M04 | Lifecycle stages |
| PEL-M05 | Long-term experience |
| PEL-M06 | Emotional design principles |
| PEL-M07 | Friction philosophy |
| PEL-M08 | Delight moments |
| PEL-M09 | Continuous engagement |
| PEL-M10 | Community culture |
| PEL-M11 | Community Companion architecture |
| PEL-M12 | Cross-system integration |
| PEL-M13 | Evaluation question |
| PEL-M14 | Phase 3 heart |
| PEL-M15 | V1 scope |
| PEL-BG | Burt implementation guidance |
| AC-033 | Step 3.14 acceptance criteria |

---

## PEL-M01 — Purpose

**[PEL-M01]** This document defines the **participant experience** from first discovery through long-term community leadership.

**[PEL-M01a]** The objective is to create an experience that is **welcoming, empowering, purposeful, and sustainable**.

**[PEL-M01b]** The platform should not merely provide tools — it should create an environment where participants **naturally grow into organizers and community builders** [OM-L1, JRN-001].

**[PEL-M01c]** Terminology: **Participant Experience & Lifecycle Design** (not "onboarding checklist" or "UX wireframes" alone).

**[PEL-M01d]** Core question this document answers:

> **How should someone feel during their first hour… first month… first year… and fifth year?**

---

## PEL-M02 — Guiding Principle

**[PEL-M02]**

> **People remember how a community made them feel long after they forget what buttons they clicked.**

**[PEL-M02a]** Every design decision should **strengthen belonging** [OBE-001, OBE-M03b].

**[PEL-M02b]** Structural docs (HQ, PCC, Trust, Timeline) define **what exists** — this doc defines **how it should feel to use**.

---

## PEL-M03 — Experience Philosophy

**[PEL-M03]** Participants should **never feel**:

| Avoid | Why |
|-------|-----|
| **Lost** | Always a next step [OBE-M02, JRN-M08] |
| **Overwhelmed** | Attention Budget [CAM-M13] |
| **Alone** | Network + communities from day one [NET-001, ADT-M10] |
| **Unimportant** | Appreciation culture [CRA-001] |
| **Confused** | Explainability everywhere [OBE-M06, PDT-M09] |

**[PEL-M03a]** They should consistently feel:

**Welcome · Connected · Capable · Appreciated · Growing · Needed · Hopeful**

**[PEL-M03b]** Tone across all copy: **warm, encouraging, respectful, never pushy** [PEL-M11 Community Companion voice].

---

## PEL-M04 — Lifecycle Stages

**[PEL-M04]** Seven stages from discovery through first year — each with emotional goal and concrete examples:

### Stage 1 — Discovery

Participant arrives. Experience should communicate:

- You belong here · This platform is for people like you
- You can make a difference · This community already exists [ADT-M02]

**Emotional goal:** Curiosity replaces uncertainty [PEP-M12, CID-M09 welcome].

### Stage 2 — Registration

Registration should feel like **joining a community** — not creating an account [USR-001].

Participants immediately receive:

Welcome · Personal Headquarters · Civic Passport · Network · County · Campus · Mission

**Emotional goal:** The platform **begins giving rather than asking** [PHQ-M01, RGE-M11 toolkit].

### Stage 3 — First Hour

Participants should accomplish something **meaningful immediately**:

Meet another participant · Join a community · Discover opportunities · Share invite link · Explore campus · Complete first mission [OBE-M02]

**Emotional goal:** Success arrives quickly — **capable**, not stuck.

### Stage 4 — First Week

Participants begin forming **habits**:

Attend event · Volunteer · Join committee · Invite friend · Complete leadership lesson · Receive appreciation [CRA-M13]

**Emotional goal:** Small successes create **momentum** — growing.

### Stage 5 — First Month

Participants begin **identifying with the community**:

Recognize familiar names · Develop friendships · Serve regularly · Lead small efforts · Discover strengths

**Emotional goal:** Identity shifts from **observer to contributor** [JRN-M06].

### Stage 6 — First Year

Participants begin **shaping communities**:

Mentor others · Organize projects · Launch initiatives · Develop new organizers · Tell community stories [PGL-001, CRA-M09]

**Emotional goal:** Leadership emerges **naturally** — needed, hopeful.

**[PEL-M04a]** Journey orchestrator [JRN-M10] **derives** stage from real activity — lifecycle doc defines **experience targets** per stage.

**[PEL-M04b]** Community Companion [PEL-M11] adapts tone and suggestions to lifecycle stage.

---

## PEL-M05 — Long-Term Experience

**[PEL-M05]** Years later participants should be able to:

| Capability | Source |
|------------|--------|
| See Civic Journey Timeline | CJT-001 |
| Celebrate memories | Memory Moments [CJT-M12] |
| Reconnect with friends | NET-001, PRN graph |
| Support future participants | Mentorship, welcome opportunities |
| Continue contributing | OBE Marketplace, lifelong opportunities |

**[PEL-M05a]** The platform becomes a **lifelong community** — not a semester app [PEP-M16 identity persistence].

**[PEL-M05b]** Fifth-year experience: **gratitude, continuity, legacy** — "remember why I stayed" [CJT-M12, CRA-M01].

---

## PEL-M06 — Emotional Design Principles

**[PEL-M06]** Every interaction should reinforce:

| Emotion | How |
|---------|-----|
| **Belonging** | Communities waiting [ADT-M10], OBE suggestions |
| **Purpose** | Mission Board [PCC-M07], PRM-001 |
| **Progress** | Journey stage, Growth Graph [PGL-M13] |
| **Gratitude** | Community Gratitude [CRA-M13] |
| **Hope** | OIS hopeful language [OIS-M11] |
| **Trust** | Trust Center transparency [SEC-001] |
| **Curiosity** | Marketplace discovery [OBE-M12] |
| **Community** | Network, committees, shared stories |

**[PEL-M06a]** These emotions become part of the **user experience** — not marketing copy bolted on later.

---

## PEL-M07 — Friction Philosophy

**[PEL-M07]** **Reduce unnecessary friction:**

Simple navigation · Few required steps · Clear language · Helpful guidance · Fast mobile interactions [PCC-M18, PHQ-M19]

**[PEL-M07a]** Friction should exist **only where it improves safety or trust**:

Privacy confirmations · Minor protections [TPS-M18] · Report/block flows · Consent for sharing [SEC-001]

**[PEL-M07b]** Never add friction for "engagement" — e.g. forced tutorials, unskippable modals [CAM-M10, OBE-M10].

---

## PEL-M08 — Delight Moments

**[PEL-M08]** The platform should **occasionally surprise** participants — sincere, not manipulative [CAM-M12, OBE-M10]:

| Delight moment | Source |
|----------------|--------|
| Welcome message from community | CID-M09, Companion [PEL-M11] |
| Memory moments | CJT-M12 |
| Community appreciation | CRA-M13 |
| Milestone celebrations | JRN-M07, CRA-M10 |
| Unexpected thank-you notes | Community Gratitude |
| Volunteer anniversaries | CJT-M12 Memory Moments |

**[PEL-M08a]** Delight respects **Attention Budget** — inspirational priority, max frequency cap [CAM-M13, CJT-M12d].

**[PEL-M08b]** Never fake delight — algorithmic "congrats" without real milestone erodes trust.

---

## PEL-M09 — Continuous Engagement

**[PEL-M09]** Participants should always have:

A next **opportunity** · A next **relationship** · A next **lesson** · A next **project** · A next **leadership step**

**[PEL-M09a]** The journey **never feels finished** — but never feels **incomplete in a punishing way** [OBE-M02, JRN-M08].

**[PEL-M09b]** Continuous ≠ infinite scroll — meaningful next steps only [OBE-M05a max suggestions].

---

## PEL-M10 — Community Culture

**[PEL-M10]** The platform should encourage a culture of:

Welcoming newcomers · Helping others · Learning together · Sharing knowledge · Celebrating service · Building friendships · Developing future leaders

**[PEL-M10a]** Culture emerges from **participant behavior** — not software rules imposed top-down [OM-L1].

**[PEL-M10b]** Software **supports** culture through: welcome flows, gratitude tools, appreciation boards [CRA-M11], Companion voice [PEL-M11], anti-gamification [CRA-M12b].

**[PEL-M10c]** Moderation framework (Phase 4) protects culture — students determine rules [Phase 4.6].

---

## PEL-M11 — Community Companion Architecture

**[PEL-M11]** **Signature recommendation:** **Community Companion** — gentle, consistent guide across the platform.

**Not** a chatbot. **Not** an AI assistant that interrupts. **Not** pushy notifications.

**[PEL-M11a]** Role:

| Companion responsibility |
|--------------------------|
| Welcome new participants |
| Explain what is happening |
| Celebrate milestones |
| Introduce opportunities |
| Surface community stories |
| Suggest next steps |
| Remember important moments |
| Encourage participation |

**[PEL-M11b]** **One personality** platform-wide:

**Warm · Encouraging · Respectful · Never pushy**

Voice of the **community** — not the voice of the software.

**[PEL-M11c]** Implementation pattern:

```
CommunityCompanion
    ← lifecycle stage [PEL-M04, JRN-M10]
    ← ParticipantContext [PDT-M12]
    ← opportunities [OBE-001]
    ← Memory Moments [CJT-M12]
    → contextual message (in-platform, Morning Brief, Companion panel)
    → applyAttentionBudget() before any proactive surface [CAM-M13]
```

**[PEL-M11d]** Companion surfaces:

| Surface | V1 |
|---------|-----|
| Registration welcome | ✅ copy + first HQ tour |
| Command Center greeting | ✅ stage-aware message |
| Milestone celebration | stub |
| Dedicated Companion panel | v1.1 |
| AI-enhanced Companion | v1.2 opt-in [TPS-M15] |

**[PEL-M11e]** Companion **never** impersonates another participant — always clearly platform/community voice.

**[PEL-M11f]** Dismiss/snooze always available — participant control [CJT-M12e, CAM-M10].

---

## PEL-M12 — Cross-System Integration

**[PEL-M12]** Lifecycle experience **orchestrates** prior Phase 3 modules:

| Stage | Primary modules |
|-------|-----------------|
| Discovery | CID-M09, ADT-M10, public pages |
| Registration | USR-001, PHQ-001, RGE-001, NET-001 |
| First hour | PCC-001, OBE-001, PHQ quick actions |
| First week | JRN-M10, CRA-001, VOL future |
| First month | PGL-001, NET depth, committees future |
| First year | Leadership, mentorship, CRA stories |
| Long-term | CJT-001, Memory Moments, CPP-001 |

**[PEL-M12a]** No lifecycle stage ships without **Companion copy spec** and **OBE next-step** for that stage.

---

## PEL-M13 — Evaluation Question

**[PEL-M13]** From this point forward, every feature — communities, committees, events, messaging, volunteer systems, analytics, AI — is evaluated against:

> **Does this strengthen relationships, deepen belonging, and help people grow into community builders?**

**[PEL-M13a]** Production gate extension [PEL-BG-c]: features that fail this question require explicit constitutional exception.

**[PEL-M13b]** Burt uses this question in PR reviews, admin feature flags, and implementation planning.

---

## PEL-M14 — Phase 3 Heart

**[PEL-M14]** With Step 3.14, Phase 3 design reaches its **heart** — the complete human experience:

| Phase | What we designed |
|-------|------------------|
| **Phase 1** | Why the platform exists |
| **Phase 2** | The digital model of Arkansas |
| **Phase 3** | The complete human experience |

**[PEL-M14a]** Step **3.15 — Phase 3 Build Bible** closes the phase with implementation index — structural closeout; **3.14 is the emotional closeout**.

**[PEL-M14b]** V1 critical path (3.1–3.7) + full People System design (3.8–3.14) ready for Jul 12+ implementation with emotional north star locked.

---

## PEL-M15 — V1 Scope

**[PEL-M15]** Design complete in Step 3.14; implementation phased:

| Deliverable | V1 (Jul 12/14) |
|-------------|----------------|
| Lifecycle philosophy + Companion spec | ✅ this document |
| Registration welcome + HQ seed | emotional copy, immediate gifts |
| Command Center stage-aware greeting | Companion stub |
| Full Companion panel + delight automation | v1.1 |
| AI Companion | v1.2 opt-in |

**[PEL-M15a]** Jul 12/14 minimum emotional bar: **never alone, never lost** — welcome, county/campus, invite URL, one meaningful next step [OBE-M02].

---

## PEL-BG — Burt Implementation Guidance

**[PEL-BG]** Implementation should:

1. **Design every workflow around participant emotions** — stage table [PEL-M04] as acceptance checklist
2. **Prioritize clarity over cleverness** — plain language [PEL-M07]
3. **Reduce unnecessary complexity** — progressive disclosure of advanced features
4. **Maintain consistency across communities** — Companion voice unified [PEL-M11b]
5. **Support gradual discovery** — Marketplace, Trust Center, advanced widgets unlock with journey
6. **Keep belonging at center of every interface** — evaluation question [PEL-M13]

**[PEL-BG-a]** Recommended file structure:

```
src/lib/companion/CommunityCompanion.ts
src/lib/companion/lifecycleStageCopy.ts
src/lib/companion/surfaceCompanionMessage.ts
src/content/companion/ — stage-aware copy catalog
```

**[PEL-BG-b]** **Required reading:** Burt reads this document before implementing any Phase 3+ participant-facing feature.

**[PEL-BG-c]** Gate: no participant workflow ships without lifecycle stage mapping in PR description.

---

## AC-033 — Acceptance Criteria

Step 3.14 is complete when:

- [x] **[AC-033a]** Participant experience philosophy documented. `[PEL-M01, PEL-M03]`
- [x] **[AC-033b]** Emotional design principles established. `[PEL-M06]`
- [x] **[AC-033c]** Lifecycle stages defined. `[PEL-M04, PEL-M05]`
- [x] **[AC-033d]** Long-term engagement strategy documented. `[PEL-M09, PEL-M05]`
- [x] **[AC-033e]** Community Companion architecture specified. `[PEL-M11]`
- [x] **[AC-033f]** Evaluation question locked for all future features. `[PEL-M13]`
- [x] **[AC-033g]** Burt has blueprint for participant-centered experience. `[PEL-BG, participant-experience-lifecycle.json]`

---

**Next Step:** 3.15 — Phase 3 Build Bible

*Trace: Discovery → welcome → first hour success → weekly habits → monthly identity → yearly leadership → fifth-year memory → lifelong community*
