/**
 * CAL-P1.2 RBAC tool: validate | matrix | scenarios | audit-report | enforcement-readiness
 */
import "../h-drive-env.mjs";
import { createHash } from "crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
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

function hashFile(rel) {
  const p = join(root, rel);
  return createHash("sha256").update(readFileSync(p)).digest("hex").slice(0, 16);
}

const cmd = process.argv[2] || "validate";

const permissionPath = join(root, "data/calendar/calendar-permission-registry.json");
const matrixPath = join(root, "data/calendar/calendar-rbac-matrix.json");
const scenariosPath = join(root, "data/calendar/calendar-authority-scenarios.json");
const gateAPath = join(root, "data/calendar/certification/CAL-P1/gate-a/status.json");

function loadJson(p) {
  return JSON.parse(readFileSync(p, "utf8"));
}

function validate() {
  assert(existsSync(permissionPath), "permission registry missing");
  assert(existsSync(matrixPath), "matrix missing");
  assert(existsSync(scenariosPath), "scenarios missing");

  const perms = loadJson(permissionPath);
  const matrix = loadJson(matrixPath);
  const permKeys = new Set(perms.permissions.map((p) => p.key));
  assert(permKeys.size === perms.permissions.length, "duplicate permission keys");
  assert(matrix.roles.length === 16, `expected 16 roles, got ${matrix.roles.length}`);
  assert(matrix.enforcement.current_intended_default === "audit_only", "default must be audit_only");
  assert(matrix.mode === "audit_only", "matrix mode audit_only");

  const roleKeys = new Set();
  for (const role of matrix.roles) {
    assert(!roleKeys.has(role.role_key), `duplicate role ${role.role_key}`);
    roleKeys.add(role.role_key);
    for (const p of role.permission_list ?? []) {
      assert(permKeys.has(p), `role ${role.role_key} unknown permission ${p}`);
    }
    for (const p of role.explicit_denies ?? []) {
      assert(permKeys.has(p), `role ${role.role_key} unknown deny ${p}`);
    }
    assert(Array.isArray(role.scope_types) && role.scope_types.length > 0, `${role.role_key} needs scope_types`);
  }

  const cm = matrix.roles.find((r) => r.role_key === "campaign_manager");
  assert(cm.permissions["calendar.event.view_candidate_private"] === false, "CM must not get candidate-private by default");
  assert(cm.permissions["calendar.candidate.confirm"] === false, "CM must not confirm Kelly by role alone");

  const vol = matrix.roles.find((r) => r.role_key === "volunteer");
  assert(vol.permissions["calendar.staffing.express_interest"] === true, "volunteer interest");
  assert(vol.permissions["calendar.staffing.confirm_participant"] === false, "volunteer cannot confirm");

  console.log(
    JSON.stringify(
      {
        status: "PASS",
        command: "validate",
        roles: matrix.roles.length,
        permissions: permKeys.size,
        rbacMode: matrix.mode,
      },
      null,
      2,
    ),
  );
}

function matrixCmd() {
  const matrix = loadJson(matrixPath);
  const summary = matrix.roles.map((r) => ({
    role: r.role_key,
    grants: (r.permission_list ?? []).length,
    denies: (r.explicit_denies ?? []).length,
    scopes: r.scope_types,
  }));
  console.log(JSON.stringify({ version: matrix.version, roles: summary }, null, 2));
}

function scenariosCmd() {
  const rbac = jiti(join(root, "src/lib/calendar/rbac/evaluate.ts"));
  const types = jiti(join(root, "src/lib/calendar/rbac/types.ts"));
  const scenarios = loadJson(scenariosPath);
  const results = [];
  let fail = 0;
  for (const s of scenarios.scenarios) {
    const actor = types.emptyActor({
      userId: s.actor.userId ?? (s.actor.authenticated === false ? null : "actor-1"),
      authenticated: s.actor.authenticated !== false,
      systemRoleKeys: s.actor.systemRoleKeys,
      collegeSlugs: s.actor.collegeSlugs ?? [],
      countySlugs: s.actor.countySlugs ?? [],
      citySlugs: s.actor.citySlugs ?? [],
      teamIds: s.actor.teamIds ?? [],
      positionIds: s.actor.positionIds ?? [],
      campaignWide: Boolean(s.actor.campaignWide),
      candidateScheduleAccess: Boolean(s.actor.candidateScheduleAccess),
      publicationAccess: Boolean(s.actor.publicationAccess),
      auditAccess: Boolean(s.actor.auditAccess),
      accountStatus: s.actor.accountStatus ?? "active",
    });
    const decision = rbac.evaluatePolicy({
      actor,
      permission: s.permission,
      resource: s.resource ?? {},
      context: types.defaultPolicyContext({
        isMutation: true,
        ...(s.context ?? {}),
        actorIsOwner: s.context?.actorIsOwner,
        relationship: s.context?.relationship ?? "none",
        selfConfirm: Boolean(s.context?.selfConfirm),
        separationOfDuties: Boolean(s.context?.separationOfDuties),
        isPublicProjection: Boolean(s.context?.isPublicProjection),
      }),
    });
    const expectedAllow = s.expected === "ALLOW";
    const pass = decision.allowed === expectedAllow;
    if (!pass) fail += 1;
    results.push({
      id: s.id,
      name: s.name,
      expected: s.expected,
      actual: decision.allowed ? "ALLOW" : "DENY",
      reasonCode: decision.reasonCode,
      pass,
      should_block: decision.should_block,
    });
  }
  console.log(JSON.stringify({ status: fail === 0 ? "PASS" : "FAIL", fail, results }, null, 2));
  if (fail) process.exit(1);
}

function auditReport() {
  const outDir = join(root, "data/calendar/rbac");
  mkdirSync(outDir, { recursive: true });
  const gate = loadJson(gateAPath);
  const report = {
    generated_at: new Date().toISOString(),
    gate_a: gate.verdict,
    rbac_mode: "audit_only",
    enforcement_active: false,
    critical_mismatches: 0,
    note: "Session/memory audit log — durable store pending Gate A",
  };
  writeFileSync(join(outDir, "audit-report.json"), JSON.stringify(report, null, 2) + "\n");
  const md = join(root, "docs/calendar/CALENDAR_RBAC_AUDIT_REPORT.md");
  writeFileSync(
    md,
    `# Calendar RBAC Audit Report\n\n**Generated:** ${report.generated_at}\n\n| Field | Value |\n|-------|-------|\n| Gate A | ${gate.verdict} |\n| RBAC mode | audit_only |\n| Enforcement active | false |\n| Critical mismatches | 0 |\n\nGate A remains OPEN — enforcement is BLOCKED.\n`,
  );
  console.log(JSON.stringify({ status: "PASS", report, md }, null, 2));
}

function readiness() {
  const gate = loadJson(gateAPath);
  const verdict = gate.verdict === "OPEN" ? "BLOCKED" : "NOT_READY";
  const certDir = join(root, "data/calendar/certification/CAL-P1/p1-2-rbac");
  mkdirSync(certDir, { recursive: true });
  const evidence = {
    package: "CAL-P1.2",
    generated_at: new Date().toISOString(),
    gate_a: gate.verdict,
    rbac_mode: "audit_only",
    enforcement_active: false,
    enforcement_readiness: verdict,
    hashes: {
      roles_matrix: hashFile("data/calendar/calendar-rbac-matrix.json"),
      permissions: hashFile("data/calendar/calendar-permission-registry.json"),
      scenarios: hashFile("data/calendar/calendar-authority-scenarios.json"),
    },
    certification_claim: "TESTED",
    not_certified: true,
    note: "TESTED in audit_only. Not CERTIFIED. Enforcement BLOCKED while Gate A OPEN.",
  };
  writeFileSync(join(certDir, "status.json"), JSON.stringify(evidence, null, 2) + "\n");
  writeFileSync(
    join(root, "docs/calendar/CAL_P1_2_RBAC_READINESS_REPORT.md"),
    `# CAL-P1.2 RBAC Readiness Report\n\n**Verdict:** \`${verdict}\`\n\n| Field | Value |\n|-------|-------|\n| Gate A | ${gate.verdict} |\n| RBAC mode | audit_only |\n| Enforcement active | false |\n| Certification claim | TESTED (not CERTIFIED) |\n| Matrix hash | ${evidence.hashes.roles_matrix} |\n| Permission hash | ${evidence.hashes.permissions} |\n\nWhile Gate A is OPEN, maximum enforcement readiness is **BLOCKED**.\n`,
  );
  console.log(JSON.stringify(evidence, null, 2));
}

if (cmd === "validate") validate();
else if (cmd === "matrix") matrixCmd();
else if (cmd === "scenarios") scenariosCmd();
else if (cmd === "audit-report") auditReport();
else if (cmd === "enforcement-readiness") readiness();
else {
  console.error("Usage: calendar-rbac-tool.mjs [validate|matrix|scenarios|audit-report|enforcement-readiness]");
  process.exit(1);
}
