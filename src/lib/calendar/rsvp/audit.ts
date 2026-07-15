import type { CalendarRsvpAuditEvent } from "./types";
import { appendRsvpAudit } from "./store";

export function recordRsvpAudit(
  input: Omit<CalendarRsvpAuditEvent, "auditEventId" | "mode" | "persistenceMode" | "createdAt">,
): CalendarRsvpAuditEvent {
  return appendRsvpAudit({
    ...input,
    auditEventId: `rsva-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    mode: "audit_only",
    persistenceMode: "session_soft_beta",
    createdAt: new Date().toISOString(),
  });
}
