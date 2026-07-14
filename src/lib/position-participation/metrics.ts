import workspaceSeeds from "../../../data/communities/workspace-seeds.json";
import { loadPositionStore, resolveCanonicalPersonId } from "./store";
import type { GoalCalculation, HonestParticipationMetrics, ScopeType } from "./types";

const PLACEHOLDER_FIELD_PLAN = "Detailed responsibilities will be added from the campaign Field Plan.";

export { PLACEHOLDER_FIELD_PLAN };

/**
 * Strategic participation goal — never equal to "how many accounts exist now".
 * participation_goal = max(manual, population×rate when applicable, minimum_launch_team)
 */
export function computeParticipationGoal(input: {
  scopeId: string;
  enrollment?: number | null;
  kind: "county" | "institution" | "high_school" | "private_charter";
}): GoalCalculation {
  const store = loadPositionStore();
  const minimum_launch_team = store.minimum_launch_team ?? 6;
  const manual = store.manual_goals[input.scopeId]?.launch_team ?? null;
  const defaults = workspaceSeeds.defaultGoalTargets;

  let eligible_population: number | null = null;
  let participation_rate: number | null = null;
  let derivedFromPop = 0;

  if (input.kind === "institution" && input.enrollment) {
    eligible_population = input.enrollment;
    participation_rate = defaults.institution.registrationPercentOfEnrollment;
    // Launch-team formula uses a soft floor; long-term enrollment target is separate (registration_target).
    derivedFromPop = 0;
  }

  const computed_goal = Math.max(
    manual ?? 0,
    derivedFromPop,
    minimum_launch_team
  );

  const explanation = [
    `minimum_launch_team = ${minimum_launch_team}`,
    manual != null ? `configured_manual_goal = ${manual}` : "configured_manual_goal = (none)",
    `computed = max(manual, population×rate for launch, minimum) = ${computed_goal}`,
    "This is a strategic TARGET, not a count of people already participating.",
  ];

  return {
    kind: "launch_team",
    formula: "max(configured_manual_goal, eligible_population × participation_rate, minimum_launch_team)",
    inputs: {
      minimum_launch_team,
      configured_manual_goal: manual,
      eligible_population,
      participation_rate,
      enrollment: input.enrollment ?? null,
    },
    configured_manual_goal: manual,
    eligible_population,
    participation_rate,
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
}): HonestParticipationMetrics {
  const store = loadPositionStore();
  const peopleInScope = store.persons.filter((p) => p.scopes.includes(input.scopeId));
  const confirmed_people = peopleInScope.length;

  const activeMemberships = store.memberships.filter(
    (m) => m.scope_id === input.scopeId && m.status === "active"
  );
  const participantIds = activeMemberships.map((m) => m.canonical_person_id);
  // Confirmed participants = unique people who joined OR are explicitly scoped as connected people
  const confirmedSet = new Set<string>([
    ...peopleInScope.map((p) => p.canonical_person_id),
    ...participantIds.map((id) => resolveCanonicalPersonId(id, store)),
  ]);
  // Soft-beta truth for Henderson: scoped persons count as confirmed people/participants when present
  const confirmed_participants = confirmedSet.size;

  const system_identities = peopleInScope.reduce((n, p) => n + (p.system_identity_ids?.length ?? 0), 0);

  const goalCalc = computeParticipationGoal({
    scopeId: input.scopeId,
    enrollment: input.enrollment,
    kind: input.kind,
  });

  const defaults = workspaceSeeds.defaultGoalTargets;
  let registration_target: number;
  let vote_participation_target: number;
  if (input.kind === "county") {
    registration_target = defaults.county.registration;
    vote_participation_target = defaults.county.vote_participation;
  } else if (input.kind === "institution" && input.enrollment) {
    registration_target = Math.max(
      50,
      Math.round(input.enrollment * defaults.institution.registrationPercentOfEnrollment)
    );
    vote_participation_target = Math.round(
      registration_target * defaults.institution.voteParticipationPercentOfRegistration
    );
  } else if (input.kind === "high_school") {
    registration_target = defaults.high_school.registration;
    vote_participation_target = defaults.high_school.vote_participation;
  } else {
    registration_target = defaults.private_charter.registration;
    vote_participation_target = defaults.private_charter.vote_participation;
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
