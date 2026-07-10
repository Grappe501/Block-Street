# Arkansas Organizing Registry Doctrine

**Document ID:** PHASE-002.1  
**Artifact:** `ARKANSAS_ORGANIZING_REGISTRY_DOCTRINE.md`  
**Status:** Canonical  
**Priority:** Critical  
**Phase:** 2 — Arkansas Organizing Registry (AOR)

> **The Registry is not a list. It is the digital map of Arkansas.**  
> Everything Burt builds from this point forward should ask the Registry first.  
> **If something doesn't exist in the Registry, it doesn't exist in the platform.**

The Registry is the **database constitution** — the equivalent of a governing document for all platform data about place, institution, and organizing geography.

**Builds On:** [BUILD-BIBLE.md](../build-steps/BUILD-BIBLE.md) · [PHASE-001.5 Organizing Model](../build-steps/PHASE-001.5-ORGANIZING-MODEL.md) · [PHASE-001.7 Launch Success](../build-steps/PHASE-001.7-LAUNCH-SUCCESS-DEFINITION.md) · [REG-001, REG-002, REG-003](../../data/requirements-registry.json)

---

## Requirement Index

| ID | Requirement |
|----|-------------|
| REG-D01 | Purpose |
| REG-D02 | Mission |
| REG-D03 | Vision |
| REG-D04 | Guiding principle |
| REG-D05 | Registry responsibilities |
| REG-D06 | Canonical vs operational data |
| REG-D07 | Registry is read by everyone |
| REG-D08 | Entity categories |
| REG-D09 | Registry philosophy |
| REG-D10 | Canonical record rule |
| REG-D11 | Stable identity |
| REG-D12 | Registry status |
| REG-D13 | Registry ownership |
| REG-D14 | Data quality |
| REG-D15 | Expansion policy |
| REG-D16 | Graph model (relationships) |
| REG-D17 | Registry consumers |
| REG-D18 | Authority & conflict resolution |
| REG-D19 | Data layer architecture |
| REG-D20 | Governance & change control |
| REG-D21 | Phase 2 artifact map |
| REG-BG | Burt implementation guidance |
| AC-010 | Step 2.1 acceptance criteria |

---

## REG-D01 — Purpose

**[REG-D01]** The **Arkansas Organizing Registry (AOR)** is the canonical source of truth for every geographic, educational, and organizational entity represented within the platform.

**[REG-D01a]** The Registry defines:

- **What exists**
- **Where it belongs**
- **How it relates to other entities**
- **Its current organizing status**

**[REG-D01b]** Every page, search result, dashboard, report, API, and future feature derives its understanding of Arkansas from this Registry.

**[REG-D01c]** The Registry is not merely a database table. It is the platform's **operational map of the state**.

**[REG-D01d]** Burt asks the Registry first. No subsystem invents Arkansas geography independently.

*Aligns with:* [LS-P1] · [LS-P2] · [LS-P7] · [ED-DB] · [TR-MOTTO]

---

## REG-D02 — Mission

**[REG-D02]** Provide one authoritative registry describing every organizing location, educational institution, county, and future organizational entity supported by the platform.

---

## REG-D03 — Vision

**[REG-D03]** The Registry becomes the **permanent digital representation** of Arkansas's organizing ecosystem.

**[REG-D03a]** As the platform grows, the Registry expands without changing its underlying philosophy.

**[REG-D03b]** Future generations inherit an increasingly complete map — rather than rebuilding institutional knowledge from scratch.

*Aligns with:* [DG-009] Versioned Growth · [GM-ROAD]

---

## REG-D04 — Guiding Principle

**[REG-D04]**

> **One Arkansas. One Registry. One Source of Truth.**

**[REG-D04a]** No duplicate institutional records.

**[REG-D04b]** No duplicate county definitions.

**[REG-D04c]** No conflicting data sources.

**[REG-D04d]** Every system references the Registry.

---

## REG-D05 — Registry Responsibilities

**[REG-D05]** The Registry **defines**:

| Domain | Examples |
|--------|----------|
| Geography | Counties, state boundary, future city support |
| Education | Universities, colleges, institution types |
| Relationships | Geographic links, contains/belongs-to graph |
| Organizing state | Representation status, outreach priority |
| Future entities | Organizational categories (V2+) |

**[REG-D05a]** The Registry does **not** store operational activity:

| Operational (references Registry) | Module |
|-----------------------------------|--------|
| Messages | MSG (future) |
| Events | EVT (future) |
| Volunteer logs | VOL (future) |
| Committees | COM (future) |
| Personal profiles | USR |

**[REG-D05b]** Operational modules **reference** Registry records by stable ID — they do not redefine entities.

*Aligns with:* [OM-L1] People-first — individuals are root; homes are registry nodes.

---

## REG-D06 — Canonical vs Operational Data

**[REG-D06]** **Canonical Registry data** = what exists in Arkansas organizing geography.

**[REG-D06a]** **Operational data** = what people do (signup, recruit, message, organize events).

**[REG-D06b]** Priority when data conflicts:

```
1. Approved Registry record (AOR)
2. Approved Phase 2 model documents (Steps 2.2–2.10)
3. Live database (mirrors Registry)
4. JSON seed files (bootstrap)
5. Hardcoded page content (never preferred)
```

**[REG-D06c]** Participant records [USR-001] select Registry entities — they do not create them.

**Bootstrap layer:**

```
data/registry/
├── counties.json
├── institutions.json
└── README.md
```

**Production layer:** `DB-COUNTIES`, `DB-INSTITUTIONS`, relationship tables (Step 2.4).

---

## REG-D07 — Registry Is Read by Everyone

**[REG-D07]** Every major subsystem **consumes** Registry data.

### Public Website

County pages · Institution pages · Search · Maps · Directory

### Participant Experience

Join flow · Campus selection · County selection · Discovery · Recommendations

### Administration

Institution management · County management · Status updates · Outreach planning · Reporting

### Analytics

Coverage · Growth · Representation · Participation by geography · Outreach gaps

**[REG-D07a]** No component maintains its own independent definition of Arkansas entities.

---

## REG-D08 — Entity Categories

**[REG-D08]** The Registry supports multiple entity categories. Each follows the same philosophy with specialized attributes.

### Geographic

| Entity | V1 |
|--------|-----|
| State (Arkansas) | Implicit anchor |
| County (75) | ✅ All required |
| City | Future if adopted |

### Educational

| Type | Version |
|------|---------|
| Universities & colleges | V1 ✅ |
| Community colleges | V1.5 |
| Technical institutes | V2 |
| Trade schools | V2 |
| High schools | V3 |

### Organizational (Future)

Youth organizations · Community organizations · Civic organizations (if adopted)

**Formal models:** Steps 2.2 (County) · 2.3 (Institution) · 2.4 (Relationships)

---

## REG-D09 — Registry Philosophy

**[REG-D09]** The Registry is **descriptive rather than prescriptive**.

**[REG-D09a]** It records factual information.

**[REG-D09b]** It does **not** assign political viewpoints, endorsements, or organizational priorities [DG-003, CP-002].

**[REG-D09c]** Its purpose is to help participants **discover and connect** with organizing communities.

---

## REG-D10 — Canonical Record Rule

**[REG-D10]** Each real-world entity has exactly **one** canonical Registry record.

**Examples:**

| Entity | One Record |
|--------|------------|
| Pulaski County | `slug: pulaski` |
| University of Central Arkansas | `slug: uca` |
| Philander Smith University | `slug: philander-smith` |

**[REG-D10a]** Operational systems reference these records — never duplicate them.

**[REG-D10b]** Cross-module references use Registry ID or slug, not display name strings.

---

## REG-D11 — Stable Identity

**[REG-D11]** Every Registry record receives a **permanent identifier**.

**[REG-D11a]** The identifier remains stable even if:

- Display name changes
- Additional metadata is added
- Organizing status changes
- Future versions expand the record

**[REG-D11b]** Slugs are permanent URLs. Changes require redirect strategy + BUILD-LOG entry.

**[REG-D11c]** Stable identifiers preserve historical continuity and simplify long-term maintenance [DG-009].

*Requirement IDs:* `REG-*`, `CNTY-*`, `INST-*` · Page IDs: `PAGE-*` · DB IDs: `DB-*`

---

## REG-D12 — Registry Status

**[REG-D12]** Every Registry entity has an **organizing status**.

**Preliminary values** (formalized in Step 2.5):

| Status | Meaning |
|--------|---------|
| `planned` | Record exists, page not yet live |
| `needs_outreach` | No active organizers — priority target |
| `organizer_assigned` | Lead identified, not yet building |
| `building` | Network forming |
| `active` | Recruiting and growing |
| `under_review` | Data or status requires admin review |
| `archived` | Intentionally inactive (if applicable) |

**[REG-D12a]** Status is **organizing state** — not enrollment verification or official affiliation.

**[REG-D12b]** Legacy alias: `needs_organizer` → maps to `needs_outreach`.

*Artifact:* Step 2.5 `REPRESENTATION_STATUS_SYSTEM.md`

---

## REG-D13 — Registry Ownership

**[REG-D13]** The Registry belongs to the **platform** — not to any individual participant.

**[REG-D13a]** Updates occur through controlled administrative processes [TR-SR].

**[REG-D13b]** Public participants may suggest corrections or additions.

**[REG-D13c]** Canonical changes require **administrative review** and traceability [TR-BR].

---

## REG-D14 — Data Quality

**[REG-D14]** Registry information should strive to be:

- **Accurate** · **Verifiable** · **Consistent** · **Current**
- **Properly attributed** where appropriate [DG-010]

**[REG-D14a]** When uncertainty exists, records indicate **confidence level** or **review status** — not assumptions presented as fact.

**[REG-D14b]** Source and verification protocol: Step 2.8.

---

## REG-D15 — Expansion Policy

**[REG-D15]** The Registry is intentionally designed for growth.

**[REG-D15a]** Future versions introduce additional entity categories **without altering core philosophy**.

**Examples:**

- High schools (V3)
- Counties outside Arkansas (if expansion occurs)
- Partner organizations

**[REG-D15b]** Growth occurs by **extending** the Registry — never replacing it [DG-009].

**[REG-D15c]** Schema hooks in V1; full records in later versions [REG-D08].

---

## REG-D16 — Graph Model (Relationships)

**[REG-D16]** The Registry is not a flat list. It is a **graph of interconnected entities**.

**[REG-D16a]** Every record can have typed relationships:

| Relationship | Example |
|--------------|---------|
| County **contains** institution | Pulaski → UA Little Rock |
| Institution **belongs to** county | UCA → Faulkner |
| Participant **belongs to** community | User → county + campus |
| Committee **operates within** | Campus or county (future) |
| Event **occurs at** | Location (future) |
| Volunteer project **serves** | Community (future) |

**[REG-D16b]** Modeling around **relationships** rather than isolated records enables:

- Richer search and discovery
- Outreach gap analytics
- Map visualization
- Future AI capabilities

**[REG-D16c]** Without changing fundamental architecture.

**[REG-D16d]** Step **2.4** (`COUNTY_INSTITUTION_RELATIONSHIP_MAP.md`) formalizes V1 relationship types. Database design should normalize relationships — not duplicate foreign keys in multiple shapes [ED-ME].

```
         ┌─────────┐
         │  State  │
         └────┬────┘
              │ contains
    ┌─────────┴─────────┐
    │      County       │
    └─────────┬─────────┘
              │ contains
    ┌─────────┴─────────┐
    │   Institution     │
    └─────────┬─────────┘
              │ referenced by
    ┌─────────┴─────────┐
    │   Participant     │  (operational — not in Registry)
    └───────────────────┘
```

*This is the architectural foundation for Steps 2.2–2.4.*

---

## REG-D17 — Registry Consumers

**[REG-D17]** Platform components that **must** consume Registry data:

| Consumer | Uses Registry For |
|----------|-------------------|
| County pages | Entity record, status, institutions in county |
| Institution pages | Entity record, status, county link |
| Maps | All counties, status coloring, gaps |
| Search | Entity discovery, filters |
| Dashboards | Coverage, outreach gaps |
| Participant onboarding | County + campus selection [USR-001] |
| Recruitment workflows | Share links tied to homes |
| Outreach planning | Priority, needs_outreach lists |
| Analytics | Representation by geography |
| Reporting | Admin visibility |
| Future mobile apps | Same Registry API |

**[REG-D17a]** No independent Arkansas entity definitions outside the Registry.

---

## REG-D18 — Authority & Conflict Resolution

**[REG-D18]** The Registry is authoritative. When in doubt, consult [BG-001]:

```
1. Platform Constitution [CP-*]
2. Design Guardrails [DG-*]
3. Registry Doctrine [REG-D*]
4. Phase 2 model documents
5. Feature request / convenience
```

**[REG-D18a]** If it is not in the Registry, it does not exist in the platform.

---

## REG-D19 — Data Layer Architecture

**[REG-D19]** Registry data flows vertically [ED-VS]:

```
Doctrine & Models (Phase 2 docs)
    ↓
Relationship graph schema (Step 2.4)
    ↓
Seed files (data/registry/*.json)
    ↓
Database (Netlify Postgres)
    ↓
API (API-COUNTIES-001, API-INSTITUTIONS-001)
    ↓
UI (pages, map, dashboard, signup)
```

**[REG-D19a]** JSON remains valid export/import format [DG-008] after DB is live.

---

## REG-D20 — Governance & Change Control

**[REG-D20]** Registry changes follow [TR-BR]:

1. Requirement exists (`REG-*`, `CNTY-*`, `INST-*`)
2. Model document updated
3. Relationship map updated (if applicable)
4. Seed data or DB migration
5. Pages/API updated
6. `requirements-registry.json` status updated
7. BUILD-LOG + ED-FD handoff

**Steve approves:** new entity categories · constitutional changes · major architecture [TR-SR].

---

## REG-D21 — Phase 2 Artifact Map

| Step | Artifact | Delivers |
|------|----------|----------|
| **2.1** | `ARKANSAS_ORGANIZING_REGISTRY_DOCTRINE.md` | Map philosophy, graph model, authority ✅ |
| 2.2 | `COUNTY_REGISTRY_MODEL.md` | 75-county node schema |
| 2.3 | `INSTITUTION_REGISTRY_MODEL.md` | Institution node schema |
| 2.4 | `COUNTY_INSTITUTION_RELATIONSHIP_MAP.md` | Graph edges (contains/belongs) |
| 2.5 | `REPRESENTATION_STATUS_SYSTEM.md` | Status vocabulary |
| 2.6 | `OUTREACH_GAP_DASHBOARD_REQUIREMENTS.md` | Gap metrics |
| 2.7 | `CAMPUS_PAGE_PERSONALIZATION_RULES.md` | Legal bounds |
| 2.8 | `REGISTRY_SOURCE_AND_VERIFICATION_PROTOCOL.md` | Provenance |
| 2.9 | `REGISTRY_SEED_DATA_PLAN.md` | Initial dataset |
| 2.10 | `PHASE_2_ARKANSAS_ORGANIZING_REGISTRY_BUILD_BIBLE.md` | Unified guide |

---

## REG-BG — Burt Implementation Guidance

**[REG-BG]** During implementation:

- Treat the Registry as a **foundational domain model** — not a CRUD table
- Keep Registry records **independent** from operational activity
- Design **stable identifiers** from the beginning
- Model **relationships as a graph** — normalize, don't duplicate
- Document **future extension points** without speculative features
- **Ask the Registry first** before any geographic or institutional logic
- No schema changes until Steps 2.2–2.4 models approved [ED-GR]

---

## AC-010 — Acceptance Criteria

Step 2.1 is complete when:

- [x] **[AC-010a]** Registry defined as authoritative source of truth. `[REG-D01, REG-D18]`
- [x] **[AC-010b]** Canonical vs operational data distinction documented. `[REG-D05, REG-D06]`
- [x] **[AC-010c]** Expansion principles established. `[REG-D15]`
- [x] **[AC-010d]** Stable identity and data quality expectations defined. `[REG-D11, REG-D14]`
- [x] **[AC-010e]** Graph relationship model established for Steps 2.2–2.4. `[REG-D16]`
- [x] **[AC-010f]** Burt has clear guidance for Registry as foundational system. `[REG-BG]`

---

## Burt — The Registry Rule

```
Before any geographic or institutional code:
  1. Does this entity exist in the Registry?
  2. If no → stop. Request Registry record first.
  3. If yes → reference by stable ID/slug, never duplicate.
  4. Relationships → query the graph, don't hardcode joins.
```

**Next Step:** 2.2 — County Registry Model (graph **node** schema)

*Trace: CP-006 → REG-001 → DB-COUNTIES → contains → DB-INSTITUTIONS → PAGE-COUNTY*
