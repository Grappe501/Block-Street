# Digital Constitution Layer

**Document ID:** DCL-001  
**Artifact:** `DIGITAL_CONSTITUTION_LAYER.md`  
**Status:** Canonical  
**Priority:** Critical  
**Parent:** [Database Architecture](DATABASE_ARCHITECTURE.md) [ENG-004 · ENG-DB32]

**Live spec:** `data/registry/digital-constitution-layer.json`

> The platform's **living rulebook** — canonical definitions stored in the database, not hardcoded in application code.

---

## DCL-M01 — Purpose

**[DCL-M01]** Beyond application instance data, the **Digital Constitution Layer** (`constitution` schema) stores **governing definitions** that shape how the COS behaves.

**[DCL-M01a]** When governance evolves, many changes update **canonical definitions** rather than rewriting services [ENG-SA09 Configuration Philosophy · MAB principle 19].

---

## DCL-M02 — What Belongs in DCL

**[DCL-M02]** Store canonical definitions for:

| Category | Examples | Phase ref |
|----------|----------|-----------|
| **Community types** | Campus · county · civic · institution-hosted | CEF-001 |
| **Leadership pathways** | Mentor · organizer · ambassador stages | CLD-001 |
| **Mission categories** | Service · advocacy · education · civic | MDS-001 |
| **Relationship types** | member_of · mentors · invited · partners_with | REL-M01 · ENG-DB19 |
| **Permission models** | Role × resource × action matrices | ENG-006 · [PRE-001](PERMISSION_RESOLUTION_ENGINE.md) |
| **Recognition categories** | Milestone types · gratitude categories | CRA-001 |
| **Workflow definitions** | Welcome journey · foundry launch · mission design | WBS-001 · CEF-001 |
| **Growth stages** | CGS seven stages · GOS readiness levels | CGS-001 · GOS-001 |
| **Status transitions** | Allowed lifecycle edges per entity type | STS-001 |
| **Constitutional principles** | CP-* definitions · version history | BUILD-BIBLE · CCN-001 |

**[DCL-M02a]** **Not in DCL:** Instance data (this community's name), participant records, story content — those live in domain schemas.

---

## DCL-M03 — Schema Pattern

**[DCL-M03a]** Core tables:

```sql
constitution.definition_types (
  id text PRIMARY KEY,           -- e.g. 'relationship_type', 'growth_stage'
  name text NOT NULL,
  description text,
  version integer NOT NULL DEFAULT 1
);

constitution.definitions (
  id uuid PRIMARY KEY,
  type_id text REFERENCES constitution.definition_types(id),
  key text NOT NULL,             -- stable slug e.g. 'member_of', 'seed'
  label text NOT NULL,
  metadata jsonb DEFAULT '{}',   -- type-specific config
  effective_from timestamptz NOT NULL DEFAULT now(),
  effective_to timestamptz,
  superseded_by uuid REFERENCES constitution.definitions(id),
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (type_id, key, effective_from)
);

constitution.status_transitions (
  id uuid PRIMARY KEY,
  entity_type text NOT NULL,
  from_status text NOT NULL,
  to_status text NOT NULL,
  requires_role text[],
  community_scoped boolean DEFAULT true,
  metadata jsonb DEFAULT '{}'
);

constitution.principle_versions (
  id uuid PRIMARY KEY,
  principle_id text NOT NULL,    -- e.g. 'CP-016'
  version integer NOT NULL,
  statement text NOT NULL,
  approved_at timestamptz,
  approved_by uuid,
  doc_ref text                   -- link to BUILD-BIBLE / phase doc
);
```

**[DCL-M03b]** Services **read** definitions at runtime · cache with TTL · invalidate on constitution update event.

---

## DCL-M04 — Versioning & Governance

**[DCL-M04a]** Definition changes create **new rows** with `effective_from` — history preserved.

**[DCL-M04b]** Breaking changes require: migration note · BUILD-LOG entry · director approval for constitutional principles.

**[DCL-M04c]** Aligns with [CCN-001](../phase-04/COMMUNITY_CONSTITUTION.md) — platform constitution + community charters inherit from DCL defaults.

---

## DCL-M05 — V1 Transitional State

**[DCL-M05a]** Today: many definitions live in **phase docs + JSON registries** (`data/registry/`).

**[DCL-M05b]** **Migration path:** Seed `constitution.definitions` from registries on DB connect · registries become export/sync source until fully migrated.

**[DCL-M05c]** New enumerations added to DCL schema design **first** — code references `definition.key`, not string literals.

---

## DCL-M06 — Application Integration

**[DCL-M06a]** `src/lib/kernel/constitution/` — read API:

- `getDefinition(type, key)` · `getStatusTransitions(entityType)` · `getRelationshipTypes()`

**[DCL-M06b]** UI labels and workflow steps **resolve from DCL** — enables configuration without deploy for supported changes.

---

## AC-088 — Acceptance Criteria

- [x] **[AC-088a]** DCL purpose and categories documented. `[DCL-M02]`
- [x] **[AC-088b]** Schema pattern specified. `[DCL-M03]`
- [x] **[AC-088c]** Versioning and V1 migration path defined. `[DCL-M04, M05]`

---

**End of Digital Constitution Layer.**
