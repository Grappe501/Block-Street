/**
 * CAE-11.6-W10 — Institutional intelligence data model
 */
import type { FORECAST_TYPES, INTELLIGENCE_CATEGORIES } from "./constitution";

export type IntelligenceCategory = (typeof INTELLIGENCE_CATEGORIES)[number];
export type ForecastType = (typeof FORECAST_TYPES)[number];

export interface InstitutionalInsightRecord {
  insight_id: string;
  institution_id: string;
  insight_type: IntelligenceCategory;
  title: string;
  summary: string;
  confidence: number;
  severity: "low" | "medium" | "high" | "critical";
  priority: "low" | "medium" | "high" | "immediate";
  supporting_evidence: string[];
  affected_objects: string[];
  recommended_actions: string[];
  reasoning_summary: string;
  known_unknowns: string[];
  assumptions: string[];
  advisory_only: true;
  created_at: string;
  expires_at: string | null;
  status: "active" | "archived" | "evaluated";
}

export interface ForecastRecord {
  forecast_id: string;
  institution_id: string;
  forecast_type: ForecastType;
  title: string;
  prediction: string;
  confidence: number;
  confidence_interval_low: number;
  confidence_interval_high: number;
  supporting_evidence: string[];
  horizon: "daily" | "weekly" | "monthly" | "quarterly" | "annual";
  created_at: string;
  expires_at: string | null;
  status: "active" | "archived";
}

export interface PatternRecord {
  pattern_id: string;
  institution_id: string;
  pattern_type: string;
  description: string;
  occurrences: number;
  supporting_evidence: string[];
  detected_at: string;
}

export interface RiskPredictionRecord {
  risk_id: string;
  institution_id: string;
  title: string;
  likelihood: number;
  impact: number;
  earliest_warning: string;
  suggested_mitigation: string;
  confidence: number;
  supporting_evidence: string[];
  created_at: string;
}

export interface OpportunityRecord {
  opportunity_id: string;
  institution_id: string;
  title: string;
  description: string;
  confidence: number;
  supporting_evidence: string[];
  created_at: string;
}

export interface IntelligenceScenarioRecord {
  scenario_id: string;
  institution_id: string;
  title: string;
  hypothesis: string;
  impact_summary: string;
  live_data_altered: false;
  status: "draft" | "analyzed" | "completed";
  created_by: string;
  created_at: string;
}

export interface SimulationRecord {
  simulation_id: string;
  institution_id: string;
  simulation_type: string;
  inputs: Record<string, string>;
  outputs: Record<string, string>;
  isolated: true;
  approved: false;
  created_by: string;
  created_at: string;
}

export interface RecommendationRecord {
  recommendation_id: string;
  institution_id: string;
  category: IntelligenceCategory;
  title: string;
  why: string;
  evidence: string[];
  confidence: number;
  expected_benefit: string;
  advisory_only: true;
  created_at: string;
}

export interface LearningFeedbackRecord {
  feedback_id: string;
  institution_id: string;
  prediction_id: string;
  prediction: string;
  confidence: number;
  actual_outcome: string;
  difference: string;
  lesson_learned: string;
  model_adjustment: string;
  recorded_at: string;
}

export interface InstitutionalHealthIndexRecord {
  health_index_id: string;
  institution_id: string;
  mission_health: number;
  financial_health: number;
  leadership_health: number;
  volunteer_health: number;
  training_health: number;
  resource_health: number;
  communication_health: number;
  knowledge_health: number;
  governance_health: number;
  technology_health: number;
  community_health: number;
  composite_score: number;
  operational_planning_only: true;
  computed_at: string;
}

export const INTELLIGENCE_STORE_KEYS = {
  insights: "ops_intelligence_insights",
  forecasts: "ops_intelligence_forecasts",
  patterns: "ops_intelligence_patterns",
  risks: "ops_intelligence_risks",
  opportunities: "ops_intelligence_opportunities",
  scenarios: "ops_intelligence_scenarios",
  simulations: "ops_intelligence_simulations",
  recommendations: "ops_intelligence_recommendations",
  learning: "ops_intelligence_learning",
  health_index: "ops_institutional_health_index",
} as const;
