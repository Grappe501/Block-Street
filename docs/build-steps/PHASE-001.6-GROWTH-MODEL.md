# Build Step 1.6 — Growth Model & Evolution Strategy

**Document ID:** PHASE-001.6  
**Status:** Canonical  
**Priority:** Critical  
**Master Build Plan Sequence:** Phase 001 — Project Constitution & Mission Doctrine  

> **The last document in the Foundational Constitution.**  
> After this, we transition from *what the platform is* to *how the platform evolves*.  
> **One of the most practical documents Burt will receive.**

**Builds On:** All PHASE-001.1–001.5 · [ED-001] · [NS-013] · [OM-010]

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| GM-001 | Purpose |
| GM-002 | Core philosophy — launch early, learn quickly |
| GM-P1 | Foundation before features |
| GM-P2 | Build vertically (end-to-end) |
| GM-P3 | Version, don't rewrite |
| GM-P4 | Measure before expanding |
| GM-P5 | Local success before statewide complexity |
| GM-P6 | Participant feedback drives priorities |
| GM-P7 | Continuous registry expansion |
| GM-P8 | Progressive personalization |
| GM-P9 | Progressive leadership development |
| GM-P10 | Modular architecture |
| GM-VF | Version evolution framework (3 questions) |
| GM-FL | Feedback loop cycle |
| GM-V1 | Version 1 launch scope (July 2026) |
| GM-ROAD | Version roadmap summary |
| GM-010 | Burt implementation guidance |
| AC-006 | Step 1.6 acceptance criteria |
| GM-PH1 | Phase 1 completion statement |

---

## GM-001 — Purpose

**[GM-001]** This document establishes how the platform grows from its first public release into a mature statewide organizing platform.

**[GM-001a]** The objective is to prevent feature creep while ensuring every implementation decision contributes to a long-term vision.

**[GM-001b]** Growth should be intentional, modular, measurable, and continuously informed by participant feedback.

---

## GM-002 — Core Philosophy

**[GM-002]** **Launch early. Learn quickly. Improve continuously.**

**[GM-002a]** Version 1 is not intended to be complete.

**[GM-002b]** Version 1 is intended to establish a **stable foundation** upon which future versions can be built.

Every release should:

- Improve participant experience
- Expand organizing capabilities
- Preserve platform stability
- Maintain compatibility with previous data whenever practical

*Aligns with:* [ED-001] · [DG-009] · [CP-014]

---

## Growth Principles

### GM-P1 — Foundation Before Features

**[GM-P1]** The platform should first establish essential organizing infrastructure before adding advanced capabilities.

**V1 initial priorities:**

| Priority | Capability | North Star? |
|----------|-----------|-------------|
| ✅ | Participant registration (honor system) | NS-Q1, NS-Q3 |
| ✅ | County hubs (75 counties) | NS-Q4 |
| ✅ | Campus/institution hubs | NS-Q4 |
| ✅ | Personal network boards | NS-Q1 |
| ✅ | Recruitment links + QR codes | OM-L2 |
| ✅ | Basic administration / director workbench | CP-011 |
| ✅ | Search / directory | NS-Q4 |
| ✅ | Mobile usability | CP-008 |

Additional features build **upon** these — never replace them.

---

### GM-P2 — Build Vertically

**[GM-P2]** Complete a capability end-to-end before beginning another.

**Example — Institution Registry (Phase 2):**

```
Database → API → Admin tools → Public pages → Search → Mobile → Analytics
```

**[GM-P2a]** Once that capability is functional, move to the next. Reduces partially completed systems and simplifies testing.

*Aligns with:* [ED-001] Design First · Build Second

---

### GM-P3 — Version, Don't Rewrite

**[GM-P3]** Each version should **extend** the platform. Avoid large-scale rewrites unless necessary.

**[GM-P3a]** Design components, APIs, and data models with future expansion in mind.

*Aligns with:* [DG-009] · [CP-010] · [OM-010]

---

### GM-P4 — Measure Before Expanding

**[GM-P4]** Every major feature should answer:

- Is it being used?
- Does it strengthen organizing?
- Does it improve participant experience?
- Does it support the North Star? [NS-013]

**[GM-P4a]** Features that do not demonstrate value should be reconsidered before further investment.

---

### GM-P5 — Local Success Before Statewide Complexity

**[GM-P5]** Develop capabilities that strengthen **local organizing first.**

Examples:

- Campus recruitment
- County outreach
- Volunteer coordination
- Local events

**[GM-P5a]** Statewide coordination features should **enhance—not replace** local activity.

*Aligns with:* [NS-009] · [DG-005] · [CP-004]

---

### GM-P6 — Participant Feedback Drives Priorities

**[GM-P6]** After each significant release:

1. Gather participant feedback
2. Observe actual usage
3. Identify friction points
4. Prioritize improvements based on evidence
5. Publish the next implementation roadmap

**[GM-P6a]** The platform should evolve **with** its participants.

*Aligns with:* [ED-001] Validate Third · Iterate Fourth

---

### GM-P7 — Continuous Registry Expansion

**[GM-P7]** The organizing registry should grow over time. Registry is canonical source of truth [Phase 2].

| Stage | Institutions | When |
|-------|-------------|------|
| **Initial** | Colleges, universities | V1 / Phase 2 |
| **Next** | Community colleges, technical schools, trade schools | V1.5 |
| **Future** | High schools, youth orgs, community orgs (if adopted) | V2+ |

**[GM-P7a]** The registry remains the authoritative organizational structure for all features.

---

### GM-P8 — Progressive Personalization

**[GM-P8]** Every release should make organizing spaces feel more local.

Examples:

- County information
- Campus history and culture
- Local imagery (where appropriately licensed)
- Community statistics
- Institution facts
- Local event calendars

**[GM-P8a]** Participants should increasingly feel: *"This space was built for people like me."* [CP-012]

---

### GM-P9 — Progressive Leadership Development

**[GM-P9]** Leadership tools should evolve alongside participant experience.

Future capabilities:

- Leadership pathways
- Mentorship matching
- Skill tracking
- Volunteer portfolios
- Project management
- Recognition based on community impact

**[GM-P9a]** The platform helps participants grow into organizers over time. [CP-013]

---

### GM-P10 — Modular Architecture

**[GM-P10]** Each major capability functions as an independent module:

| Module | Version |
|--------|---------|
| Registration | V1 |
| Directory / Registry | V1 (Phase 2) |
| Personal Network | V1 |
| Events | v1.2 |
| Committees | v1.1 |
| Messaging | v1.3 |
| Volunteer management | v1.5 |
| Analytics | v1.1+ |

**[GM-P10a]** Modules communicate through stable interfaces while remaining independently maintainable.

---

## GM-VF — Version Evolution Framework

**[GM-VF]** Every release should answer three questions:

| Question | Focus |
|----------|-------|
| **What do participants need today?** | Immediate improvements |
| **What prepares the platform for tomorrow?** | Architectural investments |
| **What creates opportunities for the future?** | Strategic capabilities |

**[GM-VF-a]** A balanced release should include elements of all three — but V1 skews heavily toward *today* (July 14 launch).

---

## GM-FL — Feedback Loop

**[GM-FL]** The platform evolves through a disciplined cycle:

```
Design → Implement → Test → Observe → Learn → Improve
```

**[GM-FL-a]** Every completed version becomes the foundation for the next.

*Same as [ED-001] — now embedded in growth doctrine.*

---

## GM-V1 — Version 1 Launch Scope (July 2026)

**[GM-V1]** Practical V1 definition — what ships for the launch call.

### Critical Dates

| Date | Milestone |
|------|-----------|
| **July 12, 2026** | College leaders testing build |
| **July 14, 2026** | Launch call (~50 students) — start recruiting |
| **Fall 2026** | School starts — voter registration push |
| **November 3, 2026** | Election |

### V1 Must Ship (July 14)

| # | Capability | Layer | Status |
|---|-----------|-------|--------|
| 1 | WHY call-to-action homepage | L5 messaging | ✅ Live |
| 2 | 75 county hub pages | L3 community | ✅ Live |
| 3 | Institution registry + school pages | L3 community | 🔄 Phase 2 |
| 4 | County-first signup (honor system) | L1 individual | ⏳ Build |
| 5 | User profile + interests | L1 individual | ⏳ Build |
| 6 | Share link `/s/[slug]` | L2 network | ⏳ Build |
| 7 | QR code generation | L2 network | ⏳ Build |
| 8 | Personal network board | L2 network | ⏳ Build |
| 9 | Referral attribution | L2 network | ⏳ Build |
| 10 | Outreach gap dashboard | L5 statewide | 🔄 Partial |
| 11 | Arkansas map | L5 statewide | 🔄 Partial |
| 12 | Director workbench | Admin | ✅ Live |
| 13 | Netlify DB connected | Infrastructure | ⏳ Build |
| 14 | Mobile-first UI | Cross-cutting | 🔄 Ongoing |

### V1 Explicitly Does NOT Include

- Committees (v1.1)
- Events calendar (v1.2)
- Messaging (v1.3)
- Surveys / collective voice (v1.4)
- Volunteer hours (v1.5)
- Full teaching curriculum (staged)
- Roberts Rules tooling (staged)
- Voter registration tracking (Fall 2026)

**If it doesn't help July 14 recruiting → defer.**

---

## GM-ROAD — Version Roadmap Summary

**[GM-ROAD]** Post-V1 evolution:

| Version | Target | Focus |
|---------|--------|-------|
| **0.2.x** | Jul 10–11 | Foundational Constitution (Steps 1.1–1.6) ✅ |
| **0.3.0** | Jul 12 | Leader testing — signup + network |
| **1.0.0** | Jul 14 | Launch call — full V1 scope |
| **1.1.0** | Aug 2026 | Committees + moderation tools |
| **1.2.0** | Aug–Sep | Events + voter registration push |
| **1.3.0** | Sep–Oct | Messaging + outreach |
| **1.4.0** | Oct 2026 | Surveys + collective voice |
| **1.5.0** | Pre-election | Volunteer hours + analytics |
| **2.0.0** | Post-Nov 2026 | Full platform maturity review |

Each version: Design → Build → Validate → Iterate [ED-001]

---

## GM-010 — Burt Implementation Guidance

**[GM-010]** During implementation:

- Prefer simple, extensible solutions
- Avoid speculative features not in approved design step
- Build complete capabilities before starting new ones [GM-P2]
- Keep the registry authoritative [GM-P7]
- Preserve backward compatibility where practical [GM-P3]
- Document assumptions for future refinement
- **July 12 is 2 days away** — prioritize signup + network over polish

**[GM-010a]** Next phase after constitution:

> **Phase 2 — Arkansas Organizing Registry**  
> Canonical foundation: every county, every institution, relationships, metadata, representation status.  
> Highest-leverage next step — every page, dashboard, and search builds on this.

---

## AC-006 — Acceptance Criteria

Step 1.6 is complete when:

- [x] **[AC-006a]** Long-term growth philosophy documented. `[GM-002]`
- [x] **[AC-006b]** Versioning principles established. `[GM-P3, GM-VF]`
- [x] **[AC-006c]** Expansion strategy defined. `[GM-P7, GM-ROAD]`
- [x] **[AC-006d]** Feedback-driven evolution incorporated. `[GM-P6, GM-FL]`
- [x] **[AC-006e]** Burt has clear guidance for extensible platform. `[GM-010, GM-V1]`

---

## GM-PH1 — Phase 1 Completion: Foundational Constitution

With Steps **1.1 through 1.6**, the platform's constitutional layer is complete:

| Step | Document | Defines |
|------|----------|---------|
| **1.1** | Platform Identity | Who we are |
| **1.2** | North Star Outcome | Where we're going |
| **1.3** | Core Principles | Immutable doctrine |
| **1.4** | Design Guardrails | What we must not become |
| **1.5** | Organizing Model | How people are organized |
| **1.6** | Growth Model | How the platform evolves |

These documents define **why the platform exists, what it stands for, how it organizes people, what boundaries it respects, and how it should evolve**.

**Phase 2 begins:** Arkansas Organizing Registry — the data backbone.

---

## Document Authority

| Field | Value |
|-------|-------|
| Document ID | PHASE-001.6 |
| Status | Canonical |
| Closes | Phase 001 — Foundational Constitution |
| Opens | Phase 002 — Arkansas Organizing Registry |

---

*Launch early. Learn quickly. Improve continuously.*  
*V1 is the foundation — not the finish line.*
