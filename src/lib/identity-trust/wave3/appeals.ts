import { appendLedgerEvent } from "../wave2/ledger";
import { recoverIdentity } from "../wave2/trust-lifecycle";
import {
  loadIdentityAppealRecords,
  loadIdentityCaseDecisions,
  loadIdentityCases,
  loadWave3Flags,
  loadWave3Policy,
  persistIdentityAppealRecords,
  persistIdentityCaseDecisions,
  persistIdentityCases,
} from "./data";
import { assertWave3Enabled, getIdentityCase } from "./cases";
import { checkReviewerConflict, isQualifiedReviewer } from "./reviewers";
import type { IdentityAppealGround, IdentityAppealRecord } from "./types";
import { itlId, nowIso } from "../utils";
import { getCaseDecision } from "./decisions";

export function submitIdentityAppeal(input: {
  case_id: string;
  appellant_human_id: string;
  appeal_ground: IdentityAppealGround;
  statement: string;
  new_evidence_references?: string[];
  requested_remedy: string;
}): IdentityAppealRecord {
  assertWave3Enabled();
  const flags = loadWave3Flags();
  if (!flags.IDENTITY_APPEALS_ENABLED) throw new Error("Identity appeals are not enabled.");

  const c = getIdentityCase(input.case_id);
  if (!c) throw new Error("Case not found.");
  if (c.subject_human_id !== input.appellant_human_id) {
    throw new Error("Only the subject may appeal this case.");
  }

  const decision = getCaseDecision(input.case_id);
  if (!decision) throw new Error("No adverse decision exists to appeal.");

  if (decision.appeal_deadline && new Date(decision.appeal_deadline).getTime() < Date.now()) {
    throw new Error("Appeal deadline has passed.");
  }

  const policy = loadWave3Policy();
  const appealPanel = policy.boards.find((b) => b.board_type === "appeal");

  const appeal: IdentityAppealRecord = {
    id: itlId("iappeal"),
    case_id: input.case_id,
    decision_id: decision.id,
    appellant_human_id: input.appellant_human_id,
    appeal_ground: input.appeal_ground,
    statement: input.statement,
    new_evidence_references: input.new_evidence_references ?? [],
    requested_remedy: input.requested_remedy,
    status: "submitted",
    submitted_at: nowIso(),
    appeal_deadline: decision.appeal_deadline,
    assigned_panel_id: appealPanel?.id ?? "board-appeal",
    original_decider_id: decision.decided_by,
    decided_at: null,
    outcome: null,
  };

  const appeals = loadIdentityAppealRecords();
  appeals.push(appeal);
  persistIdentityAppealRecords(appeals);

  const cases = loadIdentityCases();
  const idx = cases.findIndex((x) => x.id === input.case_id);
  if (idx >= 0) {
    cases[idx] = { ...cases[idx], status: "appeal_pending" };
    persistIdentityCases(cases);
  }

  appendLedgerEvent({
    human_id: input.appellant_human_id,
    institution_id: c.institution_id,
    event_type: "identity.appeal_submitted",
    occurred_at: nowIso(),
    actor_type: "human",
    actor_human_id: input.appellant_human_id,
    service_identity_id: null,
    source_system: "ITL-APL-001",
    source_record_type: "appeal",
    source_record_id: appeal.id,
    previous_state: decision.decision,
    new_state: "appeal_pending",
    reason_code: input.appeal_ground,
    evidence_digest: null,
    correlation_id: c.correlation_id,
  });

  return appeal;
}

export function decideIdentityAppeal(input: {
  appeal_id: string;
  decider_id: string;
  outcome: "granted" | "granted_in_part" | "denied" | "remanded";
  findings: string;
}) {
  assertWave3Enabled();
  const flags = loadWave3Flags();
  if (flags.IDENTITY_INDEPENDENT_APPEAL_REVIEW_REQUIRED && !isQualifiedReviewer(input.decider_id)) {
    throw new Error("Appeal decider must be a qualified reviewer.");
  }

  const appeals = loadIdentityAppealRecords();
  const idx = appeals.findIndex((a) => a.id === input.appeal_id);
  if (idx < 0) throw new Error("Appeal not found.");

  const appeal = appeals[idx];
  if (appeal.original_decider_id === input.decider_id) {
    throw new Error("Original decision maker cannot solely decide the appeal.");
  }

  const conflict = checkReviewerConflict(appeal.case_id, input.decider_id);
  if (conflict.conflict) throw new Error(conflict.reason ?? "Reviewer conflict.");

  appeals[idx] = {
    ...appeal,
    status: input.outcome === "denied" ? "denied" : input.outcome === "remanded" ? "remanded" : "granted",
    decided_at: nowIso(),
    outcome: input.findings,
  };
  persistIdentityAppealRecords(appeals);

  const c = getIdentityCase(appeal.case_id);
  if (c && (input.outcome === "granted" || input.outcome === "granted_in_part")) {
    recoverIdentity(c.subject_human_id, c.institution_id ?? "inst-block-street", input.findings, input.decider_id);
    const cases = loadIdentityCases();
    const cIdx = cases.findIndex((x) => x.id === appeal.case_id);
    if (cIdx >= 0) {
      cases[cIdx] = { ...cases[cIdx], status: "resolved", closed_at: nowIso() };
      persistIdentityCases(cases);
    }
  }

  const decisions = loadIdentityCaseDecisions();
  const dIdx = decisions.findIndex((d) => d.id === appeal.decision_id);
  if (dIdx >= 0 && input.outcome !== "denied") {
    decisions[dIdx] = { ...decisions[dIdx], status: "superseded" };
    persistIdentityCaseDecisions(decisions);
  }

  appendLedgerEvent({
    human_id: appeal.appellant_human_id,
    institution_id: c?.institution_id ?? null,
    event_type: input.outcome === "denied" ? "identity.appeal_denied" : "identity.appeal_granted",
    occurred_at: nowIso(),
    actor_type: "human",
    actor_human_id: input.decider_id,
    service_identity_id: null,
    source_system: "ITL-APL-001",
    source_record_type: "appeal_decision",
    source_record_id: input.appeal_id,
    previous_state: appeal.status,
    new_state: input.outcome,
    reason_code: input.findings,
    evidence_digest: null,
    correlation_id: c?.correlation_id ?? itlId("corr"),
  });

  return appeals[idx];
}

export function listAppealsForHuman(humanId: string) {
  return loadIdentityAppealRecords().filter((a) => a.appellant_human_id === humanId);
}

export function listAllAppeals() {
  return loadIdentityAppealRecords();
}
