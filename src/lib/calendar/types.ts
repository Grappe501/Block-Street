/**
 * Canonical calendar event model (CAL-01).
 * One event record · many calendar scope references · no duplicates.
 */

export type OperationalStatus =
  | "draft"
  | "proposed"
  | "tentative"
  | "scheduled"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "canceled"
  | "postponed"
  | "archived";

/** Soft-beta alias used by early scaffold pages. Prefer OperationalStatus. */
export type CalendarEventStatus =
  | "proposed"
  | "scheduled"
  | "confirmed"
  | "pending_approval"
  | "completed"
  | "cancelled"
  | "hold"
  | OperationalStatus;

export type ApprovalStatus =
  | "not_submitted"
  | "submitted"
  | "under_review"
  | "revision_requested"
  | "approved"
  | "conditionally_approved"
  | "rejected"
  | "approval_withdrawn"
  | "pending"
  | null;

export type KellyAttendanceStatus =
  | "not_requested"
  | "requested"
  | "under_review"
  | "hold_placed"
  | "tentatively_accepted"
  | "confirmed"
  | "declined"
  | "canceled"
  | "completed"
  | null;

/** Soft-beta alias. Prefer KellyAttendanceStatus. */
export type KellyStatus = "request" | "hold" | "confirmed" | "travel" | KellyAttendanceStatus;

export type PublicationStatus =
  | "private_draft"
  | "internal_only"
  | "ready_to_publish"
  | "scheduled_for_publication"
  | "published"
  | "unpublished"
  | "archived";

export type StaffingStatus =
  | "fully_staffed"
  | "nearly_staffed"
  | "needs_volunteers"
  | "critical_shortage"
  | "no_staffing_plan"
  | "staffing_not_required";

export type ConflictState =
  | "no_conflict"
  | "possible_conflict"
  | "likely_conflict"
  | "hard_conflict"
  | "override_approved";

export type CalendarEventType =
  | "campaign_event"
  | "candidate_appearance"
  | "college_community_meeting"
  | "county_meeting"
  | "city_meeting"
  | "networking_event"
  | "recruitment_event"
  | "voter_registration_drive"
  | "volunteer_training"
  | "volunteer_shift"
  | "leadership_meeting"
  | "committee_meeting"
  | "fundraiser"
  | "community_forum"
  | "festival_or_public_appearance"
  | "canvass"
  | "phone_bank"
  | "text_bank"
  | "press_event"
  | "media_appearance"
  | "travel"
  | "internal_planning"
  | "deadline"
  | "orientation"
  | "social_media_deadline"
  | "follow_up_session"
  | "partner_event"
  | "hold"
  | "tentative_event"
  | "private_appointment"
  /** Soft-beta aliases used by scaffold UI */
  | "social"
  | "meeting"
  | "training"
  | "tabling"
  | "kelly_visit"
  | "other";

export type CalendarLevelId =
  | "universal"
  | "campaign_operations"
  | "candidate"
  | "volunteer_management"
  | "college_command"
  | "college_community"
  | "county"
  | "city"
  | "personal";

export type CalendarScope =
  | { kind: "public" }
  | { kind: "universal" }
  | { kind: "college"; collegeSlug: string }
  | { kind: "county"; countySlug: string }
  | { kind: "city"; citySlug: string }
  | { kind: "command" }
  | { kind: "kelly" }
  | { kind: "volunteer" };

export type VolunteerRoleRequirement = {
  role_id: string;
  title: string;
  number_needed: number;
  number_confirmed: number;
  training_required: boolean;
  instructions?: string;
};

export type VolunteerShift = {
  shift_id: string;
  event_id: string;
  role_id: string;
  start_at: string;
  end_at: string;
  arrival_at?: string;
  number_needed: number;
  number_confirmed: number;
  training_required: boolean;
  check_in_location?: string;
  shift_lead?: string | null;
  instructions?: string;
  status: "open" | "filled" | "canceled";
};

export type ApprovalAction = {
  at: string;
  actor: string;
  role: string;
  decision: string;
  notes?: string;
  conditions?: string;
  previous_state: string;
  new_state: string;
};

export type ExternalSyncRecord = {
  provider: "google" | "apple" | "microsoft" | "ics" | "other";
  external_calendar_id?: string | null;
  external_event_id?: string | null;
  sync_direction: "export_only" | "import_only" | "bidirectional" | "none";
  last_sync_at?: string | null;
  sync_status: "not_configured" | "ready" | "error" | "disabled";
  sync_error?: string | null;
  source_of_truth: "block_street";
};

/**
 * Canonical event — calendars reference this by event_id only.
 */
export type CalendarEvent = {
  event_id: string;
  event_slug: string;
  title: string;
  short_description: string;
  /** Soft-beta alias for full_description / description */
  description: string;
  full_description?: string;
  event_type: CalendarEventType;
  /** Soft-beta operational alias — also mirror operational_status */
  status: CalendarEventStatus;
  operational_status: OperationalStatus;
  approval_status: ApprovalStatus;
  publication_status: PublicationStatus;
  kelly_attendance_status: KellyAttendanceStatus;
  /** Soft-beta Kelly alias */
  kelly_status: KellyStatus | null;
  start_at: string;
  end_at: string;
  /** Soft-beta aliases */
  start_time: string;
  end_time: string;
  timezone: string;
  time_zone: string;
  all_day: boolean;
  location_name: string | null;
  location: string | null;
  street_address: string | null;
  city: string | null;
  county: string | null;
  county_slug: string | null;
  state: string;
  postal_code: string | null;
  virtual_url: string | null;
  location_type: "in_person" | "virtual" | "hybrid" | "tbd";
  visibility: "public" | "team" | "command" | "internal" | "private";
  public_summary: string | null;
  internal_notes: string | null;
  created_by: string;
  owned_by_team: string | null;
  primary_contact: string | null;
  created_at: string;
  updated_at: string;
  /** Scopes — references, not copies */
  campaign_wide: boolean;
  college_slugs: string[];
  county_slugs: string[];
  city_slugs: string[];
  team_ids: string[];
  position_ids: string[];
  audience_tags: string[];
  calendar_scope_ids: CalendarLevelId[];
  /** Soft-beta single-field mirrors */
  college_slug: string | null;
  scope: "statewide" | "college" | "county" | "city" | "campaign";
  kelly_requested: boolean;
  kelly_arrival_time: string | null;
  kelly_departure_time: string | null;
  kelly_role: string | null;
  candidate_brief_required: boolean;
  candidate_brief_status: string | null;
  travel_required: boolean;
  security_or_private_notes: string | null;
  volunteers_needed: number;
  volunteers_confirmed: number;
  volunteer_slots_open: number;
  volunteer_slots_filled: number;
  volunteer_roles: VolunteerRoleRequirement[];
  shifts: VolunteerShift[];
  shift_required: boolean;
  staffing_status: StaffingStatus;
  volunteer_manager: string | null;
  check_in_instructions: string | null;
  training_required: boolean;
  approval_stage: string | null;
  approval_owner: string | null;
  submitted_at: string | null;
  reviewed_at: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  revision_requested_at: string | null;
  approval_notes: string | null;
  approval_history: ApprovalAction[];
  public_publish_status: PublicationStatus;
  public_publish_at: string | null;
  public_calendar_enabled: boolean;
  social_promotion_enabled: boolean;
  college_calendar_enabled: boolean;
  county_calendar_enabled: boolean;
  campaign_calendar_enabled: boolean;
  candidate_calendar_enabled: boolean;
  volunteer_calendar_enabled: boolean;
  conflict_state: ConflictState;
  conflict_ids: string[];
  related_goal_ids: string[];
  related_team: string | null;
  related_position: string | null;
  attachments: { label: string; href: string }[];
  assigned_human_ids: string[];
  history: { at: string; note: string }[];
  external_sync: ExternalSyncRecord[];
  /** Future city readiness — always present even when empty */
  city_ready: true;
};

export type VolunteerNeed = {
  event_id: string;
  role: string;
  role_id?: string;
  slots_open: number;
  slots_filled: number;
  training_required?: boolean;
  event_title?: string;
  start_at?: string;
  college_slug?: string | null;
  county_slug?: string | null;
};

export type KellyRequest = {
  event_id: string;
  status: KellyStatus;
  title: string;
  city: string | null;
  county_slug: string | null;
  start_time: string;
  public_safe_label?: string;
};

export type PendingApproval = {
  event_id: string;
  title: string;
  proposed_by: string;
  submitted_at: string;
  stage?: string | null;
};

export type CalendarConflict = {
  conflict_id: string;
  event_ids: string[];
  summary: string;
  severity: "low" | "medium" | "high";
  state?: ConflictState;
};

export type MonthGridCell = {
  date: string;
  inMonth: boolean;
  events: CalendarEvent[];
};

export type ProposeEventInput = {
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  event_type: CalendarEventType;
  location?: string;
  city?: string;
  county_slug?: string | null;
  college_slug?: string | null;
  city_slug?: string | null;
  scope?: CalendarEvent["scope"];
  kelly_requested?: boolean;
  volunteers_needed?: number;
  volunteer_roles?: { title: string; number_needed: number }[];
};
