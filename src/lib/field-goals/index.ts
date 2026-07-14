import fieldGoals from "../../../data/field-goals/county-field-goals.json";

export type FieldGoalRecord = (typeof fieldGoals.counties)[number];

/**
 * @deprecated Superseded by enrollment-share campus formula (V2-A.3).
 * Kept for lineage / historical snapshot fields only — do not use for active campus goals.
 */
export const INSTITUTION_SUB_GOAL_RULE =
  "SUPERSEDED: Math.ceil(county_voter_registration_goal * 0.25) — use CAMPUS_GOAL_FORMULA";
export const INSTITUTION_SHARE = 0.25;

export {
  CAMPUS_GOAL_FORMULA,
  CAMPUS_GOAL_FORMULA_VERSION,
  CAMPUS_ROUNDING_RULE,
  SUPERSEDED_FLAT_25_RULE,
  applyCampusShare,
  computeCampusCivicGoals,
  computeCampusShare,
  getCountyDemographics,
  type CampusCivicGoals,
} from "./campus-goals";

export function listCountyFieldGoals(): FieldGoalRecord[] {
  return fieldGoals.counties as FieldGoalRecord[];
}

export function getCountyFieldGoal(countySlug: string): FieldGoalRecord | null {
  const slug = countySlug.replace(/-county$/, "");
  return listCountyFieldGoals().find((c) => c.county_slug === slug) ?? null;
}

/**
 * @deprecated Flat 25% — superseded. Prefer computeCampusCivicGoals().
 */
export function institutionSubGoalFromCounty(countyRegistrationGoal: number): number {
  return Math.ceil(countyRegistrationGoal * INSTITUTION_SHARE);
}

/**
 * @deprecated Prefer computeCampusCivicGoals with enrollment.
 * Legacy helper kept for snapshot `institution_sub_goal` lineage only.
 */
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
  status: "superseded";
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
      "SUPERSEDED flat 25% rule. Active campus goals use enrollment ÷ county VAP share.",
    status: "superseded",
  };
}

export function getFieldGoalsMeta() {
  return {
    version: fieldGoals.version,
    ingested_at: fieldGoals.ingested_at,
    statewide_registration_goal: fieldGoals.statewide_registration_goal,
    vci_definition: fieldGoals.vci_definition,
    institution_sub_goal_rule: "SUPERSEDED_flat_0.25",
    campus_goal_formula_version: "enrollment_share_of_county_vap_v1",
    campus_goal_formula:
      "Math.ceil(county_goal * (campus_enrollment / county_voting_age_population))",
    county_count: fieldGoals.counties.length,
    reddirt_db_warning: fieldGoals.reddirt_db_warning,
  };
}
