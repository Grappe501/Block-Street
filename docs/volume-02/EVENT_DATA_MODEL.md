# Build Volume 2.6 — Event Data Model

### Data Architecture Bible

**Document ID:** VOLUME-002.6 · **DAB-007**  
**Artifact:** `EVENT_DATA_MODEL.md`  
**Status:** Canonical  
**Priority:** Critical

**Builds on:** [1.9 Event & Timeline](../volume-01/EVENT_TIMELINE_ARCHITECTURE.md) [ENG-009] · [Living History Engine](../volume-01/LIVING_HISTORY_ENGINE.md) [LHE-001]  
**Live spec:** `data/registry/event-data-model.json`

---

## DAB-EVT01 — Purpose

**[DAB-EVT01]** The Event Data Model defines **immutable domain events**, timeline records, categories, versioning, replay, and retention — the memory bus of the COS.

---

## DAB-EVT02 — Event Schema

**[DAB-EVT02a]** Table: `events.domain_events`:

```text
domain_events (
  id              uuid PK
  event_type      text NOT NULL       -- namespaced: community.member.joined
  aggregate_type  text NOT NULL       -- Community, Mission, ...
  aggregate_id    uuid NOT NULL
  payload         jsonb NOT NULL      -- event-specific data
  metadata        jsonb               -- correlation, causation, user_agent
  actor_id        uuid
  community_scope uuid
  version         int NOT NULL        -- aggregate version at emit
  occurred_at     timestamptz NOT NULL
  recorded_at     timestamptz DEFAULT now()
  schema_version  text                -- payload schema semver
)
```

**[DAB-EVT02b]** Events are **append-only** — no UPDATE or DELETE (GDPR erasure uses redaction flag in metadata [DAB-SPM]).

---

## DAB-EVT03 — Event Categories

| Category | Prefix examples | Consumers |
|----------|-----------------|-----------|
| **Identity** | `participant.registered`, `profile.updated` | audit, search |
| **Community** | `community.created`, `member.joined`, `member.removed` | graph, comms |
| **Action** | `mission.created`, `task.completed`, `event.scheduled` | timeline, analytics |
| **Growth** | `invitation.sent`, `invitation.accepted` | growth graph, PON |
| **Knowledge** | `story.published`, `lesson.validated` | CKG, search |
| **Comms** | `notification.sent`, `digest.generated` | AME-001 |
| **System** | `migration.applied`, `index.rebuilt` | ops, CRCC |

---

## DAB-EVT04 — Timeline Records

**[DAB-EVT04a]** Table: `events.timeline_entries` — **curated narrative layer** atop raw events [LHE-001]:

```text
timeline_entries (
  id, timeline_type,     -- personal | community | mission | network
  scope_id, title, summary, entry_type,
  source_event_ids[],    -- evidence links
  occurred_at, visibility, created_by, community_scope
)
```

**[DAB-EVT04b]** Timelines are **editable presentations**; underlying events remain immutable.

---

## DAB-EVT05 — Event Versioning

**[DAB-EVT05a]** `schema_version` on each event — payload validators per version.

**[DAB-EVT05b]** Breaking payload changes: new schema version; consumers handle both during transition.

**[DAB-EVT05c]** Aggregate `version` enables optimistic concurrency on entity state.

---

## DAB-EVT06 — Event Replay

**[DAB-EVT06a]** Replay rebuilds projections: graph, search index, analytics rollups.

**[DAB-EVT06b]** Replay order: `occurred_at`, then `recorded_at`, then `id`.

**[DAB-EVT06c]** Idempotent consumers required — use event `id` deduplication.

---

## DAB-EVT07 — Event Retention

**[DAB-EVT07a]** **Domain events:** retain 7 years default; configurable per category [DAB-SPM].

**[DAB-EVT07b]** **System events:** 90 days unless audit-critical.

**[DAB-EVT07c]** **Archive:** move to cold storage table `events.domain_events_archive` — same schema.

---

## DAB-EVT08 — Integration

**[DAB-EVT08a]** Services emit via Platform Kernel event bus [ENG-ET20].

**[DAB-EVT08b]** Outbox pattern for reliable delivery to comms/search/graph workers [ENG-CM].

---

## AC-112 — Acceptance Criteria

- [x] **[AC-112a]** Domain event schema and categories documented. `[DAB-EVT02, EVT03]`
- [x] **[AC-112b]** Timeline records and event versioning defined. `[DAB-EVT04, EVT05]`
- [x] **[AC-112c]** Replay and retention policies established. `[DAB-EVT06, EVT07]`

---

**Next step:** [2.7 — Time & Calendar Data Model](TIME_CALENDAR_DATA_MODEL.md) [DAB-008]

**End of Volume 2.6.**
