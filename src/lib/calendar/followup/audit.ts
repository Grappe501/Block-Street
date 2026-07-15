import type { CalendarFollowUpAuditEvent } from "./types";
import { appendFollowUpAudit } from "./store";

export function recordFollowUpAudit(
  input: Omit<CalendarFollowUpAuditEvent, "auditEventId" | "mode" | "persistenceMode" | "createdAt">,
): CalendarFollowUpAuditEvent {
  return appendFollowUpAudit({
    ...input,
    auditEventId: `fad-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    mode: "audit_only",
    persistenceMode: "session_soft_beta",
    createdAt: new Date().toISOString(),
  });
}
