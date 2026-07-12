export type TrustLevel = 0 | 1 | 2 | 3 | 4 | 5;

export type TrustLevelLabel =
  | "pending_invitation"
  | "sponsored"
  | "verified"
  | "trusted"
  | "institution_leader"
  | "federation_trusted";

export type PublicTrustBadge =
  | "Pending"
  | "Sponsored Member"
  | "Verified Human"
  | "Trusted"
  | "Leader"
  | "Federation Trusted";

export type IdentityStatus = "active" | "dormant" | "restricted" | "archived";

export type VerificationMethod =
  | "known_personally"
  | "worked_together"
  | "organization_leader"
  | "government_id"
  | "institution_verification"
  | "video_verification"
  | "community_verification"
  | "leader_verification";

export type VerificationConfidence = "low" | "medium" | "high";

export type IdentityReviewStatus = "open" | "under_review" | "resolved";

export type IdentityReviewOutcome =
  | "verified"
  | "needs_more_evidence"
  | "restricted"
  | "removed"
  | null;

export type AppealStatus = "submitted" | "under_review" | "upheld" | "denied" | "withdrawn";

export type IdentityEventType =
  | "identity_created"
  | "invitation_accepted"
  | "verification_recorded"
  | "trust_promoted"
  | "trust_demoted"
  | "review_opened"
  | "review_resolved"
  | "appeal_submitted"
  | "appeal_resolved"
  | "identity_corrected"
  | "alias_approved"
  | "institution_joined"
  | "institution_transferred"
  | "identity_archived"
  | "dormancy_detected"
  | "federation_trusted";

/** ITL-HIR-001 — Canonical human identity (never deleted, only archived) */
export interface HumanIdentityRecord {
  id: string;
  global_human_id: string;
  user_id: string;
  legal_name: string | null;
  public_name: string;
  preferred_name: string | null;
  display_name: string | null;
  known_alias_approved: boolean;
  aliases: KnownAlias[];
  identity_status: IdentityStatus;
  trust_level: TrustLevel;
  trust_label: TrustLevelLabel;
  public_badge: PublicTrustBadge;
  primary_sponsor_id: string | null;
  invitation_id: string | null;
  institution_id: string | null;
  organization_id: string | null;
  intended_role: string | null;
  invite_quota: number;
  invites_sent: number;
  independent_verification_count: number;
  institution_leader: boolean;
  federation_trusted: boolean;
  review_required: boolean;
  last_active_at: string | null;
  created_at: string;
  updated_at: string;
  trust_established_at: string | null;
  archived_at: string | null;
}

export interface KnownAlias {
  id: string;
  alias: string;
  approved: boolean;
  approved_by: string | null;
  approved_at: string | null;
  reason: string | null;
}

/** ITL-INV-001 */
export interface TrustInvitationRecord {
  id: string;
  auth_invitation_id: string;
  email: string;
  sponsor_id: string;
  sponsor_agreement_accepted_at: string;
  invite_reason: string;
  institution_id: string;
  organization_id: string;
  intended_role: string;
  expires_at: string | null;
  accepted_at: string | null;
  created_at: string;
  status: "pending" | "accepted" | "revoked" | "expired";
}

/** ITL-SPN-001 */
export interface SponsorRelationship {
  id: string;
  sponsor_id: string;
  sponsored_user_id: string;
  invitation_id: string;
  institution_id: string;
  organization_id: string;
  created_at: string;
  permanent: true;
}

/** ITL-VER-001 */
export interface VerificationRecord {
  id: string;
  subject_user_id: string;
  verifier_user_id: string;
  relationship: string;
  verification_method: VerificationMethod;
  confidence: VerificationConfidence;
  notes_private: string | null;
  independent: boolean;
  verified_at: string;
}

/** ITL-TRU-001 */
export interface TrustPromotion {
  id: string;
  user_id: string;
  from_level: TrustLevelLabel;
  to_level: TrustLevelLabel;
  reason: string;
  automatic: boolean;
  promoted_by: string | null;
  promoted_at: string;
}

export interface TrustDemotion {
  id: string;
  user_id: string;
  from_level: TrustLevelLabel;
  to_level: TrustLevelLabel;
  reason: string;
  demoted_by: string;
  demoted_at: string;
}

/** ITL-GOV-001 */
export interface IdentityReview {
  id: string;
  subject_user_id: string;
  opened_by: string;
  reason: string;
  status: IdentityReviewStatus;
  outcome: IdentityReviewOutcome;
  ai_recommendation: string | null;
  created_at: string;
  resolved_at: string | null;
  resolution_notes: string | null;
}

export interface Appeal {
  id: string;
  review_id: string;
  subject_user_id: string;
  submitted_by: string;
  reason: string;
  status: AppealStatus;
  resolution: string | null;
  resolved_by: string | null;
  created_at: string;
  resolved_at: string | null;
}

/** ITL-FED-001 */
export interface InstitutionMembership {
  id: string;
  global_human_id: string;
  user_id: string;
  institution_id: string;
  organization_id: string;
  role: string;
  permissions: string[];
  joined_at: string;
  status: "active" | "transferred" | "ended";
}

/** Immutable identity ledger — ITL-HIR-001 */
export interface IdentityHistoryEntry {
  id: string;
  global_human_id: string;
  user_id: string;
  event_type: IdentityEventType;
  actor_id: string;
  summary: string;
  details: Record<string, unknown>;
  timestamp: string;
  immutable: true;
}

export interface IdentityEvent {
  id: string;
  global_human_id: string;
  event_type: IdentityEventType;
  actor_id: string;
  institution_id: string | null;
  timestamp: string;
}

export interface IdentityBadge {
  user_id: string;
  global_human_id: string;
  public_name: string;
  badge: PublicTrustBadge;
  identity_status: IdentityStatus;
}

export interface InviteTreeNode {
  user_id: string;
  global_human_id: string;
  public_name: string;
  trust_label: TrustLevelLabel;
  sponsored_by: string | null;
  invited: InviteTreeNode[];
}

export interface InvitationAnalytics {
  total_invitations: number;
  pending: number;
  accepted: number;
  revoked: number;
  acceptance_rate: number;
  top_sponsors: { sponsor_id: string; public_name: string; count: number }[];
}

export interface SponsorAccountabilitySummary {
  sponsor_id: string;
  global_human_id: string | null;
  public_name: string;
  invites_sent: number;
  invites_accepted: number;
  flagged_accounts: number;
  invite_privileges_paused: boolean;
  sponsor_reputation_score: number;
}

/** ITL-INT-001 — advisory only */
export interface IdentityIntelligenceAlert {
  id: string;
  alert_type:
    | "duplicate_identity"
    | "fraud_ring"
    | "mass_invitation"
    | "bot_behavior"
    | "dormant_identity"
    | "trust_anomaly"
    | "invitation_abuse";
  severity: "info" | "warning" | "critical";
  subject_user_ids: string[];
  explanation: string;
  ai_recommendation: string;
  requires_human_action: true;
  created_at: string;
  status: "open" | "investigating" | "resolved";
}

/** ITL-CERT-001 */
export interface IdentityCertification {
  id: string;
  certified_at: string | null;
  certified_by: string | null;
  checks: IdentityCertificationCheck[];
  all_passed: boolean;
}

export interface IdentityCertificationCheck {
  id: string;
  label: string;
  passed: boolean;
  evidence: string;
}

export interface IdentityTrustAuditEvent {
  id: string;
  timestamp: string;
  actor_id: string;
  global_human_id?: string | null;
  action: string;
  target_user_id: string | null;
  target_invitation_id: string | null;
  organization_id: string | null;
  institution_id: string | null;
  result: "success" | "failure";
  metadata?: Record<string, unknown>;
}

export interface IdentityTrustOverview {
  enabled: boolean;
  invitation_only: boolean;
  total_identities: number;
  by_trust_level: Record<string, number>;
  by_identity_status: Record<IdentityStatus, number>;
  pending_reviews: number;
  pending_appeals: number;
  open_invitations: number;
  federation_memberships: number;
  intelligence_alerts: number;
  constitutional_principle: string;
  subsystems: { id: string; name: string; status: string }[];
}

export interface IdentityTrustPolicy {
  core_principle: string;
  sponsor_responsibility: string;
  sponsor_agreement_text: string;
  real_name_policy: string;
  verification_for_trusted: number;
  review_period_days: number;
  dormancy_days: number;
  invite_limits: Record<string, number>;
  constitutional_principles: string[];
}

export interface IdentitySearchResult {
  global_human_id: string;
  user_id: string;
  public_name: string;
  public_badge: PublicTrustBadge;
  identity_status: IdentityStatus;
  institution_id: string | null;
}

export interface IdentityTimeline {
  global_human_id: string;
  user_id: string;
  public_name: string;
  events: IdentityHistoryEntry[];
}

export interface IdentityOperationsDashboard {
  overview: IdentityTrustOverview;
  review_queue: IdentityReview[];
  appeals_queue: Appeal[];
  verification_queue: VerificationRecord[];
  intelligence_alerts: IdentityIntelligenceAlert[];
  invitation_analytics: InvitationAnalytics;
}

export interface FederationIdentityView {
  global_human_id: string;
  user_id: string;
  public_name: string;
  memberships: InstitutionMembership[];
  federation_trusted: boolean;
}
