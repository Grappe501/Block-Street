import type { CalendarConflictSummary } from "./types";
import { isConflictItemReady } from "./status";
import { getConflictRecordById, listConflictItems } from "./store";

export function buildConflictSummary(conflictId: string): CalendarConflictSummary | null {
  const record = getConflictRecordById(conflictId);
  if (!record) return null;
  const all = listConflictItems({ conflictId });
  const count = (cat: import("./types").ConflictItemCategory) => {
    const subset = all.filter((i) => i.category === cat);
    return {
      total: subset.length,
      ready: subset.filter((i) => isConflictItemReady(i.itemStatus)).length,
    };
  };
  const review = count("review");
  const communication = count("communication");
  const resolution = count("resolution");
  const incompleteRequired = all.filter((i) => i.required && !isConflictItemReady(i.itemStatus));
  let readinessImpact: CalendarConflictSummary["readinessImpact"] = "none";
  if (incompleteRequired.some((i) => i.blocksResolution)) readinessImpact = "blocked";
  else if (incompleteRequired.length > 0) readinessImpact = "watch";

  return {
    conflictId,
    eventIds: record.eventIds,
    kind: record.kind,
    state: record.state,
    resolutionStatus: record.resolutionStatus,
    reviewTotal: review.total,
    reviewReady: review.ready,
    communicationTotal: communication.total,
    communicationReady: communication.ready,
    resolutionTotal: resolution.total,
    resolutionReady: resolution.ready,
    incompleteRequired: incompleteRequired.length,
    readinessImpact,
    primaryGap: incompleteRequired[0]?.label ?? null,
  };
}

export function listConflictRows(conflictId: string, eventId?: string) {
  return listConflictItems({ conflictId, eventId }).map((i) => ({
    itemId: i.itemId,
    eventId: i.eventId,
    category: i.category,
    label: i.label,
    required: i.required,
    status: i.itemStatus,
  }));
}

export function listEventConflictSummaries(eventId: string): CalendarConflictSummary[] {
  return listConflictItems({ eventId })
    .map((i) => i.conflictId)
    .filter((id, idx, arr) => arr.indexOf(id) === idx)
    .map((id) => buildConflictSummary(id))
    .filter((s): s is CalendarConflictSummary => s !== null);
}
