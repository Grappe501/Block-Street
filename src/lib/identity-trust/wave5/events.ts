import { itlId, nowIso } from "../utils";
import { loadIntelligenceEvents, persistIntelligenceEvents } from "./data";
import type { IdentityIntelligenceEvent } from "./types";

export function ingestIntelligenceEvent(input: {
  event_type: string;
  human_id?: string;
  related_human_ids?: string[];
  institution_id?: string;
  source_system: string;
  source_event_id?: string;
  event_features?: Record<string, unknown>;
  privacy_classification?: IdentityIntelligenceEvent["privacy_classification"];
}): IdentityIntelligenceEvent {
  const event: IdentityIntelligenceEvent = {
    id: itlId("iie"),
    event_type: input.event_type,
    occurred_at: nowIso(),
    human_id: input.human_id ?? null,
    related_human_ids: input.related_human_ids ?? [],
    institution_id: input.institution_id ?? null,
    source_system: input.source_system,
    source_event_id: input.source_event_id ?? null,
    event_features: input.event_features ?? {},
    privacy_classification: input.privacy_classification ?? "standard",
    ingested_at: nowIso(),
  };
  const all = loadIntelligenceEvents();
  all.push(event);
  persistIntelligenceEvents(all);
  return event;
}

export function listIntelligenceEvents(filters?: { human_id?: string; event_type?: string }) {
  let events = loadIntelligenceEvents();
  if (filters?.human_id) events = events.filter((e) => e.human_id === filters.human_id);
  if (filters?.event_type) events = events.filter((e) => e.event_type === filters.event_type);
  return events;
}
