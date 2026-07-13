#!/usr/bin/env node
/**
 * CAE-11.7-W12 — Automation Runtime validation
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
  "docs/phase-11/11.7-living-intelligence/12_AUTONOMOUS_INSTITUTIONAL_OPERATIONS.md",
  "docs/phase-11/11.7-living-intelligence/AUTOMATION_CONSTITUTION.md",
  "docs/phase-11/11.7-living-intelligence/WAVE_12_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.7/living/automation/constitution.ts",
  "src/lib/civic-action/builds/11.7/living/automation/services/automation-service.ts",
  "src/app/api/v1/localbrain/automation/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const constitution = readFileSync(
  join(root, "src/lib/civic-action/builds/11.7/living/automation/constitution.ts"),
  "utf8"
);
if (!constitution.includes("LIX_AUTOMATION_PRINCIPLE")) fail("constitution missing principle");

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w12 = reqs.requirements.filter((r) => r.build === "11.7-lix" && r.wave === "W12");
if (w12.length < 25) fail(`expected 25+ W12 requirements, got ${w12.length}`);

const w11Run = spawnSync("node", [join(root, "scripts/phase11/11.7-living-w11.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (w11Run.status !== 0) fail("W11 Federation prerequisite failed");

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w12-tests-11.7-living.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W12 automation tests failed");

if (failed) process.exit(1);
console.log("CAE-11.7-W12 Automation Runtime checks passed");
