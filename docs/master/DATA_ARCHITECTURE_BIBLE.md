# VOLUME 2 — Data Architecture Bible

**Document ID:** VOLUME-002 · **DAB-001**  
**Artifact:** `DATA_ARCHITECTURE_BIBLE.md`  
**Status:** Canonical · v1 Structure  
**Priority:** Critical — single source of truth for the database  
**Live spec:** `data/registry/data-architecture-bible.json`

> Almost everything in the COS is **connected**. Define the canonical data model once — not table-by-table during implementation.

**Governed by:** [Volume 0](MASTER_ARCHITECTURE_BIBLE.md) · [Volume 1](ENGINEERING_ARCHITECTURE_BIBLE.md)  
**Graph home:** Community Knowledge Graph [MAB-G · NISS-M17 · CKG]

---

## DAB-M01 — Purpose

**[DAB-M01]** The **single source of truth for persistence** — entities, attributes, relationships, lifecycles, permissions, and audit history.

**[DAB-M01a]** Phase registries (`data/registry/*.json`) remain authoritative for **domain rules**; Volume 2 is authoritative for **schema and graph shape**.

---

## Canonical Entity Catalog

| Entity | Purpose | Primary phase ref |
|--------|---------|-------------------|
| **Participant** | Person in the network | PEP-001 · PHQ-001 |
| **Community** | Organizing home | COS-001 · CCN-001 |
| **Educational Institution** | Campus node | INST-001 |
| **County** | Geographic organizing home | CNTY-001 |
| **Mission** | Purpose container | MDS-001 · MPS-001 |
| **Initiative** | Coordinated campaign | IOS-001 |
| **Project** | Work package | EOS-001 |
| **Task** | Atomic work unit | EOS-001 |
| **Event / Experience** | Time-bound gathering | EEOS-001 |
| **Opportunity** | Invitation to participate | OEX-001 · OBE-001 |
| **Story** | Cultural memory | CST-001 |
| **Lesson** | Captured improvement | LIS-001 |
| **Partnership** | Institution collaboration | IPS-001 |
| **Knowledge object** | Playbook, decision, playbook step | CKLS-001 |
| **Committee / Team** | Working group | TWG-001 |
| **Capacity** | Resource availability | CCS-001 |
| **Relationship edge** | Typed connection | REL-M01 · PRN-001 |

---

## Entity Template [DAB-M02]

Every primary entity includes:

```text
Purpose       — why this entity exists in the COS
Attributes    — required and optional fields with types
Relationships — inbound/outbound edges with cardinality
Lifecycle     — status states and transitions [STS-001]
Ownership     — who creates, maintains, archives
Permissions   — who can read/write at each lifecycle stage
Audit         — what events are logged immutably
```

---

## Graph Relationship Model [DAB-M03]

**[DAB-M03a]** Unified graph table pattern:

```sql
entity_relationships (
  id, source_type, source_id, target_type, target_id,
  relationship_type, strength, metadata, valid_from, valid_to,
  created_by, community_scope
)
```

**[DAB-M03b]** **Core edge types:** `member_of`, `organizes`, `mentors`, `invited`, `collaborates_with`, `participated_in`, `contributed_to`, `documented_in`, `partners_with`, `located_in`, `serves`.

**[DAB-M03c]** Signature graphs compose on this base [NISS-001]: trust, growth, conversation, capability, decision, improvement, operational, impact.

---

## Participant [DAB-E01]

**Purpose:** Root identity — individual as database root [OM-L5].

**Key attributes:** `display_name`, `journey_stage` [JRN-001], `visibility_level` [TPS-001], `home_community_id`, `civic_passport_ref` [CJT-001].

**Relationships:** ↔ communities, mentors, invite tree [PON-001], missions, stories.

**Lifecycle:** registered → connected → contributing → leading → mentoring → legacy [PEL-001].

---

## Community [DAB-E02]

**Purpose:** Primary organizing unit [COS-001].

**Key attributes:** `name`, `slug`, `charter_ref` [CCN-001], `growth_stage` [CGS-001], `genome_template_id` [GOS-M10], `county_id`, `institution_id`.

**Relationships:** ↔ participants, missions, teams, knowledge, partnerships.

**Lifecycle:** seed → forming → active → thriving → renewing [CGS-001].

---

## Mission → Initiative → Project → Task [DAB-E03]

**Hierarchy [ACN-001 Action Hierarchy]:**

```text
Mission (why) → Initiative (coordinate) → Project (deliver) → Task (do)
Event/Experience (when people gather) — parallel branch from Mission
```

Shared fields: `status`, `owner_id`, `community_id`, `mission_canvas_ref` [MDS-001], `mor_ref` [ACN-001].

---

## Knowledge Objects [DAB-E04]

**Types:** playbook, decision_record [CDS-001], lesson [LIS-001], playbook_step, faq, policy.

**Provenance [KDG-001]:** `source`, `confidence`, `reviewed_at`, `reviewed_by`.

**Link:** Every knowledge object connects to ≥1 graph entity (mission, community, or story).

---

## Permissions & Audit [DAB-M04]

**[DAB-M04a]** **Permission matrix:** platform role × community role × relationship type × entity lifecycle stage.

**[DAB-M04b]** **Audit history:** append-only `audit_log` — who, what, when, before/after JSON, `trace_id`.

**[DAB-M04c]** **Data classes [KDG-001]:** public · community · restricted · personal — drives RLS policies.

---

## Migration Strategy [DAB-M05]

1. Core identity (participant, community, county, institution)
2. Relationship graph
3. Action hierarchy (mission → task)
4. Growth & invitation (PON, ICS)
5. Knowledge & stories
6. Intelligence aggregates

**Naming:** `YYYYMMDDHHMMSS_{description}.sql`

---

## AC-078 — Acceptance Criteria

- [x] **[AC-078a]** Canonical entity catalog defined. `[DAB-M01]`
- [x] **[AC-078b]** Entity template and graph model documented. `[DAB-M02, M03]`
- [x] **[AC-078c]** Core entities (participant, community, action hierarchy, knowledge) specified. `[DAB-E01–E04]`
- [x] **[AC-078d]** Permissions, audit, migration order established. `[DAB-M04, M05]`
- [ ] **[AC-078e]** Full DDL for every entity (expand v1.1+).

---

**End of Volume 2 v1.**
