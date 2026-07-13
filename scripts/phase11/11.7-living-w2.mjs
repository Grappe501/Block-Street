#!/usr/bin/env node
/**
 * CAE-11.7-W2 — Context Intelligence validation
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
  "docs/phase-11/11.7-living-intelligence/02_CONTEXT_INTELLIGENCE_RUNTIME.md",
  "docs/phase-11/11.7-living-intelligence/CONTEXT_CONSTITUTION.md",
  "docs/phase-11/11.7-living-intelligence/ACTIVE_CONTEXT_MODEL.md",
  "docs/phase-11/11.7-living-intelligence/WAVE_2_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.7/living/context/constitution.ts",
  "src/lib/civic-action/builds/11.7/living/context/w2.ts",
  "src/lib/civic-action/builds/11.7/living/context/services/context-intelligence-service.ts",
  "src/app/api/v1/localbrain/context/active/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const constitution = readFileSync(join(root, "src/lib/civic-action/builds/11.7/living/context/constitution.ts"), "utf8");
for (const term of ["LIX_CONTEXT_PRINCIPLE", "CONTEXT_ARCHITECTURE", "REQUIRED_CONTEXT_SERVICES", "CONTEXT_AI_MAY_NOT"]) {
  if (!constitution.includes(term)) fail(`constitution missing ${term}`);
}

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w2 = reqs.requirements.filter((r) => r.build === "11.7-lix" && r.wave === "W2");
if (w2.length < 30) fail(`expected 30+ W2 requirements, got ${w2.length}`);

const w1Run = spawnSync("node", [join(root, "scripts/phase11/11.7-living-w1.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (w1Run.status !== 0) fail("W1 LocalBrain prerequisite failed");

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w2-tests-11.7-living.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W2 context tests failed");

if (failed) process.exit(1);
console.log("CAE-11.7-W2 Context Intelligence checks passed");
