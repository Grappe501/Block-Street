import type { CalendarEventFollowUpItem, FollowUpItemCategory, FollowUpMetricType } from "./types";
import { recordFollowUpAudit } from "./audit";
import { canTransitionFollowUp } from "./status";
import { getFollowUpItemById, saveFollowUpItem } from "./store";

export function createFollowUpItem(input: {
  eventId: string;
  category: FollowUpItemCategory;
  itemKey: string;
  label: string;
  required?: boolean;
  metricType?: FollowUpMetricType | null;
  blocksReadiness?: boolean;
  dueAt?: string | null;
  generatedFromTemplate?: boolean;
  templateId?: string | null;
  templateVersion?: string | null;
  ownerRoleKey?: string | null;
}): CalendarEventFollowUpItem {
  const now = new Date().toISOString();
  const item: CalendarEventFollowUpItem = {
    itemId: `fup-${input.eventId}-${input.category}-${input.itemKey}`,
    eventId: input.eventId,
    category: input.category,
    itemKey: input.itemKey,
    label: input.label,
    required: input.required ?? false,
    metricType: input.metricType ?? null,
    itemStatus: "not_started",
    blocksReadiness: input.blocksReadiness ?? (input.required ?? false),
    dueAt: input.dueAt ?? null,
    generatedFromTemplate: input.generatedFromTemplate ?? false,
    templateId: input.templateId ?? null,
    templateVersion: input.templateVersion ?? null,
    ownerRoleKey: input.ownerRoleKey ?? "follow_up",
    softBeta: true,
    durableAuthority: false,
    createdAt: now,
    updatedAt: now,
  };
  saveFollowUpItem(item);
  recordFollowUpAudit({
    entityType: "followup",
    entityId: item.itemId,
    eventId: item.eventId,
    action: "item_created",
    nextStatus: item.itemStatus,
  });
  return item;
}

export function transitionFollowUpItem(
  itemId: string,
  toStatus: CalendarEventFollowUpItem["itemStatus"],
  actorUserId?: string | null,
): CalendarEventFollowUpItem | null {
  const item = getFollowUpItemById(itemId);
  if (!item || !canTransitionFollowUp(item.itemStatus, toStatus)) return null;
  const now = new Date().toISOString();
  const updated = saveFollowUpItem({
    ...item,
    itemStatus: toStatus,
    submittedAt: toStatus === "submitted" ? now : item.submittedAt,
    updatedAt: now,
  });
  recordFollowUpAudit({
    entityType: "followup",
    entityId: itemId,
    eventId: item.eventId,
    action: `item_${toStatus}`,
    previousStatus: item.itemStatus,
    nextStatus: toStatus,
    actorUserId: actorUserId ?? null,
  });
  return updated;
}

export function setFollowUpFieldValue(
  itemId: string,
  value: { valueText?: string | null; valueCount?: number | null; valueBoolean?: boolean | null },
  actorUserId?: string | null,
): CalendarEventFollowUpItem | null {
  const item = getFollowUpItemById(itemId);
  if (!item) return null;
  const now = new Date().toISOString();
  const updated = saveFollowUpItem({
    ...item,
    ...value,
    itemStatus: item.itemStatus === "not_started" ? "draft" : item.itemStatus,
    updatedAt: now,
  });
  recordFollowUpAudit({
    entityType: "followup",
    entityId: itemId,
    eventId: item.eventId,
    action: "value_updated",
    previousStatus: item.itemStatus,
    nextStatus: updated.itemStatus,
    actorUserId: actorUserId ?? null,
  });
  return updated;
}

export function submitFollowUpItem(itemId: string, actorUserId?: string | null): CalendarEventFollowUpItem | null {
  const item = getFollowUpItemById(itemId);
  if (!item) return null;
  if (item.itemStatus === "submitted" || item.itemStatus === "waived" || item.itemStatus === "not_applicable") {
    return item;
  }
  return transitionFollowUpItem(itemId, "submitted", actorUserId);
}
