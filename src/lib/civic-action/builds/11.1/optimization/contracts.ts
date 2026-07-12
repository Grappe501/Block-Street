/**
 * CAE-11.1-W7 — Institutional Optimization contracts (INI-OPT-001)
 * Advisory only — Humans accept every improvement.
 */

export type OptimizationConfidence = "observed" | "emerging" | "strong_pattern" | "institution_standard";

export type OptimizationFeedbackAction = "accepted" | "rejected" | "modified" | "deferred" | "not_applicable";

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
  | "health";

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
  advisory_only: true;
  generated_at: string;
};

export type InstitutionalMemoryEntry = {
  memory_id: string;
  initiative_id: string;
  initiative_name: string;
  decision_summary: string;
  what_worked: string | null;
  what_failed: string | null;
  lessons: string | null;
  occurred_at: string;
  searchable_text: string;
};

export type ProcessOptimizationView = {
  process_id: string;
  process_name: string;
  current_steps: number;
  current_avg_days: number;
  suggested_steps: number;
  suggested_avg_days: number;
  confidence: OptimizationConfidence;
  evidence: OptimizationEvidence[];
};

export type TemplateEvolutionRecord = {
  template_id: string;
  template_name: string;
  version: number;
  source_initiative_id: string | null;
  lessons_applied: string[];
  status: "draft" | "recommended" | "published";
  updated_at: string;
};

export type OrganizationHealthDimension = {
  dimension: string;
  label: string;
  state: "healthy" | "attention" | "critical";
  score_band: number;
  explanation: string;
};

export type SimulationRequest = {
  scenario_type: string;
  parameters: Record<string, unknown>;
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

export type ScenarioOption = {
  option_id: string;
  label: string;
  cost_band: "low" | "medium" | "high";
  duration_band: "short" | "medium" | "long";
  impact_band: "low" | "medium" | "high";
  summary: string;
};

export type ScenarioComparison = {
  comparison_id: string;
  options: ScenarioOption[];
  recommendation_optional?: string;
  advisory_only: true;
};

export type DigitalTwinSnapshot = {
  twin_id: string;
  institution_id: string;
  people_count: number;
  initiative_count: number;
  active_initiatives: number;
  relationship_edges: number;
  processes_modeled: number;
  safe_to_test: true;
  advisory_only: true;
  generated_at: string;
};

export type ExecutiveOptimizationBrief = {
  brief_id: string;
  yesterday_we_learned: string[];
  todays_opportunities: OptimizationRecommendation[];
  process_improvements: ProcessOptimizationView[];
  training_needed: string[];
  emerging_risks: string[];
  suggested_optimizations: OptimizationRecommendation[];
  strategic_opportunities: string[];
};

export const OPTIMIZATION_CONTRACT_VERSION = "11.1-w7.1";

export const OPTIMIZATION_PROHIBITED_ACTIONS = [
  "rewrite_governance",
  "reassign_authority",
  "activate_automation",
  "delete_history",
  "approve_initiative",
  "spend_money",
  "invite_people",
  "modify_policy",
] as const;
