import { loadHumanIdentities, persistHumanIdentities } from "../data";
import { appendLedgerEvent } from "../wave2/ledger";
import { loadDuplicateCandidates } from "../wave1/data";
import {
  loadDuplicateIdentityCases,
  loadWave3Flags,
  loadWave3Policy,
  persistDuplicateIdentityCases,
} from "./data";
import { openIdentityCase } from "./cases";
import { isQualifiedReviewer } from "./reviewers";
import type { DuplicateIdentityCase } from "./types";
import { itlId, nowIso } from "../utils";

export function openDuplicateCase(input: {
  primary_human_id: string;
  secondary_human_id: string;
  match_signals: string[];
  reporting_human_id?: string;
}): DuplicateIdentityCase {
  const flags = loadWave3Flags();
  if (!flags.IDENTITY_DUPLICATE_MERGE_GOVERNANCE_ENABLED) {
    throw new Error("Duplicate merge governance is not enabled.");
  }

  if (input.match_signals.length === 1 && input.match_signals[0] === "name_similarity") {
    throw new Error("Name similarity alone is insufficient to open a duplicate merge case.");
  }

  const identityCase = openIdentityCase({
    case_type: "duplicate_human",
    subject_human_id: input.primary_human_id,
    reporting_human_id: input.reporting_human_id ?? null,
    scope: "global_human_record",
    summary: `Duplicate identity review: ${input.primary_human_id} vs ${input.secondary_human_id}`,
    severity: "IG-3",
  });

  const dup: DuplicateIdentityCase = {
    id: itlId("idup"),
    identity_case_id: identityCase.id,
    primary_candidate_human_id: input.primary_human_id,
    secondary_candidate_human_id: input.secondary_human_id,
    match_signals: input.match_signals,
    conflicting_signals: [],
    authentication_overlap: input.match_signals.includes("authentication_overlap"),
    membership_overlap: input.match_signals.includes("membership_overlap"),
    risk_level: "moderate",
    proposed_resolution: null,
    status: "open",
    surviving_global_human_id: null,
    approver_human_ids: [],
  };

  const cases = loadDuplicateIdentityCases();
  cases.push(dup);
  persistDuplicateIdentityCases(cases);
  return dup;
}

export function getMergePreview(dupCaseId: string) {
  const dup = loadDuplicateIdentityCases().find((d) => d.id === dupCaseId);
  if (!dup) throw new Error("Duplicate case not found.");

  const primary = loadHumanIdentities().find((h) => h.user_id === dup.primary_candidate_human_id);
  const secondary = loadHumanIdentities().find((h) => h.user_id === dup.secondary_candidate_human_id);

  return {
    duplicate_case: dup,
    primary: primary
      ? { global_human_id: primary.global_human_id, public_name: primary.public_name, user_id: primary.user_id }
      : null,
    secondary: secondary
      ? { global_human_id: secondary.global_human_id, public_name: secondary.public_name, user_id: secondary.user_id }
      : null,
    proposed_surviving_id: primary?.global_human_id ?? null,
    warnings: dup.authentication_overlap ? ["Authentication ownership must be resolved before merge."] : [],
  };
}

export function approveDuplicateMerge(dupCaseId: string, approverId: string) {
  if (!isQualifiedReviewer(approverId)) {
    throw new Error("Approver must be a qualified platform reviewer.");
  }

  const policy = loadWave3Policy();
  const cases = loadDuplicateIdentityCases();
  const idx = cases.findIndex((d) => d.id === dupCaseId);
  if (idx < 0) throw new Error("Duplicate case not found.");

  const dup = cases[idx];
  if (!dup.approver_human_ids.includes(approverId)) {
    dup.approver_human_ids.push(approverId);
  }

  if (dup.approver_human_ids.length >= policy.duplicate_merge_required_approvals) {
    dup.status = "merge_approved";
    const preview = getMergePreview(dupCaseId);
    dup.surviving_global_human_id = preview.proposed_surviving_id;
    dup.proposed_resolution = "merge";
  }

  cases[idx] = dup;
  persistDuplicateIdentityCases(cases);
  return dup;
}

export function executeDuplicateMerge(dupCaseId: string, actorId: string) {
  const cases = loadDuplicateIdentityCases();
  const idx = cases.findIndex((d) => d.id === dupCaseId);
  if (idx < 0) throw new Error("Duplicate case not found.");
  const dup = cases[idx];

  if (dup.status !== "merge_approved") {
    throw new Error("Merge requires two qualified reviewer approvals.");
  }

  const humans = loadHumanIdentities();
  const secondaryIdx = humans.findIndex((h) => h.user_id === dup.secondary_candidate_human_id);
  if (secondaryIdx >= 0) {
    humans[secondaryIdx] = {
      ...humans[secondaryIdx],
      identity_status: "archived",
      updated_at: nowIso(),
    };
    persistHumanIdentities(humans);
  }

  cases[idx] = { ...dup, status: "merged" };
  persistDuplicateIdentityCases(cases);

  appendLedgerEvent({
    human_id: dup.primary_candidate_human_id,
    institution_id: null,
    event_type: "identity.duplicate_merge_completed",
    occurred_at: nowIso(),
    actor_type: "human",
    actor_human_id: actorId,
    service_identity_id: null,
    source_system: "ITL-DUP-001",
    source_record_type: "duplicate_merge",
    source_record_id: dupCaseId,
    previous_state: dup.secondary_candidate_human_id,
    new_state: dup.surviving_global_human_id,
    reason_code: "merge_executed",
    evidence_digest: null,
    correlation_id: itlId("corr"),
  });

  return cases[idx];
}

export function confirmDistinctHumans(dupCaseId: string, actorId: string) {
  const cases = loadDuplicateIdentityCases();
  const idx = cases.findIndex((d) => d.id === dupCaseId);
  if (idx < 0) throw new Error("Duplicate case not found.");
  cases[idx] = { ...cases[idx], status: "distinct_confirmed", proposed_resolution: "distinct" };
  persistDuplicateIdentityCases(cases);
  return cases[idx];
}

export function reconcileWave1DuplicateCandidates(actorId: string) {
  const candidates = loadDuplicateCandidates();
  const opened: string[] = [];
  for (const c of candidates) {
    if (c.review_status === "possible_match" || c.review_status === "manual_review_required") {
      const primary = c.matched_human_id ?? c.candidate_human_id;
      const secondary = c.candidate_human_id ?? c.matched_human_id;
      if (!primary || !secondary || primary === secondary) continue;
      const dup = openDuplicateCase({
        primary_human_id: primary,
        secondary_human_id: secondary,
        match_signals: c.match_signals.length ? c.match_signals : ["migration_candidate"],
        reporting_human_id: actorId,
      });
      opened.push(dup.id);
    }
  }
  return opened;
}
