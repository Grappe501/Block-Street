# Community Expansion Framework

**Document ID:** PHASE-006.9  
**Artifact:** `COMMUNITY_EXPANSION_FRAMEWORK.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 6 — Growth Operating System  
**Acronym:** CEF

> **The platform should be infinitely extensible while remaining recognizably the same.**

Step 6.9 answers the most strategic question in the project: **How does this platform expand beyond what we know today?** Arkansas colleges, trade schools, and county communities are the launch set — but high schools, alumni networks, professional associations, neighboring states, and more must join **without redesigning the platform every time**.

**Requirement:** CEF-001 · **Planned alias superseded:** CXP-001 · **Extends:** [Community Operating System COS-001](../phase-04/COMMUNITY_OPERATING_SYSTEM.md) · [Community Constitution CCN-001](../phase-04/COMMUNITY_CONSTITUTION.md) · **Phase umbrella:** GOS-001 · **Governed by:** [Growth Constitution GCN-001](GROWTH_CONSTITUTION.md)

**Builds On:** COS-001 · CCN-001 · CGS-001 · CGO-001 · [Deepen Before Expand CGIS-M17](COMMUNITY_GROWTH_INTELLIGENCE_SYSTEM.md) · [Statewide Collaboration SCN-001](../phase-04/STATEWIDE_COLLABORATION_NETWORK.md) · [Arkansas Digital Twin ADT-001](../phase-02/ARKANSAS_DIGITAL_TWIN.md)

**Live spec:** `data/registry/community-expansion-framework.json`

**Required reading for Burt.**

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| CEF-M01 | Purpose |
| CEF-M02 | Guiding principle |
| CEF-M03 | Philosophy |
| CEF-M04 | Community Types |
| CEF-M05 | Community Blueprint |
| CEF-M06 | Community Registration |
| CEF-M07 | Community Launch Checklist |
| CEF-M08 | Expansion Readiness |
| CEF-M09 | Community Templates |
| CEF-M10 | Community Relationships |
| CEF-M11 | Geographic Expansion |
| CEF-M12 | Constitutional Alignment |
| CEF-M13 | Future AI assistance |
| CEF-M14 | Relationship to COS and CCN |
| CEF-M15 | Community Foundry |
| CEF-M16 | Mutual Strengthening principle |
| CEF-M17 | V1 scope |
| CEF-BG | Burt implementation guidance |
| AC-070 | Step 6.9 acceptance criteria |

---

## CEF-M01 — Purpose

**[CEF-M01]** The **Community Expansion Framework (CEF)** defines the **process, standards, and architectural principles** for introducing new community types into the statewide network while preserving consistency, local autonomy, and shared constitutional values [CCN-M004].

**[CEF-M01a]** The platform should **grow without requiring structural redesign** [GOS-001 scalability target: 2 students to 20,000].

**[CEF-M01b]** CEF is the **blueprint for how entirely new community types** are introduced — configuration, not custom code.

---

## CEF-M02 — Guiding Principle

**[CEF-M02]**

> **The platform should be infinitely extensible while remaining recognizably the same.**

**[CEF-M02a]** Every new community should **feel familiar** — same Command Center, same growth loop, same constitutional spine [COS-001 four operating systems].

**[CEF-M02b]** Complements [Mutual Strengthening CEF-M16] — expansion strengthens network and network strengthens new communities.

---

## CEF-M03 — Philosophy

**[CEF-M03]** Growth should happen through **replication rather than reinvention** [GCN-M05d Long-Term Thinking].

**[CEF-M03a]** Every community — regardless of type — shares the **same foundational operating system** [Community OS Phase 4 + Growth OS Phase 6 modules].

**[CEF-M03b]** Each community may **customize identity, traditions, and goals** [CCR-001, CEF-M09 templates] while remaining **interoperable** with the statewide network [SCN-001].

**[CEF-M03c]** New types added through **configuration** — community type registry, not forked codebase [CEF-BG].

---

## CEF-M04 — Community Types

**[CEF-M04]** **Current launch communities:**

| Type | Examples |
|------|----------|
| Universities | Four-year institutions [INST-001] |
| Community colleges | Two-year [INST-001] |
| Trade schools | Technical institutions |
| County communities | All 75 counties [CNTY-001] |
| Young adult county communities | 16–24 non-student [CNTY-002] |

**[CEF-M04a]** **Future expansion** (architecturally supported now):

- High schools · graduate schools · alumni communities
- Student organizations · academic departments · neighborhood communities
- Professional organizations · volunteer organizations · regional coalitions
- **Future states** · additional community types via configuration

**[CEF-M04b]** Type registry: `community_types` table · orchestrator: `getCommunityTypeConfig(typeId)`.

**[CEF-M04c]** Integrates [Arkansas Coverage Map CGO-M16] — which types exist where, gaps remain.

---

## CEF-M05 — Community Blueprint

**[CEF-M05]** Every new community receives the **same foundation** — architectural consistency [COS-001 module map]:

| Module | Requirement |
|--------|-------------|
| Identity | CCN-001 community profile |
| Community Command Center | CCC-001 |
| Calendar | TSOS-001 |
| Community Brain | CKLS-001 |
| Opportunity Exchange | OEX-001 |
| Capability Exchange | CCE-001 |
| Storytelling | CST-001 |
| Leadership Development | CLD-001 |
| Growth System | CGO-001 |
| Legacy | CLS-001 |

**[CEF-M05a]** Blueprint **auto-provisioned** by [Community Foundry CEF-M15] — not manual setup per module.

**[CEF-M05b]** Optional modules enabled by community type template [CEF-M09].

---

## CEF-M06 — Community Registration

**[CEF-M06]** Future communities may **self-register** through structured **approval workflow**:

- New trade school · newly established university chapter
- High school community (when enabled) · alumni network · community organization

**[CEF-M06a]** Registration ensures **consistency without slowing innovation** [STS-001 lifecycle, admin review gate].

**[CEF-M06b]** Workflow: Register → Review → Approve → Foundry launch → Active [CEF-M07].

**[CEF-M06c]** Route: `/foundry/register` · orchestrator: `submitCommunityRegistration(payload)`.

---

## CEF-M07 — Community Launch Checklist

**[CEF-M07]** Every new community completes **intentional launch** — not accidental:

| Checklist item | System |
|----------------|--------|
| Mission established | MPS-001 / community mission |
| Welcome team identified | WBS-001 |
| Initial organizers confirmed | CLD-001 |
| Community profile completed | CCC-001 |
| Calendar activated | TSOS-001 |
| Knowledge space created | CKLS-001 |
| Growth goals defined | CGO-M07 |
| First mission planned | EOS-001 / MPS-001 |

**[CEF-M07a]** Launch becomes **intentional** [CGO-M10 Community Readiness, CEF-M08 Expansion Readiness].

**[CEF-M07b]** Orchestrator: `getLaunchChecklist(communityId)` · `markLaunchChecklistItem(communityId, itemId)`.

---

## CEF-M08 — Expansion Readiness

**[CEF-M08]** Before launching, consider [extends CGIS-M17 Deepen Before Expand + CGO-M10]:

- Local interest · potential organizers · mentorship support
- Nearby partner communities · leadership succession · community sustainability

**[CEF-M08a]** Expansion should **strengthen the network** — not fragment it [GCN-M05b Community Before Scale].

**[CEF-M08b]** CGIS may recommend: deepen existing community first; launch new only when readiness met [CGIS-M17].

**[CEF-M08c]** Orchestrator: `assessExpansionReadiness(proposedCommunity)`.

---

## CEF-M09 — Community Templates

**[CEF-M09]** Platform provides **launch templates** accelerating successful launches:

- University · county · trade school · high school (future) · alumni · student organization · professional org

**[CEF-M09a]** Templates configure: default values, traditions suggestions [CCR-001], growth goals [CGO-M07], welcome resources [WBS-M12], enabled modules.

**[CEF-M09b]** Stored in `data/registry/community-templates/` · referenced by Foundry [CEF-M15].

**[CEF-M09c]** Templates are **starting points** — communities customize after launch [CCN-M004 local autonomy].

---

## CEF-M10 — Community Relationships

**[CEF-M10]** Every new community connects to statewide network:

- Neighboring communities · regional partnerships · shared initiatives
- Mentorship networks [SCN-001] · leadership development [CLD-001] · knowledge sharing [CKLS-001]

**[CEF-M10a]** Expansion **strengthens statewide network** — not isolated instances [CEF-M16].

**[CEF-M10b]** Auto-suggest mentor communities from [Arkansas Coverage Map CGO-M16] · communities ready to mentor neighbors.

---

## CEF-M11 — Geographic Expansion

**[CEF-M11]** Architecture supports geographic scopes **without assuming permanent limits**:

| Scope | Status |
|-------|--------|
| Campus | Launch |
| County | Launch |
| Regional | Launch [SCN-001] |
| Statewide | Launch [Arkansas] |
| Interstate | Future |
| National | Future |
| International | Future |

**[CEF-M11a]** Geographic model in [ADT-001] · [Registry REG-001, REG-002] — extensible to new states without platform rewrite.

**[CEF-M11b]** [Arkansas Growth Observatory CGIS-M16] network expansion lens.

---

## CEF-M12 — Constitutional Alignment

**[CEF-M12]** Every new community **agrees to platform constitutional principles** [CONST, CCN-001, GCN-001] while maintaining **unique identity and local culture** [CCR-M04 values].

**[CEF-M12a]** Consistency from **shared values** — not centralized control [CCN-M004 equal standing, local autonomy].

**[CEF-M12b]** Registration workflow includes constitutional acknowledgment [CEF-M06].

---

## CEF-M13 — Future AI Assistance

**[CEF-M13]** Future AI may **support** expansion — never replace local leadership [GCN-M15, CGIS-M14].

**[CEF-M13a]** May:

- Recommend launch readiness · identify nearby mentors
- Suggest launch checklists · recommend partnerships
- Highlight communities providing guidance · summarize successful launch patterns

**[CEF-M13b]** All recommendations pass [Deepen Before Expand CGIS-M17] and [Explainability CGIS-M13].

---

## CEF-M14 — Relationship to COS and CCN

**[CEF-M14a]** **COS-001** (Phase 4) established **Community Operating System** — full module stack for organizing.

**[CEF-M14b]** **CCN-001** established **community constitutional principles** — equal standing, local autonomy, interoperability.

**[CEF-M14c]** **CEF-001** (Phase 6.9) defines **how new communities enter** that stack — types, templates, Foundry, readiness.

**[CEF-M14d]** Planned **Community Expansion System CXP-001** superseded — expanded to **Framework** emphasizing configurability and Foundry.

**[CEF-M14e]** COS asks *"How do communities operate?"* · CEF asks *"How do new community types join without redesign?"*

---

## CEF-M15 — Community Foundry

**[CEF-M15]** The **Community Foundry (CF)** is the **signature administrative capability** of CEF — guided launch instead of manual community building.

**[CEF-M15a]** When an organizer creates a new community, the Foundry asks:

**What kind of community is this?**

- University · county · trade school · alumni · student organization · future types

**Where is it located?**

**Who are the founding organizers?**

**Who will mentor this community?**

**What traditions or goals are unique to this community?**

**[CEF-M15b]** When complete, Foundry **automatically provisions**:

- Community Command Center · Calendar · Community Brain · Opportunity Exchange
- Storytelling space · Growth Dashboard · Leadership Development tools
- Community Legacy timeline · QR and invitation system [ICS-001]
- Public community profile · Culture Garden seed [CCR-001]
- Launch checklist initialized [CEF-M07]

**[CEF-M15c]** Launching a new community becomes a **repeatable process** — not a custom software project.

**[CEF-M15d]** Route: `/foundry/launch` · orchestrator: `runCommunityFoundry(wizardInput)`.

**[CEF-M15e]** Admin/statewide coordinators use Foundry for strategic expansion; local organizers for chapter launches [role-based SEC-001].

**[CEF-M15f]** Foundry respects [Expansion Readiness CEF-M08] — may block or warn if deepen-before-expand suggests waiting.

---

## CEF-M16 — Mutual Strengthening Principle

**[CEF-M16]** **Phase 6 expansion principle** — applies to every future community:

> **Every new community should strengthen the network, and the network should make every new community stronger.**

**[CEF-M16a]** Communities are **not isolated instances** — living parts of one statewide ecosystem [CGS-001 living organisms, SCN-001].

**[CEF-M16b]** New campuses, counties, trade schools, high schools, and organizations **immediately benefit** from collective knowledge, relationships, stories, and experience — while **contributing unique strengths back** [CKLS-001, CLS-001, SCN-001].

**[CEF-M16c]** Enables **graceful scaling over many years** without losing shared purpose [GOS-001, evaluation question PEL-M13].

**[CEF-M16d]** Reference: candidate principle **CP-018** · enforced in Foundry provisioning and partnership suggestions [CEF-M10].

---

## CEF-M17 — V1 Scope

| Deliverable | Status |
|-------------|--------|
| CEF philosophy documented | ✅ |
| Community types + blueprint | ✅ |
| Registration + launch checklist | ✅ |
| Expansion readiness + templates | ✅ |
| Geographic + constitutional alignment | ✅ |
| Community Foundry architecture | ✅ |
| Mutual Strengthening principle | ✅ |
| Live Foundry provisioning | v1.1 |
| Self-registration workflow | v1.2 |

---

## CEF-BG — Burt Implementation Guidance

**[CEF-BG-a]** Implementation should:

- Treat **community type as configuration** — not code branches
- **Separate constitutional principles from community customization** [CCN vs CCR local values]
- Support **reusable launch templates** [CEF-M09]
- **Auto-integrate** new communities with Growth, Leadership, Welcome, Culture, Invitation systems
- Maintain **architectural flexibility** for future types and geographies [CEF-M11]
- Enforce **Deepen Before Expand** before Foundry approval [CGIS-M17]

**[CEF-BG-b]** Files:

```
src/lib/cef/getCommunityTypeConfig.ts
src/lib/cef/assessExpansionReadiness.ts
src/lib/cef/runCommunityFoundry.ts
src/lib/cef/getLaunchChecklist.ts
src/lib/cef/submitCommunityRegistration.ts
src/components/foundry/CommunityFoundryWizard.tsx
src/components/foundry/LaunchChecklist.tsx
data/registry/community-expansion-framework.json
data/registry/community-templates/
```

**[CEF-BG-c]** Database: `DB-CEF` · tables: `community_types`, `community_registrations`, `launch_checklists`, `foundry_provisions`, `expansion_readiness_assessments`.

---

## AC-070 — Acceptance Criteria

Step 6.9 is complete when:

- [x] **[AC-070a]** Community Expansion philosophy documented. `[CEF-M01, CEF-M02, CEF-M03]`
- [x] **[AC-070b]** Community Blueprint and launch process established. `[CEF-M05, CEF-M07]`
- [x] **[AC-070c]** Registration and expansion readiness defined. `[CEF-M06, CEF-M08]`
- [x] **[AC-070d]** Future community types supported architecturally. `[CEF-M04, CEF-M09, CEF-M11]`
- [x] **[AC-070e]** Community Foundry specified. `[CEF-M15]`
- [x] **[AC-070f]** Mutual Strengthening principle established. `[CEF-M16]`
- [x] **[AC-070g]** Burt has blueprint for scalable community expansion. `[CEF-BG, community-expansion-framework.json]`

---

**Phase 6 Complete.** · **Volume 0:** [Master Architecture Bible [MAB-001]](../master/MASTER_ARCHITECTURE_BIBLE.md) — canonical source of truth; read before production code

*Trace: Readiness assessed → Foundry provisions blueprint → launch checklist completed → community joins ecosystem → strengthens network → network strengthens community → expansion scales without redesign*
