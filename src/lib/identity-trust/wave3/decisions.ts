import { appendLedgerEvent } from "../wave2/ledger";
import { recoverIdentity, restrictIdentity } from "../wave2/trust-lifecycle";
import {
  loadIdentityCaseDecisions,
  loadIdentityCases,
  loadIdentityReviewNotices,
  loadIdentityCaseResponses,
  loadWave3Flags,
  loadWave3Policy,
  persistIdentityCaseDecisions,
  persistIdentityCases,
  persistIdentityReviewNotices,
  persistIdentityCaseResponses,
} from "./data";
import { assertWave3Enabled, getIdentityCase } from "./cases";
import { checkReviewerConflict, isQualifiedReviewer } from "./reviewers";
import type { IdentityCaseDecision, IdentityCaseResponse, IdentityReviewNotice } from "./types";
import { itlId, nowIso } from "../utils";
import { liftContainment, getActiveContainment } from "./containment";

export function sendCaseNotice(input: {
  case_id: string;
  subject_human_id: string;
  summary: string;
  restrictions?: string;
  response_deadline_days?: number;
}): IdentityReviewNotice {
  assertWave3Enabled();
  const c = getIdentityCase(input.case_id);
  if (!c) throw new Error("Case not found.");

  const policy = loadWave3Policy();
  const days = input.response_deadline_days ?? policy.default_response_days_serious;
  const deadline = new Date(Date.now() + days * 86400000).toISOString();

  const notice: IdentityReviewNotice = {
    id: itlId("inotice"),
    case_id: input.case_id,
    subject_human_id: input.subject_human_id,
    notice_type: "identity_review",
    summary: input.summary,
    restrictions: input.restrictions ?? null,
    response_deadline: deadline,
    delivered_at: nowIso(),
    delivery_method: "platform",
    viewed_at: null,
    status: "delivered",
  };

  const notices = loadIdentityReviewNotices();
  notices.push(notice);
  persistIdentityReviewNotices(notices);

  const cases = loadIdentityCases();
  const idx = cases.findIndex((x) => x.id === input.case_id);
  if (idx >= 0) {
    cases[idx] = { ...cases[idx], status: "response_period", response_due_at: deadline };
    persistIdentityCases(cases);
  }

  appendLedgerEvent({
    human_id: input.subject_human_id,
    institution_id: c.institution_id,
    event_type: "identity.notice_sent",
    occurred_at: nowIso(),
    actor_type: "system",
    actor_human_id: null,
    service_identity_id: null,
    source_system: "ITL-REV-001",
    source_record_type: "notice",
    source_record_id: notice.id,
    previous_state: c.status,
    new_state: "response_period",
    reason_code: "notice_delivered",
    evidence_digest: null,
    correlation_id: c.correlation_id,
  });

  return notice;
}

export function submitCaseResponse(input: {
  case_id: string;
  submitted_by_human_id: string;
  response_type: string;
  statement: string;
  evidence_references?: string[];
}): IdentityCaseResponse {
  assertWave3Enabled();
  const c = getIdentityCase(input.case_id);
  if (!c) throw new Error("Case not found.");
  if (c.subject_human_id !== input.submitted_by_human_id) {
    throw new Error("Only the subject may submit a case response.");
  }

  const response: IdentityCaseResponse = {
    id: itlId("iresp"),
    case_id: input.case_id,
    submitted_by_human_id: input.submitted_by_human_id,
    response_type: input.response_type,
    statement: input.statement,
    evidence_references: input.evidence_references ?? [],
    submitted_at: nowIso(),
    status: "submitted",
  };

  const responses = loadIdentityCaseResponses();
  responses.push(response);
  persistIdentityCaseResponses(responses);

  appendLedgerEvent({
    human_id: c.subject_human_id,
    institution_id: c.institution_id,
    event_type: "identity.response_submitted",
    occurred_at: nowIso(),
    actor_type: "human",
    actor_human_id: input.submitted_by_human_id,
    service_identity_id: null,
    source_system: "ITL-REV-001",
    source_record_type: "response",
    source_record_id: response.id,
    previous_state: "response_period",
    new_state: "evidence_review",
    reason_code: input.response_type,
    evidence_digest: null,
    correlation_id: c.correlation_id,
  });

  return response;
}

export function enterCaseDecision(input: {
  case_id: string;
  decided_by: string;
  decision_type: string;
  findings: string;
  governing_rules: string[];
  evidence_summary: string;
  evidence_limitations: string;
  decision: string;
  conditions?: string;
  panel_members?: string[];
  intentional_fraud?: boolean;
  ai_recommendation_only?: boolean;
}): IdentityCaseDecision {
  assertWave3Enabled();
  const flags = loadWave3Flags();
  if (flags.AI_IDENTITY_DECISION_PROHIBITED && input.ai_recommendation_only) {
    throw new Error("AI may not make identity decisions.");
  }
  if (!isQualifiedReviewer(input.decided_by)) {
    throw new Error("Decision maker must be a qualified identity reviewer.");
  }

  const conflict = checkReviewerConflict(input.case_id, input.decided_by);
  if (conflict.conflict) throw new Error(conflict.reason ?? "Reviewer conflict.");

  const c = getIdentityCase(input.case_id);
  if (!c) throw new Error("Case not found.");

  const policy = loadWave3Policy();
  const appealDeadline = new Date(
    Date.now() + policy.default_appeal_deadline_days * 86400000
  ).toISOString();

  const decision: IdentityCaseDecision = {
    id: itlId("idec"),
    case_id: input.case_id,
    decision_type: input.decision_type,
    findings: input.findings,
    governing_rules: input.governing_rules,
    evidence_summary: input.evidence_summary,
    evidence_limitations: input.evidence_limitations,
    decision: input.decision,
    conditions: input.conditions ?? null,
    effective_at: nowIso(),
    decided_by: input.decided_by,
    panel_members: input.panel_members ?? [input.decided_by],
    appeal_deadline: appealDeadline,
    status: "active",
    ai_informed_only: Boolean(input.ai_recommendation_only),
  };

  const decisions = loadIdentityCaseDecisions();
  decisions.push(decision);
  persistIdentityCaseDecisions(decisions);

  const cases = loadIdentityCases();
  const idx = cases.findIndex((x) => x.id === input.case_id);
  if (idx >= 0) {
    cases[idx] = {
      ...cases[idx],
      status: "decided",
      decided_at: nowIso(),
      appeal_deadline: appealDeadline,
    };
    persistIdentityCases(cases);
  }

  if (input.decision.includes("restrict") || input.decision.includes("membership_ended")) {
    restrictIdentity(c.subject_human_id, c.institution_id ?? "inst-block-street", input.findings, input.decided_by);
  }
  if (input.decision.includes("restored") || input.decision.includes("confirmed")) {
    recoverIdentity(c.subject_human_id, c.institution_id ?? "inst-block-street", input.findings, input.decided_by);
    for (const containment of getActiveContainment(c.subject_human_id)) {
      liftContainment(containment.id, input.decided_by);
    }
  }

  appendLedgerEvent({
    human_id: c.subject_human_id,
    institution_id: c.institution_id,
    event_type: "identity.decision_entered",
    occurred_at: nowIso(),
    actor_type: "human",
    actor_human_id: input.decided_by,
    service_identity_id: null,
    source_system: "ITL-GOV-001",
    source_record_type: "decision",
    source_record_id: decision.id,
    previous_state: c.status,
    new_state: input.decision,
    reason_code: input.decision_type,
    evidence_digest: null,
    correlation_id: c.correlation_id,
  });

  return decision;
}

export function getCaseDecision(caseId: string) {
  return loadIdentityCaseDecisions().find((d) => d.case_id === caseId && d.status === "active") ?? null;
}

export function getSubjectCaseView(humanId: string) {
  const cases = loadIdentityCases().filter((c) => c.subject_human_id === humanId);
  return cases.map((c) => ({
    case_id: c.id,
    public_case_id: c.public_case_id,
    case_type: c.case_type,
    status: c.status,
    summary: c.summary,
    response_due_at: c.response_due_at,
    appeal_deadline: c.appeal_deadline,
    restrictions: getActiveContainment(humanId).map((a) => a.action_type),
    decision: getCaseDecision(c.id)?.decision ?? null,
  }));
}
