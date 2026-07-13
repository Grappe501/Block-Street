#!/usr/bin/env node
/**
 * CAE-11.7-W3 — Executive Assistant validation
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
  "docs/phase-11/11.7-living-intelligence/03_AI_EXECUTIVE_ASSISTANT_RUNTIME.md",
  "docs/phase-11/11.7-living-intelligence/EXECUTIVE_ASSISTANT_CONSTITUTION.md",
  "docs/phase-11/11.7-living-intelligence/WAVE_3_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.7/living/executive-assistant/constitution.ts",
  "src/lib/civic-action/builds/11.7/living/executive-assistant/w3.ts",
  "src/lib/civic-action/builds/11.7/living/executive-assistant/services/executive-assistant-service.ts",
  "src/app/api/v1/localbrain/executive-assistant/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const constitution = readFileSync(
  join(root, "src/lib/civic-action/builds/11.7/living/executive-assistant/constitution.ts"),
  "utf8"
);
for (const term of ["LIX_EXECUTIVE_PRINCIPLE", "EXECUTIVE_ARCHITECTURE", "REQUIRED_EXECUTIVE_SERVICES", "EXECUTIVE_AI_MAY_NOT"]) {
  if (!constitution.includes(term)) fail(`constitution missing ${term}`);
}

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w3 = reqs.requirements.filter((r) => r.build === "11.7-lix" && r.wave === "W3");
if (w3.length < 30) fail(`expected 30+ W3 requirements, got ${w3.length}`);

const w2Run = spawnSync("node", [join(root, "scripts/phase11/11.7-living-w2.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (w2Run.status !== 0) fail("W2 Context prerequisite failed");

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w3-tests-11.7-living.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W3 executive tests failed");

if (failed) process.exit(1);
console.log("CAE-11.7-W3 Executive Assistant checks passed");
