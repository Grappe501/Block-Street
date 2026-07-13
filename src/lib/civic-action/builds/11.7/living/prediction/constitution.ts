/**
 * CAE-11.7-W8 — Prediction Runtime Constitution (LIX-008)
 */
export const LIX_PREDICTION_PRINCIPLE = "Forecasts are advisory. Decisions remain Human.";

export const PREDICTION_ARCHITECTURE = [
  "identity",
  "localbrain",
  "memory",
  "context",
  "executive_assistant",
  "organizer",
  "research",
  "conversation_intelligence",
  "learning",
  "prediction_runtime",
  "human_strategy",
  "institutional_planning",
] as const;

export const SCENARIO_TYPES = [
  "best_case",
  "expected_case",
  "worst_case",
  "custom",
  "strategic_alternative",
  "mission_simulation",
  "election_simulation",
  "budget_simulation",
  "volunteer_growth",
  "community_growth",
  "policy_impact",
] as const;

export const PLANNING_HORIZONS = ["30d", "90d", "1y", "3y", "5y", "10y"] as const;

export const PREDICTION_MAY = [
  "forecast",
  "model",
  "simulate",
  "compare",
  "estimate",
  "detect_trends",
  "evaluate_scenarios",
  "calculate_probabilities",
  "recommend_preparation",
] as const;

export const PREDICTION_MAY_NOT = [
  "present_as_certainty",
  "replace_human_judgment",
  "hide_uncertainty",
  "manipulate_outcomes",
  "autonomous_strategic_decisions",
  "falsify_confidence",
  "claim_inevitability",
  "predict_human_worth",
  "predict_protected_characteristics",
  "create_social_credit",
  "mutate_canonical_records",
] as const;

export const REQUIRED_PREDICTION_SERVICES = [
  "PredictionService",
  "ScenarioEngine",
  "TrendAnalysisService",
  "ForecastService",
  "SimulationService",
  "RiskForecastService",
  "OpportunityForecastService",
  "ResourceModelService",
  "MissionOutcomeService",
  "ImpactAnalysisService",
  "PlanningService",
  "AssumptionService",
] as const;

export function getPredictionConstitution() {
  return {
    protocol_id: "CAE-11.7-W8",
    governing_principle: LIX_PREDICTION_PRINCIPLE,
    architecture: PREDICTION_ARCHITECTURE,
    scenario_types: SCENARIO_TYPES,
    planning_horizons: PLANNING_HORIZONS,
    may: PREDICTION_MAY,
    may_not: PREDICTION_MAY_NOT,
    required_services: REQUIRED_PREDICTION_SERVICES,
  };
}
