/**
 * CAE-11.6-W6 — Calendar & time intelligence data model
 */
import type { DEADLINE_TYPES, EVENT_CATEGORIES, EVENT_LIFECYCLE } from "./constitution";

export type EventCategory = (typeof EVENT_CATEGORIES)[number];
export type EventLifecycle = (typeof EVENT_LIFECYCLE)[number];
export type DeadlineType = (typeof DEADLINE_TYPES)[number];

export interface CanonicalCalendarRecord {
  calendar_id: string;
  institution_id: string;
  calendar_type: "institutional";
  owner_human_id: string;
  visibility: "institution" | "restricted" | "executive_only";
  time_zone: string;
  locale: string;
  status: "active" | "archived";
  created_at: string;
  updated_at: string;
}

export interface CalendarEventRecord {
  event_id: string;
  calendar_id: string;
  institution_id: string;
  event_type: EventCategory;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  time_zone: string;
  all_day: boolean;
  recurring: boolean;
  recurring_series_id: string | null;
  priority: "low" | "normal" | "high" | "critical";
  status: EventLifecycle;
  visibility: "public" | "institution" | "mission" | "team" | "personal" | "executive_only";
  mission_id: string | null;
  resource_ids: string[];
  human_ids: string[];
  organization_unit_ids: string[];
  location: string | null;
  virtual_location: string | null;
  created_by: string;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface AvailabilityRuleRecord {
  rule_id: string;
  institution_id: string;
  human_id: string;
  working_hours_start: string;
  working_hours_end: string;
  preferred_hours_start: string;
  preferred_hours_end: string;
  time_zone: string;
  updated_at: string;
}

export interface TravelWindowRecord {
  travel_id: string;
  institution_id: string;
  event_id: string;
  origin: string;
  destination: string;
  travel_minutes: number;
  buffer_minutes: number;
  preparation_minutes: number;
  return_travel_minutes: number;
  computed_at: string;
}

export interface RecurringSeriesRecord {
  series_id: string;
  institution_id: string;
  calendar_id: string;
  pattern: "daily" | "weekly" | "monthly" | "quarterly" | "annual" | "custom";
  interval: number;
  title: string;
  event_type: EventCategory;
  start_time: string;
  end_time: string;
  exceptions: string[];
  created_at: string;
}

export interface ReminderRecord {
  reminder_id: string;
  event_id: string;
  institution_id: string;
  human_id: string;
  reminder_type: "notification" | "email" | "sms" | "push" | "ai_briefing";
  minutes_before: number;
  status: "scheduled" | "sent" | "cancelled";
}

export interface DeadlineRecord {
  deadline_id: string;
  institution_id: string;
  mission_id: string | null;
  title: string;
  due_at: string;
  deadline_type: DeadlineType;
  event_id: string | null;
  status: "upcoming" | "approaching" | "passed" | "met";
}

export interface ExternalSyncRecord {
  sync_id: string;
  institution_id: string;
  human_id: string;
  provider: "google" | "outlook" | "apple" | "ics" | "caldav" | "exchange";
  direction: "inbound" | "outbound" | "bidirectional";
  last_synced_at: string | null;
  status: "active" | "paused" | "error";
}

export interface CalendarConflictRecord {
  conflict_id: string;
  institution_id: string;
  conflict_type: "double_booking" | "travel_impossible" | "resource_overlap" | "facility_overlap" | "missing_resource" | "unavailable_participant";
  event_ids: string[];
  resource_ids: string[];
  human_ids: string[];
  explanation: string;
  detected_at: string;
  resolved: boolean;
}

export const CALENDAR_STORE_KEYS = {
  calendars: "ops_canonical_calendars",
  events: "ops_calendar_events",
  availability: "ops_availability_rules",
  travel: "ops_travel_windows",
  recurring: "ops_recurring_series",
  reminders: "ops_calendar_reminders",
  deadlines: "ops_calendar_deadlines",
  external_sync: "ops_external_calendar_sync",
  conflicts: "ops_calendar_conflicts",
} as const;
