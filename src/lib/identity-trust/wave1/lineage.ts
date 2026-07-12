import { loadWave1Audit, persistWave1Audit } from "./data";
import type { Wave1AuditEvent } from "./types";

function now() {
  return new Date().toISOString();
}

export function recordWave1Audit(
  event: Omit<Wave1AuditEvent, "id" | "timestamp"> & { timestamp?: string }
) {
  const events = loadWave1Audit();
  events.push({
    id: `w1-audit-${Date.now().toString(36)}`,
    timestamp: event.timestamp ?? now(),
    ...event,
  });
  persistWave1Audit(events);
}

export function listWave1Audit(limit = 100) {
  return loadWave1Audit().slice(-limit).reverse();
}
