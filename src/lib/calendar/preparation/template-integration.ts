import type { CalendarEvent } from "../types";
import type { CalendarEventTemplate } from "../templates/types";
import { getTemplateById } from "../templates/registry";
import { TEMPLATE_CATALOG } from "../templates/catalog";
import { createPreparationItem } from "./items";
import { listPreparationItems } from "./store";

const EVENT_TYPE_TEMPLATE: Record<string, string> = {
  voter_registration_drive: "tpl-campus-voter-registration-drive",
  tabling: "tpl-campus-voter-registration-drive",
  networking_event: "tpl-campus-networking-event",
  orientation: "tpl-volunteer-orientation",
  candidate_appearance: "tpl-candidate-appearance",
};

const DUE_OFFSET_DAYS: Record<string, number> = {
  forms: 5,
  clipboards: 3,
  table: 7,
  signage: 5,
  "campus-flyers": 10,
  "campus-promo": 10,
  "sign-in": 3,
};

function dueFromEventStart(event: CalendarEvent, key: string): string | null {
  if (!event.start_at) return null;
  const days = DUE_OFFSET_DAYS[key];
  if (days == null) return null;
  const d = new Date(event.start_at);
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function scheduledReminder(event: CalendarEvent, offsetHours: number): string | null {
  if (!event.start_at) return null;
  const d = new Date(event.start_at);
  d.setHours(d.getHours() - offsetHours);
  return d.toISOString();
}

function seedFromTemplate(event: CalendarEvent, template: CalendarEventTemplate) {
  const created = [];
  for (const l of template.logistics) {
    created.push(
      createPreparationItem({
        eventId: event.event_id,
        category: "logistics",
        itemKey: l.itemKey,
        label: l.label,
        required: l.required,
        dueAt: dueFromEventStart(event, l.itemKey),
        generatedFromTemplate: true,
        templateId: template.templateId,
        templateVersion: template.version,
        ownerRoleKey: "event_board_member",
      }),
    );
  }
  for (const m of template.materials) {
    created.push(
      createPreparationItem({
        eventId: event.event_id,
        category: "materials",
        itemKey: m.materialKey,
        label: m.label,
        required: m.required,
        blocksReadiness: m.required,
        readinessDimension: "materials",
        dueAt: dueFromEventStart(event, m.materialKey),
        generatedFromTemplate: true,
        templateId: template.templateId,
        templateVersion: template.version,
      }),
    );
  }
  for (const p of template.promotion) {
    created.push(
      createPreparationItem({
        eventId: event.event_id,
        category: "promotion",
        itemKey: p.itemKey,
        label: p.label,
        required: p.required,
        blocksReadiness: p.required,
        readinessDimension: "promotion",
        dueAt: dueFromEventStart(event, p.itemKey),
        generatedFromTemplate: true,
        templateId: template.templateId,
        templateVersion: template.version,
      }),
    );
  }
  for (const r of template.reminders) {
    created.push(
      createPreparationItem({
        eventId: event.event_id,
        category: "reminder",
        itemKey: r.reminderKey,
        label: r.label,
        required: true,
        reminderOffsetHours: r.offsetHours,
        scheduledAt: scheduledReminder(event, r.offsetHours),
        generatedFromTemplate: true,
        templateId: template.templateId,
        templateVersion: template.version,
      }),
    );
  }
  return created;
}

export function ensurePreparationFromEvent(event: CalendarEvent) {
  const existing = listPreparationItems({ eventId: event.event_id });
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

  return [];
}

export function preparationRequiredForEvent(event: CalendarEvent, dimension: "materials" | "promotion"): boolean {
  if (event.template_readiness?.requiredDimensions?.includes(dimension)) return true;
  if (event.template_readiness?.optionalDimensions?.includes(dimension)) return true;
  if (dimension === "materials") {
    return ["voter_registration_drive", "tabling", "canvass"].includes(event.event_type);
  }
  if (dimension === "promotion") {
    return event.visibility === "public" || event.publication_status === "published" || event.publication_status === "ready_to_publish";
  }
  return false;
}
