/**
 * CAE-11.12-W7 — Outcome measurement and benefit realization
 */
import { caeId, nowIso } from "../../../utils";
import { readStoreSlice, writeStoreSlice } from "../services/repository";
import type { ImprovementOutcome } from "./contracts";
import { transitionProposalStatus } from "./improvement-governance";

const KEY = "knowledge_improvement_outcomes";

export function recordImprovementOutcome(input: {
  improvement_proposal_id: string;
  institution_id: string;
  outcome_category: ImprovementOutcome["outcome_category"];
  expected_benefit: string;
  observed_outcome: string;
  unintended_effects?: string[];
  rollback_recommended?: boolean;
}): ImprovementOutcome {
  const outcome: ImprovementOutcome = {
    outcome_id: caeId("iou"),
    improvement_proposal_id: input.improvement_proposal_id,
    institution_id: input.institution_id,
    outcome_category: input.outcome_category,
    expected_benefit: input.expected_benefit,
    observed_outcome: input.observed_outcome,
    unintended_effects: input.unintended_effects ?? [],
    rollback_recommended: input.rollback_recommended ?? false,
    recorded_at: nowIso(),
    advisory_only: true,
  };
  const rows = readStoreSlice<ImprovementOutcome>(KEY);
  rows.push(outcome);
  writeStoreSlice(KEY, rows);

  if (input.outcome_category === "improved" || input.outcome_category === "partially_improved") {
    transitionProposalStatus(input.improvement_proposal_id, "institutionalized");
  } else if (input.outcome_category === "rolled_back") {
    transitionProposalStatus(input.improvement_proposal_id, "rolled_back");
  }

  return outcome;
}

export function listImprovementOutcomes(institutionId: string) {
  return readStoreSlice<ImprovementOutcome>(KEY).filter((o) => o.institution_id === institutionId);
}
