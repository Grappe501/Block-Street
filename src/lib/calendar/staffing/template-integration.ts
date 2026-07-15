import type { CalendarEvent } from "../types";
import type { CalendarTemplateVolunteerRole } from "../templates/types";
import { getTemplateById } from "../templates/registry";
import { createRequirement } from "./requirements";
import { getRoleDefinition } from "./role-catalog";
import { listRequirements } from "./store";
import type { CalendarStaffingRequirement } from "./types";

const TEMPLATE_ROLE_MAP: Record<string, string> = {
  "event-lead": "event_lead",
  "registration": "registration_table",
  "registration-table": "registration_table",
  "registration_table": "registration_table",
  "greeter": "greeter",
  "line-support": "line_support",
  "campus-liaison": "campus_liaison",
  "materials": "materials_runner",
  "tally": "data_tally",
  "notes": "note_taker",
  "data-tally": "data_tally",
  "photographer": "photography_content",
  "host": "meeting_host",
  "check-in": "check_in",
  "note-taker": "note_taker",
  "follow-up": "follow_up",
  "facilitator": "discussion_facilitator",
  "content-volunteer": "photography_content",
  "canvass-captain": "canvass_captain",
  "canvasser": "canvasser",
  "phone-bank-lead": "phone_bank_lead",
  "phone-banker": "phone_banker",
  "text-bank-lead": "text_bank_lead",
  "text-banker": "text_banker",
  "candidate-support": "candidate_support",
  "trainer": "meeting_host",
};

function mapTemplateRoleKey(roleKey: string): string {
  return TEMPLATE_ROLE_MAP[roleKey] ?? roleKey.replace(/-/g, "_");
}

export function requirementsFromTemplateRoles(
  event: CalendarEvent,
  roles: CalendarTemplateVolunteerRole[],
  templateId: string,
  templateVersion: string,
): CalendarStaffingRequirement[] {
  const created: CalendarStaffingRequirement[] = [];
  for (const role of roles) {
    const mappedKey = mapTemplateRoleKey(role.roleKey);
    const def = getRoleDefinition(mappedKey);
    created.push(
      createRequirement({
        eventId: event.event_id,
        roleKey: mappedKey,
        roleLabel: role.title || def?.label || mappedKey,
        roleDescription: def?.description ?? role.title,
        minimumNeeded: role.required ? Math.max(1, role.numberNeeded) : 0,
        targetNeeded: role.numberNeeded,
        criticality: role.required ? (def?.defaultCriticality === "optional" ? "required" : def?.defaultCriticality ?? "required") : "optional",
        trainingRequirementKeys: def?.defaultTrainingRequirementKeys ?? [],
        leadRequired: def?.defaultLeadRequired ?? false,
        generatedFromTemplate: true,
        templateId,
        templateVersion,
        participantInstructions: null,
        internalNotes: null,
        defaultShiftDurationMinutes: null,
        defaultArrivalOffsetMinutes: null,
        accessibilityNotes: null,
      }),
    );
  }
  return created;
}

export function ensureStaffingFromEvent(event: CalendarEvent): CalendarStaffingRequirement[] {
  const existing = listRequirements(event.event_id);
  if (existing.length > 0) return existing;

  if (event.template_id) {
    const template = getTemplateById(event.template_id);
    if (template?.volunteerRoles.length) {
      return requirementsFromTemplateRoles(event, template.volunteerRoles, template.templateId, template.version);
    }
  }

  if (event.volunteer_roles.length > 0) {
    return event.volunteer_roles.map((r) => {
      const mappedKey = mapTemplateRoleKey(r.role_id);
      const def = getRoleDefinition(mappedKey);
      return createRequirement({
        eventId: event.event_id,
        roleKey: mappedKey,
        roleLabel: r.title,
        roleDescription: r.instructions ?? r.title,
        minimumNeeded: Math.max(1, Math.ceil(r.number_needed * 0.6)),
        targetNeeded: r.number_needed,
        criticality: r.training_required ? "required" : "helpful",
        trainingRequirementKeys: r.training_required ? def?.defaultTrainingRequirementKeys ?? ["general_volunteer_orientation"] : [],
        leadRequired: def?.defaultLeadRequired ?? false,
        generatedFromTemplate: Boolean(event.template_id),
        templateId: event.template_id ?? null,
        templateVersion: event.template_version ?? null,
        participantInstructions: r.instructions ?? null,
        internalNotes: null,
        defaultShiftDurationMinutes: null,
        defaultArrivalOffsetMinutes: null,
        accessibilityNotes: null,
      });
    });
  }

  return [];
}
