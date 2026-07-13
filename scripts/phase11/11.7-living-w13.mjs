#!/usr/bin/env node
/**
 * CAE-11.7-W13 — Capability Factory validation
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
  "docs/phase-11/11.7-living-intelligence/13_SELF_BUILDING_INSTITUTION.md",
  "docs/phase-11/11.7-living-intelligence/FACTORY_CONSTITUTION.md",
  "docs/phase-11/11.7-living-intelligence/WAVE_13_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.7/living/factory/constitution.ts",
  "src/lib/civic-action/builds/11.7/living/factory/services/factory-service.ts",
  "src/app/api/v1/localbrain/factory/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const constitution = readFileSync(
  join(root, "src/lib/civic-action/builds/11.7/living/factory/constitution.ts"),
  "utf8"
);
if (!constitution.includes("LIX_FACTORY_PRINCIPLE")) fail("constitution missing principle");

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w13 = reqs.requirements.filter((r) => r.build === "11.7-lix" && r.wave === "W13");
if (w13.length < 25) fail(`expected 25+ W13 requirements, got ${w13.length}`);

const w12Run = spawnSync("node", [join(root, "scripts/phase11/11.7-living-w12.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (w12Run.status !== 0) fail("W12 Automation prerequisite failed");

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w13-tests-11.7-living.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W13 factory tests failed");

if (failed) process.exit(1);
console.log("CAE-11.7-W13 Capability Factory checks passed");
