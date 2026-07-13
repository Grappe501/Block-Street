/**
 * CAE-11.6-W10 — Predictive Intelligence & Institutional Analytics Constitution (OPS-001)
 */
export const OPS_INTELLIGENCE_PRINCIPLE =
  "Predictions inform Human judgment. They never replace Human judgment.";

export const INTELLIGENCE_ARCHITECTURE = [
  "operational_data",
  "knowledge_graph",
  "historical_evidence",
  "pattern_detection",
  "predictive_models",
  "scenario_forecasts",
  "executive_insights",
  "recommendations",
  "human_decisions",
  "institutional_learning",
] as const;

export const INTELLIGENCE_CATEGORIES = [
  "strategic",
  "operational",
  "mission",
  "financial",
  "volunteer",
  "training",
  "leadership",
  "resource",
  "calendar",
  "communications",
  "governance",
  "election",
  "campaign",
  "research",
  "compliance",
  "technology",
  "community",
  "risk",
  "opportunity",
] as const;

export const FORECAST_TYPES = [
  "mission_completion",
  "volunteer_availability",
  "budget_burn",
  "resource_utilization",
  "training_demand",
  "leadership_capacity",
  "meeting_load",
  "election_readiness",
  "campaign_growth",
  "grant_needs",
  "membership_trends",
  "communication_volume",
] as const;

export const REQUIRED_INTELLIGENCE_SERVICES = [
  "InsightService",
  "ForecastService",
  "PredictionService",
  "PatternRecognitionService",
  "OpportunityService",
  "RiskPredictionService",
  "ScenarioService",
  "SimulationService",
  "RecommendationService",
  "InstitutionalHealthService",
  "TrendAnalysisService",
  "KnowledgeAnalyticsService",
  "FederationAnalyticsService",
  "AIInsightService",
  "LearningFeedbackService",
] as const;

export const INTELLIGENCE_COMMANDS = [
  "GenerateForecast",
  "GenerateInsight",
  "RunSimulation",
  "CompareScenarios",
  "AnalyzeTrend",
  "DetectPatterns",
  "RecommendActions",
  "EvaluatePrediction",
  "PublishExecutiveInsight",
  "ArchiveForecast",
] as const;

export const INTELLIGENCE_AI_MAY_NOT = [
  "Replace Human judgment with opaque predictions",
  "Hide uncertainty or confidence intervals",
  "Modify live operational data through simulations",
  "Score individuals for reputation or popularity",
  "Execute institutional decisions autonomously",
] as const;

export function getIntelligenceConstitution() {
  return {
    system_id: "OPS-001",
    build: "11.6",
    wave: "11.6-W10",
    governing_principle: OPS_INTELLIGENCE_PRINCIPLE,
    architecture: [...INTELLIGENCE_ARCHITECTURE],
    intelligence_categories: [...INTELLIGENCE_CATEGORIES],
    forecast_types: [...FORECAST_TYPES],
    required_services: [...REQUIRED_INTELLIGENCE_SERVICES],
    commands: [...INTELLIGENCE_COMMANDS],
    ai_may_not: [...INTELLIGENCE_AI_MAY_NOT],
    api_namespace: "/api/v1/intelligence",
  };
}
