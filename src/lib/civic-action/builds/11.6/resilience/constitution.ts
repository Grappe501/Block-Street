/**
 * CAE-11.6-W11 — Institutional Resilience & Continuity Constitution (OPS-001)
 */
export const OPS_RESILIENCE_PRINCIPLE =
  "Every critical institutional function must have a documented, testable continuity plan.";

export const RESILIENCE_ARCHITECTURE = [
  "institution",
  "critical_functions",
  "dependencies",
  "risks",
  "continuity_plans",
  "emergency_workflows",
  "alternate_resources",
  "recovery",
  "lessons_learned",
  "institutional_improvement",
] as const;

export const CRITICAL_FUNCTIONS = [
  "executive_leadership",
  "volunteer_operations",
  "mission_execution",
  "communications",
  "financial_operations",
  "technology",
  "election_operations",
  "facilities",
  "transportation",
  "training",
  "knowledge_management",
  "community_services",
  "compliance",
  "membership",
  "fundraising",
] as const;

export const RISK_CLASSIFICATIONS = [
  "operational",
  "technology",
  "cybersecurity",
  "financial",
  "legal",
  "compliance",
  "environmental",
  "weather",
  "infrastructure",
  "leadership",
  "health",
  "reputation",
  "supply_chain",
  "political",
  "community",
  "election",
  "custom",
] as const;

export const INCIDENT_LEVELS = [
  { level: 1, name: "minor" },
  { level: 2, name: "operational" },
  { level: 3, name: "major" },
  { level: 4, name: "critical" },
  { level: 5, name: "institution_wide_emergency" },
] as const;

export const RECOVERY_PHASES = [
  "immediate_stabilization",
  "essential_operations",
  "expanded_operations",
  "full_restoration",
  "lessons_learned",
  "preparedness_improvements",
] as const;

export const REQUIRED_RESILIENCE_SERVICES = [
  "ContinuityPlanningService",
  "IncidentManagementService",
  "EmergencyOperationsService",
  "DependencyMappingService",
  "RecoveryService",
  "LeadershipContinuityService",
  "TechnologyRecoveryService",
  "OfflineOperationsService",
  "BackupVerificationService",
  "MutualAidService",
  "ReadinessAssessmentService",
  "ResilienceTestingService",
  "LessonsLearnedService",
  "AICrisisAdvisorService",
] as const;

export const RESILIENCE_COMMANDS = [
  "CreateContinuityPlan",
  "ActivateIncident",
  "OpenEmergencyOperationsCenter",
  "DelegateEmergencyAuthority",
  "RequestMutualAid",
  "ActivateRecovery",
  "RunResilienceExercise",
  "VerifyBackups",
  "PublishSituationReport",
  "CloseIncident",
] as const;

export const RESILIENCE_AI_MAY_NOT = [
  "Command emergency operations autonomously",
  "Activate incidents without Human authority",
  "Override governance during crises",
  "Hide incident severity or readiness gaps",
  "Skip documented continuity procedures",
] as const;

export function getResilienceConstitution() {
  return {
    system_id: "OPS-001",
    build: "11.6",
    wave: "11.6-W11",
    governing_principle: OPS_RESILIENCE_PRINCIPLE,
    architecture: [...RESILIENCE_ARCHITECTURE],
    critical_functions: [...CRITICAL_FUNCTIONS],
    risk_classifications: [...RISK_CLASSIFICATIONS],
    incident_levels: [...INCIDENT_LEVELS],
    recovery_phases: [...RECOVERY_PHASES],
    required_services: [...REQUIRED_RESILIENCE_SERVICES],
    commands: [...RESILIENCE_COMMANDS],
    ai_may_not: [...RESILIENCE_AI_MAY_NOT],
    api_namespace: "/api/v1/resilience",
  };
}
