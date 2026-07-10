# Build Volume 2.2 — Canonical Entity Dictionary

### Data Architecture Bible

**Document ID:** VOLUME-002.2 · **DAB-003**  
**Artifact:** `CANONICAL_ENTITY_DICTIONARY.md`  
**Status:** Canonical  
**Priority:** Critical

**Builds on:** [2.1 Data Philosophy](DATA_PHILOSOPHY.md) [DAB-002]  
**Live spec:** `data/registry/canonical-entity-dictionary.json`

---

## DAB-CED01 — Purpose

**[DAB-CED01]** The Canonical Entity Dictionary defines **every primary entity** in the COS — purpose, fields, relationships, and lifecycle.

**[DAB-CED01a]** This is the authoritative catalog Burt uses before writing APIs, migrations, or search mappings.

---

## DAB-CED02 — Entity Template

**[DAB-CED02]** Every entity entry includes:

```text
Purpose       — why this entity exists
Required      — mandatory fields with types
Optional      — optional fields with types
Relationships — inbound/outbound edges
Lifecycle     — status enum and transitions
Ownership     — platform | community | participant
Permissions   — default visibility class [KDG-001]
Audit         — events emitted on change
```

---

## DAB-CED03 — Identity & Place Entities

### Participant [DAB-E01]

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | uuid | ✓ | PK |
| `auth_user_id` | uuid | ✓ | Supabase auth link |
| `display_name` | text | ✓ | Public name |
| `slug` | text | ✓ | Share URL |
| `email` | text | ✓ | Unique |
| `journey_stage` | enum | ✓ | [JRN-001] |
| `visibility_level` | enum | ✓ | [TPS-001] |
| `home_community_id` | uuid | | Primary community |
| `county_id` | uuid | | Geographic home |
| `institution_id` | uuid | | Campus affiliation |
| `civic_passport_ref` | text | | [CJT-001] |

**Lifecycle:** `registered` → `connected` → `contributing` → `leading` → `mentoring` → `legacy`  
**Relationships:** member_of communities, mentors/mentored_by, invited_by, participates_in missions/events  
**Phase:** PEP-001 · PHQ-001

### Community [DAB-E02]

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | uuid | ✓ | PK |
| `name` | text | ✓ | |
| `slug` | text | ✓ | Unique |
| `charter_ref` | uuid | | [CCN-001] |
| `growth_stage` | enum | ✓ | [CGS-001] |
| `community_type` | enum | ✓ | campus, county, cohort, institution |
| `county_id` | uuid | | |
| `institution_id` | uuid | | |
| `genome_template_id` | uuid | | [GOS-M10] |

**Lifecycle:** `seed` → `forming` → `active` → `thriving` → `renewing` → `archived`  
**Phase:** COS-001 · CCN-001

### County [DAB-E03]

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | uuid | ✓ | PK |
| `name` | text | ✓ | |
| `slug` | text | ✓ | 75 AR counties |
| `fips_code` | text | ✓ | |
| `state_code` | text | ✓ | `AR` |

**Lifecycle:** `reference` (static seed) · communities attach  
**Phase:** CNTY-001 · ADT-002

### Educational Institution [DAB-E04]

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | uuid | ✓ | PK |
| `name` | text | ✓ | |
| `slug` | text | ✓ | |
| `institution_type` | enum | ✓ | university, college, community_college, technical_college, trade_school, nursing_college |
| `county_id` | uuid | ✓ | |
| `is_founding_council` | boolean | | Launch cohort |

**Phase:** INST-001

---

## DAB-CED04 — Organizing Entities

### Committee / Team [DAB-E05]

**Purpose:** Working group within a community [TWG-001].  
**Key fields:** `name`, `community_id`, `team_type`, `charter_ref`, `status`  
**Lifecycle:** `draft` → `active` → `paused` → `archived`

### Mission [DAB-E06]

**Purpose:** Purpose container — the "why" [MDS-001 · MPS-001].  
**Key fields:** `title`, `community_id`, `mission_canvas_ref`, `status`, `owner_id`, `mor_ref` [ACN-001]  
**Lifecycle:** `draft` → `active` → `completed` → `archived`

### Project [DAB-E07]

**Purpose:** Deliverable work package [EOS-001].  
**Key fields:** `title`, `mission_id`, `community_id`, `status`, `owner_id`, `due_date`  
**Lifecycle:** `planned` → `in_progress` → `blocked` → `done` → `archived`

### Event / Experience [DAB-E08]

**Purpose:** Time-bound gathering [EEOS-001].  
**Key fields:** `title`, `starts_at`, `ends_at`, `timezone`, `location_ref`, `community_id`, `mission_id`, `status`  
**Lifecycle:** `draft` → `scheduled` → `live` → `completed` → `cancelled`

---

## DAB-CED05 — Growth & Opportunity Entities

### Opportunity [DAB-E09]

**Purpose:** Invitation to participate [OEX-001 · OBE-001].  
**Key fields:** `title`, `opportunity_type`, `community_id`, `capacity`, `status`, `closes_at`  
**Lifecycle:** `open` → `filled` → `closed` → `archived`

### Partnership [DAB-E10]

**Purpose:** Institution or org collaboration [IPS-001].  
**Key fields:** `name`, `partner_type`, `community_id`, `status`, `agreement_ref`  
**Lifecycle:** `proposed` → `active` → `paused` → `ended`

### Resource [DAB-E11]

**Purpose:** Shared asset — room, equipment, fund, contact [CCS-001].  
**Key fields:** `name`, `resource_type`, `community_id`, `availability_ref`, `status`

---

## DAB-CED06 — Memory & Knowledge Entities

### Story [DAB-E12]

**Purpose:** Cultural memory [CST-001].  
**Key fields:** `title`, `narrative`, `community_id`, `author_id`, `story_type`, `published_at`, `visibility`  
**Lifecycle:** `draft` → `review` → `published` → `archived`

### Lesson [DAB-E13]

**Purpose:** Captured improvement [LIS-001].  
**Key fields:** `title`, `summary`, `source_mission_id`, `community_id`, `confidence`, `reviewed_at`  
**Lifecycle:** `draft` → `validated` → `published` → `superseded`

### Knowledge Object [DAB-E14]

**Purpose:** Playbook, decision, FAQ, policy [CKLS-001].  
**Key fields:** `title`, `object_type`, `body`, `community_id`, `provenance`, `reviewed_by`  
**Types:** `playbook`, `decision_record`, `faq`, `policy`, `playbook_step`  
**Lifecycle:** `draft` → `review` → `published` → `deprecated`

---

## DAB-CED07 — Action Hierarchy

**[DAB-CED07a]** Canonical hierarchy [ACN-001]:

```text
Mission (why)
  └── Initiative (coordinate campaigns) [optional V1.1]
        └── Project (deliver)
              └── Task (atomic work)
Event/Experience — parallel branch from Mission (when people gather)
```

**Initiative [DAB-E15]:** `title`, `mission_id`, `status` — campaigns spanning projects [IOS-001].  
**Task [DAB-E16]:** `title`, `project_id`, `assignee_id`, `status`, `due_at`.

---

## DAB-CED08 — Entity Index

| ID | Entity | Schema domain |
|----|--------|---------------|
| DAB-E01 | Participant | `identity` |
| DAB-E02 | Community | `community` |
| DAB-E03 | County | `geo` |
| DAB-E04 | Educational Institution | `geo` |
| DAB-E05 | Committee/Team | `community` |
| DAB-E06 | Mission | `action` |
| DAB-E07 | Project | `action` |
| DAB-E08 | Event | `action` |
| DAB-E09 | Opportunity | `growth` |
| DAB-E10 | Partnership | `community` |
| DAB-E11 | Resource | `community` |
| DAB-E12 | Story | `knowledge` |
| DAB-E13 | Lesson | `knowledge` |
| DAB-E14 | Knowledge Object | `knowledge` |
| DAB-E15 | Initiative | `action` |
| DAB-E16 | Task | `action` |

---

## AC-108 — Acceptance Criteria

- [x] **[AC-108a]** Entity template and index documented. `[DAB-CED02, CED08]`
- [x] **[AC-108b]** Identity, place, organizing, growth, and knowledge entities specified. `[DAB-CED03–CED07]`
- [x] **[AC-108c]** Required fields, relationships, and lifecycles defined per primary entity.

---

**Next step:** [2.3 — Relationship Data Model](RELATIONSHIP_DATA_MODEL.md) [DAB-004]

**End of Volume 2.2.**
