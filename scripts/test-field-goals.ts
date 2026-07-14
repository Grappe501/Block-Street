/**
 * Field-goal + campus enrollment-share tests.
 * npm run test:field-goals
 */
import assert from "assert";
import {
  getCountyFieldGoal,
  getFieldGoalsMeta,
  getCountyDemographics,
  computeCampusCivicGoals,
  CAMPUS_GOAL_FORMULA_VERSION,
  SUPERSEDED_FLAT_25_RULE,
  listCountyFieldGoals,
} from "../src/lib/field-goals/index";
import { getScopeMetrics } from "../src/lib/position-participation/index";

const counties = listCountyFieldGoals();
assert.strictEqual(counties.length, 75);
assert.strictEqual(getFieldGoalsMeta().county_count, 75);
assert.strictEqual(getFieldGoalsMeta().campus_goal_formula_version, CAMPUS_GOAL_FORMULA_VERSION);

const clark = getCountyFieldGoal("clark");
assert.ok(clark);
assert.strictEqual(clark!.voter_registration_goal, 291);
assert.strictEqual(clark!.vci, 2543);

const vap = getCountyDemographics("clark")!.voting_age_population;
assert.strictEqual(vap, 16299);

const henderson = computeCampusCivicGoals({ countySlug: "clark", enrollment: 3190 });
assert.ok(henderson.computable);
assert.strictEqual(henderson.campus_registration_goal, Math.ceil(291 * (3190 / 16299)));
assert.strictEqual(henderson.campus_vci_goal, Math.ceil(2543 * (3190 / 16299)));
assert.ok(SUPERSEDED_FLAT_25_RULE.includes("SUPERSEDED"));
assert.notStrictEqual(henderson.campus_registration_goal, 73); // not flat 25%

const m = getScopeMetrics({
  kind: "institution",
  slug: "henderson-state",
  enrollment: 3190,
  countySlug: "clark",
});
assert.strictEqual(m.registration_target, henderson.campus_registration_goal);
assert.strictEqual(m.campus_vci_goal, henderson.campus_vci_goal);
assert.ok(m.campus_share_of_county_vap != null);
assert.strictEqual(m.vap_is_estimate, true);
assert.ok(m.vci_definition?.includes("Lane 2"));
assert.strictEqual(m.participation_goal >= 6, true); // launch team separate

const m2 = getScopeMetrics({
  kind: "institution",
  slug: "ouachita-baptist",
  enrollment: 1500,
  countySlug: "clark",
});
// Different enrollment → different campus goal (not flat 25% same-for-all)
assert.notStrictEqual(m2.registration_target, m.registration_target);
assert.ok(m2.registration_target < m.registration_target);

assert.ok(m.civic_goal_explanation?.some((e) => e.includes("sub_goal_within_parent") || e.includes("not inflate")));
assert.ok(m.civic_goal_explanation?.some((e) => e.toLowerCase().includes("estimated")));

console.log("field-goals tests passed", {
  hendersonReg: m.registration_target,
  hendersonVci: m.campus_vci_goal,
});
