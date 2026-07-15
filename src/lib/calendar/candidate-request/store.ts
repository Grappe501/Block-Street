import type { CalendarEventCandidateItem, CalendarCandidateAuditEvent } from "./types";

let items: CalendarEventCandidateItem[] = [];
let auditEvents: CalendarCandidateAuditEvent[] = [];

export function listCandidateItems(filter?: {
  eventId?: string;
  category?: import("./types").CandidateItemCategory;
  itemId?: string;
}): CalendarEventCandidateItem[] {
  return items.filter((i) => {
    if (filter?.eventId && i.eventId !== filter.eventId) return false;
    if (filter?.category && i.category !== filter.category) return false;
    if (filter?.itemId && i.itemId !== filter.itemId) return false;
    return true;
  });
}

export function getCandidateItemById(itemId: string): CalendarEventCandidateItem | null {
  return items.find((i) => i.itemId === itemId) ?? null;
}

export function saveCandidateItem(i: CalendarEventCandidateItem): CalendarEventCandidateItem {
  items = [i, ...items.filter((x) => x.itemId !== i.itemId)];
  return i;
}

export function appendCandidateAudit(e: CalendarCandidateAuditEvent): CalendarCandidateAuditEvent {
  auditEvents = [e, ...auditEvents];
  return e;
}

export function clearCandidateStoreForTest(): void {
  items = [];
  auditEvents = [];
}
