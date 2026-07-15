import type { CalendarFollowUpSummary } from "./types";
import { isFollowUpComplete } from "./status";
import { REPORT_DUE_HOURS } from "./template-integration";
import { listFollowUpItems } from "./store";

export function buildFollowUpSummary(eventId: string): CalendarFollowUpSummary {
  const all = listFollowUpItems({ eventId });
  const count = (cat: import("./types").FollowUpItemCategory) => {
    const subset = all.filter((i) => i.category === cat);
    return {
      total: subset.length,
      submitted: subset.filter((i) => isFollowUpComplete(i.itemStatus)).length,
    };
  };
  const metrics = count("metric");
  const actions = count("action");
  const now = Date.now();
  const overdue = all.filter((i) => i.dueAt && new Date(i.dueAt).getTime() < now && !isFollowUpComplete(i.itemStatus));
  const incompleteRequired = all.filter((i) => i.required && !isFollowUpComplete(i.itemStatus));
  let readinessImpact: CalendarFollowUpSummary["readinessImpact"] = "none";
  if (incompleteRequired.some((i) => i.blocksReadiness)) readinessImpact = "blocked";
  else if (incompleteRequired.length > 0 || overdue.length > 0) readinessImpact = "watch";

  const dueDates = all.map((i) => i.dueAt).filter(Boolean) as string[];

  return {
    eventId,
    metricsTotal: metrics.total,
    metricsSubmitted: metrics.submitted,
    actionsTotal: actions.total,
    actionsSubmitted: actions.submitted,
    incompleteRequired: incompleteRequired.length,
    overdueCount: overdue.length,
    readinessImpact,
    reportDueAt: dueDates[0] ?? null,
    primaryGap: incompleteRequired[0]?.label ?? null,
  };
}

export function listFollowUpRows(eventId: string, category?: import("./types").FollowUpItemCategory) {
  return listFollowUpItems({ eventId, category }).map((i) => ({
    itemId: i.itemId,
    category: i.category,
    label: i.label,
    required: i.required,
    status: i.itemStatus,
    metricType: i.metricType,
    dueAt: i.dueAt,
    valueText: i.valueText,
    valueCount: i.valueCount,
    valueBoolean: i.valueBoolean,
  }));
}

export { REPORT_DUE_HOURS };
