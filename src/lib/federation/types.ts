export type TemplateType =
  | "campus_organization"
  | "county_organization"
  | "state_organization"
  | "coalition"
  | "university"
  | "nonprofit"
  | "campaign"
  | "advocacy_organization"
  | "community_organization"
  | "educational_institution";

export type TemplateStatus = "draft" | "review" | "published" | "deprecated" | "archived";

export type FederationMembershipStatus =
  | "independent"
  | "federation_candidate"
  | "member"
  | "partner"
  | "strategic_partner"
  | "inactive"
  | "suspended";

export type FederationTrustLevel =
  | "no_trust"
  | "directory_only"
  | "shared_learning"
  | "shared_assets"
  | "operational_collaboration"
  | "delegated_operations";

export type ResourceVisibility = "institution_only" | "federation" | "public" | "licensed";

export type MarketplaceAssetStatus = "draft" | "review" | "approved" | "published" | "suspended";

export interface InstitutionTemplate {
  id: string;
  source_institution_id: string;
  name: string;
  description: string;
  version: string;
  template_type: TemplateType;
  supported_modules: string[];
  organization_model: Record<string, unknown>;
  training_model: Record<string, unknown>;
  playbooks: string[];
  workflows: string[];
  permissions: string[];
  default_dashboards: string[];
  recommended_settings: Record<string, unknown>;
  status: TemplateStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReplicationPackage {
  template_id: string;
  target_name: string;
  target_type: TemplateType;
  customization: Record<string, unknown>;
  exclude_personal_data: boolean;
  exclude_audit_history: boolean;
  exclude_private_comms: boolean;
}

export interface ReplicatedInstitution {
  id: string;
  template_id: string;
  source_institution_id: string;
  name: string;
  template_type: TemplateType;
  organization_ids: string[];
  workspace_ids: string[];
  replicated_modules: string[];
  status: "provisioned" | "customizing" | "active";
  created_at: string;
  activated_at: string | null;
}

export interface FederationMember {
  id: string;
  institution_id: string;
  institution_name: string;
  membership_status: FederationMembershipStatus;
  trust_level: FederationTrustLevel;
  agreement_id: string | null;
  joined_at: string | null;
  updated_at: string;
}

export interface FederationAgreement {
  id: string;
  institution_id: string;
  data_sharing: boolean;
  content_sharing: boolean;
  resource_sharing: boolean;
  ai_sharing: boolean;
  reporting: boolean;
  governance_accepted: boolean;
  privacy_accepted: boolean;
  signed_at: string;
}

export interface SharedResource {
  id: string;
  owner_institution_id: string;
  title: string;
  resource_type: "training" | "playbook" | "template" | "policy" | "mission" | "form" | "checklist" | "automation";
  version: string;
  license: string;
  visibility: ResourceVisibility;
  compatibility: string[];
  lineage_parent_id: string | null;
  status: "draft" | "published" | "forked";
  created_at: string;
  updated_at: string;
}

export interface KnowledgeContribution {
  id: string;
  institution_id: string;
  title: string;
  contribution_type: "lesson_learned" | "best_practice" | "case_study" | "research" | "metrics" | "success_story";
  summary: string;
  visibility: ResourceVisibility;
  approved: boolean;
  created_at: string;
}

export interface BenchmarkSnapshot {
  id: string;
  institution_id: string;
  anonymous_label: string;
  adoption_score: number;
  training_completion: number;
  mission_completion: number;
  volunteer_engagement: number;
  operational_maturity: number;
  growth_rate: number;
  updated_at: string;
}

export interface MarketplaceAsset {
  id: string;
  owner_institution_id: string;
  title: string;
  asset_type: "training" | "extension" | "template" | "integration" | "service" | "consulting" | "ai_agent";
  version: string;
  status: MarketplaceAssetStatus;
  governance_approved: boolean;
  published_at: string | null;
  created_at: string;
}

export interface FederationHealthSummary {
  member_count: number;
  published_templates: number;
  shared_resources: number;
  knowledge_contributions: number;
  marketplace_assets: number;
  collaboration_events: number;
  isolation_verified: boolean;
  updated_at: string;
}

export interface FederationAuditEvent {
  id: string;
  institution_id: string;
  actor_id: string;
  action: string;
  target_type: string;
  target_id: string;
  result: "success" | "failure";
  timestamp: string;
  metadata?: Record<string, unknown>;
}
