#!/usr/bin/env node
/**
 * CAE-11.6-W13 — Improvement validation
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
  "docs/phase-11/11.6-institutional-operations/13_IMPROVEMENT_MEASUREMENT_PROTOCOL.md",
  "docs/phase-11/11.6-institutional-operations/IMPROVEMENT_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/KPI_REGISTRY.md",
  "docs/phase-11/11.6-institutional-operations/CONTINUOUS_IMPROVEMENT.md",
  "docs/phase-11/11.6-institutional-operations/OUTCOME_MEASUREMENT.md",
  "docs/phase-11/11.6-institutional-operations/WAVE_13_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.6/improvement/constitution.ts",
  "src/lib/civic-action/builds/11.6/improvement/w13.ts",
  "src/lib/civic-action/builds/11.6/improvement/services/improvement-service.ts",
  "src/app/api/v1/improvement/dashboard/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const constitution = readFileSync(join(root, "src/lib/civic-action/builds/11.6/improvement/constitution.ts"), "utf8");
for (const term of ["OPS_IMPROVEMENT_PRINCIPLE", "IMPROVEMENT_ARCHITECTURE", "REQUIRED_IMPROVEMENT_SERVICES", "IMPROVEMENT_AI_MAY_NOT"]) {
  if (!constitution.includes(term)) fail(`constitution missing ${term}`);
}

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w13 = reqs.requirements.filter((r) => r.build === "11.6" && r.wave === "W13");
if (w13.length < 30) fail(`expected 30+ W13 requirements, got ${w13.length}`);

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w13-tests-11.6.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W13 improvement tests failed");

if (failed) process.exit(1);
console.log("CAE-11.6-W13 Improvement checks passed");
