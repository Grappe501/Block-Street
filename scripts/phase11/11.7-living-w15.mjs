#!/usr/bin/env node
/**
 * CAE-11.7-W15 — Institutional OS Kernel validation
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
  "docs/phase-11/11.7-living-intelligence/15_INSTITUTIONAL_OS_KERNEL.md",
  "docs/phase-11/11.7-living-intelligence/KERNEL_CONSTITUTION.md",
  "docs/phase-11/11.7-living-intelligence/WAVE_15_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.7/living/kernel/constitution.ts",
  "src/lib/civic-action/builds/11.7/living/kernel/services/kernel-service.ts",
  "src/app/api/v1/localbrain/kernel/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const constitution = readFileSync(
  join(root, "src/lib/civic-action/builds/11.7/living/kernel/constitution.ts"),
  "utf8"
);
if (!constitution.includes("LIX_KERNEL_PRINCIPLE")) fail("constitution missing principle");

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w15 = reqs.requirements.filter((r) => r.build === "11.7-lix" && r.wave === "W15");
if (w15.length < 25) fail(`expected 25+ W15 requirements, got ${w15.length}`);

const w14Run = spawnSync("node", [join(root, "scripts/phase11/11.7-living-w14.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (w14Run.status !== 0) fail("W14 Digital Twin prerequisite failed");

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w15-tests-11.7-living.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W15 kernel tests failed");

if (failed) process.exit(1);
console.log("CAE-11.7-W15 Institutional OS Kernel checks passed");
