/**
 * Field-goal + flat 25% campus tests.
 * npm run test:field-goals
 */
import assert from "assert";
import {
  getCountyFieldGoal,
  getFieldGoalsMeta,
  computeCampusCivicGoals,
  CAMPUS_GOAL_FORMULA_VERSION,
  INSTITUTION_SUB_GOAL_RULE,
  listCountyFieldGoals,
} from "../src/lib/field-goals/index";
import { getScopeMetrics } from "../src/lib/position-participation/index";

const counties = listCountyFieldGoals();
assert.strictEqual(counties.length, 75);
assert.strictEqual(getFieldGoalsMeta().county_count, 75);
assert.strictEqual(getFieldGoalsMeta().campus_goal_formula_version, CAMPUS_GOAL_FORMULA_VERSION);
assert.ok(INSTITUTION_SUB_GOAL_RULE.includes("0.25"));

const clark = getCountyFieldGoal("clark");
assert.ok(clark);
assert.strictEqual(clark!.voter_registration_goal, 291);
assert.strictEqual(clark!.vci, 2543);

const expectedReg = Math.ceil(291 * 0.25);
const expectedVci = Math.ceil(2543 * 0.25);

const henderson = computeCampusCivicGoals({ countySlug: "clark", enrollment: 3190 });
assert.ok(henderson.computable);
assert.strictEqual(henderson.campus_registration_goal, expectedReg);
assert.strictEqual(henderson.campus_vci_goal, expectedVci);
assert.strictEqual(henderson.same_for_all_education_institutions, true);

const ouachita = computeCampusCivicGoals({ countySlug: "clark", enrollment: 1500 });
assert.strictEqual(ouachita.campus_registration_goal, henderson.campus_registration_goal);
assert.strictEqual(ouachita.campus_vci_goal, henderson.campus_vci_goal);

const m = getScopeMetrics({
  kind: "institution",
  slug: "henderson-state",
  enrollment: 3190,
  countySlug: "clark",
});
assert.strictEqual(m.registration_target, expectedReg);
assert.strictEqual(m.campus_vci_goal, expectedVci);
assert.strictEqual(m.participation_goal >= 6, true);

const m2 = getScopeMetrics({
  kind: "institution",
  slug: "ouachita-baptist",
  enrollment: 1500,
  countySlug: "clark",
});
assert.strictEqual(m2.registration_target, m.registration_target);

const hsCampus = computeCampusCivicGoals({ countySlug: "clark", enrollment: 800 });
assert.strictEqual(hsCampus.campus_registration_goal, expectedReg);

assert.ok(m.civic_goal_explanation?.some((e) => e.includes("25%")));
assert.ok(m.civic_goal_explanation?.some((e) => e.includes("same sub-goal") || e.includes("Every college")));

console.log("field-goals tests passed", {
  hendersonReg: m.registration_target,
  hendersonVci: m.campus_vci_goal,
  formula: CAMPUS_GOAL_FORMULA_VERSION,
});
