import type { CalendarEventCoreRecordItem, CoreRecordCategory } from "./types";
import { recordCoreRecordAudit } from "./audit";
import { canTransitionCoreRecord } from "./status";
import { getCoreRecordItemById, saveCoreRecordItem } from "./store";

export function createCoreRecordItem(input: {
  eventId: string;
  category: CoreRecordCategory;
  itemKey: string;
  label: string;
  required?: boolean;
  blocksReadiness?: boolean;
  fieldSnapshot?: string | null;
  generatedFromEvent?: boolean;
  initialStatus?: CalendarEventCoreRecordItem["itemStatus"];
}): CalendarEventCoreRecordItem {
  const now = new Date().toISOString();
  const item: CalendarEventCoreRecordItem = {
    itemId: `cr-${input.eventId}-${input.category}-${input.itemKey}`,
    eventId: input.eventId,
    category: input.category,
    itemKey: input.itemKey,
    label: input.label,
    required: input.required ?? false,
    itemStatus: input.initialStatus ?? "not_started",
    fieldSnapshot: input.fieldSnapshot ?? null,
    blocksReadiness: input.blocksReadiness ?? (input.required ?? false),
    generatedFromEvent: input.generatedFromEvent ?? false,
    softBeta: true,
    durableAuthority: false,
    createdAt: now,
    updatedAt: now,
  };
  saveCoreRecordItem(item);
  recordCoreRecordAudit({
    entityType: "core_record",
    entityId: item.itemId,
    eventId: item.eventId,
    action: "item_created",
    nextStatus: item.itemStatus,
  });
  return item;
}

export function transitionCoreRecordItem(
  itemId: string,
  toStatus: CalendarEventCoreRecordItem["itemStatus"],
  actorUserId?: string | null,
): CalendarEventCoreRecordItem | null {
  const item = getCoreRecordItemById(itemId);
  if (!item || !canTransitionCoreRecord(item.itemStatus, toStatus)) return null;
  const now = new Date().toISOString();
  const updated = saveCoreRecordItem({
    ...item,
    itemStatus: toStatus,
    readyAt: toStatus === "ready" ? now : item.readyAt,
    updatedAt: now,
  });
  recordCoreRecordAudit({
    entityType: "core_record",
    entityId: itemId,
    eventId: item.eventId,
    action: `item_${toStatus}`,
    previousStatus: item.itemStatus,
    nextStatus: toStatus,
    actorUserId: actorUserId ?? null,
  });
  return updated;
}

export function markCoreRecordItemReady(itemId: string, actorUserId?: string | null): CalendarEventCoreRecordItem | null {
  return transitionCoreRecordItem(itemId, "ready", actorUserId);
}
