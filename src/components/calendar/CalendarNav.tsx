import Link from "next/link";

const PUBLIC_LINKS = [
  ["/calendar/month", "Month"],
  ["/calendar/week", "Week"],
  ["/calendar/list", "List"],
  ["/calendar/map", "Map"],
  ["/calendar/my-volunteer-interests", "My interests"],
  ["/calendar/my-schedule", "My schedule"],
  ["/calendar/volunteer-needs", "Volunteer needs"],
  ["/calendar/kelly", "Kelly"],
  ["/calendar/pending", "Pending"],
  ["/calendar/create", "Propose"],
] as const;

const KELLY_LINKS = [
  ["/calendar/kelly/requests", "Requests"],
  ["/calendar/kelly/holds", "Holds"],
  ["/calendar/kelly/confirmed", "Confirmed"],
  ["/calendar/kelly/travel", "Travel"],
  ["/calendar/kelly/conflicts", "Conflicts"],
] as const;

export function CalendarNav({ base = "/calendar", variant = "public" }: { base?: string; variant?: "public" | "kelly" | "college" | "county" }) {
  const links =
    variant === "kelly"
      ? KELLY_LINKS
      : variant === "college"
        ? [
            [`${base}/calendar/month`, "Month"],
            [`${base}/calendar/list`, "List"],
            [`${base}/calendar/volunteer-needs`, "Volunteer needs"],
            [`${base}/calendar/propose`, "Propose"],
          ] as const
        : variant === "county"
          ? [
              [`${base}/calendar/month`, "Month"],
              [`${base}/calendar/list`, "List"],
              [`${base}/calendar/volunteer-needs`, "Volunteer needs"],
              [`${base}/calendar/propose`, "Propose"],
            ] as const
          : PUBLIC_LINKS;

  return (
    <nav className="flex flex-wrap gap-1.5 font-fieldSans text-xs font-semibold">
      {links.map(([href, label]) => (
        <Link
          key={href}
          href={href}
          className="rounded-md border border-white/20 px-2.5 py-1.5 text-field-mist/90 hover:bg-white/10 hover:text-white"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function EventSubnav({ eventId }: { eventId: string }) {
  const base = `/calendar/event/${eventId}`;
  const links = [
    ["", "Overview"],
    ["/edit", "Edit"],
    ["/staffing", "Staffing"],
    ["/tasks", "Tasks"],
    ["/preparation", "Preparation"],
    ["/rsvp", "RSVP"],
    ["/verification", "Verification"],
    ["/shifts", "Shifts"],
    ["/staffing/coverage", "Coverage"],
    ["/core-record", "Core record"],
    ["/approvals", "Approvals"],
    ["/lifecycle", "Lifecycle"],
    ["/history", "History"],
    ["/volunteer", "Volunteer"],
    ["/candidate-request", "Candidate request"],
    ["/report", "Report"],
  ] as const;

  return (
    <nav className="flex flex-wrap gap-1.5 font-fieldSans text-xs font-semibold">
      {links.map(([suffix, label]) => (
        <Link
          key={suffix || "overview"}
          href={`${base}${suffix}`}
          className="rounded-md border border-field-ink/15 bg-white px-2.5 py-1.5 text-field-ink/80 hover:border-field-pine/40"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function CommandCalendarNav() {
  const links = [
    ["/command/events", "Operations"],
    ["/command/events/today", "Today"],
    ["/command/events/upcoming", "Upcoming"],
    ["/command/events/attention", "Attention"],
    ["/command/events/readiness", "Readiness"],
    ["/command/events/at-risk", "At risk"],
    ["/command/events/unowned", "Unowned"],
    ["/command/events/reports-due", "Reports due"],
    ["/command/calendar", "Hub"],
    ["/command/events/calendar", "Event board"],
    ["/command/events/pending", "Pending"],
    ["/command/events/staffing", "Staffing"],
    ["/command/events/tasks", "Tasks"],
    ["/command/events/preparation", "Preparation"],
    ["/command/events/follow-up", "Follow-up"],
    ["/command/events/rsvp", "RSVP"],
    ["/command/events/verification", "Verification"],
    ["/command/events/candidate-requests", "Candidate requests"],
    ["/command/events/lifecycle", "Lifecycle"],
    ["/command/events/core-records", "Core records"],
    ["/command/events/conflicts", "Conflicts"],
    ["/command/events/approvals", "Approvals"],
    ["/command/events/volunteer-needs", "Volunteer needs"],
    ["/command/events/kelly-requests", "Kelly requests"],
    ["/command/events/completed", "Completed"],
    ["/command/campaign/calendar", "Campaign"],
    ["/command/campus/calendar", "Campus"],
    ["/command/managers/calendar", "Managers"],
  ] as const;

  return (
    <nav className="flex flex-wrap gap-1.5 font-fieldSans text-xs font-semibold">
      {links.map(([href, label]) => (
        <Link
          key={href}
          href={href}
          className="rounded-md border border-white/20 px-2.5 py-1.5 text-field-mist/90 hover:bg-white/10 hover:text-white"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
