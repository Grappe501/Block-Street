import { loadAuditEvents, persistAuditEvents } from "./data";
import type { PilotAuditEvent } from "./types";

export function recordPilotAudit(
  event: Omit<PilotAuditEvent, "id" | "timestamp">
) {
  const events = loadAuditEvents();
  const record: PilotAuditEvent = {
    ...event,
    id: `plt-audit-${Date.now().toString(36)}`,
    timestamp: new Date().toISOString(),
  };
  events.push(record);
  persistAuditEvents(events);
  return record;
}
