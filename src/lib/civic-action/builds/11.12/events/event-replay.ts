/**
 * CAE-11.12-W5 — Event replay (projections only — never re-execute commands)
 */
import { readStoreSlice, KNOWLEDGE_DOMAIN_EVENTS_KEY } from "../services/repository";
import type { KnowledgeDomainEvent } from "../services/events";
import { dispatchKnowledgeIntegrations } from "../integrations/dispatch";
import type { KnowledgeEventOutboxRecord } from "../services/events";

export function replayKnowledgeEventsForProjection(consumer: string, fromEventId?: string) {
  const events = readStoreSlice<KnowledgeDomainEvent>(KNOWLEDGE_DOMAIN_EVENTS_KEY);
  const startIdx = fromEventId ? events.findIndex((e) => e.event_id === fromEventId) : 0;
  const slice = startIdx >= 0 ? events.slice(startIdx) : events;
  let replayed = 0;

  for (const event of slice) {
    const record: KnowledgeEventOutboxRecord = {
      event_id: event.event_id,
      entity_id: event.entity_id,
      entity_type: event.entity_type,
      event_type: event.event_type,
      payload: event.payload,
      occurred_at: event.occurred_at,
      published_at: event.occurred_at,
      attempt_count: 0,
      status: "published",
      notification_requested: true,
    };
    dispatchKnowledgeIntegrations(record, { consumer, replay: true });
    replayed++;
  }

  return {
    replayed,
    note: "Replay rebuilds derived projections only; domain commands are not re-executed.",
  };
}
