#!/usr/bin/env node
/**
 * CAE-11.6-W2 — Mission Execution Engine validation
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
  "docs/phase-11/11.6-institutional-operations/02_MISSION_EXECUTION_PROTOCOL.md",
  "docs/phase-11/11.6-institutional-operations/MISSION_EXECUTION_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/MISSION_LIFECYCLE.md",
  "docs/phase-11/11.6-institutional-operations/MISSION_TRACEABILITY.md",
  "docs/phase-11/11.6-institutional-operations/MISSION_AI_BOUNDARIES.md",
  "docs/phase-11/11.6-institutional-operations/WAVE_2_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.6/execution/constitution.ts",
  "src/lib/civic-action/builds/11.6/execution/w2.ts",
  "src/lib/civic-action/builds/11.6/execution/services/mission-execution-service.ts",
  "src/app/api/v1/operations/missions/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const constitution = readFileSync(join(root, "src/lib/civic-action/builds/11.6/execution/constitution.ts"), "utf8");
for (const term of ["OPS_EXECUTION_PRINCIPLE", "MISSION_EXECUTION_HIERARCHY", "REQUIRED_EXECUTION_SERVICES", "EXECUTION_AI_MAY_NOT"]) {
  if (!constitution.includes(term)) fail(`constitution missing ${term}`);
}

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w2 = reqs.requirements.filter((r) => r.build === "11.6" && r.wave === "W2");
if (w2.length < 30) fail(`expected 30+ W2 requirements, got ${w2.length}`);

const lifecycle = JSON.parse(readFileSync(join(root, "data/phase-11/operations_mission_lifecycle.json"), "utf8"));
if ((lifecycle.states?.length ?? 0) !== 13) fail("lifecycle must have 13 states");

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w2-tests-11.6.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W2 mission tests failed");

if (failed) process.exit(1);
console.log("CAE-11.6-W2 Mission Execution Engine checks passed");
