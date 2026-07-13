/**
 * CAE-11.7-W8 — Prediction data model
 */
import type { PLANNING_HORIZONS, SCENARIO_TYPES } from "./constitution";

export type ScenarioType = (typeof SCENARIO_TYPES)[number];
export type PlanningHorizon = (typeof PLANNING_HORIZONS)[number];

export const PREDICTION_STORE_KEYS = {
  forecasts: "lix_prediction_forecasts",
  scenarios: "lix_prediction_scenarios",
  trends: "lix_prediction_trends",
  risks: "lix_prediction_risks",
  opportunities: "lix_prediction_opportunities",
  resources: "lix_prediction_resources",
  missionOutcomes: "lix_prediction_mission_outcomes",
  impacts: "lix_prediction_impacts",
  planning: "lix_prediction_planning",
  assumptions: "lix_prediction_assumptions",
  simulations: "lix_prediction_simulations",
} as const;

export interface ForecastRecord {
  forecast_id: string;
  human_id: string;
  institution_id: string;
  subject: string;
  summary: string;
  evidence: string[];
  model_inputs: string[];
  assumptions: string[];
  confidence: number;
  alternatives: string[];
  time_horizon: PlanningHorizon;
  freshness: string;
  limitations: string[];
  certainty_claimed: false;
  advisory_only: true;
  version: number;
  generated_at: string;
}

export interface ScenarioRecord {
  scenario_id: string;
  human_id: string;
  institution_id: string;
  scenario_type: ScenarioType;
  title: string;
  description: string;
  assumptions: string[];
  outcomes: { label: string; probability: number; impact: string }[];
  confidence: number;
  reproducible: true;
  version: number;
  created_at: string;
}

export interface TrendRecord {
  trend_id: string;
  institution_id: string;
  metric: string;
  direction: "up" | "down" | "stable" | "volatile";
  current_value: number;
  projected_value: number;
  evidence: string[];
  confidence: number;
  updated_at: string;
}

export interface RiskForecastRecord {
  risk_id: string;
  institution_id: string;
  human_id: string;
  category: string;
  title: string;
  summary: string;
  evidence: string[];
  likelihood: string;
  impact: string;
  mitigation: string[];
  confidence: number;
  certainty_claimed: false;
  forecasted_at: string;
}

export interface OpportunityForecastRecord {
  opportunity_id: string;
  institution_id: string;
  human_id: string;
  title: string;
  domain: string;
  description: string;
  evidence: string[];
  time_window: string;
  confidence: number;
  recommendation_only: true;
  forecasted_at: string;
}

export interface ResourceModelRecord {
  model_id: string;
  institution_id: string;
  resource_type: string;
  current_capacity: number;
  projected_need: number;
  time_horizon: PlanningHorizon;
  assumptions: string[];
  confidence: number;
  modeled_at: string;
}

export interface MissionOutcomeRecord {
  outcome_id: string;
  institution_id: string;
  mission_id: string;
  success_probability: number;
  schedule_impact: string;
  budget_impact: string;
  volunteer_needs: string;
  blockers: string[];
  training_needs: string[];
  confidence: number;
  advisory_only: true;
  modeled_at: string;
}

export interface ImpactAnalysisRecord {
  impact_id: string;
  institution_id: string;
  human_id: string;
  decision_subject: string;
  operational: string[];
  financial: string[];
  training: string[];
  timeline: string[];
  political: string[];
  community: string[];
  technology: string[];
  resources: string[];
  confidence: number;
  mutates_canonical: false;
  analyzed_at: string;
}

export interface PlanningRecord {
  plan_id: string;
  institution_id: string;
  human_id: string;
  horizon: PlanningHorizon;
  vision: string;
  milestones: string[];
  assumptions: string[];
  confidence: number;
  updated_at: string;
}

export interface AssumptionRecord {
  assumption_id: string;
  institution_id: string;
  human_id: string;
  forecast_id: string | null;
  scenario_id: string | null;
  label: string;
  value: string;
  sensitivity: "low" | "medium" | "high";
  version: number;
  updated_at: string;
}

export interface SimulationRecord {
  simulation_id: string;
  human_id: string;
  institution_id: string;
  query: string;
  variables: Record<string, string | number>;
  downstream_impacts: string[];
  confidence: number;
  completed_at: string;
  autonomous_decision: false;
}
