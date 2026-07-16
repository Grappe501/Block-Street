import type { CalendarConflictAuditEvent, CalendarConflictRecord, CalendarConflictResolutionItem } from "./types";

let records: CalendarConflictRecord[] = [];
let items: CalendarConflictResolutionItem[] = [];
const seeded = new Set<string>();

export function listConflictRecords(filter?: { eventId?: string; conflictId?: string }): CalendarConflictRecord[] {
  return records.filter((r) => {
    if (filter?.conflictId && r.conflictId !== filter.conflictId) return false;
    if (filter?.eventId && !r.eventIds.includes(filter.eventId)) return false;
    return true;
  });
}

export function getConflictRecordById(conflictId: string): CalendarConflictRecord | null {
  return records.find((r) => r.conflictId === conflictId) ?? null;
}

export function saveConflictRecord(r: CalendarConflictRecord): CalendarConflictRecord {
  records = [r, ...records.filter((x) => x.conflictId !== r.conflictId)];
  return r;
}

export function listConflictItems(filter?: {
  conflictId?: string;
  eventId?: string;
  itemId?: string;
}): CalendarConflictResolutionItem[] {
  return items.filter((i) => {
    if (filter?.conflictId && i.conflictId !== filter.conflictId) return false;
    if (filter?.eventId && i.eventId !== filter.eventId) return false;
    if (filter?.itemId && i.itemId !== filter.itemId) return false;
    return true;
  });
}

export function getConflictItemById(itemId: string): CalendarConflictResolutionItem | null {
  return items.find((i) => i.itemId === itemId) ?? null;
}

export function saveConflictItem(i: CalendarConflictResolutionItem): CalendarConflictResolutionItem {
  items = [i, ...items.filter((x) => x.itemId !== i.itemId)];
  return i;
}

export function appendConflictAudit(
  e: Omit<CalendarConflictAuditEvent, "auditEventId" | "createdAt" | "mode" | "persistenceMode">,
): CalendarConflictAuditEvent {
  const full: CalendarConflictAuditEvent = {
    ...e,
    auditEventId: `cf-audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    mode: "audit_only",
    persistenceMode: "session_soft_beta",
    createdAt: new Date().toISOString(),
  };
  return full;
}

export function hasSeededConflicts(): boolean {
  return seeded.has("catalog");
}

export function markConflictsSeeded(): void {
  seeded.add("catalog");
}

export function seedConflictFixtures(fixtures: {
  records?: CalendarConflictRecord[];
  items?: CalendarConflictResolutionItem[];
}): void {
  if (fixtures.records) records = [...fixtures.records];
  if (fixtures.items) items = [...fixtures.items];
}

export function clearConflictStoreForTest(): void {
  records = [];
  items = [];
  seeded.clear();
}
