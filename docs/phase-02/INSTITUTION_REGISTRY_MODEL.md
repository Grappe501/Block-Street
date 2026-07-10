# Educational Institution Registry Model

**Document ID:** PHASE-002.3  
**Artifact:** `INSTITUTION_REGISTRY_MODEL.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 2 — Arkansas Organizing Registry

> **Every educational institution deserves its own organizing home.**  
> We're not creating a directory of schools — we're creating **digital homes** for every educational community in Arkansas.

**Design intent for Burt:**

> Every campus page should feel like walking onto that campus — not by copying university branding, but by respecting its identity, history, and community.

Students should immediately feel: **"This is my campus community."**

**Builds On:** [PHASE-002.1 Registry Doctrine](ARKANSAS_ORGANIZING_REGISTRY_DOCTRINE.md) · [PHASE-002.2 County Model](COUNTY_REGISTRY_MODEL.md) · [REG-002, INST-001, INST-002](../../data/requirements-registry.json) · [OM-L4](../build-steps/PHASE-001.5-ORGANIZING-MODEL.md)

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| INST-M01 | Purpose |
| INST-M02 | Guiding principle |
| INST-M03 | Registry scope (V1/V2/Future) |
| INST-M04 | Canonical institution record |
| INST-M05 | Educational Institution Canonical Profile |
| INST-M06 | Core identity fields |
| INST-M07 | Historical information |
| INST-M08 | Campus profile (descriptive) |
| INST-M09 | Public information & attribution |
| INST-M10 | Organizing metadata |
| INST-M11 | Institution relationships (knowledge graph) |
| INST-M12 | Campus page (V1) |
| INST-M13 | Campus personality |
| INST-M14 | Discovery |
| INST-M15 | Representation lifecycle |
| INST-M16 | Future educational expansion |
| INST-M17 | Knowledge graph architecture |
| INST-M18 | Canonical vs operational separation |
| INST-BG | Burt implementation guidance |
| AC-012 | Step 2.3 acceptance criteria |

**Graph node type:** `Institution` · **Primary edge:** Institution **belongs_to** County (Step 2.4)

---

## INST-M01 — Purpose

**[INST-M01]** This document defines the canonical **Educational Institution Registry** for the Arkansas Student & Youth Organizing Network.

**[INST-M01a]** Every educational institution represented by the platform receives **one permanent Registry record**.

**[INST-M01b]** The Registry is the authoritative source of truth describing each institution and serves as the foundation for:

- Campus pages · Participant onboarding · Search
- Outreach planning · Analytics · Future expansion

**[INST-M01c]** The record exists even if the institution has **zero participants**.

*Aligns with:* [LS-P2] Every College Exists · [LS-CHK item 2]

---

## INST-M02 — Guiding Principle

**[INST-M02]**

> **Every educational institution deserves its own organizing home.**

**[INST-M02a]** The platform should make every student feel there is **already a place waiting for them** before they ever register.

**[INST-M02b]** Equal discoverability — no privileged campuses [ER-001, CP-003].

---

## INST-M03 — Registry Scope

### Version 1 [INST-M03a]

| Type | `institutionType` value |
|------|-------------------------|
| Public universities | `public_university` |
| Private universities | `private_university` |
| Public colleges | `public_college` |
| Private colleges | `private_college` |

*Legacy bootstrap mapping: `type: university` + `sector: public|private`*

### Version 2 [INST-M03b]

Community colleges · Technical colleges · Trade schools

| Type | `institutionType` value |
|------|-------------------------|
| Community college | `community_college` |
| Technical college | `technical_college` |
| Trade school | `trade_school` |

### Future Versions [INST-M03c]

High schools · Career centers · Adult education centers · Additional types as approved

| Type | `institutionType` value |
|------|-------------------------|
| High school | `high_school` |
| Career center | `career_center` |
| Adult education | `adult_education` |

**[INST-M03d]** Registry supports expansion **without redesign** — new types inherit Canonical Profile [INST-M05].

---

## INST-M04 — Canonical Institution Record

**[INST-M04]** Each institution receives exactly **one** permanent Registry record [REG-D10].

**[INST-M04a]** Operational modules reference this record — never duplicate institutional information.

**[INST-M04b]** Permanent identifier: `INST-{slug}` · **URL:** `/schools/{slug}` · **Page ID:** `PAGE-INSTITUTION`

---

## INST-M05 — Educational Institution Canonical Profile

**[INST-M05]** Every institution — regardless of type — shares the **same canonical profile structure**. Only type-specific optional fields vary.

This is the standard every campus page implements:

| Section | Profile Block | Storage |
|---------|---------------|---------|
| 1 | **Identity** | Canonical |
| 2 | **History** | Canonical |
| 3 | **Academics** | Canonical (Campus Profile) |
| 4 | **Student Life** | Canonical |
| 5 | **Community Context** | Canonical |
| 6 | **Organizing Status** | Hybrid |
| 7 | **Participation Metrics** | Operational |
| 8 | **Public Facts & References** | Canonical |

**[INST-M05a]** Consistency across pages · uniqueness through content, not structure.

**[INST-M05b]** Community colleges, trade schools, and high schools **inherit this profile** with minor field variations [INST-M16].

---

## INST-M06 — Core Identity

**[INST-M06]** Identity fields (Canonical Profile §1):

| Field | Type | Required V1 | Description |
|-------|------|-------------|-------------|
| `id` | string | ✅ | Permanent ID (e.g. `INST-ua-fayetteville`) |
| `slug` | string | ✅ | Immutable URL slug |
| `name` | string | ✅ | Official institution name |
| `commonName` | string | ✅ | Short/common name (e.g. `U of A`) |
| `institutionType` | enum | ✅ | See INST-M03 |
| `sector` | enum | ✅ | `public` · `private` |
| `hbcu` | boolean | ✅ | Historically Black College/University |
| `county` | string | ✅ | County slug (graph: belongs_to) |
| `city` | string | ✅ | City name |
| `state` | string | ✅ | Always `AR` |
| `latitude` | number | Future | Mapping support |
| `longitude` | number | Future | Mapping support |

---

## INST-M07 — Historical Information

**[INST-M07]** History fields (Canonical Profile §2):

| Field | Type | Required V1 | Description |
|-------|------|-------------|-------------|
| `founded` | number | ✅ | Founding year |
| `founder` | string | Optional | Where publicly documented |
| `historySummary` | string | ✅ | Brief historical narrative |
| `milestones` | string[] | Optional | Major dated milestones |
| `publicMission` | string | Optional | Publicly available mission statement |
| `notableTraditions` | string[] | Optional | Public traditions (descriptive) |

**[INST-M07a]** All content from **public sources** — cited in Public Facts [INST-M09].

*Bootstrap field:* `culture` → migrates to `historySummary` + `studentLifeSummary` in Step 2.9.

---

## INST-M08 — Campus Profile (Academics)

**[INST-M08]** Descriptive, **not promotional** (Canonical Profile §3):

| Field | Type | Required V1 | Description |
|-------|------|-------------|-------------|
| `enrollment` | number | ✅ | Total enrollment estimate |
| `enrollmentUndergraduate` | number | Optional | Undergraduate count |
| `enrollmentGraduate` | number | Optional | Graduate count |
| `campusSetting` | enum | Optional | `urban` · `suburban` · `rural` |
| `residentialProfile` | enum | Optional | `residential` · `commuter` · `mixed` |
| `academicCalendar` | enum | Optional | `semester` · `quarter` · `other` |
| `academicStrengths` | string[] | Optional | Publicly documented strengths |

---

## INST-M09 — Public Information & References

**[INST-M09]** Public facts (Canonical Profile §8):

| Field | Type | Required V1 | Description |
|-------|------|-------------|-------------|
| `website` | string | ✅ | Official website URL |
| `publicContact` | string | Optional | Public contact (not private) |
| `referenceSources` | string[] | ✅ | URLs: IPEDS, NCES, official site, etc. |
| `dataSourceAttribution` | string | ✅ | e.g. `IPEDS 2023, institution website` |
| `lastReviewed` | string | ✅ | ISO date of last data review |
| `disclaimer` | string | ✅ | Independence statement [DG-001] |

**Required disclaimer:**
> An independent student organizing network for students connected to [Institution Name]. Not affiliated with or endorsed by the institution.

---

## INST-M10 — Organizing Metadata

**[INST-M10]** Organizing information (Canonical Profile §6–7) — **platform-owned**, independent of the institution:

| Field | Type | Storage | Description |
|-------|------|---------|-------------|
| `representationStatus` | enum | Hybrid | Lifecycle stage [INST-M15] |
| `organizerAssigned` | boolean | Operational | Lead organizer identified |
| `participantCount` | number | Operational | Registered participants |
| `networkCount` | number | Operational | Active personal networks |
| `lastOrganizingActivity` | string | Operational | ISO date |
| `recruitmentPriority` | enum | Hybrid | Outreach priority |
| `verificationStatus` | enum | Registry | `verified` · `needs_review` |
| `v1Priority` | boolean | Registry | Launch-critical campus |

**[INST-M10a]** Organizing metadata changes frequently; canonical identity does not.

---

## INST-M11 — Institution Relationships

**[INST-M11]** Every institution connects via **explicit graph edges** [REG-D16] — not duplicated strings alone.

| Relationship | Target | V1 | Direction |
|--------------|--------|-----|-----------|
| `belongs_to` | County | ✅ | Institution → County |
| `has_students` | Participant | ✅ | Institution → User (operational) |
| `hosts` | Event | Future | Institution → Event |
| `contains` | Committee | Future | Institution → Committee |
| `neighbors` | Institution | Future | Institution ↔ Institution |
| `shares_region` | Institution | Future | Institution ↔ Institution |
| `supports` | Project | Future | Institution → Project |
| `participates_in` | Initiative | Future | Institution → Statewide initiative |

**[INST-M11a]** `county` slug field is **denormalized** for query performance; graph is authoritative (Step 2.4).

---

## INST-M12 — Campus Page

**[INST-M12]** Every institution automatically receives `/schools/[slug]`.

### V1 Page Sections (maps to Canonical Profile)

| Section | Profile Block | Content |
|---------|---------------|---------|
| Header | Identity | Name, type, status badges, color-inspired design |
| Mission for organizers | Organizing | Why students organize here |
| Overview | Identity + History | Summary, founding, location |
| Historical summary | History | `historySummary` |
| County location | Identity | Link to county hub |
| Enrollment snapshot | Academics | Enrollment figure |
| Student life | Student Life | Community character |
| Community context | Community | Local/regional context |
| Representation status | Organizing | Current lifecycle stage |
| Join button | — | `/join?county={}&school={}` |
| Share button | — | Future: campus share link |
| Recruitment invitation | — | CTA for first organizer |
| Disclaimer | Public Facts | Independence statement |

### Future (not V1)

Events · Committees · Volunteer opportunities · Student projects · Discussions · Leadership · Resource library

*Requirement:* [INST-002] · [LS-P2]

---

## INST-M13 — Campus Personality

**[INST-M13]** Each page feels **unique** through content and design — not trademark reproduction [DG-002, Step 2.7].

**Personalization through:**

| Element | Approach |
|---------|----------|
| Public history | Canonical Profile §2 |
| Campus facts | Canonical Profile §3 |
| Location | City, county, setting |
| Community context | Canonical Profile §5 |
| Student population | Enrollment data |
| Academic strengths | Publicly documented only |
| Photography | Properly licensed only (future) |
| Visual design | **Original** palettes inspired by community identity — not logos/seals/mascots |

**[INST-M13a]** Bootstrap: `colors.primary` / `colors.secondary` — inspired by publicly known colors, not trademark reproduction.

**[INST-M13b]** Student Life block (Canonical Profile §4):

| Field | Description |
|-------|-------------|
| `studentLifeSummary` | Descriptive community character |
| `campusCultureNotes` | Publicly sourced student life facts |

---

## INST-M14 — Discovery

**[INST-M14]** Institutions discovered through:

| Channel | V1 |
|---------|-----|
| Interactive Arkansas map | `/map` |
| Institution directory | `/schools` |
| Institution search | Partial — full in `/search` |
| County pages | Graph: county contains institutions |
| Nearby recommendations | Future |
| Categories / type filters | `/schools` filters |
| Recommendation engine | Future |

**[INST-M14a]** Every institution **equally discoverable** [ER-001].

---

## INST-M15 — Representation Lifecycle

**[INST-M15]** Each institution progresses through organizing stages:

| Stage | `representationStatus` | Meaning |
|-------|--------------------------|---------|
| Needs Outreach | `needs_outreach` | No organizers — priority target |
| Initial Contact | `initial_contact` | Outreach begun |
| Organizer Assigned | `organizer_assigned` | Lead identified |
| Building | `building` | Network forming |
| Active | `active` | Recruiting |
| Thriving | `thriving` | Self-sustaining growth |
| Review Needed | `under_review` | Status requires review |
| Inactive | `inactive` | Paused organizing |

**[INST-M15a]** Lifecycle supports outreach and reporting **without changing** canonical identity fields.

**[INST-M15b]** Full vocabulary formalized in Step 2.5 (unified with county status).

*Legacy:* `needs_organizer` → `needs_outreach`

---

## INST-M16 — Future Educational Expansion

**[INST-M16]** Additional institution types **inherit Canonical Profile** [INST-M05].

| Type | Profile variations |
|------|-------------------|
| Community college | May omit graduate enrollment |
| Trade school | Emphasize program types |
| High school | Age scope 16–18; self-registration flow (V3) |

**[INST-M16a]** Only **type-specific optional fields** vary — structure remains constant.

---

## INST-M17 — Knowledge Graph Architecture

**[INST-M17]** The Institution Registry is not a flat table — it is a **knowledge graph node**.

**Architectural elevation:** Build a Registry, not a collection of pages.

```
Institution
    │
    ├── belongs_to ──────► County
    ├── has_students ────► Participants
    ├── hosts ───────────► Events
    ├── contains ────────► Committees
    ├── neighbors ───────► Other Institutions
    ├── shares_region ───► Institutions (same region)
    ├── linked_to ───────► Alumni (future)
    ├── supports ────────► Projects
    └── participates_in ─► Statewide Initiatives
```

**[INST-M17a]** V1 implements: `belongs_to` (County), `has_students` (operational).

**[INST-M17b]** Graph orientation enables without V1 scope:

- "Which nearby campuses have active environmental committees?"
- "What counties have no participating institutions?"
- Richer search, recommendations, analytics, future AI [REG-D16]

**[INST-M17c]** Does not change V1 delivery — **highest-leverage architectural decision** for future versions.

*Formalized with county edges in Step 2.4.*

---

## INST-M18 — Canonical vs Operational Separation

**[INST-M18]** Field ownership:

### Canonical (Registry)

Identity · History · Academics · Student Life · Community Context · Public Facts · Disclaimer · Visual inspiration (colors)

### Operational (DB computed)

`participantCount`, `networkCount`, `lastOrganizingActivity`, events, committees, messages

### Hybrid (Registry default, DB live override)

`representationStatus`, `recruitmentPriority`, `verificationStatus`, `v1Priority`

---

## Canonical Record Example

```json
{
  "id": "INST-uca",
  "slug": "uca",
  "name": "University of Central Arkansas",
  "commonName": "UCA",
  "institutionType": "public_university",
  "sector": "public",
  "hbcu": false,
  "county": "faulkner",
  "city": "Conway",
  "state": "AR",
  "founded": 1907,
  "historySummary": "Public university in Central Arkansas, founded as Arkansas State Normal School.",
  "studentLifeSummary": "Known for education, nursing, and a tight-knit campus community in Conway.",
  "communityContext": "Anchor institution in Faulkner County and the Central Arkansas region.",
  "enrollment": 9790,
  "campusSetting": "suburban",
  "residentialProfile": "mixed",
  "website": "https://uca.edu",
  "referenceSources": ["https://uca.edu", "https://nces.ed.gov/collegenavigator"],
  "dataSourceAttribution": "IPEDS 2023, UCA official website",
  "lastReviewed": "2026-07-10",
  "disclaimer": "An independent student organizing network for students connected to UCA. Not affiliated with or endorsed by the institution.",
  "colors": { "primary": "#4F2D7F", "secondary": "#808285" },
  "representationStatus": "building",
  "recruitmentPriority": "high",
  "verificationStatus": "needs_review",
  "v1Priority": true
}
```

**Current bootstrap** (`institutions.json`): partial fields — migrate in Step 2.9.

---

## INST-BG — Burt Implementation Guidance

**[INST-BG]** Implementation should:

| # | Action |
|---|--------|
| 1 | Create **stable Institution IDs** (`INST-{slug}`) |
| 2 | **Normalize** county relationships via graph [Step 2.4] |
| 3 | **Separate** factual data from organizing activity |
| 4 | Implement **Canonical Profile** sections on every campus page |
| 5 | Allow **future institution types** without schema redesign |
| 6 | Support **mapping and search** via graph queries |
| 7 | **Preserve** canonical records permanently |
| 8 | Respect identity without **unauthorized branding** [DG-002, Step 2.7] |
| 9 | Migrate `institutions.json` in Step **2.9** — not before |

**Campus page test:** Does this feel like walking onto the campus — through respect, not copying?

---

## AC-012 — Acceptance Criteria

Step 2.3 is complete when:

- [x] **[AC-012a]** Canonical institution model defined with Canonical Profile. `[INST-M04, INST-M05]`
- [x] **[AC-012b]** V1 scope established (universities & colleges). `[INST-M03a]`
- [x] **[AC-012c]** Future institution expansion supported. `[INST-M03b–c, INST-M16]`
- [x] **[AC-012d]** Organizing metadata separated from factual data. `[INST-M10, INST-M18]`
- [x] **[AC-012e]** Campus page expectations documented. `[INST-M12, INST-M13]`
- [x] **[AC-012f]** Knowledge graph architecture established. `[INST-M17]`
- [x] **[AC-012g]** Burt has complete conceptual model for Institution Registry. `[INST-BG]`

---

**Next Step:** 2.4 — County-Institution Relationship Map (`COUNTY_INSTITUTION_RELATIONSHIP_MAP.md`)

*Trace: CP-006 → REG-002 → INST-M04 → belongs_to → CNTY-M04 → PAGE-INSTITUTION → TEST-INST-001*
