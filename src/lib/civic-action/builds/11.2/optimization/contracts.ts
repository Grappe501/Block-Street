/**
 * CAE-11.2-W7 — Objective Optimization contracts (OBJ-OPT-001)
 * Advisory only — Humans accept every improvement.
 */

export type OptimizationConfidence = "observed" | "likely" | "strong_pattern" | "institution_standard" | "emerging";

export type OptimizationFeedbackAction = "accepted" | "rejected" | "modified" | "deferred" | "already_implemented" | "not_applicable";

export type OptimizationCategory =
  | "process"
  | "workflow"
  | "governance"
  | "training"
  | "template"
  | "automation"
  | "strategy"
  | "community"
  | "knowledge"
  | "health"
  | "lesson";

export type OptimizationEvidence = {
  signal_id: string;
  source: string;
  summary: string;
};

export type OptimizationRecommendation = {
  optimization_id: string;
  category: OptimizationCategory;
  title: string;
  title_es: string;
  what_changed: string;
  why: string;
  why_es: string;
  confidence: OptimizationConfidence;
  evidence: OptimizationEvidence[];
  expected_benefit: string;
  possible_downside: string;
  who_should_review: string;
  suggested_action: string;
  action_href_optional?: string;
  objective_id_optional?: string;
  initiative_id_optional?: string;
  advisory_only: true;
  generated_at: string;
};

export type StructuredLesson = {
  lesson_id: string;
  objective_id: string;
  objective_name: string;
  initiative_id: string;
  observation: string;
  root_cause: string;
  recommendation: string;
  evidence: string;
  applicability: string;
  confidence: OptimizationConfidence;
  related_template_optional?: string;
  occurred_at: string;
};

export type InstitutionalMemoryEntry = {
  memory_id: string;
  objective_id: string;
  objective_name: string;
  initiative_id: string;
  decision_summary: string;
  what_worked: string | null;
  what_failed: string | null;
  lessons: string | null;
  occurred_at: string;
  searchable_text: string;
};

export type TemplateEvolutionRecord = {
  template_id: string;
  template_name: string;
  version: number;
  source_objective_id: string | null;
  lessons_applied: string[];
  status: "draft" | "validated" | "recommended" | "institution_standard" | "historical" | "retired";
  updated_at: string;
};

export type OrganizationHealthDimension = {
  dimension: string;
  label: string;
  state: "healthy" | "attention" | "critical";
  score_band: number;
  explanation: string;
};

export type ObjectiveMaturityLevel = "emerging" | "repeatable" | "managed" | "measured" | "optimized";

export type ObjectiveMaturityView = {
  institution_id: string;
  level: ObjectiveMaturityLevel;
  score: number;
  completed_objectives: number;
  lessons_captured: number;
  templates_evolved: number;
  explanation: string;
};

export type SimulationRequest = {
  scenario_type: string;
  parameters: Record<string, unknown>;
  objective_id_optional?: string;
};

export type SimulationResult = {
  simulation_id: string;
  scenario_type: string;
  outcomes: string[];
  risks: string[];
  confidence: OptimizationConfidence;
  advisory_only: true;
  note: string;
};

export type ExecutiveImprovementBrief = {
  brief_id: string;
  what_we_learned: string[];
  what_improved: string[];
  needs_attention: string[];
  recommended_changes: OptimizationRecommendation[];
  training_needed: string[];
  template_updates: string[];
  strategic_opportunities: string[];
  reading_time_minutes: number;
};

export const OPTIMIZATION_CONTRACT_VERSION = "11.2-w7.1";

export const OPTIMIZATION_PROHIBITED_ACTIONS = [
  "rewrite_governance",
  "reassign_authority",
  "activate_automation",
  "delete_history",
  "approve_objective",
  "complete_work",
  "archive_objective",
  "spend_money",
  "invite_people",
  "modify_policy",
  "auto_implement",
] as const;
