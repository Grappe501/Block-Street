/**
 * CAE-11.6-W4 — Organization & federation data model
 */
import type {
  COLLABORATION_RELATIONSHIPS,
  GOVERNANCE_MODELS,
  INSTITUTION_TYPES,
  ORGANIZATION_LIFECYCLE,
  ORGANIZATION_UNIT_TYPES,
  VISIBILITY_LEVELS,
} from "./constitution";

export type InstitutionType = (typeof INSTITUTION_TYPES)[number];
export type OrganizationUnitType = (typeof ORGANIZATION_UNIT_TYPES)[number];
export type GovernanceModel = (typeof GOVERNANCE_MODELS)[number];
export type VisibilityLevel = (typeof VISIBILITY_LEVELS)[number];
export type CollaborationRelationship = (typeof COLLABORATION_RELATIONSHIPS)[number];
export type OrganizationLifecycle = (typeof ORGANIZATION_LIFECYCLE)[number];

export interface FederationRecord {
  federation_id: string;
  name: string;
  description: string;
  status: OrganizationLifecycle;
  created_at: string;
}

export interface OpsInstitutionRecord {
  institution_id: string;
  federation_id: string | null;
  legal_name: string;
  public_name: string;
  short_name: string;
  institution_type: InstitutionType;
  status: OrganizationLifecycle;
  primary_language: string;
  secondary_languages: string[];
  time_zone: string;
  jurisdiction: string;
  mission_statement: string;
  vision_statement: string;
  website: string | null;
  governance_model: GovernanceModel;
  branding: { primary_color: string; logo_uri: string | null };
  created_at: string;
  updated_at: string;
}

export interface OrganizationUnitRecord {
  organization_unit_id: string;
  institution_id: string;
  parent_unit_id: string | null;
  unit_type: OrganizationUnitType;
  name: string;
  description: string;
  manager_human_id: string | null;
  executive_owner_human_id: string | null;
  status: OrganizationLifecycle;
  visibility: VisibilityLevel;
  created_at: string;
}

export interface AuthorityRecord {
  authority_id: string;
  institution_id: string;
  organization_unit_id: string;
  authority_scope: string;
  delegation_allowed: boolean;
  approval_required: boolean;
  expiration: string | null;
  assigned_human_id: string;
  assigned_role: string;
}

export interface OrgMembershipRecord {
  membership_id: string;
  human_id: string;
  institution_id: string;
  organization_unit_id: string;
  role: string;
  start_date: string;
  end_date: string | null;
  status: "active" | "ended" | "suspended";
  primary_membership: boolean;
  leadership_flag: boolean;
}

export interface ReportingRelationshipRecord {
  relationship_id: string;
  human_id: string;
  relates_to_human_id: string;
  relationship_type: "reports_to" | "mentors" | "supports" | "coordinates_with" | "advises" | "temporary_assignment";
  organization_unit_id: string | null;
}

export interface CollaborationRecord {
  collaboration_id: string;
  from_institution_id: string;
  to_institution_id: string;
  relationship_type: CollaborationRelationship;
  status: "proposed" | "active" | "ended";
  created_at: string;
}

export interface SharedMissionRecord {
  shared_mission_id: string;
  mission_id: string;
  primary_institution_id: string;
  supporting_institution_ids: string[];
  lead_organization_unit_id: string;
  funding_institution_id: string | null;
  approval_institution_id: string | null;
}

export interface GovernanceDecisionRecord {
  decision_id: string;
  institution_id: string;
  organization_unit_id: string;
  meeting_reference: string;
  proposal: string;
  vote_type: "simple_majority" | "super_majority" | "consensus" | "weighted" | "board" | "committee" | "custom";
  decision: string;
  authority_id: string;
  effective_date: string;
  recorded_by: string;
  recorded_at: string;
}

export interface OrganizationHealthRecord {
  health_id: string;
  institution_id: string;
  leadership_coverage: number;
  vacancies: number;
  mission_completion_rate: number;
  volunteer_activity_score: number;
  certification_coverage: number;
  succession_readiness: number;
  computed_at: string;
}

export const ORGANIZATION_STORE_KEYS = {
  federations: "ops_federations",
  institutions: "ops_institutions",
  organization_units: "ops_organization_units",
  authorities: "ops_authorities",
  memberships: "ops_org_memberships",
  reporting_relationships: "ops_reporting_relationships",
  collaborations: "ops_collaborations",
  shared_missions: "ops_shared_missions",
  governance_decisions: "ops_governance_decisions",
  organization_health: "ops_organization_health",
} as const;
