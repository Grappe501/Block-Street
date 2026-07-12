export type OutcomeCategory =
  | "leadership"
  | "volunteer_growth"
  | "training"
  | "community_project"
  | "education"
  | "coalition"
  | "community_capacity"
  | "participation"
  | "partnership"
  | "organizational_growth";

export type OutcomeDomain =
  | "civic_participation"
  | "leadership"
  | "volunteer_capacity"
  | "organizational_development"
  | "community_resilience"
  | "civic_education"
  | "coalition_growth"
  | "community_problem_solving"
  | "public_engagement"
  | "institutional_sustainability";

export type MeasurementLevel = "output" | "outcome" | "impact";

export type VerificationLevel =
  | "self_reported"
  | "peer_verified"
  | "leader_verified"
  | "institution_verified"
  | "external_verified";

export type AttributionLevel = "correlation" | "contribution" | "likely_attribution" | "direct_attribution";

export type AttributionConfidence = "low" | "moderate" | "high" | "very_high";

export type EvidenceType =
  | "participation_record"
  | "survey"
  | "assessment"
  | "report"
  | "project_completion"
  | "volunteer_log"
  | "meeting_record"
  | "community_observation"
  | "external_dataset";

export interface OutcomeRecord {
  id: string;
  institution_id: string;
  program_id: string;
  community_id: string;
  outcome_type: MeasurementLevel;
  category: OutcomeCategory;
  domain: OutcomeDomain;
  indicator: string;
  baseline: number;
  current_value: number;
  target_value: number;
  measurement_period: string;
  confidence_level: AttributionConfidence;
  attribution_level: AttributionLevel;
  evidence_count: number;
  trend: "positive" | "stable" | "negative";
  last_updated: string;
}

export interface OutcomeEvidence {
  id: string;
  outcome_record_id: string;
  evidence_type: EvidenceType;
  source: string;
  verification_level: VerificationLevel;
  submitted_by: string;
  date: string;
  notes?: string;
}

export interface TheoryOfChange {
  id: string;
  program_id: string;
  institution_id: string;
  resources: string[];
  activities: string[];
  outputs: string[];
  outcomes: string[];
  long_term_impact: string[];
  updated_at: string;
}

export interface ProgramOutput {
  id: string;
  program_id: string;
  institution_id: string;
  output_type: string;
  description: string;
  quantity: number;
  period: string;
  recorded_at: string;
}

export interface ProgramEvaluation {
  id: string;
  program_id: string;
  institution_id: string;
  did_it_work: boolean;
  why_summary: string;
  for_whom: string;
  conditions: string;
  recommendations: string[];
  evaluated_at: string;
}

export interface AttributionAnalysis {
  outcome_record_id: string;
  attribution_level: AttributionLevel;
  confidence: AttributionConfidence;
  factors: string[];
  evidence_gaps: string[];
  explainable_summary: string;
  calculated_at: string;
}

export interface OutcomeTimelineEntry {
  period: string;
  value: number;
  milestone?: string;
}

export interface OutcomeBenchmark {
  outcome_record_id: string;
  historical_baseline: number;
  current_value: number;
  peer_average: number;
  percentile: number;
  anonymous: true;
  compared_at: string;
}

export interface CivicReturnOnParticipation {
  program_id: string;
  volunteer_hours: number;
  projects_completed: number;
  outcomes_achieved: number;
  long_term_impact_indicators: number;
  crop_score: number;
  advisory_only: true;
}

export interface CivicROIEstimate {
  program_id: string;
  resources_invested_description: string;
  community_benefit_description: string;
  estimated_ratio: number | null;
  advisory_only: true;
  disclaimer: string;
}

export interface OutcomeDashboard {
  institution_id: string;
  programs: number;
  measured_outcomes: number;
  positive_trends: number;
  needs_attention: number;
  leadership_growth_percent: number;
  volunteer_retention_percent: number;
}

export interface ExecutiveOutcomeDashboard {
  institution_id: string;
  organizational_outcomes: number;
  community_outcomes: number;
  impact_confidence: AttributionConfidence;
  long_term_trend: "improving" | "stable" | "declining";
  program_effectiveness_percent: number;
  investment_effectiveness_note: string;
}

export interface OutcomeReport {
  id: string;
  report_type: "annual_impact" | "community_outcomes" | "leadership_outcomes" | "volunteer_outcomes" | "organizational_outcomes" | "civic_education_outcomes";
  institution_id: string;
  community_id: string | null;
  title: string;
  period_start: string;
  period_end: string;
  summary: string;
  aggregated_only: true;
  sections: { heading: string; content: string }[];
  generated_at: string;
}

export interface FederationOutcomeAnalytics {
  aggregate_impact_index: number;
  shared_learning_count: number;
  successful_models: number;
  long_term_civic_trend: "improving" | "stable" | "declining";
  privacy_note: string;
}

export interface OutcomeInsight {
  insight_type: "indicator" | "evidence_gap" | "evaluation" | "forecast" | "improvement";
  title: string;
  message: string;
  advisory_only: true;
  generated_at: string;
}

export interface OutcomeAuditEvent {
  id: string;
  institution_id: string;
  actor_id: string;
  action: string;
  target_type: string;
  target_id: string;
  result: "success" | "failure";
  timestamp: string;
  metadata?: Record<string, unknown>;
}
