# Initiative Event Catalog

**Registry:** `data/phase-11/initiative_event_catalog.json`  
**Loader:** `src/lib/civic-action/builds/11.1/events/catalog.ts`

## Naming

```text
initiative.<past_tense_action>
```

Examples: `initiative.draft_created`, `initiative.submitted_for_review`, `initiative.activated`

## Envelope

```text
event_id, event_type, event_version, occurred_at
initiative_id, institution_id
actor_human_id_optional, service_identity_id_optional
source_command_id, request_id, correlation_id
initiative_version, payload
```

## Versioning

Prefer `event_type` + `event_version` fields. Breaking payload changes require a new event version.

## Delivery

- Transactional outbox in W3 `publishDomainEvent`
- Publisher: `events/outbox-publisher.ts` (at-least-once)
- Consumer receipts: `events/consumer-receipts.ts`
- Replay: `events/event-replay.ts` (facts only — never re-executes commands)

## Privacy

Payloads exclude private charter text, protected identity, and review evidence by default.
