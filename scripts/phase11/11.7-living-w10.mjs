#!/usr/bin/env node
/**
 * CAE-11.7-W10 — Human Partnership Runtime validation
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
  "docs/phase-11/11.7-living-intelligence/10_AI_HUMAN_PARTNERSHIP_RUNTIME.md",
  "docs/phase-11/11.7-living-intelligence/PARTNERSHIP_CONSTITUTION.md",
  "docs/phase-11/11.7-living-intelligence/WAVE_10_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.7/living/partnership/constitution.ts",
  "src/lib/civic-action/builds/11.7/living/partnership/services/partnership-service.ts",
  "src/app/api/v1/localbrain/partnership/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const constitution = readFileSync(
  join(root, "src/lib/civic-action/builds/11.7/living/partnership/constitution.ts"),
  "utf8"
);
if (!constitution.includes("LIX_PARTNERSHIP_PRINCIPLE")) fail("constitution missing principle");

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w10 = reqs.requirements.filter((r) => r.build === "11.7-lix" && r.wave === "W10");
if (w10.length < 25) fail(`expected 25+ W10 requirements, got ${w10.length}`);

const w9Run = spawnSync("node", [join(root, "scripts/phase11/11.7-living-w9.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (w9Run.status !== 0) fail("W9 Multi-Agent prerequisite failed");

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w10-tests-11.7-living.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W10 partnership tests failed");

if (failed) process.exit(1);
console.log("CAE-11.7-W10 Human Partnership Runtime checks passed");
