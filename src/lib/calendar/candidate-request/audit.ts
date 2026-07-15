import type { CalendarCandidateAuditEvent } from "./types";
import { appendCandidateAudit } from "./store";

export function recordCandidateAudit(
  input: Omit<CalendarCandidateAuditEvent, "auditEventId" | "mode" | "persistenceMode" | "createdAt">,
): CalendarCandidateAuditEvent {
  return appendCandidateAudit({
    ...input,
    auditEventId: `cra-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    mode: "audit_only",
    persistenceMode: "session_soft_beta",
    createdAt: new Date().toISOString(),
  });
}
