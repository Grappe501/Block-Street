# Build Volume 2.3 — Relationship Data Model

### Data Architecture Bible

**Document ID:** VOLUME-002.3 · **DAB-004**  
**Artifact:** `RELATIONSHIP_DATA_MODEL.md`  
**Status:** Canonical  
**Priority:** Critical

**Builds on:** [2.2 Canonical Entity Dictionary](CANONICAL_ENTITY_DICTIONARY.md) [DAB-003] · [1.8 CKG](../volume-01/COMMUNITY_KNOWLEDGE_GRAPH_ARCHITECTURE.md) [ENG-008]  
**Live spec:** `data/registry/relationship-data-model.json`

---

## Purpose

**[DAB-REL01]** The Relationship Data Model defines how the Community Operating System represents, stores, evolves, and understands relationships between entities.

**[DAB-REL01a]** Unlike traditional software, the COS is fundamentally **relationship-centered**.

**[DAB-REL01b]** Communities are not built from records. Communities are built from relationships.

**[DAB-REL01c]** This document establishes relationships as **first-class architectural objects** rather than simple database join tables.

---

## Guiding Principle

**[DAB-REL02]**

> **Relationships are data—not just connections between data.**

**[DAB-REL02a]** A relationship has its own lifecycle, history, permissions, and meaning.

---

## Philosophy

**[DAB-REL03]** Traditional systems often model relationships as:

```text
Participant_ID + Community_ID → Done.
```

**[DAB-REL03a]** The Community Operating System models:

- Who?
- Connected to whom?
- Why?
- Since when?
- Through what?
- How strong?
- Current status?
- History?
- Related stories?
- Related missions?

**[DAB-REL03b]** Relationships become rich objects.

---

## Relationship Philosophy

**[DAB-REL04]** Every relationship should answer:

- Who or what is connected?
- Why are they connected?
- When did the relationship begin?
- Is it active?
- Has it changed?
- Who created it?
- What events strengthened it?
- What knowledge resulted?

**[DAB-REL04a]** Relationships become living history.

---

## Relationship Architecture

**[DAB-REL05]** Every relationship consists of:

```text
Entity A
      ↓
Relationship Type
      ↓
Entity B
      ↓
Relationship Metadata
      ↓
Relationship History
```

**[DAB-REL05a]** Relationships are first-class entities — especially when they have their own lifecycle (Membership, Mentorship, Partnership, Attendance, Application) [DAB-CED11].

---

## Unified Edge Pattern (Canonical Storage)

**[DAB-REL06]** Canonical storage: `graph.entity_relationships` [ENG-DB15]:

```text
entity_relationships (
  id                uuid PK
  source_type       text NOT NULL      -- entity type enum
  source_id         uuid NOT NULL
  target_type       text NOT NULL
  target_id         uuid NOT NULL
  relationship_type text NOT NULL      -- edge type enum
  strength          numeric(3,2)       -- optional signal, not simplistic score
  metadata          jsonb              -- edge-specific attrs
  valid_from        timestamptz
  valid_to          timestamptz        -- NULL = current
  community_scope   uuid               -- NULL = platform-wide
  visibility        text               -- permission class
  provenance        jsonb              -- who/how established
  created_by        uuid
  updated_by        uuid
  created_at        timestamptz
  updated_at        timestamptz
)
```

**[DAB-REL06a]** Domain-specific junction tables **may duplicate** hot paths (e.g. `community_members`) but must **sync to** or **derive from** the Relationship Ledger / canonical edges.

---

## Relationship Categories

**[DAB-REL07]** The platform recognizes ten relationship categories.

### Membership Relationships [DAB-REL07a]

Examples: Participant ↔ Community · Participant ↔ Committee · Participant ↔ Initiative · Participant ↔ Organization

**Attributes:** Join date · Status · Roles · Participation history · Leadership history

### Leadership Relationships [DAB-REL07b]

Examples: Participant ↔ Leadership Role · Leader ↔ Community · Leader ↔ Initiative

**Note:** Leadership relationships preserve succession history.

### Mentorship Relationships [DAB-REL07c]

Examples: Mentor ↔ Participant · Mentor ↔ Community Builder · Mentor ↔ Leadership pathway

**Includes:** Goals · Progress · Meetings · Outcomes · Completion

### Invitation Relationships [DAB-REL07d]

Examples: Participant invited Participant · Community invited Participant · Institution invited Community

**Note:** Invitation history remains permanent [ICS-001 · PON-001].

### Partnership Relationships [DAB-REL07e]

Examples: Community ↔ Organization · Institution ↔ Community · County ↔ University · Partner ↔ Initiative

**Note:** Partnerships evolve over time.

### Collaboration Relationships [DAB-REL07f]

Examples: Mission ↔ Community · Community ↔ Community · Volunteer ↔ Project · Committee ↔ Initiative

**Note:** Collaboration creates network intelligence.

### Geographic Relationships [DAB-REL07g]

Examples: Community located in County · Institution located in City · County within Region · Venue inside Campus

**Note:** Geography becomes relational.

### Knowledge Relationships [DAB-REL07h]

Examples: Lesson improves Playbook · Story references Mission · Community Brain entry supports Community

**Note:** Knowledge relationships compound over time.

### Story Relationships [DAB-REL07i]

Stories connect to: Participants · Communities · Missions · Events · Lessons · Media · Recognition

**Note:** Stories become navigable.

### Resource Relationships [DAB-REL07j]

Examples: Equipment assigned to Event · Facility supports Community · Transportation supports Mission · Volunteer has Skill

**Note:** Capacity becomes searchable [CCS-001 · CCE-001].

---

## Relationship Types (Configurable)

**[DAB-REL08]** Relationship type should be configurable [DAB-010]. Core types:

| Type | Category | Source → Target |
|------|----------|-----------------|
| `member_of` | Membership | Participant → Community/Committee/Initiative |
| `leads` | Leadership | Participant → Community/Mission/Team |
| `mentors` | Mentorship | Participant → Participant |
| `invited` | Invitation | Participant → Participant |
| `supports` | Collaboration | Community/Mission → Mission/Project |
| `organizes` | Collaboration | Participant → Event/Mission |
| `attended` | Membership | Participant → Event |
| `participated_in` | Collaboration | Participant → Event/Mission |
| `partners_with` | Partnership | Community → Partner/Institution |
| `collaborates_with` | Collaboration | Community → Community |
| `located_in` | Geographic | Entity → County/Region/City |
| `serves` | Geographic | Community → County/Institution |
| `published` | Story | Participant → Story |
| `created` | Knowledge | Participant → Mission/Project/Story |
| `completed` | Collaboration | Participant → Mission/Task |
| `inspired` | Story | Story → Participant/Mission |
| `uses` | Resource | Event/Mission → Resource |
| `improves` | Knowledge | Lesson → Playbook/Knowledge Object |
| `succeeded_by` | Leadership | Leadership Role → Leadership Role |
| `references` | Knowledge | Story/Lesson → Mission/Event |
| `contributed_to` | Story | Participant → Story/Project |
| `documents_in` | Story | Story/Lesson → Mission/Event |
| `derived_from` | Knowledge | Lesson → Mission/Project/Event |
| `parent_of` | Hierarchy | Mission → Project → Task |
| `has_skill` | Resource | Participant → Skill |

**[DAB-REL08a]** Configuration enables future expansion without schema redesign.

---

## Relationship Metadata

**[DAB-REL09]** Every relationship should support:

| Field | Purpose |
|-------|---------|
| Unique ID | Stable ledger reference |
| Relationship Type | Configurable type enum |
| Start Date | `valid_from` |
| End Date | `valid_to` |
| Status | Lifecycle state |
| Visibility | Independent from entity visibility |
| Source / Provenance | Who established, how verified |
| Created By / Updated By | Stewardship |
| Confidence | When applicable (AI-assisted links) |
| Notes | Human context |

**[DAB-REL09a]** Metadata transforms simple links into meaningful history.

---

## Relationship Lifecycle

**[DAB-REL10]** Typical lifecycle:

```text
Proposed
  ↓
Pending
  ↓
Active
  ↓
Paused
  ↓
Completed
  ↓
Archived
```

**[DAB-REL10a]** Different relationship types may customize their lifecycle (e.g. invitation: `sent` → `accepted` → `expired`).

**[DAB-REL10b]** Current edges: `valid_to IS NULL` · status = `active`.

---

## Relationship Strength

**[DAB-REL11]** The architecture supports measuring relationship strength **without reducing it to a simplistic score**.

Signals may include:

- Shared missions
- Volunteer history
- Mentorship duration
- Events attended together
- Knowledge contributions
- Collaborative initiatives

**[DAB-REL11a]** Future intelligence may interpret these signals [NISS-001 · CIS-001].

---

## Temporal Relationships

**[DAB-REL12]** Relationships change over time. Example progression:

```text
Volunteer → Committee Member → Committee Chair → Mentor → Community Advisor
```

**[DAB-REL12a]** The entire progression remains visible via historical ledger entries and `valid_from` / `valid_to` edges.

---

## Multiple Concurrent Relationships

**[DAB-REL13]** The same entities may have multiple concurrent relationships.

Example — Alex: Volunteer · Mentor · Committee Chair · Story Contributor · Knowledge Curator

**[DAB-REL13a]** The model must never force one relationship to replace another.

---

## Relationship Provenance

**[DAB-REL14]** Relationships should record:

- Who established it?
- Participant-created vs system-generated?
- Imported from external source?
- Verified by steward?
- External source attribution?

**[DAB-REL14a]** Trust begins with provenance.

---

## Relationship Visibility

**[DAB-REL15]** Relationships support visibility evaluated **independently** from entities:

Private · Community · Regional · Statewide · Public

**[DAB-REL15a]** Traversal respects permission boundaries [PRE-001].

---

## Relationship History

**[DAB-REL16]** Every meaningful change becomes historical data.

Examples: Leadership reassigned · Mentorship completed · Invitation accepted · Partnership expanded · Committee membership ended

**[DAB-REL16a]** History strengthens institutional memory [LHE-001 · CJT-001].

---

## Graph Projection

**[DAB-REL17]** Every relationship projects into the Community Knowledge Graph [ENG-008 · DAB-006].

- Relationships become **graph edges**
- Metadata becomes **edge properties**
- Graph queries remain **synchronized** with relational truth

**[DAB-REL17a]** Signature graphs compose from base edges [NISS-001]:

| Signature | Primary edge types |
|-----------|-------------------|
| Trust | `mentors`, `leads`, `member_of` |
| Growth | `invited`, `member_of`, `participated_in` |
| Conversation | event participation + comms refs |
| Capability | `has_skill`, resource assignments |
| Decision | knowledge objects + `documents_in` |
| Improvement | `improves`, `derived_from` |
| Operational | missions, projects, tasks, `parent_of` |
| Impact | stories + outcomes metadata |

---

## Relationship Search

**[DAB-REL18]** Participants should search relationships.

Examples: Mentors · Past collaborators · Communities connected to mine · Partner organizations · Stories related to missions

**[DAB-REL18a]** Relationship search enables discovery [ENG-010 · DAB-011].

---

## Relationship Intelligence

**[DAB-REL19]** Intelligence systems analyze:

- Mentorship networks
- Leadership pipelines
- Community collaboration
- Institution partnerships
- Knowledge flow
- Growth patterns

**[DAB-REL19a]** Relationships become strategic assets [CIS-001 · OPIS-001].

---

## AI Integration

**[DAB-REL20]** AI may:

- Recommend mentors
- Identify collaboration opportunities
- Suggest partnership introductions
- Summarize relationship history
- Recommend leadership succession

**[DAB-REL20a]** All recommendations remain explainable with source references [CIF-001 · DAB-013].

---

## Relationship Ledger

**[DAB-REL21]** **Major Architectural Recommendation:** Create a **Relationship Ledger** as one of the platform's foundational data structures.

Unlike a traditional join table, the Relationship Ledger records every significant relationship that exists or has existed in the COS.

Each ledger entry captures:

| Field | Description |
|-------|-------------|
| Participating entities | Entity A + Entity B (typed) |
| Relationship type | Configurable type |
| Context | Why/how created |
| Timeline of changes | Status transitions, valid_from/valid_to |
| Related events | Linked event records |
| Supporting stories | Narrative connections |
| Knowledge generated | Lessons, playbooks |
| Visibility | Permission class |
| Audit history | Actor, action, timestamp |

**[DAB-REL21a]** The Relationship Ledger becomes the historical backbone of the Community Knowledge Graph.

**[DAB-REL21b]** Every mentorship, partnership, leadership assignment, invitation, collaboration, and community membership contributes to this ledger.

**[DAB-REL21c]** Live spec: `data/registry/relationship-data-model.json` · canonical table: `graph.entity_relationships`

---

## Implementation Patterns (Domain Tables)

**[DAB-REL22]** Performance-optimized views of ledger edges:

### Membership — `community.community_members`

```text
community_id, participant_id, role, status, joined_at, invited_by_id
```

Roles: `member`, `organizer`, `leader`, `mentor`, `guest` — config-extensible

### Invitation — `growth.invitations`

```text
id, inviter_id, invitee_email, invitee_id, community_id,
referral_code, status, sent_at, accepted_at, expires_at
```

On accept: create `invited` edge + `member_of` if community scoped

### Hierarchy (FK + edges)

| Parent | Child | Cardinality |
|--------|-------|-------------|
| Mission | Project | 1:N |
| Project | Task | 1:N |
| Mission | Event | 1:N |
| Community | Mission | 1:N |
| County | Community | 1:N |

Structural hierarchy uses foreign keys **plus** `parent_of` edges for graph queries.

---

## Burt Implementation Guidance

**[DAB-REL23]** Implementation should:

1. Treat relationships as first-class entities whenever they have their own lifecycle
2. Preserve relationship history in the Relationship Ledger
3. Separate relationship metadata from entity metadata
4. Support graph projections synchronized with SQL canonical truth
5. Respect permission boundaries during traversal
6. Keep relationship types configurable
7. Never reduce relationships to anonymous join rows

---

## AC-109 — Acceptance Criteria

Volume 2.3 is complete when:

- [x] **[AC-109a]** Relationship philosophy is documented. `[DAB-REL03–REL04]`
- [x] **[AC-109b]** Relationship categories are established. `[DAB-REL07]`
- [x] **[AC-109c]** Lifecycle, metadata, and history are defined. `[DAB-REL09–REL16]`
- [x] **[AC-109d]** Graph projection and intelligence integration are specified. `[DAB-REL17–REL20]`
- [x] **[AC-109e]** Relationship Ledger established. `[DAB-REL21]`
- [x] **[AC-109f]** Burt has a complete blueprint for relationship-centered architecture. `[DAB-REL23]`

---

**Next step:** [2.4 — Database Schema Blueprint](DATABASE_SCHEMA_BLUEPRINT.md) [DAB-005]

**End of Volume 2.3.**
