# Arkansas Organizing Registry — Purpose & Authority

**Document ID:** PHASE-002.1  
**Artifact:** `ARKANSAS_ORGANIZING_REGISTRY_DOCTRINE.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 2 — Arkansas Organizing Registry

> The registry is the **source of truth** for what exists in Arkansas organizing geography.  
> Every page, map, search result, dashboard metric, and signup assignment traces back to it.

**Builds On:** [BUILD-BIBLE.md](../build-steps/BUILD-BIBLE.md) · [PHASE-001.5 Organizing Model](../build-steps/PHASE-001.5-ORGANIZING-MODEL.md) · [PHASE-001.7 Launch Success](../build-steps/PHASE-001.7-LAUNCH-SUCCESS-DEFINITION.md) · [REG-001, REG-002, REG-003](../../data/requirements-registry.json)

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| REG-D01 | Purpose |
| REG-D02 | Authority & source of truth |
| REG-D03 | Registry scope |
| REG-D04 | Counties as permanent organizing units |
| REG-D05 | Institutions as campus organizing homes |
| REG-D06 | Campus hubs |
| REG-D07 | County hubs |
| REG-D08 | Representation status |
| REG-D09 | Outreach priority |
| REG-D10 | Future expansion categories |
| REG-D11 | Relationship to participants |
| REG-D12 | Relationship to pages & routes |
| REG-D13 | Data layer architecture |
| REG-D14 | Governance & change control |
| REG-D15 | Phase 2 artifact map |
| AC-010 | Step 2.1 acceptance criteria |

---

## REG-D01 — Purpose

**[REG-D01]** The Arkansas Organizing Registry defines **what exists**, **where it belongs**, and **how the system tracks representation and outreach gaps**.

**[REG-D01a]** It is the canonical data foundation for the entire ASYON platform.

**[REG-D01b]** The registry answers organizing questions before code answers them:

| Question | Registry Answer |
|----------|-----------------|
| What counties exist? | 75 permanent county records |
| What schools exist? | Institution records by type and county |
| Where does this campus belong? | County relationship map |
| Is this place represented? | Representation status |
| Where should organizers focus? | Outreach priority |
| What page does this entity get? | Hub URL mapping |

**[REG-D01c]** Without the registry, pages are static content. With the registry, the platform is a **living map of Arkansas youth organizing**.

*Aligns with:* [LS-P1] Every County Exists · [LS-P2] Every College Exists · [LS-P7] Outreach Visibility

---

## REG-D02 — Authority & Source of Truth

**[REG-D02]** The registry is the **authoritative source of truth** for geographic and institutional organizing data.

**[REG-D02a]** Priority order when data conflicts:

```
1. Approved registry record (this system)
2. Approved Phase 2 model documents (Steps 2.2–2.9)
3. Live database (when connected — mirrors registry)
4. Static JSON seed files (bootstrap until DB live)
5. Page content hardcoded in components (never preferred)
```

**[REG-D02b]** No page, API, or dashboard may invent county names, institution lists, or representation status independently of the registry.

**[REG-D02c]** Participant records [USR-001] **reference** registry entities — they do not define them.

*Aligns with:* [ED-DB] Database as source of truth · [TR-MOTTO] Traceability

**Live files (bootstrap layer):**

```
data/registry/
├── counties.json
├── institutions.json
└── README.md
```

**Target layer (Phase 2 completion):** Netlify Postgres tables `DB-COUNTIES`, `DB-INSTITUTIONS` synced with registry doctrine.

---

## REG-D03 — Registry Scope

**[REG-D03]** The registry governs these entity types:

| Entity | Description | V1 Required |
|--------|-------------|-------------|
| **County** | One of 75 Arkansas counties | ✅ All 75 |
| **Institution** | College or university campus | ✅ All AR 4-year (expand in 2.3) |
| **Campus Hub** | Platform page for an institution | ✅ Per institution |
| **County Hub** | Platform page for a county | ✅ Per county |
| **Representation Status** | Organizing state of county/institution | ✅ |
| **Outreach Priority** | Where organizers should focus next | ✅ |
| **Future Categories** | CC, trade, high school placeholders | Hooks only in V1 |

**[REG-D03a]** The registry does **not** store participant personal data. Users link *to* registry entities; they are not embedded in them.

*Aligns with:* [OM-L1] People-first — individuals reference homes, homes don't contain people lists in the registry itself.

---

## REG-D04 — Counties as Permanent Organizing Units

**[REG-D04]** All **75 Arkansas counties** are permanent organizing units. No county is omitted.

**[REG-D04a]** Every county record represents a **youth organizing home** for:

- Students whose school is in that county
- Young adults (16–24) not in school who choose county-only affiliation

**[REG-D04b]** Counties are geographic anchors — not hierarchical superiors to campuses. Equal standing [CP-003, ER-001].

**[REG-D04c]** Formal field model defined in Step **2.2** (`COUNTY_REGISTRY_MODEL.md`).

**Minimum V1 county record includes:**

- Name · Slug · Region · County seat
- Population placeholder · Status · Page URL
- Youth hub status · Outreach priority

*Requirement:* [REG-001] · [CNTY-001] · [LS-P1]

---

## REG-D05 — Institutions as Campus Organizing Homes

**[REG-D05]** Every Arkansas college and university in V1 scope has an institution record.

**[REG-D05a]** Each institution is an independent organizing home — not an official arm of the school [DG-001, CP-005].

**[REG-D05b]** Institution records power:

- `/schools/[slug]` campus hub pages
- County relationship queries ("schools in Pulaski County")
- Directory search and filters
- Signup campus assignment [USR-001]

**[REG-D05c]** Formal field model defined in Step **2.3** (`INSTITUTION_REGISTRY_MODEL.md`).

*Requirement:* [REG-002] · [INST-001, INST-002] · [LS-P2]

---

## REG-D06 — Campus Hubs

**[REG-D06]** A **campus hub** is the platform's organizing page for one institution.

**[REG-D06a]** Route: `/schools/[slug]` · Page ID: `PAGE-INSTITUTION`

**[REG-D06b]** Every campus hub must provide:

- Institution identity (name, city, county, type)
- Public facts and brief history
- Independent platform disclaimer [DG-001]
- Join pathway to registration [LS-Q2]
- Representation status visibility [LS-P7]

**[REG-D06c]** Personalization rules defined in Step **2.7** (`CAMPUS_PAGE_PERSONALIZATION_RULES.md`).

*No campus hub may be blank for a seeded institution.*

---

## REG-D07 — County Hubs

**[REG-D07]** A **county hub** is the platform's organizing page for one county.

**[REG-D07a]** Route: `/county/[slug]` · Page ID: `PAGE-COUNTY`

**[REG-D07b]** Every county hub must provide:

- County identity and seat
- Youth organizing context
- Institutions in this county (from relationship map)
- Join pathway [LS-Q1]
- Representation and outreach status [LS-P7]

**[REG-D07c]** County hubs connect local geography to campus options — the honor-system signup flow starts here [OH-002].

*Requirement:* [CNTY-001] · 75 pages live [LS-CHK item 1]

---

## REG-D08 — Representation Status

**[REG-D08]** **Representation status** describes the current organizing state of a county or institution.

**[REG-D08a]** Status is **organizing state**, not enrollment verification or official affiliation.

**[REG-D08b]** Status applies uniformly to counties and institutions.

**[REG-D08c]** Full status vocabulary and transitions defined in Step **2.5** (`REPRESENTATION_STATUS_SYSTEM.md`).

**Preliminary V1 values** (subject to formalization in 2.5):

| Status | Meaning |
|--------|---------|
| `needs_outreach` | No active organizers — priority target |
| `needs_organizer` | Alias / legacy — maps to needs_outreach |
| `building` | Organizers joining, network forming |
| `active` | Recruiting and growing |
| `paused` | Intentionally inactive |
| `verified` | Reviewed and confirmed active |
| `needs_review` | Data or status requires admin review |

**[REG-D08d]** Status drives outreach gap dashboards [LS-P7] and map visualization.

---

## REG-D09 — Outreach Priority

**[REG-D09]** **Outreach priority** identifies where statewide organizers should focus recruitment effort.

**[REG-D09a]** Priority is derived from:

- Representation status (`needs_outreach` > `building` > `active`)
- Institution type and enrollment (larger campuses = higher potential reach)
- Geographic gaps (counties with zero represented institutions)
- Launch timeline [GM-V1] — Jul 12–14 campuses first

**[REG-D09b]** Priority levels (formalized in Step **2.6**):

| Level | Meaning |
|-------|---------|
| `critical` | Launch-week target — must have signup path |
| `high` | V1 outreach list |
| `medium` | Visible but not launch-blocking |
| `low` | Future expansion |

**[REG-D09c]** `v1Priority: true` on institution records marks launch-critical campuses.

*Dashboard requirements:* Step **2.6** (`OUTREACH_GAP_DASHBOARD_REQUIREMENTS.md`)

---

## REG-D10 — Future Expansion Categories

**[REG-D10]** The registry must support future institution types without schema redesign.

**Expansion sequence** [data/registry/README.md]:

| Version | Category | Registry `type` value |
|---------|----------|-------------------------|
| V1 | 4-year colleges & universities | `university` |
| V1.5 | Community colleges | `community_college` |
| V2 | Trade / technical schools | `trade_school` |
| V3 | High schools (self-registration) | `high_school` |

**[REG-D10a]** V1 registry includes **schema hooks** for future types — not full records.

**[REG-D10b]** Counties remain constant at 75. Institution count grows by version.

**[REG-D10c]** Seed data plan in Step **2.9** defines placeholder handling for unseeded categories.

*Aligns with:* [DG-009] Versioned Growth · [GM-ROAD]

---

## REG-D11 — Relationship to Participants

**[REG-D11]** Participants **select** registry entities at signup — they do not create them.

**[REG-D11a]** Honor-system flow [USR-001]:

```
Student:     County (registry) → Institution (registry) → Profile created
Non-student: County (registry) → Profile created (county-only)
```

**[REG-D11b]** Registry records are **stable**. Participant counts attach via separate user/network tables [DB-USERS, DB-NETWORKS].

**[REG-D11c]** Referral attribution [NET-003] links people to people — not to registry mutation.

*Aligns with:* [OM-L1] Individual as database root · [OM-L3, OM-L4] Organizing homes

---

## REG-D12 — Relationship to Pages & Routes

**[REG-D12]** Every registry entity maps to platform surfaces:

| Registry Entity | Public Route | Admin Surface |
|-----------------|--------------|---------------|
| County | `/county/[slug]` | Admin registry tab (future) |
| Institution | `/schools/[slug]` | Admin registry tab (future) |
| All counties | `/map` | Launch + Traceability tabs |
| All institutions | `/schools` | Launch tab |
| Search (future) | `/search` | — |
| Gap dashboard | `/map`, `/` stats | Admin Launch tab |

**[REG-D12a]** Slugs are **permanent URLs**. Slug changes require redirect strategy and BUILD-LOG entry.

**[REG-D12b]** County-to-institution relationships power cross-links on hub pages — defined in Step **2.4**.

---

## REG-D13 — Data Layer Architecture

**[REG-D13]** Registry data flows through three layers:

```
Layer 1 — Doctrine & Models (Phase 2 docs, Steps 2.1–2.10)
    ↓
Layer 2 — Seed Files (data/registry/*.json — bootstrap)
    ↓
Layer 3 — Database (Netlify Postgres — production source of truth)
    ↓
Layer 4 — API (read/write endpoints — REG/CNTY/INST requirements)
    ↓
Layer 5 — UI (pages, map, dashboard, signup)
```

**[REG-D13a]** Build vertically [ED-VS]: complete each layer for one entity type before starting the next.

**[REG-D13b]** JSON seed files remain valid export/import format [DG-008] even after DB is live.

**API targets** (from requirements registry):

- `API-COUNTIES-001` · `API-INSTITUTIONS-001`

---

## REG-D14 — Governance & Change Control

**[REG-D14]** Registry changes follow traceability protocol [TR-BR]:

1. Requirement exists (`REG-*`, `CNTY-*`, `INST-*`)
2. Model document updated (Phase 2 step artifact)
3. Seed data or DB migration applied
4. Pages/API updated
5. `requirements-registry.json` status updated
6. BUILD-LOG entry with ED-FD handoff

**[REG-D14a]** Adding an institution requires:

- Approved record in registry
- Disclaimer on hub page [DG-001]
- Source verification [Step 2.8]
- No trademark violations [DG-002, Step 2.7]

**[REG-D14b]** Representation status changes may be manual (admin) or automatic (participant threshold) — rules in Step **2.5**.

**[REG-D14c]** Steve approves new institution categories and constitutional changes [TR-SR].

---

## REG-D15 — Phase 2 Artifact Map

**[REG-D15]** Step 2.1 establishes authority. Steps 2.2–2.10 complete the registry blueprint:

| Step | Artifact | Delivers |
|------|----------|----------|
| **2.1** | `ARKANSAS_ORGANIZING_REGISTRY_DOCTRINE.md` | Purpose, authority, scope ✅ |
| 2.2 | `COUNTY_REGISTRY_MODEL.md` | 75-county field schema |
| 2.3 | `INSTITUTION_REGISTRY_MODEL.md` | Institution field schema |
| 2.4 | `COUNTY_INSTITUTION_RELATIONSHIP_MAP.md` | Cross-reference rules |
| 2.5 | `REPRESENTATION_STATUS_SYSTEM.md` | Status vocabulary & transitions |
| 2.6 | `OUTREACH_GAP_DASHBOARD_REQUIREMENTS.md` | Gap metrics & UI |
| 2.7 | `CAMPUS_PAGE_PERSONALIZATION_RULES.md` | Legal personalization bounds |
| 2.8 | `REGISTRY_SOURCE_AND_VERIFICATION_PROTOCOL.md` | Data provenance |
| 2.9 | `REGISTRY_SEED_DATA_PLAN.md` | Initial dataset spec |
| 2.10 | `PHASE_2_ARKANSAS_ORGANIZING_REGISTRY_BUILD_BIBLE.md` | Unified implementation guide |

**[REG-D15a]** Phase 2 is complete when Burt can implement all registry capabilities from documentation alone — without guessing.

---

## AC-010 — Acceptance Criteria

Step 2.1 is complete when:

- [x] **[AC-010a]** Registry defined as platform source of truth. `[REG-D02]`
- [x] **[AC-010b]** Scope covers counties, institutions, hubs, status, priority, expansion. `[REG-D03–D10]`
- [x] **[AC-010c]** Relationship to participants, pages, and data layers documented. `[REG-D11–D13]`
- [x] **[AC-010d]** Change control and Phase 2 artifact map established. `[REG-D14–D15]`
- [x] **[AC-010e]** Traceability links to REG-001, REG-002, LS-P1, LS-P2, LS-P7. `[requirements-registry.json]`

---

## Burt — Before Registry Implementation

```
1. Read this doctrine (PHASE-002.1)
2. Wait for model docs (2.2–2.9) before schema changes
3. Verify requirement ID in registry [TR-BR]
4. Build vertically: model → seed/DB → API → page [ED-VS]
5. Never hardcode county/institution lists in components
6. Update requirements-registry.json on completion
```

---

**Next Step:** 2.2 — County Registry Model (`COUNTY_REGISTRY_MODEL.md`)

*Principle trace: CP-006 Geographic Coverage → REG-001 → DB-COUNTIES → PAGE-COUNTY → TEST-CNTY-001*
