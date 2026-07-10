# Build Volume 2.14 — Master Data Dictionary & Governance

### Data Architecture Bible

**Document ID:** VOLUME-002.14 · **DAB-015**  
**Artifact:** `MASTER_DATA_DICTIONARY.md`  
**Status:** Canonical  
**Priority:** Critical

**Builds on:** All Volume 2 steps 2.1–2.13  
**Live spec:** `data/registry/master-data-dictionary.json`

> **The canonical reference for every table, field, enum, and identifier in the COS.**

---

## DAB-MDD01 — Purpose

**[DAB-MDD01]** The Master Data Dictionary consolidates **naming standards, stewardship, quality rules, and migration governance** — the index Burt searches before any schema change.

---

## DAB-MDD02 — Naming Standards

| Artifact | Convention | Example |
|----------|------------|---------|
| Schema | lowercase domain | `action`, `knowledge` |
| Table | snake_case plural | `participants`, `domain_events` |
| Column | snake_case | `community_id`, `created_at` |
| PK | `id` uuid | |
| FK | `{entity}_id` | `mission_id` |
| Enum | snake_case values | `growth_stage` |
| Index | `idx_{table}_{cols}` | `idx_missions_community_status` |
| Event type | dot.notation | `community.member.joined` |

---

## DAB-MDD03 — Standard Columns

**[DAB-MDD03a]** All tenant entities include where applicable:

```text
id, community_id, created_at, updated_at, created_by, version, archived_at
```

**[DAB-MDD03b]** All config entries include: `effective_from`, `effective_to`, `scope_type`, `scope_id`.

**[DAB-MDD03c]** All searchable entities sync to `search.search_documents`.

---

## DAB-MDD04 — Schema Registry

### platform

| Table | Purpose | Owner |
|-------|---------|-------|
| `schema_migrations` | Migration history | Platform Kernel |
| `audit_log` | Material mutations | Platform Kernel |
| `access_log` | Sensitive reads | Platform Kernel |
| `legal_holds` | Erasure blocks | Operator |

### config

| Table | Purpose |
|-------|---------|
| `config_entries` | Generic config KV |
| `roles` | Platform roles |
| `community_role_templates` | Default community roles |
| `community_types` | Community taxonomy |
| `community_templates` | Launch templates |
| `mission_templates` | Mission canvas presets |
| `workflow_definitions` | State machines |
| `recognition_badges` | Badges |
| `growth_stages` | Growth stage defs |
| `feature_flags` | Feature toggles |
| `retention_policies` | Data retention |

### identity

| Table | Purpose |
|-------|---------|
| `participants` | Root person entity |
| `identity_links` | External identity |
| `consent_records` | Privacy consent |

### community

| Table | Purpose |
|-------|---------|
| `communities` | Organizing home |
| `community_members` | Membership junction |
| `teams` | Committees/working groups |
| `partnerships` | External partnerships |

### geo

| Table | Purpose |
|-------|---------|
| `counties` | 75 AR counties |
| `institutions` | Schools/universities |
| `places` | Venues/locations |

### action

| Table | Purpose |
|-------|---------|
| `missions` | Purpose container |
| `initiatives` | Campaigns |
| `projects` | Work packages |
| `tasks` | Atomic work |
| `events` | Gatherings |
| `calendars` | Calendar containers |
| `event_rsvps` | RSVP |
| `event_reminders` | Reminders |
| `availability_blocks` | Availability |

### growth

| Table | Purpose |
|-------|---------|
| `invitations` | Invite tracking |
| `opportunities` | Participation invites |

### knowledge

| Table | Purpose |
|-------|---------|
| `stories` | Cultural memory |
| `lessons` | Improvements |
| `knowledge_objects` | Playbooks, decisions |

### graph

| Table | Purpose |
|-------|---------|
| `entity_relationships` | Canonical edges |
| `graph_nodes` | Graph projection nodes |
| `graph_edges` | Graph projection edges |

### events

| Table | Purpose |
|-------|---------|
| `domain_events` | Immutable event log |
| `timeline_entries` | Curated timelines |
| `domain_events_archive` | Cold storage |

### comms

| Table | Purpose |
|-------|---------|
| `notifications` | Notification records |
| `notification_preferences` | User prefs |

### search

| Table | Purpose |
|-------|---------|
| `search_documents` | Search envelope |
| `rank_signals` | Ranking metadata |
| `suggestions` | Autocomplete |
| `index_jobs` | Index worker queue |

### intelligence

| Table | Purpose |
|-------|---------|
| `retrieval_chunks` | AI retrieval |
| `citations` | AI citations |
| `context_packages` | Prompt context audit |
| `participant_memory` | Participant AI memory |
| `community_memory` | Community AI memory |
| `twin_snapshots` | Digital twins |
| `community_brain_entries` | Community Brain index |
| `ai_interactions` | AI audit trail |

### analytics

| Table | Purpose |
|-------|---------|
| `metric_definitions` | KPI catalog |
| `metric_snapshots` | Rollups |
| `community_health_scores` | Health composite |
| `report_snapshots` | Frozen reports |

### media

| Table | Purpose |
|-------|---------|
| `media_assets` | Binary files |
| `documents` | Logical documents |
| `document_versions` | Version history |
| `entity_attachments` | Entity links |
| `extraction_jobs` | OCR pipeline |

---

## DAB-MDD05 — Core Enums

| Enum | Values |
|------|--------|
| `journey_stage` | registered, connected, contributing, leading, mentoring, legacy |
| `growth_stage` | seed, forming, active, thriving, renewing, archived |
| `data_class` | public, community, restricted, personal |
| `visibility` | public, network, community, team, private |
| `community_type` | campus, county, cohort, institution, alliance |
| `member_role` | member, organizer, leader, mentor, guest |
| `member_status` | pending, active, paused, removed |
| `mission_status` | draft, active, completed, archived |
| `project_status` | planned, in_progress, blocked, done, archived |
| `event_status` | draft, scheduled, live, completed, cancelled |
| `invitation_status` | pending, accepted, expired, revoked |

---

## DAB-MDD06 — Data Stewardship

**[DAB-MDD06a]** **Platform steward** — platform schema, config, reference geo data.

**[DAB-MDD06b]** **Community steward** — community leaders maintain community-scoped data quality.

**[DAB-MDD06c]** **Domain owner** — engineering owns schema; product owns entity definitions; ops owns retention.

---

## DAB-MDD07 — Quality Rules

**[DAB-MDD07a]** Required fields enforced at DB constraint + service validation.

**[DAB-MDD07b]** Slugs unique per scope; emails unique globally.

**[DAB-MDD07c]** Referential integrity — no orphan FKs on active rows.

**[DAB-MDD07d]** Data quality dashboard (V1.1): orphaned records, stale indexes, missing stewards.

---

## DAB-MDD08 — Migration Governance

**[DAB-MDD08a]** Every migration references DAB dictionary version bump.

**[DAB-MDD08b]** Checklist: entity in CED → relationship in REL → table in MDD → field registered → RLS policy → event type → search mapping → MASTER_DATA_DICTIONARY update.

**[DAB-MDD08c]** Breaking changes require semver major + rollback script [ENG-DTR08].

---

## DAB-MDD09 — Change Process

1. Propose change in requirements registry trace
2. Update relevant Volume 2 step doc
3. Update this dictionary
4. Update `master-data-dictionary.json`
5. Generate migration SQL
6. Update search/graph/AI projections
7. Record in BUILD-LOG

---

## AC-120 — Acceptance Criteria

- [x] **[AC-120a]** Naming standards and standard columns documented. `[DAB-MDD02, MDD03]`
- [x] **[AC-120b]** Full schema registry and core enums defined. `[DAB-MDD04, MDD05]`
- [x] **[AC-120c]** Stewardship, quality rules, and migration governance established. `[DAB-MDD06–MDD09]`

---

**Volume 2 complete.** Next: close Volume 1 gap [1.5 API Architecture ENG-005] · then Phase 7 implementation.

**End of Volume 2.14 — Master Data Dictionary & Governance.**
