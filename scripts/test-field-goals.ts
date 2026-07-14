/**
 * Field-goal + institution 25% tests.
 * npm run test:field-goals
 */
import assert from "assert";
import {
  getCountyFieldGoal,
  getFieldGoalsMeta,
  institutionSubGoalFromCounty,
  listCountyFieldGoals,
} from "../src/lib/field-goals/index";
import { getScopeMetrics } from "../src/lib/position-participation/index";

const counties = listCountyFieldGoals();
assert.strictEqual(counties.length, 75);
assert.strictEqual(getFieldGoalsMeta().county_count, 75);

const clark = getCountyFieldGoal("clark");
assert.ok(clark);
assert.strictEqual(clark!.voter_registration_goal, 291);
assert.strictEqual(clark!.vci, 2543);
assert.strictEqual(institutionSubGoalFromCounty(291), 73);
assert.strictEqual(clark!.institution_sub_goal, 73);

const m = getScopeMetrics({
  kind: "institution",
  slug: "henderson-state",
  enrollment: 3190,
  countySlug: "clark",
});
assert.strictEqual(m.registration_target, 73);
assert.strictEqual(m.county_vci, 2543);
assert.ok(m.vci_definition?.includes("Lane 2"));

// Same county → same institution sub-goal for any school
const m2 = getScopeMetrics({
  kind: "institution",
  slug: "ouachita-baptist",
  enrollment: 1500,
  countySlug: "clark",
});
assert.strictEqual(m2.registration_target, m.registration_target);

// Sub-goals must not inflate county total when summed in messaging
assert.ok(m.civic_goal_explanation?.some((e) => e.includes("sub_goal_within_parent") || e.includes("not added")));

console.log("field-goals tests passed");
