import type { CalendarEventPreparationItem, PreparationCategory } from "./types";
import { recordPreparationAudit } from "./audit";
import { canTransitionPreparation } from "./status";
import { getPreparationItemById, savePreparationItem } from "./store";

export function createPreparationItem(input: {
  eventId: string;
  category: PreparationCategory;
  itemKey: string;
  label: string;
  required?: boolean;
  blocksReadiness?: boolean;
  readinessDimension?: "materials" | "promotion" | null;
  dueAt?: string | null;
  reminderOffsetHours?: number | null;
  scheduledAt?: string | null;
  generatedFromTemplate?: boolean;
  templateId?: string | null;
  templateVersion?: string | null;
  ownerRoleKey?: string | null;
}): CalendarEventPreparationItem {
  const now = new Date().toISOString();
  const item: CalendarEventPreparationItem = {
    itemId: `prep-${input.eventId}-${input.category}-${input.itemKey}`,
    eventId: input.eventId,
    category: input.category,
    itemKey: input.itemKey,
    label: input.label,
    required: input.required ?? false,
    itemStatus: "not_started",
    blocksReadiness: input.blocksReadiness ?? (input.required ?? false),
    readinessDimension: input.readinessDimension ?? null,
    dueAt: input.dueAt ?? null,
    reminderOffsetHours: input.reminderOffsetHours ?? null,
    scheduledAt: input.scheduledAt ?? null,
    communicationState: input.category === "promotion" || input.category === "reminder" ? "not_prepared" : "not_prepared",
    generatedFromTemplate: input.generatedFromTemplate ?? false,
    templateId: input.templateId ?? null,
    templateVersion: input.templateVersion ?? null,
    ownerRoleKey: input.ownerRoleKey ?? null,
    softBeta: true,
    durableAuthority: false,
    createdAt: now,
    updatedAt: now,
  };
  savePreparationItem(item);
  recordPreparationAudit({
    entityType: "preparation",
    entityId: item.itemId,
    eventId: item.eventId,
    action: "item_created",
    nextStatus: item.itemStatus,
  });
  return item;
}

export function transitionPreparationItem(
  itemId: string,
  toStatus: CalendarEventPreparationItem["itemStatus"],
  actorUserId?: string | null,
): CalendarEventPreparationItem | null {
  const item = getPreparationItemById(itemId);
  if (!item || !canTransitionPreparation(item.itemStatus, toStatus)) return null;
  const now = new Date().toISOString();
  const updated = savePreparationItem({
    ...item,
    itemStatus: toStatus,
    readyAt: toStatus === "ready" ? now : item.readyAt,
    updatedAt: now,
    communicationState:
      toStatus === "ready" && (item.category === "promotion" || item.category === "reminder")
        ? "ready_for_manual_send"
        : item.communicationState,
  });
  recordPreparationAudit({
    entityType: "preparation",
    entityId: itemId,
    eventId: item.eventId,
    action: `item_${toStatus}`,
    previousStatus: item.itemStatus,
    nextStatus: toStatus,
    actorUserId: actorUserId ?? null,
  });
  return updated;
}

export function markPreparationReady(itemId: string, actorUserId?: string | null): CalendarEventPreparationItem | null {
  return transitionPreparationItem(itemId, "ready", actorUserId);
}

export function setCommunicationState(
  itemId: string,
  state: CalendarEventPreparationItem["communicationState"],
): CalendarEventPreparationItem | null {
  const item = getPreparationItemById(itemId);
  if (!item) return null;
  return savePreparationItem({ ...item, communicationState: state, updatedAt: new Date().toISOString() });
}
