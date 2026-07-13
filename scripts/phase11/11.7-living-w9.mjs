#!/usr/bin/env node
/**
 * CAE-11.7-W9 — Multi-Agent Runtime validation
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
  "docs/phase-11/11.7-living-intelligence/09_AI_MULTI_AGENT_RUNTIME.md",
  "docs/phase-11/11.7-living-intelligence/AGENT_CONSTITUTION.md",
  "docs/phase-11/11.7-living-intelligence/WAVE_9_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.7/living/agents/constitution.ts",
  "src/lib/civic-action/builds/11.7/living/agents/services/agent-service.ts",
  "src/app/api/v1/localbrain/agents/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const constitution = readFileSync(
  join(root, "src/lib/civic-action/builds/11.7/living/agents/constitution.ts"),
  "utf8"
);
if (!constitution.includes("LIX_AGENT_PRINCIPLE")) fail("constitution missing principle");

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w9 = reqs.requirements.filter((r) => r.build === "11.7-lix" && r.wave === "W9");
if (w9.length < 25) fail(`expected 25+ W9 requirements, got ${w9.length}`);

const w8Run = spawnSync("node", [join(root, "scripts/phase11/11.7-living-w8.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (w8Run.status !== 0) fail("W8 Prediction prerequisite failed");

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w9-tests-11.7-living.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W9 agent tests failed");

if (failed) process.exit(1);
console.log("CAE-11.7-W9 Multi-Agent Runtime checks passed");
