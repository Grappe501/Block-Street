# Mission Design System

**Document ID:** PHASE-005.2  
**Artifact:** `MISSION_DESIGN_SYSTEM.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 5 — Action Operating System  
**Acronym:** MDS

> **A well-designed mission creates clarity before action.**

Most projects fail **before they ever start** — not because people don't care, but because work begins before everyone understands why, who benefits, and what success looks like. The Mission Design System solves this.

Great missions are **designed**, not simply planned.

**Requirement:** MDS-001 · **Extends:** [Mission & Project System MPS-001](../phase-04/MISSION_PROJECT_SYSTEM.md) · **Governed by:** [Action Constitution ACN-001](ACTION_CONSTITUTION.md)

**Builds On:** [Mission Canvas MPS-M15](../phase-04/MISSION_PROJECT_SYSTEM.md) · [Community Capability Exchange CCE-001](../phase-04/COMMUNITY_CAPABILITY_EXCHANGE.md) · [Community Knowledge & Learning CKLS-001](../phase-04/COMMUNITY_KNOWLEDGE_LEARNING_SYSTEM.md) · [Mission Operating Record ACN-M26](ACTION_CONSTITUTION.md)

**Live spec:** `data/registry/mission-design-system.json`

**Required reading for Burt.**

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| MDS-M01 | Purpose |
| MDS-M02 | Guiding principle |
| MDS-M03 | Mission philosophy |
| MDS-M04 | Mission lifecycle |
| MDS-M05 | Mission Canvas — Section 1 Mission Statement |
| MDS-M06 | Mission Canvas — Section 2 Community Need |
| MDS-M07 | Mission Canvas — Section 3 Desired Impact |
| MDS-M08 | Mission Canvas — Section 4 Participants |
| MDS-M09 | Mission Canvas — Section 5 Communities Involved |
| MDS-M10 | Mission Canvas — Section 6 Skills Needed |
| MDS-M11 | Mission Canvas — Section 7 Resources Needed |
| MDS-M12 | Mission Canvas — Section 8 Risks |
| MDS-M13 | Mission Canvas — Section 9 Success Indicators |
| MDS-M14 | Mission Canvas — Section 10 Knowledge Capture Plan |
| MDS-M15 | Mission Canvas architecture |
| MDS-M16 | Mission templates |
| MDS-M17 | Mission relationships |
| MDS-M18 | Collaborative design |
| MDS-M19 | Future AI assistance |
| MDS-M20 | Mission Library |
| MDS-M21 | MPS-001 relationship |
| MDS-M22 | Platform integrations |
| MDS-M23 | V1 scope |
| MDS-BG | Burt implementation guidance |
| AC-049 | Step 5.2 acceptance criteria |

---

## MDS-M01 — Purpose

**[MDS-M01]** The **Mission Design System** provides a structured framework for transforming **ideas into well-defined, community-centered missions**.

**[MDS-M01a]** Rather than immediately creating tasks, communities first clarify **purpose, impact, participants, resources, risks, and success**.

**[MDS-M01b]** Every mission begins with **intentional design** — the Design stage is the foundation for everything that follows [MDS-M04].

**[MDS-M01c]** Implements Phase 4 Mission Canvas [MPS-M15] as a **full structured design process** under Action Constitution [ACN-001].

---

## MDS-M02 — Guiding Principle

**[MDS-M02]**

> **A well-designed mission creates clarity before action.**

**[MDS-M02a]** The platform should encourage participants to **think before they build** [ACN-M05 purpose before process].

**[MDS-M02b]** Clarity before action prevents the most common failure mode: **working before shared understanding**.

---

## MDS-M03 — Mission Philosophy

**[MDS-M03]** Every mission exists to **solve a real problem or create a meaningful opportunity**.

**[MDS-M03a]** The software should continually reinforce **purpose over process**.

**[MDS-M03b]** Participants should always understand:

| Question | Canvas section |
|----------|----------------|
| Why this mission exists | MDS-M05 Mission Statement |
| Who benefits | MDS-M07 Desired Impact |
| Why it matters now | MDS-M06 Community Need |

**[MDS-M03c]** Aligns with Action Constitution mission questions [ACN-M05a] — design answers them **before execution begins**.

---

## MDS-M04 — Mission Lifecycle

**[MDS-M04]** Every mission progresses through the following stages:

```text
Idea
        ↓
Discovery
        ↓
Mission Design
        ↓
Review
        ↓
Approval (if applicable)
        ↓
Planning
        ↓
Execution
        ↓
Reflection
        ↓
Legacy
```

**[MDS-M04a]** The **Design stage** is the foundation for everything that follows — no task creation until Design is substantially complete [ACN-M18 purpose before process].

**[MDS-M04b]** Extends MPS-001 project lifecycle [MPS-M05] with explicit **Discovery** and **Mission Design** stages before Planning.

**[MDS-M04c]** **Idea → Discovery** explores the problem; **Discovery → Mission Design** completes the Canvas; **Design → Review** validates with community; **Review → Planning** begins operational work [5.3 EOS-001].

**[MDS-M04d]** **Reflection → Legacy** feeds Mission Operating Record [ACN-M26] and Mission Library [MDS-M20].

---

## MDS-M15 — Mission Canvas Architecture

**[MDS-M15]** **Signature feature.** Every mission begins with a **Mission Canvas** — the blueprint for execution.

**[MDS-M15a]** Extends [MPS-M15](../phase-04/MISSION_PROJECT_SYSTEM.md) from nine questions to **ten structured sections** with typed fields, validation, and versioning.

**[MDS-M15b]** Canvas is a **structured object** — separate from mission execution records [MDS-BG].

**[MDS-M15c]** Orchestrator: `createMissionCanvas(missionId)` · `updateMissionCanvas(missionId, section, payload)` · `submitMissionCanvasForReview(missionId)`.

**[MDS-M15d]** Every version preserved append-only — feeds MOR [ACN-M26] and Mission Library [MDS-M20].

**[MDS-M15e]** Database: `DB-MISSION-CANVAS` · table: `mission_canvases`

---

## MDS-M05 — Mission Canvas Section 1: Mission Statement

**[MDS-M05]** One concise sentence — the mission should be **easy to explain**.

**[MDS-M05a]** Examples:

- "Welcome every new student to campus."
- "Organize a county-wide food drive."
- "Increase participation in community service."

**[MDS-M05b]** Required field — visible throughout Mission HQ [MPS-M06] and MOR [ACN-M26].

---

## MDS-M06 — Mission Canvas Section 2: Community Need

**[MDS-M06]** What need is being addressed?

**[MDS-M06a]** Examples: student isolation · food insecurity · community beautification · leadership development · volunteer recruitment · community awareness.

**[MDS-M06b]** Connects to Opportunity Exchange [OEX-001] — missions may originate from surfaced community needs.

---

## MDS-M07 — Mission Canvas Section 3: Desired Impact

**[MDS-M07]** What changes if the mission succeeds?

**[MDS-M07a]** Examples: more students connected · families served · cleaner neighborhoods · new volunteers trained · stronger campus relationships.

**[MDS-M07b]** Impact focuses on **community outcomes** — not activity volume [ACN-M06 service before recognition].

**[MDS-M07c]** Feeds Community Impact Intelligence [5.10 CIIS-001] success criteria at design time.

---

## MDS-M08 — Mission Canvas Section 4: Participants

**[MDS-M08]** Who should participate?

**[MDS-M08a]** Examples: students · community members · volunteers · mentors · campus organizations · partner communities.

**[MDS-M08b]** Participation expectations should be **clear** — feeds Volunteer Development [5.4 VDS-001].

---

## MDS-M09 — Mission Canvas Section 5: Communities Involved

**[MDS-M09]** Which communities participate?

**[MDS-M09a]** Scope levels:

| Level | Example |
|-------|---------|
| Campus | Single institution |
| County | County-wide initiative |
| Committee | Working group scope |
| Project Team | Micro team |
| Regional Collaboration | [SCN-001] |
| Statewide Initiative | Arkansas-wide |

**[MDS-M09b]** Links to community registry [REG-001, INST-001] and collaboration network [SCN-001].

---

## MDS-M10 — Mission Canvas Section 6: Skills Needed

**[MDS-M10]** What skills does this mission require?

**[MDS-M10a]** Examples: leadership · photography · technology · teaching · communications · transportation · research · facilitation.

**[MDS-M10b]** Connects to **Capability Exchange** [CCE-001] — design surfaces needed capabilities before recruitment.

**[MDS-M10c]** Feeds volunteer matching [VDS-001] and Morning Brief opportunity surfacing [OBE-001].

---

## MDS-M11 — Mission Canvas Section 7: Resources Needed

**[MDS-M11]** What resources are required?

**[MDS-M11a]** Categories: meeting space · equipment · training · budget (if applicable) · transportation · food · technology · graphics.

**[MDS-M11b]** Connects directly to **Community Capability Exchange** [CCE-001] and **Capacity Coordination** [5.9 CCS-001].

**[MDS-M11c]** Design-time resource identification prevents mid-mission scrambling.

---

## MDS-M12 — Mission Canvas Section 8: Risks

**[MDS-M12]** What could go wrong?

**[MDS-M12a]** Examples: volunteer shortages · weather · scheduling conflicts · facility availability · communication gaps · leadership transitions.

**[MDS-M12b]** Risk planning encourages **resilience** — not pessimism [ACN-M15 adaptability].

**[MDS-M12c]** Feeds Operational Intelligence risk highlighting [5.13 OPIS-001] — advisory only.

---

## MDS-M13 — Mission Canvas Section 9: Success Indicators

**[MDS-M13]** How will we know the mission succeeded?

**[MDS-M13a]** Examples: participants engaged · volunteer retention · community feedback · projects completed · relationships formed · people served.

**[MDS-M13b]** Success emphasizes **outcomes rather than activity** [ACN-M06, CIIS-001].

**[MDS-M13c]** Defined at design time — measured at reflection [LIS-001].

---

## MDS-M14 — Mission Canvas Section 10: Knowledge Capture Plan

**[MDS-M14]** Every mission should answer: **What should future organizers learn from this effort?**

**[MDS-M14a]** Knowledge capture is **planned before execution begins** — not an afterthought.

**[MDS-M14b]** Feeds Learning & Improvement [5.12 LIS-001], Community Brain [CKLS-001], and Mission Library [MDS-M20].

**[MDS-M14c]** Aligns with Action Constitution preservation [ACN-M17] and MOR lessons learned section [ACN-M26].

---

## MDS-M16 — Mission Templates

**[MDS-M16]** Communities may **reuse successful Mission Canvases**.

**[MDS-M16a]** Example templates:

| Template | Category |
|----------|----------|
| Campus Welcome Week | Student success |
| Food Drive | Community service |
| Leadership Retreat | Leadership development |
| Community Cleanup | Environmental |
| Blood Drive | Community service |
| Volunteer Fair | Volunteer outreach |

**[MDS-M16b]** Proven missions **spread across Arkansas** — start from template, adapt to local culture [MDS-M20 Mission Library].

**[MDS-M16c]** Orchestrator: `createMissionFromTemplate(templateId, communityId)` — copies canvas structure, requires local customization before approval.

**[MDS-M16d]** Completed missions may **publish** canvas as new templates [MDS-M20].

---

## MDS-M17 — Mission Relationships

**[MDS-M17]** Every mission connects to:

| Entity | Requirement |
|--------|-------------|
| Communities | CCN-001 · REG-001 |
| Teams | TWG-001 |
| Participants | PHQ-001 · NET-001 |
| Projects | MPS-001 |
| Timeline | TSOS-001 |
| Capabilities | CCE-001 |
| Knowledge | CKLS-001 |
| Legacy | CLS-001 |

**[MDS-M17a]** The platform **understands these relationships automatically** — graph edges from mission node [REL-001].

**[MDS-M17b]** Mission Canvas design captures relationship intent; execution modules populate edges.

---

## MDS-M18 — Collaborative Design

**[MDS-M18]** Mission design should support **multiple contributors**.

**[MDS-M18a]** Roles:

| Role | Permission |
|------|------------|
| Co-author | Edit canvas sections |
| Reviewer | Comment, approve sections |
| Mentor | Advisory comments [PGL-001] |
| Subject matter expert | Section-specific guidance |

**[MDS-M18b]** Communities **design missions together** — not single-author task dumps [ACN-M11 collaboration default].

**[MDS-M18c]** Version history preserves who contributed what — append-only audit trail.

---

## MDS-M19 — Future AI Assistance

**[MDS-M19]** Future AI may assist by:

- Suggesting similar missions [MDS-M20]
- Recommending playbooks [CKLS-001]
- Identifying needed skills [CCE-001]
- Highlighting potential risks [MDS-M12]
- Finding reusable templates [MDS-M16]

**[MDS-M19a]** AI **helps design better missions** but **never replaces community judgment** [ACN-M19 advise don't decide, OPIS-001 advisory only].

**[MDS-M19b]** All AI suggestions **explainable** — show source mission, playbook, or capability match.

---

## MDS-M20 — Mission Library

**[MDS-M20]** **Mission Library** — signature architectural concept of the Mission Design System.

**[MDS-M20a]** Every successful mission **automatically becomes eligible** for the statewide **Mission Library** — a searchable catalog of proven missions.

**[MDS-M20b]** Browse filters:

| Filter | Examples |
|--------|----------|
| Community type | Campus · county · statewide |
| Mission category | Service · leadership · outreach · education |
| Time of year | Fall welcome · spring cleanup · election season |
| Estimated volunteer size | Small · medium · large |
| Skills required | From canvas Section 6 |
| Resources required | From canvas Section 7 |
| Community impact | From completed MOR |
| Difficulty level | Beginner · intermediate · advanced |
| Average completion time | From historical MORs |

**[MDS-M20c]** Each library entry includes:

- Original Mission Canvas
- Mission Operating Record [ACN-M26]
- Photos and media [CST-001]
- Lessons learned [LIS-001]
- Playbooks [CKLS-001]
- Templates [MDS-M16]
- Community reflections
- Suggested improvements from later communities

**[MDS-M20d]** Instead of every campus inventing Welcome Week or a food drive, organizers **start with a proven mission and adapt** to local culture.

**[MDS-M20e]** Every completed mission **enriches the Mission Library** — continuously improving collection of community knowledge [Civic Operating Loop ACN-M04].

**[MDS-M20f]** Orchestrators: `publishToMissionLibrary(missionId)` · `searchMissionLibrary(filters)` · `forkMissionFromLibrary(libraryEntryId, communityId)`.

**[MDS-M20g]** Database: `DB-MISSION-LIBRARY` · table: `mission_library_entries`

**[MDS-M20h]** Integrates with Community Brain [CKLS-001] — library is the **mission-facing discovery layer**; Brain is the **knowledge layer**.

---

## MDS-M21 — MPS-001 Relationship

**[MDS-M21]** Phase 4 [MPS-001](../phase-04/MISSION_PROJECT_SYSTEM.md) established mission-first philosophy and Mission Canvas concept [MPS-M15].

**[MDS-M21a]** Phase 5.2 **implements** the canvas as structured design process — MDS does not replace MPS, it **operationalizes** it.

| MPS-001 (Phase 4) | MDS-001 (Phase 5.2) |
|-------------------|---------------------|
| Mission philosophy | Mission design philosophy |
| Canvas concept (9 questions) | Canvas structure (10 sections) |
| Mission HQ shell | Design workflow before HQ execution |
| Lifecycle stages | Full design lifecycle with Discovery |

**[MDS-M21b]** `createMissionCanvas` orchestrator defined in MPS-M15 — MDS specifies **full payload schema**.

---

## MDS-M22 — Platform Integrations

**[MDS-M22]** Mission Design System integrates:

| System | Integration |
|--------|-------------|
| Action Constitution [ACN-001] | Purpose before process; design before tasks |
| MPS-001 | Mission entity, HQ, lifecycle |
| CCE-001 | Skills and resources from canvas Sections 6–7 |
| CKLS-001 | Playbooks, templates, knowledge |
| OEX-001 | Needs may spawn mission ideas |
| SCN-001 | Multi-community missions |
| ACN-M26 MOR | Canvas is first MOR section |
| MDS-M20 Library | Completed missions publish back |

---

## MDS-M23 — V1 Scope

**[MDS-M23]** Step 5.2 deliverables:

| Capability | V1 |
|------------|-----|
| Mission Design philosophy | ✅ Documented |
| Mission Canvas 10-section structure | ✅ Spec |
| Mission lifecycle with Design stage | ✅ |
| Mission templates architecture | ✅ Spec |
| Collaborative design roles | ✅ Spec |
| Mission Library architecture | ✅ Spec |
| Canvas form implementation | Stub |
| Library browse UI | v1.1 |
| AI design assistance | Future [MDS-M19] |

---

## MDS-BG — Burt Implementation Guidance

**[MDS-BG]** Implementation should:

1. **Treat Mission Canvas as structured object** — typed sections, validation, versioning [MDS-M15]
2. **Separate mission design from execution** — no tasks until Design → Review complete [MDS-M04, ACN-M18]
3. **Support reusable templates** [MDS-M16] — `createMissionFromTemplate`
4. **Connect to Capability Exchange and Community Brain** [CCE-001, CKLS-001] — Sections 6–7, 10
5. **Preserve every Mission Canvas version** — append-only; feeds MOR [ACN-M26]
6. **Allow collaborative editing** — co-authors, reviewers, mentors [MDS-M18]
7. **Publish completed missions to Mission Library** [MDS-M20] — opt-in with community approval
8. **Extend MPS-M15 orchestrator** — do not fork parallel canvas system

**[MDS-BG-a]** Recommended structure:

```
src/lib/missions/design/createMissionCanvas.ts
src/lib/missions/design/updateMissionCanvasSection.ts
src/lib/missions/design/submitMissionCanvasForReview.ts
src/lib/missions/design/createMissionFromTemplate.ts
src/lib/missions/library/publishToMissionLibrary.ts
src/lib/missions/library/searchMissionLibrary.ts
src/lib/missions/library/forkMissionFromLibrary.ts
src/components/mission/MissionCanvasForm.tsx
src/components/mission/MissionLibraryBrowser.tsx
data/registry/mission-design-system.json
```

**[MDS-BG-b]** Canvas JSON schema — ten top-level keys matching MDS-M05 through MDS-M14.

---

## AC-049 — Acceptance Criteria

Step 5.2 is complete when:

- [x] **[AC-049a]** Mission Design philosophy documented. `[MDS-M01, MDS-M02, MDS-M03]`
- [x] **[AC-049b]** Mission Canvas structure fully defined. `[MDS-M05–MDS-M15]`
- [x] **[AC-049c]** Mission lifecycle and relationships established. `[MDS-M04, MDS-M17]`
- [x] **[AC-049d]** Templates and collaborative design incorporated. `[MDS-M16, MDS-M18]`
- [x] **[AC-049e]** Mission Library architecture specified. `[MDS-M20]`
- [x] **[AC-049f]** Burt has blueprint for structured mission creation. `[MDS-BG, mission-design-system.json]`

---

**Next Step:** 5.3 — Execution Operating System

*Trace: Idea → discovery → designed canvas → reviewed mission → planned work → executed action → MOR archived → Mission Library enriched → next community starts stronger*
