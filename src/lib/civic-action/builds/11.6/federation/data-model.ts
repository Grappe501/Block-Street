/**
 * CAE-11.6-W12 — Federation & network operations data model
 */
import type {
  AGREEMENT_TYPES,
  FEDERATION_GOVERNANCE_MODELS,
  FEDERATION_LIFECYCLE,
  FEDERATION_TYPES,
  SHARED_OBJECTIVES,
  VOTING_METHODS,
} from "./constitution";

export type FederationType = (typeof FEDERATION_TYPES)[number];
export type FederationGovernanceModel = (typeof FEDERATION_GOVERNANCE_MODELS)[number];
export type FederationLifecycle = (typeof FEDERATION_LIFECYCLE)[number];
export type AgreementType = (typeof AGREEMENT_TYPES)[number];
export type VotingMethod = (typeof VOTING_METHODS)[number];
export type SharedObjective = (typeof SHARED_OBJECTIVES)[number];

export interface FederationProfileRecord {
  federation_id: string;
  name: string;
  description: string;
  purpose: string;
  federation_type: FederationType;
  governance_model: FederationGovernanceModel;
  status: FederationLifecycle;
  charter: {
    mission: string;
    vision: string;
    shared_principles: string[];
    membership_rules: string;
    voting_rules: string;
    resource_sharing: string;
    data_policies: string;
    exit_procedures: string;
  };
  participating_institutions: string[];
  visibility: "private" | "members_only" | "public";
  membership_policy: string;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface FederationMembershipRecord {
  membership_id: string;
  institution_id: string;
  federation_id: string;
  membership_type: "full" | "associate" | "observer" | "partner";
  authority_level: "voting" | "advisory" | "executive" | "observer";
  voting_rights: boolean;
  resource_sharing: boolean;
  knowledge_sharing: boolean;
  start_date: string;
  end_date: string | null;
  status: "active" | "suspended" | "ended";
}

export interface FederationAgreementRecord {
  agreement_id: string;
  federation_id: string;
  agreement_type: AgreementType;
  title: string;
  parties: string[];
  terms: string;
  status: "draft" | "pending" | "signed" | "expired" | "revoked";
  version: number;
  signed_by: string[];
  signed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface FederationSharedMissionRecord {
  shared_mission_id: string;
  federation_id: string;
  mission_id: string;
  title: string;
  lead_institution_id: string;
  supporting_institution_ids: string[];
  mission_owners: string[];
  funding_sources: string[];
  shared_resources: string[];
  decision_authority: string;
  reporting_structure: string;
  shared_objectives: SharedObjective[];
  status: "active" | "completed" | "suspended";
  created_at: string;
}

export interface FederationKnowledgeShareRecord {
  share_id: string;
  federation_id: string;
  institution_id: string;
  knowledge_type: "policy" | "training" | "research" | "best_practice" | "lesson" | "template" | "playbook";
  title: string;
  permission_scope: string[];
  shared_at: string;
  shared_by: string;
}

export interface FederationResourceExchangeRecord {
  exchange_id: string;
  federation_id: string;
  from_institution_id: string;
  to_institution_id: string;
  resource_type: "equipment" | "facilities" | "volunteers" | "experts" | "vehicles" | "training" | "technology" | "funding";
  description: string;
  status: "proposed" | "approved" | "fulfilled" | "declined";
  policy_reference: string;
  created_at: string;
}

export interface FederationMutualAidRecord {
  aid_id: string;
  federation_id: string;
  requesting_institution_id: string;
  aid_type: "personnel" | "resources" | "facilities" | "communications" | "technology" | "training" | "experts";
  description: string;
  status: "requested" | "fulfilled" | "declined";
  requested_by: string;
  created_at: string;
}

export interface FederationVoteRecord {
  vote_id: string;
  federation_id: string;
  proposal: string;
  voting_method: VotingMethod;
  votes_for: number;
  votes_against: number;
  abstentions: number;
  outcome: "passed" | "failed" | "pending";
  recorded_at: string;
}

export interface CrossInstitutionTeamRecord {
  team_id: string;
  federation_id: string;
  name: string;
  members: { human_id: string; institution_id: string; authority: string; mission_scope: string; expires_at: string | null }[];
  status: "active" | "dissolved";
  created_at: string;
}

export interface FederationCapabilityRecord {
  capability_id: string;
  institution_id: string;
  federation_id: string;
  competencies: string[];
  resources: string[];
  facilities: string[];
  training: string[];
  technology: string[];
  languages: string[];
  special_expertise: string[];
  updated_at: string;
}

export interface FederationBriefingRecord {
  briefing_id: string;
  federation_id: string;
  title: string;
  institution_summaries: { institution_id: string; summary: string }[];
  shared_missions: number;
  strategic_progress: string;
  regional_risks: string[];
  ai_summary: string;
  advisory_only: true;
  generated_at: string;
}

export const FEDERATION_STORE_KEYS = {
  profiles: "ops_federation_profiles",
  memberships: "ops_federation_memberships",
  agreements: "ops_federation_agreements",
  shared_missions: "ops_federation_joint_missions",
  knowledge_shares: "ops_federation_knowledge_shares",
  resource_exchanges: "ops_federation_resource_exchanges",
  mutual_aid: "ops_federation_mutual_aid",
  votes: "ops_federation_votes",
  teams: "ops_federation_teams",
  capabilities: "ops_federation_capabilities",
  briefings: "ops_federation_briefings",
} as const;
