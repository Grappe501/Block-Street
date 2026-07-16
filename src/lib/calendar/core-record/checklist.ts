import type { CalendarCoreRecordSummary } from "./types";
import { isCoreRecordItemReady } from "./status";
import { listCoreRecordItems } from "./store";

export function buildCoreRecordSummary(eventId: string): CalendarCoreRecordSummary {
  const all = listCoreRecordItems({ eventId });
  const count = (cat: import("./types").CoreRecordCategory) => {
    const subset = all.filter((i) => i.category === cat);
    return {
      total: subset.length,
      ready: subset.filter((i) => isCoreRecordItemReady(i.itemStatus)).length,
    };
  };
  const ownership = count("ownership");
  const schedule = count("schedule");
  const venue = count("venue");
  const now = Date.now();
  const overdue = all.filter((i) => i.dueAt && new Date(i.dueAt).getTime() < now && !isCoreRecordItemReady(i.itemStatus));
  const incompleteRequired = all.filter((i) => i.required && !isCoreRecordItemReady(i.itemStatus));
  let readinessImpact: CalendarCoreRecordSummary["readinessImpact"] = "none";
  if (incompleteRequired.some((i) => i.blocksReadiness)) readinessImpact = "blocked";
  else if (incompleteRequired.length > 0 || overdue.length > 0) readinessImpact = "watch";

  return {
    eventId,
    ownershipTotal: ownership.total,
    ownershipReady: ownership.ready,
    scheduleTotal: schedule.total,
    scheduleReady: schedule.ready,
    venueTotal: venue.total,
    venueReady: venue.ready,
    incompleteRequired: incompleteRequired.length,
    overdueCount: overdue.length,
    readinessImpact,
    primaryGap: incompleteRequired.find((i) => i.blocksReadiness)?.label ?? incompleteRequired[0]?.label ?? null,
  };
}

export function listCoreRecordRows(eventId: string, category?: import("./types").CoreRecordCategory) {
  return listCoreRecordItems({ eventId, category }).map((i) => ({
    itemId: i.itemId,
    category: i.category,
    label: i.label,
    required: i.required,
    status: i.itemStatus,
    fieldSnapshot: i.fieldSnapshot,
  }));
}
