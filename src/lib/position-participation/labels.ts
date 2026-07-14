import type { TeamDisplayLabel } from "./types";

/** Derive public team label from active memberships (no arbitrary co-lead limit). */
export function deriveTeamDisplayLabel(leadCount: number, volunteerCount: number): TeamDisplayLabel {
  const total = leadCount + volunteerCount;
  if (total === 0) return "Help Build This Team";
  if (leadCount === 0) return "Volunteer Team Forming";
  if (leadCount >= 1 && volunteerCount >= 1) return "Committee";
  if (leadCount === 1) return "Lead";
  return "Co-Leads";
}

export const LEAD_CONFIRMATION =
  "You are volunteering to help lead this team. Other people may also serve as co-leads, and together the group will form the working committee for this area.";

export const VOLUNTEER_MEANING =
  "I want to help this team, but I am not necessarily volunteering to coordinate it.";

export const LEAD_MEANING =
  "I am willing to help coordinate this work, recruit others, and share responsibility with other co-leads.";

export const FIELD_PLAN_PLACEHOLDER =
  "Detailed responsibilities will be added from the campaign Field Plan.";
