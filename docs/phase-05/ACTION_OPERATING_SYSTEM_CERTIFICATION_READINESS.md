# Action Operating System Certification & Readiness

**Document ID:** PHASE-005.14  
**Artifact:** `ACTION_OPERATING_SYSTEM_CERTIFICATION_READINESS.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 5 — Action Operating System  
**Acronym:** AOS *(certification & readiness standard)*

> **Can this platform actually run a real movement?**

This is not simply a certification badge. This document defines the **operational readiness standard** for the entire platform — the finish line for Phase 5.

If the answer is yes, **Phase 5 is complete**.

**Requirement:** AOS-001 *(certification standard + Phase 5 closeout)* · **Governed by:** [Action Constitution ACN-001](ACTION_CONSTITUTION.md)

**Builds On:** All Phase 5 modules (5.1–5.13) · [Community OS Certification COS-001](../phase-04/COMMUNITY_OPERATING_SYSTEM_CERTIFICATION.md)

**Live spec:** `data/registry/action-operating-system-certification-readiness.json`

**Required reading for Burt.**

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| AOS-M01 | Purpose |
| AOS-M02 | Guiding principle |
| AOS-M03 | Philosophy |
| AOS-M04 | Required operational capabilities |
| AOS-M05 | Readiness levels |
| AOS-M06 | Operational readiness checklist |
| AOS-M07 | Platform commitments |
| AOS-M08 | Unified operational framework |
| AOS-M09 | Movement Readiness Dashboard |
| AOS-M10 | Phase 5 complete |
| AOS-M11 | V1 scope |
| AOS-BG | Burt implementation guidance |
| AC-061 | Step 5.14 acceptance criteria |

---

## AOS-M01 — Purpose

**[AOS-M01]** Defines the **minimum operational capabilities** required for the platform to successfully support real-world organizing, volunteer coordination, community projects, initiatives, and long-term community development.

**[AOS-M01a]** Every operational feature should contribute to helping communities move from **ideas to sustained impact** [ACN-M04 Civic Operating Loop].

**[AOS-M01b]** Answers the executive question:

> **Can this platform actually run a real movement?**

**[AOS-M01c]** Readiness is measured by **capability**, not by the number of features [AOS-M02].

---

## AOS-M02 — Guiding Principle

**[AOS-M02]**

> **A successful operating system doesn't simply organize work—it helps communities accomplish meaningful work together.**

**[AOS-M02a]** Certification encourages **operational maturity**, not feature checklists.

**[AOS-M02b]** The platform should become an **invisible partner** in accomplishing meaningful work [AOS-M03].

---

## AOS-M03 — Philosophy

**[AOS-M03]** The Action Operating System is complete when communities can confidently:

- Design missions · recruit participants · coordinate volunteers · plan experiences
- Execute projects · learn from outcomes · preserve knowledge · strengthen future communities

**[AOS-M03a]** End-to-end flow without leaving the platform [ACN-M26 MOR, action-constitution.json endToEndFlowAfterPhase5].

**[AOS-M03b]** Phase 5 transforms the platform from organizing tools into a **Community Operating System** that runs real work [OPIS-M01c].

**[AOS-M03c]** Readiness is **progressive** — communities and the statewide network grow through levels [AOS-M05], not binary pass/fail.

---

## AOS-M04 — Required Operational Capabilities

**[AOS-M04]** Every certified Action Operating System includes the following twelve capability domains:

### Mission Design [AOS-M04a] — MDS-001 · MPS-001

Mission Canvas · Mission Library · Mission Headquarters · mission templates · Mission Operating Records [ACN-M26]

### Execution [AOS-M04b] — EOS-001

Execution Operating System · work packages · tasks · milestones · dependencies · operational dashboard · Daily Operations Brief [EOS-M17]

### Volunteers [AOS-M04c] — VDS-001

Volunteer Development System · Volunteer Passport · skills matching · scheduling · QR check-in · recognition · growth pathway

### Experiences [AOS-M04d] — EEOS-001

Experience Headquarters · registration · check-in · agenda builder · live operations · Experience Playbooks · follow-up

### Initiatives [AOS-M04e] — IOS-001

Initiative Headquarters · multi-community coordination · shared resources · initiative timeline · regional collaboration · statewide initiatives · Initiative Command Center [IOS-M16]

### Decisions [AOS-M04f] — CDS-001

Proposal system · discussion · decision records · decision history · implementation tracking · Decision Graph [CDS-M16]

### Commitments [AOS-M04g] — CFS-001

Commitment Compass · shared ownership · support requests · progress tracking · healthy accountability · reflection

### Capacity [AOS-M04h] — CCS-001 · CCE-001

Capacity profiles · Capacity Exchange · Arkansas Capacity Map [CCS-M16] · resource requests · forecasting · logistics

### Impact [AOS-M04i] — CIIS-001

Mission Impact Reports · Impact Chains [CIIS-M16] · community dashboards · stories · long-term outcomes · community intelligence

### Storytelling [AOS-M04j] — CST-001

Arkansas Story Atlas [CST-M16] · story collection · media · recognition · community narratives · story preservation · consent workflows

### Learning [AOS-M04k] — LIS-001

Learning Dashboard · lessons learned · playbook updates · Mission Library [MDS-M20] · Improvement Graph [LIS-M16] · continuous improvement

### Operational Intelligence [AOS-M04l] — OPIS-001

Operational Intelligence System · Operations Center [OPIS-M17] · Operational Graph [OPIS-M16] · pattern recognition · explainable recommendations · operational awareness

---

## AOS-M05 — Readiness Levels

**[AOS-M05]** Every deployment evaluated against **six progressive readiness levels**:

| Level | Name | Criteria |
|-------|------|----------|
| **1** | **Functional** | Communities can organize basic missions [MDS-001, EOS-001] |
| **2** | **Coordinated** | Teams, volunteers, and projects operate together [VDS-001, TWG-001, CFS-001] |
| **3** | **Collaborative** | Multiple communities coordinate effectively [IOS-001, SCN-001, CCS-001] |
| **4** | **Intelligent** | Operational Intelligence provides timely, explainable recommendations [OPIS-001] |
| **5** | **Learning Organization** | Every completed mission improves future missions [LIS-001, CKLS-001, MDS-M20] |
| **6** | **Self-Improving Network** | Statewide ecosystem develops stronger leaders, communities, playbooks, knowledge, and collaboration |

**[AOS-M05a]** Level 6 reflects **maturity, not superiority** [COS certification level 6 parallel — service recognition not ranking].

**[AOS-M05b]** `getActionOSReadinessLevel(scope)` returns current level with evidence [AOS-BG].

---

## AOS-M06 — Operational Readiness Checklist

**[AOS-M06]** Before launch, confirm communities can:

- [x] Create and design missions [MDS-001]
- [x] Recruit and coordinate volunteers [VDS-001]
- [x] Schedule events and meetings [TSOS-001, EEOS-001]
- [x] Form teams and working groups [TWG-001]
- [x] Track commitments [CFS-001]
- [x] Coordinate resources and capacity [CCS-001, CCE-001]
- [x] Capture stories and reflections [CST-001, LIS-001]
- [x] Preserve knowledge [CKLS-001, CLS-001]
- [x] Measure impact [CIIS-001]
- [x] Learn from completed work [LIS-001]
- [x] Collaborate across communities [IOS-001, SCN-001]
- [x] Discover new opportunities [OEX-001, OIS-001, OPIS-001]
- [x] Receive explainable operational guidance [OPIS-001, ACN-M06]

**[AOS-M06a]** Checklist is **living** — reassessed as modules go live [COS-M07 parallel].

---

## AOS-M07 — Platform Commitments

**[AOS-M07]** The platform commits to providing:

- Reliable infrastructure · consistent workflows · transparent governance
- Knowledge preservation · operational continuity · participant-centered design
- Scalable architecture · long-term maintainability

**[AOS-M07a]** Extends [Community OS platform responsibilities COS-M08] into the **action layer**.

**[AOS-M07b]** Every commitment traceable to Phase 1 constitution [CONST, CP-004] and Phase 7 platform services roadmap.

---

## AOS-M08 — Unified Operational Framework

**[AOS-M08]** The Action Operating System is a **unified operational framework** — not independent modules bolted together.

**[AOS-M08a]** Shared contracts across modules:

- Every mission → MOR [ACN-M26]
- Every completion → reflection + impact + legacy [LIS-001, CIIS-001, CLS-001]
- Every recommendation → explainable + permission-scoped [OPIS-M10, OPIS-M11]
- Every community → same COS foundation [COS-001]

**[AOS-M08b]** Modular services with shared patterns — reuse across every operational feature [AOS-BG].

**[AOS-M08c]** Civic Operating Loop closes: Need → Mission → Planning → Execution → Reflection → Knowledge → Legacy [ACN-M07].

---

## AOS-M09 — Movement Readiness Dashboard

**[AOS-M09]** The **Movement Readiness Dashboard (MRD)** is the executive view that ties together everything built in Phases 3–5.

**[AOS-M09a]** Unlike Community Dashboard [CCC-001] or Operations Center [OPIS-M17], MRD asks:

> **If thousands of new participants joined tomorrow, are we ready?**

**[AOS-M09b]** Statewide readiness view across **four dimensions**:

### People Readiness [AOS-M09c]

New participant onboarding capacity · volunteer availability · mentor availability · leadership pipeline · communities needing organizers [PEL-001, VDS-001, PGL-001]

### Community Readiness [AOS-M09d]

Campus coverage · county coverage · active teams · Community Health summaries [CIS-001] · collaboration activity [SCN-001]

### Operational Readiness [AOS-M09e]

Active missions · upcoming experiences · capacity availability [CCS-001] · resource requests · Operational Intelligence alerts [OPIS-001]

### Learning Readiness [AOS-M09f]

Mission Library growth [MDS-M20] · Experience Playbooks available [EEOS-M17] · Community Brain maturity [CKLS-001] · Story Atlas expansion [CST-M16] · lessons adopted across communities [LIS-M16]

**[AOS-M09g]** Route: `/readiness` · orchestrator: `getMovementReadinessDashboard(scope, permissions)`.

**[AOS-M09h]** Complements [Arkansas Network Health Dashboard COS-M09] — COS asks *"Is each community fully built?"* · MRD asks *"Is the movement ready to scale?"*

**[AOS-M09i]** Does **not rank communities** — shows capability gaps and growth opportunities [CIS-M12 explainability].

---

## AOS-M10 — Phase 5 Complete

**[AOS-M10]** With Phase 5 complete, three major operating systems are designed:

### Phase 3 — Human Operating System [AOS-M10a]

How individuals join, grow, build relationships, and develop as leaders [PHQ-001, PEL-001, PGL-001, CJT-001, REL-001]

### Phase 4 — Community Operating System [AOS-M10b]

How campuses, counties, teams, and projects function as healthy, connected communities [COS-001, CCN-001, CCC-001]

### Phase 5 — Action Operating System [AOS-M10c]

How communities transform ideas into coordinated action, preserve what they learn, and continuously improve [ACN-001 through OPIS-001]

**[AOS-M10d]** Taken together: a scalable framework for organizing people, communities, and collaborative work — beginning with Arkansas colleges and counties, expandable to high schools, alumni networks, community organizations, and civic groups **without fundamental redesign** [COS-M10, CCN-M001 equal standing].

**[AOS-M10e]** Evaluation question remains [PEL-M13]:

> Does this strengthen relationships, deepen belonging, and help people grow into community builders?

---

## AOS-M11 — V1 Scope

**[AOS-M11]** V1 deliverables:

| Deliverable | Status |
|-------------|--------|
| Certification & readiness philosophy | ✅ Documented |
| Twelve operational capability domains | ✅ Defined |
| Six readiness levels | ✅ Established |
| Operational readiness checklist | ✅ Defined |
| Platform commitments | ✅ Articulated |
| Unified framework principles | ✅ Specified |
| Movement Readiness Dashboard architecture | ✅ Specified |
| Phase 5 closeout | ✅ Complete |
| Automated readiness scoring | Future |
| Full MRD live aggregation | v1.1 |

---

## AOS-BG — Burt Implementation Guidance

**[AOS-BG-a]** Implementation should:

- Treat the Action Operating System as a **unified operational framework** rather than independent modules [AOS-M08]
- Maintain **modular services with shared contracts** — MOR, permissions, explainability
- **Reuse common patterns** across every operational feature
- Connect every completed mission to **knowledge, impact, and legacy** systems
- Support **future expansion** without architectural redesign [CCN-M004]

**[AOS-BG-b]** Files:

```
src/lib/aos/assessActionOSReadiness.ts
src/lib/aos/getActionOSReadinessLevel.ts
src/lib/aos/getMovementReadinessDashboard.ts
src/components/admin/MovementReadinessDashboard.tsx
data/registry/action-operating-system-certification-readiness.json
```

**[AOS-BG-c]** Database: extend `DB-CERTIFICATION` or `DB-AOS` · tables: `readiness_assessments`, `readiness_snapshots`, `capability_evidence`.

---

## AC-061 — Acceptance Criteria

Step 5.14 is complete when:

- [x] **[AC-061a]** Action Operating System framework fully documented. `[AOS-M01, AOS-M03, AOS-M08]`
- [x] **[AC-061b]** Operational capabilities defined. `[AOS-M04]`
- [x] **[AC-061c]** Readiness levels established. `[AOS-M05]`
- [x] **[AC-061d]** Platform commitments articulated. `[AOS-M07]`
- [x] **[AC-061e]** Movement Readiness Dashboard specified. `[AOS-M09]`
- [x] **[AC-061f]** Burt has complete blueprint for operational layer. `[AOS-BG, action-operating-system-certification-readiness.json]`

---

**Phase 5 Complete.**

*Trace: Ideas designed → work executed → volunteers developed → experiences hosted → initiatives coordinated → decisions preserved → commitments honored → capacity shared → impact measured → stories told → lessons learned → intelligence advises → movement readiness confirmed → communities lead*
