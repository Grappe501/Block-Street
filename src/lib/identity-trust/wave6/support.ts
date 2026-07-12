import { itlId, nowIso } from "../utils";
import { loadSupportRequests, persistSupportRequests } from "./data";
import { createWorkItem } from "./queue";
import { assertOperationalAuthority, canPerformAction } from "./authority";
import { recordOperationsAudit } from "./audit";
import type { IdentitySupportRequest } from "./types";

const SUPPORT_ESCALATION: Record<string, { work_type: import("./types").WorkItemType; authority: import("./types").OperationalRole }> = {
  account_compromise: { work_type: "account_recovery", authority: "security_identity_operator" },
  possible_duplicate_account: { work_type: "duplicate_candidate", authority: "platform_identity_reviewer" },
  identity_restricted: { work_type: "identity_case", authority: "identity_reviewer" },
};

export function createSupportRequest(input: {
  human_id?: string;
  institution_id?: string;
  category: string;
  description: string;
  related_invitation_id?: string;
  related_case_id?: string;
  severity?: IdentitySupportRequest["severity"];
}): IdentitySupportRequest {
  const request: IdentitySupportRequest = {
    id: itlId("isr"),
    human_id: input.human_id ?? null,
    institution_id: input.institution_id ?? null,
    category: input.category,
    description: input.description,
    related_invitation_id: input.related_invitation_id ?? null,
    related_case_id: input.related_case_id ?? null,
    severity: input.severity ?? "normal",
    status: "new",
    assigned_to: null,
    created_at: nowIso(),
    resolved_at: null,
  };
  const all = loadSupportRequests();
  all.push(request);
  persistSupportRequests(all);

  const escalation = SUPPORT_ESCALATION[input.category];
  if (escalation) {
    createWorkItem({
      work_type: escalation.work_type,
      source_type: "support_request",
      source_id: request.id,
      subject_human_id: input.human_id,
      institution_id: input.institution_id,
      summary: `Support escalation: ${input.category}`,
      severity: input.severity ?? "high",
      required_authority: escalation.authority,
      priority: input.severity === "urgent" ? 5 : 4,
    });
  }

  recordOperationsAudit({
    event_type: "support_request_created",
    actor_human_id: input.human_id ?? "anonymous",
    subject_human_id: input.human_id ?? null,
    institution_id: input.institution_id ?? null,
    resource_type: "support_request",
    resource_id: request.id,
    summary: input.category,
    correlation_id: request.id,
  });

  return request;
}

export function listSupportRequests(filters?: { human_id?: string; status?: string }) {
  let reqs = loadSupportRequests();
  if (filters?.human_id) reqs = reqs.filter((r) => r.human_id === filters.human_id);
  if (filters?.status) reqs = reqs.filter((r) => r.status === filters.status);
  return reqs.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function assignSupportRequest(requestId: string, operatorId: string): IdentitySupportRequest {
  assertOperationalAuthority(operatorId, "route_case", "Assign support request");
  const reqs = loadSupportRequests();
  const idx = reqs.findIndex((r) => r.id === requestId);
  if (idx < 0) throw new Error("Support request not found");
  reqs[idx] = { ...reqs[idx], status: "assigned", assigned_to: operatorId };
  persistSupportRequests(reqs);
  return reqs[idx];
}

export function resolveSupportRequest(requestId: string, operatorId: string): IdentitySupportRequest {
  if (!canPerformAction(operatorId, "route_case") && !canPerformAction(operatorId, "explain_policy")) {
    throw new Error("Operator cannot resolve support requests");
  }
  const reqs = loadSupportRequests();
  const idx = reqs.findIndex((r) => r.id === requestId);
  if (idx < 0) throw new Error("Support request not found");
  reqs[idx] = { ...reqs[idx], status: "resolved", resolved_at: nowIso() };
  persistSupportRequests(reqs);
  return reqs[idx];
}

export function escalateSupportRequest(requestId: string, operatorId: string): IdentitySupportRequest {
  assertOperationalAuthority(operatorId, "escalate_security", "Escalate support request");
  const reqs = loadSupportRequests();
  const idx = reqs.findIndex((r) => r.id === requestId);
  if (idx < 0) throw new Error("Support request not found");
  reqs[idx] = { ...reqs[idx], status: "escalated" };
  persistSupportRequests(reqs);
  createWorkItem({
    work_type: "account_recovery",
    source_type: "support_request",
    source_id: requestId,
    subject_human_id: reqs[idx].human_id ?? undefined,
    summary: `Escalated support: ${reqs[idx].category}`,
    severity: "urgent",
    required_authority: "security_identity_operator",
    priority: 5,
    due_hours: 1,
  });
  return reqs[idx];
}

export const SUPPORT_OPERATOR_PROHIBITED = [
  "Cannot verify a Human",
  "Cannot merge identities",
  "Cannot deny appeals",
  "Cannot change trust state",
];
