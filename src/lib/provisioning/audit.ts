import { appendAudit } from "./data";
import type { ProvisioningAuditEvent } from "./types";

function nextId() {
  return `aud-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function recordAudit(input: Omit<ProvisioningAuditEvent, "id" | "timestamp">) {
  const event: ProvisioningAuditEvent = {
    ...input,
    id: nextId(),
    timestamp: new Date().toISOString(),
  };
  appendAudit(event);
  return event;
}
