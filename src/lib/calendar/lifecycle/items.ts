import type { CalendarEventLifecycleItem, LifecycleItemCategory } from "./types";
import { recordLifecycleAudit } from "./audit";
import { canTransitionLifecycleItem } from "./status";
import { getLifecycleItemById, saveLifecycleItem } from "./store";

export function createLifecycleItem(input: {
  eventId: string;
  category: LifecycleItemCategory;
  itemKey: string;
  label: string;
  required?: boolean;
  blocksReadiness?: boolean;
  dueAt?: string | null;
  approvalSnapshot?: import("../types").ApprovalStatus | null;
  operationalSnapshot?: import("../types").OperationalStatus | null;
  generatedFromEvent?: boolean;
  initialStatus?: CalendarEventLifecycleItem["itemStatus"];
}): CalendarEventLifecycleItem {
  const now = new Date().toISOString();
  const item: CalendarEventLifecycleItem = {
    itemId: `lc-${input.eventId}-${input.category}-${input.itemKey}`,
    eventId: input.eventId,
    category: input.category,
    itemKey: input.itemKey,
    label: input.label,
    required: input.required ?? false,
    itemStatus: input.initialStatus ?? "not_started",
    approvalSnapshot: input.approvalSnapshot ?? null,
    operationalSnapshot: input.operationalSnapshot ?? null,
    blocksReadiness: input.blocksReadiness ?? (input.required ?? false),
    dueAt: input.dueAt ?? null,
    generatedFromEvent: input.generatedFromEvent ?? false,
    softBeta: true,
    durableAuthority: false,
    createdAt: now,
    updatedAt: now,
  };
  saveLifecycleItem(item);
  recordLifecycleAudit({
    entityType: "lifecycle",
    entityId: item.itemId,
    eventId: item.eventId,
    action: "item_created",
    nextStatus: item.itemStatus,
  });
  return item;
}

export function transitionLifecycleItem(
  itemId: string,
  toStatus: CalendarEventLifecycleItem["itemStatus"],
  actorUserId?: string | null,
): CalendarEventLifecycleItem | null {
  const item = getLifecycleItemById(itemId);
  if (!item || !canTransitionLifecycleItem(item.itemStatus, toStatus)) return null;
  const now = new Date().toISOString();
  const updated = saveLifecycleItem({
    ...item,
    itemStatus: toStatus,
    readyAt: toStatus === "ready" ? now : item.readyAt,
    updatedAt: now,
  });
  recordLifecycleAudit({
    entityType: "lifecycle",
    entityId: itemId,
    eventId: item.eventId,
    action: `item_${toStatus}`,
    previousStatus: item.itemStatus,
    nextStatus: toStatus,
    actorUserId: actorUserId ?? null,
  });
  return updated;
}

export function markLifecycleItemReady(itemId: string, actorUserId?: string | null): CalendarEventLifecycleItem | null {
  return transitionLifecycleItem(itemId, "ready", actorUserId);
}
