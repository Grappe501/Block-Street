/**
 * Campus civic goals — flat 25% of RedDirt county goals.
 * Same for every college and high school in the county (sub_goal_within_parent).
 */
import {
  computeCampusCivicGoals,
  getCountyFieldGoal,
  CAMPUS_GOAL_FORMULA,
  CAMPUS_GOAL_FORMULA_VERSION,
  type CampusCivicGoals,
} from "@/lib/field-goals";

export type ProportionalCivicGoals = {
  enrollment: number | null;
  county_slug: string;
  county_population: number | null;
  county_voting_age_population: number | null;
  vap_is_estimate: boolean;
  share_of_county_vap: number | null;
  county_registration_goal: number;
  county_vci: number;
  registration_goal: number;
  vci_goal: number;
  formula: string;
  formula_version: string;
  explanation: string[];
  contribution_model: "sub_goal_within_parent" | "county_total";
  vci_definition: string;
  vap_disclosure: string;
  computable: boolean;
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
  const campus = computeCampusCivicGoals({ countySlug, enrollment: 0 });
  return {
    registration: row.voter_registration_goal,
    vci: row.vci,
    vap: campus.county_voting_age_population,
    population: campus.county_population,
    estimate: campus.vap_is_estimate,
    vci_definition: row.vci_definition,
    source: "data/field-goals/county-field-goals.json ← H:/SOSWebsite/RedDirt",
  };
}

export function computeCampusProportionalCivicGoals(input: {
  countySlug: string;
  enrollment?: number | null;
}): ProportionalCivicGoals {
  const g: CampusCivicGoals = computeCampusCivicGoals(input);
  return {
    enrollment: g.enrollment,
    county_slug: g.county_slug,
    county_population: g.county_population,
    county_voting_age_population: g.county_voting_age_population,
    vap_is_estimate: g.vap_is_estimate,
    share_of_county_vap: g.campus_share,
    county_registration_goal: g.county_registration_goal,
    county_vci: g.county_vci_goal,
    registration_goal: g.campus_registration_goal,
    vci_goal: g.campus_vci_goal,
    formula: CAMPUS_GOAL_FORMULA,
    formula_version: CAMPUS_GOAL_FORMULA_VERSION,
    contribution_model: "sub_goal_within_parent",
    vci_definition: g.vci_definition,
    vap_disclosure: g.vap_disclosure,
    computable: g.computable,
    explanation: g.explanation,
  };
}
