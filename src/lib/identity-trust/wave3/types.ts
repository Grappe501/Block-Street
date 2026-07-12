export type IdentityCaseType =
  | "verification_insufficiency"
  | "verification_conflict"
  | "mistaken_invitation"
  | "duplicate_human"
  | "impersonation"
  | "false_public_identity"
  | "alias_dispute"
  | "authentication_conflict"
  | "compromised_account"
  | "sponsor_misrepresentation"
  | "verifier_misrepresentation"
  | "provisional_expiration"
  | "membership_restoration"
  | "identity_retirement"
  | "other_identity_matter";

export type IdentityCaseStatus =
  | "submitted"
  | "intake_review"
  | "awaiting_assignment"
  | "under_preliminary_review"
  | "notice_pending"
  | "response_period"
  | "evidence_review"
  | "decision_pending"
  | "decided"
  | "appeal_pending"
  | "resolved"
  | "closed"
  | "dismissed";

export type IdentityCaseSeverity = "IG-1" | "IG-2" | "IG-3" | "IG-4";

export type IdentityCaseScope =
  | "institution_membership"
  | "institution_trust"
  | "global_identity_assurance"
  | "public_name"
  | "alias"
  | "verification_privilege"
  | "sponsor_privilege"
  | "authentication_identity"
  | "global_human_record";

export type IdentityAppealStatus =
  | "draft"
  | "submitted"
  | "eligibility_review"
  | "accepted"
  | "under_review"
  | "decision_pending"
  | "granted"
  | "granted_in_part"
  | "denied"
  | "remanded"
  | "withdrawn"
  | "closed";

export type IdentityAppealGround =
  | "material_factual_error"
  | "new_evidence"
  | "misapplication_of_policy"
  | "procedural_unfairness"
  | "reviewer_conflict"
  | "disproportionate_restriction"
  | "mistaken_duplicate_merge"
  | "identity_misclassification"
  | "accessibility_failure"
  | "other_substantial_error";

export interface IdentityReviewBoard {
  id: string;
  board_type: "institution" | "platform" | "appeal";
  institution_id: string | null;
  name: string;
  jurisdiction: string;
  minimum_panel_size: number;
  quorum_rule: string;
  decision_rule: string;
  status: string;
}

export interface IdentityReviewerQualification {
  id: string;
  human_id: string;
  reviewer_type: "institution" | "platform" | "appeal";
  institution_id: string | null;
  training_version: string;
  qualified_at: string;
  expires_at: string | null;
  status: "active" | "expired" | "restricted" | "suspended";
  restriction_reason: string | null;
}

export interface IdentityReviewerConflict {
  id: string;
  case_id: string;
  reviewer_human_id: string;
  conflict_type: string;
  description: string;
  disclosed_at: string;
  decision: "recused" | "cleared" | "pending";
  decided_by: string | null;
}

export interface IdentityCase {
  id: string;
  public_case_id: string;
  case_type: IdentityCaseType;
  subject_human_id: string;
  institution_id: string | null;
  reporting_human_id: string | null;
  originating_event_id: string | null;
  severity: IdentityCaseSeverity;
  scope: IdentityCaseScope;
  status: IdentityCaseStatus;
  confidentiality_level: "standard" | "elevated" | "critical";
  assigned_board_id: string | null;
  assigned_reviewer_id: string | null;
  case_manager_human_id: string | null;
  summary: string;
  opened_at: string;
  notice_due_at: string | null;
  response_due_at: string | null;
  decision_due_at: string | null;
  decided_at: string | null;
  closed_at: string | null;
  appeal_deadline: string | null;
  correlation_id: string;
}

export interface IdentityCaseEvidence {
  id: string;
  case_id: string;
  evidence_type: string;
  submitted_by_human_id: string | null;
  source_system: string;
  source_record_reference: string | null;
  description: string;
  classification: string;
  reliability: string;
  relevance: string;
  status: "active" | "disputed" | "invalidated";
  submitted_at: string;
}

export interface IdentityReviewNotice {
  id: string;
  case_id: string;
  subject_human_id: string;
  notice_type: string;
  summary: string;
  restrictions: string | null;
  response_deadline: string;
  delivered_at: string;
  delivery_method: string;
  viewed_at: string | null;
  status: "delivered" | "viewed" | "overdue";
}

export interface IdentityCaseResponse {
  id: string;
  case_id: string;
  submitted_by_human_id: string;
  response_type: string;
  statement: string;
  evidence_references: string[];
  submitted_at: string;
  status: "submitted" | "reviewed";
}

export interface IdentityContainmentAction {
  id: string;
  case_id: string;
  subject_human_id: string;
  action_type: string;
  scope: string;
  reason: string;
  authorized_by: string;
  started_at: string;
  expires_at: string;
  review_due_at: string;
  status: "active" | "lifted" | "expired";
  lifted_at: string | null;
}

export interface IdentityCaseDecision {
  id: string;
  case_id: string;
  decision_type: string;
  findings: string;
  governing_rules: string[];
  evidence_summary: string;
  evidence_limitations: string;
  decision: string;
  conditions: string | null;
  effective_at: string;
  decided_by: string;
  panel_members: string[];
  appeal_deadline: string;
  status: "active" | "superseded" | "appealed";
  ai_informed_only: boolean;
}

export interface DuplicateIdentityCase {
  id: string;
  identity_case_id: string;
  primary_candidate_human_id: string;
  secondary_candidate_human_id: string;
  match_signals: string[];
  conflicting_signals: string[];
  authentication_overlap: boolean;
  membership_overlap: boolean;
  risk_level: string;
  proposed_resolution: string | null;
  status: "open" | "preview_ready" | "merge_approved" | "distinct_confirmed" | "merged";
  surviving_global_human_id: string | null;
  approver_human_ids: string[];
}

export interface HumanAliasGovernance {
  id: string;
  human_id: string;
  alias: string;
  alias_type: string;
  scope: string;
  status: "pending" | "approved" | "rejected";
  case_id: string | null;
  approved_by: string | null;
  effective_at: string | null;
}

export interface IdentityAppealRecord {
  id: string;
  case_id: string;
  decision_id: string;
  appellant_human_id: string;
  appeal_ground: IdentityAppealGround;
  statement: string;
  new_evidence_references: string[];
  requested_remedy: string;
  status: IdentityAppealStatus;
  submitted_at: string;
  appeal_deadline: string;
  assigned_panel_id: string | null;
  original_decider_id: string | null;
  decided_at: string | null;
  outcome: string | null;
}

export interface IdentityRestorationRequest {
  id: string;
  human_id: string;
  institution_id: string | null;
  prior_case_id: string | null;
  restoration_basis: string;
  new_evidence: string;
  status: "submitted" | "under_review" | "restored" | "restored_provisionally" | "denied";
  submitted_at: string;
  decided_at: string | null;
  decision_case_id: string | null;
}

export interface Wave3CertificationGate {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}

export interface Wave3Certification {
  wave_id: string;
  certified_at: string | null;
  all_passed: boolean;
  gates: Wave3CertificationGate[];
}
