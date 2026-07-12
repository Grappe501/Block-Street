/**
 * CAE-11.1-W5 — Event replay (facts only; never re-execute commands)
 */
import { readStoreSlice } from "../services/repository";
import type { InitiativeDomainEvent } from "../services/events";
import { processOutboxForConsumer } from "./outbox-publisher";
import type { InitiativeEventOutboxRecord } from "../services/events";

export function listInitiativeDomainEvents(initiativeId?: string, limit = 200) {
  const events = readStoreSlice<InitiativeDomainEvent>("initiative_domain_events");
  const filtered = initiativeId ? events.filter((e) => e.initiative_id === initiativeId) : events;
  return filtered.slice(-limit);
}

export function replayInitiativeEvents(input: {
  initiative_id?: string;
  consumer_name: string;
  from_event_id?: string;
  limit?: number;
}) {
  const events = listInitiativeDomainEvents(input.initiative_id, input.limit ?? 100);
  const startIdx = input.from_event_id ? events.findIndex((e) => e.event_id === input.from_event_id) : 0;
  const slice = startIdx >= 0 ? events.slice(startIdx) : events;

  const results: { event_id: string; skipped: boolean }[] = [];
  for (const event of slice) {
    const record: InitiativeEventOutboxRecord = {
      event_id: event.event_id,
      initiative_id: event.initiative_id,
      event_type: event.event_type,
      payload: event.payload,
      occurred_at: event.occurred_at,
      published_at: null,
      attempt_count: 0,
      status: "pending",
    };
    const r = processOutboxForConsumer(input.consumer_name, record);
    results.push({ event_id: event.event_id, skipped: r.skipped });
  }
  return { replayed: results.length, results, note: "Replay reprocesses committed facts; domain commands are not re-executed." };
}
