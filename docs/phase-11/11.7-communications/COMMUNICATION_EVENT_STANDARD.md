# Communication Event Standard

**Subsystem:** COM-EVT-001  
**Catalog:** `data/phase-11/communication_event_catalog.json`

## Event Types (v1)

All W3 producer events are registered with schema version 1:

- communication.conversation_created
- communication.thread_opened
- communication.message_posted
- communication.message_edited
- communication.decision_recorded
- communication.meeting_created
- communication.announcement_published
- communication.document_created
- communication.conversation_archived
- communication.ai_summary_generated
- communication.action_item_created
- communication.thread_resolved

## Delivery

Events are written to domain event log and outbox atomically. `publishPendingCommunicationOutbox` dispatches to integration subscribers with at-least-once semantics.

## Consumer Idempotency

`communication_consumer_receipts` store prevents duplicate processing per consumer/event pair.

## Replay

`replayCommunicationEvents` reprocesses committed facts only — domain commands are never re-executed.
