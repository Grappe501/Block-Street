import { recordConflictAudit } from "./audit";
import { isConflictItemReady } from "./status";
import { canTransitionConflictResolution } from "./resolve-status";
import { getConflictRecordById, listConflictItems, listConflictRecords, saveConflictRecord } from "./store";
import type { CalendarConflictRecord } from "./types";

export function isConflictRecordResolvable(conflictId: string): boolean {
  const record = getConflictRecordById(conflictId);
  if (!record) return false;
  if (record.resolutionStatus === "resolved" || record.resolutionStatus === "override_approved") return false;
  const items = listConflictItems({ conflictId });
  const blocking = items.filter((i) => i.required && i.blocksResolution);
  if (blocking.length === 0) return true;
  return blocking.every((i) => isConflictItemReady(i.itemStatus));
}

export function updateConflictRecord(
  conflictId: string,
  patch: Partial<CalendarConflictRecord>,
  audit: { action: string; actorUserId?: string | null; previousStatus?: string; nextStatus?: string },
): CalendarConflictRecord | null {
  const record = getConflictRecordById(conflictId);
  if (!record) return null;
  const now = new Date().toISOString();
  const updated = saveConflictRecord({ ...record, ...patch, updatedAt: now });
  recordConflictAudit({
    entityType: "conflict",
    entityId: conflictId,
    action: audit.action,
    previousStatus: audit.previousStatus ?? record.resolutionStatus,
    nextStatus: audit.nextStatus ?? updated.resolutionStatus,
    actorUserId: audit.actorUserId ?? null,
  });
  return updated;
}

export function resolveConflictRecord(
  conflictId: string,
  actorUserId?: string | null,
  resolutionNote?: string | null,
): CalendarConflictRecord | null {
  const record = getConflictRecordById(conflictId);
  if (!record || !canTransitionConflictResolution(record.resolutionStatus, "resolved")) return null;
  if (!isConflictRecordResolvable(conflictId)) return null;
  const now = new Date().toISOString();
  return updateConflictRecord(
    conflictId,
    {
      state: "no_conflict",
      resolutionStatus: "resolved",
      resolvedAt: now,
      resolvedByUserId: actorUserId ?? null,
      resolutionNote: resolutionNote ?? null,
    },
    { action: "record_resolved", actorUserId, previousStatus: record.resolutionStatus, nextStatus: "resolved" },
  );
}

export function approveConflictOverride(
  conflictId: string,
  actorUserId?: string | null,
  overrideReason?: string | null,
): CalendarConflictRecord | null {
  const record = getConflictRecordById(conflictId);
  if (!record || !canTransitionConflictResolution(record.resolutionStatus, "override_approved")) return null;
  const now = new Date().toISOString();
  return updateConflictRecord(
    conflictId,
    {
      state: "override_approved",
      resolutionStatus: "override_approved",
      resolvedAt: now,
      resolvedByUserId: actorUserId ?? null,
      overrideReason: overrideReason ?? "Operator override approved",
    },
    { action: "record_override_approved", actorUserId, previousStatus: record.resolutionStatus, nextStatus: "override_approved" },
  );
}

export function markConflictWontFix(
  conflictId: string,
  actorUserId?: string | null,
  resolutionNote?: string | null,
): CalendarConflictRecord | null {
  const record = getConflictRecordById(conflictId);
  if (!record || !canTransitionConflictResolution(record.resolutionStatus, "wont_fix")) return null;
  return updateConflictRecord(
    conflictId,
    {
      resolutionStatus: "wont_fix",
      resolutionNote: resolutionNote ?? "Marked won't fix",
    },
    { action: "record_wont_fix", actorUserId, previousStatus: record.resolutionStatus, nextStatus: "wont_fix" },
  );
}

export function reopenConflictRecord(conflictId: string, actorUserId?: string | null): CalendarConflictRecord | null {
  const record = getConflictRecordById(conflictId);
  if (!record || !canTransitionConflictResolution(record.resolutionStatus, "open")) return null;
  return updateConflictRecord(
    conflictId,
    {
      state: record.kind === "kelly_travel" ? "possible_conflict" : "likely_conflict",
      resolutionStatus: "open",
      resolvedAt: null,
      resolvedByUserId: null,
      resolutionNote: null,
      overrideReason: null,
    },
    { action: "record_reopened", actorUserId, previousStatus: record.resolutionStatus, nextStatus: "open" },
  );
}

export function listResolvedConflicts(): CalendarConflictRecord[] {
  return listConflictRecords().filter(
    (r) => r.resolutionStatus === "resolved" || r.resolutionStatus === "override_approved" || r.resolutionStatus === "wont_fix",
  );
}

export function listTravelBufferConflicts(): CalendarConflictRecord[] {
  return listConflictRecords().filter((r) => r.kind === "kelly_travel");
}

export function listResourceOverlapConflicts(): CalendarConflictRecord[] {
  return listConflictRecords().filter((r) => r.kind === "resource_overlap");
}
