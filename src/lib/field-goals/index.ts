import fieldGoals from "../../../data/field-goals/county-field-goals.json";

export type FieldGoalRecord = (typeof fieldGoals.counties)[number];

export const INSTITUTION_SUB_GOAL_RULE = "Math.ceil(county_voter_registration_goal * 0.25)";
export const INSTITUTION_SHARE = 0.25;

export function listCountyFieldGoals(): FieldGoalRecord[] {
  return fieldGoals.counties as FieldGoalRecord[];
}

export function getCountyFieldGoal(countySlug: string): FieldGoalRecord | null {
  const slug = countySlug.replace(/-county$/, "");
  return listCountyFieldGoals().find((c) => c.county_slug === slug) ?? null;
}

/** Rounding rule — used everywhere. */
export function institutionSubGoalFromCounty(countyRegistrationGoal: number): number {
  return Math.ceil(countyRegistrationGoal * INSTITUTION_SHARE);
}

export function getInstitutionRegistrationSubGoal(countySlug: string): {
  county_registration_goal: number;
  institution_sub_goal: number;
  rule: string;
  contribution_model: "sub_goal_within_parent";
  county_vci: number | null;
  vci_definition: string | null;
  source_reference: FieldGoalRecord["source_reference"] | null;
  source_updated_at: FieldGoalRecord["source_updated_at"] | null;
  display_explanation: string;
} | null {
  const county = getCountyFieldGoal(countySlug);
  if (!county) return null;
  const sub = institutionSubGoalFromCounty(county.voter_registration_goal);
  return {
    county_registration_goal: county.voter_registration_goal,
    institution_sub_goal: sub,
    rule: INSTITUTION_SUB_GOAL_RULE,
    contribution_model: "sub_goal_within_parent",
    county_vci: county.vci,
    vci_definition: county.vci_definition,
    source_reference: county.source_reference,
    source_updated_at: county.source_updated_at,
    display_explanation:
      "This institution’s goal equals 25% of the county goal. It is included within the county target and is not added on top of it.",
  };
}

export function getFieldGoalsMeta() {
  return {
    version: fieldGoals.version,
    ingested_at: fieldGoals.ingested_at,
    statewide_registration_goal: fieldGoals.statewide_registration_goal,
    vci_definition: fieldGoals.vci_definition,
    institution_sub_goal_rule: fieldGoals.institution_sub_goal_rule,
    county_count: fieldGoals.counties.length,
    reddirt_db_warning: fieldGoals.reddirt_db_warning,
  };
}
