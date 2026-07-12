import { loadAuditEvents, persistAuditEvents } from "./data";
import type { IdentityTrustAuditEvent } from "./types";

function now() {
  return new Date().toISOString();
}

export function recordIdentityTrustAudit(
  event: Omit<IdentityTrustAuditEvent, "id" | "timestamp"> & { timestamp?: string }
) {
  const events = loadAuditEvents();
  events.push({
    id: `itl-audit-${Date.now().toString(36)}`,
    timestamp: event.timestamp ?? now(),
    ...event,
  });
  persistAuditEvents(events);
}

export function listIdentityTrustAudit(limit = 50) {
  return loadAuditEvents().slice(-limit).reverse();
}
