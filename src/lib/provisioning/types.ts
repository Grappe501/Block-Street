export type RequestStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "changes_requested"
  | "approved"
  | "rejected"
  | "withdrawn"
  | "expired";

export type ProvisioningLifecycleStatus =
  | "requested"
  | "under_review"
  | "approved"
  | "provisioning"
  | "validation"
  | "provisioned"
  | "configuration_required"
  | "data_readiness"
  | "pilot"
  | "launch_ready"
  | "active"
  | "rejected"
  | "paused"
  | "restricted"
  | "suspended"
  | "archived"
  | "decommissioning";

export type RiskLevel = "P1" | "P2" | "P3" | "P4";

export type OwnerType =
  | "executive"
  | "administrative"
  | "security"
  | "data"
  | "support";

export type ValidationStatus = "passed" | "passed_with_warnings" | "blocked" | "failed";

export interface Institution {
  id: string;
  public_id: string;
  name: string;
  legal_name_optional: string | null;
  display_name: string;
  institution_type: string;
  status: ProvisioningLifecycleStatus;
  primary_domain_optional: string | null;
  primary_contact_user_id: string;
  executive_owner_user_id: string | null;
  administrative_owner_user_id: string | null;
  security_owner_user_id: string | null;
  data_owner_user_id: string | null;
  support_owner_user_id: string | null;
  default_timezone: string;
  default_locale: string;
  data_region: string;
  retention_policy_id: string;
  security_policy_id: string;
  notification_policy_id: string;
  deployment_model: string;
  launch_stage: ProvisioningLifecycleStatus;
  template_id: string | null;
  template_version: string | null;
  request_id: string | null;
  organization_id: string | null;
  progress_percent: number;
  checkpoint: string | null;
  created_at: string;
  approved_at_optional: string | null;
  activated_at_optional: string | null;
  suspended_at_optional: string | null;
  archived_at_optional: string | null;
}

export interface InstitutionProvisioningRequest {
  id: string;
  requested_name: string;
  institution_type: string;
  requesting_user_id: string;
  sponsoring_organization_optional: string | null;
  purpose: string;
  intended_users: number;
  intended_regions: string[];
  requested_modules: string[];
  anticipated_data_types: string[];
  requested_integrations: string[];
  target_launch_date: string | null;
  executive_sponsor: string;
  security_contact: string;
  support_contact: string;
  data_owner_contact: string;
  administrative_owner_contact: string;
  risk_notes: string;
  status: RequestStatus;
  risk_level: RiskLevel | null;
  template_id: string | null;
  institution_id: string | null;
  duplicate_review_required: boolean;
  created_at: string;
  submitted_at: string | null;
  updated_at: string;
}

export interface ProvisioningRiskAssessment {
  id: string;
  request_id: string;
  risk_level: RiskLevel;
  risk_factors: string[];
  required_controls: string[];
  required_approvals: string[];
  required_training: string[];
  required_security_review: boolean;
  required_data_review: boolean;
  recommended_template: string;
  reviewed_by: string;
  reviewed_at: string;
}

export interface InstitutionOwnerAssignment {
  id: string;
  institution_id: string;
  owner_type: OwnerType;
  user_id: string;
  starts_at: string;
  expires_at_optional: string | null;
  assigned_by: string;
  approved_by_optional: string | null;
  status: "active" | "expired" | "revoked";
}

export interface InstitutionWorkspace {
  id: string;
  institution_id: string;
  key: string;
  name: string;
  type: string;
  purpose: string;
  owner_user_id: string | null;
  owner_role: string;
  module_access: string[];
  security_scope: string;
  data_classification: string;
  launch_state: string;
  status: "created" | "failed" | "pending";
}

export interface InstitutionModule {
  id: string;
  institution_id: string;
  module_key: string;
  status: "not_requested" | "approved" | "provisioned" | "pilot_only" | "active" | "restricted" | "suspended" | "retired";
  activation_stage: string;
  feature_flag_reference: string | null;
  approved_by: string | null;
  activated_at_optional: string | null;
}

export interface InstitutionSecurityProfile {
  id: string;
  institution_id: string;
  baseline_version: string;
  baseline_id: string;
  mfa_policy: string;
  session_policy: string;
  export_policy: string;
  integration_policy: string;
  ai_policy: string;
  status: "applied" | "failed";
  applied_at: string;
}

export interface InstitutionDeploymentProfile {
  id: string;
  institution_id: string;
  deployment_model: string;
  application_targets: string[];
  database_target: string;
  storage_target: string;
  environment_ids: string[];
  domain_configuration: Record<string, string>;
  release_channel: string;
  status: "configured" | "pending";
}

export interface ProvisioningValidation {
  id: string;
  institution_id: string;
  template_version: string;
  checks_total: number;
  checks_passed: number;
  checks_failed: number;
  warnings: string[];
  blocking_issues: string[];
  status: ValidationStatus;
  validated_at: string;
  validated_by: string;
}

export interface ProvisioningAuditEvent {
  id: string;
  institution_id: string | null;
  request_id_optional: string | null;
  actor_id: string;
  action: string;
  target_type: string;
  target_id_optional: string | null;
  previous_state: string | null;
  new_state: string | null;
  reason: string | null;
  timestamp: string;
  correlation_id: string;
  result: "success" | "failure" | "denied";
}

export interface ProvisioningCheckpoint {
  institution_id: string;
  step: string;
  completed_steps: string[];
  paused: boolean;
  updated_at: string;
}

export interface ProvisioningHealth {
  requests_under_review: number;
  active_provisioning_jobs: number;
  average_provisioning_time_minutes: number;
  blocked_institutions: number;
  validation_success_rate: number;
  manual_interventions: number;
  template_coverage_percent: number;
  security_baseline_failures: number;
}

export interface ProvisioningAttentionItem {
  severity: "blocking" | "warning";
  category: string;
  message: string;
  institution_id: string;
  institution_name: string;
}

export interface CreateRequestInput {
  requested_name: string;
  institution_type: string;
  requesting_user_id: string;
  purpose: string;
  intended_users?: number;
  intended_regions?: string[];
  requested_modules?: string[];
  anticipated_data_types?: string[];
  requested_integrations?: string[];
  target_launch_date?: string | null;
  executive_sponsor: string;
  security_contact: string;
  support_contact: string;
  data_owner_contact: string;
  administrative_owner_contact: string;
  risk_notes?: string;
  sponsoring_organization_optional?: string | null;
}

export interface InstitutionTypeRecord {
  id: string;
  key: string;
  name: string;
  description: string;
  default_template_id: string;
  default_security_profile: string;
  default_module_set: string[];
  status: string;
}

export interface ProvisioningTemplate {
  id: string;
  name: string;
  institution_type: string;
  version: string;
  description: string;
  status: string;
  default_roles: string[];
  default_workspaces: Array<{ key: string; name: string; type: string; purpose: string; owner_role: string }>;
  default_modules: Array<{ key: string; status: string }>;
  default_feature_flags: Record<string, string>;
  default_security_policy: string;
}
