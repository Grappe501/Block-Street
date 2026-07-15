import type { CalendarEventCandidateItem, CandidateItemCategory } from "./types";
import { recordCandidateAudit } from "./audit";
import { canTransitionCandidate } from "./status";
import { getCandidateItemById, saveCandidateItem } from "./store";

export function createCandidateItem(input: {
  eventId: string;
  category: CandidateItemCategory;
  itemKey: string;
  label: string;
  required?: boolean;
  blocksReadiness?: boolean;
  dueAt?: string | null;
  attendanceSnapshot?: import("./types").CandidateAttendanceSnapshot | null;
  generatedFromTemplate?: boolean;
  templateId?: string | null;
  templateVersion?: string | null;
}): CalendarEventCandidateItem {
  const now = new Date().toISOString();
  const item: CalendarEventCandidateItem = {
    itemId: `cand-${input.eventId}-${input.category}-${input.itemKey}`,
    eventId: input.eventId,
    category: input.category,
    itemKey: input.itemKey,
    label: input.label,
    required: input.required ?? false,
    itemStatus: "not_started",
    attendanceSnapshot: input.attendanceSnapshot ?? null,
    blocksReadiness: input.blocksReadiness ?? (input.required ?? false),
    dueAt: input.dueAt ?? null,
    generatedFromTemplate: input.generatedFromTemplate ?? false,
    templateId: input.templateId ?? null,
    templateVersion: input.templateVersion ?? null,
    softBeta: true,
    durableAuthority: false,
    createdAt: now,
    updatedAt: now,
  };
  saveCandidateItem(item);
  recordCandidateAudit({
    entityType: "candidate_request",
    entityId: item.itemId,
    eventId: item.eventId,
    action: "item_created",
    nextStatus: item.itemStatus,
  });
  return item;
}

export function transitionCandidateItem(
  itemId: string,
  toStatus: CalendarEventCandidateItem["itemStatus"],
  actorUserId?: string | null,
): CalendarEventCandidateItem | null {
  const item = getCandidateItemById(itemId);
  if (!item || !canTransitionCandidate(item.itemStatus, toStatus)) return null;
  const now = new Date().toISOString();
  const updated = saveCandidateItem({
    ...item,
    itemStatus: toStatus,
    readyAt: toStatus === "ready" ? now : item.readyAt,
    updatedAt: now,
  });
  recordCandidateAudit({
    entityType: "candidate_request",
    entityId: itemId,
    eventId: item.eventId,
    action: `item_${toStatus}`,
    previousStatus: item.itemStatus,
    nextStatus: toStatus,
    actorUserId: actorUserId ?? null,
  });
  return updated;
}

export function markCandidateItemReady(itemId: string, actorUserId?: string | null): CalendarEventCandidateItem | null {
  return transitionCandidateItem(itemId, "ready", actorUserId);
}
