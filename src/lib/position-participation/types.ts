/**
 * Shared position participation model (V2-A).
 * Position → Position Memberships → People
 * Multiple leads allowed (co-leads); volunteers unlimited.
 */

export type ScopeType =
  | "county"
  | "college"
  | "city"
  | "community"
  | "campus_organization"
  | "event";

export type ParticipationType = "volunteer" | "lead";

export type MembershipStatus = "active" | "withdrawn" | "pending";

export type TeamDisplayLabel =
  | "Help Build This Team"
  | "Volunteer Team Forming"
  | "Lead"
  | "Co-Leads"
  | "Committee";

export type PositionDefinition = {
  id: string;
  title: string;
  purpose: string;
  /** Functional role id when mapped from CIWS catalog */
  roleKey?: string;
};

export type PositionMembership = {
  id: string;
  position_id: string;
  person_id: string;
  /** Canonical human — aliases must collapse here */
  canonical_person_id: string;
  scope_type: ScopeType;
  scope_id: string;
  participation_type: ParticipationType;
  status: MembershipStatus;
  joined_at: string;
  approved_at: string | null;
  public_visibility: boolean;
  display_name?: string;
};

export type CanonicalPerson = {
  canonical_person_id: string;
  display_name: string;
  /** Alternate profiles / aliases that must not inflate people counts */
  aliases: string[];
  /** System identity ids (accounts) linked to this person — informational only */
  system_identity_ids: string[];
  scopes: string[];
};

export type FieldPlanContentStatus = "placeholder" | "draft" | "approved" | "superseded";

export type PositionFieldPlanContent = {
  position_id: string;
  summary: string;
  purpose: string;
  before_event: string;
  event_day: string;
  after_event: string;
  canvassing: string;
  gotv: string;
  time_commitment: string;
  helpful_skills: string;
  central_counterpart: string;
  local_needs: string;
  source_reference: string;
  content_status: FieldPlanContentStatus;
};

export type ParticipationGoalKind = "launch_team" | "registration" | "vote_participation";

export type GoalCalculation = {
  kind: ParticipationGoalKind;
  formula: string;
  inputs: Record<string, number | string | null>;
  configured_manual_goal: number | null;
  eligible_population: number | null;
  participation_rate: number | null;
  minimum_launch_team: number;
  computed_goal: number;
  explanation: string[];
};

export type HonestParticipationMetrics = {
  scope_id: string;
  confirmed_people: number;
  confirmed_participants: number;
  system_identities: number;
  aliases_excluded_note: string;
  participation_goal: number;
  remaining_need: number;
  goal_calculation: GoalCalculation;
  /** Civic targets — campus uses county-VAP proportional formula */
  registration_target: number;
  vote_participation_target: number;
  civic_goal_explanation?: string[];
  civic_goal_formula?: string;
  campus_share_of_county_vap?: number | null;
  county_voting_age_population?: number | null;
  campus_enrollment?: number | null;
  /** RedDirt Victory Contribution Index (county-level) */
  county_vci?: number;
  vci_definition?: string;
};

export type PositionCardView = {
  position: PositionDefinition;
  scope_type: ScopeType;
  scope_id: string;
  memberships: PositionMembership[];
  lead_count: number;
  volunteer_count: number;
  display_label: TeamDisplayLabel;
  leads: Array<{ person_id: string; canonical_person_id: string; display_name: string }>;
  volunteers: Array<{ person_id: string; canonical_person_id: string; display_name: string }>;
  field_plan: PositionFieldPlanContent;
};
