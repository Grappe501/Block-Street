# Build Step 1.4 — Platform Boundaries & Design Guardrails

**Document ID:** PHASE-001.4  
**Status:** Canonical  
**Priority:** Critical  
**Master Build Plan Sequence:** Phase 001 — Project Constitution & Mission Doctrine  

> **This is where we protect the project from future drift.**  
> If a future feature conflicts with these boundaries, it either gets **redesigned** or explicitly approved as a **constitutional change**.

**Builds On:** PHASE-001.3 [CP-001 through CP-015, CT-001] · PHASE-001.2 [NS-013] · PHASE-001.1 [PI-002]

---

## Requirement Index

| ID | Boundary |
|----|----------|
| DG-001 | Independent platform |
| DG-002 | Respect for intellectual property |
| DG-003 | Nonpartisan platform |
| DG-004 | Youth safety and privacy |
| DG-005 | Local independence |
| DG-006 | Equal opportunity |
| DG-007 | Transparent growth |
| DG-008 | No vendor lock-in |
| DG-009 | Versioned growth |
| DG-010 | Public information and attribution |
| DG-011 | Inclusive participation |
| DG-012 | Human-centered technology |
| DG-013 | Scalable architecture |
| DG-014 | Measured innovation |
| DG-015 | Mission before features |
| BG-001 | Burt implementation guardrails |
| ED-001 | Standing engineering doctrine |
| AC-004 | Step 1.4 acceptance criteria |

---

## Purpose

**[DG-PURPOSE]** This document establishes the legal, ethical, operational, architectural, and governance boundaries for the platform.

**[DG-PURPOSEa]** These boundaries protect participant trust, preserve the platform's mission, and ensure future development remains aligned with the Platform Constitution [PHASE-001.3].

**[DG-PURPOSEb]** When uncertainty exists, these guardrails take precedence over feature requests or implementation convenience.

---

## DG-001 — Independent Platform

**[DG-001]** The platform is an independent organizing platform.

**[DG-001a]** It is **not** an official website of any:

- College
- University
- Community college
- Trade school
- High school
- County government
- State government
- Student government
- Political party

**[DG-001b]** Every institution page should clearly indicate that it is an independent organizing space created for participants connected to that institution.

*Aligns with:* [CP-004] · [CP-005] · Institution page disclaimers

**Required disclaimer on every school page:**
> An independent student organizing network for students connected to [Institution Name]. Not affiliated with or endorsed by the institution.

---

## DG-002 — Respect for Intellectual Property

**[DG-002]** The platform will respect trademarks, copyrights, and institutional branding.

**[DG-002a]** Unless permission has been granted, the platform will **not** use:

- Official logos
- Official seals
- Official mascots
- Protected artwork
- Branded marketing materials

**[DG-002b]** Institution pages may include factual information such as:

- Name
- Location
- Founding year
- Enrollment
- Publicly available history
- Publicly available demographic information

**[DG-002c]** Pages may use original layouts, typography, and carefully selected color palettes **inspired by—but not intended to imitate**—an institution's visual identity.

*Aligns with:* [CP-012] · School page personalization rules

---

## DG-003 — Nonpartisan Platform

**[DG-003]** The platform itself does not endorse or oppose:

- Political parties
- Candidates
- Ballot measures
- Organizations

**[DG-003a]** Participants remain free to organize, discuss, and advocate within the platform's rules and applicable law.

**[DG-003b]** The software provides infrastructure rather than political direction.

*Aligns with:* [CP-005] · [CT-Q7]

---

## DG-004 — Youth Safety and Privacy

**[DG-004]** Participant trust is essential.

The platform should:

- Minimize data collection
- Explain data usage clearly
- Give participants meaningful privacy controls
- Protect personal information through appropriate technical safeguards
- Handle minors and youth participation with additional care when those features are introduced

**[DG-004a]** Future expansion involving younger participants should include age-appropriate design and applicable legal review.

*Aligns with:* [CP-007] · [CT-Q4]

---

## DG-005 — Local Independence

**[DG-005]** Campus communities organize themselves. County communities organize themselves.

**[DG-005a]** The statewide platform exists to:

- Connect
- Support
- Inform
- Coordinate

**[DG-005b]** It does not exist to centrally control local communities.

*Aligns with:* [CP-004] · [NS-009] · [DG-003b]

---

## DG-006 — Equal Opportunity

**[DG-006]** Every organizing community begins with equal structural capabilities.

**[DG-006a]** Growth results from participation rather than preferential treatment.

**[DG-006b]** The software should avoid creating permanent institutional advantages.

*Aligns with:* [CP-002] · [ER-001] · [CT-Q2]

---

## DG-007 — Transparent Growth

**[DG-007]** Participants should understand how the network grows.

**[DG-007a]** Metrics, dashboards, and recognition systems should encourage meaningful participation rather than artificial competition.

Recognition should value:

- Mentorship
- Service
- Collaboration
- Community impact
- Leadership development

**Not simply referral counts.**

*Aligns with:* [CP-011] · [NS-004] · Network board design

---

## DG-008 — No Vendor Lock-In

**[DG-008]** The platform should be designed to allow future migration.

Where practical:

- Data should be exportable
- Documentation should be complete
- Open standards should be preferred
- Architecture should avoid unnecessary dependence on proprietary technologies

**[DG-008a]** This supports long-term sustainability and flexibility.

*Aligns with:* [CP-010] · [CP-015] · [CT-Q9]

---

## DG-009 — Versioned Growth

**[DG-009]** No feature should require rebuilding the platform from scratch.

**[DG-009a]** Future versions should extend the architecture rather than replace it.

**[DG-009b]** Each release should preserve compatibility with the platform's long-term direction whenever practical.

*Aligns with:* [CP-010] · [CP-014] · [ED-001]

---

## DG-010 — Public Information and Attribution

**[DG-010]** Institutional facts should come from reliable public sources.

Where information is summarized:

- Attribute the underlying source where appropriate
- Review periodically for accuracy
- Avoid presenting outdated information as current

**[DG-010a]** Future automation should support updating institutional profiles over time.

*Aligns with:* [DG-002b] · Registry data quality

---

## DG-011 — Inclusive Participation

**[DG-011]** The platform should welcome participants from every Arkansas community.

**[DG-011a]** Design decisions should strive to reduce barriers related to technology, geography, disability, or prior organizing experience.

*Aligns with:* [CP-001] · [CP-009] · [CP-001b]

---

## DG-012 — Human-Centered Technology

**[DG-012]** Technology should support people rather than replace human relationships.

The platform should encourage participants to:

- Meet
- Volunteer
- Attend events
- Build local teams
- Develop trust

**[DG-012a]** Digital interaction should strengthen real-world community.

*Aligns with:* [CP-003] · [NS-010] · [CT-Q1]

---

## DG-013 — Scalable Architecture

**[DG-013]** Every major design decision should assume future growth to:

- All Arkansas counties
- All educational institutions
- Additional partner organizations (if adopted)
- Increased participant volume
- New communication channels
- Expanded organizing capabilities

*Aligns with:* [CP-010] · [NS-Q4] · [CT-Q6]

---

## DG-014 — Measured Innovation

**[DG-014]** New features should be introduced deliberately.

Each significant capability should:

1. Be designed
2. Be documented
3. Be implemented
4. Be evaluated
5. Be improved based on participant feedback

**[DG-014a]** The platform should evolve through disciplined iteration rather than uncontrolled feature expansion.

*Aligns with:* [ED-001] · [CP-014]

---

## DG-015 — Mission Before Features

**[DG-015]** No feature should be added simply because it is technically possible.

Every proposed capability should answer:

- Does this strengthen relationships?
- Does this help local communities?
- Does this support the platform's mission?
- Does this preserve participant trust?
- Is this consistent with the Platform Constitution?

**[DG-015a]** If not, it should be redesigned, postponed, or rejected.

*Aligns with:* [NS-013] · [CT-001] · [CP-015 mission filter]

---

## BG-001 — Burt Implementation Guardrails

**[BG-001]** When implementing the platform, Burt should assume:

- The Constitution [PHASE-001.3] is authoritative
- These guardrails [PHASE-001.4] are mandatory
- New features should not weaken these principles without explicit approval
- Simplicity is preferred over unnecessary complexity
- Every implementation should leave room for future versions

**[BG-001a]** Conflict resolution order:

```
1. Platform Constitution [CP-*]
2. Design Guardrails [DG-*]
3. North Star [NS-*]
4. Feature request / convenience
```

If a feature conflicts with guardrails → **redesign** or **constitutional change approval**.

---

## ED-001 — Standing Engineering Doctrine

**[ED-001]** This doctrine applies to **every** future build step and implementation:

> **Design First. Build Second. Validate Third. Iterate Fourth.**

| Phase | Action | Owner |
|-------|--------|-------|
| 1. Design | Fully design and approve architecture | User + design docs |
| 2. Build | Burt implements from approved design only | Burt |
| 3. Validate | Test implementation against design + Constitution + Guardrails | User + Burt |
| 4. Iterate | Capture feedback → Version 2 planning | User |

**[ED-001a]** No implementation without an approved design step document.

**[ED-001b]** No feature ships without validation against [NS-013], [CT-001], and [DG-015].

**[ED-001c]** Feedback from Burt and users feeds Version 2 — not silent drift.

---

## Conflict Resolution Protocol

When a feature request conflicts with a guardrail:

| Option | When |
|--------|------|
| **Redesign** | Feature can achieve goal within guardrails |
| **Defer** | Feature valid but not V1 — schedule for later version |
| **Reject** | Feature violates mission — do not build |
| **Constitutional change** | User explicitly approves amending CP/DG document + BUILD-LOG + version bump |

Guardrails do not change silently. Constitutional changes are rare and documented.

---

## AC-004 — Acceptance Criteria

Step 1.4 is complete when:

- [x] **[AC-004a]** Legal and ethical boundaries are clearly defined. `[DG-001, DG-002, DG-003, DG-004]`
- [x] **[AC-004b]** Architectural guardrails support long-term maintainability. `[DG-008, DG-009, DG-013]`
- [x] **[AC-004c]** The platform's independent, nonpartisan nature is documented. `[DG-001, DG-003]`
- [x] **[AC-004d]** Privacy, scalability, and participant trust are foundational. `[DG-004, DG-013]`
- [x] **[AC-004e]** Burt has clear constraints for implementation. `[BG-001, ED-001]`

---

## Document Authority

| Field | Value |
|-------|-------|
| Document ID | PHASE-001.4 |
| Status | Canonical |
| Next Step | PHASE-001.5 — Organizing Model (or next in sequence) |

---

*ASYON Design Guardrails*  
*15 boundaries. Mandatory. Redesign or constitutional change — never silent drift.*
