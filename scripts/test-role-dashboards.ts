/**
 * npm run test:role-dashboards
 */
import assert from "assert";
import {
  buildFunctionalLeaderDashboard,
  buildLeaderDashboard,
  buildVolunteerCommandDashboard,
} from "../src/lib/volunteer-command/dashboard";
import { dashboardSectionsForRole, getDashboardConfig } from "../src/lib/volunteer-command/roles";
import { fieldPlanPlaceholderCopy } from "../src/lib/volunteer-command/roles";

const vc = getDashboardConfig("volunteer_command");
assert.ok(vc);
assert.ok(vc!.navigation_sections.includes("People"));
assert.ok(vc!.navigation_sections.includes("Education"));

const sections = dashboardSectionsForRole("functional_lead");
assert.ok(sections.includes("Field Plan"));
assert.ok(!sections.includes("Architecture"));

const functional = buildFunctionalLeaderDashboard("canvassing", "statewide");
assert.strictEqual(functional.related_functions_hidden, true);
assert.ok(functional.field_plan_placeholder.includes("Field Plan"));
assert.strictEqual(functional.field_plan_content_status, "placeholder");
assert.ok(!functional.sections.some((s) => /architect/i.test(s)));

const leader = buildLeaderDashboard("demo-assignment");
assert.ok(leader.sections.length > 3);
assert.ok(leader.note.toLowerCase().includes("registry"));

const people = buildVolunteerCommandDashboard({ section: "people" });
assert.strictEqual(people.section, "people");

assert.ok(fieldPlanPlaceholderCopy().toLowerCase().includes("field plan"));
assert.ok(!fieldPlanPlaceholderCopy().toLowerCase().includes("must canvass precinct 12"));

console.log("role-dashboards tests passed");
