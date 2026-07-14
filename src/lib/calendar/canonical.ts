import type {
  ApprovalAction,
  CalendarEvent,
  CalendarEventType,
  CalendarLevelId,
  ConflictState,
  KellyAttendanceStatus,
  OperationalStatus,
  PublicationStatus,
  StaffingStatus,
  VolunteerRoleRequirement,
  VolunteerShift,
} from "./types";

type SeedInput = {
  event_id: string;
  event_slug?: string;
  title: string;
  short_description?: string;
  description: string;
  event_type: CalendarEventType;
  operational_status: OperationalStatus;
  approval_status?: CalendarEvent["approval_status"];
  publication_status?: PublicationStatus;
  kelly_attendance_status?: KellyAttendanceStatus;
  start_at: string;
  end_at: string;
  location_name?: string | null;
  street_address?: string | null;
  city?: string | null;
  county?: string | null;
  county_slug?: string | null;
  college_slugs?: string[];
  county_slugs?: string[];
  city_slugs?: string[];
  campaign_wide?: boolean;
  calendar_scope_ids?: CalendarLevelId[];
  visibility?: CalendarEvent["visibility"];
  volunteer_roles?: VolunteerRoleRequirement[];
  shifts?: VolunteerShift[];
  staffing_status?: StaffingStatus;
  kelly_requested?: boolean;
  kelly_role?: string | null;
  travel_required?: boolean;
  security_or_private_notes?: string | null;
  kelly_arrival_time?: string | null;
  kelly_departure_time?: string | null;
  public_summary?: string | null;
  internal_notes?: string | null;
  owned_by_team?: string | null;
  primary_contact?: string | null;
  approval_history?: ApprovalAction[];
  conflict_ids?: string[];
  conflict_state?: ConflictState;
  assigned_human_ids?: string[];
  history?: { at: string; note: string }[];
  volunteer_manager?: string | null;
};

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function operationalToLegacy(status: OperationalStatus): CalendarEvent["status"] {
  if (status === "canceled") return "cancelled";
  if (status === "tentative") return "hold";
  return status as CalendarEvent["status"];
}

function kellyToLegacy(status: KellyAttendanceStatus): CalendarEvent["kelly_status"] {
  if (!status || status === "not_requested") return null;
  if (status === "requested" || status === "under_review") return "request";
  if (status === "hold_placed" || status === "tentatively_accepted") return "hold";
  if (status === "confirmed" || status === "completed") return "confirmed";
  return "request";
}

export function buildCanonicalEvent(input: SeedInput): CalendarEvent {
  const college_slugs = input.college_slugs ?? [];
  const county_slugs = input.county_slugs ?? (input.county_slug ? [input.county_slug] : []);
  const city_slugs = input.city_slugs ?? [];
  const roles = input.volunteer_roles ?? [];
  const volunteers_needed = roles.reduce((a, r) => a + r.number_needed, 0);
  const volunteers_confirmed = roles.reduce((a, r) => a + r.number_confirmed, 0);
  const campaign_wide = input.campaign_wide ?? false;
  const scopes: CalendarLevelId[] =
    input.calendar_scope_ids ??
    ([
      "universal",
      ...(campaign_wide || college_slugs.length || county_slugs.length ? ["volunteer_management"] : []),
      ...(college_slugs.length ? (["college_community", "college_command"] as CalendarLevelId[]) : []),
      ...(county_slugs.length ? (["county"] as CalendarLevelId[]) : []),
      ...(city_slugs.length ? (["city"] as CalendarLevelId[]) : []),
      ...(input.kelly_requested || (input.kelly_attendance_status && input.kelly_attendance_status !== "not_requested")
        ? (["candidate"] as CalendarLevelId[])
        : []),
    ] as CalendarLevelId[]);

  const uniqueScopes = [...new Set(scopes)];
  const publication = input.publication_status ?? "internal_only";
  const kelly = input.kelly_attendance_status ?? (input.kelly_requested ? "requested" : "not_requested");

  return {
    event_id: input.event_id,
    event_slug: input.event_slug ?? slugify(input.title),
    title: input.title,
    short_description: input.short_description ?? input.description.slice(0, 120),
    description: input.description,
    full_description: input.description,
    event_type: input.event_type,
    status: operationalToLegacy(input.operational_status),
    operational_status: input.operational_status,
    approval_status: input.approval_status ?? "not_submitted",
    publication_status: publication,
    kelly_attendance_status: kelly,
    kelly_status: kellyToLegacy(kelly),
    start_at: input.start_at,
    end_at: input.end_at,
    start_time: input.start_at,
    end_time: input.end_at,
    timezone: "America/Chicago",
    time_zone: "America/Chicago",
    all_day: false,
    location_name: input.location_name ?? null,
    location: input.location_name ?? null,
    street_address: input.street_address ?? null,
    city: input.city ?? null,
    county: input.county ?? null,
    county_slug: input.county_slug ?? county_slugs[0] ?? null,
    state: "AR",
    postal_code: null,
    virtual_url: null,
    location_type: input.location_name ? "in_person" : "tbd",
    visibility: input.visibility ?? "team",
    public_summary: input.public_summary ?? null,
    internal_notes: input.internal_notes ?? null,
    created_by: "seed",
    owned_by_team: input.owned_by_team ?? null,
    primary_contact: input.primary_contact ?? null,
    created_at: "2026-07-14T12:00:00-05:00",
    updated_at: "2026-07-14T12:00:00-05:00",
    campaign_wide,
    college_slugs,
    county_slugs,
    city_slugs,
    team_ids: [],
    position_ids: [],
    audience_tags: [],
    calendar_scope_ids: uniqueScopes,
    college_slug: college_slugs[0] ?? null,
    scope: campaign_wide
      ? "statewide"
      : college_slugs.length
        ? "college"
        : city_slugs.length
          ? "city"
          : county_slugs.length
            ? "county"
            : "campaign",
    kelly_requested: Boolean(input.kelly_requested || (kelly && kelly !== "not_requested")),
    kelly_arrival_time: input.kelly_arrival_time ?? null,
    kelly_departure_time: input.kelly_departure_time ?? null,
    kelly_role: input.kelly_role ?? null,
    candidate_brief_required: Boolean(input.kelly_requested),
    candidate_brief_status: input.kelly_requested ? "pending" : null,
    travel_required: Boolean(input.travel_required),
    security_or_private_notes: input.security_or_private_notes ?? null,
    volunteers_needed,
    volunteers_confirmed,
    volunteer_slots_open: Math.max(0, volunteers_needed - volunteers_confirmed),
    volunteer_slots_filled: volunteers_confirmed,
    volunteer_roles: roles,
    shifts: input.shifts ?? [],
    shift_required: (input.shifts?.length ?? 0) > 0 || roles.length > 0,
    staffing_status:
      input.staffing_status ??
      (volunteers_needed === 0
        ? "staffing_not_required"
        : volunteers_confirmed >= volunteers_needed
          ? "fully_staffed"
          : volunteers_confirmed === 0
            ? "no_staffing_plan"
            : volunteers_confirmed / volunteers_needed < 0.4
              ? "critical_shortage"
              : "needs_volunteers"),
    volunteer_manager: input.volunteer_manager ?? "Carol Eagan",
    check_in_instructions: null,
    training_required: roles.some((r) => r.training_required),
    approval_stage: input.approval_status === "approved" ? "complete" : "event_board",
    approval_owner: "Carol Eagan",
    submitted_at: input.approval_history?.[0]?.at ?? null,
    reviewed_at: null,
    approved_at: input.approval_status === "approved" ? input.history?.[0]?.at ?? null : null,
    rejected_at: null,
    revision_requested_at: null,
    approval_notes: null,
    approval_history: input.approval_history ?? [],
    public_publish_status: publication,
    public_publish_at: publication === "published" ? input.start_at : null,
    public_calendar_enabled: publication === "published" || publication === "scheduled_for_publication",
    social_promotion_enabled: false,
    college_calendar_enabled: college_slugs.length > 0 || campaign_wide,
    county_calendar_enabled: county_slugs.length > 0 || campaign_wide,
    campaign_calendar_enabled: true,
    candidate_calendar_enabled: Boolean(input.kelly_requested || kelly !== "not_requested"),
    volunteer_calendar_enabled: roles.length > 0,
    conflict_state: input.conflict_state ?? "no_conflict",
    conflict_ids: input.conflict_ids ?? [],
    related_goal_ids: [],
    related_team: input.owned_by_team ?? null,
    related_position: null,
    attachments: [],
    assigned_human_ids: input.assigned_human_ids ?? [],
    history: input.history ?? [],
    external_sync: [
      {
        provider: "ics",
        sync_direction: "export_only",
        sync_status: "ready",
        source_of_truth: "block_street",
        last_sync_at: null,
        external_calendar_id: null,
        external_event_id: null,
        sync_error: null,
      },
    ],
    city_ready: true,
  };
}
