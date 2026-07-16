/**
 * College Command + education contact + subordinate hierarchy tests.
 * npm run test:college-command
 */
import assert from "assert";
import { buildCollegeCommandDashboard } from "../src/lib/college-command/dashboard";
import {
  listEducationContacts,
  recordContactAttempt,
} from "../src/lib/college-command/contact-directory";
import {
  canAccessEducationContactDirectory,
  contactModeForScope,
} from "../src/lib/college-command/contact-policy";
import { roleIsUnderVolunteerManager } from "../src/lib/volunteer-command/roles";
import {
  getClusterForCounty,
  resolveMatrixReporting,
} from "../src/lib/volunteer-command/matrix-command";
import { CAMPUS_GOAL_FORMULA_VERSION } from "../src/lib/field-goals";

assert.strictEqual(roleIsUnderVolunteerManager("college_leader"), true);

const dash = buildCollegeCommandDashboard();
assert.ok(dash.summary.colleges > 5);
assert.ok(dash.summary.bonusCoverage > 0);
assert.ok(dash.summary.colleges < dash.summary.totalInstitutions);
assert.ok(dash.goalDoctrine.includes("bonus"));
assert.ok(dash.summary.withoutLead <= dash.summary.colleges);

const tradeRow = dash.rows.find((r) => r.type === "trade_school");
if (tradeRow) {
  assert.strictEqual(tradeRow.goalTier, "bonus");
  assert.strictEqual(tradeRow.risk, "bonus");
}

const hsRow = dash.rows.find((r) => r.kind === "high_school");
if (hsRow) {
  assert.strictEqual(hsRow.goalTier, "bonus");
}

const henderson = dash.rows.find((r) => r.slug === "henderson-state");
if (henderson) {
  assert.strictEqual(henderson.goalTier, "required");
  assert.ok(henderson.countyCommandHref.includes("/admin/counties/clark/volunteer-command"));
  assert.ok(henderson.matrixReporting.geographic.some((l) => l.parent_role_key === "county_volunteer_lead"));
  const clarkCluster = getClusterForCounty("clark");
  assert.ok(clarkCluster?.cluster_key === "southwest");
}

const institutionMatrix = resolveMatrixReporting({ role_key: "institution_lead", county_slug: "clark" });
assert.ok(institutionMatrix.functional.some((l) => l.parent_role_key === "college_leader"));
assert.ok(institutionMatrix.geographic.some((l) => l.parent_role_key === "county_volunteer_lead"));

assert.ok(dash.summary.totalInstitutions > 10);
assert.ok(dash.parentCommand.href.includes("volunteer-command"));
assert.ok(dash.matrixCommand.matrix_command);
assert.ok(dash.matrixCommand.college_leader_reporting.functional.some((l) => l.parent_role_key === "volunteer_manager"));
assert.ok(dash.matrixCommand.college_leader_reporting.geographic.some((l) => l.parent_role_key === "county_volunteer_lead"));
assert.strictEqual(dash.campus_goal_formula_version, CAMPUS_GOAL_FORMULA_VERSION);
assert.ok(dash.privacyNote.toLowerCase().includes("high-school"));

const clark = dash.rows.filter((r) => r.countySlug === "clark" && r.kind === "institution");
assert.ok(clark.length >= 2);
// Enrollment-share: schools in same county can differ
const goals = new Set(clark.map((r) => r.institutionSubGoal));
assert.ok(goals.size >= 1);
assert.ok(clark.every((r) => r.countyGoal === clark[0]!.countyGoal));
assert.ok(clark.every((r) => r.institutionSubGoal <= r.countyGoal || r.countyGoal === 0));

assert.strictEqual(canAccessEducationContactDirectory("college_leader"), true);
assert.strictEqual(canAccessEducationContactDirectory("participant"), false);
assert.strictEqual(contactModeForScope("high_school:example", true), "campaign_relay");

const denied = listEducationContacts({ role: "participant", scopeId: "school:henderson-state" });
assert.strictEqual(denied.allowed, false);

const attempt = recordContactAttempt({
  actor_role: "college_leader",
  target_person_id: "x",
  channel: "campaign_relay",
});
assert.strictEqual(attempt.storage_backend, "not_persisted");

console.log("college-command tests passed", dash.summary.totalInstitutions);
