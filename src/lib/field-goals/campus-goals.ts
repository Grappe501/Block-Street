/**
 * Campus / education institution civic goals.
 * Operator rule (locked): every college and high school in a county shares the
 * same sub-goal = 25% of that county’s RedDirt registration goal (and VCI).
 * Sub-goals sit inside the county total — they do not add on top of it.
 */
import demographics from "../../../data/registry/county-demographics.json";
import fieldGoals from "../../../data/field-goals/county-field-goals.json";

function getCountyFieldGoal(countySlug: string) {
  const slug = countySlug.replace(/-county$/, "");
  return (fieldGoals.counties as Array<{
    county_slug: string;
    voter_registration_goal: number;
    vci: number;
    vci_definition: string;
  }>).find((c) => c.county_slug === slug) ?? null;
}

export const CAMPUS_GOAL_FORMULA_VERSION = "flat_0.25_of_county_v1";

export const CAMPUS_GOAL_FORMULA =
  "Math.ceil(county_goal * 0.25) — same for every college and high school in the county";

export const INSTITUTION_SHARE = 0.25;

/** @deprecated Prior experiment — do not use for active goals */
export const SUPERSEDED_ENROLLMENT_SHARE_RULE =
  "Math.ceil(county_goal * (campus_enrollment / county_voting_age_population)) — SUPERSEDED by flat_0.25_of_county_v1";

export const CAMPUS_ROUNDING_RULE = "Math.ceil";

export type CountyDemographicsRow = {
  population: number;
  voting_age_population: number;
  vap_method: string;
};

export type CampusCivicGoals = {
  formula_version: typeof CAMPUS_GOAL_FORMULA_VERSION;
  formula: typeof CAMPUS_GOAL_FORMULA;
  rounding_rule: typeof CAMPUS_ROUNDING_RULE;
  contribution_model: "sub_goal_within_parent";
  county_slug: string;
  enrollment: number | null;
  county_population: number | null;
  county_voting_age_population: number | null;
  vap_is_estimate: boolean;
  vap_disclosure: string;
  /** Always 0.25 under the active rule — kept for UI compatibility */
  campus_share: number;
  county_registration_goal: number;
  county_vci_goal: number;
  campus_registration_goal: number;
  campus_vci_goal: number;
  vci_definition: string;
  explanation: string[];
  superseded_rule: typeof SUPERSEDED_ENROLLMENT_SHARE_RULE;
  computable: boolean;
  same_for_all_education_institutions: true;
};

export function getCountyDemographics(countySlug: string): CountyDemographicsRow | null {
  const slug = countySlug.replace(/-county$/, "");
  const row = (demographics.counties as Record<string, CountyDemographicsRow>)[slug];
  return row ?? null;
}

export function institutionSubGoal(countyGoal: number): number {
  if (!(countyGoal >= 0)) return 0;
  return Math.ceil(countyGoal * INSTITUTION_SHARE);
}

/**
 * Campus registration + VCI sub-goals = 25% of county RedDirt totals.
 * Identical for every college and high school in that county.
 */
export function computeCampusCivicGoals(input: {
  countySlug: string;
  enrollment?: number | null;
}): CampusCivicGoals {
  const county = getCountyFieldGoal(input.countySlug);
  if (!county) {
    throw new Error(`Missing RedDirt field goal snapshot for county: ${input.countySlug}`);
  }

  const demo = getCountyDemographics(input.countySlug);
  const enrollment = input.enrollment ?? null;
  const vap = demo?.voting_age_population ?? null;
  const population = demo?.population ?? null;
  const vapIsEstimate = Boolean(demographics.estimate);
  const vapDisclosure =
    "County VAP demographics are informational only under the flat 25% rule (not used to scale campus goals).";

  const campusReg = institutionSubGoal(county.voter_registration_goal);
  const campusVci = institutionSubGoal(county.vci);

  const explanation: string[] = [
    `County voter-registration goal (RedDirt snapshot): ${county.voter_registration_goal.toLocaleString()}`,
    `County VCI (RedDirt Victory Contribution Index): ${county.vci.toLocaleString()}`,
    `Education institution sub-goal (registration): ${campusReg.toLocaleString()} = ceil(${county.voter_registration_goal} × 25%)`,
    `Education institution sub-goal (VCI): ${campusVci.toLocaleString()} = ceil(${county.vci} × 25%)`,
    "Every college and high school in this county shares the same sub-goal.",
    "Contribution model: sub_goal_within_parent — does not inflate the county total.",
    `Formula version: ${CAMPUS_GOAL_FORMULA_VERSION}`,
    SUPERSEDED_ENROLLMENT_SHARE_RULE,
    vapDisclosure,
  ];

  return {
    formula_version: CAMPUS_GOAL_FORMULA_VERSION,
    formula: CAMPUS_GOAL_FORMULA,
    rounding_rule: CAMPUS_ROUNDING_RULE,
    contribution_model: "sub_goal_within_parent",
    county_slug: input.countySlug.replace(/-county$/, ""),
    enrollment,
    county_population: population,
    county_voting_age_population: vap,
    vap_is_estimate: vapIsEstimate,
    vap_disclosure: vapDisclosure,
    campus_share: INSTITUTION_SHARE,
    county_registration_goal: county.voter_registration_goal,
    county_vci_goal: county.vci,
    campus_registration_goal: campusReg,
    campus_vci_goal: campusVci,
    vci_definition: county.vci_definition,
    explanation,
    superseded_rule: SUPERSEDED_ENROLLMENT_SHARE_RULE,
    computable: true,
    same_for_all_education_institutions: true,
  };
}
