import { buildCanonicalEvent } from "./canonical";
import { requireCalendarPermission } from "./rbac/guards";
import { emptyActor } from "./rbac/types";
import { SEED_EVENTS } from "./seed";
import type { CalendarEvent, CalendarScope, ProposeEventInput } from "./types";

let proposedEvents: CalendarEvent[] = [];

function normalizeDatetime(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    return `${value}:00-05:00`;
  }
  return value;
}

export function allCanonicalEvents(): CalendarEvent[] {
  return [...SEED_EVENTS, ...proposedEvents];
}

/** Invariant: each event_id appears once in the catalog. */
export function assertNoDuplicateEventIds(events = allCanonicalEvents()): string[] {
  const seen = new Set<string>();
  const dupes: string[] = [];
  for (const e of events) {
    if (seen.has(e.event_id)) dupes.push(e.event_id);
    seen.add(e.event_id);
  }
  return dupes;
}

export function listEventScopeReferences(eventId: string): CalendarEvent["calendar_scope_ids"] {
  return getEventById(eventId)?.calendar_scope_ids ?? [];
}

export function listEventsForScope(scope: CalendarScope): CalendarEvent[] {
  const events = allCanonicalEvents();
  switch (scope.kind) {
    case "public":
      return events.filter(
        (e) =>
          e.public_calendar_enabled &&
          (e.publication_status === "published" || e.publication_status === "scheduled_for_publication") &&
          e.visibility === "public",
      );
    case "universal":
      return events.filter(
        (e) =>
          e.campaign_calendar_enabled &&
          e.calendar_scope_ids.includes("universal") &&
          e.visibility !== "private",
      );
    case "college":
      return events.filter(
        (e) =>
          e.college_calendar_enabled &&
          (e.college_slugs.includes(scope.collegeSlug) || e.college_slug === scope.collegeSlug),
      );
    case "county":
      return events.filter(
        (e) =>
          e.county_calendar_enabled &&
          (e.county_slugs.includes(scope.countySlug) || e.county_slug === scope.countySlug),
      );
    case "city":
      return events.filter((e) => e.city_slugs.includes(scope.citySlug));
    case "kelly":
      return events.filter(
        (e) =>
          e.candidate_calendar_enabled &&
          e.kelly_attendance_status &&
          e.kelly_attendance_status !== "not_requested",
      );
    case "volunteer":
      return events.filter((e) => e.volunteer_calendar_enabled && e.volunteers_needed > 0);
    case "command":
      return events;
    default:
      return events;
  }
}

export function getEventById(eventId: string): CalendarEvent | null {
  return allCanonicalEvents().find((e) => e.event_id === eventId || e.event_slug === eventId) ?? null;
}

export function filterEvents(
  events: CalendarEvent[],
  filters: {
    status?: CalendarEvent["status"] | CalendarEvent["status"][];
    event_type?: CalendarEvent["event_type"];
    from?: string;
    to?: string;
    kelly_status?: CalendarEvent["kelly_status"];
    has_open_volunteers?: boolean;
    completed?: boolean;
    pending_approval?: boolean;
  },
): CalendarEvent[] {
  return events.filter((e) => {
    if (filters.status) {
      const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
      if (!statuses.includes(e.status) && !statuses.includes(e.operational_status as CalendarEvent["status"])) {
        return false;
      }
    }
    if (filters.event_type && e.event_type !== filters.event_type) return false;
    if (filters.kelly_status && e.kelly_status !== filters.kelly_status) return false;
    if (filters.from && e.start_at < filters.from) return false;
    if (filters.to && e.start_at > filters.to) return false;
    if (filters.has_open_volunteers && e.volunteer_slots_open <= 0) return false;
    if (filters.completed && e.operational_status !== "completed") return false;
    if (
      filters.pending_approval &&
      e.approval_status !== "pending" &&
      e.approval_status !== "submitted" &&
      e.approval_status !== "under_review"
    ) {
      return false;
    }
    return true;
  });
}

export function listMyScheduleEvents(humanId = "usr-demo-001"): CalendarEvent[] {
  return allCanonicalEvents().filter(
    (e) =>
      e.assigned_human_ids.includes(humanId) ||
      e.operational_status === "scheduled" ||
      e.operational_status === "confirmed",
  );
}

export function proposeEvent(input: ProposeEventInput): CalendarEvent {
  const college = input.college_slug ? [input.college_slug] : [];
  const county = input.county_slug ? [input.county_slug] : [];
  const city = input.city_slug ? [input.city_slug] : [];

  // CAL-P1.2 audit-only: evaluate + record; soft-beta write path remains authoritative.
  requireCalendarPermission({
    actor: emptyActor({
      authenticated: true,
      systemRoleKeys: college.length
        ? ["college_leader"]
        : county.length
          ? ["county_leader"]
          : city.length
            ? ["city_leader"]
            : ["volunteer_manager"],
      collegeSlugs: college,
      countySlugs: county,
      citySlugs: city,
      campaignWide: input.scope === "statewide",
    }),
    permission: "calendar.event.propose",
    resource: {
      collegeSlugs: college,
      countySlugs: county,
      citySlugs: city,
      operationalStatus: "draft",
      campaignWide: input.scope === "statewide",
    },
    context: {
      route: "/calendar/propose",
      method: "POST",
      source: "server_action",
      isMutation: true,
    },
    actualBehavior: "allowed",
  });

  const start = normalizeDatetime(input.start_time);
  const end = normalizeDatetime(input.end_time);
  const roles = (input.volunteer_roles ?? []).map((r, i) => ({
    role_id: `role-${i + 1}`,
    title: r.title,
    number_needed: r.number_needed,
    number_confirmed: 0,
    training_required: false,
  }));

  const event = buildCanonicalEvent({
    event_id: `evt-proposed-${Date.now()}`,
    title: input.title,
    description: input.description,
    event_type: input.event_type,
    operational_status: "proposed",
    approval_status: "submitted",
    publication_status: "private_draft",
    start_at: start,
    end_at: end,
    location_name: input.location ?? null,
    city: input.city ?? null,
    county_slug: input.county_slug ?? null,
    college_slugs: college,
    county_slugs: county,
    city_slugs: city,
    campaign_wide: input.scope === "statewide",
    visibility: "team",
    kelly_requested: Boolean(input.kelly_requested),
    kelly_attendance_status: input.kelly_requested ? "requested" : "not_requested",
    volunteer_roles: roles.length
      ? roles
      : input.volunteers_needed
        ? [
            {
              role_id: "general",
              title: "Volunteer",
              number_needed: input.volunteers_needed,
              number_confirmed: 0,
              training_required: false,
            },
          ]
        : [],
    history: [{ at: new Date().toISOString(), note: "Soft-beta proposal submitted (session-local)." }],
  });

  proposedEvents = [event, ...proposedEvents];
  return event;
}

export function groupEventsByCityCounty(events: CalendarEvent[]) {
  const map = new Map<string, CalendarEvent[]>();
  for (const e of events) {
    const key = [e.city ?? "Unspecified city", e.county_slug ?? e.county ?? "Unspecified county"].join(" · ");
    const list = map.get(key) ?? [];
    list.push(e);
    map.set(key, list);
  }
  return [...map.entries()].map(([label, items]) => ({ label, events: items }));
}

/** Public-safe Kelly language — never expose private travel or security notes. */
export function publicKellyLabel(event: CalendarEvent): string | null {
  const s = event.kelly_attendance_status;
  if (!s || s === "not_requested" || s === "declined" || s === "canceled") return null;
  if (s === "confirmed" || s === "completed") return "Kelly is scheduled to attend";
  if (s === "hold_placed" || s === "tentatively_accepted") return "Special guest to be announced";
  return "Kelly attendance requested";
}

export function stripPrivateCandidateFields(event: CalendarEvent): Partial<CalendarEvent> {
  return {
    event_id: event.event_id,
    title: event.title,
    public_summary: event.public_summary,
    start_at: event.start_at,
    end_at: event.end_at,
    location_name: event.visibility === "public" ? event.location_name : null,
    kelly_attendance_status: event.kelly_attendance_status,
  };
}
