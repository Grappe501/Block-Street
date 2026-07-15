import type { CalendarEventFollowUpItem, CalendarFollowUpAuditEvent } from "./types";

let items: CalendarEventFollowUpItem[] = [];
let auditEvents: CalendarFollowUpAuditEvent[] = [];

export function listFollowUpItems(filter?: {
  eventId?: string;
  category?: import("./types").FollowUpItemCategory;
  itemId?: string;
}): CalendarEventFollowUpItem[] {
  return items.filter((i) => {
    if (filter?.eventId && i.eventId !== filter.eventId) return false;
    if (filter?.category && i.category !== filter.category) return false;
    if (filter?.itemId && i.itemId !== filter.itemId) return false;
    return true;
  });
}

export function getFollowUpItemById(itemId: string): CalendarEventFollowUpItem | null {
  return items.find((i) => i.itemId === itemId) ?? null;
}

export function saveFollowUpItem(i: CalendarEventFollowUpItem): CalendarEventFollowUpItem {
  items = [i, ...items.filter((x) => x.itemId !== i.itemId)];
  return i;
}

export function appendFollowUpAudit(e: CalendarFollowUpAuditEvent): CalendarFollowUpAuditEvent {
  auditEvents = [e, ...auditEvents];
  return e;
}

export function seedFollowUpFixtures(fixtures: { items?: CalendarEventFollowUpItem[] }): void {
  if (fixtures.items) items = [...fixtures.items];
}

export function clearFollowUpStoreForTest(): void {
  items = [];
  auditEvents = [];
}
