/**
 * CAE-11.2-W5 — Event replay (facts only; never re-execute commands)
 */
import { readStoreSlice, EXECUTION_DOMAIN_EVENTS_KEY } from "../services/repository";
import type { ExecutionDomainEvent, ExecutionEventOutboxRecord } from "../services/events";
import { processOutboxForConsumer } from "./outbox-publisher";

export function listObjectiveDomainEvents(initiativeId?: string, limit = 200) {
  const events = readStoreSlice<ExecutionDomainEvent>(EXECUTION_DOMAIN_EVENTS_KEY);
  const filtered = initiativeId ? events.filter((e) => e.initiative_id === initiativeId) : events;
  return filtered.slice(-limit);
}

export function replayObjectiveEvents(input: {
  initiative_id?: string;
  consumer_name: string;
  from_event_id?: string;
  limit?: number;
}) {
  const events = listObjectiveDomainEvents(input.initiative_id, input.limit ?? 100);
  const startIdx = input.from_event_id ? events.findIndex((e) => e.event_id === input.from_event_id) : 0;
  const slice = startIdx >= 0 ? events.slice(startIdx) : events;

  const results: { event_id: string; skipped: boolean }[] = [];
  for (const event of slice) {
    const record: ExecutionEventOutboxRecord = {
      event_id: event.event_id,
      entity_id: event.entity_id,
      entity_type: event.entity_type,
      event_type: event.event_type,
      payload: { ...event.payload, initiative_id: event.initiative_id, institution_id: event.institution_id },
      occurred_at: event.occurred_at,
      published_at: null,
      attempt_count: 0,
      status: "pending",
      notification_requested: true,
    };
    const r = processOutboxForConsumer(input.consumer_name, record);
    results.push({ event_id: event.event_id, skipped: r.skipped });
  }
  return {
    replayed: results.length,
    results,
    note: "Replay reprocesses committed facts; domain commands are not re-executed.",
  };
}
