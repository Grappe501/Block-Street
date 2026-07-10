# Institutional Partnership System

**Document ID:** PHASE-006.10  
**Artifact:** `INSTITUTIONAL_PARTNERSHIP_SYSTEM.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 6 — Growth Operating System  
**Acronym:** IPS

> **Communities become stronger when institutions work together in service of the public good.**

Step 6.10 moves the platform **beyond individual communities** to connect **institutions** — the bridge between community organizing and the broader civic ecosystem. Not just organizations: universities, student orgs, nonprofits, libraries, museums, businesses supporting service, government agencies where appropriate, and more.

**Requirement:** IPS-001 · **Planned alias superseded:** PTN-001 · **Extends:** [Statewide Collaboration Network SCN-001](../phase-04/STATEWIDE_COLLABORATION_NETWORK.md) · **Phase umbrella:** GOS-001 · **Governed by:** [Growth Constitution GCN-001](GROWTH_CONSTITUTION.md)

**Builds On:** SCN-001 · [Opportunity Exchange OEX-001](../phase-04/OPPORTUNITY_EXCHANGE.md) · [Community Expansion Framework CEF-001](COMMUNITY_EXPANSION_FRAMEWORK.md) · [Initiative Operating System IOS-001](../phase-05/INITIATIVE_OPERATING_SYSTEM.md) · [Community Storytelling CST-001](../phase-05/COMMUNITY_STORYTELLING_SYSTEM.md) · [Community Legacy CLS-001](../phase-04/COMMUNITY_LEGACY_SYSTEM.md)

**Live spec:** `data/registry/institutional-partnership-system.json`

**Required reading for Burt.**

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| IPS-M01 | Purpose |
| IPS-M02 | Guiding principle |
| IPS-M03 | Philosophy |
| IPS-M04 | Partner Categories |
| IPS-M05 | Partnership Profiles |
| IPS-M06 | Partnership Opportunities |
| IPS-M07 | Partnership Directory |
| IPS-M08 | Partnership Requests |
| IPS-M09 | Partnership History |
| IPS-M10 | Community Independence |
| IPS-M11 | Future AI assistance |
| IPS-M12 | Relationship to SCN-001 |
| IPS-M13 | Arkansas Civic Ecosystem Map |
| IPS-M14 | Mutual Value principle |
| IPS-M15 | V1 scope |
| IPS-BG | Burt implementation guidance |
| AC-071 | Step 6.10 acceptance criteria |

---

## IPS-M01 — Purpose

**[IPS-M01]** The **Institutional Partnership System (IPS)** enables communities to build **lasting relationships** with educational institutions, nonprofit organizations, civic groups, businesses, public institutions, and other partners that expand opportunities and strengthen local communities.

**[IPS-M01a]** Partnerships are built around **shared missions** rather than organizational control [CCN-M004 local autonomy].

**[IPS-M01b]** IPS is the platform's **bridge to the broader civic ecosystem** — weaving institutions into the statewide network [CEF-M16 Mutual Strengthening].

---

## IPS-M02 — Guiding Principle

**[IPS-M02]**

> **Communities become stronger when institutions work together in service of the public good.**

**[IPS-M02a]** Partnerships should **expand opportunities while preserving community independence** [IPS-M10].

**[IPS-M02b]** Complements [Mutual Value IPS-M14] — both sides benefit; long-term relationships not one-time transactions.

---

## IPS-M03 — Philosophy

**[IPS-M03]** Institutions possess: knowledge · facilities · mentors · funding opportunities · training · networks · experience.

**[IPS-M03a]** Communities possess: energy · relationships · ideas · volunteers · leadership · local knowledge.

**[IPS-M03b]** **Together they accomplish more** [SCN-M01 collaboration thesis] — complementary strengths, not hierarchy.

**[IPS-M03c]** Platform distinguishes **partnership from sponsorship** [business category IPS-M04] — service alignment, not transactional branding [GCN-M08].

---

## IPS-M04 — Partner Categories

**[IPS-M04]** **First-class institutional entities** — separate from participant communities [CEF-BG, IPS-BG]:

### Educational Institutions
Universities · community colleges · trade schools · future high schools · academic departments · research centers [INST-001]

### Student Organizations
Student government · academic clubs · service organizations · honor societies · professional associations · Greek organizations (where appropriate)

### Community Organizations
Neighborhood associations · volunteer groups · community centers · arts · environmental · food security

### Nonprofit Organizations
Local · regional · statewide · national affiliates · mission-specific orgs

### Public Institutions
Libraries · museums · parks · public schools (future) · public service agencies · community facilities

### Businesses
Businesses supporting community service, mentoring, education, or volunteerism — **partnership not sponsorship** [IPS-M03c]

### Professional Communities
Young professionals · industry associations · trade organizations · career mentors · internship partners · professional development groups

**[IPS-M04a]** Categories configurable · extensible via type registry [CEF-M04 pattern].

**[IPS-M04b]** Orchestrator: `getPartnerCategoryConfig(categoryId)`.

---

## IPS-M05 — Partnership Profiles

**[IPS-M05]** Every partner receives a **structured profile**:

| Field | Purpose |
|-------|---------|
| Mission · areas of interest | Discovery alignment |
| Communities served | Geographic and mission fit |
| Contact information | Relationship initiation |
| Opportunities offered | OEX integration [IPS-M06] |
| Facilities · programs · skills · events | Collaboration assets |
| Partnership history | [IPS-M09] |

**[IPS-M05a]** Profiles help communities **discover collaboration opportunities** — not cold outreach lists.

**[IPS-M05b]** Route: `/institutions/[slug]` · orchestrator: `getPartnershipProfile(partnerId)`.

**[IPS-M05c]** Future: partner verification workflow [IPS-BG].

---

## IPS-M06 — Partnership Opportunities

**[IPS-M06]** Partners may offer via [Opportunity Exchange OEX-001]:

- Volunteer opportunities · internships · mentorship · meeting space · training
- Guest speakers · equipment · community projects · research collaboration
- Scholarships (future reference)

**[IPS-M06a]** Platform **connects opportunities with communities** [OBE-001 explainable matching] — opt-in for both sides.

**[IPS-M06b]** Distinct from community-internal opportunities — **institutional layer** on OEX.

---

## IPS-M07 — Partnership Directory

**[IPS-M07]** Communities search partners by:

- Location · mission · community served · services · educational focus
- Volunteer opportunities · skills · tags

**[IPS-M07a]** **Discovery encourages collaboration** — not procurement marketplace [GCN-M08].

**[IPS-M07b]** Route: `/partners/directory` · orchestrator: `searchPartners(filters?)`.

**[IPS-M07c]** Integrates [Arkansas Civic Ecosystem Map IPS-M13] — visual discovery layer.

---

## IPS-M08 — Partnership Requests

**[IPS-M08]** Communities may **request partnerships**:

- Need guest speaker · meeting space · volunteer project · mentorship
- Need internship partner · training

**[IPS-M08a]** Requests create **opportunities for collaboration** — partner may accept, decline, or propose alternative [SEC-001 consent].

**[IPS-M08b]** Orchestrator: `createPartnershipRequest(communityId, partnerId, requestType, details)`.

**[IPS-M08c]** Lightweight workflow — not RFP bureaucracy [Action OS agility EOS-001].

---

## IPS-M09 — Partnership History

**[IPS-M09]** Platform preserves **relationship depth over time**:

- Joint missions · shared events · community impact · stories
- Experience Playbooks [CKLS-001] · lessons learned [CLS-001]

**[IPS-M09a]** Relationships **deepen over time** — not one-off transactions [IPS-M14 Mutual Value].

**[IPS-M09b]** Feeds [Community Legacy CLS-001] · [Story Atlas CST-M16] · [Living Network Graph GOS-M16].

**[IPS-M09c]** Orchestrator: `getPartnershipHistory(communityId | partnerId)`.

---

## IPS-M10 — Community Independence

**[IPS-M10]** Partnerships **never override local community governance** [CCN-M004, CCN constitutional autonomy]:

Communities retain: **leadership · mission priorities · decision-making · identity**

**[IPS-M10a]** Partnerships are **collaborative rather than controlling** — institutions support, do not absorb [GCN-M05b Community Before Scale].

**[IPS-M10b]** Enforced in partnership agreement templates and request workflows [IPS-BG].

**[IPS-M10c]** Partner visibility on community pages is **community-approved** [SEC-001].

---

## IPS-M11 — Future AI Assistance

**[IPS-M11]** Future AI **facilitates introductions** — never makes partnership decisions [GCN-M15, CGIS-M13 explainability].

**[IPS-M11a]** May:

- Recommend institutional partners · identify shared interests
- Suggest collaborative initiatives · recommend mentors
- Highlight partnership opportunities · summarize successful partnerships

**[IPS-M11b]** All recommendations explain *why* [CGIS-M13] — communities and partners choose.

---

## IPS-M12 — Relationship to SCN-001

**[IPS-M12a]** **SCN-001** (Phase 4) established **statewide collaboration** — cross-community missions, mentorship, Collaboration Map.

**[IPS-M12b]** **IPS-001** (Phase 6.10) extends SCN with **institutional layer** — partners as first-class entities bridging communities and civic ecosystem.

**[IPS-M12c]** Planned **Partnership System PTN-001** superseded — scope expanded from "organizations join network" to **full institutional partnership architecture**.

**[IPS-M12d]** SCN asks *"How do communities collaborate?"* · IPS asks *"How do institutions and communities strengthen one another?"*

---

## IPS-M13 — Arkansas Civic Ecosystem Map

**[IPS-M13]** The **Arkansas Civic Ecosystem Map (ACEM)** is the **signature strategic map** of IPS — statewide view of **communities and institutions connected**.

**[IPS-M13a]** Complements existing maps:

| Map | Lens |
|-----|------|
| [Arkansas Coverage Map CGO-M16] | Community launch and growth |
| [Arkansas Capacity Map CCS-M16] | Action capacity |
| [Story Atlas CST-M16] | Narrative geography |
| [Growth Observatory CGIS-M16] | Growth intelligence |
| **Civic Ecosystem Map IPS-M13** | **Institutional connections** |

**[IPS-M13b]** Examples visible on map:

- Universities mentoring nearby counties · libraries hosting civic workshops
- Student orgs partnering on service projects · nonprofits across multiple campuses
- Businesses providing meeting space · museums supporting educational initiatives

**[IPS-M13c]** Organizers answer:

- Which counties have no institutional partners yet?
- Which universities collaborate most broadly?
- Which nonprofits are active in multiple regions?
- Where are internship opportunities? · Which institutions have environmental or food security expertise?

**[IPS-M13d]** Emphasizes **connections rather than ownership** [SCN-M14, not territorial].

**[IPS-M13e]** Route: `/map/ecosystem` · orchestrator: `getArkansasCivicEcosystemMap(filters?, layers?)`.

**[IPS-M13f]** Layer toggles: by partner category · by opportunity type · by connection strength · gaps view.

---

## IPS-M14 — Mutual Value Principle

**[IPS-M14]** **Constitutional principle for partnerships** [extends GCN-M06 Shared Responsibility]:

> **Partnerships should create mutual value.**

**[IPS-M14a]** Every partnership should benefit **both sides**:

| Community gains | Institution gains |
|-----------------|-------------------|
| Opportunities · expertise · support | Meaningful engagement with students, volunteers, local communities |

**[IPS-M14b]** Creates **long-term relationships** rather than one-time transactions [IPS-M09 history].

**[IPS-M14c]** Reference: candidate principle **CP-019** · evaluated in partnership requests and history reviews.

**[IPS-M14d]** Platform weaves **broader civic fabric of Arkansas** — communities, educational institutions, nonprofits, and partners strengthen one another over time [GOS-001 vision].

---

## IPS-M15 — V1 scope

| Deliverable | Status |
|-------------|--------|
| IPS philosophy documented | ✅ |
| Partner categories + profiles | ✅ |
| Directory + opportunities + requests | ✅ |
| Partnership history + community independence | ✅ |
| Mutual Value principle | ✅ |
| Arkansas Civic Ecosystem Map architecture | ✅ |
| Live ecosystem map aggregation | v1.1 |
| Partner verification workflow | v1.2 |

---

## IPS-BG — Burt Implementation Guidance

**[IPS-BG-a]** Implementation should:

- Treat **institutional partners as first-class entities** — separate from participant communities
- **Separate partners from participant communities** [CEF community vs IPS partner tables]
- Support **reusable partnership templates** [CEF-M09 pattern]
- Maintain **partnership history** with privacy controls [SEC-001]
- Integrate [CGO-001 Growth], [OEX-001 Opportunities], [IOS-001 Initiatives]
- Prepare for **future partner verification** workflows
- Enforce **Community Independence** [IPS-M10] and **Mutual Value** [IPS-M14] in all flows

**[IPS-BG-b]** Files:

```
src/lib/ips/getPartnershipProfile.ts
src/lib/ips/searchPartners.ts
src/lib/ips/createPartnershipRequest.ts
src/lib/ips/getPartnershipHistory.ts
src/lib/ips/getArkansasCivicEcosystemMap.ts
src/components/partners/PartnershipDirectory.tsx
src/components/map/ArkansasCivicEcosystemMap.tsx
data/registry/institutional-partnership-system.json
```

**[IPS-BG-c]** Database: `DB-IPS` · tables: `institutional_partners`, `partner_profiles`, `partnership_requests`, `partnership_agreements`, `partnership_history`, `ecosystem_map_cache`.

---

## AC-071 — Acceptance Criteria

Step 6.10 is complete when:

- [x] **[AC-071a]** Institutional Partnership philosophy documented. `[IPS-M01, IPS-M02, IPS-M03]`
- [x] **[AC-071b]** Partner categories and profiles established. `[IPS-M04, IPS-M05]`
- [x] **[AC-071c]** Opportunity sharing and partnership history defined. `[IPS-M06, IPS-M09]`
- [x] **[AC-071d]** Community independence protected. `[IPS-M10]`
- [x] **[AC-071e]** Mutual Value principle established. `[IPS-M14]`
- [x] **[AC-071f]** Arkansas Civic Ecosystem Map specified. `[IPS-M13]`
- [x] **[AC-071g]** Burt has blueprint for institution-to-community collaboration. `[IPS-BG, institutional-partnership-system.json]`

---

**Phase 6 Complete.** · **Volume 0:** [Master Architecture Bible [MAB-001]](../master/MASTER_ARCHITECTURE_BIBLE.md) — canonical source of truth; read before production code

*Trace: Discover partner → mutual value alignment → collaborate → history preserved → ecosystem map shows connections → civic fabric strengthens*
