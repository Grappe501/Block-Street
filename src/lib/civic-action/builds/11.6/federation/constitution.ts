/**
 * CAE-11.6-W12 — Federation & Network Operations Constitution (OPS-001)
 */
export const OPS_FEDERATION_PRINCIPLE =
  "Independent Institutions collaborate through explicit agreements—not implicit trust.";

export const FEDERATION_ARCHITECTURE = [
  "federation",
  "member_institutions",
  "federation_agreements",
  "shared_objectives",
  "joint_missions",
  "shared_resources",
  "joint_calendar",
  "joint_communications",
  "joint_intelligence",
  "federation_memory",
  "collective_learning",
] as const;

export const FEDERATION_TYPES = [
  "coalition",
  "alliance",
  "campaign",
  "consortium",
  "association",
  "trade_organization",
  "regional_network",
  "government_partnership",
  "education_network",
  "faith_network",
  "volunteer_network",
  "business_group",
  "research_consortium",
  "emergency_mutual_aid",
  "custom",
] as const;

export const FEDERATION_GOVERNANCE_MODELS = [
  "representative_council",
  "executive_committee",
  "board",
  "consensus",
  "weighted_voting",
  "advisory",
  "emergency_governance",
  "hybrid",
] as const;

export const FEDERATION_LIFECYCLE = [
  "proposed",
  "formation",
  "active",
  "expansion",
  "restructuring",
  "dissolution",
  "historical_archive",
] as const;

export const AGREEMENT_TYPES = [
  "knowledge_sharing",
  "resource_sharing",
  "personnel_sharing",
  "financial_cooperation",
  "joint_missions",
  "technology",
  "emergency_support",
  "training",
  "research",
  "custom",
] as const;

export const VOTING_METHODS = [
  "simple_majority",
  "super_majority",
  "weighted_membership",
  "institution_based",
  "consensus",
  "delegated",
  "secret_ballot",
] as const;

export const SHARED_OBJECTIVES = [
  "joint_advocacy",
  "research",
  "training",
  "community_outreach",
  "emergency_response",
  "election_operations",
  "fundraising",
  "legislative_initiatives",
  "technology",
  "education",
] as const;

export const REQUIRED_FEDERATION_SERVICES = [
  "FederationService",
  "MembershipService",
  "AgreementService",
  "SharedMissionService",
  "SharedKnowledgeService",
  "ResourceExchangeService",
  "MutualAidService",
  "FederationGovernanceService",
  "VotingService",
  "CrossInstitutionIdentityService",
  "FederationAnalyticsService",
  "FederationDirectoryService",
  "FederationSecurityService",
  "AIFederationAdvisorService",
] as const;

export const FEDERATION_COMMANDS = [
  "CreateFederation",
  "JoinFederation",
  "LeaveFederation",
  "CreateAgreement",
  "ApproveAgreement",
  "CreateSharedMission",
  "ShareKnowledge",
  "RequestMutualAid",
  "CreateCrossInstitutionTeam",
  "PublishFederationBriefing",
] as const;

export const FEDERATION_AI_MAY_NOT = [
  "Negotiate or approve agreements autonomously",
  "Exercise institutional authority across boundaries",
  "Override federation governance or voting outcomes",
  "Share data without explicit permission mapping",
  "Bypass signed agreement requirements",
] as const;

export function getFederationConstitution() {
  return {
    system_id: "OPS-001",
    build: "11.6",
    wave: "11.6-W12",
    governing_principle: OPS_FEDERATION_PRINCIPLE,
    architecture: [...FEDERATION_ARCHITECTURE],
    federation_types: [...FEDERATION_TYPES],
    governance_models: [...FEDERATION_GOVERNANCE_MODELS],
    agreement_types: [...AGREEMENT_TYPES],
    voting_methods: [...VOTING_METHODS],
    shared_objectives: [...SHARED_OBJECTIVES],
    required_services: [...REQUIRED_FEDERATION_SERVICES],
    commands: [...FEDERATION_COMMANDS],
    ai_may_not: [...FEDERATION_AI_MAY_NOT],
    api_namespace: "/api/v1/federations",
  };
}
