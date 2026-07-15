import type { CalendarEventVerificationItem, CalendarVerificationAuditEvent } from "./types";

let items: CalendarEventVerificationItem[] = [];
let auditEvents: CalendarVerificationAuditEvent[] = [];

export function listVerificationItems(filter?: {
  eventId?: string;
  category?: import("./types").VerificationCategory;
  itemId?: string;
}): CalendarEventVerificationItem[] {
  return items.filter((i) => {
    if (filter?.eventId && i.eventId !== filter.eventId) return false;
    if (filter?.category && i.category !== filter.category) return false;
    if (filter?.itemId && i.itemId !== filter.itemId) return false;
    return true;
  });
}

export function getVerificationItemById(itemId: string): CalendarEventVerificationItem | null {
  return items.find((i) => i.itemId === itemId) ?? null;
}

export function saveVerificationItem(i: CalendarEventVerificationItem): CalendarEventVerificationItem {
  items = [i, ...items.filter((x) => x.itemId !== i.itemId)];
  return i;
}

export function appendVerificationAudit(e: CalendarVerificationAuditEvent): CalendarVerificationAuditEvent {
  auditEvents = [e, ...auditEvents];
  return e;
}

export function clearVerificationStoreForTest(): void {
  items = [];
  auditEvents = [];
}
