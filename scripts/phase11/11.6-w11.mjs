#!/usr/bin/env node
/**
 * CAE-11.6-W11 — Resilience validation
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
  "docs/phase-11/11.6-institutional-operations/11_RESILIENCE_CONTINUITY_PROTOCOL.md",
  "docs/phase-11/11.6-institutional-operations/RESILIENCE_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/CONTINUITY_PLANNING.md",
  "docs/phase-11/11.6-institutional-operations/INCIDENT_COMMAND.md",
  "docs/phase-11/11.6-institutional-operations/RECOVERY_PLANNING.md",
  "docs/phase-11/11.6-institutional-operations/WAVE_11_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.6/resilience/constitution.ts",
  "src/lib/civic-action/builds/11.6/resilience/w11.ts",
  "src/lib/civic-action/builds/11.6/resilience/services/resilience-service.ts",
  "src/app/api/v1/resilience/plans/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const constitution = readFileSync(join(root, "src/lib/civic-action/builds/11.6/resilience/constitution.ts"), "utf8");
for (const term of ["OPS_RESILIENCE_PRINCIPLE", "RESILIENCE_ARCHITECTURE", "REQUIRED_RESILIENCE_SERVICES", "RESILIENCE_AI_MAY_NOT"]) {
  if (!constitution.includes(term)) fail(`constitution missing ${term}`);
}

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w11 = reqs.requirements.filter((r) => r.build === "11.6" && r.wave === "W11");
if (w11.length < 30) fail(`expected 30+ W11 requirements, got ${w11.length}`);

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w11-tests-11.6.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W11 resilience tests failed");

if (failed) process.exit(1);
console.log("CAE-11.6-W11 Resilience checks passed");
