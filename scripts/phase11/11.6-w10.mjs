#!/usr/bin/env node
/**
 * CAE-11.6-W10 — Intelligence validation
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
  "docs/phase-11/11.6-institutional-operations/10_PREDICTIVE_INTELLIGENCE_PROTOCOL.md",
  "docs/phase-11/11.6-institutional-operations/INTELLIGENCE_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/FORECAST_ENGINE.md",
  "docs/phase-11/11.6-institutional-operations/SCENARIO_SIMULATION.md",
  "docs/phase-11/11.6-institutional-operations/INSTITUTIONAL_LEARNING.md",
  "docs/phase-11/11.6-institutional-operations/WAVE_10_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.6/intelligence/constitution.ts",
  "src/lib/civic-action/builds/11.6/intelligence/w10.ts",
  "src/lib/civic-action/builds/11.6/intelligence/services/intelligence-service.ts",
  "src/app/api/v1/intelligence/insights/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const constitution = readFileSync(join(root, "src/lib/civic-action/builds/11.6/intelligence/constitution.ts"), "utf8");
for (const term of ["OPS_INTELLIGENCE_PRINCIPLE", "INTELLIGENCE_ARCHITECTURE", "REQUIRED_INTELLIGENCE_SERVICES", "INTELLIGENCE_AI_MAY_NOT"]) {
  if (!constitution.includes(term)) fail(`constitution missing ${term}`);
}

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w10 = reqs.requirements.filter((r) => r.build === "11.6" && r.wave === "W10");
if (w10.length < 30) fail(`expected 30+ W10 requirements, got ${w10.length}`);

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w10-tests-11.6.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W10 intelligence tests failed");

if (failed) process.exit(1);
console.log("CAE-11.6-W10 Intelligence checks passed");
