# Build Volume 2.4 — Database Schema Blueprint

### Data Architecture Bible

**Document ID:** VOLUME-002.4 · **DAB-005**  
**Artifact:** `DATABASE_SCHEMA_BLUEPRINT.md`  
**Status:** Canonical  
**Priority:** Critical

**Builds on:** [1.4 Database Architecture](../volume-01/DATABASE_ARCHITECTURE.md) [ENG-004] · [2.2 Entity Dictionary](CANONICAL_ENTITY_DICTIONARY.md) [DAB-003]  
**Live spec:** `data/registry/database-schema-blueprint.json`

> **No SQL in this document** — pure architecture. DDL follows in migrations.

---

## DAB-SCH01 — Purpose

**[DAB-SCH01]** The Database Schema Blueprint maps entities to **Postgres schemas, tables, keys, constraints, and indexes** — the implementation map for Burt.

---

## DAB-SCH02 — Schema Domains

**[DAB-SCH02a]** Aligns with [ENG-DB05](../volume-01/DATABASE_ARCHITECTURE.md):

| Schema | Purpose | Primary entities |
|--------|---------|------------------|
| `platform` | Kernel, migrations, feature flags | schema_migrations, audit_log |
| `config` | DCL constitution layer | roles, templates, workflows |
| `identity` | Participants, auth links | participants, profiles |
| `community` | Communities, teams, partnerships | communities, teams, members |
| `geo` | Counties, institutions, locations | counties, institutions, places |
| `action` | Missions, projects, tasks, events | missions, projects, tasks, events |
| `growth` | Invitations, opportunities, referrals | invitations, opportunities |
| `knowledge` | Stories, lessons, knowledge objects | stories, lessons, knowledge_objects |
| `graph` | Relationships, projections | entity_relationships, graph_snapshots |
| `events` | Domain events, timelines | domain_events, timeline_entries |
| `comms` | Notifications, preferences | notifications, notification_preferences |
| `search` | Index metadata (optional V1) | search_documents, index_jobs |
| `intelligence` | AI chunks, embeddings metadata | retrieval_chunks, twin_snapshots |
| `analytics` | Rollups, KPI snapshots | metric_snapshots, health_scores |
| `media` | Files, documents, versions | media_assets, document_versions |

---

## DAB-SCH03 — Naming Conventions

**[DAB-SCH03a]** Tables: `snake_case`, plural (`participants`, `communities`).

**[DAB-SCH03b]** Columns: `snake_case`; FKs: `{entity}_id` (`community_id`).

**[DAB-SCH03c]** Enums: `{domain}_{name}_enum` or check constraints V1.

**[DAB-SCH03d]** Indexes: `idx_{table}_{columns}`; unique: `uq_{table}_{columns}`.

**[DAB-SCH03e]** Constraints: `fk_{table}_{ref_table}`, `chk_{table}_{rule}`.

---

## DAB-SCH04 — Key Strategy

**[DAB-SCH04a]** Primary keys: `uuid` default `gen_random_uuid()` (migrate to v7 when available).

**[DAB-SCH04b]** Natural keys (slug, fips_code) have **unique constraints** separate from PK.

**[DAB-SCH04c]** Composite keys for junction tables: `(community_id, participant_id)`.

---

## DAB-SCH05 — Core Table Blueprint

### identity.participants

```text
id, auth_user_id, display_name, slug, email, journey_stage, visibility_level,
home_community_id, county_id, institution_id, civic_passport_ref,
created_at, updated_at, version, archived_at
```

### community.communities

```text
id, name, slug, charter_ref, growth_stage, community_type,
county_id, institution_id, genome_template_id,
created_at, updated_at, version, archived_at
```

### geo.counties / geo.institutions

Reference tables seeded from `data/counties.json`, `data/campuses.json`.

### action.missions / projects / tasks / events

Hierarchy FKs: `mission_id`, `project_id`, `community_id`, `owner_id`, status enums.

### graph.entity_relationships

Per [RELATIONSHIP_DATA_MODEL.md](RELATIONSHIP_DATA_MODEL.md) [DAB-REL02].

### platform.audit_log

```text
id, actor_id, action, entity_type, entity_id,
before_json, after_json, trace_id, community_scope, created_at
```

---

## DAB-SCH06 — Foreign Key Rules

**[DAB-SCH06a]** All tenant-scoped FKs include `community_id` where multi-tenant isolation applies.

**[DAB-SCH06b]** ON DELETE: `RESTRICT` default; `SET NULL` for optional refs; soft-delete preferred over CASCADE.

**[DAB-SCH06c]** Cross-schema FKs allowed; cross-database never.

---

## DAB-SCH07 — Index Philosophy

**[DAB-SCH07a]** **Every FK column** indexed.

**[DAB-SCH07b]** **Query-driven** composite indexes for hot paths: `(community_id, status)`, `(participant_id, created_at DESC)`.

**[DAB-SCH07c]** **Partial indexes** for active rows: `WHERE archived_at IS NULL`.

**[DAB-SCH07d]** **GIN** for jsonb metadata and full-text (where not delegated to search schema).

**[DAB-SCH07e]** Index budget reviewed per release [ENG-DTR10].

---

## DAB-SCH08 — Partitioning Strategy

**[DAB-SCH08a]** V1: **no partitioning** — single Postgres instance sufficient for launch scale.

**[DAB-SCH08b]** V1.1+ candidates: `events.domain_events` by month; `platform.audit_log` by quarter.

**[DAB-SCH08c]** Partition key: `created_at` · retain via [SECURITY_PRIVACY_MODEL.md](SECURITY_PRIVACY_MODEL.md) retention policy.

---

## DAB-SCH09 — Row-Level Security

**[DAB-SCH09a]** RLS enabled on all tenant tables [ENG-DB22 · PRE-001].

**[DAB-SCH09b]** Policies derive from: platform role + community membership + data class.

**[DAB-SCH09c]** Service role bypasses RLS for batch jobs only — never client-facing.

---

## DAB-SCH10 — Migration Order

**[DAB-SCH10]** Matches [ENG-DB31](../volume-01/DATABASE_ARCHITECTURE.md):

1. `platform`, `config`, `geo` (reference seed)
2. `identity`, `community`
3. `graph.entity_relationships`, `community_members`
4. `action` hierarchy
5. `growth` invitations
6. `knowledge`, `events`
7. `comms`, `search`, `intelligence`, `analytics`, `media`

---

## AC-110 — Acceptance Criteria

- [x] **[AC-110a]** Schema domains and naming conventions documented. `[DAB-SCH02, SCH03]`
- [x] **[AC-110b]** Key strategy and core table blueprint defined. `[DAB-SCH04, SCH05]`
- [x] **[AC-110c]** FK rules, index philosophy, partitioning, and RLS established. `[DAB-SCH06–SCH09]`

---

**Next step:** [2.5 — Knowledge Graph Schema](KNOWLEDGE_GRAPH_SCHEMA.md) [DAB-006]

**End of Volume 2.4.**
