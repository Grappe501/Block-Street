import { loadAuditEvents, persistAuditEvents } from "./data";
import type { CivicAuditEvent } from "./types";

function now() {
  return new Date().toISOString();
}

export function recordCivicAudit(event: Omit<CivicAuditEvent, "id" | "timestamp"> & { timestamp?: string }) {
  const events = loadAuditEvents();
  events.push({
    id: `civ-audit-${Date.now().toString(36)}`,
    timestamp: event.timestamp ?? now(),
    ...event,
  });
  persistAuditEvents(events);
}

export function listCivicAudit(institutionId?: string, limit = 50) {
  const events = loadAuditEvents();
  const filtered = institutionId ? events.filter((e) => e.institution_id === institutionId) : events;
  return filtered.slice(-limit).reverse();
}
