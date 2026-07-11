import { appendAudit } from "./data";
import type { MigrationAuditEvent } from "./types";

export function recordMigrationAudit(input: Omit<MigrationAuditEvent, "id" | "timestamp">) {
  const event: MigrationAuditEvent = {
    ...input,
    id: `mig-aud-${Date.now().toString(36)}`,
    timestamp: new Date().toISOString(),
  };
  appendAudit(event);
  return event;
}
