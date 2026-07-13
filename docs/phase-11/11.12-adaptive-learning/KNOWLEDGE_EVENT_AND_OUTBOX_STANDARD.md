# Knowledge Event and Outbox Standard

**Protocol:** CAE-11.12-W3

## Keys

- `knowledge_domain_events` — `KNOWLEDGE_DOMAIN_EVENTS_KEY`
- `knowledge_event_outbox` — `KNOWLEDGE_OUTBOX_KEY`

## Publisher

`publishKnowledgeEvent()` writes to domain events and outbox with `status: pending`, `notification_requested: true`.

## Event types

Registered in `services/events.ts` (`KNOWLEDGE_DOMAIN_EVENT_TYPES`). Aligns with `data/phase-11/knowledge_event_catalog.json`.

## Doctrine

Domain services never send notifications directly — consumers read the outbox.
