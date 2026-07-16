import type { CalendarEvent } from "../types";
import type { CalendarStatusHistoryEntry, StatusHistoryCategory } from "./types";
import { recordLifecycleAudit } from "./audit";
import {
  hasSeededHistory,
  listStatusHistory,
  markHistorySeeded,
  saveStatusHistoryEntry,
} from "./store";

export function createStatusHistoryEntry(input: {
  eventId: string;
  category: StatusHistoryCategory;
  note: string;
  fromStatus?: string | null;
  toStatus?: string | null;
  actor?: string | null;
  role?: string | null;
  recordedAt?: string;
}): CalendarStatusHistoryEntry {
  const entry: CalendarStatusHistoryEntry = {
    historyId: `lc-hist-${input.eventId}-${input.recordedAt ?? Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    eventId: input.eventId,
    category: input.category,
    fromStatus: input.fromStatus ?? null,
    toStatus: input.toStatus ?? null,
    actor: input.actor ?? null,
    role: input.role ?? null,
    note: input.note,
    recordedAt: input.recordedAt ?? new Date().toISOString(),
    softBeta: true,
    durableAuthority: false,
  };
  saveStatusHistoryEntry(entry);
  if (input.fromStatus || input.toStatus) {
    recordLifecycleAudit({
      entityType: "lifecycle",
      entityId: entry.historyId,
      eventId: input.eventId,
      action: "status_recorded",
      previousStatus: input.fromStatus ?? null,
      nextStatus: input.toStatus ?? null,
      actorUserId: input.actor ?? null,
    });
  }
  return entry;
}

export function seedHistoryFromEvent(event: CalendarEvent): CalendarStatusHistoryEntry[] {
  if (hasSeededHistory(event.event_id)) {
    return listStatusHistory({ eventId: event.event_id });
  }
  const created: CalendarStatusHistoryEntry[] = [];
  for (const h of event.history ?? []) {
    created.push(
      createStatusHistoryEntry({
        eventId: event.event_id,
        category: "note",
        note: h.note,
        recordedAt: h.at,
      }),
    );
  }
  for (const a of event.approval_history ?? []) {
    created.push(
      createStatusHistoryEntry({
        eventId: event.event_id,
        category: "approval",
        note: a.notes ?? `Approval ${a.decision}`,
        fromStatus: a.previous_state ?? null,
        toStatus: a.new_state ?? a.decision,
        actor: a.actor,
        role: a.role,
        recordedAt: a.at,
      }),
    );
  }
  if (event.operational_status) {
    created.push(
      createStatusHistoryEntry({
        eventId: event.event_id,
        category: "operational",
        note: `Current operational status: ${event.operational_status}`,
        toStatus: event.operational_status,
        recordedAt: event.approved_at ?? event.submitted_at ?? event.start_at,
      }),
    );
  }
  markHistorySeeded(event.event_id);
  return created;
}

export function buildMergedHistoryTimeline(eventId: string): CalendarStatusHistoryEntry[] {
  return listStatusHistory({ eventId }).sort(
    (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime(),
  );
}
