export const PUBLIC_PRIVACY_COPY = {
  headline: "Public calendar privacy",
  body: "Only published public events appear here. Candidate travel, lodging, security notes, and unpublished holds stay off public calendars.",
  footnote: "Kelly language is limited to approved public phrases. Interest is not assignment.",
} as const;

export const CALENDAR_HONESTY = {
  status: "soft beta",
  working_now: [
    "One canonical event catalog referenced by universal, college, county, Event Board, and Kelly views",
    "Month / week / list / volunteer-needs / pending / propose flows",
    "Separate operational, approval, Kelly, and publication states",
    "Volunteer role needs with interest honesty",
    "ICS export-ready architecture (export routes)",
  ],
  still_being_completed: [
    "Postgres persistence for proposals and approvals",
    "Production RBAC on internal sections",
    "Automatic Google / Apple / Outlook writes",
    "Automated email or text reminders",
    "Full shift assignment confirmation workflow",
    "Active city dashboards (schema ready)",
  ],
} as const;
