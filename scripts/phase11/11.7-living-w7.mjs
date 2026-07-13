#!/usr/bin/env node
/**
 * CAE-11.7-W7 — Learning Runtime validation
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
  "docs/phase-11/11.7-living-intelligence/07_AI_LEARNING_RUNTIME.md",
  "docs/phase-11/11.7-living-intelligence/LEARNING_CONSTITUTION.md",
  "docs/phase-11/11.7-living-intelligence/WAVE_7_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.7/living/learning/constitution.ts",
  "src/lib/civic-action/builds/11.7/living/learning/services/learning-service.ts",
  "src/app/api/v1/localbrain/learning/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const constitution = readFileSync(
  join(root, "src/lib/civic-action/builds/11.7/living/learning/constitution.ts"),
  "utf8"
);
if (!constitution.includes("LIX_LEARNING_PRINCIPLE")) fail("constitution missing principle");

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w7 = reqs.requirements.filter((r) => r.build === "11.7-lix" && r.wave === "W7");
if (w7.length < 25) fail(`expected 25+ W7 requirements, got ${w7.length}`);

const w6Run = spawnSync("node", [join(root, "scripts/phase11/11.7-living-w6.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (w6Run.status !== 0) fail("W6 Conversation prerequisite failed");

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w7-tests-11.7-living.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W7 learning tests failed");

if (failed) process.exit(1);
console.log("CAE-11.7-W7 Learning Runtime checks passed");
