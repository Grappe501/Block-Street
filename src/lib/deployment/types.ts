export type DeploymentEnvironment = "local" | "test" | "preview" | "staging" | "production";
export type ReleaseRiskLevel = "R1" | "R2" | "R3" | "R4";
export type ReleaseState =
  | "draft"
  | "validation_pending"
  | "validation_failed"
  | "ready_for_preview"
  | "preview_active"
  | "staging_ready"
  | "awaiting_approval"
  | "approved"
  | "deploying"
  | "verification"
  | "healthy"
  | "completed"
  | "rejected"
  | "cancelled"
  | "failed"
  | "rolled_back"
  | "degraded"
  | "emergency_hotfix";

export type ApprovalRole = "technical" | "operations" | "security" | "release_manager";

export interface DeploymentEnvironmentRecord {
  id: string;
  name: DeploymentEnvironment;
  application_id: string;
  url?: string;
  release_version?: string;
  commit_sha?: string;
  build_id?: string;
  deployment_id?: string;
  deployed_at?: string;
  region: string;
  configuration_version: string;
  status: "operational" | "degraded" | "unavailable";
  banner?: string;
}

export interface BuildArtifact {
  id: string;
  application_id: string;
  version: string;
  commit_sha: string;
  build_id: string;
  checksum: string;
  created_at: string;
  runtime: string;
  dependency_lock_hash: string;
  storage_reference: string;
  status: "valid" | "invalid" | "promoted";
}

export interface ReleaseCandidate {
  id: string;
  version: string;
  commit_sha: string;
  build_artifact_id: string;
  configuration_version: string;
  database_migration_set: string[];
  feature_flags: Record<string, boolean>;
  created_at: string;
  created_by: string;
  status: ReleaseState;
  risk_level: ReleaseRiskLevel;
}

export interface ReleaseApproval {
  id: string;
  release_id: string;
  role: ApprovalRole;
  approver_id: string;
  approver_name: string;
  status: "pending" | "approved" | "rejected";
  approved_at?: string;
  notes?: string;
}

export interface ReleaseManifest {
  id: string;
  release_version: string;
  application_ids: string[];
  artifact_ids: string[];
  commit_shas: string[];
  environment: DeploymentEnvironment;
  configuration_versions: string[];
  database_migrations: string[];
  feature_flags: Record<string, boolean>;
  change_summary: string;
  risk_level: ReleaseRiskLevel;
  created_by: string;
  approved_by: string[];
  started_at: string;
  completed_at?: string;
  status: ReleaseState;
  rollback_reference?: string;
}

export interface DatabaseMigration {
  id: string;
  migration_key: string;
  application_id: string;
  version: string;
  description: string;
  risk_level: ReleaseRiskLevel;
  status: "pending" | "staging_passed" | "approved" | "executing" | "completed" | "failed";
  created_by: string;
  staging_result?: string;
  production_started_at?: string;
  production_completed_at?: string;
  rollback_reference?: string;
  verification_result?: string;
}

export interface PreviewEnvironment {
  id: string;
  branch: string;
  commit_sha: string;
  pull_request?: string;
  url: string;
  build_status: "building" | "ready" | "failed" | "expired";
  expires_at: string;
  environment: "preview";
  banner: string;
}

export interface ConfigDriftWarning {
  id: string;
  environment_id: string;
  variable: string;
  documented: string;
  actual: string;
  severity: "warning" | "critical";
  detected_at: string;
}

export interface DeploymentAuditEvent {
  id: string;
  actor_id: string;
  release_id?: string;
  deployment_id?: string;
  environment: DeploymentEnvironment;
  action: string;
  risk_level?: ReleaseRiskLevel;
  previous_state?: string;
  new_state?: string;
  reason?: string;
  timestamp: string;
  correlation_id: string;
  result: "success" | "failure" | "denied";
}

export interface DeploymentOverview {
  production_version: string;
  last_deployment_status: string;
  pending_release_candidates: number;
  preview_environments: number;
  staging_status: string;
  failed_deployments_this_week: number;
  pending_migrations: number;
  configuration_drift_warnings: number;
  rollback_readiness: string;
  deployments_this_month: number;
  success_rate: number;
  change_failure_rate: number;
  average_build_time_minutes: number;
  mean_time_to_recovery_minutes: number;
}

export interface SmokeTestResult {
  name: string;
  passed: boolean;
  message: string;
}

export interface DeploymentFeatureFlags {
  DEPLOYMENT_PIPELINE_ENABLED: boolean;
  DEPLOYMENT_PREVIEW_REQUIRED: boolean;
  DEPLOYMENT_STAGING_REQUIRED: boolean;
  DEPLOYMENT_APPROVALS_REQUIRED: boolean;
  DEPLOYMENT_SMOKE_TESTS_REQUIRED: boolean;
  DEPLOYMENT_MIGRATION_GATES_ENABLED: boolean;
  DEPLOYMENT_RELEASE_MANIFEST_ENABLED: boolean;
}
