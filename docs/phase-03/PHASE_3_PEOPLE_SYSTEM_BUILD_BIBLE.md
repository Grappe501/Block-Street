# Phase 3 Build Bible — People & Relationship System

**Document ID:** PHASE-003.15  
**Artifact:** `PHASE_3_PEOPLE_SYSTEM_BUILD_BIBLE.md`  
**Status:** Canonical  
**Phase 3 Status:** Complete  
**Closed:** 2026-07-14

> **Phase 3 answers:** *Who is this person, how do they grow, and how do they connect to others?*

---

## Phase 3 Summary

**Name:** People & Relationship System  
**Constitution:** [Participant Identity Doctrine](PARTICIPANT_IDENTITY_DOCTRINE.md)  
**Master sequence:** [PHASE_3_MASTER_SEQUENCE.md](PHASE_3_MASTER_SEQUENCE.md)  
**Live index:** `data/people/people-relationship-system.json`

Phase 3 is the **heart of the platform**. It establishes people — not software “users” — as the organizing root: identity, journey, headquarters, networks, trust, growth, belonging, and lifelong civic story.

**Evaluation question (locked at 3.14):**  
*Does this strengthen relationships, deepen belonging, and help people grow into community builders?* [PEL-001]

---

## Step Index (All Complete)

| Step | Document | Core Concept | Requirement |
|------|----------|--------------|-------------|
| 3.1 | [Participant Identity Doctrine](PARTICIPANT_IDENTITY_DOCTRINE.md) | People not users · Personal Mission | PEP-001 · PRM-001 |
| 3.2 | [Participant Journey Framework](PARTICIPANT_JOURNEY.md) | Nine growth stages · orchestration | JRN-001 · CPP-001 |
| 3.3 | [Personal Headquarters & Profile](PARTICIPANT_PROFILE_SYSTEM.md) | Organizing home — not a profile page | PHQ-001 · USR-001 |
| 3.4 | [Personal Relationship Network](PERSONAL_RELATIONSHIP_NETWORK.md) | Participant-owned living network · Trust Graph | NET-001 |
| 3.5 | [Relationship Growth Engine](RELATIONSHIP_GROWTH_ENGINE.md) | Self-expanding through trusted invites | RGE-001 |
| 3.6 | [Personal Command Center](PERSONAL_COMMAND_CENTER.md) | Daily workspace · Morning Brief | PCC-001 |
| 3.7 | [Trust, Privacy & Digital Safety](TRUST_PRIVACY_DIGITAL_SAFETY.md) | Trust as infrastructure | SEC-001 |
| 3.8 | [Personal Growth & Leadership](PERSONAL_GROWTH_LEADERSHIP.md) | Growth Graph · leadership OS | PGL-001 |
| 3.9 | [Community Recognition & Appreciation](COMMUNITY_RECOGNITION_APPRECIATION.md) | Appreciation not gamification | CRA-001 |
| 3.10 | [Communication & Attention Management](COMMUNICATION_ATTENTION_MANAGEMENT.md) | Attention Budget · earn not abuse | CAM-001 |
| 3.11 | [Civic Journey Timeline](CIVIC_JOURNEY_TIMELINE.md) | Memory Moments · Civic Passport | CJT-001 |
| 3.12 | [Personal Digital Twin](PERSONAL_DIGITAL_TWIN.md) | Participant Context Engine | PDT-001 |
| 3.13 | [Opportunity & Belonging Engine](OPPORTUNITY_BELONGING_ENGINE.md) | Belonging not engagement | OBE-001 |
| 3.14 | [Participant Experience & Lifecycle](PARTICIPANT_EXPERIENCE_LIFECYCLE.md) | Community Companion · Phase 3 heart | PEL-001 |
| 3.15 | **This document** | People System closeout + transition | PHASE-003.15 |

---

## Registry & Spec Artifacts

```
data/people/
└── people-relationship-system.json

docs/phase-03/
├── PHASE_3_MASTER_SEQUENCE.md
├── PHASE_3_PEOPLE_SYSTEM_BUILD_BIBLE.md   ← this closeout
├── PARTICIPANT_IDENTITY_DOCTRINE.md
├── PARTICIPANT_JOURNEY.md
├── PARTICIPANT_PROFILE_SYSTEM.md
├── PERSONAL_RELATIONSHIP_NETWORK.md
├── RELATIONSHIP_GROWTH_ENGINE.md
├── PERSONAL_COMMAND_CENTER.md
├── TRUST_PRIVACY_DIGITAL_SAFETY.md
├── PERSONAL_GROWTH_LEADERSHIP.md
├── COMMUNITY_RECOGNITION_APPRECIATION.md
├── COMMUNICATION_ATTENTION_MANAGEMENT.md
├── CIVIC_JOURNEY_TIMELINE.md
├── PERSONAL_DIGITAL_TWIN.md
├── OPPORTUNITY_BELONGING_ENGINE.md
├── PARTICIPANT_EXPERIENCE_LIFECYCLE.md
└── README.md
```

Admin Workbench surfaces for Steps 3.1–3.14 live under Director tabs (Journey, HQ, Network, Invites, Command, Trust, Develop, Thanks, Comms, Timeline, PDT, Belonging, Experience).

---

## Architectural Locks

| Concept | Requirement |
|---------|-------------|
| People not users | Identity starts with Human dignity [PEP-M01] |
| Personal Mission | Forward-looking purpose, not a bio [PRM-001] |
| Journey not rank | Growth stages, non-linear [JRN-M01] |
| HQ is home | Platform center — features return to headquarters [PHQ-M01] |
| Participant-owned network | Relationships, not org CRM contacts [NET-M01] |
| Healthy growth | Invite integrity — no spam leaderboards [RGE-M01] |
| Command Center daily | Morning Brief + widgets — one daily workspace [PCC-M01] |
| Trust as infrastructure | Visibility + minimization before features [SEC-M01] |
| Appreciation not points | No gamification contests [CRA-M01] |
| Earn attention | Attention Budget — never abuse [CAM-M13] |
| Civic Passport story | Append-only lifelong narrative [CJT-M01 · CPP-001] |
| Twin composition | Reference canonical stores — don’t duplicate [PDT-M01] |
| Belonging over engagement | Explainable opportunities [OBE-M01] |
| Community Companion | Voice of community, not software [PEL-M11] |

---

## V1 Critical Path (July 12–14)

Minimum product truths this phase authorized for launch season:

| Capability | Phase 3 foundation | Live launch note (2026-07-14) |
|------------|--------------------|-------------------------------|
| Invitation-only entry | RGE · SEC · PEP | `/invite` · `/start` chain |
| Sponsor lineage | RGE · NET | Identity-trust invitations |
| Verified Human activation | PEP · SEC | Wave1 acceptance + session |
| Place / belonging entrance | Journey · OBE spirit | `/choose-place` then map lock |
| Progressive disclosure | PEL · CAM | LaunchChrome — show only what is needed |
| Daily “tonight” surface | PCC / journey patterns | `/july-14` · `/app` |

Phase 3 **design is complete**. Product certification of every People surface continues under **Version 1.0 Certification** (`docs/v1-certification/`) — design completeness ≠ CERTIFIED PRESENT.

---

## Transition — What Comes Next

Phase 3 complete. People have doctrine, journey, home, network, trust, and belonging design.

| Direction | Path |
|-----------|------|
| Prior | [Phase 2 Digital Arkansas Build Bible](../phase-02/PHASE_2_DIGITAL_ARKANSAS_BUILD_BIBLE.md) |
| Next (community work) | [Phase 4 Community OS Build Bible](../phase-04/PHASE_4_COMMUNITY_OS_BUILD_BIBLE.md) |
| Active program | [Phase 11 Living Intelligence & V1 Launch](../phase-11/PHASE_11_BUILD_LEDGER.md) |
| Truth baseline | [V1 Certification](../v1-certification/README.md) |

*The Registry (Phase 2) gives people a place.*  
*The People System (Phase 3) gives people relationships, purpose, and belonging.*  
*Community OS (Phase 4+) gives people somewhere to work together.*

---

## Closeout Declaration

**Phase 3 — People & Relationship System — COMPLETE.**

All fifteen steps of the Master Sequence are canonical. Step 3.15 locks the closeout index Burt needs to implement and certify without rediscovering doctrine from chat memory.

**Signed in Build Control:** `data/build-progress.json` · Phase 3 status `done` · 2026-07-14
