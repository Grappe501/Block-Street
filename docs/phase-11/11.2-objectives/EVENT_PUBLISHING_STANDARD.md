# Event Publishing Standard

**Protocol:** CAE-11.2-W3 · **Implementation:** `services/events.ts`

Every successful mutation emits immutable domain events to `execution_domain_events` and `execution_event_outbox`.

`ExecutionEventPublisher` is the sole emission path. Notification layer consumes outbox — domain services never send messages directly.
