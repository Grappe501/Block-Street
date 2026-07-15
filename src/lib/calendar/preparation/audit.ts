import type { CalendarPreparationAuditEvent } from "./types";
import { appendPreparationAudit } from "./store";

export function recordPreparationAudit(
  input: Omit<CalendarPreparationAuditEvent, "auditEventId" | "mode" | "persistenceMode" | "createdAt">,
): CalendarPreparationAuditEvent {
  return appendPreparationAudit({
    ...input,
    auditEventId: `pad-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    mode: "audit_only",
    persistenceMode: "session_soft_beta",
    createdAt: new Date().toISOString(),
  });
}
