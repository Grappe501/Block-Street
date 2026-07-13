/**
 * CAE-11.6-W13 — Institutional Measurement & Continuous Improvement Constitution (OPS-001)
 */
export const OPS_IMPROVEMENT_PRINCIPLE =
  "Institutions should optimize for mission impact—not activity volume.";

export const IMPROVEMENT_ARCHITECTURE = [
  "mission",
  "evidence",
  "measurement",
  "analysis",
  "lessons_learned",
  "recommendations",
  "implementation",
  "re_measurement",
  "institutional_improvement",
] as const;

export const MEASUREMENT_CATEGORIES = [
  "strategic",
  "mission",
  "program",
  "project",
  "department",
  "organization",
  "volunteer",
  "training",
  "financial",
  "resource",
  "technology",
  "community",
  "governance",
  "communications",
  "knowledge",
  "learning",
  "election",
  "campaign",
  "federation",
  "custom",
] as const;

export const OUTCOME_TYPES = [
  "mission_success",
  "community_impact",
  "knowledge_growth",
  "volunteer_growth",
  "training_effectiveness",
  "leadership_development",
  "operational_readiness",
  "financial_stewardship",
  "technology_reliability",
  "institutional_resilience",
] as const;

export const IMPROVEMENT_CYCLE = [
  "observe",
  "measure",
  "analyze",
  "recommend",
  "approve",
  "implement",
  "evaluate",
  "institutional_learning",
] as const;

export const ROOT_CAUSE_METHODS = [
  "five_whys",
  "fishbone",
  "timeline_analysis",
  "dependency_analysis",
  "mission_review",
  "failure_review",
  "success_review",
  "institutional_review",
] as const;

export const MATURITY_DOMAINS = [
  "governance",
  "planning",
  "mission_execution",
  "knowledge",
  "technology",
  "communications",
  "resources",
  "leadership",
  "learning",
  "automation",
  "analytics",
  "resilience",
  "federation",
] as const;

export const REQUIRED_IMPROVEMENT_SERVICES = [
  "MeasurementService",
  "KPIService",
  "OutcomeService",
  "BenchmarkService",
  "ContinuousImprovementService",
  "RootCauseAnalysisService",
  "BestPracticeService",
  "ExperimentService",
  "InnovationService",
  "MaturityAssessmentService",
  "OperationalExcellenceService",
  "CommunityImpactService",
  "QualityAssuranceService",
  "ImprovementBacklogService",
  "AIImprovementAdvisorService",
] as const;

export const IMPROVEMENT_COMMANDS = [
  "CreateMeasurement",
  "RecordOutcome",
  "ReviewKPI",
  "RunBenchmark",
  "ConductRootCauseAnalysis",
  "RegisterBestPractice",
  "LaunchExperiment",
  "RecordInnovation",
  "AssessMaturity",
  "ApproveImprovementPlan",
] as const;

export const IMPROVEMENT_AI_MAY_NOT = [
  "Replace Human governance over improvement decisions",
  "Measure or rank individual Human worth",
  "Approve improvement plans autonomously",
  "Override evidence-based conclusions without explanation",
  "Optimize for activity volume over mission impact",
] as const;

export function getImprovementConstitution() {
  return {
    system_id: "OPS-001",
    build: "11.6",
    wave: "11.6-W13",
    governing_principle: OPS_IMPROVEMENT_PRINCIPLE,
    architecture: [...IMPROVEMENT_ARCHITECTURE],
    measurement_categories: [...MEASUREMENT_CATEGORIES],
    outcome_types: [...OUTCOME_TYPES],
    improvement_cycle: [...IMPROVEMENT_CYCLE],
    root_cause_methods: [...ROOT_CAUSE_METHODS],
    maturity_domains: [...MATURITY_DOMAINS],
    required_services: [...REQUIRED_IMPROVEMENT_SERVICES],
    commands: [...IMPROVEMENT_COMMANDS],
    ai_may_not: [...IMPROVEMENT_AI_MAY_NOT],
    api_namespace: "/api/v1/improvement",
  };
}
