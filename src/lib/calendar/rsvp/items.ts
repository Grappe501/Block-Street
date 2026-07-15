import type { CalendarEventRsvpItem, CalendarEventRsvpResponse, RsvpItemCategory, RsvpResponseStatus } from "./types";
import { recordRsvpAudit } from "./audit";
import { canTransitionRsvp } from "./status";
import { getRsvpItemById, listRsvpResponses, saveRsvpItem, saveRsvpResponse } from "./store";

export function createRsvpItem(input: {
  eventId: string;
  category: RsvpItemCategory;
  itemKey: string;
  label: string;
  required?: boolean;
  blocksReadiness?: boolean;
  targetHeadcount?: number | null;
  dueAt?: string | null;
  generatedFromTemplate?: boolean;
  templateId?: string | null;
  templateVersion?: string | null;
}): CalendarEventRsvpItem {
  const now = new Date().toISOString();
  const item: CalendarEventRsvpItem = {
    itemId: `rsvp-${input.eventId}-${input.category}-${input.itemKey}`,
    eventId: input.eventId,
    category: input.category,
    itemKey: input.itemKey,
    label: input.label,
    required: input.required ?? false,
    itemStatus: "not_started",
    targetHeadcount: input.targetHeadcount ?? null,
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
  saveRsvpItem(item);
  recordRsvpAudit({
    entityType: "rsvp",
    entityId: item.itemId,
    eventId: item.eventId,
    action: "item_created",
    nextStatus: item.itemStatus,
  });
  return item;
}

export function transitionRsvpItem(
  itemId: string,
  toStatus: CalendarEventRsvpItem["itemStatus"],
  actorUserId?: string | null,
): CalendarEventRsvpItem | null {
  const item = getRsvpItemById(itemId);
  if (!item || !canTransitionRsvp(item.itemStatus, toStatus)) return null;
  const updated = saveRsvpItem({ ...item, itemStatus: toStatus, updatedAt: new Date().toISOString() });
  recordRsvpAudit({
    entityType: "rsvp",
    entityId: itemId,
    eventId: item.eventId,
    action: `item_${toStatus}`,
    previousStatus: item.itemStatus,
    nextStatus: toStatus,
    actorUserId: actorUserId ?? null,
  });
  return updated;
}

export function markRsvpReady(itemId: string, actorUserId?: string | null): CalendarEventRsvpItem | null {
  return transitionRsvpItem(itemId, "ready", actorUserId);
}

export function setRsvpTargetHeadcount(itemId: string, targetHeadcount: number): CalendarEventRsvpItem | null {
  const item = getRsvpItemById(itemId);
  if (!item) return null;
  return saveRsvpItem({
    ...item,
    targetHeadcount,
    itemStatus: item.itemStatus === "not_started" ? "in_progress" : item.itemStatus,
    updatedAt: new Date().toISOString(),
  });
}

export function createRsvpResponse(input: {
  eventId: string;
  attendeeLabel: string;
  responseStatus: RsvpResponseStatus;
  partySize?: number;
  notes?: string | null;
}): CalendarEventRsvpResponse {
  const now = new Date().toISOString();
  const response: CalendarEventRsvpResponse = {
    responseId: `rsvpr-${input.eventId}-${Date.now()}`,
    eventId: input.eventId,
    attendeeLabel: input.attendeeLabel,
    responseStatus: input.responseStatus,
    partySize: input.partySize ?? 1,
    notes: input.notes ?? null,
    softBeta: true,
    durableAuthority: false,
    createdAt: now,
    updatedAt: now,
  };
  saveRsvpResponse(response);
  recordRsvpAudit({
    entityType: "rsvp",
    entityId: response.responseId,
    eventId: input.eventId,
    action: "response_created",
    nextStatus: response.responseStatus,
  });
  return response;
}

export function countRsvpHeadcount(eventId: string): number {
  return listRsvpResponses({ eventId })
    .filter((r) => r.responseStatus === "yes" || r.responseStatus === "maybe")
    .reduce((sum, r) => sum + r.partySize, 0);
}
