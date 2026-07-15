import { getPrerequisiteTaskIds } from "./dependencies";
import { isTaskComplete } from "./status";
import { getTaskById, listTasks, saveTask } from "./store";

export function isTaskBlockedByDependencies(taskId: string): { blocked: boolean; reasons: string[] } {
  const prereqs = getPrerequisiteTaskIds(taskId);
  const reasons: string[] = [];
  for (const pid of prereqs) {
    const p = getTaskById(pid);
    if (p && !isTaskComplete(p.taskStatus)) {
      reasons.push(`Waiting on: ${p.title}`);
    }
  }
  return { blocked: reasons.length > 0, reasons };
}

export function recomputeBlockedStatuses(eventId: string): number {
  let changed = 0;
  for (const task of listTasks({ eventId })) {
    if (task.taskStatus === "complete" || task.taskStatus === "waived" || task.taskStatus === "not_applicable") {
      continue;
    }
    const { blocked, reasons } = isTaskBlockedByDependencies(task.taskId);
    const nextStatus = blocked ? "blocked" : task.taskStatus === "blocked" ? "not_started" : task.taskStatus;
    if (nextStatus !== task.taskStatus) {
      saveTask({ ...task, taskStatus: nextStatus, updatedAt: new Date().toISOString() });
      changed++;
    }
  }
  return changed;
}

export function listBlockingTasks(eventId: string) {
  return listTasks({ eventId }).filter((t) => {
    if (t.taskStatus !== "blocked") return false;
    const { blocked } = isTaskBlockedByDependencies(t.taskId);
    return blocked;
  });
}

export function listReadinessBlockingTasks(eventId: string) {
  const now = Date.now();
  return listTasks({ eventId }).filter((t) => {
    if (!t.blocksReadiness || !t.required) return false;
    if (isTaskComplete(t.taskStatus)) return false;
    if (t.dueAt && new Date(t.dueAt).getTime() < now + 72 * 3600000) return true;
    return t.taskStatus === "blocked" || t.taskStatus === "not_started" || t.taskStatus === "in_progress";
  });
}
