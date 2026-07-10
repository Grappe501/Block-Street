# Build Volume 2.3 — Relationship Data Model

### Data Architecture Bible

**Document ID:** VOLUME-002.3 · **DAB-004**  
**Artifact:** `RELATIONSHIP_DATA_MODEL.md`  
**Status:** Canonical  
**Priority:** Critical

**Builds on:** [2.2 Canonical Entity Dictionary](CANONICAL_ENTITY_DICTIONARY.md) [DAB-003] · [1.8 CKG](../volume-01/COMMUNITY_KNOWLEDGE_GRAPH_ARCHITECTURE.md) [ENG-008]  
**Live spec:** `data/registry/relationship-data-model.json`

---

## DAB-REL01 — Purpose

**[DAB-REL01]** The Relationship Data Model defines **how entities connect** — membership, leadership, mentorship, invitations, partnerships, and story links.

**[DAB-REL01a]** Relationships are **first-class data**, not inferred joins alone.

---

## DAB-REL02 — Unified Edge Pattern

**[DAB-REL02a]** Canonical storage: `graph.entity_relationships` [ENG-DB15]:

```text
entity_relationships (
  id              uuid PK
  source_type     text NOT NULL      -- entity type enum
  source_id       uuid NOT NULL
  target_type     text NOT NULL
  target_id       uuid NOT NULL
  relationship_type text NOT NULL    -- edge type enum
  strength        numeric(3,2)       -- 0.0–1.0 optional
  metadata        jsonb              -- edge-specific attrs
  valid_from      timestamptz
  valid_to        timestamptz        -- NULL = current
  community_scope uuid               -- NULL = platform-wide
  created_by      uuid
  created_at      timestamptz
  UNIQUE (source_type, source_id, target_type, target_id, relationship_type, valid_from)
)
```

**[DAB-REL02b]** Domain-specific junction tables **may duplicate** hot paths (e.g. `community_members`) but must **sync to** or **derive from** canonical edges.

---

## DAB-REL03 — Core Relationship Types

| Type | Source → Target | Cardinality | Notes |
|------|-----------------|-------------|-------|
| `member_of` | Participant → Community | N:M | role in metadata |
| `leads` | Participant → Community/Mission/Team | N:M | leadership assignment |
| `mentors` | Participant → Participant | N:M | bidirectional query |
| `invited` | Participant → Participant | 1:N | invite tree [PON-001] |
| `organizes` | Participant → Event/Mission | N:M | |
| `participated_in` | Participant → Event/Mission | N:M | attendance |
| `contributed_to` | Participant → Story/Project | N:M | |
| `partners_with` | Community → Partnership/Institution | N:M | |
| `located_in` | Community/Institution → County | N:1 | geo hierarchy |
| `serves` | Community → County/Institution | N:1 | organizing scope |
| `documents_in` | Story/Lesson → Mission/Event | N:M | narrative link |
| `depends_on` | Project → Project/Task | N:M | work graph |
| `parent_of` | Mission → Project → Task | 1:N | hierarchy edges |

---

## DAB-REL04 — Membership Model

**[DAB-REL04a]** Table: `community.community_members` (performance-optimized view of `member_of`):

```text
community_id, participant_id, role, status, joined_at, invited_by_id
```

**[DAB-REL04b]** **Roles:** `member`, `organizer`, `leader`, `mentor`, `guest` — config-extensible [DAB-CFG].

**[DAB-REL04c]** **Status:** `pending`, `active`, `paused`, `removed`.

**[DAB-REL04d]** Cardinality: Participant **may** belong to many communities; Community **has** many members.

---

## DAB-REL05 — Leadership Model

**[DAB-REL05a]** Edge: `leads` with metadata `{ role_title, term_start, term_end, authority_scope }`.

**[DAB-REL05b]** Supports: community chair, mission lead, team captain, county coordinator.

**[DAB-REL05c]** One participant may hold multiple leadership edges; conflicts resolved by PRE [PRE-001].

---

## DAB-REL06 — Mentorship Model

**[DAB-REL06a]** Edge: `mentors` (directed Participant → Participant).

**[DAB-REL06b]** Metadata: `{ focus_area, started_at, ended_at, visibility }`.

**[DAB-REL06c]** Inverse query: mentees via reverse edge index.

---

## DAB-REL07 — Invitation Model

**[DAB-REL07a]** Table: `growth.invitations`:

```text
id, inviter_id, invitee_email, invitee_id, community_id,
referral_code, status, sent_at, accepted_at, expires_at
```

**[DAB-REL07b]** On accept: create `invited` edge + `member_of` if community scoped [ICS-001 · PON-001].

**[DAB-REL07c]** Cardinality: one invitation → one acceptance; inviter may have many invitations.

---

## DAB-REL08 — Partnership Model

**[DAB-REL08a]** Entity Partnership [DAB-E10] + edges `partners_with` to Community and Institution.

**[DAB-REL08b]** Metadata: `{ agreement_type, contact_id, renewal_date }`.

---

## DAB-REL09 — Story & Mission Relationships

**[DAB-REL09a]** Stories link via `documents_in`, `contributed_to`, `about` (Story → Community/Mission).

**[DAB-REL09b]** Lessons link via `derived_from` (Lesson → Mission/Project/Event).

---

## DAB-REL10 — Parent/Child Hierarchy

**[DAB-REL10a]** Structural hierarchy uses **foreign keys** on entities (project.mission_id) **plus** `parent_of` edges for graph queries.

**[DAB-REL10b]** Cardinality:

| Parent | Child | Cardinality |
|--------|-------|-------------|
| Mission | Project | 1:N |
| Project | Task | 1:N |
| Mission | Event | 1:N |
| Community | Mission | 1:N |
| County | Community | 1:N |

---

## DAB-REL11 — Signature Graph Composition

**[DAB-REL11a]** Signature graphs [NISS-001] **compose** from base edges:

| Signature | Primary edge types |
|-----------|-------------------|
| Trust | `mentors`, `leads`, `member_of` |
| Growth | `invited`, `member_of`, `participated_in` |
| Conversation | event participation + comms refs |
| Capability | skills metadata on participant |
| Decision | knowledge objects + `documents_in` |
| Improvement | lessons + `derived_from` |
| Operational | missions, projects, tasks |
| Impact | stories + outcomes metadata |

**[DAB-REL11b]** Detail: [KNOWLEDGE_GRAPH_SCHEMA.md](KNOWLEDGE_GRAPH_SCHEMA.md) [DAB-006].

---

## DAB-REL12 — Temporal Validity

**[DAB-REL12a]** Edges support `valid_from` / `valid_to` for historical membership and leadership terms.

**[DAB-REL12b]** Current edges: `valid_to IS NULL`.

**[DAB-REL12c]** Living History Engine consumes edge changes as events [LHE-001].

---

## AC-109 — Acceptance Criteria

- [x] **[AC-109a]** Unified edge pattern and core relationship types documented. `[DAB-REL02, REL03]`
- [x] **[AC-109b]** Membership, leadership, mentorship, invitation, and partnership models defined. `[DAB-REL04–REL08]`
- [x] **[AC-109c]** Hierarchy, cardinality, and signature graph composition specified. `[DAB-REL09–REL11]`

---

**Next step:** [2.4 — Database Schema Blueprint](DATABASE_SCHEMA_BLUEPRINT.md) [DAB-005]

**End of Volume 2.3.**
