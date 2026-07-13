/**
 * CAE-11.6-W6 — Universal Calendar & Time Intelligence Constitution (OPS-001)
 */
export const OPS_CALENDAR_PRINCIPLE =
  "Time belongs to the Institution, not to individual modules. There is one canonical Time Engine that every module uses.";

export const TIME_ARCHITECTURE = [
  "canonical_time_engine",
  "mission_view",
  "personal_view",
  "department_view",
  "organization_view",
  "resource_view",
  "executive_view",
  "external_sync",
] as const;

export const EVENT_CATEGORIES = [
  "mission",
  "meeting",
  "training",
  "volunteer",
  "election",
  "campaign",
  "deadline",
  "reminder",
  "travel",
  "maintenance",
  "reservation",
  "facility",
  "personal",
  "holiday",
  "emergency",
  "executive",
  "community",
  "learning",
  "certification",
  "review",
  "interview",
  "recruitment",
  "custom",
] as const;

export const EVENT_LIFECYCLE = [
  "draft",
  "awaiting_approval",
  "scheduled",
  "confirmed",
  "active",
  "completed",
  "cancelled",
  "archived",
] as const;

export const CALENDAR_VIEWS = [
  "agenda",
  "day",
  "week",
  "month",
  "quarter",
  "year",
  "timeline",
  "mission",
  "team",
  "department",
  "organization",
  "resource",
  "map",
  "executive",
  "ai_focus",
] as const;

export const DEADLINE_TYPES = [
  "hard",
  "soft",
  "suggested",
  "regulatory",
  "legal",
  "campaign",
  "election",
  "training",
  "renewal",
] as const;

export const REQUIRED_CALENDAR_SERVICES = [
  "CalendarService",
  "EventService",
  "SchedulingService",
  "AvailabilityService",
  "TimeZoneService",
  "TravelService",
  "ConflictDetectionService",
  "ReservationCalendarService",
  "ReminderService",
  "RecurringEventService",
  "DeadlineService",
  "ExternalSyncService",
  "TimelineService",
  "TimeIntelligenceService",
  "AISchedulingAdvisorService",
] as const;

export const CALENDAR_COMMANDS = [
  "CreateEvent",
  "UpdateEvent",
  "ApproveEvent",
  "CancelEvent",
  "RescheduleEvent",
  "ReserveResource",
  "ReleaseReservation",
  "CreateRecurringSeries",
  "CalculateTravel",
  "ResolveConflict",
  "SyncExternalCalendar",
  "PublishCalendar",
] as const;

export const CALENDAR_AI_MAY_NOT = [
  "Silently schedule executive decisions",
  "Override personal privacy without consent",
  "Create events without audit trail",
  "Bypass conflict detection for high-impact events",
  "Replace canonical calendar with external systems",
] as const;

export function getCalendarConstitution() {
  return {
    system_id: "OPS-001",
    build: "11.6",
    wave: "11.6-W6",
    governing_principle: OPS_CALENDAR_PRINCIPLE,
    architecture: [...TIME_ARCHITECTURE],
    event_categories: [...EVENT_CATEGORIES],
    calendar_views: [...CALENDAR_VIEWS],
    required_services: [...REQUIRED_CALENDAR_SERVICES],
    commands: [...CALENDAR_COMMANDS],
    ai_may_not: [...CALENDAR_AI_MAY_NOT],
    api_namespace: "/api/v1/calendar",
  };
}
