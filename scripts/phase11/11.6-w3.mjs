#!/usr/bin/env node
/**
 * CAE-11.6-W3 — Workforce validation
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
  "docs/phase-11/11.6-institutional-operations/03_WORKFORCE_MANAGEMENT_PROTOCOL.md",
  "docs/phase-11/11.6-institutional-operations/WORKFORCE_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/WORKFORCE_CAPACITY.md",
  "docs/phase-11/11.6-institutional-operations/WORKFORCE_ASSIGNMENTS.md",
  "docs/phase-11/11.6-institutional-operations/WORKFORCE_AI_BOUNDARIES.md",
  "docs/phase-11/11.6-institutional-operations/WAVE_3_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.6/workforce/constitution.ts",
  "src/lib/civic-action/builds/11.6/workforce/w3.ts",
  "src/lib/civic-action/builds/11.6/workforce/services/workforce-service.ts",
  "src/app/api/v1/workforce/dashboard/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const constitution = readFileSync(join(root, "src/lib/civic-action/builds/11.6/workforce/constitution.ts"), "utf8");
for (const term of ["OPS_WORKFORCE_PRINCIPLE", "WORKFORCE_ARCHITECTURE", "REQUIRED_WORKFORCE_SERVICES", "WORKFORCE_AI_MAY_NOT"]) {
  if (!constitution.includes(term)) fail(`constitution missing ${term}`);
}

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w3 = reqs.requirements.filter((r) => r.build === "11.6" && r.wave === "W3");
if (w3.length < 30) fail(`expected 30+ W3 requirements, got ${w3.length}`);

const status = JSON.parse(readFileSync(join(root, "data/phase-11/workforce_status.json"), "utf8"));
if ((status.statuses?.length ?? 0) !== 8) fail("workforce statuses must be 8");

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w3-tests-11.6.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W3 workforce tests failed");

if (failed) process.exit(1);
console.log("CAE-11.6-W3 Workforce Management checks passed");
