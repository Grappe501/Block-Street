export type IntelligenceCategory =
  | "opportunity"
  | "risk"
  | "trend"
  | "capacity"
  | "leadership"
  | "volunteer"
  | "partnership"
  | "education"
  | "community"
  | "operational"
  | "forecast";

export type InsightPriority = "low" | "medium" | "high" | "critical";

export type InsightConfidence = "low" | "moderate" | "high" | "very_high";

export type WarningLevel = "informational" | "watch" | "concern" | "high_risk" | "critical";

export type RecommendationStatus = "pending" | "under_review" | "approved" | "rejected" | "implemented" | "resolved";

export type RecommendationType =
  | "mentor_development"
  | "leadership_cohort"
  | "volunteer_recruitment"
  | "partnership"
  | "civic_education"
  | "workload_redistribution"
  | "knowledge_documentation"
  | "resource_allocation";

export type DecisionOutcome = "approved" | "rejected" | "deferred" | "modified";

export interface StrategicInsight {
  id: string;
  institution_id: string;
  community_id: string | null;
  county_id: string | null;
  category: IntelligenceCategory;
  priority: InsightPriority;
  confidence: InsightConfidence;
  summary: string;
  supporting_evidence: string[];
  recommended_actions: string[];
  explainable_reasoning: string;
  alternatives: string[];
  generated_at: string;
  status: "active" | "resolved" | "dismissed";
}

export interface StrategicRecommendation {
  id: string;
  insight_id: string;
  institution_id: string;
  recommendation_type: RecommendationType;
  summary: string;
  expected_benefit: string;
  estimated_effort: "low" | "medium" | "high";
  confidence: InsightConfidence;
  tradeoffs: string[];
  status: RecommendationStatus;
  advisory_only: true;
  generated_at: string;
}

export interface EarlyWarning {
  id: string;
  institution_id: string;
  community_id: string | null;
  warning_level: WarningLevel;
  warning_type: string;
  title: string;
  message: string;
  supporting_evidence: string[];
  explainable_reason: string;
  detected_at: string;
  resolved_at: string | null;
}

export interface Scenario {
  id: string;
  institution_id: string;
  name: string;
  assumptions: string[];
  inputs: Record<string, number | string>;
  expected_outcomes: string[];
  confidence: InsightConfidence;
  advisory_only: true;
  generated_at: string;
}

export interface Forecast {
  id: string;
  institution_id: string;
  community_id: string | null;
  forecast_type: "leadership_capacity" | "volunteer_growth" | "participation" | "organizational_readiness" | "community_resilience";
  horizon: "quarterly" | "annual" | "multi_year";
  current_value: number;
  projected_value: number;
  probability_percent: number;
  assumptions: string[];
  advisory_only: true;
  generated_at: string;
}

export interface DecisionRecord {
  id: string;
  institution_id: string;
  recommendation_id: string;
  reviewer_id: string;
  decision: DecisionOutcome;
  evidence_reviewed: string[];
  rationale: string;
  decided_at: string;
  outcome_notes: string | null;
  lessons_learned: string | null;
}

export interface InstitutionalLearning {
  id: string;
  institution_id: string;
  intervention_type: string;
  success: boolean;
  summary: string;
  evidence: string[];
  reusable: boolean;
  recorded_at: string;
}

export interface DecisionSupportPackage {
  recommendation_id: string;
  evidence_summary: string[];
  confidence: InsightConfidence;
  supporting_trends: string[];
  alternative_options: string[];
  risks: string[];
  expected_outcomes: string[];
  human_authority_required: true;
}

export interface StrategicDashboard {
  institution_id: string;
  strategic_opportunities: number;
  high_risks: number;
  leadership_forecast: "positive" | "stable" | "negative";
  volunteer_trend: "growing" | "stable" | "declining";
  community_capacity: "growing" | "stable" | "declining";
  top_recommendation: string | null;
  active_warnings: number;
}

export interface ExecutiveStrategicDashboard {
  institution_id: string;
  top_opportunities: StrategicInsight[];
  top_risks: StrategicInsight[];
  forecasts: Forecast[];
  strategic_priorities: string[];
  resource_recommendations: string[];
  pending_decisions: number;
}

export interface FederationIntelligence {
  successful_models: string[];
  shared_risks: string[];
  common_opportunities: string[];
  emerging_best_practices: string[];
  privacy_note: string;
}

export interface StrategicAuditEvent {
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
