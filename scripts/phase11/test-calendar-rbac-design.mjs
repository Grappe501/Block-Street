/**
 * CAL-P1.2 RBAC matrix integrity tests — design only; does not enable enforcement.
 */
import "../h-drive-env.mjs";
import { existsSync, readFileSync } from "fs";
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

const matrixPath = join(root, "data/calendar/calendar-rbac-matrix.json");
const docPath = join(root, "docs/calendar/CALENDAR_RBAC_AUTHORITY_MATRIX.md");
assert(existsSync(matrixPath), "matrix json missing");
assert(existsSync(docPath), "matrix doc missing");

const matrix = JSON.parse(readFileSync(matrixPath, "utf8"));
assert(matrix.status === "design_present_audit_only", "status must be design_present_audit_only");
assert(matrix.enforcement.current_intended_default === "audit_only", "default audit_only");
assert(matrix.roles.length >= 10, "expected core roles");
assert(matrix.actions.includes("calendar.event.view_candidate_private"), "candidate private action");
assert(matrix.actions.includes("calendar.shift.express_interest"), "interest action");
assert(matrix.actions.includes("calendar.shift.confirm"), "confirm action");

const byKey = Object.fromEntries(matrix.roles.map((r) => [r.role_key, r]));
assert(byKey.volunteer.permissions["calendar.shift.express_interest"] === true, "volunteer may interest");
assert(byKey.volunteer.permissions["calendar.shift.confirm"] === false, "volunteer may not confirm");
assert(byKey.viewer.permissions["calendar.event.view_candidate_private"] === false, "viewer no private");
assert(byKey.college_leader.geographic_restriction === "assigned_college_only", "college geo");
assert(byKey.volunteer_manager.named_holder === "Carol Eagan", "Carol owns Event Board mapping");
assert(byKey.campaign_manager.permissions["calendar.event.publish"] === true, "CM publish");
assert(byKey.volunteer_manager.permissions["calendar.event.publish"] === false, "VM no publish");
assert(byKey.volunteer_manager.permissions["calendar.event.view_candidate_private"] === false, "VM no kelly private");

const rbac = jiti(join(root, "src/lib/calendar/rbac/authority.ts"));
const cfg = jiti(join(root, "src/lib/calendar/persistence/config.ts")).getCalendarPersistenceConfig();
assert(cfg.rbacMode === "audit_only", "runtime must stay audit_only until Gate A");

const collegeDeny = rbac.evaluateCalendarPermission(
  { role: "college_leader", collegeSlugs: ["henderson-state"] },
  "calendar.event.approve_local",
  { collegeSlugs: ["uca"] },
);
assert(collegeDeny.allowed === false, "henderson lead cannot approve uca");
assert(collegeDeny.should_block === false, "audit_only must not block");

const volunteerInterest = rbac.evaluateCalendarPermission(
  { role: "volunteer" },
  "calendar.shift.express_interest",
  {},
);
assert(volunteerInterest.allowed === true, "volunteer interest allowed");
assert(volunteerInterest.should_block === false, "audit_only no block");

const viewerPrivate = rbac.evaluateCalendarPermission(
  { role: "viewer" },
  "calendar.event.view_candidate_private",
  {},
);
assert(viewerPrivate.allowed === false, "viewer denied private");
assert(viewerPrivate.should_block === false, "still audit_only");

assert(rbac.isRbacEnforcementBlocked() === true, "enforcement blocked while audit_only");

console.log(
  JSON.stringify(
    {
      status: "PASS",
      phase: "CAL-P1.2-design",
      rbacMode: cfg.rbacMode,
      roles: matrix.roles.length,
      actions: matrix.actions.length,
      enforcement: "blocked_until_gate_a",
      note: "Matrix integrity verified; runtime remains audit_only",
    },
    null,
    2,
  ),
);
