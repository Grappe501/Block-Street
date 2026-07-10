# Community Capability Exchange

**Document ID:** PHASE-004.9  
**Artifact:** `COMMUNITY_CAPABILITY_EXCHANGE.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 4 — Community Operating System  
**Acronym:** CCE

> **What one community creates should be able to strengthen another.**

A "resource library" sounds like a folder full of files. ASYON builds something **much more powerful** — the **Community Capability Exchange**.

Communities don't just share resources. They share **capabilities**:

- A flyer is a capability
- A Canva template is a capability
- A trained photographer is a capability
- A projector available for checkout is a capability
- A meeting room is a capability
- A grant writer is a capability

This is the **marketplace where communities discover what they already have and what they still need**.

**Requirement:** CCE-001 *(governed by [KDG-001](../phase-02/KNOWLEDGE_DATA_GOVERNANCE.md); complements [CKLS-001](COMMUNITY_KNOWLEDGE_LEARNING_SYSTEM.md) knowledge layer)*

**Builds On:** [Community Knowledge & Learning](COMMUNITY_KNOWLEDGE_LEARNING_SYSTEM.md) · [Opportunity & Belonging Engine](../phase-03/OPPORTUNITY_BELONGING_ENGINE.md) · [Personal Digital Twin](../phase-03/PERSONAL_DIGITAL_TWIN.md) · [Relationship Graph](../phase-02/REGISTRY_RELATIONSHIP_MODEL.md)

**Live spec:** `data/registry/community-capability-exchange.json`

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| CCE-M01 | Purpose |
| CCE-M02 | Guiding principle |
| CCE-M03 | Philosophy |
| CCE-M04 | Capability categories |
| CCE-M05 | Capability profiles |
| CCE-M06 | Discovery |
| CCE-M07 | Sharing |
| CCE-M08 | Requests |
| CCE-M09 | Recommendations |
| CCE-M10 | Version history |
| CCE-M11 | Recognition |
| CCE-M12 | Future AI assistance |
| CCE-M13 | Capability Graph architecture |
| CCE-M14 | Platform integrations |
| CCE-M15 | V1 scope |
| CCE-BG | Burt implementation guidance |
| AC-042 | Step 4.9 acceptance criteria |

---

## CCE-M01 — Purpose

**[CCE-M01]** The **Community Capability Exchange (CCE)** provides a structured way for communities to **discover, share, request, and reuse** the people, knowledge, tools, materials, spaces, and services needed to accomplish their missions.

**[CCE-M01a]** Objectives:

- **Reduce duplication** across campuses and counties
- **Encourage collaboration** statewide
- **Help communities build** on one another's successes

**[CCE-M01b]** CCE is **bigger than document storage** — capabilities include people, skills, equipment, and spaces [CCE-M04].

**[CCE-M01c]** Complements [Opportunity Exchange OEX-001] — CCE is **what communities have**; OEX is **what communities need** (published outward). Both connect via Capability Graph [CCE-M13].

---

## CCE-M02 — Guiding Principle

**[CCE-M02]**

> **What one community creates should be able to strengthen another.**

**[CCE-M02a]** Knowledge, tools, and talent should **circulate throughout the statewide network** whenever appropriate [CCN-M08 cross-community].

**[CCE-M02b]** Complementary principles:

| Source | Principle |
|--------|-----------|
| CKLS-M02 | Knowledge shared becomes community strength |
| CGS-M05 | Share responsibility — don't reinvent |
| OBE-001 | Belonging through meaningful contribution |
| CRA-001 | Recognition encourages generosity |

---

## CCE-M03 — Philosophy

**[CCE-M03]** Communities possess many forms of **capability** — not just files:

| Capability type | Example |
|-----------------|---------|
| Knowledge | Playbook, training guide |
| People | Photographer, grant writer |
| Equipment | Projector, canopy |
| Templates | Flyer, deck |
| Training | Workshop materials |
| Facilities | Meeting room, campus space |
| Experience | "We've done this three times" |
| Relationships | County-campus partnership |

**[CCE-M03a]** The platform makes capabilities **visible and reusable** — statewide capability network, not siloed folders.

**[CCE-M03b]** **Structured entities, not file uploads alone** [CCE-BG] — ownership, attribution, availability, reuse history from day one.

---

## CCE-M04 — Capability Categories

**[CCE-M04]** Configurable categories:

### Documents
Guides · Checklists · Policies · Meeting agendas · Planning documents · Training manuals

### Templates
Flyers · Social graphics · Presentation decks · Email drafts · Press releases · Event checklists · Brand assets

### Media
Photos · Videos · Audio · Graphics · Illustrations · Community photography

### Equipment
Projectors · Canopies · Tables · Sound systems · Laptops · Printers — *future inventory tracking*

### Spaces
Meeting rooms · Community centers · Campus facilities · Volunteer locations · Training spaces · Event venues

### Skills
Photography · Graphic design · Writing · Translation · Technology · Public speaking · Facilitation · Research · Legal · Accounting — *configurable*

### Services
Mentorship · Training · Workshops · Guest speakers · Volunteer coordination · Project consulting · Community coaching

**[CCE-M04a]** `capabilityType` attribute — future categories without redesign.

**[CCE-M04b]** Skills link to **Personal Digital Twin** [PDT-001] and **Growth Graph** [PGL-001] — people as capabilities.

---

## CCE-M05 — Capability Profiles

**[CCE-M05]** Every capability receives a **profile**:

| Field | Purpose |
|-------|---------|
| Title | Discoverable name |
| Description | What this capability offers |
| Owner | Community or participant |
| Community | Parent scope |
| Availability | When/how accessible |
| Category | Type [CCE-M04] |
| Related Projects | Graph links [MPS-001] |
| Usage History | Reuse tracking |
| Instructions | How to use/request |
| Permissions | Sharing scope [SEC-001] |

**[CCE-M05a]** Platform understands capabilities as **reusable assets** — graph nodes, not attachments.

---

## CCE-M06 — Discovery

**[CCE-M06]** Participants search by:

- Keyword · Community · Category · Location
- Availability · Skill · Project type · Tags

**[CCE-M06a]** **Discovery should feel effortless** — search + Capability Graph traversal [CCE-M13].

**[CCE-M06b]** Orchestrator: `searchCapabilities(filters)` — powers CCC Capabilities widget and OBE recommendations.

---

## CCE-M07 — Sharing

**[CCE-M07]** Communities **encouraged to share**:

- Upload new templates · Publish successful playbooks
- Offer volunteer expertise · Loan equipment
- Share training · Collaborate across counties

**[CCE-M07a]** **Sharing strengthens the statewide ecosystem** — attribution preserved [KDG-001], recognition given [CCE-M11].

**[CCE-M07b]** Orchestrator: `publishCapability(params)` — creates capability node + graph edges.

---

## CCE-M08 — Requests

**[CCE-M08]** Communities may **request capabilities**:

- Need photographer · Need meeting space
- Need graphic designer · Need volunteers
- Need presentation template · Need training

**[CCE-M08a]** **Needs become visible collaboration opportunities** — feeds Opportunity widget [CCC-M08] and [Opportunity Exchange OEX-001].

**[CCE-M08b]** Request → match via Capability Graph skill/availability edges.

---

## CCE-M09 — Recommendations

**[CCE-M09]** Platform **recommends capabilities** contextually:

- "This project could use last year's event checklist."
- "Nearby county has extra canopies."
- "Three volunteers have photography skills."
- "This committee already built a presentation."

**[CCE-M09a]** **Recommendations reduce duplicated effort** — Mission Canvas [MPS-M15], Community Pulse [CCC-M20], Morning Brief [PCC-M17] may surface matches.

**[CCE-M09b]** Orchestrator: `recommendCapabilities(context)` — mission + community + graph traversal.

---

## CCE-M10 — Version History

**[CCE-M10]** Shared capabilities **evolve** — platform preserves:

- Original version · Updates · Contributors
- Communities using it · Improvements

**[CCE-M10a]** **Knowledge grows collectively** — append-only version chain [KDG-001 provenance].

**[CCE-M10b]** Improved templates propagate via Capability Graph — "improved by 3 communities" visible on profile.

---

## CCE-M11 — Recognition

**[CCE-M11]** Communities receive **appreciation** when others benefit:

- "Your event template has helped five campuses."
- "Your volunteer guide was reused statewide."

**[CCE-M11a]** **Recognition encourages generosity rather than ownership** [CRA-001] — reuse counts on capability profile, not hoarding.

**[CCE-M11b]** Feeds Recognition widget [CCC-M16] and Civic Passport [CPP-001].

---

## CCE-M12 — Future AI Assistance

**[CCE-M12]** Future AI may:

- Locate relevant capabilities · Suggest reusable resources
- Recommend experts · Summarize documentation
- Identify duplicate work · Suggest improvements

**[CCE-M12a]** AI **increases discovery — not replaces human collaboration** [CCNET-M12, CKLS-M14].

**[CCE-M12b]** AI consults **Capability Graph + Community Brain** [CKLS-M15] — grounded recommendations.

---

## CCE-M13 — Capability Graph Architecture

**[CCE-M13]** **Signature feature.** Joins the platform graph family:

| Graph | Purpose |
|-------|---------|
| Relationship Graph | Who knows whom [REL-001] |
| Trust Graph | Safety [SEC-001] |
| Growth Graph | Development [PGL-001] |
| Conversation Graph | What happened because people talked [CCNET-M13] |
| Personal Digital Twin | Participant context [PDT-001] |
| Community Brain | Community knowledge [CKLS-M15] |
| **Capability Graph** | **What communities can offer and need** |

**[CCE-M13a]** Example — template reuse:

```
Community
    │ created
Event Checklist
    │ used by
12 Projects
    │ improved by
3 Communities
    │ recommended to
New Volunteer Team
```

**[CCE-M13b]** Example — skill match:

```
Participant
    │ has_skill
Photography
    │ needed_by
Food Drive Project
    │ organized_by
Pulaski County Community
```

**[CCE-M13c]** Capability Graph answers:

- Who already knows how to do this?
- Has another campus solved this problem?
- What resources are commonly used together?
- Which communities are experts in this area?
- What capabilities are missing in this county?

**[CCE-M13d]** Transforms platform from **collection of shared files** into **statewide capability network**.

**[CCE-M13e]** Orchestrator: `queryCapabilityGraph(nodeId, depth)`.

**[CCE-M13f]** V1: graph schema + stub queries; full recommendation engine v1.2+.

---

## CCE-M14 — Platform Integrations

**[CCE-M14]** CCE connects across the platform:

| System | Integration |
|--------|-------------|
| CKLS [CKLS-001] | Knowledge items link to capability assets; playbooks may publish as templates |
| Community Brain | Brain queries include available capabilities |
| PDT [PDT-001] | Participant skills as capability nodes |
| OBE [OBE-001] | Opportunity discovery includes capability matches |
| Opportunity Exchange [OEX-001] | Needs publish outward; CCE matches supply |
| MPS [MPS-001] | Missions consume and contribute capabilities |
| CRA [CRA-001] | Reuse recognition |

**[CCE-M14a]** CCC **Capabilities widget** (formerly Resources) surfaces community capability highlights + requests.

---

## CCE-M15 — V1 Scope

**[CCE-M15]** Jul 12 leader testing / Jul 14 launch minimum:

| Deliverable | Scope |
|-------------|-------|
| CCE philosophy & categories | Documented — this step |
| Capability Graph spec | Schema + stub |
| Capability entity schema | Graph nodes |
| Discovery stub | Static capability cards |
| Full inventory management | Future |

**[CCE-M15a]** Deferred: equipment checkout workflow, space booking, AI recommendations, full cross-county sharing UI.

---

## CCE-BG — Burt Implementation Guidance

**[CCE-BG]** Implementation should:

1. **Treat capabilities as structured entities** — not file storage [CCE-M03]
2. **Support multiple capability types** — documents through services [CCE-M04]
3. **Maintain ownership and attribution** — [KDG-001]
4. **Track reuse history** — graph edges for used_by, improved_by [CCE-M10]
5. **Allow future inventory management** — equipment/spaces checkout workflows
6. **Design search and recommendations from the beginning** [CCE-M06, CCE-M09]

**[CCE-BG-a]** Recommended file structure:

```
src/lib/cce/queryCapabilityGraph.ts
src/lib/cce/searchCapabilities.ts
src/lib/cce/recommendCapabilities.ts
src/lib/cce/publishCapability.ts
src/components/ccc/widgets/CapabilitiesWidget.tsx
data/registry/community-capability-exchange.json
```

**[CCE-BG-b]** Database: `capabilities` table with `capability_type`, `owner_community_id`, `owner_participant_id`, `availability`, `version_history`; graph edges table for capability relationships.

---

## AC-042 — Acceptance Criteria

Step 4.9 is complete when:

- [x] **[AC-042a]** Community Capability Exchange philosophy documented. `[CCE-M01, CCE-M03]`
- [x] **[AC-042b]** Capability categories defined. `[CCE-M04, CCE-M05]`
- [x] **[AC-042c]** Discovery, sharing, and requests incorporated. `[CCE-M06, CCE-M07, CCE-M08]`
- [x] **[AC-042d]** Version history and attribution established. `[CCE-M10, KDG-001]`
- [x] **[AC-042e]** Capability Graph architecture specified. `[CCE-M13]`
- [x] **[AC-042f]** Platform integrations documented. `[CCE-M14]`
- [x] **[AC-042g]** Burt has blueprint for statewide capability-sharing ecosystem. `[CCE-BG, community-capability-exchange.json]`

---

**Phase 4 Status:** Complete — [Build Bible](PHASE_4_COMMUNITY_OS_BUILD_BIBLE.md) · **Next:** Phase 5 — Action Operating System

*Trace: Capabilities published → reused → improved → recommended → statewide network strengthens every community → generosity recognized*
