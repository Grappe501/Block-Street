/**
 * CAE-11.1-W2 — Canonical Initiative Data Model (INI-001)
 * Single source of truth for Initiative domain entities.
 * Governed by: docs/phase-11/11.1-initiatives/01_CONSTITUTION.md
 */

/** Primary initiative types — aligns with data/phase-11/initiative_types.json */
export type CanonicalInitiativeType =
  | "program"
  | "campaign"
  | "project"
  | "operation"
  | "pilot"
  | "community_response"
  | "educational_initiative"
  | "research_initiative"
  | "coalition_initiative"
  | "institutional_change"
  | "emergency_initiative"
  | "continuous_operating_function";

/** W2 canonical lifecycle — one active status per initiative */
export type CanonicalInitiativeStatus =
  | "concept"
  | "discovery"
  | "design"
  | "approval_pending"
  | "approved"
  | "preparation"
  | "active"
  | "paused"
  | "at_risk"
  | "closing"
  | "completed"
  | "cancelled"
  | "archived"
  | "owner_required";

export type GovernanceClass = 1 | 2 | 3 | 4 | 5;

export type InitiativeVisibility =
  | "private"
  | "institution_internal"
  | "participating_institutions"
  | "member_public"
  | "public";

export type CharterStatus =
  | "incomplete"
  | "draft"
  | "ready_for_review"
  | "approved"
  | "active_version"
  | "superseded"
  | "archived";

export type MembershipRole =
  | "executive_owner"
  | "operational_owner"
  | "backup_owner"
  | "sponsor"
  | "creator"
  | "approver"
  | "contributor"
  | "lead"
  | "advisor"
  | "reviewer"
  | "informed";

export type MembershipStatus = "active" | "ended" | "pending" | "revoked";

export type DependencyType =
  | "requires"
  | "blocks"
  | "supports"
  | "supersedes"
  | "replaces"
  | "derived_from"
  | "uses_resources_from"
  | "depends_on_approval"
  | "depends_on_funding";

export type DependencyTargetType =
  | "initiative"
  | "resource"
  | "approval"
  | "technology"
  | "partner"
  | "program"
  | "funding";

export type ReviewType =
  | "scheduled"
  | "risk"
  | "quarterly"
  | "completion"
  | "lessons_learned"
  | "emergency"
  | "restoration";

export type InitiativeAuditEventType =
  | "initiative_created"
  | "owner_assigned"
  | "owner_changed"
  | "charter_approved"
  | "activated"
  | "paused"
  | "scope_changed"
  | "dependency_added"
  | "dependency_removed"
  | "review_completed"
  | "version_created"
  | "status_changed"
  | "closed"
  | "cancelled"
  | "archived"
  | "restoration_requested";

export interface InitiativeRecord {
  initiative_id: string;
  institution_id: string;
  initiative_type: CanonicalInitiativeType;
  initiative_name: string;
  initiative_slug: string;
  public_name: string | null;
  executive_owner_human_id: string;
  operational_owner_human_id: string;
  backup_owner_human_id: string | null;
  status: CanonicalInitiativeStatus;
  governance_class: GovernanceClass;
  visibility: InitiativeVisibility;
  strategic_priority_id: string | null;
  portfolio_category: string | null;
  current_version: number;
  is_archived: boolean;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

export interface InitiativeCharterRecord {
  charter_id: string;
  initiative_id: string;
  problem_statement: string;
  opportunity_statement: string | null;
  purpose: string;
  institution_alignment: string;
  success_definition: string;
  in_scope: string;
  out_of_scope: string;
  public_description: string | null;
  review_frequency: string;
  closeout_basis: string;
  charter_status: CharterStatus;
  version: number;
  approved_at: string | null;
  approved_by: string | null;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

export interface InitiativeScopeRecord {
  scope_id: string;
  initiative_id: string;
  geographic_scope: string;
  population_scope: string;
  institution_scope: string;
  functional_scope: string;
  resource_scope: string;
  visibility_scope: string;
  data_scope: string;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface InitiativeTimelineRecord {
  timeline_id: string;
  initiative_id: string;
  concept_date: string | null;
  discovery_date: string | null;
  design_date: string | null;
  approval_date: string | null;
  preparation_date: string | null;
  activation_date: string | null;
  target_completion_date: string | null;
  completion_date: string | null;
  archive_date: string | null;
  next_review_date: string | null;
}

export interface InitiativeMembershipRecord {
  membership_id: string;
  initiative_id: string;
  human_id: string;
  institution_membership_id: string;
  institution_id: string;
  role: MembershipRole;
  authority_level: string;
  status: MembershipStatus;
  assigned_at: string;
  ended_at: string | null;
}

export interface InitiativeVersionRecord {
  initiative_version_id: string;
  initiative_id: string;
  version_number: number;
  change_summary: string;
  trigger: string;
  charter_id: string | null;
  scope_id: string | null;
  created_at: string;
  created_by: string;
}

export interface InitiativeDependencyRecord {
  initiative_dependency_id: string;
  initiative_id: string;
  dependency_type: DependencyType;
  target_type: DependencyTargetType;
  target_id: string;
  description: string;
  blocks_activation: boolean;
  blocks_completion: boolean;
  created_at: string;
  created_by: string;
}

export interface InitiativeReviewRecord {
  review_id: string;
  initiative_id: string;
  review_type: ReviewType;
  scheduled_at: string;
  completed_at: string | null;
  reviewer_human_id: string;
  outcome: string | null;
  lessons_learned: string | null;
  status: "scheduled" | "completed" | "overdue" | "cancelled";
}

export interface InitiativeHistoryEvent {
  initiative_event_id: string;
  initiative_id: string;
  institution_id: string;
  event_type: InitiativeAuditEventType;
  actor_human_id: string;
  previous_state: Record<string, unknown> | null;
  new_state: Record<string, unknown> | null;
  reason: string | null;
  correlation_id: string | null;
  request_id: string | null;
  occurred_at: string;
}

export interface InitiativeCloseoutRecord {
  closeout_id: string;
  initiative_id: string;
  closeout_category: string;
  authorized_by: string;
  reason: string;
  unfinished_obligations: string;
  lessons_learned: string | null;
  successor_initiative_id: string | null;
  completed_at: string;
}

/** Aggregate root for services (W3) */
export interface InitiativeAggregate {
  initiative: InitiativeRecord;
  charter: InitiativeCharterRecord | null;
  scope: InitiativeScopeRecord | null;
  timeline: InitiativeTimelineRecord | null;
  memberships: InitiativeMembershipRecord[];
  versions: InitiativeVersionRecord[];
  dependencies: InitiativeDependencyRecord[];
  reviews: InitiativeReviewRecord[];
  history: InitiativeHistoryEvent[];
  closeout: InitiativeCloseoutRecord | null;
}

export const INITIATIVE_STORE_KEYS = {
  initiatives: "canonical_initiatives",
  charters: "initiative_charters",
  scopes: "initiative_scopes",
  timelines: "initiative_timelines",
  memberships: "initiative_memberships",
  versions: "initiative_versions",
  dependencies: "initiative_dependencies",
  reviews: "initiative_reviews",
  history: "initiative_history_events",
  closeouts: "initiative_closeouts",
} as const;
