/**
 * CAE-11.6-W6 — Calendar events
 */
export const CALENDAR_EVENT_CATALOG = [
  { event: "calendar.created", domain: "calendar", description: "Canonical institutional calendar created" },
  { event: "event.created", domain: "event", description: "Calendar event created" },
  { event: "event.updated", domain: "event", description: "Calendar event updated" },
  { event: "event.confirmed", domain: "event", description: "Event approved and confirmed" },
  { event: "event.cancelled", domain: "event", description: "Event cancelled" },
  { event: "event.completed", domain: "event", description: "Event completed" },
  { event: "reservation.created", domain: "reservation", description: "Resource reservation on canonical calendar" },
  { event: "reservation.cancelled", domain: "reservation", description: "Reservation cancelled" },
  { event: "conflict.detected", domain: "conflict", description: "Scheduling conflict detected" },
  { event: "travel.updated", domain: "travel", description: "Travel window calculated" },
  { event: "calendar.synced", domain: "sync", description: "External calendar synchronized" },
  { event: "deadline.approaching", domain: "deadline", description: "Deadline approaching" },
] as const;
