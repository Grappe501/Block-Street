# Initiative Domain Events

**Build:** 11.1 · **Wave:** W3

Events defined in `services/events.ts`. Published via `publishDomainEvent()` after successful mutations.

## Event Types (MVP)

`initiative.draft_created`, `initiative.submitted_for_review`, `initiative.approved`, `initiative.activated`, `initiative.paused`, `initiative.completed`, `initiative.cancelled`, `initiative.archived`, and related lifecycle events.

## Envelope

`event_id`, `event_type`, `occurred_at`, `initiative_id`, `institution_id`, actor, `source_command_id`, `request_id`, `correlation_id`, `initiative_version`, `payload`.

## Outbox

`InitiativeEventOutbox` records durable events for async projection. Notification failure does not roll back domain transaction.

## Audit Separation

Domain events describe what changed; security audit records who attempted the action (shared audit layer, W5).
