# Objective Event Standard

**Registry:** `data/phase-11/objective_event_catalog.json`

## Envelope Fields

Every domain event includes: event_id, event_type, event_version, occurred_at, entity_id, entity_type, initiative_id, institution_id, actor, source_command_id, request_id, correlation_id, entity_version, payload.

## Delivery

1. W3 publishes to transactional outbox on mutation.
2. `outbox-publisher` dispatches to integration consumers.
3. Consumers record idempotency receipts before side effects.

## Replay

`event-replay.ts` reprocesses committed facts only — domain commands are never re-executed.

See also: `OBJECTIVE_EVENT_CATALOG.md`
