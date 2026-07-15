import { randomUUID } from "crypto";
import type { AuditOnlyMismatchType, CalendarPolicyDecision, CalendarPolicyRequest, PolicyDecisionRecord } from "./types";

const memoryLog: PolicyDecisionRecord[] = [];

export function recordCalendarPolicyDecision(
  request: CalendarPolicyRequest,
  decision: CalendarPolicyDecision,
  actualBehavior: "allowed" | "denied" | "unknown" = "unknown",
): PolicyDecisionRecord {
  let mismatch_type: AuditOnlyMismatchType | null = null;
  if (actualBehavior === "allowed" && !decision.allowed) {
    mismatch_type = "policy_denied_actual_allowed";
  } else if (actualBehavior === "denied" && decision.allowed) {
    mismatch_type = "policy_allowed_actual_denied";
  }
  if (decision.reasonCode === "candidate_privacy" && actualBehavior === "allowed") {
    mismatch_type = "candidate_privacy_risk";
  }
  if (decision.reasonCode === "self_approval" && actualBehavior === "allowed") {
    mismatch_type = "self_approval_risk";
  }
  if (
    decision.reasonCode === "publication_not_ready" &&
    actualBehavior === "allowed"
  ) {
    mismatch_type = "publication_bypass_risk";
  }

  const record: PolicyDecisionRecord = {
    policy_decision_id: randomUUID(),
    request_id: request.context.requestId,
    actor_user_id: request.actor.userId,
    permission: request.permission,
    resource_event_id: request.resource.eventId,
    decision: decision.allowed ? "allow" : "deny",
    reason_code: decision.reasonCode,
    matched_roles: decision.matchedRoles.map(String),
    matched_scopes: decision.matchedScopes,
    actual_behavior: actualBehavior,
    mismatch_type,
    mode: decision.mode,
    created_at: new Date().toISOString(),
  };
  memoryLog.push(record);
  if (memoryLog.length > 500) memoryLog.shift();
  return record;
}

export function getAuditOnlyDecisions(): PolicyDecisionRecord[] {
  return [...memoryLog];
}

export function clearAuditOnlyDecisions(): void {
  memoryLog.length = 0;
}

export function countCriticalMismatches(): number {
  return memoryLog.filter((r) => r.mismatch_type === "policy_denied_actual_allowed").length;
}

export function denialMessageFor(reasonCode: string): string {
  const messages = {
    generic: "You do not currently have permission to complete this action.",
    scope_mismatch: "This action belongs to a different College Community, county, city, or team.",
    self_approval: "This decision must be completed by an authorized reviewer.",
    candidate_privacy: "Candidate scheduling details are restricted to the scheduling team.",
    publication_not_ready: "This event is not ready or authorized for public publication.",
    self_confirm: "Volunteer assignments must be confirmed by an authorized event or volunteer manager.",
  } as Record<string, string>;
  return messages[reasonCode] ?? messages.generic;
}
