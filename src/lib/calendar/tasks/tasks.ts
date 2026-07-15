import type { CalendarEventTask } from "./types";
import { recordTaskAudit } from "./audit";
import { canTransitionTask } from "./status";
import { getTaskById, listTasks, saveTask } from "./store";
import { recomputeBlockedStatuses } from "./blocking";

export function createTask(input: {
  eventId: string;
  taskKey: string;
  title: string;
  required?: boolean;
  blocksReadiness?: boolean;
  ownerUserId?: string | null;
  ownerRoleKey?: string | null;
  dueAt?: string | null;
  generatedFromTemplate?: boolean;
  templateId?: string | null;
  templateVersion?: string | null;
}): CalendarEventTask {
  const now = new Date().toISOString();
  const task: CalendarEventTask = {
    taskId: `tsk-${input.eventId}-${input.taskKey}`,
    eventId: input.eventId,
    taskKey: input.taskKey,
    title: input.title,
    required: input.required ?? false,
    taskStatus: "not_started",
    ownerUserId: input.ownerUserId ?? null,
    ownerRoleKey: input.ownerRoleKey ?? null,
    dueAt: input.dueAt ?? null,
    blocksReadiness: input.blocksReadiness ?? (input.required ?? false),
    generatedFromTemplate: input.generatedFromTemplate ?? false,
    templateId: input.templateId ?? null,
    templateVersion: input.templateVersion ?? null,
    softBeta: true,
    durableAuthority: false,
    createdAt: now,
    updatedAt: now,
  };
  saveTask(task);
  recordTaskAudit({
    entityType: "task",
    entityId: task.taskId,
    eventId: task.eventId,
    action: "task_created",
    nextStatus: task.taskStatus,
  });
  recomputeBlockedStatuses(input.eventId);
  return task;
}

export function assignTaskOwner(taskId: string, ownerUserId: string | null, ownerRoleKey?: string | null): CalendarEventTask | null {
  const task = getTaskById(taskId);
  if (!task) return null;
  const updated = saveTask({
    ...task,
    ownerUserId,
    ownerRoleKey: ownerRoleKey ?? task.ownerRoleKey,
    updatedAt: new Date().toISOString(),
  });
  recordTaskAudit({
    entityType: "task",
    entityId: taskId,
    eventId: task.eventId,
    action: "owner_assigned",
    actorUserId: ownerUserId,
  });
  return updated;
}

export function setTaskDueAt(taskId: string, dueAt: string | null): CalendarEventTask | null {
  const task = getTaskById(taskId);
  if (!task) return null;
  return saveTask({ ...task, dueAt, updatedAt: new Date().toISOString() });
}

export function transitionTask(
  taskId: string,
  toStatus: CalendarEventTask["taskStatus"],
  actorUserId?: string | null,
  evidenceNote?: string | null,
): CalendarEventTask | null {
  const task = getTaskById(taskId);
  if (!task || !canTransitionTask(task.taskStatus, toStatus)) return null;
  const now = new Date().toISOString();
  const updated = saveTask({
    ...task,
    taskStatus: toStatus,
    completedAt: toStatus === "complete" || toStatus === "waived" ? now : task.completedAt,
    evidenceNote: evidenceNote ?? task.evidenceNote,
    updatedAt: now,
  });
  recordTaskAudit({
    entityType: "task",
    entityId: taskId,
    eventId: task.eventId,
    action: `task_${toStatus}`,
    previousStatus: task.taskStatus,
    nextStatus: toStatus,
    actorUserId: actorUserId ?? null,
  });
  recomputeBlockedStatuses(task.eventId);
  return updated;
}

export function completeTask(taskId: string, actorUserId?: string | null, evidenceNote?: string | null): CalendarEventTask | null {
  return transitionTask(taskId, "complete", actorUserId, evidenceNote);
}

export function waiveTask(taskId: string, actorUserId?: string | null, reason?: string | null): CalendarEventTask | null {
  return transitionTask(taskId, "waived", actorUserId, reason);
}

export function startTask(taskId: string, actorUserId?: string | null): CalendarEventTask | null {
  return transitionTask(taskId, "in_progress", actorUserId);
}

export function listMyTasks(ownerUserId: string): CalendarEventTask[] {
  return listTasks().filter((t) => t.ownerUserId === ownerUserId && t.taskStatus !== "complete" && t.taskStatus !== "waived");
}
