import { appendLedgerEvent } from "../wave2/ledger";
import { isWave2FoundationComplete } from "../wave2/engine";
import {
  loadIdentityCases,
  loadWave3Flags,
  loadWave3Policy,
  persistIdentityCases,
} from "./data";
import type { IdentityCase, IdentityCaseScope, IdentityCaseSeverity, IdentityCaseType } from "./types";
import { itlId, nowIso } from "../utils";

export function assertWave3Enabled() {
  if (!isWave2FoundationComplete()) {
    throw new Error("Wave 2 foundation must be certified before identity governance (Wave 3).");
  }
  const flags = loadWave3Flags();
  if (!flags.IDENTITY_GOVERNANCE_ENABLED || !flags.IDENTITY_CASE_MANAGEMENT_ENABLED) {
    throw new Error("Identity governance is not enabled.");
  }
  return flags;
}

function severityForType(caseType: IdentityCaseType): IdentityCaseSeverity {
  const map: Partial<Record<IdentityCaseType, IdentityCaseSeverity>> = {
    duplicate_human: "IG-3",
    impersonation: "IG-4",
    verification_conflict: "IG-3",
    provisional_expiration: "IG-2",
    alias_dispute: "IG-2",
    false_public_identity: "IG-3",
    authentication_conflict: "IG-3",
    compromised_account: "IG-4",
  };
  return map[caseType] ?? "IG-2";
}

function boardForScope(scope: IdentityCaseScope, institutionId: string | null): string {
  const policy = loadWave3Policy();
  if (scope === "global_human_record" || scope === "global_identity_assurance") {
    return policy.boards.find((b) => b.board_type === "platform")?.id ?? "board-platform";
  }
  return policy.boards.find((b) => b.institution_id === institutionId)?.id ?? "board-inst-block-street";
}

export function openIdentityCase(input: {
  case_type: IdentityCaseType;
  subject_human_id: string;
  institution_id?: string | null;
  reporting_human_id?: string | null;
  originating_event_id?: string | null;
  scope?: IdentityCaseScope;
  summary: string;
  severity?: IdentityCaseSeverity;
}): IdentityCase {
  assertWave3Enabled();

  const scope = input.scope ?? "institution_membership";
  const institutionId = input.institution_id ?? "inst-block-street";
  const severity = input.severity ?? severityForType(input.case_type);
  const policy = loadWave3Policy();
  const responseDays =
    severity === "IG-1" || severity === "IG-2"
      ? policy.default_response_days_routine
      : policy.default_response_days_serious;

  const correlationId = itlId("corr");
  const openedAt = nowIso();
  const responseDue = new Date(Date.now() + responseDays * 86400000).toISOString();

  const caseRecord: IdentityCase = {
    id: itlId("icase"),
    public_case_id: `case_${Date.now().toString(36)}`,
    case_type: input.case_type,
    subject_human_id: input.subject_human_id,
    institution_id: institutionId,
    reporting_human_id: input.reporting_human_id ?? null,
    originating_event_id: input.originating_event_id ?? null,
    severity,
    scope,
    status: severity === "IG-4" ? "notice_pending" : "awaiting_assignment",
    confidentiality_level: severity === "IG-4" ? "critical" : "standard",
    assigned_board_id: boardForScope(scope, institutionId),
    assigned_reviewer_id: null,
    case_manager_human_id: null,
    summary: input.summary,
    opened_at: openedAt,
    notice_due_at: openedAt,
    response_due_at: responseDue,
    decision_due_at: null,
    decided_at: null,
    closed_at: null,
    appeal_deadline: null,
    correlation_id: correlationId,
  };

  const cases = loadIdentityCases();
  cases.push(caseRecord);
  persistIdentityCases(cases);

  appendLedgerEvent({
    human_id: input.subject_human_id,
    institution_id: institutionId,
    event_type: "identity.case_opened",
    occurred_at: openedAt,
    actor_type: input.reporting_human_id ? "human" : "system",
    actor_human_id: input.reporting_human_id ?? null,
    service_identity_id: null,
    source_system: "ITL-REV-001",
    source_record_type: "identity_case",
    source_record_id: caseRecord.id,
    previous_state: null,
    new_state: caseRecord.status,
    reason_code: input.case_type,
    evidence_digest: null,
    correlation_id: correlationId,
  });

  return caseRecord;
}

export function assignCaseReviewer(caseId: string, reviewerId: string, actorId: string) {
  assertWave3Enabled();
  const cases = loadIdentityCases();
  const idx = cases.findIndex((c) => c.id === caseId);
  if (idx < 0) throw new Error("Case not found.");

  const c = cases[idx];
  if (c.subject_human_id === reviewerId) {
    throw new Error("A subject cannot review their own identity case.");
  }
  if (c.reporting_human_id === reviewerId && c.case_type !== "other_identity_matter") {
    throw new Error("Reporter has a disqualifying conflict for this case.");
  }

  cases[idx] = {
    ...c,
    assigned_reviewer_id: reviewerId,
    case_manager_human_id: actorId,
    status: "under_preliminary_review",
  };
  persistIdentityCases(cases);

  appendLedgerEvent({
    human_id: c.subject_human_id,
    institution_id: c.institution_id,
    event_type: "identity.case_assigned",
    occurred_at: nowIso(),
    actor_type: "human",
    actor_human_id: actorId,
    service_identity_id: null,
    source_system: "ITL-REV-001",
    source_record_type: "identity_case",
    source_record_id: caseId,
    previous_state: c.status,
    new_state: "under_preliminary_review",
    reason_code: `reviewer:${reviewerId}`,
    evidence_digest: null,
    correlation_id: c.correlation_id,
  });

  return cases[idx];
}

export function listCasesForHuman(humanId: string) {
  return loadIdentityCases().filter((c) => c.subject_human_id === humanId);
}

export function getIdentityCase(caseId: string) {
  return loadIdentityCases().find((c) => c.id === caseId || c.public_case_id === caseId) ?? null;
}

export function listAllCases(filters?: { status?: string; severity?: string }) {
  let cases = loadIdentityCases();
  if (filters?.status) cases = cases.filter((c) => c.status === filters.status);
  if (filters?.severity) cases = cases.filter((c) => c.severity === filters.severity);
  return cases;
}
