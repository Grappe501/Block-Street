import type { CalendarEventRsvpItem, CalendarEventRsvpResponse, CalendarRsvpAuditEvent } from "./types";

let items: CalendarEventRsvpItem[] = [];
let responses: CalendarEventRsvpResponse[] = [];
let auditEvents: CalendarRsvpAuditEvent[] = [];

export function listRsvpItems(filter?: {
  eventId?: string;
  category?: import("./types").RsvpItemCategory;
  itemId?: string;
}): CalendarEventRsvpItem[] {
  return items.filter((i) => {
    if (filter?.eventId && i.eventId !== filter.eventId) return false;
    if (filter?.category && i.category !== filter.category) return false;
    if (filter?.itemId && i.itemId !== filter.itemId) return false;
    return true;
  });
}

export function getRsvpItemById(itemId: string): CalendarEventRsvpItem | null {
  return items.find((i) => i.itemId === itemId) ?? null;
}

export function saveRsvpItem(i: CalendarEventRsvpItem): CalendarEventRsvpItem {
  items = [i, ...items.filter((x) => x.itemId !== i.itemId)];
  return i;
}

export function listRsvpResponses(filter?: { eventId?: string; responseId?: string }): CalendarEventRsvpResponse[] {
  return responses.filter((r) => {
    if (filter?.eventId && r.eventId !== filter.eventId) return false;
    if (filter?.responseId && r.responseId !== filter.responseId) return false;
    return true;
  });
}

export function saveRsvpResponse(r: CalendarEventRsvpResponse): CalendarEventRsvpResponse {
  responses = [r, ...responses.filter((x) => x.responseId !== r.responseId)];
  return r;
}

export function appendRsvpAudit(e: CalendarRsvpAuditEvent): CalendarRsvpAuditEvent {
  auditEvents = [e, ...auditEvents];
  return e;
}

export function clearRsvpStoreForTest(): void {
  items = [];
  responses = [];
  auditEvents = [];
}
