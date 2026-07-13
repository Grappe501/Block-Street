#!/usr/bin/env node
/**
 * CAE-11.6-W4 — Organization & governance validation
 */
import "../h-drive-env.mjs";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { spawnSync } from "child_process";
import { hDriveEnv, REPO_ROOT } from "../h-drive-env.mjs";

const root = REPO_ROOT;
let failed = 0;
function fail(msg) {
  console.error(`FAIL: ${msg}`);
  failed++;
}

const docs = [
  "docs/phase-11/11.6-institutional-operations/04_ORGANIZATION_GOVERNANCE_PROTOCOL.md",
  "docs/phase-11/11.6-institutional-operations/ORGANIZATION_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/ORGANIZATION_HIERARCHY.md",
  "docs/phase-11/11.6-institutional-operations/GOVERNANCE_MODEL.md",
  "docs/phase-11/11.6-institutional-operations/FEDERATION_MODEL.md",
  "docs/phase-11/11.6-institutional-operations/WAVE_4_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.6/organization/constitution.ts",
  "src/lib/civic-action/builds/11.6/organization/w4.ts",
  "src/lib/civic-action/builds/11.6/organization/services/organization-service.ts",
  "src/app/api/v1/operations/institutions/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const constitution = readFileSync(join(root, "src/lib/civic-action/builds/11.6/organization/constitution.ts"), "utf8");
for (const term of ["OPS_ORGANIZATION_PRINCIPLE", "ORGANIZATIONAL_ARCHITECTURE", "REQUIRED_ORGANIZATION_SERVICES", "ORGANIZATION_AI_MAY_NOT"]) {
  if (!constitution.includes(term)) fail(`constitution missing ${term}`);
}

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w4 = reqs.requirements.filter((r) => r.build === "11.6" && r.wave === "W4");
if (w4.length < 30) fail(`expected 30+ W4 requirements, got ${w4.length}`);

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w4-tests-11.6.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W4 organization tests failed");

if (failed) process.exit(1);
console.log("CAE-11.6-W4 Organization & Governance checks passed");
