#!/usr/bin/env node
/**
 * CAE-11.7-W14 — Digital Twin Runtime validation
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
  "docs/phase-11/11.7-living-intelligence/14_DIGITAL_TWIN.md",
  "docs/phase-11/11.7-living-intelligence/TWIN_CONSTITUTION.md",
  "docs/phase-11/11.7-living-intelligence/WAVE_14_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.7/living/twin/constitution.ts",
  "src/lib/civic-action/builds/11.7/living/twin/services/twin-service.ts",
  "src/app/api/v1/localbrain/digital-twin/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const constitution = readFileSync(
  join(root, "src/lib/civic-action/builds/11.7/living/twin/constitution.ts"),
  "utf8"
);
if (!constitution.includes("LIX_TWIN_PRINCIPLE")) fail("constitution missing principle");

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w14 = reqs.requirements.filter((r) => r.build === "11.7-lix" && r.wave === "W14");
if (w14.length < 25) fail(`expected 25+ W14 requirements, got ${w14.length}`);

const w13Run = spawnSync("node", [join(root, "scripts/phase11/11.7-living-w13.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (w13Run.status !== 0) fail("W13 Factory prerequisite failed");

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w14-tests-11.7-living.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W14 twin tests failed");

if (failed) process.exit(1);
console.log("CAE-11.7-W14 Digital Twin Runtime checks passed");
