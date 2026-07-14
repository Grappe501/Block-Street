/**
 * Education institution civic goals — RedDirt county totals with 25% sub-goals.
 * VCI remains a county-level Victory Contribution Index (contextual on schools).
 */
import {
  getCountyFieldGoal,
  getInstitutionRegistrationSubGoal,
  INSTITUTION_SUB_GOAL_RULE,
} from "@/lib/field-goals";

export type ProportionalCivicGoals = {
  enrollment: number | null;
  county_slug: string;
  county_population: number | null;
  county_voting_age_population: number | null;
  vap_is_estimate: boolean;
  share_of_county_vap: number | null;
  county_registration_goal: number;
  /** County Victory Contribution Index (RedDirt) — not a school goal */
  county_vci: number;
  registration_goal: number;
  /** @deprecated Schools do not own a separate VCI goal; mirrors county for compatibility */
  vci_goal: number;
  formula: string;
  explanation: string[];
  contribution_model: "sub_goal_within_parent" | "county_total";
  vci_definition: string;
};

export function resolveCountyCivicGoals(countySlug: string): {
  registration: number;
  vci: number;
  vap: number | null;
  population: number | null;
  estimate: boolean;
  vci_definition: string;
  source: string;
} {
  const row = getCountyFieldGoal(countySlug);
  if (!row) {
    throw new Error(`Missing RedDirt field goal snapshot for county: ${countySlug}`);
  }
  return {
    registration: row.voter_registration_goal,
    vci: row.vci,
    vap: null,
    population: null,
    estimate: false,
    vci_definition: row.vci_definition,
    source: "data/field-goals/county-field-goals.json",
  };
}

/**
 * Campus/school registration sub-goal = 25% of county RedDirt registration goal.
 * Same value for every college and high school in that county.
 */
export function computeCampusProportionalCivicGoals(input: {
  countySlug: string;
  enrollment?: number | null;
}): ProportionalCivicGoals {
  const sub = getInstitutionRegistrationSubGoal(input.countySlug);
  if (!sub) {
    throw new Error(`Missing RedDirt field goal snapshot for county: ${input.countySlug}`);
  }
  const county = getCountyFieldGoal(input.countySlug)!;

  return {
    enrollment: input.enrollment ?? null,
    county_slug: input.countySlug,
    county_population: null,
    county_voting_age_population: null,
    vap_is_estimate: false,
    share_of_county_vap: null,
    county_registration_goal: sub.county_registration_goal,
    county_vci: sub.county_vci ?? county.vci,
    registration_goal: sub.institution_sub_goal,
    vci_goal: sub.county_vci ?? county.vci,
    formula: INSTITUTION_SUB_GOAL_RULE,
    contribution_model: "sub_goal_within_parent",
    vci_definition: sub.vci_definition || county.vci_definition,
    explanation: [
      `County voter-registration goal (RedDirt): ${sub.county_registration_goal.toLocaleString()}`,
      `Institution sub-goal (25%): ${sub.institution_sub_goal.toLocaleString()}`,
      `Rounding rule: ${INSTITUTION_SUB_GOAL_RULE}`,
      "Contribution model: sub_goal_within_parent — does not inflate the county total.",
      sub.display_explanation,
      `County VCI (Victory Contribution Index): ${(sub.county_vci ?? 0).toLocaleString()}`,
      `VCI definition: ${sub.vci_definition}`,
      "Schools display County VCI as context — they do not have a separate VCI score unless RedDirt defines one.",
    ],
  };
}
