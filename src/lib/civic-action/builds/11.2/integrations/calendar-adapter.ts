/**
 * CAE-11.2-W5 — Calendar adapter (one-way; no lifecycle mutation)
 */
import { readStoreSlice, writeStoreSlice } from "../services/repository";
import type { ExecutionEventOutboxRecord } from "../services/events";
import { caeId, nowIso } from "../../../utils";

export type ObjectiveCalendarEntry = {
  entry_id: string;
  event_id: string;
  entry_type: string;
  initiative_id: string;
  objective_id: string;
  entity_id: string;
  title: string;
  scheduled_at: string | null;
  created_at: string;
};

const CALENDAR_KEY = "objective_calendar_queue";

const CALENDAR_MAP: Record<string, string> = {
  "execution.objective_proposed": "objective.review",
  "execution.objective_activated": "objective.activation",
  "execution.mission_started": "mission.deadline",
  "execution.mission_completed": "mission.completed",
};

export function handleObjectiveCalendarEvent(record: ExecutionEventOutboxRecord) {
  const entryType = CALENDAR_MAP[record.event_type];
  if (!entryType) return null;

  const entry: ObjectiveCalendarEntry = {
    entry_id: caeId("cal"),
    event_id: record.event_id,
    entry_type: entryType,
    initiative_id: (record.payload.initiative_id as string) ?? "",
    objective_id: record.entity_type === "objective" ? record.entity_id : (record.payload.objective_id as string) ?? "",
    entity_id: record.entity_id,
    title: (record.payload.display_name as string) ?? entryType,
    scheduled_at: (record.payload.due_date as string) ?? null,
    created_at: nowIso(),
  };

  const queue = readStoreSlice<ObjectiveCalendarEntry>(CALENDAR_KEY);
  queue.push(entry);
  writeStoreSlice(CALENDAR_KEY, queue);
  return entry;
}

export function listObjectiveCalendarQueue(limit = 50) {
  return readStoreSlice<ObjectiveCalendarEntry>(CALENDAR_KEY).slice(-limit);
}
