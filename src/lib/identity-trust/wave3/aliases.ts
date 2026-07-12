import { appendLedgerEvent } from "../wave2/ledger";
import { loadHumanAliasGovernance, loadWave3Flags, persistHumanAliasGovernance } from "./data";
import { openIdentityCase } from "./cases";
import type { HumanAliasGovernance } from "./types";
import { itlId, nowIso } from "../utils";
import { isQualifiedReviewer } from "./reviewers";

export function requestAliasGovernance(input: {
  human_id: string;
  alias: string;
  alias_type: string;
  scope: string;
  reason: string;
}): HumanAliasGovernance {
  const flags = loadWave3Flags();
  if (!flags.IDENTITY_ALIAS_GOVERNANCE_ENABLED) {
    throw new Error("Alias governance is not enabled.");
  }

  const caseRecord = openIdentityCase({
    case_type: "alias_dispute",
    subject_human_id: input.human_id,
    scope: "alias",
    summary: `Alias request: ${input.alias}`,
    severity: "IG-2",
  });

  const record: HumanAliasGovernance = {
    id: itlId("ialias"),
    human_id: input.human_id,
    alias: input.alias,
    alias_type: input.alias_type,
    scope: input.scope,
    status: "pending",
    case_id: caseRecord.id,
    approved_by: null,
    effective_at: null,
  };

  const all = loadHumanAliasGovernance();
  all.push(record);
  persistHumanAliasGovernance(all);
  return record;
}

export function approveAlias(aliasId: string, reviewerId: string) {
  if (!isQualifiedReviewer(reviewerId)) throw new Error("Qualified reviewer required.");

  const all = loadHumanAliasGovernance();
  const idx = all.findIndex((a) => a.id === aliasId);
  if (idx < 0) throw new Error("Alias record not found.");

  all[idx] = {
    ...all[idx],
    status: "approved",
    approved_by: reviewerId,
    effective_at: nowIso(),
  };
  persistHumanAliasGovernance(all);

  appendLedgerEvent({
    human_id: all[idx].human_id,
    institution_id: null,
    event_type: "identity.alias_approved",
    occurred_at: nowIso(),
    actor_type: "human",
    actor_human_id: reviewerId,
    service_identity_id: null,
    source_system: "ITL-ALS-001",
    source_record_type: "alias",
    source_record_id: aliasId,
    previous_state: "pending",
    new_state: "approved",
    reason_code: all[idx].alias,
    evidence_digest: null,
    correlation_id: itlId("corr"),
  });

  return all[idx];
}

export function rejectAlias(aliasId: string, reviewerId: string, reason: string) {
  const all = loadHumanAliasGovernance();
  const idx = all.findIndex((a) => a.id === aliasId);
  if (idx < 0) throw new Error("Alias record not found.");

  all[idx] = { ...all[idx], status: "rejected", approved_by: reviewerId };
  persistHumanAliasGovernance(all);

  appendLedgerEvent({
    human_id: all[idx].human_id,
    institution_id: null,
    event_type: "identity.alias_rejected",
    occurred_at: nowIso(),
    actor_type: "human",
    actor_human_id: reviewerId,
    service_identity_id: null,
    source_system: "ITL-ALS-001",
    source_record_type: "alias",
    source_record_id: aliasId,
    previous_state: "pending",
    new_state: "rejected",
    reason_code: reason,
    evidence_digest: null,
    correlation_id: itlId("corr"),
  });

  return all[idx];
}

export function listAliasGovernance(humanId?: string) {
  const all = loadHumanAliasGovernance();
  return humanId ? all.filter((a) => a.human_id === humanId) : all;
}
