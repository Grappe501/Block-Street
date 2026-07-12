# Initiative Canonical Data Model

**Build:** 11.1 · **Wave:** W2 · **System ID:** INI-001  
**Wave ID:** CAE-11.1-W2  
**Governed by:** [01_CONSTITUTION.md](01_CONSTITUTION.md)

## Mission

One canonical Initiative model for all services, APIs, reports, and workflows. After W2 there is a single schema; MVP legacy flat records project through the legacy adapter until W3 migrates the store.

## Canonical Source

| Layer | Location |
|-------|----------|
| TypeScript | `src/lib/civic-action/builds/11.1/data-model.ts` |
| Entity schema | `data/phase-11/initiative_entity_schema.json` |
| Database contract | `data/phase-11/initiative_database_contract.json` |
| State machine | `data/phase-11/initiative_state_machine.json` |

## Entity Graph

```text
Institution ──owns──▶ Initiative
                        ├── InitiativeCharter (versioned)
                        ├── InitiativeScope (versioned)
                        ├── InitiativeTimeline
                        ├── InitiativeMembership
                        ├── InitiativeVersion
                        ├── InitiativeDependency
                        ├── InitiativeReview
                        ├── InitiativeHistoryEvent (append-only)
                        └── InitiativeCloseout
                        │
                        ├──▶ Objectives (11.2)
                        └──▶ Workstreams (11.3) ──▶ Missions
```

## Initiative Record

| Field | Required | Notes |
|-------|----------|-------|
| initiative_id | ✓ | UUID, immutable |
| institution_id | ✓ | One governing institution |
| initiative_type | ✓ | Primary type from taxonomy |
| initiative_name | ✓ | Internal name |
| initiative_slug | ✓ | Unique per institution |
| public_name | | Optional public label |
| executive_owner_human_id | ✓ | Exactly one |
| operational_owner_human_id | ✓ | Exactly one |
| backup_owner_human_id | | Recommended for high-risk |
| status | ✓ | Single active lifecycle state |
| governance_class | ✓ | 1–5 |
| visibility | ✓ | W1 visibility model |
| strategic_priority_id | | Links to 11.2 |
| portfolio_category | | Institution-configurable |
| current_version | ✓ | Monotonic |
| is_archived | ✓ | Soft archive flag |
| created_at, created_by, updated_at, updated_by | ✓ | Standard audit fields |

## Charter Record

Stores constitutional content: problem, opportunity, purpose, alignment, success definition, in/out of scope, public description, review frequency, closeout basis, charter_status, version, approval metadata.

## Scope Record

Geographic, population, institution, functional, resource, visibility, and data boundaries — versioned.

## Timeline Record

concept_date through archive_date, plus next_review_date.

## Membership Record

Every participating Human: role, institution_membership_id, institution_id, authority_level, status, assigned_at, ended_at.

## Identifiers (Immutable)

```text
initiative_id · charter_id · scope_id · timeline_id · membership_id
initiative_version_id · initiative_dependency_id · initiative_event_id · closeout_id
```

## Store Keys (W3 persistence)

```text
canonical_initiatives · initiative_charters · initiative_scopes · initiative_timelines
initiative_memberships · initiative_versions · initiative_dependencies · initiative_reviews
initiative_history_events · initiative_closeouts
```

## Legacy Migration

`LegacyInitiative` (MVP `store.json`) → `legacyInitiativeToCanonical()` → `InitiativeAggregate`. Full store migration in **11.1-W3**.

## Related Documents

- [ENTITY_RELATIONSHIP_MODEL.md](ENTITY_RELATIONSHIP_MODEL.md)
- [INITIATIVE_DATABASE_CONTRACT.md](INITIATIVE_DATABASE_CONTRACT.md)
- [INITIATIVE_STATE_MACHINE.md](INITIATIVE_STATE_MACHINE.md)
- [INITIATIVE_VERSIONING.md](INITIATIVE_VERSIONING.md)
- [INITIATIVE_AUDIT_MODEL.md](INITIATIVE_AUDIT_MODEL.md)
- [INITIATIVE_DEPENDENCY_MODEL.md](INITIATIVE_DEPENDENCY_MODEL.md)
- [INITIATIVE_RETENTION_POLICY.md](INITIATIVE_RETENTION_POLICY.md)

## W2 Status

Documentation and contracts **complete**. Service enforcement **planned 11.1-W3**.
