# Build Volume 1.9 — Event & Timeline Architecture

### Engineering Architecture Bible

**Document ID:** VOLUME-001.9 · **ENG-009**  
**Artifact:** `EVENT_TIMELINE_ARCHITECTURE.md`  
**Status:** Canonical  
**Priority:** Critical

**Companion:** [Living History Engine](LIVING_HISTORY_ENGINE.md) [LHE-001]  
**Builds on:** [1.4 Database Architecture](DATABASE_ARCHITECTURE.md) [ENG-004] · [1.7 Domain Services](DOMAIN_SERVICE_ARCHITECTURE.md) [ENG-007] · [1.8 Knowledge Graph](COMMUNITY_KNOWLEDGE_GRAPH_ARCHITECTURE.md) [ENG-008]  
**Phase alignment:** [Civic Journey Timeline](../phase-03/CIVIC_JOURNEY_TIMELINE.md) [CJT-001] · [Community Legacy](../phase-04/COMMUNITY_LEGACY_SYSTEM.md) [CLS-001]  
**Live spec:** `data/registry/event-timeline-architecture.json`

---

## ENG-ET01 — Purpose

**[ENG-ET01]** The Event & Timeline Architecture defines how the Community Operating System **records, preserves, and understands everything that happens over time**.

**[ENG-ET01a]** Unlike systems that only store current state, the COS understands **how it arrived at the current state**.

**[ENG-ET01b]** **Time is a first-class architectural concept** [ENG-DB20 · CJT-001 · CLS-001].

---

## ENG-ET02 — Guiding Principle

**[ENG-ET02]**

> **Every meaningful action becomes part of the community's memory.**

**[ENG-ET02a]** History should **never be an afterthought** — events are designed in, not bolted on [CLS-001 · LCN-001].

---

## ENG-ET03 — Philosophy

**[ENG-ET03]** Traditional systems answer: *What is true?*

**Our system also answers:**

| Question | Source |
|----------|--------|
| What happened? | Event record |
| When? | `occurred_at` |
| Why? | Context · reason metadata |
| Who participated? | `actor_id` · related entities |
| What changed because of it? | Downstream events · state diff |
| What happened next? | Timeline ordering · graph edges |

**[ENG-ET03a]** Every important action contributes to **institutional memory**.

---

## ENG-ET04 — Event Philosophy

**[ENG-ET04]** An event is:

> **A permanent record that something meaningful occurred.**

**Examples:**

Participant joined · mission created · story published · leadership changed · community launched · lesson captured · volunteer checked in · committee formed

**[ENG-ET04a]** Events become **permanent historical records** — stored in `platform.domain_events` [ENG-DB26].

---

## ENG-ET05 — Timeline Philosophy

**[ENG-ET05]** A timeline is:

> **An ordered view of related events.**

**[ENG-ET05a]** Every major object has its **own timeline** — query, not duplicate storage [ENG-ET06].

---

## ENG-ET06 — Timeline Hierarchy

**[ENG-ET06]** Multiple interconnected timelines:

```text
Platform Timeline
        ↓
State Timeline
        ↓
County Timeline
        ↓
Community Timeline
        ↓
Initiative Timeline
        ↓
Mission Timeline
        ↓
Participant Timeline
```

**[ENG-ET06a]** Each timeline **contributes to the next** — aggregate views roll up scoped events [CJT-001 · ADT-001].

---

## ENG-ET07 — Participant Timeline

**[ENG-ET07]** Tracks [CJT-001 · PEL-001 · JRN-001]:

Registration · communities joined · volunteer experiences · leadership · mentorship · stories · training · recognition · community transitions · legacy

**[ENG-ET07a]** The participant's **journey becomes visible** over time — Civic Passport surface [PHQ-001].

**Query:** `aggregate_type = participant` · `aggregate_id` · related community edges

---

## ENG-ET08 — Community Timeline

**[ENG-ET08]** Tracks [COS-001 · CLS-001]:

Community launch · leadership transitions · major missions · events · growth milestones · partnerships · stories · knowledge additions · traditions · anniversaries

**[ENG-ET08a]** Communities develop **living histories** — Community Legacy parallel [LCN-001].

---

## ENG-ET09 — Mission Timeline

**[ENG-ET09]** Tracks [MDS-001 · ACN-001 · STS-001]:

Mission proposed · approved · planning · volunteer assignments · execution · completion · reflection · lessons learned · playbook updates

**[ENG-ET09a]** Every mission preserves its **full lifecycle**.

---

## ENG-ET10 — Event Timeline (Experience)

**[ENG-ET10]** Tracks [EEOS-001]:

Registration · attendance · agenda · announcements · volunteer check-in · photos · stories · follow-up · community impact

**[ENG-ET10a]** Experiences become **historical records** — not discarded after date passes.

---

## ENG-ET11 — Initiative Timeline

**[ENG-ET11]** Tracks [IOS-001]:

Proposal · approval · launch · milestones · regional expansion · partnerships · community participation · completion · impact

**[ENG-ET11a]** Initiatives become **long-term narratives** spanning communities.

---

## ENG-ET12 — Story Timeline

**[ENG-ET12]** Tracks [CST-001]:

Story creation · publication · updates · related missions · community references · knowledge references · recognition

**[ENG-ET12a]** Stories connect to **broader history** via CKG edges [ENG-KG14].

---

## ENG-ET13 — Knowledge Timeline

**[ENG-ET13]** Tracks [CKLS-001 · LIS-001]:

Lesson created · playbook updated · Community Brain changes · Mission Library additions · knowledge reuse

**[ENG-ET13a]** Knowledge **evolves over time** — each change is an event, not silent overwrite.

---

## ENG-ET14 — Leadership Timeline

**[ENG-ET14]** Tracks [CLD-001 · CGS-001]:

Leadership appointment · training · mentorship · succession · Community Builder progression · leadership anniversaries

**[ENG-ET14a]** Leadership history becomes **institutional memory** [Leadership Service ENG-DS14].

---

## ENG-ET15 — Relationship Timeline

**[ENG-ET15]** Tracks [PRN-001 · REL-M01]:

Invitations · mentorship · community membership · partnerships · committee participation · collaborations

**[ENG-ET15a]** Relationships **evolve** — temporal edges in CKG [ENG-KG09] + membership events.

---

## ENG-ET16 — Event Categories

**[ENG-ET16]** Major categories simplify filtering:

| Category | Examples |
|----------|----------|
| **identity** | registered · profile_updated |
| **community** | launched · membership_changed |
| **mission** | created · completed |
| **volunteer** | checked_in · hours_logged |
| **leadership** | assigned · succession |
| **story** | published · updated |
| **knowledge** | lesson_captured · playbook_updated |
| **growth** | invited · milestone_reached |
| **capacity** | resource_allocated |
| **partnership** | partnership_formed |
| **communication** | announcement_sent |
| **system** | config_changed · migration_applied |

**[ENG-ET16a]** Categories map to DCL `event_types` configuration [DCL-001].

---

## ENG-ET17 — Event Metadata

**[ENG-ET17]** Every event records:

| Field | Column / key |
|-------|--------------|
| Timestamp | `occurred_at` |
| Actor | `actor_id` |
| Affected entity | `aggregate_type` · `aggregate_id` |
| Event type | `event_type` |
| Context | `payload.context` · `community_scope` |
| Visibility | PRE-scoped [ENG-AU14] |
| Source | `payload.source` (api · admin · system · import) |
| Related objects | `payload.related[]` |
| Confidence | `payload.confidence` (intelligence-derived only) |

**[ENG-ET17a]** Metadata **enriches history** without bloating operational tables.

```sql
platform.domain_events (
  id uuid PRIMARY KEY,
  event_type text NOT NULL,
  event_category text NOT NULL,
  aggregate_type text NOT NULL,
  aggregate_id uuid NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}',
  actor_id uuid,
  community_scope uuid,
  visibility text NOT NULL DEFAULT 'community',
  occurred_at timestamptz NOT NULL DEFAULT now(),
  immutable boolean NOT NULL DEFAULT true
);
```

---

## ENG-ET18 — Immutable Events

**[ENG-ET18]** Certain events **never change** after commit:

Community launched · mission completed · participant registered · story published · lesson captured

**[ENG-ET18a]** `immutable = true` — no UPDATE · corrections via new events only [ENG-ET19].

---

## ENG-ET19 — Correcting History

**[ENG-ET19]** If corrections are necessary:

1. **Create correction events** — `event_type: original.corrected`
2. **Do not erase** significant historical records
3. Timeline shows **both** original and correction with link in payload

**[ENG-ET19a]** Audit trail preserves transparency [ENG-DB22 · TPS-M12].

---

## ENG-ET20 — Timeline Views

**[ENG-ET20]** Support multiple views:

Chronological · community history · mission lifecycle · leadership history · volunteer journey · growth timeline · knowledge timeline

**[ENG-ET20a]** Same events · different **filters and groupings** — UI concern, not separate storage.

---

## ENG-ET21 — Cross-Timeline Navigation

**[ENG-ET21]** Users move between related timelines via CKG + event `related[]`:

```text
Story → Mission → Community → Volunteer → Leadership → Legacy
```

**[ENG-ET21a]** History becomes **interconnected** [ENG-KG10 · ENG-ET21].

---

## ENG-ET22 — Search Integration

**[ENG-ET22]** Timelines support search [ENG-010]:

Date filtering · event type · communities · participants · missions · stories · knowledge · relationships

**[ENG-ET22a]** Historical search should feel **natural** — events indexed for discovery.

---

## ENG-ET23 — Event Publishing

**[ENG-ET23]** Every domain service **publishes events** [ENG-DS27 · SRG-001]:

`MissionCreated` · `CommunityJoined` · `LeadershipAssigned` · `StoryPublished` · `VolunteerCheckedIn` · `KnowledgeCaptured`

**[ENG-ET23a]** Events are the **shared language** of the platform — catalog in Service Registry.

**Kernel path:** `src/lib/kernel/events/publisher.ts`

---

## ENG-ET24 — Event Bus Preparation

**[ENG-ET24]** V1: synchronous write to `domain_events` + async handlers in-process.

**Future-ready for:**

Queues · streams · background processing · workflow automation · notifications · analytics pipelines

**[ENG-ET24a]** Event envelope is **transport-agnostic**:

```typescript
interface DomainEvent {
  id: string;
  eventType: string;
  eventCategory: string;
  aggregateType: string;
  aggregateId: string;
  payload: Record<string, unknown>;
  actorId?: string;
  communityScope?: string;
  visibility: string;
  occurredAt: string;
  immutable: boolean;
}
```

**[ENG-ET24b]** Swap in Supabase Realtime · Redis Streams · SQS without changing service publishers.

---

## ENG-ET25 — Living History Engine

**[ENG-ET25]** Timelines deserve narrative assembly — **[Living History Engine](LIVING_HISTORY_ENGINE.md) [LHE-001]**.

**[ENG-ET25a]** Transforms raw events into **readable histories** with drill-down to underlying records [CLS-001 · CJT-001].

---

## ENG-ET26 — Twin & Graph Integration

**[ENG-ET26a]** **Digital Twins** consume event streams for timeline dimension [LDT-001].

**[ENG-ET26b]** **CKG** gains temporal edges from membership and leadership events [ENG-KG09].

**[ENG-ET26c]** **Intelligence** summarizes patterns — never rewrites events [ENG-DS20].

---

## ENG-ET27 — Future AI Assistance

**[ENG-ET27]** AI may:

Summarize timelines · generate historical narratives · identify milestones · recommend anniversaries · detect patterns · create annual community reports

**[ENG-ET27a]** AI **interprets history — never rewrites it** [AIB-001 · ENG-ET18 · TPS-M15].

---

## ENG-ET28 — Burt Implementation Guidance

**[ENG-ET28]** Implementation should:

- Treat events as **immutable** whenever practical [ENG-ET18]
- Build timelines **from published domain events** — not ad-hoc logs
- **Separate operational state** from historical events
- Support **multiple timeline views** [ENG-ET20]
- **Preserve cross-domain relationships** [ENG-ET21]
- Design for **future event-driven** architecture [ENG-ET24]
- Register event types in **DCL** before publish
- Wire **LHE-001** for narrative summaries

---

## Volume Cross-References

| Document | Relationship |
|----------|--------------|
| [ENG-004 Database](DATABASE_ARCHITECTURE.md) | domain_events table |
| [ENG-007 Services](DOMAIN_SERVICE_ARCHITECTURE.md) | Event publishing per service |
| [SRG-001](SERVICE_REGISTRY.md) | eventsPublished catalog |
| [LHE-001](LIVING_HISTORY_ENGINE.md) | Narrative assembly |
| [LDT-001](LIVING_DIGITAL_TWIN_ARCHITECTURE.md) | Twin timeline dimension |
| [CJT-001](../phase-03/CIVIC_JOURNEY_TIMELINE.md) | Participant journey |
| [ENG-005 API](API_ARCHITECTURE.md) | Event webhooks [pending] |

---

## AC-095 — Acceptance Criteria

Volume 1.9 is complete when:

- [x] **[AC-095a]** Event philosophy documented. `[ENG-ET04, ENG-ET17]`
- [x] **[AC-095b]** Timeline hierarchy established. `[ENG-ET06–ENG-ET15]`
- [x] **[AC-095c]** Event categories and metadata defined. `[ENG-ET16, ENG-ET17]`
- [x] **[AC-095d]** Cross-timeline navigation incorporated. `[ENG-ET21, ENG-ET22]`
- [x] **[AC-095e]** Living History Engine specified. `[ENG-ET25, LHE-001]`
- [x] **[AC-095f]** Burt has blueprint for historical memory. `[event-timeline-architecture.json]`

---

**Note:** Step **1.5 API** [ENG-005] remains pending.

**Next recommended step:** [1.5 — API Architecture](API_ARCHITECTURE.md) [ENG-005] · then [1.10 — Search Architecture](SEARCH_ARCHITECTURE.md) [ENG-010]

**End of Volume 1.9 — Event & Timeline Architecture.**
