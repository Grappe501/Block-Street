import type { CalendarEventTask, CalendarEventTaskDependency, CalendarTaskAuditEvent } from "./types";

let tasks: CalendarEventTask[] = [];
let dependencies: CalendarEventTaskDependency[] = [];
let auditEvents: CalendarTaskAuditEvent[] = [];

export function listTasks(filter?: { eventId?: string; taskId?: string }): CalendarEventTask[] {
  return tasks.filter((t) => {
    if (filter?.eventId && t.eventId !== filter.eventId) return false;
    if (filter?.taskId && t.taskId !== filter.taskId) return false;
    return true;
  });
}

export function getTaskById(taskId: string): CalendarEventTask | null {
  return tasks.find((t) => t.taskId === taskId) ?? null;
}

export function saveTask(t: CalendarEventTask): CalendarEventTask {
  tasks = [t, ...tasks.filter((x) => x.taskId !== t.taskId)];
  return t;
}

export function listDependencies(filter?: { eventId?: string; toTaskId?: string }): CalendarEventTaskDependency[] {
  return dependencies.filter((d) => {
    if (filter?.eventId && d.eventId !== filter.eventId) return false;
    if (filter?.toTaskId && d.toTaskId !== filter.toTaskId) return false;
    return true;
  });
}

export function saveDependency(d: CalendarEventTaskDependency): CalendarEventTaskDependency {
  dependencies = [d, ...dependencies.filter((x) => x.dependencyId !== d.dependencyId)];
  return d;
}

export function appendTaskAudit(e: CalendarTaskAuditEvent): CalendarTaskAuditEvent {
  auditEvents = [e, ...auditEvents];
  return e;
}

export function listTaskAudit(entityId?: string): CalendarTaskAuditEvent[] {
  return entityId ? auditEvents.filter((e) => e.entityId === entityId) : [...auditEvents];
}

export function seedTaskFixtures(fixtures: {
  tasks?: CalendarEventTask[];
  dependencies?: CalendarEventTaskDependency[];
}): void {
  if (fixtures.tasks) tasks = [...fixtures.tasks];
  if (fixtures.dependencies) dependencies = [...fixtures.dependencies];
}

export function clearTasksStoreForTest(): void {
  tasks = [];
  dependencies = [];
  auditEvents = [];
}
