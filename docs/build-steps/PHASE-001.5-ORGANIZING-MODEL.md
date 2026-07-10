# Build Step 1.5 — Organizing Model

**Document ID:** PHASE-001.5  
**Status:** Canonical  
**Priority:** Critical  
**Master Build Plan Sequence:** Phase 001 — Project Constitution & Mission Doctrine  

> **This is where the project truly becomes unique.**  
> Most platforms organize around **organizations**.  
> We organize around **people**, while allowing organizations to become communities built from those people.  
> **This is the philosophical foundation of the database.**

**Builds On:** PHASE-001.1 [OP-001, OH-001–003] · PHASE-001.3 [CP-003, CP-013] · PHASE-001.4 [DG-005, DG-012]

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| OM-001 | Purpose of organizing model |
| OM-002 | Fundamental principle — individual at center |
| OM-L1 | Layer 1 — The Individual |
| OM-L2 | Layer 2 — Personal Network |
| OM-L3 | Layer 3 — Community |
| OM-L4 | Layer 4 — Working Groups |
| OM-L5 | Layer 5 — Statewide Network |
| OM-003 | Relationship-based growth |
| OM-004 | Multiple simultaneous identities |
| OM-005 | Organizing homes (navigation model) |
| OM-006 | Communities are equal |
| OM-007 | Network health |
| OM-008 | Graduation and continuity |
| OM-009 | Organizing philosophy statement |
| OM-010 | Burt implementation guidance |
| AC-005 | Step 1.5 acceptance criteria |

---

## OM-001 — Purpose

**[OM-001]** This document defines **how the platform organizes people**.

**[OM-001a]** It establishes the relationship between:

- Individuals
- Personal networks
- Educational institutions
- Counties
- Committees
- The statewide platform

**[OM-001b]** Every future feature should build upon this organizing model.

**[OM-001c]** This model is the **philosophical foundation of the database**. The individual is the root entity — not the campus, not the county.

---

## OM-002 — The Fundamental Principle

**[OM-002]** **The individual is the center of the platform.**

**[OM-002a]** Everything else exists to help individuals connect with one another.

**[OM-002b]** The software does not organize campuses.  
The software **helps people organize their campuses**.

**[OM-002c]** The software does not organize counties.  
The software **helps people organize their counties**.

*Aligns with:* [OP-001] · [CP-003] · [DG-012] · Database root entity = `users`

---

## Five Layers of Organization

The platform consists of five interconnected layers.  
**Build from Layer 1 outward. Never invert this order.**

```
Layer 5 — Statewide Network        (connects all)
Layer 4 — Working Groups           (committees, projects)
Layer 3 — Community                (campus, county)
Layer 2 — Personal Network         (referral tree)
Layer 1 — The Individual           (root entity)
```

---

## OM-L1 — Layer 1: The Individual

**[OM-L1]** Everything begins with one participant.

Each participant receives:

- Personal profile
- Personal dashboard
- Personal organizing network
- Invite link
- QR code
- Volunteer record (future)
- Leadership record (future)
- Activity history

**[OM-L1a]** Every participant has equal opportunity.

*Database implication:* `users` table is the root. All other entities reference users — users do not reference a hierarchy.

---

## OM-L2 — Layer 2: Personal Network

**[OM-L2]** Every participant automatically owns a network.

**[OM-L2a]** The platform encourages participants to invite friends, classmates, coworkers, neighbors, teammates, and others they already know and trust.

Each participant can:

- Invite others
- Welcome new members
- Mentor participants
- Build teams
- Track relationships
- Celebrate milestones

**[OM-L2b]** Growth occurs through trusted relationships rather than anonymous mass outreach.

*Database implication:* `referrals` table — self-referential graph on `users`. Primary growth mechanism [NS-006, NS-012].

---

## OM-L3 — Layer 3: Community

**[OM-L3]** Participants belong to one or more organizing communities.

### Educational Institutions

- Universities
- Colleges
- Community colleges
- Technical schools
- Trade schools
- Future high schools

### Counties

**[OM-L3a]** Every Arkansas county has a community.

**[OM-L3b]** Participants not connected to a school organize through their county.

**[OM-L3c]** Future versions may allow participants to join multiple communities where appropriate.

*Database implication:* `users.affiliation_type` + `campus_id` OR `county_id`. Communities are **containers built from people** — not the other way around.

*Aligns with:* [OH-001, OH-002] · [CP-001]

---

## OM-L4 — Layer 4: Working Groups

**[OM-L4]** Participants organize into purpose-driven groups.

Examples include:

- Committees
- Projects
- Volunteer teams
- Event planning groups
- Study circles
- Civic education groups

**[OM-L4a]** Working groups are temporary or permanent depending on their purpose.

**[OM-L4b]** Participants may belong to multiple groups simultaneously.

*Database implication (future):* `committees`, `committee_members` — always linked to users, optionally scoped to campus/county/statewide.

*Version:* v1.1+ — not V1 launch requirement.

---

## OM-L5 — Layer 5: Statewide Network

**[OM-L5]** The statewide platform connects all communities.

It provides:

- Discovery
- Shared learning
- Communication infrastructure
- Resource sharing
- Statewide initiatives
- Training

**[OM-L5a]** The statewide layer exists to **strengthen local communities rather than replace them**.

*Aligns with:* [NS-009] · [DG-005] · [CP-004]

---

## OM-003 — Relationship-Based Growth

**[OM-003]** The platform grows through relationships.

Example:

```
Emma
 ├── Noah
 │     ├── Olivia
 │     └── Mason
 ├── Ava
 └── Liam
```

**[OM-003a]** Every participant eventually develops their own network.

**[OM-003b]** The platform therefore becomes a network of interconnected local communities.

*Aligns with:* [OP-001c] · [DG-007] · Share link `/s/[slug]` + QR code

---

## OM-004 — Multiple Simultaneous Identities

**[OM-004]** A participant may simultaneously be:

- A university student
- A county resident
- A volunteer
- A committee member
- An event organizer
- A mentor
- A recruiter
- A learner

**[OM-004a]** The platform should **never force participants into a single identity**.

*Database implication:* Identity is additive (roles, affiliations, interests) — not exclusive categories.

---

## OM-005 — Organizing Homes (Navigation Model)

**[OM-005]** Every participant should immediately know where they belong.

| Home | What It Is | V1 |
|------|-----------|-----|
| **My Network** | The people I know | ✅ Launch |
| **My Campus** | If applicable (student path) | ✅ Launch |
| **My County** | Always available | ✅ Launch |
| **My Committees** | Groups where I collaborate | v1.1 |
| **My Events** | Activities I'm participating in | v1.2 |
| **My Growth** | My leadership journey | v1.1+ |

*UI implication:* Personal dashboard is the default landing after login — not a news feed or admin page.

---

## OM-006 — Communities Are Equal

**[OM-006]** Every organizing community has access to the same core capabilities.

**[OM-006a]** No permanent hierarchy exists between:

- Counties
- Universities
- Colleges
- Technical schools
- Trade schools

**[OM-006b]** Communities become vibrant through **participation** rather than platform privilege.

*Aligns with:* [CP-002] · [ER-001] · [DG-006]

---

## OM-007 — Network Health

**[OM-007]** The platform should value **healthy communities**, not just large ones.

Measures may eventually include:

- Active participation
- Volunteer engagement
- Event attendance
- Mentor relationships
- New organizers developed
- Community projects completed

**[OM-007a]** The objective is to build **resilient communities** rather than simply maximize membership.

*Aligns with:* [DG-007] · [NS-004] · Not referral-count leaderboards

---

## OM-008 — Graduation and Continuity

**[OM-008]** Participants should never "fall off" the platform because they graduate.

Instead, they may transition naturally:

```
High School
    ↓
College
    ↓
County (if not in school)
    ↓
Mentor
    ↓
Community Leader
    ↓
Alumni Supporter
```

**[OM-008a]** The platform should preserve relationships across these transitions.

*Aligns with:* [CP-015] · [PI-004] · Personal network persists; affiliation updates

---

## OM-009 — Organizing Philosophy Statement

**[OM-009]** Every participant should be able to say:

> I have a place.  
> I know people here.  
> I can make a difference.  
> I can help someone else become a leader.

---

## OM-010 — Burt Implementation Guidance

**[OM-010]** During implementation:

- **Begin with the individual** — `users` table first, everything else references it
- **Build outward toward communities** — campuses and counties are affiliations on users
- **Avoid hard-coding organizational hierarchies** — no parent-child institution trees
- **Design every entity for future expansion** — working groups, events, roles layer on later
- **Preserve equal opportunity for every organizing community** — same capabilities per hub type

**[OM-010a]** Database entity priority order:

```
1. users              (root — the person)
2. referrals          (relationship graph)
3. counties           (reference data)
4. institutions       (reference data)
5. user_affiliations  (campus OR county link on user)
6. committees         (v1.1 — links users, optional community scope)
7. events             (v1.2)
8. volunteer_hours    (v1.5)
```

**[OM-010b]** Anti-patterns — do NOT build:

- Campus-as-root with users as children
- County hierarchy over campuses
- Permanent leadership tables with privileged institutions
- Referral-count leaderboards as primary metric

*Aligns with:* [BG-001] · [ED-001] · [DG-009]

---

## Entity Relationship Summary (Conceptual — Not Implementation)

```
                    ┌─────────────────┐
                    │  Statewide (L5) │  connects, never controls
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼────┐  ┌──────▼──────┐  ┌───▼──────────┐
     │ Working      │  │  Community  │  │  Community   │
     │ Groups (L4)  │  │  Campus(L3) │  │  County (L3) │
     └────────┬─────┘  └──────┬──────┘  └───┬──────────┘
              │              │              │
              └──────────────┼──────────────┘
                             │
                    ┌────────▼────────┐
                    │ Personal Network│  referrals graph
                    │      (L2)       │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   Individual    │  ROOT ENTITY
                    │      (L1)       │
                    └─────────────────┘
```

---

## AC-005 — Acceptance Criteria

Step 1.5 is complete when:

- [x] **[AC-005a]** The organizing model is clearly defined. `[OM-001, OM-002]`
- [x] **[AC-005b]** The five organizational layers are documented. `[OM-L1 through OM-L5]`
- [x] **[AC-005c]** Personal networks are established as the primary growth mechanism. `[OM-L2, OM-003]`
- [x] **[AC-005d]** Communities are defined without permanent hierarchy. `[OM-L3, OM-006]`
- [x] **[AC-005e]** Burt has a clear conceptual model for structuring platform architecture. `[OM-010, entity diagram]`

---

## Constitutional Layer Complete

Steps 1.1 through 1.5 complete the **constitutional layer** of the project:

| Step | Document | What It Defines |
|------|----------|-----------------|
| 1.1 | Platform Identity | Who we are |
| 1.2 | North Star Outcome | Where we're going |
| 1.3 | Core Principles | Immutable doctrine |
| 1.4 | Design Guardrails | What we must not become |
| 1.5 | Organizing Model | How people are organized |

**Next:** PHASE-001.6 — Growth Model (philosophy → roadmap: V1 vs later versions)

---

## Document Authority

| Field | Value |
|-------|-------|
| Document ID | PHASE-001.5 |
| Status | Canonical |
| Database Foundation | Individual (`users`) is root entity |
| Next Step | PHASE-001.6 — Growth Model |

---

*ASYON Organizing Model*  
*People first. Communities built from people. Five layers. No hierarchy.*
