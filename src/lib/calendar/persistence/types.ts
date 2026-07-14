import type { CalendarEvent } from "../types";

export type AuditAction =
  | "create"
  | "update"
  | "cancel"
  | "postpone"
  | "approval_submission"
  | "approval_decision"
  | "candidate_request"
  | "candidate_decision"
  | "scope_change"
  | "staffing_change"
  | "shift_assignment"
  | "publication"
  | "unpublication"
  | "event_completion"
  | "report_submission"
  | "seed_import"
  | "denied_action";

export type CalendarRepository = {
  getEventById(eventId: string): Promise<CalendarEvent | null>;
  listEvents(): Promise<CalendarEvent[]>;
  listEventIds(): Promise<string[]>;
  countScopes(): Promise<number>;
  importSeedEvent(event: CalendarEvent, opts?: { actor?: string }): Promise<"inserted" | "skipped" | "conflict">;
  getAuditCount(eventId?: string): Promise<number>;
  shadowCompare(seed: CalendarEvent[]): Promise<{
    matching_ids: string[];
    missing_in_store: string[];
    extra_in_store: string[];
    scope_mismatches: string[];
  }>;
};

export type DurableEventRow = {
  event_id: string;
  event_slug: string;
  title: string;
  short_description: string;
  full_description: string;
  event_type: string;
  operational_status: string;
  approval_status: string;
  candidate_attendance_status: string | null;
  publication_status: string;
  start_at: string;
  end_at: string;
  timezone: string;
  all_day: boolean;
  location_type: string;
  location_name: string | null;
  street_address: string | null;
  city: string | null;
  county: string | null;
  state: string;
  postal_code: string | null;
  virtual_url: string | null;
  visibility: string;
  public_summary: string | null;
  internal_notes: string | null;
  owned_by_team_id: string | null;
  version: number;
  durable_edit: boolean;
  import_source: string | null;
};

export function eventToDurableParts(event: CalendarEvent) {
  const scopes = [
    ...event.calendar_scope_ids.map((s) => ({
      scope_type: mapLevelToScopeType(s),
      scope_key: s === "college_community" && event.college_slug ? event.college_slug : s === "county" && event.county_slug ? event.county_slug : "campaign",
      is_primary: false,
    })),
    ...event.college_slugs.map((slug) => ({ scope_type: "college" as const, scope_key: slug, is_primary: true })),
    ...event.county_slugs.map((slug) => ({ scope_type: "county" as const, scope_key: slug, is_primary: false })),
    ...event.city_slugs.map((slug) => ({ scope_type: "city" as const, scope_key: slug, is_primary: false })),
  ];

  // de-dupe
  const seen = new Set<string>();
  const uniqueScopes = scopes.filter((s) => {
    const k = `${s.scope_type}:${s.scope_key}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  return {
    row: {
      event_id: event.event_id,
      event_slug: event.event_slug,
      title: event.title,
      short_description: event.short_description,
      full_description: event.full_description ?? event.description,
      event_type: event.event_type,
      operational_status: event.operational_status,
      approval_status: String(event.approval_status ?? "not_submitted"),
      candidate_attendance_status: event.kelly_attendance_status,
      publication_status: event.publication_status,
      start_at: event.start_at,
      end_at: event.end_at,
      timezone: event.timezone,
      all_day: event.all_day,
      location_type: event.location_type,
      location_name: event.location_name,
      street_address: event.street_address,
      city: event.city,
      county: event.county,
      state: event.state,
      postal_code: event.postal_code,
      virtual_url: event.virtual_url,
      visibility: event.visibility,
      public_summary: event.public_summary,
      internal_notes: event.internal_notes,
      owned_by_team_id: event.owned_by_team,
      version: 1,
      durable_edit: false,
      import_source: "seed",
    } satisfies DurableEventRow,
    scopes: uniqueScopes,
    candidate:
      event.kelly_requested || (event.kelly_attendance_status && event.kelly_attendance_status !== "not_requested")
        ? {
            kelly_requested: event.kelly_requested,
            attendance_status: event.kelly_attendance_status,
            requested_arrival_at: event.kelly_arrival_time,
            requested_departure_at: event.kelly_departure_time,
            candidate_role: event.kelly_role,
            brief_required: event.candidate_brief_required,
            brief_status: event.candidate_brief_status,
            travel_required: event.travel_required,
            private_travel_notes: event.security_or_private_notes,
            private_security_notes: event.security_or_private_notes,
          }
        : null,
    requirements: event.volunteer_roles.map((r) => ({
      role_key: r.role_id,
      role_title: r.title,
      number_needed: r.number_needed,
      number_confirmed: r.number_confirmed,
      training_required: r.training_required,
    })),
    publication: {
      public_enabled: event.public_calendar_enabled,
      public_title: event.title,
      public_summary: event.public_summary,
      publish_status: event.publication_status,
      ics_enabled: true,
    },
  };
}

function mapLevelToScopeType(level: string): string {
  if (level === "college_community" || level === "college_command") return "college";
  if (level === "candidate") return "candidate";
  if (level === "volunteer_management") return "volunteer";
  if (level === "universal" || level === "campaign_operations") return "campaign";
  if (level === "public") return "public";
  if (level === "city") return "city";
  if (level === "county") return "county";
  return level;
}
