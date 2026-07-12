import { loadAuditEvents, persistAuditEvents } from "./data";
import type { FederationAuditEvent } from "./types";

function now() {
  return new Date().toISOString();
}

function id() {
  return `fed-audit-${Date.now().toString(36)}`;
}

export function recordFederationAudit(
  event: Omit<FederationAuditEvent, "id" | "timestamp"> & { timestamp?: string }
) {
  const events = loadAuditEvents();
  events.push({
    id: id(),
    timestamp: event.timestamp ?? now(),
    institution_id: event.institution_id,
    actor_id: event.actor_id,
    action: event.action,
    target_type: event.target_type,
    target_id: event.target_id,
    result: event.result,
    metadata: event.metadata,
  });
  persistAuditEvents(events);
}

export function listFederationAudit(institutionId?: string, limit = 50) {
  const events = loadAuditEvents();
  const filtered = institutionId ? events.filter((e) => e.institution_id === institutionId) : events;
  return filtered.slice(-limit).reverse();
}
