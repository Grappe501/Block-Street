# Phase 4 — Community Operating System

## Master Build Sequence

**Document ID:** PHASE-004.0  
**Artifact:** `PHASE_4_MASTER_SEQUENCE.md`  
**Status:** Canonical  
**Priority:** Critical

> **Question answered:** *Where do we work together?*

Phase 3 answered **Who am I?** Phase 4 is where the platform changes from a collection of individuals into a **network of living communities**.

Every campus, county, committee, and project functions like a small **operating system** — with its own people, communications, calendar, projects, leadership, and history.

**Constitution for communities:** [Community Constitution](COMMUNITY_CONSTITUTION.md)

**Live index:** `data/community/community-operating-system.json`

**Builds On:** [Phase 3 People System](../phase-03/PHASE_3_MASTER_SEQUENCE.md) · [Community Identity](../phase-02/COMMUNITY_IDENTITY_PERSONALIZATION_SYSTEM.md) · [Organizing Model](../build-steps/PHASE-001.5-ORGANIZING-MODEL.md) · [Core Principles CP-004](../build-steps/PHASE-001.3-CORE-PRINCIPLES.md)

---

## Phase Shift

| Phase | Question |
|-------|----------|
| **3 — People** | Who am I? |
| **4 — Community OS** | Where do we work together? |

The platform becomes a **network of interconnected community operating systems** — not a folder of hub pages.

---

## What Phase 4 Builds

When complete:

- Every **campus** becomes a living organizing space
- Every **county** becomes a living organizing space
- Every **committee** becomes a living organizing space
- Every **project** becomes a living organizing space
- **Everything connects** — cross-community collaboration, shared marketplace, institutional memory

---

## Step Sequence

| Step | Document | Focus | Status |
|------|----------|-------|--------|
| 4.1 | [Community Constitution](COMMUNITY_CONSTITUTION.md) | Inherited framework + Community Charters | ✅ |
| 4.2 | [Community Growth & Sustainability](COMMUNITY_GROWTH_SUSTAINABILITY.md) | Living organisms — Seed to Renewal | ✅ |
| 4.3 | [Community Command Center](COMMUNITY_COMMAND_CENTER.md) | Operational HQ — Pulse + widgets | ✅ |
| 4.4 | [Team & Working Group System](TEAM_WORKING_GROUP_SYSTEM.md) | Teams that solve problems | ✅ |
| 4.5 | [Mission & Project System](MISSION_PROJECT_SYSTEM.md) | Missions inspire; projects organize | ✅ |
| 4.6 | [Time & Scheduling OS](TIME_SCHEDULING_OPERATING_SYSTEM.md) | One Master Timeline · Rhythm Engine | ✅ |
| 4.7 | [Community Communication Network](COMMUNITY_COMMUNICATION_NETWORK.md) | Conversation Graph · not just messaging | ✅ |
| 4.8 | [Community Knowledge & Learning](COMMUNITY_KNOWLEDGE_LEARNING_SYSTEM.md) | Community Brain · living knowledge | ✅ |
| 4.9 | [Community Capability Exchange](COMMUNITY_CAPABILITY_EXCHANGE.md) | Capability Graph · statewide network | ✅ |
| 4.10 | [Community Intelligence System](COMMUNITY_INTELLIGENCE_SYSTEM.md) | Community Coach · intelligence not analytics | ✅ |
| 4.11 | [Statewide Collaboration Network](STATEWIDE_COLLABORATION_NETWORK.md) | Arkansas Collaboration Map · connective tissue | ✅ |
| 4.12 | [Opportunity Exchange](OPPORTUNITY_EXCHANGE.md) | Community Needs Index · mutual aid | ✅ |
| 4.13 | [Community Legacy System](COMMUNITY_LEGACY_SYSTEM.md) | Arkansas Living History · legacy not memory | ✅ |
| 4.14 | [Community OS Certification](COMMUNITY_OPERATING_SYSTEM_CERTIFICATION.md) | Network Health Dashboard · certification | ✅ |

---

## 4.1 — Community Constitution

**Requirement focus:** CCN-001 · COS-001 · CP-004 · CID-001

**Movement infrastructure** — inherited constitutional framework for every community:

- **Constitutional hierarchy** — Platform → Community Constitution → Identity → Activity → Legacy
- **Community Charters [CCN-M17]** — per-community voice on inherited framework
- **Equal standing** — same capabilities; differs by participation not importance
- **Rights, responsibilities, autonomy, continuity**

*Live spec:* `community-constitution.json` · **Required reading for Burt**

---

## 4.2 — Community Growth & Sustainability Framework

**Requirement focus:** CGS-001 · STS-001 · CCN-001

**Communities as living organisms** — thrive for decades, not just launch:

- **Seven stages** — Seed · Sprout · Growing · Established · Thriving · Legacy · Renewal
- **Community Health Check [CGS-M12]** — reflection tool, partner not supervisor
- **Renewal is natural** — not failure; history preserved
- **Leadership succession + institutional memory** — never depend on one person

*Live spec:* `community-growth-sustainability.json` · *Extends:* [STS-001] status timeline

---

## 4.3 — Community Command Center

**Requirement focus:** CCC-001 · PCC-001 · CCN-001 · CGS-001 · CID-001

**Operational headquarters** — may become the most visited community page after Personal Command Center:

- **Community Pulse [CCC-M20]** — opening summary; community equivalent of Morning Brief
- **12 modular widgets** — Mission · Opportunity · Calendar · Feed · People · Projects · Committees · Health · Resources · Recognition · Story
- **Six visit questions** — Who are we? What changed? What needs attention? How can I help? What opportunities? Where going?
- **Familiar yet unique** — same patterns across UCA, Benton County, committees, projects; Community DNA per community
- **Mobile-first** — Pulse and Opportunity above fold; thumb-friendly Quick Actions

*Live spec:* `community-command-center.json` · *Routes:* `/schools/[slug]` · `/county/[slug]`

---

## 4.4 — Team & Working Group System

**Requirement focus:** TWG-001 · CCC-001 · MPS-001 · CGS-001 · STS-001

**Architectural shift** — built around teams that solve problems, not rigid organizations:

- **14+ team types** — Standing Committee · Working Group · Task Force · Micro Team · and more
- **Micro Teams [TWG-M16]** — quick to create, temporary by default, evolve into permanent teams
- **Team lifecycle** — Planning → Recruiting → Active → Completing Work → Archived → Reactivated
- **Team Headquarters** — CCC-consistent workspace per team
- **Committees are a team type** — not a separate system

*Live spec:* `team-working-group-system.json`

---

## 4.5 — Mission & Project System

**Requirement focus:** MPS-001 · TWG-001 · CCC-001 · CGS-001 · REL-001

**Philosophical shift** — projects as missions, not task lists:

- **Mission inspires · Project organizes · Tasks execute** — hierarchy preserved in every workflow
- **Mission Canvas [MPS-M15]** — signature planning tool before work begins; templates for future missions
- **Project lifecycle** — Idea → Proposal → Active → Celebrated → Archived (history preserved)
- **Mission Headquarters** — CCC-consistent workspace at `/mission/[slug]`
- **Reflection & impact** — lessons learned and community outcomes required before archive

*Live spec:* `mission-project-system.json`

---

## 4.6 — Time & Scheduling Operating System

**Requirement focus:** TSOS-001 · REL-001 · CAM-001 · PCC-001 · CCC-001

**Foundational engine** — not a calendar module:

- **Master Timeline** — single source of truth; all views are filtered projections
- **One timeline, personalized views** — platform knows everything; participants see what's relevant
- **Relationship-aware scheduling** — no manual calendar subscriptions [REL-001]
- **Rhythm Engine [TSOS-M16]** — learns community patterns; preserves habits across leadership changes
- **Integrates everywhere** — Morning Brief · Community Pulse · PHQ · CCC · Mission HQ

*Live spec:* `time-scheduling-operating-system.json`

---

## 4.7 — Community Communication Network

**Requirement focus:** CCNET-001 · CAM-001 · REL-001 · TWG-001 · MPS-001

**Major platform engine** — communication network, not messaging module:

- **Six communication types** — Direct · Community · Announcements · Threads · Broadcasts · Stories
- **Conversation Graph [CCNET-M13]** — what happened because people talked, not just what was said
- **Knowledge preservation** — discussions promoted to institutional memory [4.8]
- **CAM integration** — CCNET produces content; CAM governs delivery [CAM-001]
- **CCNET-001** distinct from **CCN-001** Community Constitution

*Live spec:* `community-communication-network.json`

---

## 4.8 — Community Knowledge & Learning System

**Requirement focus:** CKLS-001 · KDG-001 · CCNET-001 · MPS-001 · CGS-001 · PDT-001

**Knowledge as living asset** — not file storage:

- **Community Brain [CKLS-M15]** — organized memory per community; PDT parallel for communities
- **Playbooks · Decision Library · Lessons Learned** — experience into repeatable success
- **Community Wiki** — living, evolving knowledge
- **Learning paths** — grow from community experience toward Civic Academy
- **KDG-001 governs · CKLS-001 implements** — provenance and structured content

*Live spec:* `community-knowledge-learning-system.json`

---

## 4.9 — Community Capability Exchange

**Requirement focus:** CCE-001 · CKLS-001 · KDG-001 · PDT-001 · OBE-001 · REL-001

**Capabilities not files** — marketplace for what communities have and need:

- **Seven capability categories** — Documents · Templates · Media · Equipment · Spaces · Skills · Services
- **Capability Graph [CCE-M13]** — created → used by → improved by → recommended to
- **Share · Request · Discover · Recommend** — statewide capability network
- **Complements CKLS** (knowledge) and **OEX-001** (community needs matching)

*Live spec:* `community-capability-exchange.json`

---

## 4.10 — Community Intelligence System

**Requirement focus:** CIS-001 · CGS-001 · CCC-001 · CKLS-001 · CCE-001 · PEL-001

**Intelligence not analytics** — decision-support for every community:

- **Six intelligence categories** — Health · Growth · Opportunities · Relationships · Leadership · Knowledge
- **Community Coach [CIS-M14]** — observes, explains, suggests; never decides
- **Health Report + Pulse enrichment** — coach narrative, not spreadsheet dashboards
- **Explainability required** — every insight answers why, what supports it, what action might help
- **Distinct from ANL-001** — Phase 6 statewide analytics layer

*Live spec:* `community-intelligence-system.json`

---

## 4.11 — Statewide Collaboration Network

**Requirement focus:** SCN-001 · REL-001 · ADT-001 · CCN-001 · CIS-001 · CCE-001

**Connective tissue** — one statewide network, not 75 isolated counties:

- **Six collaboration levels** — Campus ↔ Campus · County ↔ County · Campus ↔ County · Team ↔ Team · Project ↔ Project · Statewide
- **Arkansas Collaboration Map [SCN-M14]** — live visualization of relationships across Arkansas
- **Collaboration spaces** — shared workspaces distinct from community Command Centers
- **Community independence protected** — voluntary, mutually beneficial, never centralization

*Live spec:* `statewide-collaboration-network.json`

---

## 4.12 — Opportunity Exchange

**Requirement focus:** OEX-001 · OBE-001 · CCE-001 · SCN-001 · MPS-001 · PDT-001

**Living ecosystem** — constantly surfaces ways to help and be helped:

- **Seven opportunity categories** — Volunteer · Leadership · Learning · Collaboration · Mentorship · Resource Requests · Mission
- **Community Needs Index [OEX-M13]** — continuously compares needs with available capabilities
- **Mutual aid network** — not a job board or commercial marketplace
- **Three-layer stack** — OIS community signals · OEX statewide matching · OBE participant personalization

*Live spec:* `opportunity-exchange.json`

---

## 4.13 — Community Legacy System

**Requirement focus:** CLS-001 · CJT-001 · CCN-001 · CGS-001 · CKLS-001 · ADT-001

**Legacy not memory** — carries the past into the future:

- **Nine legacy categories** — Story · Leadership · Missions · Annual Timeline · Traditions · Scrapbook · Oral History · Knowledge · Impact
- **Arkansas Living History [CLS-M10]** — interactive statewide tapestry of youth organizing
- **Permanent community timeline** — append-only, survives leadership transitions
- **Alumni + Anniversary Engine** — belonging across generations

*Live spec:* `community-legacy-system.json`

---

## 4.14 — Community Operating System Certification

**Requirement focus:** COS-001 · all Phase 4 modules

**Finish line for every community** — not a closeout checklist:

- **Ten required components** — Identity · People · Organizing · Time · Communication · Knowledge · Capabilities · Intelligence · Collaboration · Legacy
- **Six certification levels** — Registered → Model Community (service recognition, not superiority)
- **Arkansas Network Health Dashboard [COS-M09]** — executive view of the movement, not community rankings
- **Readiness checklist + continuous improvement** — certification evolves with communities

*Live spec:* `community-operating-system-certification.json` · *Build Bible:* [PHASE_4_COMMUNITY_OS_BUILD_BIBLE.md](PHASE_4_COMMUNITY_OS_BUILD_BIBLE.md)

---

## Phase 4 Complete

**Dual operating systems designed:**

| Phase | Question | System |
|-------|----------|--------|
| 3 | Who am I? | Human OS |
| 4 | Where do we work together? | Community OS |

→ **Next:** Phase 5 — Action Operating System

---

## Evaluation Question [PEL-M13]

Every Phase 4 feature evaluated against:

> **Does this strengthen relationships, deepen belonging, and help people grow into community builders?**

---

*Prior phase:* [People & Relationship System](../phase-03/PHASE_3_MASTER_SEQUENCE.md)
