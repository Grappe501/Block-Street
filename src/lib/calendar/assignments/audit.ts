import type { CalendarAssignmentAuditEvent } from "./types";
import { appendAuditEvent } from "./store";

export function recordAudit(input: Omit<CalendarAssignmentAuditEvent, "auditEventId" | "mode" | "persistenceMode" | "createdAt">): CalendarAssignmentAuditEvent {
  return appendAuditEvent({
    ...input,
    auditEventId: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    mode: "audit_only",
    persistenceMode: "session_soft_beta",
    createdAt: new Date().toISOString(),
  });
}
