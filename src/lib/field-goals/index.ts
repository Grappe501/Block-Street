import fieldGoals from "../../../data/field-goals/county-field-goals.json";

export type FieldGoalRecord = (typeof fieldGoals.counties)[number];

/** Active institution rule — all colleges/HS in a county share this sub-goal. */
export const INSTITUTION_SUB_GOAL_RULE =
  "Math.ceil(county_voter_registration_goal * 0.25) — same for every education institution in the county";
export const INSTITUTION_SHARE = 0.25;

export {
  CAMPUS_GOAL_FORMULA,
  CAMPUS_GOAL_FORMULA_VERSION,
  CAMPUS_ROUNDING_RULE,
  SUPERSEDED_ENROLLMENT_SHARE_RULE,
  institutionSubGoal,
  computeCampusCivicGoals,
  getCountyDemographics,
  type CampusCivicGoals,
} from "./campus-goals";

/** @deprecated Alias — enrollment-share rule removed; prefer INSTITUTION_SUB_GOAL_RULE */
export const SUPERSEDED_FLAT_25_RULE = INSTITUTION_SUB_GOAL_RULE;

export function listCountyFieldGoals(): FieldGoalRecord[] {
  return fieldGoals.counties as FieldGoalRecord[];
}

export function getCountyFieldGoal(countySlug: string): FieldGoalRecord | null {
  const slug = countySlug.replace(/-county$/, "");
  return listCountyFieldGoals().find((c) => c.county_slug === slug) ?? null;
}

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
  status: "active";
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
      "Every college and high school in this county shares a 25% sub-goal of the county registration total. Sub-goals do not add on top of the county goal.",
    status: "active",
  };
}

export function getFieldGoalsMeta() {
  return {
    version: fieldGoals.version,
    ingested_at: fieldGoals.ingested_at,
    statewide_registration_goal: fieldGoals.statewide_registration_goal,
    vci_definition: fieldGoals.vci_definition,
    institution_sub_goal_rule: INSTITUTION_SUB_GOAL_RULE,
    campus_goal_formula_version: "flat_0.25_of_county_v1",
    campus_goal_formula: INSTITUTION_SUB_GOAL_RULE,
    county_count: fieldGoals.counties.length,
    reddirt_root: fieldGoals.reddirt_root,
    reddirt_db_warning: fieldGoals.reddirt_db_warning,
    source_honesty:
      "Numbers come from RedDirt Victory Plan JSON on H:\\SOSWebsite\\RedDirt (read-only ingest). Chapter-05 may still label allocated_from_lane2_weight when RedDirt DB CountyCampaignStats is unavailable — values are still the official RedDirt artifact Burt consumes.",
  };
}
