export type IdentityAssuranceState =
  | "unconfirmed"
  | "sponsored"
  | "verification_pending"
  | "verified"
  | "strongly_verified"
  | "identity_review"
  | "restricted"
  | "retired";

export type InstitutionTrustState =
  | "provisional_member"
  | "verified_member"
  | "active_trusted_member"
  | "institution_leader"
  | "institution_verifier"
  | "restricted_member"
  | "former_member";

export type VerificationRequestStatus =
  | "draft"
  | "pending_delivery"
  | "sent"
  | "viewed"
  | "accepted_for_review"
  | "confirmed"
  | "unable_to_confirm"
  | "declined"
  | "expired"
  | "cancelled"
  | "conflict_reported";

export type VerificationStatementStatus =
  | "active"
  | "pending_review"
  | "conflicted"
  | "withdrawn"
  | "invalidated"
  | "superseded";

export type VerificationConfidenceLevel = "certain" | "strong" | "limited" | "unable_to_confirm";

export type VerifierQualificationStatus = "eligible" | "limited" | "expired" | "restricted" | "suspended";

export type IdentityChallengeStatus =
  | "open"
  | "under_review"
  | "contained"
  | "resolved"
  | "referred";

export type IdentityChallengeType =
  | "mistaken_identity"
  | "impersonation"
  | "duplicate_human"
  | "compromised_account"
  | "false_public_name"
  | "alias_conflict"
  | "verification_conflict"
  | "recipient_mismatch"
  | "authentication_conflict"
  | "other";

export interface VerificationMethodRecord {
  id: string;
  key: string;
  name: string;
  description: string;
  assurance_weight: "high" | "medium" | "low" | "insufficient";
  requires_live_interaction: boolean;
  requires_existing_relationship: boolean;
  requires_evidence: boolean;
  status: string;
  version: string;
}

export interface VerifierQualification {
  id: string;
  human_id: string;
  qualification_type: "standard_verifier";
  education_version: string;
  qualified_at: string;
  expires_at: string | null;
  status: VerifierQualificationStatus;
  restricted_at: string | null;
  restriction_reason: string | null;
}

export interface VerificationRequest {
  id: string;
  subject_human_id: string;
  institution_id: string;
  requested_verifier_human_id: string;
  requested_by_human_id: string;
  verification_method_key: string;
  request_reason: string;
  status: VerificationRequestStatus;
  created_at: string;
  sent_at: string | null;
  viewed_at: string | null;
  responded_at: string | null;
  expires_at: string;
  cancelled_at: string | null;
  correlation_id: string;
}

export interface HumanVerificationStatement {
  id: string;
  subject_human_id: string;
  verifier_human_id: string;
  institution_id: string;
  verification_request_id: string | null;
  verification_method_key: string;
  relationship_basis: string;
  statement_version: string;
  identity_name_confirmed: string;
  live_interaction_at: string | null;
  evidence_reference: string | null;
  confidence: VerificationConfidenceLevel;
  status: VerificationStatementStatus;
  independent: boolean;
  submitted_at: string;
  withdrawn_at: string | null;
  withdrawal_reason: string | null;
  reviewed_by: string | null;
}

export interface IdentityAssuranceRecord {
  id: string;
  human_id: string;
  state: IdentityAssuranceState;
  effective_at: string;
  expires_at: string | null;
  reason_code: string | null;
  source_event_id: string | null;
  qualifying_confirmations: number;
  independent_confirmations: number;
}

export interface HumanTrustStateRecord {
  id: string;
  human_id: string;
  institution_id: string;
  trust_domain: "institution";
  state: InstitutionTrustState;
  effective_at: string;
  expires_at: string | null;
  reason_code: string | null;
  source_event_id: string | null;
  status: "active" | "superseded";
}

export interface ProvisionalIdentityPeriod {
  id: string;
  human_id: string;
  institution_id: string;
  started_at: string;
  expires_at: string;
  extended_until: string | null;
  extension_reason: string | null;
  status: "active" | "expired" | "extended" | "resolved";
}

export interface IdentityChallenge {
  id: string;
  subject_human_id: string;
  reported_by_human_id: string;
  institution_id: string | null;
  challenge_type: IdentityChallengeType;
  description: string;
  evidence_reference: string | null;
  severity: "low" | "moderate" | "high" | "critical";
  status: IdentityChallengeStatus;
  created_at: string;
  assigned_to: string | null;
  resolved_at: string | null;
  resolution: string | null;
}

export interface IdentityLedgerEvent {
  id: string;
  ledger_sequence: number;
  human_id: string;
  institution_id: string | null;
  event_type: string;
  event_version: string;
  occurred_at: string;
  recorded_at: string;
  actor_type: "human" | "service" | "system";
  actor_human_id: string | null;
  service_identity_id: string | null;
  source_system: string;
  source_record_type: string | null;
  source_record_id: string | null;
  previous_state: string | null;
  new_state: string | null;
  reason_code: string | null;
  evidence_digest: string | null;
  correlation_id: string;
  integrity_hash: string | null;
  previous_event_hash: string | null;
  status: "active" | "correction";
}

export interface Wave2CertificationGate {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}

export interface Wave2Certification {
  wave_id: string;
  certified_at: string | null;
  all_passed: boolean;
  gates: Wave2CertificationGate[];
}

export interface VerificationStatusView {
  assurance_state: IdentityAssuranceState;
  institution_trust: InstitutionTrustState | null;
  qualifying_confirmations: number;
  required_confirmations: number;
  independent_confirmations: number;
  required_independent: number;
  provisional_days_remaining: number | null;
  next_action: string;
  public_badge: string;
  capabilities: Record<string, boolean | string>;
}
