import type { CalendarEventLifecycleItem, CalendarLifecycleAuditEvent, CalendarStatusHistoryEntry } from "./types";

let items: CalendarEventLifecycleItem[] = [];
let historyEntries: CalendarStatusHistoryEntry[] = [];
let auditEvents: CalendarLifecycleAuditEvent[] = [];
const seededHistoryEvents = new Set<string>();

export function listLifecycleItems(filter?: {
  eventId?: string;
  category?: import("./types").LifecycleItemCategory;
  itemId?: string;
}): CalendarEventLifecycleItem[] {
  return items.filter((i) => {
    if (filter?.eventId && i.eventId !== filter.eventId) return false;
    if (filter?.category && i.category !== filter.category) return false;
    if (filter?.itemId && i.itemId !== filter.itemId) return false;
    return true;
  });
}

export function getLifecycleItemById(itemId: string): CalendarEventLifecycleItem | null {
  return items.find((i) => i.itemId === itemId) ?? null;
}

export function saveLifecycleItem(i: CalendarEventLifecycleItem): CalendarEventLifecycleItem {
  items = [i, ...items.filter((x) => x.itemId !== i.itemId)];
  return i;
}

export function listStatusHistory(filter?: { eventId?: string; category?: import("./types").StatusHistoryCategory }): CalendarStatusHistoryEntry[] {
  return historyEntries.filter((h) => {
    if (filter?.eventId && h.eventId !== filter.eventId) return false;
    if (filter?.category && h.category !== filter.category) return false;
    return true;
  });
}

export function saveStatusHistoryEntry(entry: CalendarStatusHistoryEntry): CalendarStatusHistoryEntry {
  historyEntries = [entry, ...historyEntries.filter((x) => x.historyId !== entry.historyId)];
  return entry;
}

export function appendLifecycleAudit(e: Omit<CalendarLifecycleAuditEvent, "auditEventId" | "createdAt" | "mode" | "persistenceMode">): CalendarLifecycleAuditEvent {
  const full: CalendarLifecycleAuditEvent = {
    ...e,
    auditEventId: `lc-audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    mode: "audit_only",
    persistenceMode: "session_soft_beta",
    createdAt: new Date().toISOString(),
  };
  auditEvents = [full, ...auditEvents];
  return full;
}

export function hasSeededHistory(eventId: string): boolean {
  return seededHistoryEvents.has(eventId);
}

export function markHistorySeeded(eventId: string): void {
  seededHistoryEvents.add(eventId);
}

export function seedLifecycleFixtures(fixtures: {
  items?: CalendarEventLifecycleItem[];
  history?: CalendarStatusHistoryEntry[];
}): void {
  if (fixtures.items) items = [...fixtures.items];
  if (fixtures.history) historyEntries = [...fixtures.history];
}

export function clearLifecycleStoreForTest(): void {
  items = [];
  historyEntries = [];
  auditEvents = [];
  seededHistoryEvents.clear();
}
