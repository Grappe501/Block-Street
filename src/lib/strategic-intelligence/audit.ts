import { loadAuditEvents, persistAuditEvents } from "./data";
import type { StrategicAuditEvent } from "./types";

function now() {
  return new Date().toISOString();
}

export function recordStrategicAudit(
  event: Omit<StrategicAuditEvent, "id" | "timestamp"> & { timestamp?: string }
) {
  const events = loadAuditEvents();
  events.push({
    id: `int-audit-${Date.now().toString(36)}`,
    timestamp: event.timestamp ?? now(),
    ...event,
  });
  persistAuditEvents(events);
}

export function listStrategicAudit(institutionId?: string, limit = 50) {
  const events = loadAuditEvents();
  const filtered = institutionId ? events.filter((e) => e.institution_id === institutionId) : events;
  return filtered.slice(-limit).reverse();
}
