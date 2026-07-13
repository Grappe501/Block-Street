#!/usr/bin/env node
/**
 * CAE-11.7-W5 — Research Network validation
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
  "docs/phase-11/11.7-living-intelligence/05_AI_RESEARCH_NETWORK_RUNTIME.md",
  "docs/phase-11/11.7-living-intelligence/RESEARCH_CONSTITUTION.md",
  "docs/phase-11/11.7-living-intelligence/WAVE_5_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.7/living/research/constitution.ts",
  "src/lib/civic-action/builds/11.7/living/research/services/research-network-service.ts",
  "src/app/api/v1/localbrain/research/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const constitution = readFileSync(
  join(root, "src/lib/civic-action/builds/11.7/living/research/constitution.ts"),
  "utf8"
);
if (!constitution.includes("LIX_RESEARCH_PRINCIPLE")) fail("constitution missing principle");

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w5 = reqs.requirements.filter((r) => r.build === "11.7-lix" && r.wave === "W5");
if (w5.length < 25) fail(`expected 25+ W5 requirements, got ${w5.length}`);

const w4Run = spawnSync("node", [join(root, "scripts/phase11/11.7-living-w4.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (w4Run.status !== 0) fail("W4 Organizer prerequisite failed");

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w5-tests-11.7-living.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W5 research tests failed");

if (failed) process.exit(1);
console.log("CAE-11.7-W5 Research Network checks passed");
