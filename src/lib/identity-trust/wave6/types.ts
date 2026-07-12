export type OperationalRole =
  | "individual_human"
  | "sponsor"
  | "verifier"
  | "identity_support_operator"
  | "institution_identity_administrator"
  | "identity_reviewer"
  | "platform_identity_reviewer"
  | "appeal_reviewer"
  | "security_identity_operator"
  | "federation_identity_administrator"
  | "identity_auditor"
  | "executive_oversight";

export type WorkItemStatus =
  | "new"
  | "unassigned"
  | "assigned"
  | "acknowledged"
  | "in_progress"
  | "waiting_for_human"
  | "waiting_for_institution"
  | "waiting_for_evidence"
  | "waiting_for_approval"
  | "escalated"
  | "paused"
  | "resolved"
  | "closed"
  | "cancelled";

export type WorkItemType =
  | "invitation_delivery_failure"
  | "sponsor_education_required"
  | "verification_request"
  | "verification_conflict"
  | "provisional_deadline"
  | "identity_challenge"
  | "duplicate_candidate"
  | "alias_review"
  | "sponsor_privilege_review"
  | "membership_restoration"
  | "identity_appeal"
  | "federation_context_failure"
  | "intelligence_signal_review"
  | "account_recovery"
  | "identity_case"
  | "ledger_integrity_review"
  | "policy_exception";

export interface IdentityOperationalAuthority {
  id: string;
  human_id: string;
  institution_id: string | null;
  federation_id: string | null;
  operational_role: OperationalRole;
  authorized_actions: string[];
  authorized_case_types: string[];
  starts_at: string;
  expires_at: string | null;
  granted_by: string;
  status: "active" | "expired" | "revoked";
}

export interface IdentityWorkItem {
  id: string;
  work_type: WorkItemType;
  source_type: string;
  source_id: string;
  subject_human_id: string | null;
  institution_id: string | null;
  federation_id: string | null;
  priority: number;
  severity: string;
  status: WorkItemStatus;
  summary: string;
  required_qualification: string;
  required_authority: OperationalRole;
  assigned_to_human_id: string | null;
  due_at: string | null;
  escalation_at: string | null;
  created_at: string;
  completed_at: string | null;
  advisory_signal: boolean;
  prohibited_actions: string[];
}

export interface IdentityWorkAssignment {
  id: string;
  work_item_id: string;
  assigned_to_human_id: string;
  assigned_by_human_id: string;
  assigned_at: string;
  conflict_cleared: boolean;
}

export interface IdentitySupportRequest {
  id: string;
  human_id: string | null;
  institution_id: string | null;
  category: string;
  description: string;
  related_invitation_id: string | null;
  related_case_id: string | null;
  severity: "low" | "normal" | "high" | "urgent";
  status: "new" | "assigned" | "in_progress" | "escalated" | "resolved" | "closed";
  assigned_to: string | null;
  created_at: string;
  resolved_at: string | null;
}

export interface IdentityHumanHelpEvent {
  id: string;
  human_id: string;
  workflow: string;
  help_type: string;
  point_of_confusion: string | null;
  created_at: string;
}

export interface IdentityReportRun {
  id: string;
  report_id: string;
  run_at: string;
  metrics: Record<string, number | string>;
  data_period: string;
  limitations: string[];
}

export interface IdentityExecutiveMetric {
  id: string;
  metric_key: string;
  value: number | string;
  label: string;
  updated_at: string;
  aggregate_only: true;
}

export interface IdentityOperationsAuditEvent {
  id: string;
  event_type: string;
  actor_human_id: string;
  subject_human_id: string | null;
  institution_id: string | null;
  resource_type: string | null;
  resource_id: string | null;
  summary: string;
  correlation_id: string | null;
  timestamp: string;
}

export interface IdentityHomeView {
  human_id: string;
  global_human_id: string;
  public_name: string;
  assurance_state: string;
  assurance_explanation: string;
  memberships: { institution_id: string; status: string; role: string; trust_state: string }[];
  next_action: { action: string; deadline: string | null; priority: string } | null;
  active_cases: number;
  pending_appeals: number;
  verification_progress: { qualifying: number; required: number; independent_required: boolean };
}

export interface Wave6Certification {
  wave_id: string;
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
}
