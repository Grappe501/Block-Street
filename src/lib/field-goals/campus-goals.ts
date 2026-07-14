/**
 * Campus civic goals — enrollment share of county VAP (V2-A.3).
 * Supersedes the flat 25% institution sub-goal rule.
 */
import demographics from "../../../data/registry/county-demographics.json";
import { getCountyFieldGoal } from "./index";

export const CAMPUS_GOAL_FORMULA_VERSION = "enrollment_share_of_county_vap_v1";

export const CAMPUS_GOAL_FORMULA =
  "Math.ceil(county_goal * (campus_enrollment / county_voting_age_population))";

export const SUPERSEDED_FLAT_25_RULE =
  "Math.ceil(county_voter_registration_goal * 0.25) — SUPERSEDED by enrollment_share_of_county_vap_v1";

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
  campus_share: number | null;
  county_registration_goal: number;
  county_vci_goal: number;
  campus_registration_goal: number;
  campus_vci_goal: number;
  vci_definition: string;
  explanation: string[];
  superseded_rule: typeof SUPERSEDED_FLAT_25_RULE;
  computable: boolean;
};

export function getCountyDemographics(countySlug: string): CountyDemographicsRow | null {
  const slug = countySlug.replace(/-county$/, "");
  const row = (demographics.counties as Record<string, CountyDemographicsRow>)[slug];
  return row ?? null;
}

export function computeCampusShare(enrollment: number, countyVap: number): number {
  if (!(countyVap > 0) || !(enrollment >= 0)) return 0;
  return enrollment / countyVap;
}

export function applyCampusShare(countyGoal: number, share: number): number {
  if (!(countyGoal >= 0) || !(share >= 0)) return 0;
  return Math.ceil(countyGoal * share);
}

/**
 * Campus registration + VCI sub-goals scaled by enrollment ÷ county VAP.
 * Sub-goals remain within the county total (not additive).
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
    "County voting-age population is estimated (76% of total population) until verified ACS figures are loaded. Not official ACS data.";

  const computable = enrollment != null && enrollment >= 0 && vap != null && vap > 0;
  const share = computable ? computeCampusShare(enrollment!, vap!) : null;
  const campusReg = computable ? applyCampusShare(county.voter_registration_goal, share!) : 0;
  const campusVci = computable ? applyCampusShare(county.vci, share!) : 0;

  const explanation: string[] = [
    `County voter-registration goal (RedDirt): ${county.voter_registration_goal.toLocaleString()}`,
    `County VCI goal (RedDirt Victory Contribution Index): ${county.vci.toLocaleString()}`,
    `Formula version: ${CAMPUS_GOAL_FORMULA_VERSION}`,
    `Rounding: ${CAMPUS_ROUNDING_RULE}`,
    "Contribution model: sub_goal_within_parent — does not inflate the county total.",
    SUPERSEDED_FLAT_25_RULE,
    vapDisclosure,
  ];

  if (computable) {
    explanation.unshift(
      `Campus enrollment: ${enrollment!.toLocaleString()}`,
      `County VAP (estimate): ${vap!.toLocaleString()}`,
      `Campus share of county VAP: ${(share! * 100).toFixed(2)}%`,
      `Campus registration sub-goal: ${campusReg.toLocaleString()}`,
      `Campus VCI sub-goal: ${campusVci.toLocaleString()}`,
    );
  } else {
    explanation.unshift(
      "Campus goals not computable — enrollment and/or estimated county VAP missing.",
    );
  }

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
    campus_share: share,
    county_registration_goal: county.voter_registration_goal,
    county_vci_goal: county.vci,
    campus_registration_goal: campusReg,
    campus_vci_goal: campusVci,
    vci_definition: county.vci_definition,
    explanation,
    superseded_rule: SUPERSEDED_FLAT_25_RULE,
    computable,
  };
}
