import type { CalendarTaskAuditEvent } from "./types";
import { appendTaskAudit } from "./store";

export function recordTaskAudit(
  input: Omit<CalendarTaskAuditEvent, "auditEventId" | "mode" | "persistenceMode" | "createdAt">,
): CalendarTaskAuditEvent {
  return appendTaskAudit({
    ...input,
    auditEventId: `tad-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    mode: "audit_only",
    persistenceMode: "session_soft_beta",
    createdAt: new Date().toISOString(),
  });
}
