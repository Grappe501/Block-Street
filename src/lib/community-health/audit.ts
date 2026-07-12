import { loadAuditEvents, persistAuditEvents } from "./data";
import type { CommunityHealthAuditEvent } from "./types";

function now() {
  return new Date().toISOString();
}

export function recordCommunityHealthAudit(
  event: Omit<CommunityHealthAuditEvent, "id" | "timestamp"> & { timestamp?: string }
) {
  const events = loadAuditEvents();
  events.push({
    id: `chd-audit-${Date.now().toString(36)}`,
    timestamp: event.timestamp ?? now(),
    ...event,
  });
  persistAuditEvents(events);
}

export function listCommunityHealthAudit(countyId?: string, limit = 50) {
  const events = loadAuditEvents();
  const filtered = countyId ? events.filter((e) => e.county_id === countyId) : events;
  return filtered.slice(-limit).reverse();
}
