export type MembershipPath =
  | "direct_invitation"
  | "cross_institution_invitation"
  | "approved_transfer"
  | "coalition_assignment"
  | "shared_program"
  | "legacy_reconciliation";

export type FederationMembershipStatus =
  | "invited"
  | "provisional"
  | "active"
  | "restricted"
  | "suspended"
  | "transfer_pending"
  | "ending"
  | "ended"
  | "archived";

export interface FederationInstitutionMembership {
  id: string;
  human_id: string;
  global_human_id: string;
  institution_id: string;
  organization_id: string;
  originating_invitation_id: string | null;
  membership_path: MembershipPath;
  membership_type: string;
  membership_status: FederationMembershipStatus;
  institution_trust_state: string;
  primary_unit_id: string | null;
  role: string;
  permissions: string[];
  joined_at: string;
  provisional_until: string | null;
  ended_at: string | null;
  created_by_human_id: string;
}

export interface ActiveInstitutionContext {
  human_id: string;
  institution_id: string;
  membership_id: string;
  organization_unit_id: string | null;
  workspace_id: string | null;
  role_assignment_ids: string[];
  identity_assurance_state: string;
  institution_trust_state: string;
  selected_at: string;
  expires_at: string | null;
}

export interface InstitutionContextSession {
  id: string;
  session_id: string;
  human_id: string;
  institution_id: string;
  membership_id: string;
  entered_at: string;
  last_activity_at: string;
  exited_at: string | null;
  step_up_verified_at: string | null;
  status: "active" | "exited";
}

export interface PortableIdentityAssurance {
  id: string;
  human_id: string;
  assurance_state: string;
  assurance_version: string;
  issued_at: string;
  expires_at: string | null;
  issuer: string;
  integrity_reference: string;
  permitted_claims: string[];
  revocation_status: "active" | "revoked";
}

export interface InstitutionAssuranceReceipt {
  id: string;
  institution_id: string;
  human_id: string;
  membership_id: string;
  portable_assurance_id: string;
  claims_received: string[];
  received_at: string;
  valid_until: string | null;
  status: "active" | "expired" | "revoked";
}

export interface CrossInstitutionInvitation {
  id: string;
  public_invitation_id: string;
  inviting_institution_id: string;
  sponsor_human_id: string;
  intended_recipient_name: string;
  recipient_contact: string;
  existing_human_candidate_id: string | null;
  proposed_membership_type: string;
  proposed_role: string | null;
  portable_assurance_requested: boolean;
  local_verification_required: boolean;
  federation_agreement_id: string | null;
  status: "sent" | "viewed" | "accepted" | "declined" | "expired" | "revoked";
  token_hash: string;
  created_at: string;
  expires_at: string;
  accepted_at: string | null;
  linked_human_id: string | null;
}

export interface InterinstitutionalAgreement {
  id: string;
  agreement_type: string;
  institution_a_id: string;
  institution_b_id: string | null;
  name: string;
  purpose: string;
  recognized_claims: string[];
  data_sharing_scope: string[];
  status: "draft" | "active" | "suspended" | "expired" | "terminated";
  version: string;
  starts_at: string;
  expires_at: string | null;
}

export interface HumanDirectoryPreference {
  human_id: string;
  visibility_scope: "not_discoverable" | "institution_only" | "partner_institutions" | "federation";
  visible_institutions: string[];
  contact_mode: string;
  updated_at: string;
}

export interface MembershipTransfer {
  id: string;
  human_id: string;
  source_membership_id: string;
  destination_institution_id: string;
  transfer_type: string;
  requested_by: string;
  status: "requested" | "approved" | "completed" | "denied";
  requested_at: string;
  completed_at: string | null;
}

export interface Wave4CertificationGate {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}

export interface Wave4Certification {
  wave_id: string;
  certified_at: string | null;
  all_passed: boolean;
  gates: Wave4CertificationGate[];
}
