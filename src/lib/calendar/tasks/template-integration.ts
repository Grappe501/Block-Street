import type { CalendarEvent } from "../types";
import type { CalendarTemplateTask } from "../templates/types";
import { getTemplateById } from "../templates/registry";
import { TEMPLATE_CATALOG } from "../templates/catalog";
import { addTaskDependency } from "./dependencies";
import { createTask } from "./tasks";
import { listTasks } from "./store";

const EVENT_TYPE_TEMPLATE: Record<string, string> = {
  voter_registration_drive: "tpl-campus-voter-registration-drive",
  tabling: "tpl-campus-voter-registration-drive",
  college_community_meeting: "tpl-college-community-meeting",
  canvass: "tpl-canvass-launch",
  phone_bank: "tpl-phone-bank",
  candidate_appearance: "tpl-candidate-appearance",
  volunteer_orientation: "tpl-volunteer-orientation",
};

const DUE_OFFSET_DAYS: Record<string, number> = {
  "campus-permission": 14,
  "table-setup": 7,
  weather: 3,
  room: 10,
  contact: 10,
  agenda: 5,
  invite: 7,
  turf: 5,
  "check-in": 3,
  script: 7,
  tech: 3,
};

function dueFromEventStart(event: CalendarEvent, taskKey: string): string | null {
  if (!event.start_at) return null;
  const days = DUE_OFFSET_DAYS[taskKey];
  if (days == null) return null;
  const d = new Date(event.start_at);
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function seedDependenciesForRequiredChain(eventId: string, taskIds: string[]): void {
  for (let i = 1; i < taskIds.length; i++) {
    addTaskDependency({
      eventId,
      fromTaskId: taskIds[i - 1],
      toTaskId: taskIds[i],
      dependencyType: "blocks_start",
    });
  }
}

export function tasksFromTemplate(
  event: CalendarEvent,
  templateTasks: CalendarTemplateTask[],
  templateId: string,
  templateVersion: string,
) {
  const created = [];
  const requiredIds: string[] = [];
  for (const tt of templateTasks) {
    const task = createTask({
      eventId: event.event_id,
      taskKey: tt.taskKey,
      title: tt.title,
      required: tt.required,
      blocksReadiness: tt.required,
      dueAt: dueFromEventStart(event, tt.taskKey),
      generatedFromTemplate: true,
      templateId,
      templateVersion,
      ownerRoleKey: tt.required ? "event_board_member" : null,
    });
    created.push(task);
    if (tt.required) requiredIds.push(task.taskId);
  }
  if (requiredIds.length > 1) seedDependenciesForRequiredChain(event.event_id, requiredIds);
  return created;
}

export function ensureTasksFromEvent(event: CalendarEvent) {
  const existing = listTasks({ eventId: event.event_id });
  if (existing.length > 0) return existing;

  const templateId = event.template_id ?? EVENT_TYPE_TEMPLATE[event.event_type] ?? null;
  if (templateId) {
    const template = getTemplateById(templateId) ?? TEMPLATE_CATALOG.find((t) => t.templateId === templateId);
    if (template?.tasks.length) {
      return tasksFromTemplate(event, template.tasks, template.templateId, template.version);
    }
  }

  if (event.event_type === "voter_registration_drive") {
    return tasksFromTemplate(
      event,
      [
        { taskKey: "campus-permission", title: "Campus permission", required: true },
        { taskKey: "table-setup", title: "Table setup plan", required: true },
        { taskKey: "weather", title: "Weather plan", required: true },
      ],
      "tpl-campus-voter-registration-drive",
      "1.0.0",
    );
  }

  return [];
}

export function tasksRequiredForEvent(event: CalendarEvent): boolean {
  if (event.template_readiness?.requiredDimensions?.includes("tasks")) return true;
  if (event.template_readiness?.optionalDimensions?.includes("tasks")) return true;
  const templateId = event.template_id ?? EVENT_TYPE_TEMPLATE[event.event_type];
  if (templateId) {
    const t = getTemplateById(templateId);
    if (t && t.tasks.some((x) => x.required)) return true;
  }
  return ["voter_registration_drive", "canvass", "phone_bank", "candidate_appearance"].includes(event.event_type);
}
