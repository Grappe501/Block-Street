/**
 * CAE-11.6-W8 — Executive Operations & Decision Intelligence Constitution (OPS-001)
 */
export const OPS_EXECUTIVE_PRINCIPLE =
  "Leadership should spend time making decisions—not collecting information.";

export const EXECUTIVE_ARCHITECTURE = [
  "institution",
  "executive_office",
  "strategic_dashboard",
  "operational_dashboard",
  "mission_intelligence",
  "workforce_intelligence",
  "resource_intelligence",
  "financial_intelligence",
  "communication_intelligence",
  "risk_intelligence",
  "decision_support",
  "executive_briefing",
  "institutional_learning",
] as const;

export const EXECUTIVE_ROLES = [
  "chair",
  "president",
  "ceo",
  "executive_director",
  "coo",
  "cfo",
  "cto",
  "campaign_manager",
  "county_director",
  "regional_director",
  "department_director",
  "committee_chair",
  "board_member",
  "chief_of_staff",
  "custom",
] as const;

export const ALERT_PRIORITY_LEVELS = [
  "critical",
  "immediate",
  "high",
  "medium",
  "low",
  "informational",
] as const;

export const REQUIRED_EXECUTIVE_SERVICES = [
  "ExecutiveDashboardService",
  "ExecutiveBriefingService",
  "DecisionSupportService",
  "MissionIntelligenceService",
  "OperationalHealthService",
  "FinancialIntelligenceService",
  "ResourceIntelligenceService",
  "WorkforceIntelligenceService",
  "OrganizationIntelligenceService",
  "CommunicationIntelligenceService",
  "RiskIntelligenceService",
  "ScenarioPlanningService",
  "WarRoomService",
  "ExecutiveTimelineService",
  "ExecutiveSecurityService",
  "AIExecutiveAdvisorService",
] as const;

export const EXECUTIVE_COMMANDS = [
  "GenerateExecutiveBriefing",
  "ApproveDecision",
  "EscalateIssue",
  "OpenWarRoom",
  "CreateScenario",
  "RunScenarioAnalysis",
  "PublishExecutiveSummary",
  "ReviewInstitutionHealth",
  "AssignExecutiveAction",
  "ResolveExecutiveAlert",
] as const;

export const EXECUTIVE_AI_MAY_NOT = [
  "Exercise executive authority autonomously",
  "Approve decisions without Human action",
  "Alter live institutional data through scenarios",
  "Display personal reputation or popularity scores",
  "Override need-to-know security filtering",
] as const;

export function getExecutiveConstitution() {
  return {
    system_id: "OPS-001",
    build: "11.6",
    wave: "11.6-W8",
    governing_principle: OPS_EXECUTIVE_PRINCIPLE,
    architecture: [...EXECUTIVE_ARCHITECTURE],
    executive_roles: [...EXECUTIVE_ROLES],
    required_services: [...REQUIRED_EXECUTIVE_SERVICES],
    commands: [...EXECUTIVE_COMMANDS],
    ai_may_not: [...EXECUTIVE_AI_MAY_NOT],
    api_namespace: "/api/v1/executive",
  };
}
