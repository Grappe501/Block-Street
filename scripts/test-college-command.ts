import assert from "assert";
import { buildCollegeCommandDashboard } from "../src/lib/college-command/dashboard";

const dash = buildCollegeCommandDashboard();
assert.ok(dash.summary.totalInstitutions > 10);
assert.ok(dash.summary.colleges > 5);
assert.ok(dash.rows.every((r) => r.institutionSubGoal === Math.ceil(r.countyGoal * 0.25) || r.countyGoal === 0));
assert.ok(dash.privacyNote.toLowerCase().includes("high-school"));
console.log("college-command tests passed", dash.summary.totalInstitutions);
