#!/usr/bin/env node
/**
 * CAE-11.7-W8 — Prediction Runtime validation
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
  "docs/phase-11/11.7-living-intelligence/08_AI_PREDICTION_RUNTIME.md",
  "docs/phase-11/11.7-living-intelligence/PREDICTION_CONSTITUTION.md",
  "docs/phase-11/11.7-living-intelligence/WAVE_8_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.7/living/prediction/constitution.ts",
  "src/lib/civic-action/builds/11.7/living/prediction/services/prediction-service.ts",
  "src/app/api/v1/localbrain/prediction/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const constitution = readFileSync(
  join(root, "src/lib/civic-action/builds/11.7/living/prediction/constitution.ts"),
  "utf8"
);
if (!constitution.includes("LIX_PREDICTION_PRINCIPLE")) fail("constitution missing principle");

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w8 = reqs.requirements.filter((r) => r.build === "11.7-lix" && r.wave === "W8");
if (w8.length < 25) fail(`expected 25+ W8 requirements, got ${w8.length}`);

const w7Run = spawnSync("node", [join(root, "scripts/phase11/11.7-living-w7.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (w7Run.status !== 0) fail("W7 Learning prerequisite failed");

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w8-tests-11.7-living.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W8 prediction tests failed");

if (failed) process.exit(1);
console.log("CAE-11.7-W8 Prediction Runtime checks passed");
