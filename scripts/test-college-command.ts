/**
 * College Command + education contact permission tests.
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

const dash = buildCollegeCommandDashboard();
assert.ok(dash.summary.totalInstitutions > 10);
assert.ok(dash.summary.colleges > 5);
assert.ok(dash.rows.every((r) => r.institutionSubGoal === Math.ceil(r.countyGoal * 0.25) || r.countyGoal === 0));
assert.ok(dash.privacyNote.toLowerCase().includes("high-school"));

// County totals do not inflate when many institutions share the same county goal
const clark = dash.rows.filter((r) => r.countySlug === "clark");
assert.ok(clark.length >= 1);
const clarkGoal = clark[0]!.countyGoal;
assert.ok(clark.every((r) => r.countyGoal === clarkGoal));
assert.ok(clark.every((r) => r.institutionSubGoal === Math.ceil(clarkGoal * 0.25)));

assert.strictEqual(canAccessEducationContactDirectory("college_leader"), true);
assert.strictEqual(canAccessEducationContactDirectory("participant"), false);
assert.strictEqual(canAccessEducationContactDirectory("anonymous"), false);

assert.strictEqual(contactModeForScope("high_school:example", true), "campaign_relay");
assert.strictEqual(contactModeForScope("school:henderson-state", true), "email_approved");

const denied = listEducationContacts({ role: "participant", scopeId: "school:henderson-state" });
assert.strictEqual(denied.allowed, false);
assert.strictEqual(denied.entries.length, 0);

const hs = listEducationContacts({ role: "college_leader", scopeId: "high_school:example-hs" });
assert.strictEqual(hs.allowed, true);
assert.strictEqual(hs.high_school_privacy_enforced, true);
assert.strictEqual(hs.bulk_messaging_allowed, false);

const attempt = recordContactAttempt({
  actor_role: "college_leader",
  target_person_id: "x",
  channel: "campaign_relay",
});
assert.strictEqual(attempt.storage_backend, "not_persisted");

console.log("college-command tests passed", dash.summary.totalInstitutions);
