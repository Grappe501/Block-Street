/**
 * CAE-11.6-W4 — Organizational Structure & Federation Constitution (OPS-001)
 */
export const OPS_ORGANIZATION_PRINCIPLE =
  "Institutions are collections of accountable Humans working through defined organizational structures—not collections of permissions.";

export const ORGANIZATIONAL_ARCHITECTURE = [
  "federation",
  "institution",
  "division",
  "region",
  "department",
  "office",
  "team",
  "working_group",
  "committee",
  "mission_team",
  "human",
] as const;

export const INSTITUTION_TYPES = [
  "business",
  "nonprofit",
  "political_campaign",
  "political_party",
  "school",
  "university",
  "government_agency",
  "faith_organization",
  "trade_association",
  "coalition",
  "volunteer_organization",
  "community_group",
  "professional_association",
  "private_organization",
] as const;

export const ORGANIZATION_UNIT_TYPES = [
  "division",
  "department",
  "office",
  "branch",
  "region",
  "district",
  "county",
  "campus",
  "team",
  "committee",
  "working_group",
  "task_force",
  "mission_team",
] as const;

export const GOVERNANCE_MODELS = [
  "executive",
  "board",
  "committee",
  "consensus",
  "hybrid",
  "delegated",
  "representative",
  "custom",
] as const;

export const VISIBILITY_LEVELS = [
  "public",
  "institution",
  "department",
  "team",
  "mission",
  "restricted",
  "executive_only",
] as const;

export const COLLABORATION_RELATIONSHIPS = [
  "partner",
  "vendor",
  "coalition_member",
  "sponsor",
  "client",
  "affiliate",
  "observer",
  "joint_operations",
] as const;

export const ORGANIZATION_LIFECYCLE = [
  "proposed",
  "planning",
  "active",
  "merged",
  "split",
  "archived",
  "dissolved",
] as const;

export const REQUIRED_ORGANIZATION_SERVICES = [
  "FederationService",
  "InstitutionService",
  "OrganizationUnitService",
  "GovernanceService",
  "AuthorityService",
  "LeadershipService",
  "MembershipService",
  "ReportingStructureService",
  "CollaborationService",
  "SharedMissionService",
  "OrganizationHealthService",
  "SuccessionPlanningService",
  "BrandingService",
  "AIOrganizationAdvisorService",
] as const;

export const ORGANIZATION_COMMANDS = [
  "CreateInstitution",
  "CreateOrganizationUnit",
  "AssignLeadership",
  "DelegateAuthority",
  "JoinOrganization",
  "LeaveOrganization",
  "MergeOrganizations",
  "SplitOrganization",
  "CreateFederation",
  "JoinFederation",
  "ApproveGovernanceDecision",
  "RecordVote",
] as const;

export const ORGANIZATION_AI_MAY_NOT = [
  "Change organizational structure autonomously",
  "Assign authority without Human approval",
  "Merge or dissolve organizations without governance process",
  "Override institutional autonomy in federations",
] as const;

export function getOrganizationConstitution() {
  return {
    system_id: "OPS-001",
    build: "11.6",
    wave: "11.6-W4",
    governing_principle: OPS_ORGANIZATION_PRINCIPLE,
    architecture: [...ORGANIZATIONAL_ARCHITECTURE],
    institution_types: [...INSTITUTION_TYPES],
    governance_models: [...GOVERNANCE_MODELS],
    required_services: [...REQUIRED_ORGANIZATION_SERVICES],
    commands: [...ORGANIZATION_COMMANDS],
    ai_may_not: [...ORGANIZATION_AI_MAY_NOT],
    api_namespace: "/api/v1/operations",
    legacy_institutions_note: "Legacy institution provisioning remains at /api/v1/institutions/*",
  };
}
