export type HumanStatus =
  | "pending_activation"
  | "active"
  | "restricted"
  | "identity_review"
  | "suspended"
  | "retired"
  | "merged_duplicate";

export type IdentityBasis =
  | "everyday_public_name"
  | "professional_name"
  | "known_community_name"
  | "established_public_alias"
  | "religious_clerical_name"
  | "author_creative_name"
  | "historical_public_name";

export type InvitationStatus =
  | "draft"
  | "ready_to_send"
  | "sent"
  | "delivered"
  | "viewed"
  | "acceptance_started"
  | "accepted"
  | "expired"
  | "revoked"
  | "declined"
  | "replaced"
  | "identity_review"
  | "failed_delivery";

export type EntryGateDecision =
  | "proceed"
  | "additional_confirmation_required"
  | "blocked"
  | "already_accepted"
  | "identity_review_required";

export type DuplicateReviewStatus =
  | "no_match"
  | "existing_human_confirmed"
  | "possible_match"
  | "conflicting_match"
  | "manual_review_required"
  | "merged"
  | "distinct_humans_confirmed";

export type SponsorPrivilegeStatus = "eligible" | "limited" | "paused" | "under_review" | "suspended" | "revoked";

export type MembershipWaveStatus = "invited" | "provisional" | "active" | "restricted" | "suspended" | "ended" | "transferred";

export type RelationshipBasis =
  | "family"
  | "friend"
  | "coworker"
  | "classmate"
  | "neighbor"
  | "organization_member"
  | "volunteer_colleague"
  | "professional_relationship"
  | "community_relationship"
  | "institutional_verification"
  | "other_directly_known";

export interface FoundingIdentityRecord {
  id: string;
  human_id: string;
  global_human_id: string;
  public_name: string;
  installation_authority: string;
  certified_at: string;
  founding_path_closed_at: string;
  immutable: true;
}

export interface HumanPublicIdentity {
  id: string;
  human_id: string;
  global_human_id: string;
  public_name: string;
  preferred_short_name: string | null;
  identity_basis: IdentityBasis;
  effective_at: string;
  superseded_at: string | null;
  approved_by: string | null;
  status: "active" | "superseded" | "pending_review";
}

export interface Wave1Invitation {
  id: string;
  public_invitation_id: string;
  institution_id: string;
  organization_unit_id: string | null;
  workspace_id: string | null;
  created_by_human_id: string;
  originating_sponsor_human_id: string;
  intended_recipient_name: string;
  recipient_contact_reference: string;
  recipient_contact_type: "email" | "phone" | "directory";
  proposed_membership_type: string;
  proposed_role_id: string | null;
  invitation_purpose: string;
  relationship_basis: RelationshipBasis | null;
  sponsor_attestation_version: string;
  sponsor_attestation_accepted_at: string | null;
  status: InvitationStatus;
  auth_invitation_id: string | null;
  token_hash: string | null;
  created_at: string;
  sent_at: string | null;
  viewed_at: string | null;
  accepted_at: string | null;
  expires_at: string;
  revoked_at: string | null;
  revoked_by: string | null;
  revocation_reason: string | null;
  accepted_human_id: string | null;
  replacement_invitation_id: string | null;
  resend_count: number;
  correlation_id: string;
}

export interface SponsorAttestation {
  id: string;
  sponsor_human_id: string;
  invitation_id: string;
  attestation_version: string;
  primary_accepted: boolean;
  secondary_accepted: boolean;
  relationship_basis: RelationshipBasis;
  attested_at: string;
}

export interface SponsorPrivilege {
  human_id: string;
  global_human_id: string;
  status: SponsorPrivilegeStatus;
  active_invitation_limit: number;
  active_invitations: number;
  invitations_created_today: number;
  sponsor_education_version: string | null;
  sponsor_education_completed_at: string | null;
  updated_at: string;
}

export interface AliasRequest {
  id: string;
  human_id: string;
  requested_alias: string;
  alias_type: IdentityBasis;
  reason: string;
  evidence_reference: string | null;
  submitted_at: string;
  review_status: "pending" | "approved" | "rejected";
  reviewed_by: string | null;
  reviewed_at: string | null;
}

export interface IdentityDuplicateCandidate {
  id: string;
  invitation_id: string | null;
  candidate_human_id: string | null;
  matched_human_id: string | null;
  match_signals: string[];
  review_status: DuplicateReviewStatus;
  created_at: string;
}

export interface Wave1InstitutionMembership {
  id: string;
  human_id: string;
  global_human_id: string;
  institution_id: string;
  originating_invitation_id: string;
  membership_type: string;
  status: MembershipWaveStatus;
  primary_unit_id: string | null;
  proposed_role_id: string | null;
  activated_role_id: string | null;
  joined_at: string;
  provisional_until: string | null;
  ended_at: string | null;
  created_by_sponsor_human_id: string;
}

export interface InvitationAcceptanceAttempt {
  id: string;
  invitation_id: string;
  attempted_at: string;
  result: EntryGateDecision;
  reason: string | null;
  actor_reference: string | null;
}

export interface Wave1AuditEvent {
  id: string;
  event_type: string;
  actor_human_id: string | null;
  subject_human_id: string | null;
  institution_id: string | null;
  invitation_id: string | null;
  sponsor_relationship_id: string | null;
  action: string;
  previous_state: string | null;
  new_state: string | null;
  reason: string | null;
  timestamp: string;
  request_id: string | null;
  correlation_id: string | null;
  result: "success" | "failure";
}

export interface InvitationEntryGateResult {
  invitation_token: string | null;
  invitation_status: InvitationStatus | null;
  recipient_match: boolean;
  institution_status: string;
  sponsor_status: SponsorPrivilegeStatus | null;
  scope_status: string;
  expiration_status: string;
  duplicate_human_status: DuplicateReviewStatus;
  authentication_status: string | null;
  activation_decision: EntryGateDecision;
  message: string;
}

export interface Wave1CertificationGate {
  id: string;
  label: string;
  passed: boolean;
  evidence: string;
}

export interface Wave1Certification {
  wave_id: string;
  certified_at: string | null;
  all_passed: boolean;
  gates: Wave1CertificationGate[];
}
