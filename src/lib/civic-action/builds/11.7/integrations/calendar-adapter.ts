/**
 * CAE-11.7-W5 — Calendar adapter (one-way; no lifecycle mutation)
 */
import { readStoreSlice, writeStoreSlice } from "../services/repository";
import type { CommunicationEventOutboxRecord } from "../services/events";
import { caeId, nowIso } from "../../../utils";

export type CommunicationCalendarEntry = {
  entry_id: string;
  event_id: string;
  entry_type: string;
  initiative_id: string;
  conversation_id: string;
  entity_id: string;
  title: string;
  scheduled_at: string | null;
  created_at: string;
  /** Calendar sync is schedule-only; never mutates communication lifecycle */
  lifecycle_mutation_allowed: false;
};

const CALENDAR_KEY = "communication_calendar_queue";

const CALENDAR_MAP: Record<string, string> = {
  "communication.meeting_created": "meeting.scheduled",
  "communication.announcement_published": "announcement.effective",
};

export function handleCommunicationCalendarEvent(record: CommunicationEventOutboxRecord) {
  const entryType = CALENDAR_MAP[record.event_type];
  if (!entryType) return null;

  const entry: CommunicationCalendarEntry = {
    entry_id: caeId("cal"),
    event_id: record.event_id,
    entry_type: entryType,
    initiative_id: (record.payload.initiative_id as string) ?? "",
    conversation_id: (record.payload.conversation_id as string) ?? record.entity_id,
    entity_id: record.entity_id,
    title: (record.payload.display_name as string) ?? entryType,
    scheduled_at: (record.payload.scheduled_at as string) ?? (record.payload.effective_date as string) ?? null,
    created_at: nowIso(),
    lifecycle_mutation_allowed: false,
  };

  const queue = readStoreSlice<CommunicationCalendarEntry>(CALENDAR_KEY);
  queue.push(entry);
  writeStoreSlice(CALENDAR_KEY, queue);
  return entry;
}

export function listCommunicationCalendarQueue(limit = 50) {
  return readStoreSlice<CommunicationCalendarEntry>(CALENDAR_KEY).slice(-limit);
}
