# Build Volume 1.4 — Database Architecture

### Engineering Architecture Bible

**Document ID:** VOLUME-001.4 · **ENG-004**  
**Artifact:** `DATABASE_ARCHITECTURE.md`  
**Status:** Canonical  
**Priority:** Critical

**Companion:** [Digital Constitution Layer](DIGITAL_CONSTITUTION_LAYER.md) [DCL-001]  
**Builds on:** [1.3 Canonical Repository Architecture](CANONICAL_REPOSITORY_ARCHITECTURE.md) [ENG-003]  
**Entity catalog:** [Volume 2 — Data Architecture Bible](../master/DATA_ARCHITECTURE_BIBLE.md) [DAB-001]  
**Live spec:** `data/registry/database-architecture.json`

---

## ENG-DB01 — Purpose

**[ENG-DB01]** The Database Architecture defines how information is **stored, organized, protected, and connected** throughout the Community Operating System.

**[ENG-DB01a]** The database is not simply storage. It is the **permanent memory** of the platform.

**[ENG-DB01b]** Every participant, community, mission, relationship, story, lesson, and event ultimately becomes part of this **shared memory**.

---

## ENG-DB02 — Guiding Principle

**[ENG-DB02]**

> **The database preserves truth. The application interprets it.**

**[ENG-DB02a]** Business rules belong in **services** [ENG-D10]. The database preserves **canonical facts**.

**[ENG-DB02b]** AI outputs reference evidence — they do not become canonical truth without human commit [ENG-D15 · Intelligence Domain].

---

## ENG-DB03 — Database Philosophy

**[ENG-DB03]** The database should be:

| Property | Meaning |
|----------|---------|
| **Reliable** | Postgres ACID · backups verified [ENG-DB18] |
| **Normalized** | Third normal form where practical · no duplicate truth |
| **Auditable** | Append-only audit · who/when/what [ENG-DB22] |
| **Extensible** | New domains as schemas · config tables [ENG-DB23] |
| **Permission-aware** | RLS on tenant data [ENG-D12] |
| **Searchable** | Indexes + search projections [ENG-DB14] |
| **Graph-compatible** | Relational edges → graph projection [ENG-DB15] |
| **Versioned** | Migration-driven schema [ENG-DB19] |
| **Migration-driven** | No manual prod DDL [RCN-04] |
| **Easy to understand** | Domain schemas · documented ERD |

---

## ENG-DB04 — Core Architecture

**[ENG-DB04a]** Use a **relational SQL database** (Postgres via Supabase) as the **canonical source of truth**.

**[ENG-DB04b]** The relational model is the **primary storage engine**.

**[ENG-DB04c]** **Graph capabilities are derived** from relational data — not requiring a separate graph database V1.

**[ENG-DB04d]** Future graph databases may be added as **read models** without replacing canonical SQL store [NISS-M17 · ENG-DB15].

```text
Canonical SQL (Postgres)
        ↓
entity_relationships + domain tables
        ↓
Graph projection (query layer / future read replica)
        ↓
Community Knowledge Graph UI
```

---

## ENG-DB05 — Primary Database Domains

**[ENG-DB05]** Organize by **business responsibility** — not one massive schema.

| Schema / domain | Stores | Never stores |
|-----------------|--------|--------------|
| **identity** | Participants, accounts, auth refs, profiles, preferences, privacy, session metadata | Business logic |
| **registry** | Counties, institutions, community types, regions, maps, admin boundaries | Membership rules |
| **community** | Communities, committees, membership, leadership, settings, history, relationships | Mission execution |
| **mission** | Missions, projects, tasks, milestones, templates, MOR, status history | Event check-in |
| **experience** | Events, registrations, attendance, check-ins, schedules, calendars, templates | Volunteer matching |
| **opportunity** | Volunteer opportunities, committees, projects, needs, applications, assignments, availability | Growth invites |
| **growth** | Invitations, QR identities, referral relationships, campaigns, ambassador history, welcome, belonging checkpoints | Auth |
| **knowledge** | Stories, lessons, playbooks, Community Brain, Mission Library, legacy, knowledge refs | Permissions (→ identity) |
| **partnership** | Institutions, orgs, agreements, shared initiatives, facilities, mentors, community partnerships | County registry duplicates |
| **capacity** | Skills, equipment, facilities, transportation, availability, shared resources | Mission ownership |
| **intelligence** | Recommendations, trend summaries, insights, forecast metadata, AI explanation records, operational observations | Canonical facts without evidence link |
| **constitution** | [Digital Constitution Layer](DIGITAL_CONSTITUTION_LAYER.md) [DCL-001] | Instance data |
| **platform** | Audit log, domain events, search index metadata, migration history | Domain entities |

**Physical layout:** `database/schema/{domain}/` · migrations prefixed by domain [ENG-RA-DB].

---

## ENG-DB06 — Identity Domain

**[ENG-DB06]** Stores:

- Participants · accounts · authentication references (Supabase Auth `auth.users` link)
- Profiles · preferences · privacy settings · session metadata

**Rule:** Identity **never stores business logic** — only who exists and how they authenticate.

**Phase refs:** PEP-001 · PHQ-001 · TPS-001 · ENG-006.

---

## ENG-DB07 — Registry Domain

**[ENG-DB07]** Stores:

- Counties · educational institutions · community types · geographic regions
- Maps · administrative boundaries · institution metadata

**[ENG-DB07a]** The Registry is the **statewide reference layer** [Phase 2 · ADT-001].

**V1 transitional:** `data/registry/counties.json` · `institutions.json` → seed `registry` schema on DB connect.

---

## ENG-DB08 — Community Domain

**[ENG-DB08]** Stores:

- Communities · committees · membership · leadership assignments
- Community settings · community history · community relationships

**Phase refs:** COS-001 · CCN-001 · CGS-001 · TWG-001.

---

## ENG-DB09 — Mission Domain

**[ENG-DB09]** Stores:

- Missions · projects · tasks · milestones · mission templates
- Mission Operating Records [ACN-001] · mission status history [STS-001]

**Hierarchy:** Mission → Initiative → Project → Task [DAB-E03 · ENG-SA-SVC-04].

---

## ENG-DB10 — Experience Domain

**[ENG-DB10]** Stores:

- Events · registrations · attendance · check-ins
- Schedules · calendars · experience templates

**Phase refs:** EEOS-001 · TSOS-001.

---

## ENG-DB11 — Opportunity Domain

**[ENG-DB11]** Stores:

- Volunteer opportunities · committees · projects · needs
- Applications · assignments · availability

**Phase refs:** OEX-001 · OBE-001 · VDS-001.

---

## ENG-DB12 — Growth Domain

**[ENG-DB12]** Stores:

- Invitations · QR identities · referral relationships
- Growth campaigns · ambassador history · welcome tracking · belonging checkpoints

**Phase refs:** ICS-001 · PON-001 · WBS-001 · GCN-001 · CP-016.

---

## ENG-DB13 — Knowledge Domain

**[ENG-DB13]** Stores:

- Stories · lessons · playbooks · Community Brain entries
- Mission Library · Community Legacy · knowledge references

**Phase refs:** CKLS-001 · CST-001 · LIS-001 · CLS-001.

---

## ENG-DB14 — Partnership Domain

**[ENG-DB14]** Stores:

- Institutions · organizations · partnership agreements
- Shared initiatives · facilities · mentors · community partnerships

**Phase refs:** IPS-001 · SCN-001.

---

## ENG-DB15 — Capacity Domain

**[ENG-DB15]** Stores:

- Skills · equipment · facilities · transportation
- Availability · shared resources

**Phase refs:** CCS-001 · CCE-001.

---

## ENG-DB16 — Intelligence Domain

**[ENG-DB16]** Stores:

- Recommendations · trend summaries · generated insights
- Forecast metadata · AI explanation records · operational observations

**[ENG-DB16a]** AI outputs **always reference underlying evidence** (`evidence_refs[]`) — never become canonical truth without human-approved write to source domain [AIB-001 · ENG-D15].

---

## ENG-DB17 — Canonical Entity Rules

**[ENG-DB17]** Every major entity includes common fields:

| Field | Type | Purpose |
|-------|------|---------|
| `id` | uuid | Stable internal identifier |
| `created_at` | timestamptz | Creation time (UTC) |
| `updated_at` | timestamptz | Last modification |
| `created_by` | uuid → participant | Actor |
| `updated_by` | uuid → participant | Last actor |
| `status` | enum / FK → constitution.status_transitions | Lifecycle [STS-001] |
| `visibility` | enum | Privacy level [TPS-001] |
| `version` | integer | Optimistic concurrency |
| `archived_at` | timestamptz nullable | Soft delete [ENG-DB20] |
| `audit_ref` | uuid nullable | Link to audit batch |

**[ENG-DB17a]** Consistency **simplifies development** — domain tables extend this base via composition or inherited columns.

**Detail:** Entity-specific attributes in [Volume 2](../master/DATA_ARCHITECTURE_BIBLE.md) [DAB-001].

---

## ENG-DB18 — Identity Strategy

**[ENG-DB18a]** Every entity receives a **stable internal UUID**.

**[ENG-DB18b]** **Public identifiers** separate when necessary (`slug`, `public_id`) — never expose sequential internal IDs.

**[ENG-DB18c]** Never expose implementation details (raw auth provider IDs) in public APIs.

---

## ENG-DB19 — Relationships

**[ENG-DB19]** Relationships are **first-class data** [DAB-M03 · ENG-008].

**Examples:**

- Participant ↔ Community · Participant ↔ Mentor
- Community ↔ County · Mission ↔ Initiative
- Story ↔ Mission · Event ↔ Community · Institution ↔ Partnership

**[ENG-DB19a]** **Relationship history preserved** whenever practical — `valid_from` · `valid_to` on edges · no silent overwrites.

```sql
-- Canonical edge table (all domains)
platform.entity_relationships (
  id uuid PRIMARY KEY,
  source_type text NOT NULL,
  source_id uuid NOT NULL,
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  relationship_type text NOT NULL,  -- FK → constitution.relationship_types
  metadata jsonb DEFAULT '{}',
  strength numeric,
  valid_from timestamptz NOT NULL DEFAULT now(),
  valid_to timestamptz,
  community_scope uuid,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

---

## ENG-DB20 — Temporal Model

**[ENG-DB20]** The platform **preserves history**. Avoid overwriting important facts.

**Track:**

- Status changes · assignments · leadership transitions
- Membership history · mission progress

**[ENG-DB20a]** **Time is part of the data model** — status history tables · effective-dated rows · event log [ENG-DB22].

---

## ENG-DB21 — Soft Deletes

**[ENG-DB21]** Prefer **soft deletes** for important community records:

Participants · communities · stories · lessons · events

**[ENG-DB21a]** Use `archived_at` — preserves **institutional history** [CLS-001 · LCN-001].

**Exception:** PII erasure requests per TPS-001 may hard-delete after export window.

---

## ENG-DB22 — Audit Model

**[ENG-DB22]** Every significant change traceable:

| Capture | Field |
|---------|-------|
| Who | `actor_id` |
| When | `occurred_at` |
| Previous value | `before_json` (where appropriate) |
| New value | `after_json` |
| Reason | `reason` (optional) |
| Source | `source` (api · admin · migration · system) |

**[ENG-DB22a]** `platform.audit_log` append-only · supports transparency and recovery [RCN-001 · OLB-001].

---

## ENG-DB23 — Configuration Model

**[ENG-DB23]** Configuration belongs in **configuration tables** — not code enums.

**Examples:** Community types · roles · permissions · recognition categories · growth stages · mission templates

**[ENG-DB23a]** Avoid hard-coded enumerations [ENG-D06 · ENG-SA09].

**Primary home:** [Digital Constitution Layer](DIGITAL_CONSTITUTION_LAYER.md) [DCL-001] in `constitution` schema.

---

## ENG-DB24 — Search Strategy

**[ENG-DB24]** Search indexes support (respecting privacy):

Communities · participants (scoped) · stories · lessons · events · opportunities · institutions · playbooks · knowledge

**[ENG-DB24a]** Search remains **separate from canonical storage** — `tsvector` columns · future OpenSearch projection · never the source of truth.

**Detail:** [1.10 Search Architecture](SEARCH_ARCHITECTURE.md) [ENG-010].

---

## ENG-DB25 — Knowledge Graph Strategy

**[ENG-DB25]** Database supports **Community Knowledge Graph** [NISS-M17 · ENG-008].

**Store:** Nodes (entities) · relationships · relationship types · metadata · confidence · timestamps

**[ENG-DB25a]** Graph is **generated from relational truth** — query layer over `entity_relationships` + domain FKs.

**[ENG-DB25b]** Signature graphs compose: trust · growth · conversation · capability · decision · improvement · operational · impact [NISS-001].

---

## ENG-DB26 — Event Model

**[ENG-DB26]** Important events become **immutable records**:

Community launched · mission completed · participant joined · leadership assigned · story published · lesson captured

**[ENG-DB26a]** `platform.domain_events` — supports timelines · civic journey [CJT-001] · historical analysis [ENG-009].

```sql
platform.domain_events (
  id uuid PRIMARY KEY,
  event_type text NOT NULL,
  aggregate_type text NOT NULL,
  aggregate_id uuid NOT NULL,
  payload jsonb NOT NULL,
  actor_id uuid,
  community_scope uuid,
  occurred_at timestamptz NOT NULL DEFAULT now()
);
```

---

## ENG-DB27 — Performance Strategy

**[ENG-DB27]** Use:

- **Indexes** — intentional · documented in migration
- **Materialized views** where appropriate (reporting · dashboards)
- **Caching** — application layer · CDN for public reads
- **Background processing** — index rebuild · aggregations
- **Read optimization** — pagination · scope limits on graph traversals

**[ENG-DB27a]** Never sacrifice **correctness** for speed without careful review [ED-PERF].

---

## ENG-DB28 — Multi-Tenancy Philosophy

**[ENG-DB28]** Multiple communities with **strong logical separation**:

**[ENG-DB28a]** Community boundaries enforced through **`community_id` scope + RLS** — not duplicated schemas per community.

**[ENG-DB28b]** Allows statewide expansion without redesign [CEF-001 · GOS-M07].

---

## ENG-DB29 — Data Retention

**[ENG-DB29]** Every data type defines:

Retention period · archival strategy · exportability · deletion policy · privacy considerations · historical significance

**[ENG-DB29a]** Balance operational needs · participant expectations · legal requirements [TPS-001 · DG-004].

**[ENG-DB29b]** Legacy and stories may have **extended or permanent** retention with consent [CLS-001].

---

## ENG-DB30 — Backup Philosophy

**[ENG-DB30]** Backups must be:

Automated · verified · encrypted · restorable · **regularly tested**

**[ENG-DB30a]** A backup that cannot be restored is **not a valid backup** [OLB-001 · ENG-DB18 RPO/RTO].

---

## ENG-DB31 — Migration Doctrine

**[ENG-DB31]** Every schema change requires:

Migration · documentation · validation · rollback plan · compatibility review

**[ENG-DB31a]** **Never manual DDL in production** [RCN-04 · ENG-D13].

**[ENG-DB31b]** Path: `database/migrations/` or `supabase/migrations/` · naming `YYYYMMDDHHMMSS_{domain}_{description}.sql`.

**Order:** identity → registry → community → graph → mission → growth → knowledge → constitution → intelligence aggregates [DAB-M05].

---

## ENG-DB32 — Digital Constitution Layer

**[ENG-DB32]** Beyond application data, the **`constitution` schema** stores the platform's **governing definitions** [DCL-001].

**Stores canonical definitions for:**

Community types · leadership pathways · mission categories · relationship types · permission models · recognition categories · workflow definitions · growth stages · status transitions · constitutional principles and version history

**[ENG-DB32a]** Acts as the platform's **living rulebook** — governance evolves by updating definitions, not rewriting application code.

**Full spec:** [DIGITAL_CONSTITUTION_LAYER.md](DIGITAL_CONSTITUTION_LAYER.md)

---

## ENG-DB33 — Engineering Principles

**[ENG-DB33]** The database is always:

Consistent · observable · recoverable · extensible · documented · permission-aware · migration-controlled · easy to query

---

## ENG-DB34 — Burt Implementation Guidance

**[ENG-DB34]** Implementation should:

- Organize schema **by domain**
- Use **migrations exclusively** for structural changes
- **Preserve history** wherever possible
- **Separate configuration** from business data (DCL schema)
- Build **indexes intentionally**
- Design **relationships as first-class citizens**
- Keep **canonical truth in SQL** while supporting future graph projections
- Apply **RLS** on every community-scoped table before first production row

---

## Volume Cross-References

| Document | Relationship |
|----------|--------------|
| [Volume 2 DAB-001](../master/DATA_ARCHITECTURE_BIBLE.md) | Entity catalog · attribute detail |
| [1.8 CKG Architecture](COMMUNITY_KNOWLEDGE_GRAPH_ARCHITECTURE.md) | Graph query patterns |
| [1.9 Event & Timeline](EVENT_TIMELINE_ARCHITECTURE.md) | Timeline consumption |
| [RCN-001](REPOSITORY_CONSTITUTION.md) | Migration + RLS gates |

---

## AC-087 — Acceptance Criteria

Volume 1.4 is complete when:

- [x] **[AC-087a]** Database philosophy documented. `[ENG-DB02, ENG-DB03]`
- [x] **[AC-087b]** Domain organization established (11 + constitution + platform). `[ENG-DB05]`
- [x] **[AC-087c]** Canonical entity rules defined. `[ENG-DB17]`
- [x] **[AC-087d]** Relationship, audit, and event models specified. `[ENG-DB19, ENG-DB22, ENG-DB26]`
- [x] **[AC-087e]** Migration and backup doctrines documented. `[ENG-DB30, ENG-DB31]`
- [x] **[AC-087f]** Digital Constitution Layer specified. `[ENG-DB32, DCL-001]`
- [x] **[AC-087g]** Burt has blueprint for persistent data layer. `[database-architecture.json]`

---

**Next step:** [1.5 — API Architecture](API_ARCHITECTURE.md) [ENG-005]

**End of Volume 1.4 — Database Architecture.**
