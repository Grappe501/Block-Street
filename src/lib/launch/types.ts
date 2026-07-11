export type ProvisioningStatus =
  | "requested"
  | "reviewed"
  | "approved"
  | "provisioning"
  | "configuration_required"
  | "data_readiness"
  | "pilot"
  | "launch_ready"
  | "active"
  | "rejected"
  | "paused"
  | "restricted"
  | "suspended"
  | "archived";

export type InstitutionType =
  | "campus"
  | "campus_network"
  | "civic_education"
  | "statewide"
  | "county"
  | "coalition"
  | "nonprofit"
  | "advocacy"
  | "volunteer_network"
  | "training_institution"
  | "student_leadership"
  | "campaign"
  | "other";

export type RiskClassification = "low" | "moderate" | "high" | "critical";

export interface InstitutionProvisioning {
  id: string;
  institution_name: string;
  institution_type: InstitutionType;
  requesting_user: string;
  executive_owner: string;
  technical_owner: string;
  security_owner: string;
  primary_administrator: string;
  requested_modules: string[];
  deployment_model: string;
  data_region: string;
  default_timezone: string;
  launch_target: string | null;
  status: ProvisioningStatus;
  risk_classification: RiskClassification;
  configuration_template_id: string | null;
  provisioning_package: string[];
  created_at: string;
  approved_at: string | null;
  activated_at: string | null;
  updated_at: string;
  audit_notes: string[];
}

export interface ConfigurationTemplate {
  id: string;
  name: string;
  institution_type: InstitutionType | string;
  status: "draft" | "active" | "archived";
  description?: string;
}

export interface LaunchFeatureFlags {
  ILS_PLATFORM_ENABLED: boolean;
  PROVISIONING_WORKFLOW_ENABLED: boolean;
  MIGRATION_STAGING_REQUIRED: boolean;
  ONBOARDING_JOURNEYS_ENABLED: boolean;
  TRAINING_CERTIFICATION_ENABLED: boolean;
  PILOT_OBSERVATION_ENABLED: boolean;
  SUPPORT_REQUESTS_ENABLED: boolean;
  ADOPTION_DASHBOARD_ENABLED: boolean;
}

export interface LaunchOverview {
  phase_status: string;
  steps_complete: number;
  steps_total: number;
  provisioning_total: number;
  provisioning_active: number;
  provisioning_in_pipeline: number;
  configuration_templates: number;
  launch_readiness_score: number;
  human_help_count_avg: number;
  open_support_issues: number;
}

export interface CreateProvisioningInput {
  institution_name: string;
  institution_type: InstitutionType;
  requesting_user: string;
  executive_owner: string;
  technical_owner: string;
  security_owner: string;
  primary_administrator: string;
  requested_modules?: string[];
  deployment_model?: string;
  data_region?: string;
  default_timezone?: string;
  launch_target?: string | null;
  risk_classification?: RiskClassification;
  configuration_template_id?: string | null;
}
