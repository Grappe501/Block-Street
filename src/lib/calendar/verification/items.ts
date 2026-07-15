import type { CalendarEventVerificationItem, VerificationCategory } from "./types";
import { recordVerificationAudit } from "./audit";
import { canTransitionVerification } from "./status";
import { getVerificationItemById, saveVerificationItem } from "./store";

export function createVerificationItem(input: {
  eventId: string;
  category: VerificationCategory;
  itemKey: string;
  label: string;
  required?: boolean;
  blocksReadiness?: boolean;
  dueAt?: string | null;
  generatedFromTemplate?: boolean;
  templateId?: string | null;
  templateVersion?: string | null;
  ownerRoleKey?: string | null;
}): CalendarEventVerificationItem {
  const now = new Date().toISOString();
  const item: CalendarEventVerificationItem = {
    itemId: `ver-${input.eventId}-${input.category}-${input.itemKey}`,
    eventId: input.eventId,
    category: input.category,
    itemKey: input.itemKey,
    label: input.label,
    required: input.required ?? false,
    itemStatus: "not_started",
    blocksReadiness: input.blocksReadiness ?? (input.required ?? false),
    dueAt: input.dueAt ?? null,
    generatedFromTemplate: input.generatedFromTemplate ?? false,
    templateId: input.templateId ?? null,
    templateVersion: input.templateVersion ?? null,
    ownerRoleKey: input.ownerRoleKey ?? null,
    softBeta: true,
    durableAuthority: false,
    createdAt: now,
    updatedAt: now,
  };
  saveVerificationItem(item);
  recordVerificationAudit({
    entityType: "verification",
    entityId: item.itemId,
    eventId: item.eventId,
    action: "item_created",
    nextStatus: item.itemStatus,
  });
  return item;
}

export function transitionVerificationItem(
  itemId: string,
  toStatus: CalendarEventVerificationItem["itemStatus"],
  actorUserId?: string | null,
): CalendarEventVerificationItem | null {
  const item = getVerificationItemById(itemId);
  if (!item || !canTransitionVerification(item.itemStatus, toStatus)) return null;
  const now = new Date().toISOString();
  const updated = saveVerificationItem({
    ...item,
    itemStatus: toStatus,
    verifiedAt: toStatus === "verified" ? now : item.verifiedAt,
    updatedAt: now,
  });
  recordVerificationAudit({
    entityType: "verification",
    entityId: itemId,
    eventId: item.eventId,
    action: `item_${toStatus}`,
    previousStatus: item.itemStatus,
    nextStatus: toStatus,
    actorUserId: actorUserId ?? null,
  });
  return updated;
}

export function markVerificationComplete(itemId: string, actorUserId?: string | null): CalendarEventVerificationItem | null {
  return transitionVerificationItem(itemId, "verified", actorUserId);
}
