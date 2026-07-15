import type { CalendarPreparationSummary } from "./types";
import { isPreparationReady } from "./status";
import { listPreparationItems } from "./store";

export function buildPreparationSummary(eventId: string): CalendarPreparationSummary {
  const all = listPreparationItems({ eventId });
  const count = (cat: import("./types").PreparationCategory) => {
    const subset = all.filter((i) => i.category === cat);
    return {
      total: subset.length,
      ready: subset.filter((i) => isPreparationReady(i.itemStatus)).length,
    };
  };
  const logistics = count("logistics");
  const materials = count("materials");
  const promotion = count("promotion");
  const reminders = count("reminder");
  const now = Date.now();
  const overdue = all.filter((i) => i.dueAt && new Date(i.dueAt).getTime() < now && !isPreparationReady(i.itemStatus));
  const incompleteRequired = all.filter((i) => i.required && !isPreparationReady(i.itemStatus));
  let readinessImpact: CalendarPreparationSummary["readinessImpact"] = "none";
  if (incompleteRequired.some((i) => i.blocksReadiness)) readinessImpact = "blocked";
  else if (incompleteRequired.length > 0 || overdue.length > 0) readinessImpact = "watch";

  return {
    eventId,
    logisticsTotal: logistics.total,
    logisticsReady: logistics.ready,
    materialsTotal: materials.total,
    materialsReady: materials.ready,
    promotionTotal: promotion.total,
    promotionReady: promotion.ready,
    remindersTotal: reminders.total,
    remindersReady: reminders.ready,
    incompleteRequired: incompleteRequired.length,
    overdueCount: overdue.length,
    readinessImpact,
    primaryGap: incompleteRequired[0]?.label ?? null,
  };
}

export function listPreparationRows(eventId: string, category?: import("./types").PreparationCategory) {
  return listPreparationItems({ eventId, category }).map((i) => ({
    itemId: i.itemId,
    category: i.category,
    label: i.label,
    required: i.required,
    status: i.itemStatus,
    dueAt: i.dueAt,
    communicationState: i.communicationState,
  }));
}
