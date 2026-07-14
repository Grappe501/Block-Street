/**
 * npm run test:role-dashboards
 */
import assert from "assert";
import {
  buildFunctionalLeaderDashboard,
  buildLeaderDashboard,
  buildVolunteerCommandDashboard,
} from "../src/lib/volunteer-command/dashboard";
import { dashboardSectionsForRole, getDashboardConfig, fieldPlanPlaceholderCopy } from "../src/lib/volunteer-command/roles";

const dashConfig = getDashboardConfig("volunteer_command");
assert.ok(dashConfig);
assert.ok(dashConfig!.navigation_sections.includes("People"));
assert.ok(dashConfig!.navigation_sections.includes("Education"));

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

const command = buildVolunteerCommandDashboard({ section: "command" });
assert.strictEqual(command.field_plan.status, "ingested");
assert.ok(command.field_plan.phases.length >= 13);

console.log("role-dashboards tests passed");
