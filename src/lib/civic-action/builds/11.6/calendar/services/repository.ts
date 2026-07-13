/**
 * CAE-11.6-W6 — Calendar persistence
 */
export { readStoreSlice, writeStoreSlice } from "../../../11.1/services/repository";
import { readStoreSlice, writeStoreSlice } from "../../../11.1/services/repository";
import type {
  AvailabilityRuleRecord,
  CalendarConflictRecord,
  CalendarEventRecord,
  CanonicalCalendarRecord,
  DeadlineRecord,
  ExternalSyncRecord,
  RecurringSeriesRecord,
  ReminderRecord,
  TravelWindowRecord,
} from "../data-model";
import { CALENDAR_STORE_KEYS } from "../data-model";

function upsertById<T>(key: string, record: T, idField: keyof T & string) {
  const items = readStoreSlice<T>(key);
  const id = String(record[idField]);
  const idx = items.findIndex((i) => String(i[idField]) === id);
  if (idx >= 0) items[idx] = record;
  else items.push(record);
  writeStoreSlice(key, items);
}

export function getCanonicalCalendar(institutionId: string) {
  return readStoreSlice<CanonicalCalendarRecord>(CALENDAR_STORE_KEYS.calendars).find((c) => c.institution_id === institutionId) ?? null;
}

export function saveCanonicalCalendar(record: CanonicalCalendarRecord) {
  upsertById(CALENDAR_STORE_KEYS.calendars, record, "calendar_id");
}

export function listCalendarEvents(institutionId: string, filters?: {
  missionId?: string;
  humanId?: string;
  resourceId?: string;
  from?: string;
  to?: string;
}) {
  return readStoreSlice<CalendarEventRecord>(CALENDAR_STORE_KEYS.events).filter((e) => {
    if (e.institution_id !== institutionId) return false;
    if (filters?.missionId && e.mission_id !== filters.missionId) return false;
    if (filters?.humanId && !e.human_ids.includes(filters.humanId)) return false;
    if (filters?.resourceId && !e.resource_ids.includes(filters.resourceId)) return false;
    if (filters?.from && new Date(e.end_time) < new Date(filters.from)) return false;
    if (filters?.to && new Date(e.start_time) > new Date(filters.to)) return false;
    return true;
  });
}

export function getCalendarEvent(eventId: string) {
  return readStoreSlice<CalendarEventRecord>(CALENDAR_STORE_KEYS.events).find((e) => e.event_id === eventId) ?? null;
}

export function saveCalendarEvent(record: CalendarEventRecord) {
  upsertById(CALENDAR_STORE_KEYS.events, record, "event_id");
}

export function listAvailabilityRules(institutionId: string, humanId?: string) {
  return readStoreSlice<AvailabilityRuleRecord>(CALENDAR_STORE_KEYS.availability).filter(
    (r) => r.institution_id === institutionId && (!humanId || r.human_id === humanId)
  );
}

export function saveAvailabilityRule(record: AvailabilityRuleRecord) {
  upsertById(CALENDAR_STORE_KEYS.availability, record, "rule_id");
}

export function listTravelWindows(institutionId: string, eventId?: string) {
  return readStoreSlice<TravelWindowRecord>(CALENDAR_STORE_KEYS.travel).filter(
    (t) => t.institution_id === institutionId && (!eventId || t.event_id === eventId)
  );
}

export function saveTravelWindow(record: TravelWindowRecord) {
  upsertById(CALENDAR_STORE_KEYS.travel, record, "travel_id");
}

export function listRecurringSeries(institutionId: string) {
  return readStoreSlice<RecurringSeriesRecord>(CALENDAR_STORE_KEYS.recurring).filter((s) => s.institution_id === institutionId);
}

export function saveRecurringSeries(record: RecurringSeriesRecord) {
  upsertById(CALENDAR_STORE_KEYS.recurring, record, "series_id");
}

export function listReminders(institutionId: string, eventId?: string) {
  return readStoreSlice<ReminderRecord>(CALENDAR_STORE_KEYS.reminders).filter(
    (r) => r.institution_id === institutionId && (!eventId || r.event_id === eventId)
  );
}

export function saveReminder(record: ReminderRecord) {
  upsertById(CALENDAR_STORE_KEYS.reminders, record, "reminder_id");
}

export function listDeadlines(institutionId: string, missionId?: string) {
  return readStoreSlice<DeadlineRecord>(CALENDAR_STORE_KEYS.deadlines).filter(
    (d) => d.institution_id === institutionId && (!missionId || d.mission_id === missionId)
  );
}

export function saveDeadline(record: DeadlineRecord) {
  upsertById(CALENDAR_STORE_KEYS.deadlines, record, "deadline_id");
}

export function listExternalSync(institutionId: string, humanId?: string) {
  return readStoreSlice<ExternalSyncRecord>(CALENDAR_STORE_KEYS.external_sync).filter(
    (s) => s.institution_id === institutionId && (!humanId || s.human_id === humanId)
  );
}

export function saveExternalSync(record: ExternalSyncRecord) {
  upsertById(CALENDAR_STORE_KEYS.external_sync, record, "sync_id");
}

export function listConflicts(institutionId: string, resolved?: boolean) {
  return readStoreSlice<CalendarConflictRecord>(CALENDAR_STORE_KEYS.conflicts).filter(
    (c) => c.institution_id === institutionId && (resolved === undefined || c.resolved === resolved)
  );
}

export function saveConflict(record: CalendarConflictRecord) {
  upsertById(CALENDAR_STORE_KEYS.conflicts, record, "conflict_id");
}

export function eventsOverlap(a: { start_time: string; end_time: string }, b: { start_time: string; end_time: string }) {
  return new Date(a.start_time) < new Date(b.end_time) && new Date(b.start_time) < new Date(a.end_time);
}
