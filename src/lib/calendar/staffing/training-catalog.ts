import type { CalendarTrainingRequirement } from "./types";

function training(
  trainingKey: string,
  label: string,
  category: string,
  opts: Partial<CalendarTrainingRequirement> = {},
): CalendarTrainingRequirement {
  return {
    trainingKey,
    label,
    description: opts.description ?? label,
    category,
    completionMode: opts.completionMode ?? "self_attested",
    validityDays: opts.validityDays ?? 365,
    requiredForRoleKeys: opts.requiredForRoleKeys ?? [],
    blocksConfirmationIfMissing: opts.blocksConfirmationIfMissing ?? false,
    allowsInterestIfMissing: opts.allowsInterestIfMissing ?? true,
    active: opts.active ?? true,
  };
}

export const TRAINING_CATALOG: CalendarTrainingRequirement[] = [
  training("general_volunteer_orientation", "General volunteer orientation", "orientation", { requiredForRoleKeys: ["greeter", "discussion_facilitator"] }),
  training("event_check_in_training", "Event check-in training", "operations", { requiredForRoleKeys: ["check_in", "registration_table"], blocksConfirmationIfMissing: true }),
  training("voter_registration_rules", "Voter registration rules", "compliance", { requiredForRoleKeys: ["registration_table"], blocksConfirmationIfMissing: true, allowsInterestIfMissing: false }),
  training("campus_access_orientation", "Campus access orientation", "compliance", { requiredForRoleKeys: ["campus_liaison"] }),
  training("canvass_training", "Canvass training", "field", { requiredForRoleKeys: ["canvass_captain", "canvasser"], blocksConfirmationIfMissing: true }),
  training("phone_bank_training", "Phone bank training", "field", { requiredForRoleKeys: ["phone_bank_lead", "phone_banker"] }),
  training("text_bank_training", "Text bank training", "field", { requiredForRoleKeys: ["text_bank_lead", "text_banker"] }),
  training("data_privacy_training", "Data privacy training", "compliance", { requiredForRoleKeys: ["data_tally", "text_bank_lead", "text_banker"] }),
  training("candidate_support_briefing", "Candidate support briefing", "candidate", { completionMode: "manager_verified", requiredForRoleKeys: ["candidate_support"], blocksConfirmationIfMissing: true }),
  training("press_support_briefing", "Press support briefing", "media", { requiredForRoleKeys: ["press_support"] }),
  training("accessibility_support_briefing", "Accessibility support briefing", "safety", { requiredForRoleKeys: ["accessibility_support"] }),
  training("shift_lead_orientation", "Shift lead orientation", "leadership", { requiredForRoleKeys: ["shift_lead", "event_lead", "phone_bank_lead", "text_bank_lead"], blocksConfirmationIfMissing: true }),
  training("on_site_event_briefing", "On-site event briefing", "operations", { completionMode: "on_site_briefing", allowsInterestIfMissing: true }),
];

export function getTrainingRequirement(trainingKey: string): CalendarTrainingRequirement | null {
  return TRAINING_CATALOG.find((t) => t.trainingKey === trainingKey) ?? null;
}

export function listActiveTraining(): CalendarTrainingRequirement[] {
  return TRAINING_CATALOG.filter((t) => t.active);
}
