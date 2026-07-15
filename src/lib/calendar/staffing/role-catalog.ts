import type { CalendarStaffingRoleDefinition, StaffingCriticality } from "./types";

function role(
  roleKey: string,
  label: string,
  category: string,
  opts: Partial<CalendarStaffingRoleDefinition> = {},
): CalendarStaffingRoleDefinition {
  return {
    roleKey,
    label,
    description: opts.description ?? label,
    category,
    defaultCriticality: (opts.defaultCriticality ?? "required") as StaffingCriticality,
    defaultLeadRequired: opts.defaultLeadRequired ?? false,
    defaultTrainingRequirementKeys: opts.defaultTrainingRequirementKeys ?? [],
    defaultArrivalOffsetMinutes: opts.defaultArrivalOffsetMinutes ?? null,
    publicSafeDescription: opts.publicSafeDescription ?? label,
    active: opts.active ?? true,
  };
}

export const STAFFING_ROLE_CATALOG: CalendarStaffingRoleDefinition[] = [
  role("event_lead", "Event lead", "leadership", { defaultCriticality: "critical", defaultLeadRequired: true, defaultTrainingRequirementKeys: ["shift_lead_orientation"] }),
  role("shift_lead", "Shift lead", "leadership", { defaultCriticality: "required", defaultLeadRequired: true, defaultTrainingRequirementKeys: ["shift_lead_orientation"] }),
  role("setup", "Setup", "logistics"),
  role("breakdown", "Breakdown", "logistics"),
  role("greeter", "Greeter", "guest_support", { defaultTrainingRequirementKeys: ["general_volunteer_orientation"] }),
  role("check_in", "Check-in", "guest_support", { defaultCriticality: "required", defaultTrainingRequirementKeys: ["event_check_in_training"] }),
  role("registration_table", "Registration table", "registration", { defaultCriticality: "critical", defaultTrainingRequirementKeys: ["voter_registration_rules", "event_check_in_training"] }),
  role("line_support", "Line support", "guest_support"),
  role("campus_liaison", "Campus liaison", "organizing", { defaultCriticality: "required", defaultTrainingRequirementKeys: ["campus_access_orientation"] }),
  role("county_liaison", "County liaison", "organizing"),
  role("city_liaison", "City liaison", "organizing"),
  role("materials_runner", "Materials runner", "logistics"),
  role("data_tally", "Data and tally lead", "organizing", { defaultTrainingRequirementKeys: ["data_privacy_training"] }),
  role("photography_content", "Photography / content", "communications"),
  role("discussion_facilitator", "Discussion facilitator", "organizing", { defaultTrainingRequirementKeys: ["general_volunteer_orientation"] }),
  role("meeting_host", "Meeting host", "leadership", { defaultLeadRequired: true }),
  role("note_taker", "Note taker", "follow_up"),
  role("follow_up", "Follow-up lead", "follow_up"),
  role("canvass_captain", "Canvass captain", "field", { defaultCriticality: "critical", defaultLeadRequired: true, defaultTrainingRequirementKeys: ["canvass_training"] }),
  role("canvasser", "Canvasser", "field", { defaultTrainingRequirementKeys: ["canvass_training"] }),
  role("phone_bank_lead", "Phone bank lead", "field", { defaultLeadRequired: true, defaultTrainingRequirementKeys: ["phone_bank_training", "shift_lead_orientation"] }),
  role("phone_banker", "Phone banker", "field", { defaultTrainingRequirementKeys: ["phone_bank_training"] }),
  role("text_bank_lead", "Text bank lead", "field", { defaultLeadRequired: true, defaultTrainingRequirementKeys: ["text_bank_training", "data_privacy_training"] }),
  role("text_banker", "Text banker", "field", { defaultTrainingRequirementKeys: ["text_bank_training", "data_privacy_training"] }),
  role("hospitality", "Hospitality", "guest_support"),
  role("parking", "Parking", "logistics"),
  role("accessibility_support", "Accessibility support", "safety", { defaultTrainingRequirementKeys: ["accessibility_support_briefing"] }),
  role("technology_support", "Technology support", "technology"),
  role("security_liaison", "Security liaison", "safety"),
  role("candidate_support", "Candidate support", "candidate", { defaultCriticality: "critical", defaultTrainingRequirementKeys: ["candidate_support_briefing"] }),
  role("press_support", "Press support", "media", { defaultTrainingRequirementKeys: ["press_support_briefing"] }),
];

export function getRoleDefinition(roleKey: string): CalendarStaffingRoleDefinition | null {
  return STAFFING_ROLE_CATALOG.find((r) => r.roleKey === roleKey) ?? null;
}

export function listActiveRoles(): CalendarStaffingRoleDefinition[] {
  return STAFFING_ROLE_CATALOG.filter((r) => r.active);
}
