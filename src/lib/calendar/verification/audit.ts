import type { CalendarVerificationAuditEvent } from "./types";
import { appendVerificationAudit } from "./store";

export function recordVerificationAudit(
  input: Omit<CalendarVerificationAuditEvent, "auditEventId" | "mode" | "persistenceMode" | "createdAt">,
): CalendarVerificationAuditEvent {
  return appendVerificationAudit({
    ...input,
    auditEventId: `vfa-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    mode: "audit_only",
    persistenceMode: "session_soft_beta",
    createdAt: new Date().toISOString(),
  });
}
