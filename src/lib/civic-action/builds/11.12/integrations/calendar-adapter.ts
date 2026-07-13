/**
 * CAE-11.12-W5 — Calendar adapter (one-way schedule requests)
 */
import { caeId, nowIso } from "../../../utils";
import { readStoreSlice, writeStoreSlice } from "../services/repository";
import type { KnowledgeEventOutboxRecord } from "../services/events";

export type KnowledgeCalendarEntry = {
  entry_id: string;
  institution_id: string;
  event_type: string;
  title: string;
  scheduled_at: string | null;
  source_event_id: string;
  lifecycle_mutation_allowed: false;
};

const CAL_KEY = "knowledge_calendar_entries";

const CALENDAR_EVENTS = new Set([
  "knowledge.course_version_published",
  "knowledge.enrollment_created",
  "knowledge.assessment_attempt_started",
]);

export function handleKnowledgeCalendarEvent(record: KnowledgeEventOutboxRecord): KnowledgeCalendarEntry | null {
  if (!CALENDAR_EVENTS.has(record.event_type)) return null;
  const entry: KnowledgeCalendarEntry = {
    entry_id: caeId("kcal"),
    institution_id: (record.payload.institution_id as string) ?? "",
    event_type: record.event_type,
    title: (record.payload.display_name as string) ?? record.event_type,
    scheduled_at: (record.payload.scheduled_at as string) ?? null,
    source_event_id: record.event_id,
    lifecycle_mutation_allowed: false,
  };
  const entries = readStoreSlice<KnowledgeCalendarEntry>(CAL_KEY);
  entries.push(entry);
  writeStoreSlice(CAL_KEY, entries);
  return entry;
}
