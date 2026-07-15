import type { CalendarEventPreparationItem, CalendarPreparationAuditEvent } from "./types";

let items: CalendarEventPreparationItem[] = [];
let auditEvents: CalendarPreparationAuditEvent[] = [];

export function listPreparationItems(filter?: {
  eventId?: string;
  category?: import("./types").PreparationCategory;
  itemId?: string;
}): CalendarEventPreparationItem[] {
  return items.filter((i) => {
    if (filter?.eventId && i.eventId !== filter.eventId) return false;
    if (filter?.category && i.category !== filter.category) return false;
    if (filter?.itemId && i.itemId !== filter.itemId) return false;
    return true;
  });
}

export function getPreparationItemById(itemId: string): CalendarEventPreparationItem | null {
  return items.find((i) => i.itemId === itemId) ?? null;
}

export function savePreparationItem(i: CalendarEventPreparationItem): CalendarEventPreparationItem {
  items = [i, ...items.filter((x) => x.itemId !== i.itemId)];
  return i;
}

export function appendPreparationAudit(e: CalendarPreparationAuditEvent): CalendarPreparationAuditEvent {
  auditEvents = [e, ...auditEvents];
  return e;
}

export function seedPreparationFixtures(fixtures: { items?: CalendarEventPreparationItem[] }): void {
  if (fixtures.items) items = [...fixtures.items];
}

export function clearPreparationStoreForTest(): void {
  items = [];
  auditEvents = [];
}
