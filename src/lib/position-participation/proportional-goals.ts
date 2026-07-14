import demographics from "../../../data/registry/county-demographics.json";
import workspaceSeeds from "../../../data/communities/workspace-seeds.json";

export type CivicGoalKind = "registration" | "vote_participation";

export type ProportionalCivicGoals = {
  enrollment: number;
  county_slug: string;
  county_population: number;
  county_voting_age_population: number;
  vap_is_estimate: boolean;
  share_of_county_vap: number;
  county_registration_goal: number;
  county_vci_goal: number;
  registration_goal: number;
  vci_goal: number;
  formula: string;
  explanation: string[];
};

type SeedGoals = {
  registration?: { target?: number };
  vote_participation?: { target?: number };
};

const DEFAULTS = workspaceSeeds.defaultGoalTargets;

/** Floor so small campuses still have a usable organizing target. */
const CAMPUS_REG_FLOOR = 15;
const CAMPUS_VCI_FLOOR = 10;

export function getCountyDemographics(countySlug: string): {
  population: number;
  voting_age_population: number;
  estimate: boolean;
} | null {
  const row = (demographics.counties as Record<string, { population: number; voting_age_population: number }>)[
    countySlug
  ];
  if (!row) return null;
  return {
    population: row.population,
    voting_age_population: row.voting_age_population,
    estimate: Boolean(demographics.estimate),
  };
}

/**
 * County civic goals: manual/seed override, else rate × voting-age population,
 * else legacy fixed defaults as floor.
 */
export function resolveCountyCivicGoals(
  countySlug: string,
  countySeed?: SeedGoals
): { registration: number; vci: number; vap: number; population: number; estimate: boolean } {
  const demo = getCountyDemographics(countySlug);
  const vap = demo?.voting_age_population ?? 0;
  const population = demo?.population ?? 0;
  const estimate = demo?.estimate ?? true;

  const rate =
    (DEFAULTS as { county?: { registrationRateOfVap?: number; vciShareOfRegistration?: number } }).county
      ?.registrationRateOfVap ?? 0.015;
  const vciShare =
    (DEFAULTS as { county?: { vciShareOfRegistration?: number } }).county?.vciShareOfRegistration ?? 0.75;

  const derivedReg = vap > 0 ? Math.max(DEFAULTS.county.registration, Math.round(vap * rate)) : DEFAULTS.county.registration;
  const registration = countySeed?.registration?.target ?? derivedReg;
  const derivedVci = Math.round(registration * vciShare);
  const vci = countySeed?.vote_participation?.target ?? Math.max(DEFAULTS.county.vote_participation, derivedVci);

  return { registration, vci, vap, population, estimate };
}

/**
 * Treat campus/school like a city: goals proportional to
 * campus enrollment ÷ county voting-age population × county civic goals.
 */
export function computeCampusProportionalCivicGoals(input: {
  countySlug: string;
  enrollment: number;
  countySeed?: SeedGoals;
}): ProportionalCivicGoals {
  const county = resolveCountyCivicGoals(input.countySlug, input.countySeed);
  const enrollment = Math.max(0, Math.round(input.enrollment));
  const vap = Math.max(county.vap, 1);
  const share = enrollment / vap;

  const registration_goal = Math.max(CAMPUS_REG_FLOOR, Math.round(county.registration * share));
  const vci_goal = Math.max(CAMPUS_VCI_FLOOR, Math.round(county.vci * share));

  const formula =
    "campus_goal = max(floor, round(county_goal × (campus_enrollment ÷ county_voting_age_population)))";

  const explanation = [
    `Campus enrollment (city population stand-in): ${enrollment.toLocaleString()}`,
    `County voting-age population${county.estimate ? " (estimate)" : ""}: ${county.vap.toLocaleString()}`,
    `Share of county VAP: ${(share * 100).toFixed(2)}%`,
    `County voter registration goal: ${county.registration.toLocaleString()}`,
    `County VCI goal: ${county.vci.toLocaleString()}`,
    `Campus voter registration goal: ${registration_goal.toLocaleString()}`,
    `Campus VCI goal: ${vci_goal.toLocaleString()}`,
    "Campus is treated like a city inside the county — goals scale with enrollment relative to county voting-age adults.",
  ];

  return {
    enrollment,
    county_slug: input.countySlug,
    county_population: county.population,
    county_voting_age_population: county.vap,
    vap_is_estimate: county.estimate,
    share_of_county_vap: share,
    county_registration_goal: county.registration,
    county_vci_goal: county.vci,
    registration_goal,
    vci_goal,
    formula,
    explanation,
  };
}
