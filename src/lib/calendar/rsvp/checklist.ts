import type { CalendarRsvpSummary } from "./types";
import { countRsvpHeadcount } from "./items";
import { isRsvpReady } from "./status";
import { listRsvpItems, listRsvpResponses } from "./store";

export function buildRsvpSummary(eventId: string): CalendarRsvpSummary {
  const all = listRsvpItems({ eventId });
  const count = (cat: import("./types").RsvpItemCategory) => {
    const subset = all.filter((i) => i.category === cat);
    return {
      total: subset.length,
      ready: subset.filter((i) => isRsvpReady(i.itemStatus)).length,
    };
  };
  const plan = count("plan");
  const operations = count("operations");
  const responses = listRsvpResponses({ eventId });
  const yesCount = responses.filter((r) => r.responseStatus === "yes").length;
  const maybeCount = responses.filter((r) => r.responseStatus === "maybe").length;
  const now = Date.now();
  const overdue = all.filter((i) => i.dueAt && new Date(i.dueAt).getTime() < now && !isRsvpReady(i.itemStatus));
  const incompleteRequired = all.filter((i) => i.required && !isRsvpReady(i.itemStatus));
  let readinessImpact: CalendarRsvpSummary["readinessImpact"] = "none";
  if (incompleteRequired.some((i) => i.blocksReadiness)) readinessImpact = "blocked";
  else if (incompleteRequired.length > 0 || overdue.length > 0) readinessImpact = "watch";
  const capacityItem = all.find((i) => i.itemKey === "capacity-target");

  return {
    eventId,
    planTotal: plan.total,
    planReady: plan.ready,
    operationsTotal: operations.total,
    operationsReady: operations.ready,
    responseCount: responses.length,
    yesCount,
    maybeCount,
    headcountEstimate: countRsvpHeadcount(eventId),
    targetHeadcount: capacityItem?.targetHeadcount ?? null,
    incompleteRequired: incompleteRequired.length,
    overdueCount: overdue.length,
    readinessImpact,
    primaryGap: incompleteRequired[0]?.label ?? null,
  };
}

export function listRsvpRows(eventId: string, category?: import("./types").RsvpItemCategory) {
  return listRsvpItems({ eventId, category }).map((i) => ({
    itemId: i.itemId,
    category: i.category,
    label: i.label,
    required: i.required,
    status: i.itemStatus,
    dueAt: i.dueAt,
    targetHeadcount: i.targetHeadcount,
  }));
}
