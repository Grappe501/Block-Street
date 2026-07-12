import { loadAuditEvents, persistAuditEvents } from "./data";
import type { OperationsAuditEvent } from "./types";

export function recordOperationsAudit(event: Omit<OperationsAuditEvent, "id" | "timestamp">) {
  const events = loadAuditEvents();
  const record: OperationsAuditEvent = {
    ...event,
    id: `ops-audit-${Date.now().toString(36)}`,
    timestamp: new Date().toISOString(),
  };
  events.push(record);
  persistAuditEvents(events);
  return record;
}
