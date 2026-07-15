import type { CalendarEvent } from "../types";
import type { CalendarEventTemplate } from "../templates/types";
import { getTemplateById } from "../templates/registry";
import { TEMPLATE_CATALOG } from "../templates/catalog";
import { createFollowUpItem } from "./items";
import { listFollowUpItems } from "./store";

export const REPORT_DUE_HOURS = 48;

const EVENT_TYPE_TEMPLATE: Record<string, string> = {
  voter_registration_drive: "tpl-campus-voter-registration-drive",
  tabling: "tpl-campus-voter-registration-drive",
  networking_event: "tpl-campus-networking-event",
  orientation: "tpl-volunteer-orientation",
  candidate_appearance: "tpl-candidate-appearance",
};

const DEFAULT_ACTIONS = [
  { actionKey: "outcome-summary", label: "Capture outcome summary", required: true, metricType: "text" as const },
  { actionKey: "team-debrief", label: "Complete team debrief", required: false, metricType: "boolean" as const },
];

function reportDueFromEventEnd(event: CalendarEvent): string | null {
  if (!event.end_at) return null;
  const d = new Date(event.end_at);
  d.setHours(d.getHours() + REPORT_DUE_HOURS);
  return d.toISOString();
}

function seedFromTemplate(event: CalendarEvent, template: CalendarEventTemplate) {
  const dueAt = reportDueFromEventEnd(event);
  const created = [];
  for (const field of template.reportFields) {
    created.push(
      createFollowUpItem({
        eventId: event.event_id,
        category: "metric",
        itemKey: field.fieldKey,
        label: field.label,
        required: field.required,
        metricType: field.metricType ?? "count",
        blocksReadiness: field.required,
        dueAt,
        generatedFromTemplate: true,
        templateId: template.templateId,
        templateVersion: template.version,
      }),
    );
  }
  const followUpRequired =
    template.readiness.requiredDimensions.includes("follow_up") ||
    template.readiness.optionalDimensions.includes("follow_up");
  if (followUpRequired) {
    for (const action of DEFAULT_ACTIONS) {
      if (template.reportFields.some((f) => f.fieldKey === action.actionKey)) continue;
      created.push(
        createFollowUpItem({
          eventId: event.event_id,
          category: "action",
          itemKey: action.actionKey,
          label: action.label,
          required: action.required,
          metricType: action.metricType,
          blocksReadiness: action.required,
          dueAt,
          generatedFromTemplate: true,
          templateId: template.templateId,
          templateVersion: template.version,
        }),
      );
    }
  }
  return created;
}

export function ensureFollowUpFromEvent(event: CalendarEvent) {
  const existing = listFollowUpItems({ eventId: event.event_id });
  if (existing.length > 0) return existing;

  const templateId = event.template_id ?? EVENT_TYPE_TEMPLATE[event.event_type] ?? null;
  if (templateId) {
    const template = getTemplateById(templateId) ?? TEMPLATE_CATALOG.find((t) => t.templateId === templateId);
    if (template) return seedFromTemplate(event, template);
  }

  if (event.event_type === "voter_registration_drive") {
    const template = TEMPLATE_CATALOG.find((t) => t.templateId === "tpl-campus-voter-registration-drive");
    if (template) return seedFromTemplate(event, template);
  }

  if (followUpRequiredForEvent(event)) {
    const dueAt = reportDueFromEventEnd(event);
    return [
      createFollowUpItem({
        eventId: event.event_id,
        category: "metric",
        itemKey: "attendees",
        label: "Attendees",
        required: true,
        metricType: "count",
        blocksReadiness: true,
        dueAt,
      }),
      createFollowUpItem({
        eventId: event.event_id,
        category: "action",
        itemKey: "outcome-summary",
        label: "Capture outcome summary",
        required: true,
        metricType: "text",
        blocksReadiness: true,
        dueAt,
      }),
    ];
  }

  return [];
}

export function followUpRequiredForEvent(event: CalendarEvent): boolean {
  if (event.template_readiness?.requiredDimensions?.includes("follow_up")) return true;
  if (event.template_readiness?.optionalDimensions?.includes("follow_up")) return true;
  if (event.template_readiness?.nonApplicableDimensions?.includes("follow_up")) return false;
  return ["voter_registration_drive", "tabling", "networking_event", "canvass", "phone_bank"].includes(
    event.event_type,
  );
}

export function isFollowUpDue(event: CalendarEvent, now: Date = new Date()): boolean {
  if (event.operational_status === "completed") return true;
  return new Date(event.end_at).getTime() < now.getTime();
}
