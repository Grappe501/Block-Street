/**
 * CAE-11.12-W7 — Knowledge Evolution & Continuous Improvement contracts (KNW-OPT-001)
 * Advisory governance — canonical changes only via Wave 3 commands after Human approval.
 */

export type ImprovementLifecycleState =
  | "detected"
  | "candidate"
  | "triaged"
  | "proposed"
  | "under_review"
  | "approved_for_pilot"
  | "pilot_active"
  | "pilot_evaluation"
  | "approved_for_adoption"
  | "implementation_active"
  | "outcome_review"
  | "institutionalized"
  | "superseded"
  | "rejected"
  | "deferred"
  | "pilot_failed"
  | "rolled_back";

export type ImprovementCandidateType =
  | "knowledge_revision"
  | "course_revision"
  | "competency_revision"
  | "assessment_revision"
  | "certification_revision"
  | "playbook_revision"
  | "sop_revision"
  | "research_priority"
  | "translation_revision"
  | "ai_improvement"
  | "stewardship";

export type ImprovementSourceType =
  | "knowledge_health"
  | "knowledge_gap"
  | "contradiction"
  | "correction_report"
  | "mission_lesson"
  | "course_feedback"
  | "assessment_analysis"
  | "competency_gap"
  | "certification_risk"
  | "research_finding"
  | "ai_tutor_feedback"
  | "human_suggestion"
  | "executive_priority";

export type ImprovementCandidate = {
  improvement_candidate_id: string;
  institution_id: string;
  candidate_type: ImprovementCandidateType;
  source_type: ImprovementSourceType;
  source_id: string;
  title: string;
  problem_statement: string;
  evidence_references: { signal_id: string; source: string; summary: string }[];
  affected_entity_types: string[];
  affected_entity_ids: string[];
  estimated_impact: "low" | "medium" | "high" | "critical";
  urgency: "low" | "medium" | "high" | "emergency";
  confidence: "low" | "medium" | "high";
  identified_by_human_id_optional: string | null;
  identified_by_service_optional: string | null;
  triage_status: "pending" | "advanced" | "combined" | "deferred" | "rejected";
  created_at: string;
  advisory_only: true;
};

export type ImprovementProposal = {
  improvement_proposal_id: string;
  candidate_id: string;
  institution_id: string;
  proposal_type: ImprovementCandidateType;
  proposed_change: string;
  change_rationale: string;
  expected_benefit: string;
  possible_harms: string[];
  affected_humans: string[];
  affected_operations: string[];
  pilot_required: boolean;
  measurement_plan: string;
  rollback_plan: string;
  steward_human_id: string;
  approval_authority: string;
  status: ImprovementLifecycleState;
  current_version: number;
  domain_command_optional: string | null;
  created_at: string;
  advisory_only: true;
};

export type ImprovementPilot = {
  pilot_id: string;
  improvement_proposal_id: string;
  institution_id: string;
  pilot_type: string;
  scope: string;
  success_metrics: string[];
  harm_metrics: string[];
  stop_conditions: string[];
  status: "draft" | "active" | "paused" | "stopped" | "completed" | "failed";
  production_isolated: true;
  started_at: string | null;
  ended_at: string | null;
  advisory_only: true;
};

export type ImprovementOutcome = {
  outcome_id: string;
  improvement_proposal_id: string;
  institution_id: string;
  outcome_category:
    | "improved"
    | "partially_improved"
    | "no_change"
    | "worsened"
    | "mixed"
    | "unable_to_determine"
    | "pilot_stopped"
    | "rolled_back";
  expected_benefit: string;
  observed_outcome: string;
  unintended_effects: string[];
  rollback_recommended: boolean;
  recorded_at: string;
  advisory_only: true;
};

export type InstitutionalWisdomArtifact = {
  institutional_wisdom_id: string;
  institution_id: string;
  title: string;
  guiding_principle: string;
  context: string;
  evidence: string[];
  limitations: string[];
  tradeoffs: string[];
  approval_status: "draft" | "under_review" | "approved" | "archived";
  current_version: number;
  advisory_only: true;
};

export type KnowledgeMaturityLevel =
  | "fragmented"
  | "documented"
  | "governed"
  | "connected"
  | "evidence_driven"
  | "adaptive"
  | "institutionally_wise";

export type KnowledgeOptimization = {
  optimization_id: string;
  category: string;
  title: string;
  what_changed: string;
  why: string;
  confidence: string;
  evidence: { signal_id: string; source: string; summary: string }[];
  expected_benefit: string;
  potential_risk: string;
  who_should_review: string;
  suggested_action: string;
  domain_command_required: string | null;
  human_approval_required: true;
  advisory_only: true;
  generated_at: string;
};

export const OPTIMIZATION_CONTRACT_VERSION = "11.12-w7.1";

export const OPTIMIZATION_PROHIBITED_ACTIONS = [
  "publish_knowledge",
  "rewrite_published_version",
  "verify_competency",
  "award_certification",
  "revoke_certification",
  "finalize_assessment",
  "auto_implement",
  "auto_approve",
  "erase_history",
  "hide_failed_pilot",
  "direct_canonical_mutation",
  "self_implement_recommendation",
  "train_model_automatically",
  "deploy_ai_without_approval",
  "create_human_score",
  "infer_loyalty",
] as const;
