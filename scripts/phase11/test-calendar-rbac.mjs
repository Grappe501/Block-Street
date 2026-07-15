/**
 * Unified CAL-P1.2 RBAC test runner (no vitest — jiti + asserts).
 */
import "../h-drive-env.mjs";
import { spawnSync } from "child_process";
import { existsSync, readdirSync, readFileSync } from "fs";
import { createRequire } from "module";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "../..");
const require = createRequire(import.meta.url);
const jiti = require("jiti")(import.meta.url);

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function runTool(cmd) {
  const r = spawnSync(
    process.execPath,
    [join(root, "scripts/run-with-h-env.mjs"), "node", join(root, "scripts/phase11/calendar-rbac-tool.mjs"), cmd],
    { encoding: "utf8", cwd: root, env: process.env },
  );
  if (r.status !== 0) {
    console.error(r.stdout, r.stderr);
    throw new Error(`calendar:rbac:${cmd} failed`);
  }
  return r.stdout;
}

// --- Registry / validate ---
runTool("validate");

// --- Module smoke ---
const evaluate = jiti(join(root, "src/lib/calendar/rbac/evaluate.ts"));
const types = jiti(join(root, "src/lib/calendar/rbac/types.ts"));
const guards = jiti(join(root, "src/lib/calendar/rbac/guards.ts"));
const projection = jiti(join(root, "src/lib/calendar/rbac/public-projection.ts"));
const audit = jiti(join(root, "src/lib/calendar/rbac/audit.ts"));
const policy = jiti(join(root, "src/lib/calendar/rbac/policy.ts"));
const roles = jiti(join(root, "src/lib/calendar/rbac/roles.ts"));

assert(policy.getCalendarRbacMode() === "audit_only", "mode audit_only");
assert(policy.isRbacEnforcementBlocked() === true, "enforcement blocked");
assert(roles.listCalendarRoles().length === 16, "16 roles");

// policy tests
const cm = types.emptyActor({
  authenticated: true,
  systemRoleKeys: ["campaign_manager"],
  campaignWide: true,
  publicationAccess: true,
});
const cmPrivate = evaluate.evaluatePolicy({
  actor: cm,
  permission: "calendar.event.view_candidate_private",
  resource: { containsCandidatePrivateData: true },
  context: types.defaultPolicyContext(),
});
assert(cmPrivate.allowed === false, "CM no private");
assert(cmPrivate.should_block === false, "audit_only no block");

// scope
const hend = types.emptyActor({
  authenticated: true,
  systemRoleKeys: ["college_leader"],
  collegeSlugs: ["henderson-state"],
});
assert(
  evaluate.evaluatePolicy({
    actor: hend,
    permission: "calendar.event.propose",
    resource: { collegeSlugs: ["henderson-state"] },
    context: types.defaultPolicyContext({ isMutation: true }),
  }).allowed === true,
  "henderson propose",
);
assert(
  evaluate.evaluatePolicy({
    actor: hend,
    permission: "calendar.event.edit_owned",
    resource: { collegeSlugs: ["uca"] },
    context: types.defaultPolicyContext({ isMutation: true }),
  }).allowed === false,
  "uca deny",
);

// denials / volunteer self-confirm
const vol = types.emptyActor({ authenticated: true, systemRoleKeys: ["volunteer"], userId: "v1" });
assert(
  evaluate.evaluatePolicy({
    actor: vol,
    permission: "calendar.staffing.confirm_participant",
    resource: {},
    context: types.defaultPolicyContext({ selfConfirm: true, isMutation: true }),
  }).allowed === false,
  "self confirm deny",
);

// candidate privacy
const sched = types.emptyActor({
  authenticated: true,
  systemRoleKeys: ["candidate_scheduler"],
  candidateScheduleAccess: true,
});
assert(
  evaluate.evaluatePolicy({
    actor: sched,
    permission: "calendar.candidate.confirm",
    resource: {},
    context: types.defaultPolicyContext({ isMutation: true }),
  }).allowed === true,
  "scheduler confirm",
);

// publication
assert(
  evaluate.evaluatePolicy({
    actor: cm,
    permission: "calendar.publication.publish",
    resource: { approvalStatus: "approved", publicationStatus: "ready", visibility: "public" },
    context: types.defaultPolicyContext({ isMutation: true }),
  }).allowed === true,
  "publish approved",
);
assert(
  evaluate.evaluatePolicy({
    actor: cm,
    permission: "calendar.publication.publish",
    resource: { approvalStatus: "draft", publicationStatus: "not_ready", visibility: "public" },
    context: types.defaultPolicyContext({ isMutation: true }),
  }).allowed === false,
  "publish unapproved deny",
);

// public projection
const projected = projection.projectPublicCalendarEvent({
  event_id: "e1",
  title: "Town hall",
  public_summary: "Hi",
  private_travel_notes: "SECRET",
  start_at: "2026-08-01",
});
assert(projected.private_travel_notes === undefined, "strip private");
assert(projected.title === "Town hall", "keep title");

// audit-only records
audit.clearAuditOnlyDecisions();
guards.requireCalendarPermission({
  actor: hend,
  permission: "calendar.candidate.confirm",
  resource: { collegeSlugs: ["henderson-state"] },
  context: { isMutation: true },
  actualBehavior: "denied",
});
assert(audit.getAuditOnlyDecisions().length >= 1, "audit recorded");
assert(guards.requireCalendarPermission({ actor: vol, permission: "calendar.staffing.express_interest" }).should_block === false, "no enforce");

// enforced-mode simulation: should_block stays false while Gate A open even if env lies
process.env.CALENDAR_RBAC_MODE = "enforced";
const blocked = evaluate.evaluatePolicy({
  actor: vol,
  permission: "calendar.publication.publish",
  resource: {},
  context: types.defaultPolicyContext({ isMutation: true }),
});
assert(blocked.allowed === false, "volunteer no publish");
assert(blocked.should_block === false, "Gate A open → never should_block");
process.env.CALENDAR_RBAC_MODE = "audit_only";

// regression: aliases
assert(
  evaluate.evaluateCalendarPermission({ role: "volunteer" }, "calendar.shift.express_interest").allowed === true,
  "alias interest",
);
assert(
  evaluate.evaluateCalendarPermission({ role: "volunteer" }, "calendar.shift.confirm").allowed === false,
  "alias confirm deny",
);

runTool("scenarios");
runTool("audit-report");
runTool("enforcement-readiness");

// Ensure required test files exist (contract of package)
const testDir = join(root, "tests/calendar");
assert(existsSync(testDir), "tests/calendar missing");
const required = [
  "rbac-policy.test.ts",
  "rbac-scope.test.ts",
  "rbac-denials.test.ts",
  "rbac-candidate-privacy.test.ts",
  "rbac-publication.test.ts",
  "rbac-audit-only.test.ts",
  "rbac-enforced-mode.test.ts",
  "rbac-regression.test.ts",
];
for (const f of required) {
  assert(existsSync(join(testDir, f)), `missing ${f}`);
}

console.log(
  JSON.stringify(
    {
      status: "PASS",
      phase: "CAL-P1.2",
      mode: "audit_only",
      enforcement: "BLOCKED",
      gateA: "OPEN",
      tests: required.length,
    },
    null,
    2,
  ),
);
