# Phase 5 Master Sequence — Action Operating System

**Document ID:** PHASE-005  
**Status:** Canonical  
**Priority:** Critical

> **How does real work actually get done?**

Not the "Organizing Engine" — the **Action Operating System (AOS)** transforms ideas into completed community work.

---

## Architectural Context

Phases 1–4 answered:

| Phase | Question |
|-------|----------|
| 1 | Why do we exist? |
| 2 | Where do we organize? |
| 3 | Who organizes? |
| 4 | How do communities organize? |

Phase 5 answers: **How does real work actually get done?**

**5.1 answers:** **How do we work together?** — the [Action Constitution](ACTION_CONSTITUTION.md) is the **Constitution of Action**.

---

## Mission Operating Record (MOR) [ACN-M26]

Every mission auto-generates a **Mission Operating Record** — complete operational history, archived but never forgotten. Future organizers search past MORs. Combined with Community Brain, Legacy, Capability Graph, and Personal Digital Twins, every mission leaves knowledge that makes the next mission stronger.

---

## Operational Spine

```text
Ideas → Missions → Projects → Tasks → Action → Impact → Legacy
```

---

## Civic Operating Loop [ACN-M04]

Everything built in Phases 1–4 naturally forms a **continuous cycle**:

```text
People
        ↓
Relationships
        ↓
Communities
        ↓
Teams
        ↓
Missions
        ↓
Projects
        ↓
Tasks
        ↓
Events
        ↓
Impact
        ↓
Knowledge
        ↓
Legacy
        ↓
New People
```

The system **loops**. Every completed mission creates better playbooks, mentors, communities, leaders, stories, and opportunities for the next generation.

The platform doesn't just manage work — it **learns** and **compounds** over decades.

---

## Step Sequence

| Step | Module | Requirement | Signature |
|------|--------|-------------|-----------|
| 5.1 | [Action Constitution](ACTION_CONSTITUTION.md) | ACN-001 | Execution philosophy |
| 5.2 | [Mission Design System](MISSION_DESIGN_SYSTEM.md) | MDS-001 | Mission Canvas · Mission Library |
| 5.3 | [Execution Operating System](EXECUTION_OPERATING_SYSTEM.md) | EOS-001 | Daily Operations Brief · Work Packages |
| 5.4 | [Volunteer Development System](VOLUNTEER_DEVELOPMENT_SYSTEM.md) | VDS-001 | Volunteer Passport · journey |
| 5.5 | [Experience & Event OS](EXPERIENCE_EVENT_OPERATING_SYSTEM.md) | EEOS-001 | Experience Playbook · Experience HQ |
| 5.6 | [Initiative OS](INITIATIVE_OPERATING_SYSTEM.md) | IOS-001 | Initiative Command Center |
| 5.7 | [Collaborative Decision OS](COLLABORATIVE_DECISION_SYSTEM.md) | CDS-001 | Decision Graph |
| 5.8 | [Commitment & Follow-Through OS](COMMITMENT_FOLLOW_THROUGH_SYSTEM.md) | CFS-001 | Commitment Compass |
| 5.9 | [Capacity Coordination OS](CAPACITY_COORDINATION_SYSTEM.md) | CCS-001 | Arkansas Capacity Map |
| 5.10 | [Community Impact Intelligence](COMMUNITY_IMPACT_INTELLIGENCE_SYSTEM.md) | CIIS-001 | Impact Chain |
| 5.11 | [Community Storytelling](COMMUNITY_STORYTELLING_SYSTEM.md) | CST-001 | Arkansas Story Atlas |
| 5.12 | [Learning & Improvement OS](LEARNING_IMPROVEMENT_SYSTEM.md) | LIS-001 | Improvement Graph |
| 5.13 | [Operational Intelligence System](OPERATIONAL_INTELLIGENCE_SYSTEM.md) | OPIS-001 | Operational Graph · Operations Center |
| 5.14 | [Action OS Certification & Readiness](ACTION_OPERATING_SYSTEM_CERTIFICATION_READINESS.md) | AOS-001 | Movement Readiness Dashboard |

---

## 5.1 — Action Constitution

**Requirement focus:** ACN-001 · MPS-001 · COS-001 · CP-004

How work should happen:

- **Purpose before process** · **Service before status** · **People before paperwork**
- **Civic Operating Loop** — the platform learns and compounds
- **Operational spine** — Ideas through Legacy

*Live spec:* `action-constitution.json`

---

## 5.2 — Mission Design System

**Requirement focus:** MDS-001 · MPS-001 · CCE-001 · CKLS-001

Great missions are **designed**, not simply planned:

- **Mission Canvas** — 10 structured sections before any tasks exist
- **Design lifecycle** — Idea → Discovery → Design → Review → Planning → Execution → Legacy
- **Mission Library [MDS-M20]** — statewide catalog of proven missions; fork and adapt
- **Collaborative design** — co-authors, reviewers, mentors

Extends [Mission Canvas MPS-M15](../phase-04/MISSION_PROJECT_SYSTEM.md) into full design process.

*Live spec:* `mission-design-system.json`

---

## 5.3 — Execution Operating System

**Requirement focus:** EOS-001 · MDS-001 · MPS-001 · PCC-001 · CCC-001

Not a task manager — an **Execution System**:

- **Execution hierarchy** — Mission → Project → Milestone → Work Package → Task → Activity
- **Work Packages** — Communications, Volunteer, Logistics — not isolated task lists
- **Mission Dashboard** — mission command center
- **Daily Operations Brief [EOS-M17]** — personalized today's priorities; most-used execution screen
- **Three-brief stack** — Morning Brief (personal) · Community Pulse (community) · DOB (mission)

*Live spec:* `execution-operating-system.json`

**Note:** Event OS renamed **EEOS-001** [5.5] — specialized execution layer; avoids EOS acronym collision.

---

## 5.4 — Volunteer Development System

**Requirement focus:** VDS-001 · OEX-001 · CJT-001 · CRA-001 · PGL-001 · TSOS-001

Not volunteer management — **develop people through service**:

- **Volunteer journey** — Interested → First Experience → Mentor → Community Builder
- **Invitation not assignment** — invited into missions that matter
- **Volunteer Passport [VDS-M17]** — experiences not hour counts; section within Civic Passport
- **Skills matching** · scheduling · QR check-in · recognition · reflection

*Live spec:* `volunteer-development-system.json`

---

## 5.5 — Experience & Event Operating System

**Requirement focus:** EEOS-001 · MDS-001 · VDS-001 · TSOS-001 · CLS-001

Not an event manager — **experiences that build community**:

- **Experience lifecycle** — Idea → Mission Design → Live Experience → Legacy
- **Experience Headquarters** — operational center before, during, after
- **Check-in** — QR, walk-in; feeds Civic Passport, Volunteer Passport, MOR
- **Live Operations cockpit** — mobile-first for organizers in the field
- **Experience Playbook [EEOS-M17]** — proven templates; browse from other campuses

*Live spec:* `experience-event-operating-system.json`

---

## 5.6 — Initiative Operating System

**Requirement focus:** IOS-001 · SCN-001 · MDS-001 · CCC-001 · CIS-001

**Initiative** not **campaign** as architecture — any coordinated multi-community effort:

- **Initiative hierarchy** — Initiative → Mission → Project → Milestone → Task
- **Initiative Headquarters** — statewide coordination center
- **Voluntary participation** — communities retain local autonomy
- **Mission coordination** — independent missions, one shared movement
- **Initiative Command Center [IOS-M16]** — map, momentum, needs, stories — one screen
- **Core principle:** Coordinate statewide. Empower locally.

*Live spec:* `initiative-operating-system.json`

---

## 5.7 — Collaborative Decision System

**Requirement focus:** CDS-001 · CKLS-001 · CCN-001 · MDS-001 · EOS-001

**Organizational Decision System** — not a voting system:

- **Decision lifecycle** — Question → Discussion → Research → Proposal → Review → Decision → Implementation → Evaluation → Archive
- **Decision Record** — permanent record in Community Brain
- **Proposal system** — thoughtful proposals before action
- **Consensus support** — multiple governance styles, voting optional
- **Decision Graph [CDS-M16]** — how decisions influence missions, projects, initiatives over time
- **Platform graph stack** — Relationship · Trust · Growth · Conversation · Capability · **Decision**

*Live spec:* `collaborative-decision-system.json`

---

## 5.8 — Commitment & Follow-Through System

**Requirement focus:** CFS-001 · ACN-M14 · EOS-001 · CDS-001 · CAM-001

**Support, not punishment** — accountability without blame:

- **Commitment lifecycle** — Made → Accepted → Planned → In Progress → Needs Support → Completed → Celebrated → Knowledge
- **Commitment Profiles** — shared clarity on purpose, owner, dependencies, outcome
- **Support requests** — asking for help is responsible leadership
- **Smart reminders** — respectful, configurable, separate from enforcement [CAM-001]
- **Commitment Compass [CFS-M16]** — Today · Soon · Waiting · Support
- **Implements** constitutional healthy accountability [ACN-M14]

*Live spec:* `commitment-follow-through-system.json`

---

## 5.9 — Capacity Coordination System

**Requirement focus:** CCS-001 · CCE-001 · OEX-001 · SCN-001 · MDS-001 · EOS-001

**Capacity, not resources** — the logistics engine:

- **Capacity categories** — People · Skills · Facilities · Equipment · Transportation · Technology · Partnerships
- **Capacity Profiles** — availability, location, status, mission links
- **Capacity Requests + Matching** — statewide needs → available capacity
- **Capacity Planning** — before execution [MDS-M11]
- **Arkansas Capacity Map [CCS-M16]** — live statewide capacity picture
- **Logistics layer stack** — Brain → CCE → OEX → SCN → Capacity Map

*Live spec:* `capacity-coordination-system.json`

---

## 5.10 — Community Impact Intelligence System

**Requirement focus:** CIIS-001 · CIS-001 · CLS-001 · CKLS-001 · MDS-001 · ACN-M26

**Impact intelligence, not reporting** — *Did we make communities stronger?*

- **Outputs vs outcomes** — activities vs meaningful change
- **Impact framework** — People · Relationships · Communities · Knowledge · Leadership · Statewide Network
- **Mission Impact Report** — auto-generated, attached to MOR
- **Community Impact Dashboard** — growth, not vanity metrics
- **Impact Chain [CIIS-M16]** — how actions led to change over time
- **CIS vs CIIS** — health coaching vs outcome understanding

*Live spec:* `community-impact-intelligence-system.json`

---

## 5.11 — Community Storytelling System

**Requirement focus:** CST-001 · CLS-001 · CKLS-001 · CIIS-001 · CRA-001 · KDG-001

**Stories as operating system** — not marketing:

- **Story categories** — Participant · Mission · Community · Leadership · Partnership · Legacy
- **Story structure** — multimedia, quotes, connections to missions and playbooks
- **Collection + approval** — simple capture, consent before publish
- **Memory triad** — Brain (know) · Legacy (built) · **Story Atlas (became)**
- **Arkansas Story Atlas [CST-M16]** — interactive map filling with human stories

*Live spec:* `community-storytelling-system.json`

---

## 5.12 — Learning & Improvement System

**Requirement focus:** LIS-001 · CKLS-001 · CLS-001 · MDS-001 · CIIS-001 · CST-001

**Learning, not military AAR** — every mission makes the next better:

- **Learning lifecycle** — Complete → Reflect → Lessons → Playbooks → Recommendations → Improved
- **Reflection framework** — constructive, collaborative
- **Lessons + playbook updates** — structured, searchable, versioned
- **Community Learning Dashboard** — visible knowledge growth
- **Improvement Graph [LIS-M16]** — how wisdom spreads across Arkansas
- **Learning architecture stack** — completes Brain · Library · Playbooks · Decision · Impact · Legacy · Story · **Improvement**

*Live spec:* `learning-improvement-system.json`

---

## 5.13 — Operational Intelligence System

**Not the "AI phase"** — AI is already woven throughout. This step defines **how the platform thinks operationally**:

- **Guiding principle** — Operational intelligence should make communities more capable, not more dependent
- **People lead. The platform assists.** — guidance, not direction
- **Operational awareness** — mission progress, volunteer availability, community health, deadlines, capacity
- **Opportunity + risk + pattern detection** — explainable, permission-scoped, communities free to ignore
- **Executive briefs** — Participant · Team · Community · Initiative · Statewide
- **Operational Graph [OPIS-M16]** — connects Relationship, Trust, Growth, Conversation, Decision, Capability, Improvement, Impact Chain
- **Operations Center [OPIS-M17]** — platform-wide situational awareness cockpit; local communities lead

**Requirement:** OPIS-001 · **Supersedes:** AIN-001 · **Distinct from:** OIS-001 (Phase 2 Outreach Intelligence)

*Live spec:* `operational-intelligence-system.json`

---

## 5.14 — Action Operating System Certification & Readiness

**Can this platform actually run a real movement?** If yes, Phase 5 is complete.

- **Guiding principle** — A successful operating system helps communities accomplish meaningful work together
- **Twelve capability domains** — Mission Design through Operational Intelligence (5.1–5.13)
- **Six readiness levels** — Functional → Self-Improving Network
- **Operational readiness checklist** — thirteen launch confirmations
- **Platform commitments** — infrastructure, workflows, governance, continuity
- **Movement Readiness Dashboard [AOS-M09]** — People · Community · Operational · Learning readiness
- **Phase 5 complete** — Human OS · Community OS · Action OS together

**Requirement:** AOS-001 · **Phase 5 closeout**

*Live spec:* `action-operating-system-certification-readiness.json`

---

## What Phase 5 Builds

After Phase 5, a student can — **without leaving the platform**:

Create a project · recruit volunteers · reserve meeting space · schedule meetings · coordinate teams · run the event · QR check-in · capture photos · write reflections · measure impact · preserve lessons · generate appreciation · archive into Community Legacy.

---

## Evaluation Question [PEL-M13]

> Does this strengthen relationships, deepen belonging, and help people grow into community builders?

---

*Prior phase complete:* [Phase 4 Build Bible](../phase-04/PHASE_4_COMMUNITY_OS_BUILD_BIBLE.md)
