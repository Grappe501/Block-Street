# County Registry Model

**Document ID:** PHASE-002.2  
**Artifact:** `COUNTY_REGISTRY_MODEL.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 2 — Arkansas Organizing Registry

> **Every Arkansas county has an organizing home.**  
> A county is not merely a geographic boundary — it is one of the two primary organizing homes in the platform.  
> Every county should be treated like its own small community platform.

**Builds On:** [PHASE-002.1 Registry Doctrine](ARKANSAS_ORGANIZING_REGISTRY_DOCTRINE.md) · [REG-001, CNTY-001](../../data/requirements-registry.json) · [OM-L3](../build-steps/PHASE-001.5-ORGANIZING-MODEL.md)

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| CNTY-M01 | Purpose |
| CNTY-M02 | Guiding principle |
| CNTY-M03 | County registry philosophy |
| CNTY-M04 | Canonical county record |
| CNTY-M05 | Core identity fields |
| CNTY-M06 | Geography fields |
| CNTY-M07 | Demographics fields |
| CNTY-M08 | Organizing status fields |
| CNTY-M09 | County page (V1) |
| CNTY-M10 | County relationships (graph) |
| CNTY-M11 | County dashboard (V1) |
| CNTY-M12 | County health (future) |
| CNTY-M13 | County personalization |
| CNTY-M14 | County discovery |
| CNTY-M15 | Future expansion |
| CNTY-M16 | Canonical vs operational separation |
| CNTY-BG | Burt implementation guidance |
| AC-011 | Step 2.2 acceptance criteria |

**Graph node type:** `County` · **Relationship:** County **contains** Institution (Step 2.4)

---

## CNTY-M01 — Purpose

**[CNTY-M01]** This document defines the canonical **County Registry model** for the Arkansas Student & Youth Organizing Network.

**[CNTY-M01a]** Every Arkansas county is represented by **one permanent Registry record**.

**[CNTY-M01b]** Each county serves as both:

- A **geographic organizing region**
- A **complete digital organizing community**

**[CNTY-M01c]** Every county begins with **equal capabilities**. No county receives special architectural treatment [CP-003, ER-001].

*This is the first Registry object Burt will implement as a full graph node.*

---

## CNTY-M02 — Guiding Principle

**[CNTY-M02]**

> **Every Arkansas county has an organizing home.**

**[CNTY-M02a]** No county should ever appear incomplete or forgotten.

**[CNTY-M02b]** Even if there are zero participants, the county **already exists** and is waiting for its first organizer.

*Aligns with:* [LS-P1] Every County Exists · [LS-CHK item 1]

---

## CNTY-M03 — County Registry Philosophy

**[CNTY-M03]** A county is not merely a geographic boundary.

**[CNTY-M03a]** Within the platform, a county represents:

| Dimension | Meaning |
|-----------|---------|
| Community | Local organizing home |
| Relationships | People connected by place |
| Opportunities | Projects, recruitment, leadership |
| Local leadership | Emerges through participation — not platform assignment |
| Local projects | Future: county-scoped activity |
| Local organizing | County hub as entry point |

**[CNTY-M03b]** The software should make every county feel **alive** — even at zero participants.

**[CNTY-M03c]** Participants should feel: **"This is my county."**

---

## CNTY-M04 — Canonical County Record

**[CNTY-M04]** Every county receives exactly **one** canonical Registry record [REG-D10].

**[CNTY-M04a]** The record persists for the life of the platform [REG-D11].

**[CNTY-M04b]** Operational data (participants, events, messages) **references** the county — never duplicates county identity fields.

**Permanent identifier:** `CNTY-{slug}` or UUID · **URL:** `/county/{slug}` · **Page ID:** `PAGE-COUNTY`

---

## CNTY-M05 — Core Identity

**[CNTY-M05]** Each county record includes identity fields:

| Field | Type | Required V1 | Description |
|-------|------|-------------|-------------|
| `id` | string | ✅ | Permanent Registry ID (e.g. `CNTY-pulaski`) |
| `slug` | string | ✅ | URL-safe permanent slug (e.g. `pulaski`) |
| `name` | string | ✅ | Display name (e.g. `Pulaski County`) |
| `fipsCode` | string | ✅ | 5-digit Arkansas county FIPS (e.g. `05119`) |
| `state` | string | ✅ | Always `AR` |
| `stateName` | string | ✅ | Always `Arkansas` |

**[CNTY-M05a]** Slugs are **immutable** once published. FIPS enables interoperability with census, maps, and external data [DG-008].

---

## CNTY-M06 — Geography

**[CNTY-M06]** Geographic context fields:

| Field | Type | Required V1 | Description |
|-------|------|-------------|-------------|
| `countySeat` | string | ✅ | Administrative seat (e.g. `Little Rock`) |
| `region` | string | ✅ | Arkansas region classification |
| `mapBoundaryRef` | string | ⏳ V1.1 | SVG path ID or GeoJSON reference |
| `neighboringCounties` | string[] | Future | Slugs of adjacent counties |

**[CNTY-M06a]** **Arkansas region values** (V1 adopted):

| Region | Description |
|--------|-------------|
| `delta` | Arkansas Delta |
| `ozarks` | Ozarks / Northwest |
| `river_valley` | Arkansas River Valley |
| `central` | Central Arkansas |
| `southwest` | Southwest Arkansas |
| `southeast` | Southeast Arkansas |
| `northeast` | Northeast Arkansas |
| `northwest` | Northwest (non-Ozark fringe) |

*Assign during seed data migration (Step 2.9).*

---

## CNTY-M07 — Demographics

**[CNTY-M07]** Public demographic placeholders:

| Field | Type | Required V1 | Description |
|-------|------|-------------|-------------|
| `population` | number | ✅ | Latest population estimate |
| `populationSource` | string | ✅ | e.g. `US Census 2020` |
| `populationUpdated` | string | ✅ | ISO date of estimate |
| `demographicsNotes` | string | Optional | Future: age distribution, etc. |

**[CNTY-M07a]** When uncertain, use placeholder with `verificationStatus: needs_review` [REG-D14].

**[CNTY-M07b]** Future: youth population estimate (16–24) for outreach prioritization.

---

## CNTY-M08 — Organizing Status

**[CNTY-M08]** Organizing status fields — **operational overlays** on canonical record:

| Field | Type | Storage | Description |
|-------|------|---------|-------------|
| `representationStatus` | enum | Registry + DB | Organizing state [Step 2.5] |
| `outreachPriority` | enum | Registry + DB | `critical` · `high` · `medium` · `low` |
| `organizerCount` | number | Operational DB | Active organizers (computed) |
| `participantCount` | number | Operational DB | Registered participants (computed) |
| `lastActivityDate` | string | Operational DB | ISO date of last county activity |
| `verificationStatus` | enum | Registry | `verified` · `needs_review` |

**[CNTY-M08a]** **Canonical fields** (identity, geography, demographics) change rarely.

**[CNTY-M08b]** **Status fields** change frequently — stored in Registry for bootstrap, computed from DB when live.

**V1 default for unseeded status:** `needs_outreach` · `outreachPriority: medium`

*Full status vocabulary:* Step 2.5 `REPRESENTATION_STATUS_SYSTEM.md`

---

## CNTY-M09 — County Page

**[CNTY-M09]** Every county automatically receives its own organizing page.

**Route:** `/county/[slug]` · **Requirement:** [CNTY-001] · **75 pages required** [LS-CHK]

### V1 Page Sections

| Section | Content |
|---------|---------|
| County overview | Name, seat, region |
| County description | Brief community context |
| Organizing mission | Youth hub purpose (16–24) |
| Institutions in county | Graph query: county **contains** institutions |
| Representation status | Current organizing state |
| Join button | Links to `/join?county={slug}` |
| Personal invite path | Future: county organizer share link |
| Youth hub information | Non-student county-only path [OH-002] |
| Platform disclaimer | Independence statement |

### Future Page Sections (not V1)

Events · Volunteer opportunities · Committees · Projects · Local resources · Community discussions

**[CNTY-M09a]** No county page may be blank or 404 for a Registry record.

---

## CNTY-M10 — County Relationships (Graph Edges)

**[CNTY-M10]** Every county is a **graph node** with typed relationships [REG-D16]:

| Relationship | Target | V1 | Direction |
|--------------|--------|-----|-----------|
| `contains` | Institution | ✅ | County → Institution |
| `contains` | Participant | ✅ | County → User (operational) |
| `contains` | Event | Future | County → Event |
| `contains` | Committee | Future | County → Committee |
| `contains` | Volunteer project | Future | County → Project |
| `contains` | Campaign | Future | County → Campaign |
| `adjacent_to` | County | Future | County ↔ County |

**[CNTY-M10a]** V1 critical edge: **County contains Institution** — formalized in Step 2.4.

**[CNTY-M10b]** Query pattern: "All institutions in Pulaski County" = traverse `contains` edges, not string match alone (though `institution.county` slug is denormalized for performance).

---

## CNTY-M11 — County Dashboard

**[CNTY-M11]** Every county has an internal dashboard (admin / future county organizer view).

### V1 Metrics

| Metric | Source |
|--------|--------|
| Participants | Operational DB count |
| Personal networks | Sum of network sizes in county |
| Institutions represented | Institutions with status ≥ `building` |
| Institutions needing outreach | Institutions with `needs_outreach` |
| Recruitment activity | Referrals in date range |
| Recent growth | New participants (7/30 days) |

**[CNTY-M11a]** V1 dashboard may live in Admin Workbench until county-level organizer roles exist.

**[CNTY-M11b]** Future dashboards expand substantially — schema hooks only in V1.

---

## CNTY-M12 — County Health (Future)

**[CNTY-M12]** The platform should eventually measure **community health**.

**Potential indicators** (not V1):

- Participant activity · Volunteer participation · Recruitment momentum
- Mentorship · Event participation · Committee activity
- Leadership development · Community projects

**[CNTY-M12a]** Health metrics encourage **sustainable organizing** — not competition between counties [CP-003].

**[CNTY-M12b]** Document as future extension; do not implement in V1 [LS-DEF].

---

## CNTY-M13 — County Personalization

**[CNTY-M13]** Each county page should feel **unique** while sharing structure.

**Personalization content** (public facts only):

| Content | V1 | Notes |
|---------|-----|-------|
| Historical overview | ✅ | Public domain / cited sources |
| County facts | ✅ | Seat, region, population |
| County statistics | ✅ | From Registry demographics |
| Landmarks | Optional | Public information |
| Community characteristics | ✅ | Brief descriptive text |
| Educational institutions | ✅ | From graph relationship |
| Local opportunities | Future | |
| Licensed local photography | Future | Proper licensing required |

**[CNTY-M13a]** No partisan content [DG-003]. Descriptive, not prescriptive [REG-D09].

---

## CNTY-M14 — County Discovery

**[CNTY-M14]** Participants discover counties through:

| Channel | V1 |
|---------|-----|
| Interactive map | `/map` (partial — list live, SVG pending) |
| Search | Future `/search` |
| Institution pages | County link on campus hub |
| Participant profiles | County affiliation display |
| Recommendations | Future |
| Regional exploration | Filter by `region` |

**[CNTY-M14a]** Every county is **equally discoverable** — no featured/privileged counties [ER-001].

---

## CNTY-M15 — Future County Expansion

**[CNTY-M15]** Registry supports future capabilities without structural redesign:

- County ambassadors · Regional collaboration · County analytics
- Volunteer directories · Community resource directories
- Partner organizations · Emergency communication · Issue dashboards

**[CNTY-M15a]** Extend via new relationship types and operational modules — not Registry replacement [REG-D15].

---

## CNTY-M16 — Canonical vs Operational Separation

**[CNTY-M16]** Clear field ownership:

### Canonical (Registry record)

`id`, `slug`, `name`, `fipsCode`, `state`, `countySeat`, `region`, `population`, `populationSource`, `description`, `historySummary`

### Operational (computed / separate tables)

`organizerCount`, `participantCount`, `lastActivityDate`, messages, events, committees

### Hybrid (Registry default, DB override when live)

`representationStatus`, `outreachPriority`, `verificationStatus`

**[CNTY-M16a]** Bootstrap JSON holds canonical + default status. DB becomes authoritative for operational counts when connected.

---

## Canonical Record Example

```json
{
  "id": "CNTY-pulaski",
  "slug": "pulaski",
  "name": "Pulaski County",
  "fipsCode": "05119",
  "state": "AR",
  "stateName": "Arkansas",
  "countySeat": "Little Rock",
  "region": "central",
  "population": 399125,
  "populationSource": "US Census 2020",
  "populationUpdated": "2020-04-01",
  "description": "Arkansas's most populous county, home to the state capital and multiple colleges and universities.",
  "historySummary": "Named for the Pulaski Legion; established 1815.",
  "representationStatus": "needs_outreach",
  "outreachPriority": "high",
  "verificationStatus": "needs_review",
  "pageUrl": "/county/pulaski",
  "youthHubEnabled": true
}
```

**Current bootstrap** (`counties.json`): minimal `{ slug, name }` only — migrate to full schema in Step 2.9.

---

## CNTY-BG — Burt Implementation Guidance

**[CNTY-BG]** Implementation should:

| # | Action |
|---|--------|
| 1 | Create all **75 counties** immediately with full canonical identity |
| 2 | Assign **permanent identifiers** (`CNTY-{slug}`) |
| 3 | Support **stable URLs** (`/county/{slug}`) |
| 4 | Maintain **normalized relationships** to institutions [Step 2.4] |
| 5 | **Separate** canonical county data from operational activity |
| 6 | Design for **future expansion** without schema redesign |
| 7 | Do **not** hardcode county lists in components — read Registry |
| 8 | Migrate `counties.json` per Step **2.9** seed plan — not before approval |

**Build order [ED-VS]:** Model (2.2) → Relationships (2.4) → Seed migration (2.9) → DB → API → Page enhancements

---

## AC-011 — Acceptance Criteria

Step 2.2 is complete when:

- [x] **[AC-011a]** All 75 counties recognized as permanent organizing communities. `[CNTY-M01, CNTY-M02]`
- [x] **[AC-011b]** County record structure defined with field specifications. `[CNTY-M05–M08]`
- [x] **[AC-011c]** County page conceptually specified for V1. `[CNTY-M09]`
- [x] **[AC-011d]** Organizing and operational data clearly separated. `[CNTY-M16]`
- [x] **[AC-011e]** Graph relationships and future expansion documented. `[CNTY-M10, CNTY-M15]`
- [x] **[AC-011f]** Burt has complete conceptual model for County Registry implementation. `[CNTY-BG]`

---

## Recommendation for Step 2.3 (Steve)

Before Institution Registry Model: define an **Educational Institution Canonical Profile** with standardized sections every campus page shares:

- Identity · History · Academics · Student life · Community context
- Organizing status · Participation metrics · Public facts and references

This ensures consistency while allowing each campus its own identity — and makes community colleges, trade schools, and high schools straightforward to add later (same profile structure, minor type variations).

*Captured for Step 2.3 — not implemented in 2.2.*

---

**Next Step:** 2.3 — Institution Registry Model (`INSTITUTION_REGISTRY_MODEL.md`)

*Trace: CP-006 → REG-001 → CNTY-M04 → DB-COUNTIES → contains → DB-INSTITUTIONS → PAGE-COUNTY → TEST-CNTY-007*
