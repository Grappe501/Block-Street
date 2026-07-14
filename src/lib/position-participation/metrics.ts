import workspaceSeeds from "../../../data/communities/workspace-seeds.json";
import { loadPositionStore, resolveCanonicalPersonId } from "./store";
import {
  computeCampusProportionalCivicGoals,
  resolveCountyCivicGoals,
} from "./proportional-goals";
import type { GoalCalculation, HonestParticipationMetrics, ScopeType } from "./types";
import { toCommunityId } from "@/lib/community-workspace/roles";

const PLACEHOLDER_FIELD_PLAN = "Detailed responsibilities will be added from the campaign Field Plan.";

export { PLACEHOLDER_FIELD_PLAN };

/**
 * Strategic participation (launch-team) goal — never equal to "how many accounts exist now".
 */
export function computeParticipationGoal(input: {
  scopeId: string;
  enrollment?: number | null;
  kind: "county" | "institution" | "high_school" | "private_charter";
}): GoalCalculation {
  const store = loadPositionStore();
  const minimum_launch_team = store.minimum_launch_team ?? 6;
  const manual = store.manual_goals[input.scopeId]?.launch_team ?? null;

  const computed_goal = Math.max(manual ?? 0, minimum_launch_team);

  const explanation = [
    `minimum_launch_team = ${minimum_launch_team}`,
    manual != null ? `configured_manual_goal = ${manual}` : "configured_manual_goal = (none)",
    `computed = max(manual, minimum_launch_team) = ${computed_goal}`,
    "Launch-team goal is separate from voter registration / VCI civic targets.",
    "This is a strategic TARGET, not a count of people already participating.",
  ];

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
    explanation,
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
  const participantIds = activeMemberships.map((m) => m.canonical_person_id);
  const confirmedSet = new Set<string>([
    ...peopleInScope.map((p) => p.canonical_person_id),
    ...participantIds.map((id) => resolveCanonicalPersonId(id, store)),
  ]);
  const confirmed_participants = confirmedSet.size;
  const system_identities = peopleInScope.reduce((n, p) => n + (p.system_identity_ids?.length ?? 0), 0);

  const goalCalc = computeParticipationGoal({
    scopeId: input.scopeId,
    enrollment: input.enrollment,
    kind: input.kind,
  });

  const countyCommunityId = toCommunityId("county", input.countySlug);
  const countySeed = (workspaceSeeds.seeds as Record<string, { goals?: { registration?: { target?: number }; vote_participation?: { target?: number } } }>)[
    countyCommunityId
  ]?.goals;

  let registration_target: number;
  let vote_participation_target: number;
  let civic_goal_explanation: string[] | undefined;
  let civic_goal_formula: string | undefined;
  let campus_share_of_county_vap: number | null = null;
  let county_voting_age_population: number | null = null;
  let campus_enrollment: number | null = null;

  if (input.kind === "county") {
    const county = resolveCountyCivicGoals(input.countySlug, countySeed);
    registration_target = county.registration;
    vote_participation_target = county.vci;
    county_voting_age_population = county.vap;
    civic_goal_formula = "county_goal = max(default_floor, round(county_vap × registration_rate)) · VCI = registration × share";
    civic_goal_explanation = [
      `County voting-age population${county.estimate ? " (estimate)" : ""}: ${county.vap.toLocaleString()}`,
      `Voter registration goal: ${county.registration.toLocaleString()}`,
      `VCI goal: ${county.vci.toLocaleString()}`,
    ];
  } else {
    const enrollment = input.enrollment ?? 0;
    const proportional = computeCampusProportionalCivicGoals({
      countySlug: input.countySlug,
      enrollment,
      countySeed,
    });
    registration_target = proportional.registration_goal;
    vote_participation_target = proportional.vci_goal;
    civic_goal_explanation = proportional.explanation;
    civic_goal_formula = proportional.formula;
    campus_share_of_county_vap = proportional.share_of_county_vap;
    county_voting_age_population = proportional.county_voting_age_population;
    campus_enrollment = proportional.enrollment;
  }

  const manualReg = store.manual_goals[input.scopeId]?.registration;
  const manualVote = store.manual_goals[input.scopeId]?.vote_participation;
  if (manualReg != null) registration_target = manualReg;
  if (manualVote != null) vote_participation_target = manualVote;

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
  };
}

/** Forensic: explain why Henderson historically displayed "6" as if it were people. */
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
    source: "src/lib/community-workspace/engine.ts defaultGoals — unseeded vote_participation current",
    formula: "Math.round(voteTarget * 0.05) where voteTarget = round(max(50, enrollment*0.05)*0.75)",
    inputs: { enrollment, regTarget, voteTarget, fakeCurrent },
    isGoal: false,
    isActualPeople: false,
  };
}
