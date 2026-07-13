#!/usr/bin/env node
/**
 * CAE-11.7-W4 — Organizer validation
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
  "docs/phase-11/11.7-living-intelligence/04_AI_ORGANIZER_RUNTIME.md",
  "docs/phase-11/11.7-living-intelligence/ORGANIZER_CONSTITUTION.md",
  "docs/phase-11/11.7-living-intelligence/WAVE_4_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.7/living/organizer/constitution.ts",
  "src/lib/civic-action/builds/11.7/living/organizer/services/organizer-service.ts",
  "src/app/api/v1/localbrain/organizer/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const constitution = readFileSync(
  join(root, "src/lib/civic-action/builds/11.7/living/organizer/constitution.ts"),
  "utf8"
);
if (!constitution.includes("LIX_ORGANIZER_PRINCIPLE")) fail("constitution missing principle");

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w4 = reqs.requirements.filter((r) => r.build === "11.7-lix" && r.wave === "W4");
if (w4.length < 25) fail(`expected 25+ W4 requirements, got ${w4.length}`);

const w3Run = spawnSync("node", [join(root, "scripts/phase11/11.7-living-w3.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (w3Run.status !== 0) fail("W3 Executive prerequisite failed");

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w4-tests-11.7-living.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W4 organizer tests failed");

if (failed) process.exit(1);
console.log("CAE-11.7-W4 Organizer checks passed");
