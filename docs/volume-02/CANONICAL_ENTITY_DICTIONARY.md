# Build Volume 2.2 — Canonical Entity Dictionary

### Data Architecture Bible

**Document ID:** VOLUME-002.2 · **DAB-003**  
**Artifact:** `CANONICAL_ENTITY_DICTIONARY.md`  
**Status:** Canonical  
**Priority:** Critical

**Builds on:** [2.1 Data Philosophy](DATA_PHILOSOPHY.md) [DAB-002]  
**Live spec:** `data/registry/canonical-entity-dictionary.json`

---

## Purpose

**[DAB-CED01]** The Canonical Entity Dictionary defines every primary business entity within the Community Operating System.

**[DAB-CED01a]** An entity represents a meaningful object that the platform understands.

**[DAB-CED01b]** This document becomes the definitive reference for:

- Database design
- API contracts
- User interface development
- Search
- Community Knowledge Graph
- AI retrieval
- Analytics
- Reporting
- Future integrations

**[DAB-CED01c]** Every major feature ultimately operates on these entities.

---

## Guiding Principle

**[DAB-CED02]**

> **Every important concept should exist exactly once in the platform's vocabulary.**

**[DAB-CED02a]** The same idea should never be modeled in multiple incompatible ways.

---

## Entity Philosophy

**[DAB-CED03]** Every entity represents:

- Something meaningful
- Something uniquely identifiable
- Something with its own lifecycle
- Something capable of relationships
- Something with a clear owner

---

## Canonical Entity Standard

**[DAB-CED04]** Every entity definition includes:

| Element | Purpose |
|---------|---------|
| **Purpose** | Why this entity exists |
| **Business Owner** | Service responsible for canonical truth |
| **Canonical Identifier** | Stable ID format |
| **Lifecycle** | Status enum and transitions |
| **Required Attributes** | Mandatory fields |
| **Optional Attributes** | Extensible fields |
| **Relationships** | Inbound and outbound edges |
| **Visibility Rules** | Default permission class [PRE-001] |
| **Audit Requirements** | Events emitted on material change |
| **Future Extensions** | Planned additive fields or types |

**[DAB-CED04a]** This creates consistency across the platform.

---

## Entity Classification

**[DAB-CED05]** Entities are grouped into domains. Each domain owns its entities.

```text
Identity
Registry
Community
Leadership
Mission
Experience
Opportunity
Knowledge
Partnership
Capacity
Communication
Intelligence
System
```

---

## Identity Domain

**Business Owner:** Identity Service · **Schema:** `identity`

### Participant [DAB-E01]

**Purpose:** Represents one individual participating in the Community Operating System.

**Required:** Canonical ID · Display Name · Authentication Reference · Status

**Relationships:** Communities · Leadership · Stories · Events · Skills · Mentorship · Volunteer history

**Lifecycle:** `registered` → `connected` → `contributing` → `leading` → `mentoring` → `legacy`

**Future Extensions:** Multiple identities (institutional) · Volunteer certifications · Professional profiles

**Phase:** PEP-001 · PHQ-001

### Account [DAB-E17]

**Purpose:** Represents authentication credentials and login providers.

**Note:** Separate from participant profile — auth is not identity.

**Required:** Auth provider reference · Participant link · Status

### Profile [DAB-E18]

**Purpose:** Represents participant-controlled public information.

**Note:** Separate from authentication.

**Required:** Participant ID · Display fields · Visibility level

---

## Registry Domain

**Business Owner:** Registry Service · **Schema:** `geo`

### County [DAB-E03]

**Purpose:** Represents one Arkansas county — canonical statewide geographic unit.

**Required:** Name · Slug · FIPS code · State code (`AR`)

**Relationships:** Communities · Institutions · Events · Partners · Initiatives

**Lifecycle:** `reference` (static seed) — communities attach

**Phase:** CNTY-001 · ADT-002

### Educational Institution [DAB-E04]

**Purpose:** Represents universities, community colleges, trade schools, high schools, private schools, and charter schools.

**Required:** Name · Slug · Institution type · County reference

**Types:** university · college · community_college · technical_college · trade_school · nursing_college · high_school · private_school · charter_school

**Phase:** INST-001

### Region [DAB-E19]

**Purpose:** Represents logical geographic groupings. May evolve over time.

**Relationships:** Counties · Initiatives · Collaboration spaces

### Community Type [DAB-E20]

**Purpose:** Configuration entity describing community classifications.

**Examples:** Campus · County · Alumni · Student organization · Cohort

**Note:** Configuration — governed via DCL [DAB-010]

---

## Community Domain

**Business Owner:** Community Service · **Schema:** `community`

### Community [DAB-E02]

**Purpose:** Represents one organizing community.

**Examples:** Campus · County hub · Alumni · Student organization · Future community types

**Required:** Name · Slug · Community type · Growth stage · Status

**Relationships:** Participants · Leadership · Committees · Events · Stories · Knowledge · Capacity · Growth

**Lifecycle:** `seed` → `forming` → `active` → `thriving` → `renewing` → `archived`

**Phase:** COS-001 · CCN-001

### Committee [DAB-E05]

**Purpose:** Represents a working group inside a community [TWG-001].

**Required:** Name · Community ID · Team type · Status

**Lifecycle:** `draft` → `active` → `paused` → `archived`

### Membership [DAB-E21]

**Purpose:** Represents the relationship between Participant and Community.

**Note:** Membership is its own entity — not simply a join table. Has lifecycle, role, and history.

**Required:** Participant ID · Community ID · Status · Joined at

**Lifecycle:** `invited` → `active` → `paused` → `departed` → `archived`

---

## Leadership Domain

**Business Owner:** Community Service · Growth Service · **Schema:** `community` · `growth`

### Leadership Role [DAB-E22]

**Purpose:** Represents one leadership assignment.

**Tracks:** Appointment · Succession · Expiration · History

**Lifecycle:** `nominated` → `active` → `term_ended` → `archived`

### Mentorship [DAB-E23]

**Purpose:** Represents a mentorship relationship — first-class data.

**Includes:** Goals · Timeline · Status · Outcomes

**Lifecycle:** `proposed` → `active` → `completed` → `archived`

---

## Mission Domain

**Business Owner:** Mission Service · **Schema:** `action`

**Hierarchy [ACN-001]:**

```text
Mission (why)
  └── Initiative (strategic, multi-community)
        └── Project (deliver)
              └── Task (atomic work)
Event/Experience — parallel branch from Mission (when people gather)
```

### Mission [DAB-E06]

**Purpose:** Represents a major body of work — the "why" [MDS-001 · MPS-001].

**Contains:** Purpose · Objectives · Milestones · Status · Relationships

**Lifecycle:** `draft` → `active` → `completed` → `archived`

### Project [DAB-E07]

**Purpose:** Represents a subdivision of a mission [EOS-001].

**Lifecycle:** `planned` → `in_progress` → `blocked` → `done` → `archived`

### Task [DAB-E16]

**Purpose:** Represents an actionable work item.

**Required:** Title · Project ID · Assignee · Status · Due date

### Initiative [DAB-E15]

**Purpose:** Represents long-term strategic efforts. May span multiple communities [IOS-001].

**Lifecycle:** `draft` → `active` → `completed` → `archived`

---

## Experience Domain

**Business Owner:** Experience Service · **Schema:** `action`

### Event [DAB-E08]

**Purpose:** Represents a scheduled experience [EEOS-001].

**Examples:** Meeting · Volunteer event · Training · Celebration · Workshop · Forum

**Lifecycle:** `draft` → `scheduled` → `live` → `completed` → `cancelled`

### Attendance [DAB-E24]

**Purpose:** Represents participation in an event.

**Required:** Event ID · Participant ID · Status · Check-in timestamp

### Calendar [DAB-E25]

**Purpose:** Represents calendar collections — personal, community, mission, network [TSOS-001].

---

## Opportunity Domain

**Business Owner:** Growth Service · **Schema:** `growth`

### Opportunity [DAB-E09]

**Purpose:** Represents volunteer positions, leadership openings, committees, projects, training, and service opportunities [OEX-001 · OBE-001].

**Lifecycle:** `open` → `filled` → `closed` → `archived`

### Application [DAB-E26]

**Purpose:** Represents a participant expressing interest in an opportunity.

**Lifecycle:** `submitted` → `reviewed` → `accepted` → `declined` → `withdrawn`

---

## Knowledge Domain

**Business Owner:** Knowledge Service · **Schema:** `knowledge`

### Story [DAB-E12]

**Purpose:** Represents a narrative [CST-001].

**Examples:** Volunteer experience · Community milestone · Success story · Historical story

**Lifecycle:** `draft` → `review` → `published` → `archived`

### Lesson [DAB-E13]

**Purpose:** Represents knowledge gained [LIS-001].

**Lifecycle:** `draft` → `validated` → `published` → `superseded`

### Experience Playbook [DAB-E27]

**Purpose:** Represents reusable operational knowledge from experiences [EEOS-001 · CKLS-001].

### Community Brain Entry [DAB-E28]

**Purpose:** Represents long-term organizational knowledge [CKLS-001].

**Types:** Playbook · Decision record · FAQ · Policy · Procedure

### Legacy Record [DAB-E29]

**Purpose:** Represents historically significant information [CLS-001 · CJT-001].

### Knowledge Object [DAB-E14]

**Purpose:** General knowledge artifact — playbook, decision, FAQ, policy [CKLS-001].

**Lifecycle:** `draft` → `review` → `published` → `deprecated`

---

## Partnership Domain

**Business Owner:** Community Service · **Schema:** `community`

### Partner [DAB-E30]

**Purpose:** Represents an external institution or organization.

**Required:** Name · Partner type · Status

### Partnership [DAB-E10]

**Purpose:** Represents a relationship between Community, Institution, Organization, County, or Initiative [IPS-001].

**Lifecycle:** `proposed` → `active` → `paused` → `ended`

---

## Capacity Domain

**Business Owner:** Community Service · **Schema:** `community`

### Skill [DAB-E31]

**Purpose:** Represents an ability. May belong to Participants, Organizations, or Communities [CCE-001 · PGL-001].

### Resource [DAB-E11]

**Purpose:** Represents equipment, facility, transportation, funding, or technology [CCS-001].

### Capacity Record [DAB-E32]

**Purpose:** Represents available capability — what a community or participant can offer or needs [CCS-001].

---

## Communication Domain

**Business Owner:** Communication Service · **Schema:** `communication`

### Announcement [DAB-E33]

**Purpose:** Represents community communication [CCNET-001 · CAM-001].

### Notification [DAB-E34]

**Purpose:** Represents one participant notification.

**Lifecycle:** `queued` → `delivered` → `read` → `archived`

### Communication Preference [DAB-E35]

**Purpose:** Participant-controlled settings for channels, digests, and attention budget [CAM-001].

---

## Intelligence Domain

**Business Owner:** Intelligence Service · **Schema:** `intelligence` *(derived projections)*

### Insight [DAB-E36]

**Purpose:** Represents generated intelligence. Always references supporting evidence [CIS-001 · OPIS-001].

**Note:** Derived — not canonical source of truth.

### Recommendation [DAB-E37]

**Purpose:** Represents suggested action. Explainable and permission-aware [OBE-001 · CIF-001].

### Digital Twin [DAB-E38]

**Purpose:** Represents the continuously updated model of Participant, Community, County, Institution, Mission, or Initiative [PDT-001 · LDT-001 · NISS-001].

**Note:** Composition layer — not duplicate canonical records.

---

## System Domain

**Business Owner:** Platform · **Schema:** `platform` · `config` · `audit`

### Configuration Object [DAB-E39]

**Purpose:** Represents configurable behavior [DCL-001 · DAB-010].

**Examples:** Roles · Templates · Recognition · Workflow · Community types

### Audit Record [DAB-E40]

**Purpose:** Represents historical changes [DAB-PH18].

### Event Record [DAB-E41]

**Purpose:** Represents immutable historical events [ENG-009 · LHE-001 · DAB-007].

### Search Index [DAB-E42]

**Purpose:** Represents optimized discovery structures [ENG-010 · DAB-011].

**Note:** Derived — rebuildable from canonical data.

### AI Knowledge Object [DAB-E43]

**Purpose:** Represents retrieval-ready knowledge [ENG-013 · DAB-013].

**Note:** Derived — not canonical.

---

## Cross-Cutting Entity Standards

**[DAB-CED06]** Every entity should answer:

- What is it?
- Who owns it?
- Who may edit it?
- Who may view it?
- How does it evolve?
- What relationships exist?
- What history is preserved?

---

## Lifecycle Categories

**[DAB-CED07]** Entities generally move through:

```text
Draft
  ↓
Review
  ↓
Active
  ↓
Completed
  ↓
Archived
```

**[DAB-CED07a]** Some entities may have custom lifecycles (see domain sections above).

---

## Entity Relationships

**[DAB-CED08]** Every entity supports:

- One-to-one
- One-to-many
- Many-to-many
- Historical edges
- Graph projections [DAB-004]

**[DAB-CED08a]** Relationships remain explicit. Detail: [RELATIONSHIP_DATA_MODEL.md](RELATIONSHIP_DATA_MODEL.md)

---

## Identity Rules

**[DAB-CED09]** Every entity receives:

- Canonical ID (uuid v7 preferred)
- Stable public identifier where shareable (slug)
- Creation timestamp
- Update timestamp
- Visibility
- Status
- Owner (service or steward)
- Version (where appropriate)
- Audit history (where material)

---

## Future Entity Expansion

**[DAB-CED10]** Future entities may include:

- Scholarships
- Housing
- Legislation
- Campaigns
- Public offices
- Employment
- Research
- Public policy

**[DAB-CED10a]** The entity architecture should accommodate new domains without redesign.

---

## Universal Entity Registry

**[DAB-CED11]** **Major Architectural Recommendation:** Maintain a **Universal Entity Registry** that catalogs every entity type in the platform.

For each entity, the registry records:

| Field | Description |
|-------|-------------|
| Canonical entity name | Single vocabulary term |
| Domain owner | Service responsible |
| Purpose | Why it exists |
| Primary identifier format | uuid · slug · composite |
| Lifecycle states | Enumerated statuses |
| Visibility options | Default permission classes |
| Related entities | Key edges |
| Owning / consuming services | Service registry cross-ref |
| API resources | REST/GraphQL resource names |
| Search index participation | Yes/no + index type |
| Community Knowledge Graph participation | Node/edge types |
| Digital Twin participation | Twin scope |
| Audit requirements | Material change events |
| Version history | Whether versioned |

**[DAB-CED11a]** The Universal Entity Registry becomes the master catalog for the Community Operating System.

**[DAB-CED11b]** Rather than forcing developers or AI assistants to infer how a concept should be represented, they consult a single authoritative reference — `data/registry/canonical-entity-dictionary.json`.

**[DAB-CED11c]** This reduces duplication, improves consistency, and ensures every new capability extends the same canonical business vocabulary.

---

## Entity Index

| ID | Entity | Domain | Schema | Derived |
|----|--------|--------|--------|---------|
| DAB-E01 | Participant | Identity | identity | |
| DAB-E17 | Account | Identity | identity | |
| DAB-E18 | Profile | Identity | identity | |
| DAB-E03 | County | Registry | geo | |
| DAB-E04 | Educational Institution | Registry | geo | |
| DAB-E19 | Region | Registry | geo | |
| DAB-E20 | Community Type | Registry | config | |
| DAB-E02 | Community | Community | community | |
| DAB-E05 | Committee | Community | community | |
| DAB-E21 | Membership | Community | community | |
| DAB-E22 | Leadership Role | Leadership | community | |
| DAB-E23 | Mentorship | Leadership | growth | |
| DAB-E06 | Mission | Mission | action | |
| DAB-E07 | Project | Mission | action | |
| DAB-E16 | Task | Mission | action | |
| DAB-E15 | Initiative | Mission | action | |
| DAB-E08 | Event | Experience | action | |
| DAB-E24 | Attendance | Experience | action | |
| DAB-E25 | Calendar | Experience | action | |
| DAB-E09 | Opportunity | Opportunity | growth | |
| DAB-E26 | Application | Opportunity | growth | |
| DAB-E12 | Story | Knowledge | knowledge | |
| DAB-E13 | Lesson | Knowledge | knowledge | |
| DAB-E27 | Experience Playbook | Knowledge | knowledge | |
| DAB-E28 | Community Brain Entry | Knowledge | knowledge | |
| DAB-E29 | Legacy Record | Knowledge | knowledge | |
| DAB-E14 | Knowledge Object | Knowledge | knowledge | |
| DAB-E30 | Partner | Partnership | community | |
| DAB-E10 | Partnership | Partnership | community | |
| DAB-E31 | Skill | Capacity | community | |
| DAB-E11 | Resource | Capacity | community | |
| DAB-E32 | Capacity Record | Capacity | community | |
| DAB-E33 | Announcement | Communication | communication | |
| DAB-E34 | Notification | Communication | communication | |
| DAB-E35 | Communication Preference | Communication | communication | |
| DAB-E36 | Insight | Intelligence | intelligence | ✓ |
| DAB-E37 | Recommendation | Intelligence | intelligence | ✓ |
| DAB-E38 | Digital Twin | Intelligence | intelligence | ✓ |
| DAB-E39 | Configuration Object | System | config | |
| DAB-E40 | Audit Record | System | audit | |
| DAB-E41 | Event Record | System | audit | |
| DAB-E42 | Search Index | System | search | ✓ |
| DAB-E43 | AI Knowledge Object | System | intelligence | ✓ |

**Total:** 43 entities across 13 domains

---

## Burt Implementation Guidance

**[DAB-CED12]** Implementation should:

1. Create one authoritative model per entity
2. Avoid duplicate representations
3. Treat relationships as first-class entities when they have their own lifecycle (Membership, Mentorship, Partnership, Attendance, Application)
4. Separate authentication (Account) from participant identity (Participant, Profile)
5. Separate configuration from operational data
6. Design entities to support both relational storage and graph projections
7. Consult the Universal Entity Registry before any new table or API resource

---

## AC-108 — Acceptance Criteria

Volume 2.2 is complete when:

- [x] **[AC-108a]** All major platform entities are identified. `[DAB-CED05, Entity Index]`
- [x] **[AC-108b]** Business ownership is established per domain. `[Domain sections]`
- [x] **[AC-108c]** Entity standards are defined. `[DAB-CED04]`
- [x] **[AC-108d]** Lifecycle and relationship rules are documented. `[DAB-CED07–CED08]`
- [x] **[AC-108e]** Universal Entity Registry established. `[DAB-CED11]`
- [x] **[AC-108f]** Burt has a canonical business vocabulary for the entire Community Operating System. `[DAB-CED12]`

---

**Next step:** [2.3 — Relationship Data Model](RELATIONSHIP_DATA_MODEL.md) [DAB-004]

**End of Volume 2.2.**
