#!/usr/bin/env node
/**
 * CAE-11.7-W16 — Living Civilization Genesis validation
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
  "docs/phase-11/11.7-living-intelligence/16_LIVING_CIVILIZATION.md",
  "docs/phase-11/11.7-living-intelligence/GENESIS_CONSTITUTION.md",
  "docs/phase-11/11.7-living-intelligence/WAVE_16_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.7/living/genesis/constitution.ts",
  "src/lib/civic-action/builds/11.7/living/genesis/services/genesis-service.ts",
  "src/app/api/v1/localbrain/genesis/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const constitution = readFileSync(
  join(root, "src/lib/civic-action/builds/11.7/living/genesis/constitution.ts"),
  "utf8"
);
if (!constitution.includes("LIX_GENESIS_PRINCIPLE")) fail("constitution missing principle");

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w16 = reqs.requirements.filter((r) => r.build === "11.7-lix" && r.wave === "W16");
if (w16.length < 25) fail(`expected 25+ W16 requirements, got ${w16.length}`);

const w15Run = spawnSync("node", [join(root, "scripts/phase11/11.7-living-w15.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (w15Run.status !== 0) fail("W15 Kernel prerequisite failed");

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w16-tests-11.7-living.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W16 genesis tests failed");

if (failed) process.exit(1);
console.log("CAE-11.7-W16 Living Civilization Genesis checks passed");
console.log("Build 11.7 Living Intelligence — all 16 waves complete");
