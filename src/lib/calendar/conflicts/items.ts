import type { CalendarConflictResolutionItem, ConflictItemCategory } from "./types";
import { recordConflictAudit } from "./audit";
import { canTransitionConflictItem } from "./status";
import { getConflictItemById, saveConflictItem } from "./store";

export function createConflictItem(input: {
  conflictId: string;
  eventId: string;
  category: ConflictItemCategory;
  itemKey: string;
  label: string;
  required?: boolean;
  blocksResolution?: boolean;
  generatedFromSeed?: boolean;
  initialStatus?: CalendarConflictResolutionItem["itemStatus"];
}): CalendarConflictResolutionItem {
  const now = new Date().toISOString();
  const item: CalendarConflictResolutionItem = {
    itemId: `cf-${input.conflictId}-${input.eventId}-${input.itemKey}`,
    conflictId: input.conflictId,
    eventId: input.eventId,
    category: input.category,
    itemKey: input.itemKey,
    label: input.label,
    required: input.required ?? false,
    itemStatus: input.initialStatus ?? "not_started",
    blocksResolution: input.blocksResolution ?? (input.required ?? false),
    generatedFromSeed: input.generatedFromSeed ?? false,
    softBeta: true,
    durableAuthority: false,
    createdAt: now,
    updatedAt: now,
  };
  saveConflictItem(item);
  recordConflictAudit({
    entityType: "conflict",
    entityId: item.itemId,
    eventId: input.eventId,
    action: "item_created",
    nextStatus: item.itemStatus,
  });
  return item;
}

export function transitionConflictItem(
  itemId: string,
  toStatus: CalendarConflictResolutionItem["itemStatus"],
  actorUserId?: string | null,
): CalendarConflictResolutionItem | null {
  const item = getConflictItemById(itemId);
  if (!item || !canTransitionConflictItem(item.itemStatus, toStatus)) return null;
  const now = new Date().toISOString();
  const updated = saveConflictItem({ ...item, itemStatus: toStatus, updatedAt: now });
  recordConflictAudit({
    entityType: "conflict",
    entityId: itemId,
    eventId: item.eventId,
    action: `item_${toStatus}`,
    previousStatus: item.itemStatus,
    nextStatus: toStatus,
    actorUserId: actorUserId ?? null,
  });
  return updated;
}

export function markConflictItemReady(itemId: string, actorUserId?: string | null): CalendarConflictResolutionItem | null {
  return transitionConflictItem(itemId, "ready", actorUserId);
}
