import type { ApprovalStatus, OperationalStatus } from "../types";
import type { CalendarLifecycleSummary } from "./types";
import { isLifecycleItemReady } from "./status";
import { listLifecycleItems, listStatusHistory } from "./store";
import { suggestOperationalTransitions } from "./transitions";

export function buildLifecycleSummary(
  eventId: string,
  operationalStatus: OperationalStatus,
  approvalStatus: ApprovalStatus,
): CalendarLifecycleSummary {
  const all = listLifecycleItems({ eventId });
  const count = (cat: import("./types").LifecycleItemCategory) => {
    const subset = all.filter((i) => i.category === cat);
    return {
      total: subset.length,
      ready: subset.filter((i) => isLifecycleItemReady(i.itemStatus)).length,
    };
  };
  const approval = count("approval");
  const operational = count("operational");
  const publication = count("publication");
  const history = listStatusHistory({ eventId });
  const now = Date.now();
  const overdue = all.filter((i) => i.dueAt && new Date(i.dueAt).getTime() < now && !isLifecycleItemReady(i.itemStatus));
  const incompleteRequired = all.filter((i) => i.required && !isLifecycleItemReady(i.itemStatus));
  let readinessImpact: CalendarLifecycleSummary["readinessImpact"] = "none";
  if (incompleteRequired.some((i) => i.blocksReadiness && i.category === "approval")) readinessImpact = "blocked";
  else if (incompleteRequired.length > 0 || overdue.length > 0) readinessImpact = "watch";

  const last = history[0]?.recordedAt ?? null;

  return {
    eventId,
    operationalStatus,
    approvalStatus,
    approvalTotal: approval.total,
    approvalReady: approval.ready,
    operationalTotal: operational.total,
    operationalReady: operational.ready,
    publicationTotal: publication.total,
    publicationReady: publication.ready,
    historyCount: history.length,
    lastTransitionAt: last,
    incompleteRequired: incompleteRequired.length,
    overdueCount: overdue.length,
    readinessImpact,
    primaryGap: incompleteRequired[0]?.label ?? null,
    suggestedTransitions: suggestOperationalTransitions(operationalStatus),
  };
}

export function listLifecycleRows(eventId: string, category?: import("./types").LifecycleItemCategory) {
  return listLifecycleItems({ eventId, category }).map((i) => ({
    itemId: i.itemId,
    category: i.category,
    label: i.label,
    required: i.required,
    status: i.itemStatus,
    dueAt: i.dueAt,
  }));
}
