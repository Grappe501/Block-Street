# Communication Integration Guide

## Upstream Dependencies

- **Build 11.1** — Initiative context for all communication entities
- **Build 11.3** — Mission Operations receives action items via mission-sync queue

## Downstream Consumers

### Search (`search-projection.ts`)
Index only institution-visible fields. Query via `GET /api/v1/communications/search`.

### Notifications (`notification-adapter.ts`)
Map events to template keys with priority and mandatory flags.

### Calendar (`calendar-adapter.ts`)
Schedule-only; `lifecycle_mutation_allowed` is always false.

### Webhooks (`webhook-delivery.ts`)
Create subscriptions via `POST /api/v1/communications/webhooks`.

### Knowledge Graph (`knowledge-graph-projection.ts`)
Project conversation → initiative/mission/decision relationships.

## Dispatch Hub

`dispatch.ts` routes outbox records to subscribers by consumer name or `all`.
