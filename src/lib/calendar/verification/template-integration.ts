import type { CalendarEvent } from "../types";
import type { CalendarEventTemplate } from "../templates/types";
import { getTemplateById } from "../templates/registry";
import { TEMPLATE_CATALOG } from "../templates/catalog";
import { createVerificationItem } from "./items";
import { listVerificationItems } from "./store";

const EVENT_TYPE_TEMPLATE: Record<string, string> = {
  voter_registration_drive: "tpl-campus-voter-registration-drive",
  networking_event: "tpl-campus-networking-event",
  candidate_appearance: "tpl-candidate-appearance",
};

const DEFAULT_ITEMS = [
  { itemKey: "campus-permission", label: "Campus permission confirmed", category: "campus" as const, required: true },
  { itemKey: "venue-confirmation", label: "Venue layout and access confirmed", category: "venue" as const, required: true },
  { itemKey: "accessibility-review", label: "Accessibility review complete", category: "accessibility" as const, required: false },
  { itemKey: "compliance-review", label: "Compliance / legal review noted", category: "legal" as const, required: false },
];

function dueFromEventStart(event: CalendarEvent, daysBefore: number): string | null {
  if (!event.start_at) return null;
  const d = new Date(event.start_at);
  d.setDate(d.getDate() - daysBefore);
  return d.toISOString();
}

function isPublicInPerson(event: CalendarEvent): boolean {
  const publicFacing =
    event.visibility === "public" || event.publication_status === "published" || event.publication_status === "ready_to_publish";
  return publicFacing && (event.location_type === "in_person" || !event.location_type || event.event_type !== "phone_bank");
}

function seedFromTemplate(event: CalendarEvent, template: CalendarEventTemplate) {
  const verificationRequired =
    template.readiness.requiredDimensions.includes("verification") ||
    template.readiness.optionalDimensions.includes("verification");
  if (!verificationRequired && !isPublicInPerson(event)) return [];

  const created = [];
  for (const spec of DEFAULT_ITEMS) {
    const required =
      template.readiness.requiredDimensions.includes("verification") &&
      (spec.required || spec.category === "campus" || spec.category === "venue");
    if (spec.category === "legal" && template.complianceNotes.length === 0 && !required) continue;
    created.push(
      createVerificationItem({
        eventId: event.event_id,
        category: spec.category,
        itemKey: spec.itemKey,
        label: spec.label,
        required: required || (spec.required && isPublicInPerson(event)),
        blocksReadiness: required || (spec.required && isPublicInPerson(event)),
        dueAt: dueFromEventStart(event, spec.category === "legal" ? 14 : 7),
        generatedFromTemplate: true,
        templateId: template.templateId,
        templateVersion: template.version,
        ownerRoleKey: spec.category === "campus" ? "college_voter_registration_lead" : "event_board_member",
      }),
    );
  }
  return created;
}

export function ensureVerificationFromEvent(event: CalendarEvent) {
  const existing = listVerificationItems({ eventId: event.event_id });
  if (existing.length > 0) return existing;

  const templateId = event.template_id ?? EVENT_TYPE_TEMPLATE[event.event_type] ?? null;
  if (templateId) {
    const template = getTemplateById(templateId) ?? TEMPLATE_CATALOG.find((t) => t.templateId === templateId);
    if (template) return seedFromTemplate(event, template);
  }

  if (verificationRequiredForEvent(event)) {
    return DEFAULT_ITEMS.map((spec) =>
      createVerificationItem({
        eventId: event.event_id,
        category: spec.category,
        itemKey: spec.itemKey,
        label: spec.label,
        required: spec.required,
        blocksReadiness: spec.required,
        dueAt: dueFromEventStart(event, 7),
      }),
    );
  }

  return [];
}

export function verificationRequiredForEvent(event: CalendarEvent): boolean {
  if (event.template_readiness?.nonApplicableDimensions?.includes("verification")) return false;
  if (event.template_readiness?.requiredDimensions?.includes("verification")) return true;
  if (event.template_readiness?.optionalDimensions?.includes("verification")) return true;
  return isPublicInPerson(event);
}
