import { caeId, nowIso } from "./utils";
import { loadInitiativeAudit, persistInitiativeAudit } from "./data";
import type { InitiativeAuditEvent } from "./types";

export function recordInitiativeAudit(input: {
  initiative_id: string | null;
  institution_id: string;
  actor_human_id: string;
  event_type: string;
  summary: string;
  correlation_id?: string;
}) {
  const event: InitiativeAuditEvent = {
    id: caeId("iae"),
    initiative_id: input.initiative_id,
    institution_id: input.institution_id,
    actor_human_id: input.actor_human_id,
    event_type: input.event_type,
    summary: input.summary,
    correlation_id: input.correlation_id ?? null,
    timestamp: nowIso(),
  };
  const all = loadInitiativeAudit();
  all.push(event);
  persistInitiativeAudit(all);
  return event;
}

export function listInitiativeAudit(initiativeId?: string, limit = 50) {
  let events = loadInitiativeAudit();
  if (initiativeId) events = events.filter((e) => e.initiative_id === initiativeId);
  return events.sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, limit);
}
