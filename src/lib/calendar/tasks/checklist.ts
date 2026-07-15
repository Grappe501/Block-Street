import type { CalendarTaskChecklistSummary } from "./types";
import { listReadinessBlockingTasks, listBlockingTasks } from "./blocking";
import { isTaskComplete } from "./status";
import { listTasks } from "./store";

export function buildTaskChecklistSummary(eventId: string): CalendarTaskChecklistSummary {
  const all = listTasks({ eventId });
  const required = all.filter((t) => t.required);
  const completeCount = all.filter((t) => isTaskComplete(t.taskStatus)).length;
  const incompleteRequired = required.filter((t) => !isTaskComplete(t.taskStatus));
  const blocked = listBlockingTasks(eventId);
  const now = Date.now();
  const overdue = all.filter(
    (t) => t.dueAt && new Date(t.dueAt).getTime() < now && !isTaskComplete(t.taskStatus),
  );
  const readinessBlockers = listReadinessBlockingTasks(eventId);
  let readinessImpact: CalendarTaskChecklistSummary["readinessImpact"] = "none";
  if (readinessBlockers.length > 0) readinessImpact = "blocked";
  else if (overdue.length > 0 || incompleteRequired.length > 0) readinessImpact = "watch";

  return {
    eventId,
    totalTasks: all.length,
    requiredCount: required.length,
    completeCount,
    incompleteRequiredCount: incompleteRequired.length,
    blockedCount: blocked.length,
    overdueCount: overdue.length,
    waivedCount: all.filter((t) => t.taskStatus === "waived").length,
    readinessImpact,
    primaryBlocker: readinessBlockers[0]?.title ?? incompleteRequired[0]?.title ?? null,
  };
}

export function generateChecklistRows(eventId: string) {
  return listTasks({ eventId }).map((t) => ({
    taskId: t.taskId,
    taskKey: t.taskKey,
    title: t.title,
    required: t.required,
    status: t.taskStatus,
    ownerUserId: t.ownerUserId,
    dueAt: t.dueAt,
    blocksReadiness: t.blocksReadiness,
  }));
}
