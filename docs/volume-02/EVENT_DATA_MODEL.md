# Build Volume 2.6 — Event Data Model

### Data Architecture Bible

**Document ID:** VOLUME-002.6 · **DAB-007**  
**Artifact:** `EVENT_DATA_MODEL.md`  
**Status:** Canonical  
**Priority:** Critical

**Builds on:** [2.5 Knowledge Graph Schema](KNOWLEDGE_GRAPH_SCHEMA.md) [DAB-006] · [1.9 Event & Timeline](../volume-01/EVENT_TIMELINE_ARCHITECTURE.md) [ENG-009] · [Living History Engine](../volume-01/LIVING_HISTORY_ENGINE.md) [LHE-001]  
**Live spec:** `data/registry/event-data-model.json`

> Events are more than logs. They are the **permanent historical record of community life.**

---

## Purpose

**[DAB-EVT01]** The Event Data Model defines how the Community Operating System records every **meaningful action** that occurs throughout the platform.

**[DAB-EVT01a]** Events power:

| Consumer | Use |
|----------|-----|
| Living History Engine | Narrative timelines [LHE-001] |
| Timelines | Participant, community, mission views |
| Community Knowledge Graph | Graph projections [DAB-006] |
| Digital Twins | State reconstruction [LDT-001] |
| Search | Historical exploration [DAB-011] |
| Notifications | Activity-driven comms [AME-001] |
| Analytics | Rollups and KPIs [DAB-012] |
| AI | Context, summaries, trends [DAB-013] |
| Audit | Trustworthy institutional memory |
| Organizational memory | How communities evolved |

**[DAB-EVT01b]** The event model allows the platform to understand **what happened, why it happened, and how communities evolved over time.**

---

## Guiding Principle

**[DAB-EVT02]**

> **Nothing important should happen without leaving a trace.**

**[DAB-EVT02a]** Every meaningful action becomes part of the community's shared memory.

---

## Philosophy

**[DAB-EVT03]** Traditional applications store only the current state.

**[DAB-EVT03a]** The Community Operating System stores:

- Current state
- Historical events
- Relationships
- Context
- Consequences

**[DAB-EVT03b]** The present can always be **reconstructed from the past** [DAB-PH09].

---

## Event Philosophy

**[DAB-EVT04]** An event represents **one meaningful occurrence**.

Examples: Participant registered · Community launched · Mission created · Volunteer checked in · Story published · Knowledge captured · Leader appointed · Invitation accepted

**[DAB-EVT04a]** Events are **immutable**. They describe history — not mutable state.

**[DAB-EVT04b]** Corrections use correction events, superseding events, or administrative notes — never in-place modification [DAB-EVT15].

---

## Event Architecture

**[DAB-EVT05]** Every event contains five components:

```text
Actor
      ↓
Action
      ↓
Target
      ↓
Context
      ↓
Timestamp
```

**[DAB-EVT05a]** Every event should answer:

| Question | Component |
|----------|-----------|
| Who? | Actor |
| Did what? | Action |
| To what? | Target |
| Where? | Context (community, county, location) |
| When? | Timestamp |
| Why? | Context metadata, correlation, payload |

---

## Event Categories

**[DAB-EVT06]** Events align to business domains [DAB-SCH04] — eleven category groups.

### Identity Events

**[DAB-EVT06a]** Examples: Participant Registered · Profile Updated · Password Changed · Account Verified · Preferences Updated

**[DAB-EVT06a1]** Identity history remains permanent.

### Community Events

**[DAB-EVT06b]** Examples: Community Created · Community Activated · Committee Formed · Membership Joined · Membership Ended · Community Archived

### Leadership Events

**[DAB-EVT06c]** Examples: Leader Assigned · Leader Removed · Mentorship Started · Mentorship Completed · Leadership Promoted · Succession Completed

### Mission Events

**[DAB-EVT06d]** Examples: Mission Created · Mission Approved · Mission Started · Milestone Completed · Mission Finished · Mission Reflected

### Experience Events

**[DAB-EVT06e]** Examples: Event Scheduled · Registration Completed · Attendance Recorded · Volunteer Checked In · Workshop Finished · Community Celebration

### Growth Events

**[DAB-EVT06f]** Examples: Invitation Sent · Invitation Accepted · Referral Created · Belonging Milestone · Community Launch · Ambassador Recognition

### Knowledge Events

**[DAB-EVT06g]** Examples: Story Published · Lesson Added · Playbook Updated · Knowledge Shared · Legacy Recorded · Mission Reflection Saved

### Partnership Events

**[DAB-EVT06h]** Examples: Partner Added · Agreement Signed · Collaboration Started · Collaboration Completed · Facility Shared

### Capacity Events

**[DAB-EVT06i]** Examples: Skill Added · Equipment Assigned · Facility Reserved · Transportation Scheduled · Capacity Updated

### Communication Events

**[DAB-EVT06j]** Examples: Announcement Published · Notification Delivered · Digest Generated · Reminder Sent · Communication Read

### Intelligence Events

**[DAB-EVT06k]** Examples: Recommendation Generated · Insight Published · Digital Twin Updated · Graph Projection Completed · Forecast Generated

**[DAB-EVT06k1]** Intelligence events describe intelligence activity **without becoming canonical truth** [DAB-SCH16a].

---

## Event Metadata

**[DAB-EVT07]** Every event includes:

| Field | Purpose |
|-------|---------|
| Canonical Event ID | Stable unique identifier |
| Event Type | Namespaced type (e.g. `community.membership.joined`) |
| Actor | Who performed the action |
| Target | Primary entity affected |
| Related Objects | Secondary entities involved |
| Community Context | Scope for permissions and timelines |
| Timestamp | When it occurred |
| Visibility | Permission class |
| Status | Processing/delivery state where applicable |
| Source | Service or channel that emitted |
| Version | Schema and producer versioning |
| Correlation ID | Workflow grouping |

**[DAB-EVT07a]** Metadata provides **context** — not redundant canonical state.

---

## Event Context

**[DAB-EVT08]** Context may include:

Community · Mission · County · Institution · Event · Initiative · Committee · Campaign · Location

**[DAB-EVT08a]** Context makes events **meaningful** — the same action type differs by scope.

---

## Event Visibility

**[DAB-EVT09]** Every event supports:

Private · Team · Community · Regional · Statewide · Public

**[DAB-EVT09a]** Visibility is enforced by **authorization** — aligned with [DAB-REL visibilityLevels].

---

## Event Immutability

**[DAB-EVT10]** Once committed, events should **never be modified**.

**[DAB-EVT10a]** Corrections create:

- Correction Events
- Superseding Events
- Administrative Notes

**[DAB-EVT10b]** History remains **trustworthy**. GDPR erasure uses redaction metadata, not deletion [DAB-SPM].

---

## Event Versioning

**[DAB-EVT11]** Event definitions evolve. Each event records:

- Schema Version
- Producer Version
- Platform Version
- Migration compatibility

**[DAB-EVT11a]** Versioning supports **long-term evolution** — consumers handle multiple schema versions during transition.

---

## Event Correlation

**[DAB-EVT12]** Large workflows generate many events. **Correlation IDs** connect them.

Example workflow — Launch Community:

```text
Launch Community (correlation root)
     ↓
Community Created
     ↓
Leader Assigned
     ↓
Welcome Journey Started
     ↓
Knowledge Space Initialized
     ↓
Invitation Campaign Started
     ↓
Community Activated
```

**[DAB-EVT12a]** The workflow becomes **traceable** end-to-end.

---

## Event Streams

**[DAB-EVT13]** Events naturally organize into streams:

Participant Stream · Community Stream · Mission Stream · County Stream · Institution Stream · Story Stream · Leadership Stream

**[DAB-EVT13a]** Streams simplify **replay and analytics** — subscribe by aggregate or scope.

---

## Replay Philosophy

**[DAB-EVT14]** Historical events should support **replay**.

Replay enables:

- Timeline reconstruction
- Graph rebuilding [DAB-KGS13]
- Analytics regeneration
- Digital Twin rebuilding [LDT-001]
- Search index rebuilding [DAB-011]
- AI context rebuilding [DAB-013]

**[DAB-EVT14a]** Replay improves **resilience** — derived systems are rebuildable.

**[DAB-EVT14b]** Replay order: `occurred_at`, then `recorded_at`, then canonical event ID. Idempotent consumers deduplicate by event ID.

---

## Event Ordering

**[DAB-EVT15]** Events should preserve **chronological order**.

**[DAB-EVT15a]** Ordering should remain **deterministic** whenever possible.

**[DAB-EVT15b]** History should always be **reproducible**.

---

## Event Retention

**[DAB-EVT16]** Most community events should remain **permanently archived**.

**[DAB-EVT16a]** Operational logs may have different retention policies.

**[DAB-EVT16b]** **Institutional memory is valuable** — default retention favors permanence over deletion.

**[DAB-EVT16c]** Cold archive supported for scale; schema unchanged [ENG-009 implementation note].

---

## Timeline Integration

**[DAB-EVT17]** Every event contributes to:

Participant Timeline · Community Timeline · Mission Timeline · Leadership Timeline · County Timeline · Institution Timeline · Platform Timeline

**[DAB-EVT17a]** One event may appear in **multiple timelines** [LHE-001].

**[DAB-EVT17b]** Timelines are curated **presentation layers**; underlying events remain immutable.

---

## Graph Integration

**[DAB-EVT18]** Events generate graph updates via the Unified Graph Projection Engine [DAB-KGS13]:

```text
Participant Joined Community (event)
        ↓
Membership Relationship (canonical)
        ↓
Knowledge Graph Edge (projection)
        ↓
Community Digital Twin (projection)
        ↓
Analytics (projection)
        ↓
Recommendations (projection)
```

**[DAB-EVT18a]** Events **power intelligence** — they do not replace canonical relational truth.

---

## Search Integration

**[DAB-EVT19]** Events become searchable by:

Date · Actor · Community · Mission · Event Type · Location · Relationship

**[DAB-EVT19a]** Historical exploration becomes **natural** — events index into search read models [DAB-011].

---

## AI Integration

**[DAB-EVT20]** AI may:

- Summarize events
- Detect trends
- Generate annual reports
- Recommend follow-up
- Identify milestones
- Interpret history

**[DAB-EVT20a]** AI **never modifies historical events** [DAB-PH10 · CIF-001].

---

## Community Event Ledger

**[DAB-EVT21]** **Major Architectural Recommendation:** Maintain a **Community Event Ledger** as the authoritative chronological record of everything that happens within the platform.

**[DAB-EVT21a]** Unlike traditional audit logs, the ledger is organized around **meaningful community activity** rather than technical operations.

**[DAB-EVT21b]** Every ledger entry records:

- Event type
- Actor
- Target
- Context
- Timestamp
- Correlation ID
- Related entities
- Visibility
- Source
- Event schema version

**[DAB-EVT21c]** The ledger becomes the foundation for:

Living History Engine · CKG projections · Digital Twin reconstruction · Timeline generation · Search indexing · Notification generation · Analytics rollups · AI context retrieval

**[DAB-EVT21d]** **Rebuildability:** If a search index, graph projection, Digital Twin, or analytics model is lost or corrupted, it can be reconstructed by **replaying the Community Event Ledger** against current platform architecture.

**[DAB-EVT21e]** Principle: **Canonical truth is written once, and every specialized view of that truth is derived from it.**

**[DAB-EVT21f]** Live spec: `data/registry/event-data-model.json` · `communityEventLedger`

---

## Burt Implementation Guidance

**[DAB-EVT22]** Implementation should:

1. Treat events as **immutable records**
2. Publish events from every major domain service
3. Preserve **correlation IDs** across workflows
4. Support **replay** from canonical history
5. Build timelines and graph projections from events
6. Separate **event definitions** from business logic
7. Consult the Community Event Ledger spec before any emitter change

**[DAB-EVT22a]** Physical storage detail: [ENG-009](../volume-01/EVENT_TIMELINE_ARCHITECTURE.md) · kernel event bus [ENG-ET20] · outbox pattern for reliable delivery.

---

## AC-112 — Acceptance Criteria

Volume 2.6 is complete when:

- [x] **[AC-112a]** Event philosophy is documented. `[DAB-EVT04]`
- [x] **[AC-112b]** Categories and metadata are defined. `[DAB-EVT06–EVT07]`
- [x] **[AC-112c]** Streams, replay, versioning, and correlation are established. `[DAB-EVT11–EVT14]`
- [x] **[AC-112d]** Timeline, graph, search, and AI integrations are incorporated. `[DAB-EVT17–EVT20]`
- [x] **[AC-112e]** Community Event Ledger specified. `[DAB-EVT21]`
- [x] **[AC-112f]** Burt has a complete blueprint for historical event architecture. `[DAB-EVT22]`

---

**Next step:** [2.7 — Time & Calendar Data Model](TIME_CALENDAR_DATA_MODEL.md) [DAB-008]

**End of Volume 2.6.**
