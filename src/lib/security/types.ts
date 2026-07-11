export type SecurityRiskLevel = "low" | "moderate" | "high" | "critical";
export type IncidentSeverity = "SEV-1" | "SEV-2" | "SEV-3" | "SEV-4";
export type DataClassificationLevel = "public" | "internal" | "confidential" | "restricted" | "highly_restricted";
export type VulnerabilitySeverity = "informational" | "low" | "moderate" | "high" | "critical";

export interface SecurityRisk {
  id: string;
  title: string;
  description: string;
  risk_domain: string;
  likelihood: string;
  impact: string;
  inherent_risk: SecurityRiskLevel;
  controls: string[];
  residual_risk: SecurityRiskLevel;
  owner: string;
  status: string;
  review_date: string;
  mitigation_plan?: string;
}

export interface ThreatModel {
  id: string;
  system: string;
  scope: string;
  assets: string[];
  trust_boundaries: string[];
  threats: string[];
  controls: string[];
  open_risks: string[];
  owner: string;
  reviewed_at: string;
  next_review_at: string;
}

export interface DataClassification {
  id: string;
  classification_key: string;
  name: string;
  description: string;
  level: DataClassificationLevel;
  access_requirements: string;
  encryption_requirements: string;
  export_requirements: string;
  retention_requirements: string;
}

export interface SecurityEvent {
  id: string;
  event_type: string;
  severity: SecurityRiskLevel;
  actor_id?: string;
  organization_id?: string;
  source: string;
  target?: string;
  detected_at: string;
  status: string;
  correlation_id?: string;
  incident_id?: string;
}

export interface SecurityIncident {
  id: string;
  title: string;
  severity: IncidentSeverity;
  status: string;
  detected_at: string;
  incident_commander?: string;
  affected_services: string[];
  affected_organizations: string[];
  containment_actions: string[];
  recovery_actions: string[];
  closed_at?: string;
}

export interface Vulnerability {
  id: string;
  source: string;
  component: string;
  severity: VulnerabilitySeverity;
  description: string;
  detected_at: string;
  owner: string;
  status: string;
  due_at?: string;
  mitigation?: string;
  fixed_at?: string;
}

export interface AccessReview {
  id: string;
  scope: string;
  review_type: string;
  started_at: string;
  completed_at?: string;
  reviewer?: string;
  assignments_reviewed: number;
  assignments_removed: number;
  status: string;
}

export interface DataAsset {
  id: string;
  name: string;
  domain: string;
  owner: string;
  classification: DataClassificationLevel;
  purpose: string;
  retention_policy: string;
}

export interface PrivacyRequest {
  id: string;
  request_type: string;
  requesting_user_id: string;
  subject_user_id: string;
  organization_id?: string;
  status: string;
  submitted_at: string;
  completed_at?: string;
}

export interface ExportManifest {
  id: string;
  requested_by: string;
  organization_id: string;
  resource_type: string;
  classification: DataClassificationLevel;
  reason: string;
  approval_id?: string;
  generated_at: string;
  expires_at: string;
  download_count: number;
  status: string;
}

export interface BackupRecord {
  id: string;
  system: string;
  frequency: string;
  retention: string;
  encrypted: boolean;
  last_success_at: string;
  status: string;
  rpo_hours: number;
  rto_hours: number;
}

export interface RecoveryTest {
  id: string;
  system: string;
  backup_reference: string;
  started_at: string;
  completed_at?: string;
  result: string;
  recovery_time_minutes?: number;
  owner: string;
}

export interface SecurityPosture {
  posture_score: number;
  critical_incidents: number;
  high_risk_alerts: number;
  admins_without_mfa: number;
  open_vulnerabilities: number;
  critical_vulnerabilities: number;
  unreviewed_exports: number;
  access_reviews_due: number;
  backup_status: string;
  last_restore_test: string;
  break_glass_events: number;
}

export interface SecurityFeatureFlags {
  SECURITY_PLATFORM_ENABLED: boolean;
  SECURITY_MFA_ENFORCEMENT_ENABLED: boolean;
  SECURITY_STEP_UP_AUTH_ENABLED: boolean;
  SECURITY_ACCESS_REVIEWS_ENABLED: boolean;
  SECURITY_DATA_CLASSIFICATION_ENABLED: boolean;
  SECURITY_EXPORT_APPROVALS_ENABLED: boolean;
  SECURITY_SECRET_SCANNING_ENABLED: boolean;
  SECURITY_AI_TOOL_GATEWAY_REQUIRED: boolean;
  SECURITY_INCIDENT_AUTOMATION_ENABLED: boolean;
  SECURITY_BACKUP_VERIFICATION_ENABLED: boolean;
}
