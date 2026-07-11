import { appendAudit } from "./data";
import type { OrganizationalAuditEvent } from "./types";

export function recordOrgAudit(input: Omit<OrganizationalAuditEvent, "id" | "timestamp">) {
  const event: OrganizationalAuditEvent = {
    ...input,
    id: `org-aud-${Date.now().toString(36)}`,
    timestamp: new Date().toISOString(),
  };
  appendAudit(event);
  return event;
}
