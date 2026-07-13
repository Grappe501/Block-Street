/**
 * CAE-11.12-W7 — AI improvement governance (no autonomous deployment)
 */
import { caeId, nowIso } from "../../../utils";
import { readStoreSlice, writeStoreSlice } from "../services/repository";
import { runIntelligenceEvaluationSuite } from "../intelligence/evaluation-suite";
import { toIntelligenceContext } from "../intelligence/api-context";
import { DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT } from "../ux/experience-context";

export type AIImprovementProposal = {
  proposal_id: string;
  institution_id: string;
  current_config: string;
  observed_failure: string;
  proposed_change: string;
  evaluation_plan: string;
  rollback_plan: string;
  status: "draft" | "evaluating" | "approved" | "rejected" | "deployed" | "rolled_back";
  regression_passed: boolean | null;
  human_approver_required: true;
  auto_deploy_forbidden: true;
};

const KEY = "knowledge_ai_improvement_proposals";

export function createAIImprovementProposal(input: {
  institution_id: string;
  observed_failure: string;
  proposed_change: string;
}): AIImprovementProposal {
  const proposal: AIImprovementProposal = {
    proposal_id: caeId("aip"),
    institution_id: input.institution_id,
    current_config: "deterministic-rules-v1",
    observed_failure: input.observed_failure,
    proposed_change: input.proposed_change,
    evaluation_plan: "Run intelligence evaluation suite including protected assessment cases",
    rollback_plan: "Restore prior configuration snapshot",
    status: "draft",
    regression_passed: null,
    human_approver_required: true,
    auto_deploy_forbidden: true,
  };
  const rows = readStoreSlice<AIImprovementProposal>(KEY);
  rows.push(proposal);
  writeStoreSlice(KEY, rows);
  return proposal;
}

export function evaluateAIImprovementProposal(proposalId: string, institutionId: string): AIImprovementProposal | null {
  const rows = readStoreSlice<AIImprovementProposal>(KEY);
  const idx = rows.findIndex((p) => p.proposal_id === proposalId);
  if (idx < 0) return null;

  const ctx = toIntelligenceContext({
    actor_human_id: DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.actor_human_id,
    service_identity_id_optional: null,
    institution_id: institutionId,
    institution_membership_id: DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.active_membership_id,
    initiative_id_optional: null,
    request_id: "ai-eval",
    correlation_id: "ai-eval",
    idempotency_key_optional: null,
    locale: "en",
    timezone: "America/Chicago",
    effective_permissions: DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.permissions,
  });

  const suite = runIntelligenceEvaluationSuite(ctx);
  const passed = suite.permission_leakage_count === 0 && suite.cases_passed === suite.cases_run;
  rows[idx] = {
    ...rows[idx],
    status: passed ? "evaluating" : "rejected",
    regression_passed: passed,
  };
  writeStoreSlice(KEY, rows);
  return rows[idx];
}

export function approveAIConfigurationChange(proposalId: string): AIImprovementProposal | null {
  const rows = readStoreSlice<AIImprovementProposal>(KEY);
  const idx = rows.findIndex((p) => p.proposal_id === proposalId);
  if (idx < 0 || rows[idx].regression_passed !== true) return null;
  rows[idx] = { ...rows[idx], status: "approved" };
  writeStoreSlice(KEY, rows);
  return rows[idx];
}

export const NO_AUTONOMOUS_RETRAINING = "Feedback informs evaluation only — no automatic model retraining.";
