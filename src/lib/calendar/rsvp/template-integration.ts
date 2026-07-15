import type { CalendarEvent } from "../types";
import type { CalendarEventTemplate } from "../templates/types";
import { getTemplateById } from "../templates/registry";
import { TEMPLATE_CATALOG } from "../templates/catalog";
import { createRsvpItem } from "./items";
import { listRsvpItems } from "./store";

const EVENT_TYPE_TEMPLATE: Record<string, string> = {
  voter_registration_drive: "tpl-campus-voter-registration-drive",
  networking_event: "tpl-campus-networking-event",
  orientation: "tpl-volunteer-orientation",
};

const PLAN_ITEMS = [
  { itemKey: "capacity-target", label: "Set RSVP capacity target", category: "plan" as const, required: true },
  { itemKey: "open-rsvp", label: "Open RSVP collection", category: "plan" as const, required: true },
  { itemKey: "check-in-plan", label: "Prepare check-in plan", category: "operations" as const, required: true },
];

function dueFromEventStart(event: CalendarEvent, daysBefore: number): string | null {
  if (!event.start_at) return null;
  const d = new Date(event.start_at);
  d.setDate(d.getDate() - daysBefore);
  return d.toISOString();
}

function seedFromTemplate(event: CalendarEvent, template: CalendarEventTemplate) {
  const mode = template.defaults.rsvpMode;
  if (mode === "none") return [];
  const required = mode === "required" || mode === "recommended";
  return PLAN_ITEMS.map((p) =>
    createRsvpItem({
      eventId: event.event_id,
      category: p.category,
      itemKey: p.itemKey,
      label: p.label,
      required: required && p.required,
      blocksReadiness: required && p.required,
      dueAt: dueFromEventStart(event, p.category === "plan" ? 7 : 2),
      generatedFromTemplate: true,
      templateId: template.templateId,
      templateVersion: template.version,
      targetHeadcount: p.itemKey === "capacity-target" ? 50 : null,
    }),
  );
}

export function ensureRsvpFromEvent(event: CalendarEvent) {
  const existing = listRsvpItems({ eventId: event.event_id });
  if (existing.length > 0) return existing;

  const templateId = event.template_id ?? EVENT_TYPE_TEMPLATE[event.event_type] ?? null;
  if (templateId) {
    const template = getTemplateById(templateId) ?? TEMPLATE_CATALOG.find((t) => t.templateId === templateId);
    if (template) return seedFromTemplate(event, template);
  }

  if (event.event_type === "networking_event") {
    const template = TEMPLATE_CATALOG.find((t) => t.templateId === "tpl-campus-networking-event");
    if (template) return seedFromTemplate(event, template);
  }

  if (rsvpRequiredForEvent(event)) {
    return PLAN_ITEMS.map((p) =>
      createRsvpItem({
        eventId: event.event_id,
        category: p.category,
        itemKey: p.itemKey,
        label: p.label,
        required: p.required,
        blocksReadiness: p.required,
        dueAt: dueFromEventStart(event, 5),
      }),
    );
  }

  return [];
}

export function rsvpRequiredForEvent(event: CalendarEvent): boolean {
  if (event.template_readiness?.nonApplicableDimensions?.includes("rsvp")) return false;
  if (event.template_readiness?.requiredDimensions?.includes("rsvp")) return true;
  if (event.template_readiness?.optionalDimensions?.includes("rsvp")) return true;
  return ["networking_event", "social"].includes(event.event_type);
}
