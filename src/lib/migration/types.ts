export type MigrationProjectStatus =
  | "draft"
  | "inventory"
  | "source_review"
  | "mapping"
  | "staging"
  | "validation"
  | "dry_run"
  | "exception_review"
  | "approval"
  | "importing"
  | "reconciliation"
  | "readiness_review"
  | "certified"
  | "closed"
  | "changes_requested"
  | "paused"
  | "blocked"
  | "failed"
  | "cancelled"
  | "rolled_back"
  | "quarantined"
  | "archive_only";

export type MigrationRiskLevel = "M1" | "M2" | "M3" | "M4";

export type SourceStatus =
  | "identified"
  | "access_pending"
  | "received"
  | "validated"
  | "rejected"
  | "incomplete"
  | "duplicate_source"
  | "archive_only"
  | "approved_for_staging";

export type StagingZone = "raw" | "normalized" | "mapped" | "validated" | "exception" | "approved" | "rejected" | "quarantine";

export type IdentityMatchStatus =
  | "verified_match"
  | "probable_match"
  | "possible_match"
  | "no_match"
  | "duplicate_identity_risk"
  | "conflicting_identity"
  | "historical_actor_only"
  | "cannot_resolve";

export type DuplicateStatus =
  | "no_duplicate"
  | "exact_duplicate"
  | "probable_duplicate"
  | "possible_duplicate"
  | "related_distinct"
  | "merged"
  | "rejected_duplicate"
  | "review_required";

export type ConsentMigrationState =
  | "verified_consent"
  | "consent_recorded_unverified"
  | "transactional_only"
  | "no_marketing_consent"
  | "no_sms_consent"
  | "consent_unknown"
  | "consent_revoked"
  | "do_not_import_outreach";

export type ValidationSeverity = "info" | "warning" | "error" | "blocking";

export type DataReadinessStatus = "ready" | "ready_with_conditions" | "pilot_only" | "archive_only" | "needs_remediation" | "blocked";

export type ImportJobStatus = "queued" | "running" | "paused" | "completed" | "completed_with_exceptions" | "failed" | "rolled_back" | "quarantined";

export interface MigrationProject {
  id: string;
  institution_id: string;
  name: string;
  description: string;
  migration_type: string;
  source_summary: string;
  target_domains: string[];
  migration_owner_user_id: string;
  data_owner_user_id: string;
  security_reviewer_user_id: string;
  institution_approver_user_id: string;
  target_launch_stage: string;
  risk_level: MigrationRiskLevel;
  status: MigrationProjectStatus;
  created_at: string;
  started_at_optional: string | null;
  completed_at_optional: string | null;
}

export interface MigrationRiskAssessment {
  id: string;
  migration_project_id: string;
  risk_level: MigrationRiskLevel;
  risk_factors: string[];
  required_reviews: string[];
  required_approvals: string[];
  required_dry_runs: number;
  rollback_requirement: boolean;
  reviewed_by: string;
  reviewed_at: string;
}

export interface MigrationSource {
  id: string;
  migration_project_id: string;
  name: string;
  source_type: string;
  source_system: string;
  source_owner_user_id: string | null;
  source_location_reference: string;
  source_format: string;
  estimated_record_count: number;
  estimated_file_count: number;
  contains_personal_data: boolean;
  contains_restricted_data: boolean;
  access_method: string;
  status: SourceStatus;
}

export interface MigrationIntake {
  id: string;
  migration_project_id: string;
  migration_source_id: string;
  uploaded_by: string;
  storage_reference: string;
  original_filename: string;
  content_hash: string;
  size: number;
  mime_type: string;
  scan_status: "pending" | "passed" | "failed" | "quarantined";
  classification: string;
  received_at: string;
  status: "received" | "processed" | "quarantined" | "rejected";
}

export interface MigrationFieldMapping {
  id: string;
  migration_project_id: string;
  source_id: string;
  source_field: string;
  target_entity_type: string;
  target_field: string;
  transformation_rule: string;
  validation_rule: string;
  required: boolean;
  classification: string;
  conflict_strategy: string;
  version: number;
  approved_by: string | null;
}

export interface MigrationStagingRecord {
  id: string;
  migration_project_id: string;
  migration_source_id: string;
  source_record_key: string;
  staging_zone: StagingZone;
  canonical_entity_type: string | null;
  normalized_payload: Record<string, unknown>;
  mapped_payload: Record<string, unknown> | null;
  validation_status: string;
  identity_resolution_status: IdentityMatchStatus;
  duplicate_status: DuplicateStatus;
  organization_mapping_status: string;
  classification: string;
  consent_state: ConsentMigrationState;
  review_status: string;
  approval_status: string;
  import_status: string;
  created_at: string;
  updated_at: string;
}

export interface MigrationIdentityMatch {
  id: string;
  migration_project_id: string;
  staging_record_id: string;
  candidate_user_id: string | null;
  match_status: IdentityMatchStatus;
  match_score: number | null;
  match_signals: string[];
  conflicting_signals: string[];
  reviewed_by: string | null;
  review_decision: string | null;
}

export interface MigrationDuplicateCandidate {
  id: string;
  migration_project_id: string;
  entity_type: string;
  staging_record_ids: string[];
  match_signals: string[];
  confidence: number;
  status: DuplicateStatus;
  resolution: string | null;
}

export interface MigrationException {
  id: string;
  migration_project_id: string;
  staging_record_id: string | null;
  exception_type: string;
  severity: ValidationSeverity;
  description: string;
  suggested_actions: string[];
  assigned_to: string | null;
  status: "open" | "assigned" | "under_review" | "resolved" | "escalated" | "rejected";
  resolution: string | null;
  created_at: string;
  resolved_at: string | null;
}

export interface MigrationDryRun {
  id: string;
  migration_project_id: string;
  mapping_version: number;
  records_processed: number;
  records_ready: number;
  records_blocked: number;
  records_warning: number;
  new_records: number;
  updates: number;
  merges: number;
  skipped: number;
  quarantined: number;
  started_at: string;
  completed_at: string;
  status: "running" | "completed" | "failed";
}

export interface MigrationApproval {
  id: string;
  migration_project_id: string;
  approval_type: string;
  requested_by: string;
  requested_at: string;
  approved_by: string | null;
  approved_at: string | null;
  status: "pending" | "approved" | "rejected" | "expired";
  conditions: string[];
}

export interface MigrationImportJob {
  id: string;
  migration_project_id: string;
  batch_number: number;
  status: ImportJobStatus;
  records_attempted: number;
  records_created: number;
  records_updated: number;
  records_linked: number;
  records_skipped: number;
  records_failed: number;
  checkpoint_reference: string;
  started_at: string;
  completed_at: string | null;
}

export interface MigrationRecordLink {
  id: string;
  migration_project_id: string;
  migration_source_id: string;
  source_record_key: string;
  canonical_entity_type: string;
  canonical_entity_id: string;
  import_action: string;
  mapping_version: number;
  imported_at: string;
}

export interface MigrationReconciliationReport {
  id: string;
  migration_project_id: string;
  expected_records: number;
  actual_records: number;
  matched_records: number;
  missing_records: number;
  unexpected_records: number;
  relationship_errors: number;
  permission_errors: number;
  classification_errors: number;
  status: "passed" | "passed_with_warnings" | "failed";
  generated_at: string;
}

export interface DataReadinessAssessment {
  id: string;
  institution_id: string;
  migration_project_id: string;
  data_domain: string;
  completeness_score: number;
  validity_score: number;
  duplicate_resolution_score: number;
  ownership_score: number;
  classification_score: number;
  organizational_mapping_score: number;
  consent_score: number | null;
  reconciliation_score: number;
  overall_score: number;
  status: DataReadinessStatus;
  conditions: string[];
  assessed_at: string;
  assessed_by: string;
}

export interface MigrationQuarantineItem {
  id: string;
  migration_project_id: string;
  source_id: string;
  staging_record_id: string | null;
  reason: string;
  classification: string;
  quarantined_at: string;
  review_owner: string;
  status: "quarantined" | "released" | "rejected";
}

export interface MigrationAuditEvent {
  id: string;
  migration_project_id: string;
  institution_id: string;
  actor_id: string;
  action: string;
  target_type: string;
  target_id: string | null;
  previous_state: string;
  new_state: string;
  reason: string;
  timestamp: string;
  correlation_id: string;
  result: "success" | "failure";
}

export interface MigrationHealth {
  active_projects: number;
  records_in_staging: number;
  validation_pass_rate: number;
  open_exceptions: number;
  identity_conflicts: number;
  quarantined_items: number;
  reconciliation_success_rate: number;
  readiness_blockers: number;
}

export interface CreateMigrationProjectInput {
  institution_id: string;
  name: string;
  description?: string;
  migration_type: string;
  target_domains: string[];
  migration_owner_user_id: string;
  data_owner_user_id: string;
  security_reviewer_user_id: string;
  institution_approver_user_id: string;
  risk_level?: MigrationRiskLevel;
}

export interface AddSourceInput {
  migration_project_id: string;
  name: string;
  source_type: string;
  source_system: string;
  source_owner_user_id?: string;
  source_location_reference: string;
  source_format: string;
  estimated_record_count?: number;
  contains_personal_data?: boolean;
  contains_restricted_data?: boolean;
}

export interface IntakeCompleteInput {
  migration_project_id: string;
  migration_source_id: string;
  uploaded_by: string;
  original_filename: string;
  content: string;
  mime_type?: string;
}
