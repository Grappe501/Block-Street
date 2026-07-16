import type { CalendarCoreRecordAuditEvent, CalendarEventCoreRecordItem } from "./types";

let items: CalendarEventCoreRecordItem[] = [];
let auditEvents: CalendarCoreRecordAuditEvent[] = [];

export function listCoreRecordItems(filter?: {
  eventId?: string;
  category?: import("./types").CoreRecordCategory;
  itemId?: string;
}): CalendarEventCoreRecordItem[] {
  return items.filter((i) => {
    if (filter?.eventId && i.eventId !== filter.eventId) return false;
    if (filter?.category && i.category !== filter.category) return false;
    if (filter?.itemId && i.itemId !== filter.itemId) return false;
    return true;
  });
}

export function getCoreRecordItemById(itemId: string): CalendarEventCoreRecordItem | null {
  return items.find((i) => i.itemId === itemId) ?? null;
}

export function saveCoreRecordItem(i: CalendarEventCoreRecordItem): CalendarEventCoreRecordItem {
  items = [i, ...items.filter((x) => x.itemId !== i.itemId)];
  return i;
}

export function appendCoreRecordAudit(
  e: Omit<CalendarCoreRecordAuditEvent, "auditEventId" | "createdAt" | "mode" | "persistenceMode">,
): CalendarCoreRecordAuditEvent {
  const full: CalendarCoreRecordAuditEvent = {
    ...e,
    auditEventId: `cr-audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    mode: "audit_only",
    persistenceMode: "session_soft_beta",
    createdAt: new Date().toISOString(),
  };
  auditEvents = [full, ...auditEvents];
  return full;
}

export function seedCoreRecordFixtures(fixtures: { items?: CalendarEventCoreRecordItem[] }): void {
  if (fixtures.items) items = [...fixtures.items];
}

export function clearCoreRecordStoreForTest(): void {
  items = [];
  auditEvents = [];
}
