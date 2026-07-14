/**
 * npm run test:leadership-hierarchy
 */
import assert from "assert";
import {
  countyLeadMayAccessOtherCounty,
  getLeadershipRole,
  listLeadershipRoles,
  roleIsUnderVolunteerManager,
} from "../src/lib/volunteer-command/roles";
import { buildCountyVolunteerCommand } from "../src/lib/volunteer-command/dashboard";

const roles = listLeadershipRoles();
assert.ok(roles.some((r) => r.role_key === "volunteer_manager"));
assert.ok(roles.some((r) => r.role_key === "college_leader"));
assert.ok(roles.some((r) => r.role_key === "county_volunteer_lead"));

const vm = getLeadershipRole("volunteer_manager");
assert.ok(vm?.child_role_keys.includes("college_leader"));
assert.ok(vm?.child_role_keys.includes("county_volunteer_lead"));

assert.strictEqual(roleIsUnderVolunteerManager("college_leader"), true);
assert.strictEqual(roleIsUnderVolunteerManager("county_volunteer_lead"), true);
assert.strictEqual(roleIsUnderVolunteerManager("director"), false);

assert.strictEqual(countyLeadMayAccessOtherCounty("clark", "clark"), true);
assert.strictEqual(countyLeadMayAccessOtherCounty("clark", "pulaski"), false);

const clark = buildCountyVolunteerCommand("clark");
assert.ok(clark.scope_rule.toLowerCase().includes("assigned county"));
assert.strictEqual(clark.county_slug, "clark");
assert.ok(clark.registration_goal != null);

console.log("leadership-hierarchy tests passed");
