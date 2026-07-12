/**
 * CAE-11.2-W6 — Objective Intelligence contracts (OBJ-INT-001)
 * Advisory only — never authoritative for execution mutations.
 */

export type IntelligenceConfidence = "very_high" | "high" | "medium" | "low" | "speculative";

export type RecommendationType =
  | "opportunity"
  | "warning"
  | "optimization"
  | "relationship"
  | "resource"
  | "training"
  | "historical"
  | "executive"
  | "duplicate"
  | "reminder"
  | "risk";

export type IntelligenceEvidence = {
  signal_id: string;
  source: string;
  summary: string;
  field_optional?: string;
  event_id_optional?: string;
};

export type ObjectiveRecommendation = {
  recommendation_id: string;
  recommendation_type: RecommendationType;
  title: string;
  title_es: string;
  why: string;
  why_es: string;
  confidence: IntelligenceConfidence;
  confidence_score: number;
  evidence: IntelligenceEvidence[];
  uncertainty_notes: string[];
  suggested_action: string;
  suggested_action_es: string;
  expected_benefit_optional?: string;
  possible_downside_optional?: string;
  action_href_optional?: string;
  objective_id_optional?: string;
  initiative_id_optional?: string;
  related_objective_ids?: string[];
  dismissible: true;
  advisory_only: true;
  generated_at: string;
};

export type DuplicateObjectiveCandidate = {
  objective_id_a: string;
  objective_id_b: string;
  name_a: string;
  name_b: string;
  similarity_score: number;
  similarity_label: string;
  shared_signals: string[];
  confidence: IntelligenceConfidence;
  compare_href: string;
};

export type ExecutionRiskSignal = {
  risk_id: string;
  risk_type: string;
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  explanation: string;
  objective_id: string;
  initiative_id: string;
  evidence: IntelligenceEvidence[];
  confidence: IntelligenceConfidence;
  recommended_actions: string[];
};

export type CapacitySnapshot = {
  human_id: string;
  human_label: string;
  mission_count: number;
  active_mission_count: number;
  task_count: number;
  overload_band: "normal" | "elevated" | "high";
  recommendation_optional?: string;
};

export type ProgressInsight = {
  objective_id: string;
  progress_percent: number;
  trend: "accelerating" | "steady" | "decelerating" | "stalled";
  forecast_label: string;
  confidence: IntelligenceConfidence;
  momentum_score: number;
};

export type ExecutionInsight = {
  objective_id: string;
  workstream_id_optional?: string;
  velocity_label: string;
  blocked_missions: number;
  overdue_tasks: number;
  idle_missions: number;
  confidence: IntelligenceConfidence;
};

export type ForecastInsight = {
  forecast_id: string;
  objective_id: string;
  forecast_type: "completion" | "review_delay" | "capacity" | "mission_completion";
  predicted_label: string;
  confidence: IntelligenceConfidence;
  evidence: IntelligenceEvidence[];
  advisory_only: true;
};

export type ExecutiveBrief = {
  brief_id: string;
  institution_id: string;
  initiative_id_optional?: string;
  generated_at: string;
  todays_priorities: ObjectiveRecommendation[];
  objectives_at_risk: number;
  execution_momentum: string;
  critical_risks: ExecutionRiskSignal[];
  pending_decisions: string[];
  suggested_conversations: string[];
  upcoming_reviews: string[];
  capacity_issues: string[];
  reading_time_minutes: number;
};

export type CopilotQueryResult = {
  query: string;
  intent: string;
  answer: string;
  answer_es: string;
  confidence: IntelligenceConfidence;
  evidence: IntelligenceEvidence[];
  alternative_interpretation_optional?: string;
  who_should_review_optional?: string;
  advisory_only: true;
  governance_note: string;
};

export type RecommendationFeedbackAction =
  | "accept"
  | "dismiss"
  | "already_handled"
  | "not_relevant"
  | "wrong"
  | "helpful";

export type RecommendationFeedback = {
  feedback_id: string;
  recommendation_id: string;
  action: RecommendationFeedbackAction;
  actor_human_id: string;
  institution_id: string;
  recorded_at: string;
  notes_optional?: string;
};

export const INTELLIGENCE_CONTRACT_VERSION = "11.2-w6.1";

export const AI_PROHIBITED_ACTIONS = [
  "approve",
  "assign_mission",
  "assign_task",
  "complete_work",
  "activate_objective",
  "archive_objective",
  "attach_evidence_authoritative",
  "record_outcome_authoritative",
  "delete_record",
  "override_governance",
  "spend_money",
  "invite_human",
] as const;
