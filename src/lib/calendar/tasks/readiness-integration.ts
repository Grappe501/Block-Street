import type { CalendarEvent } from "../types";
import type { EventReadinessItem, EventReadinessState } from "../operations/types";
import { buildTaskChecklistSummary } from "./checklist";
import { listReadinessBlockingTasks } from "./blocking";
import { isTaskComplete } from "./status";
import { ensureTasksFromEvent, tasksRequiredForEvent } from "./template-integration";
import { listTasks } from "./store";

function eventRoute(eventId: string, suffix = ""): string {
  return `/calendar/event/${eventId}${suffix}`;
}

export function evaluateEventTasksReadiness(event: CalendarEvent, now: Date = new Date()): EventReadinessItem {
  const route = eventRoute(event.event_id, "/tasks");
  if (event.operational_status === "completed" || event.operational_status === "canceled") {
    return {
      dimension: "tasks",
      state: "not_required",
      label: "Tasks",
      explanation: "Event closed — task tracking not required.",
      route,
    };
  }

  if (!tasksRequiredForEvent(event)) {
    return {
      dimension: "tasks",
      state: "not_required",
      label: "Tasks",
      explanation: "No task checklist required for this event type.",
      route,
    };
  }

  ensureTasksFromEvent(event);
  const summary = buildTaskChecklistSummary(event.event_id);
  const hoursUntil = (new Date(event.start_at).getTime() - now.getTime()) / 36e5;
  const blockers = listReadinessBlockingTasks(event.event_id).filter((t) => !isTaskComplete(t.taskStatus));

  if (summary.totalTasks === 0) {
    return {
      dimension: "tasks",
      state: "not_started",
      label: "Tasks",
      explanation: "Task checklist not generated yet.",
      route,
    };
  }

  if (blockers.length > 0 && hoursUntil <= 72 && hoursUntil >= 0) {
    return {
      dimension: "tasks",
      state: "blocked",
      label: "Tasks",
      explanation: `Blocking task incomplete: ${blockers[0].title}`,
      blocker: blockers.map((t) => t.title).join("; "),
      route: eventRoute(event.event_id, `/tasks/${blockers[0].taskId}`),
    };
  }

  if (summary.incompleteRequiredCount > 0) {
    return {
      dimension: "tasks",
      state: "in_progress",
      label: "Tasks",
      explanation: `${summary.completeCount}/${summary.requiredCount} required tasks complete (soft beta).`,
      route,
    };
  }

  return {
    dimension: "tasks",
    state: "ready",
    label: "Tasks",
    explanation: "Required checklist complete — soft-beta task records only.",
    route,
  };
}

export function tasksReadinessStateForEvent(eventId: string): EventReadinessState {
  const summary = buildTaskChecklistSummary(eventId);
  if (summary.totalTasks === 0) return "not_started";
  if (summary.readinessImpact === "blocked") return "blocked";
  if (summary.incompleteRequiredCount > 0) return "in_progress";
  return "ready";
}
