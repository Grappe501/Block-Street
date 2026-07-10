# Community Doctrine

**Document ID:** PHASE-004.1  
**Artifact:** `COMMUNITY_DOCTRINE.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 4 — Community Operating System

> **The platform provides the structure. The people create the culture.**

This document defines **what a community is** on ASYON — one philosophy for every community type, from campus to county to committee to project.

**Builds On:** [Community Identity & Personalization](../phase-02/COMMUNITY_IDENTITY_PERSONALIZATION_SYSTEM.md) · [Organizing Model CP-004](../build-steps/PHASE-001.3-CORE-PRINCIPLES.md) · [Personal Headquarters](../phase-03/PARTICIPANT_PROFILE_SYSTEM.md) · [Participant Experience](../phase-03/PARTICIPANT_EXPERIENCE_LIFECYCLE.md)

**Live spec:** `data/registry/community-doctrine.json`

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| CMD-M01 | Purpose |
| CMD-M02 | Guiding principle |
| CMD-M03 | What is a community |
| CMD-M04 | Community types |
| CMD-M05 | One philosophy |
| CMD-M06 | Community Operating System concept |
| CMD-M07 | Community Constitution architecture |
| CMD-M08 | Community HQ parallel |
| CMD-M09 | Structure and culture |
| CMD-M10 | Phase 2 identity integration |
| CMD-M11 | Phase 3 people integration |
| CMD-M12 | Network of operating systems |
| CMD-M13 | Community equality |
| CMD-M14 | V1 scope |
| CMD-BG | Burt implementation guidance |
| AC-034 | Step 4.1 acceptance criteria |

---

## CMD-M01 — Purpose

**[CMD-M01]** This document defines **what a community is** on the ASYON platform and establishes **one shared philosophy** for all community types.

**[CMD-M01a]** Phase 4 answers: **Where do we work together?** — shifting from individuals (Phase 3) to **living communities**.

**[CMD-M01b]** Every campus, county, committee, and project should function like a small **operating system** — not a static hub page [CMD-M06].

**[CMD-M01c]** Terminology: **Community Operating System** (not "Communities module" or "hub enhancement" alone).

---

## CMD-M02 — Guiding Principle

**[CMD-M02]**

> **The platform provides the structure. The people create the culture.**

**[CMD-M02a]** UCA should feel different from University of Arkansas — **not because the software differs**, but because **members have shaped community identity** [CID-001, CMD-M07].

**[CMD-M02b]** Complementary to [CP-004 Local Communities Own Their Voice]: platform connects; communities set priorities.

**[CMD-M02c]** Evaluation question from Phase 3 [PEL-M13] applies to all community features.

---

## CMD-M03 — What Is a Community

**[CMD-M03]** A community on ASYON is:

| Property | Definition |
|----------|------------|
| **A place where people work together** | Not a content page — an operating environment |
| **Participant-owned culture** | Constitution, traditions, values [CMD-M07] |
| **Connected to the graph** | Registry node with relationship edges [REL-M01] |
| **Lifecycle-aware** | Born, grows, thrives, may dormancy [Step 4.2] |
| **Equal in platform rights** | No permanent hierarchy between community types [OM-006] |

**[CMD-M03a]** A community is **not** an organization imposed on participants — it is a **container built from people** who choose to participate [OM-L1, PEP-001].

**[CMD-M03b]** Communities exist on a **spectrum of formality** — county (geographic) to project (temporary) — same OS principles, different lifecycle [CMD-M04].

---

## CMD-M04 — Community Types

**[CMD-M04]** One philosophy applies to all types:

| Type | Example | Registry source |
|------|---------|-----------------|
| **Campus** | UCA, University of Arkansas | [INST-003, REG-002] |
| **County** | Pulaski, Faulkner | [CNTY-002, REG-001] |
| **Committee** | Campus Outreach, Communications | Step 4.4 [COM-001] |
| **Project** | Food Drive, Campus Cleanup | Step 4.5 |
| **Interest Group** | Environmental organizers | Future |
| **Regional Collaboration** | Central Arkansas coalition | Step 4.11 |
| **Future High School** | Expansion package [ADT-M15] | Phase 9 |
| **Future Alumni Network** | Graduated community | Phase 9 [JRN alumni] |

**[CMD-M04a]** All types receive the same **Community OS capabilities** [Steps 4.3–4.13] — scaled to lifecycle stage.

**[CMD-M04b]** Participant may belong to **multiple communities simultaneously** [PEP-M08] — edges, not exclusive membership.

---

## CMD-M05 — One Philosophy

**[CMD-M05]** Regardless of type, every community shares:

| Principle | Meaning |
|-----------|---------|
| **Welcoming** | Never empty of welcome [ADT-M10, CID-M09] |
| **Participatory** | Active through people, not admins alone [OM-L1] |
| **Transparent** | Constitution visible; decisions explainable |
| **Connected** | Cross-community collaboration encouraged [4.11] |
| **Memorable** | History preserved [4.13] |
| **Healthy metrics** | Analytics for community health, not vanity [4.10] |

**[CMD-M05a]** Anti-patterns unified with Phase 3: no leaderboards, no popularity contests [OIS-M14, CRA-M03].

---

## CMD-M06 — Community Operating System Concept

**[CMD-M06]** Each community runs a **Community Operating System** with standard subsystems:

```
Community OS
├── Constitution [CMD-M07]
├── Headquarters [4.3]
├── People & roles
├── Calendar [4.6]
├── Committees [4.4]
├── Projects [4.5]
├── Communications [4.7]
├── Knowledge [4.8]
├── Resources [4.9]
├── Marketplace needs [4.12]
├── Analytics [4.10]
├── Memory & timeline [4.13]
└── Collaboration links [4.11]
```

**[CMD-M06a]** The statewide platform is a **network of Community OS instances** — interconnected, not siloed.

**[CMD-M06b]** Personal HQ [PHQ-001] is the participant's window **into** community OS instances they belong to.

**[CMD-M06c]** Implementation: composition over duplication — community OS **references** Registry, graph, and Phase 3 participant modules [PDT-M13 pattern].

---

## CMD-M07 — Community Constitution Architecture

**[CMD-M07]** **Signature concept:** Every community defines a **Community Constitution** within the shared platform framework.

| Constitution element | Purpose |
|------------------------|---------|
| **Purpose** | Why this community exists |
| **Goals** | What it's trying to accomplish this semester or year |
| **Values** | How members agree to work together |
| **Current Priorities** | Most important initiatives right now |
| **Success Stories** | What the community has achieved |
| **Open Opportunities** | Where help is needed |
| **Community Traditions** | Events, rituals, recurring activities unique to this campus or county |

**[CMD-M07a]** Example: UCA community feels different from UA Fayetteville because **constitution content differs** — same OS, authentic local culture [CMD-M02a].

**[CMD-M07b]** Constitution is **participant-editable** by community leaders — with audit trail [KDG-M07 append-only for history].

**[CMD-M07c]** Constitution surfaces on **Community HQ** [4.3] and informs **OBE-001** community-level opportunities [4.12].

**[CMD-M07d]** Schema: extends [Community DNA CID-M13] with governance fields — `community-constitution.schema.json` future.

**[CMD-M07e]** V1: purpose + welcome + priorities stub on campus/county hubs; full constitution editor v1.1.

---

## CMD-M08 — Community HQ Parallel

**[CMD-M08]** Every community receives **Community Headquarters** — parallel to Personal Headquarters [PHQ-001]:

| Personal HQ section | Community HQ equivalent |
|-----------------------|-------------------------|
| My Mission | Community Purpose [Constitution] |
| My Communities | Parent/sibling communities [4.11] |
| My Network | Community members & roles |
| My Journey | Community lifecycle [4.2] |
| My Calendar | Community Calendar [4.6] |
| My Opportunities | Open Opportunities [Constitution] + Marketplace [4.12] |
| My Impact | Community Analytics [4.10] |
| My Passport | Community Memory [4.13] |

**[CMD-M08a]** Step 4.3 specifies full Community HQ — this doctrine establishes **philosophical parity** with PHQ.

---

## CMD-M09 — Structure and Culture

**[CMD-M09]**

> **The platform provides the structure. The people create the culture.**

| Platform provides | People create |
|-------------------|---------------|
| OS subsystems (calendar, projects, comms) | Constitution content |
| Graph connections | Relationships |
| Attention-respecting comms [CAM-001] | Discussion culture |
| Health analytics framework | Meaning of success locally |
| Cross-community rails [4.11] | Coalitions and partnerships |

**[CMD-M09a]** Software never **imposes** culture — it **supports** culture participants define [CP-004].

---

## CMD-M10 — Phase 2 Identity Integration

**[CMD-M10]** Community Doctrine **extends** [Community Identity CID-001]:

| Phase 2 | Phase 4 adds |
|---------|--------------|
| Community DNA | Community Constitution [CMD-M07] |
| Welcome experience [CID-M09] | Community HQ [4.3] |
| Living communities [CID-M10] | Full OS subsystems |
| Personalization boundaries [CID-M07] | Community-owned content within bounds |

**[CMD-M10a]** DNA categories (history, geography, culture) feed **Traditions** and **Success Stories** in Constitution.

**[CMD-M10b]** No rewrite of CID — Phase 4 **implements** living community promise from Phase 2.

---

## CMD-M11 — Phase 3 People Integration

**[CMD-M11]** Community OS **serves** Phase 3 capabilities:

| Phase 3 | Community OS use |
|---------|------------------|
| PHQ My Communities | Entry point to Community HQ |
| NET-001 | Community member graph |
| OBE-001 | Participant discovers community opportunities |
| CRA-001 | Community appreciation board [CRA-M11] |
| CAM-001 | Community comms respect Attention Budget |
| CJT-001 | Participant timeline includes community milestones |
| PEL-001 | Community Companion welcomes to community context |

**[CMD-M11a]** Phase 3 **OBE Community Marketplace** (participant browse) + Phase 4.12 **Community Marketplace** (community publish needs) — **complementary**, not duplicate.

---

## CMD-M12 — Network of Operating Systems

**[CMD-M12]** Architecture vision:

```
Arkansas Platform
    ├── State layer [ADT-001]
    ├── Campus OS × N [INST]
    ├── County OS × 75 [CNTY]
    ├── Committee OS × ...
    ├── Project OS × ...
    └── Cross-links [4.11]
            ↑
    Participant Personal HQ / PCC
            ↑
    Participant networks [NET-001]
```

**[CMD-M12a]** Communities **never become silos** — collaboration is first-class [Step 4.11].

**[CMD-M12b]** Relationship graph [REL-M01] connects all OS instances — queryable cross-community.

---

## CMD-M13 — Community Equality

**[CMD-M13]** [OM-006] Communities are **equal** — no campus permanently outranks another in platform mechanics.

**[CMD-M13a]** Visibility and discovery may highlight **needs** [OIS-M09] — not **rank** [OIS-M14].

**[CMD-M13b]** County and campus receive **same OS capability set** — scale differs by participation, not software tier.

---

## CMD-M14 — V1 Scope

**[CMD-M14]** Step 4.1 design complete; implementation begins with enhanced hubs:

| Deliverable | V1 |
|-------------|-----|
| Doctrine + Constitution spec | ✅ this document |
| Community type taxonomy | ✅ JSON |
| Constitution stub on campus/county pages | purpose + welcome |
| Full Community HQ + OS subsystems | Steps 4.2–4.14 |

**[CMD-M14a]** Existing `/schools/[slug]` and `/county/[slug]` pages are **Community HQ seeds** — not final OS.

---

## CMD-BG — Burt Implementation Guidance

**[CMD-BG]** Implementation should:

1. **One philosophy for all community types** — shared OS interface, type-specific lifecycle [CMD-M04]
2. **Community Constitution as first-class object** — not hard-coded hub copy [CMD-M07]
3. **Parity with Personal HQ patterns** — participants understand community home immediately [CMD-M08]
4. **Extend CID, don't replace** — DNA + Constitution together [CMD-M10]
5. **Evaluate against PEL-M13** — every community feature [CMD-M02c]

**[CMD-BG-a]** Recommended structure:

```
src/lib/community/CommunityOS.ts
src/lib/community/CommunityConstitution.ts
src/lib/community/assembleCommunityHQ.ts
```

**[CMD-BG-b]** Gate: no new community type without Constitution schema and OS capability map.

---

## AC-034 — Acceptance Criteria

Step 4.1 is complete when:

- [x] **[AC-034a]** Community doctrine philosophy documented. `[CMD-M01, CMD-M05]`
- [x] **[AC-034b]** Community types defined. `[CMD-M04]`
- [x] **[AC-034c]** Community Operating System concept specified. `[CMD-M06]`
- [x] **[AC-034d]** Community Constitution architecture documented. `[CMD-M07]`
- [x] **[AC-034e]** Phase 2 and Phase 3 integration mapped. `[CMD-M10, CMD-M11]`
- [x] **[AC-034f]** Burt has blueprint for community-centric platform layer. `[CMD-BG, community-doctrine.json]`

---

**Next Step:** 4.2 — Community Lifecycle

*Trace: Registry node → Community Constitution → Community OS → people participate → culture emerges → cross-community links*
