import { loadPositionStore, resolveCanonicalPersonId } from "./store";
import { computeCampusProportionalCivicGoals, resolveCountyCivicGoals } from "./proportional-goals";
import type { GoalCalculation, HonestParticipationMetrics, ScopeType } from "./types";
import { toCommunityId } from "@/lib/community-workspace/roles";
import { getCountyFieldGoal } from "@/lib/field-goals";

const PLACEHOLDER_FIELD_PLAN = "Detailed responsibilities will be added from the campaign Field Plan.";

export { PLACEHOLDER_FIELD_PLAN };

export function computeParticipationGoal(input: {
  scopeId: string;
  enrollment?: number | null;
  kind: "county" | "institution" | "high_school" | "private_charter";
}): GoalCalculation {
  const store = loadPositionStore();
  const minimum_launch_team = store.minimum_launch_team ?? 6;
  const manual = store.manual_goals[input.scopeId]?.launch_team ?? null;
  const computed_goal = Math.max(manual ?? 0, minimum_launch_team);

  return {
    kind: "launch_team",
    formula: "max(configured_manual_goal, minimum_launch_team)",
    inputs: {
      minimum_launch_team,
      configured_manual_goal: manual,
      enrollment: input.enrollment ?? null,
    },
    configured_manual_goal: manual,
    eligible_population: input.enrollment ?? null,
    participation_rate: null,
    minimum_launch_team,
    computed_goal,
    explanation: [
      `Leadership launch-team target: ${computed_goal}`,
      "Separate from voter-registration field goals and County VCI.",
      "Not a count of people already participating.",
    ],
  };
}

export function computeHonestMetrics(input: {
  scopeId: string;
  scopeType: ScopeType;
  kind: "county" | "institution" | "high_school" | "private_charter";
  enrollment?: number | null;
  countySlug: string;
}): HonestParticipationMetrics {
  const store = loadPositionStore();
  const peopleInScope = store.persons.filter((p) => p.scopes.includes(input.scopeId));
  const confirmed_people = peopleInScope.length;
  const activeMemberships = store.memberships.filter(
    (m) => m.scope_id === input.scopeId && m.status === "active"
  );
  const confirmedSet = new Set<string>([
    ...peopleInScope.map((p) => p.canonical_person_id),
    ...activeMemberships.map((m) => resolveCanonicalPersonId(m.canonical_person_id, store)),
  ]);
  const confirmed_participants = confirmedSet.size;
  const system_identities = peopleInScope.reduce((n, p) => n + (p.system_identity_ids?.length ?? 0), 0);

  const goalCalc = computeParticipationGoal({
    scopeId: input.scopeId,
    enrollment: input.enrollment,
    kind: input.kind,
  });

  let registration_target: number;
  let vote_participation_target: number;
  let civic_goal_explanation: string[];
  let civic_goal_formula: string;
  let campus_enrollment: number | null = input.enrollment ?? null;
  let county_vci: number;
  let vci_definition: string;

  let campus_share_of_county_vap: number | null = null;
  let county_voting_age_population: number | null = null;
  let vap_is_estimate = false;
  let campus_vci_goal: number | null = null;

  if (input.kind === "county") {
    const county = resolveCountyCivicGoals(input.countySlug);
    const row = getCountyFieldGoal(input.countySlug);
    registration_target = county.registration;
    vote_participation_target = county.vci;
    county_vci = county.vci;
    vci_definition = county.vci_definition;
    county_voting_age_population = county.vap;
    vap_is_estimate = county.estimate;
    civic_goal_formula = "RedDirt county voter_registration_goal + Victory Contribution Index";
    civic_goal_explanation = [
      `County voter-registration goal (RedDirt): ${county.registration.toLocaleString()}`,
      `County VCI (Victory Contribution Index): ${county.vci.toLocaleString()}`,
      `VCI definition: ${county.vci_definition}`,
      "The county goal is the total target. College and high-school goals are organizing sub-goals that contribute toward this county total.",
      row?.source_reference
        ? `Source: ${row.source_reference.registration}`
        : "Source: data/field-goals/county-field-goals.json",
    ];
  } else {
    const proportional = computeCampusProportionalCivicGoals({
      countySlug: input.countySlug,
      enrollment: input.enrollment,
    });
    registration_target = proportional.registration_goal;
    vote_participation_target = proportional.vci_goal;
    county_vci = proportional.county_vci;
    campus_vci_goal = proportional.vci_goal;
    vci_definition = proportional.vci_definition;
    civic_goal_formula = proportional.formula;
    civic_goal_explanation = proportional.explanation;
    campus_share_of_county_vap = proportional.share_of_county_vap;
    county_voting_age_population = proportional.county_voting_age_population;
    vap_is_estimate = proportional.vap_is_estimate;
  }

  const manualReg = store.manual_goals[input.scopeId]?.registration;
  if (manualReg != null) registration_target = manualReg;

  return {
    scope_id: input.scopeId,
    confirmed_people,
    confirmed_participants,
    system_identities,
    aliases_excluded_note: "Aliases excluded from participation count — COUNT(DISTINCT canonical_person_id)",
    participation_goal: goalCalc.computed_goal,
    remaining_need: Math.max(0, goalCalc.computed_goal - confirmed_participants),
    goal_calculation: goalCalc,
    registration_target,
    vote_participation_target,
    civic_goal_explanation,
    civic_goal_formula,
    campus_share_of_county_vap,
    county_voting_age_population,
    campus_enrollment,
    county_vci,
    campus_vci_goal,
    vap_is_estimate,
    vci_definition,
  };
}

export function explainLegacyFakeCurrentSix(enrollment: number): {
  displayed: number;
  source: string;
  formula: string;
  inputs: Record<string, number>;
  isGoal: boolean;
  isActualPeople: boolean;
} {
  const regTarget = Math.max(50, Math.round(enrollment * 0.05));
  const voteTarget = Math.round(regTarget * 0.75);
  const fakeCurrent = Math.round(voteTarget * 0.05);
  return {
    displayed: fakeCurrent,
    source: "legacy mock formula (retired)",
    formula: "Math.round(voteTarget * 0.05)",
    inputs: { enrollment, regTarget, voteTarget, fakeCurrent },
    isGoal: false,
    isActualPeople: false,
  };
}
