#!/usr/bin/env node
/**
 * CAE-11.7-W1 — LocalBrain validation
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
  "docs/phase-11/11.7-living-intelligence/01_LOCALBRAIN_ARCHITECTURE_PROTOCOL.md",
  "docs/phase-11/11.7-living-intelligence/LOCALBRAIN_VOCABULARY.md",
  "docs/phase-11/11.7-living-intelligence/MEMORY_ARCHITECTURE.md",
  "docs/phase-11/11.7-living-intelligence/CONTEXT_RUNTIME.md",
  "docs/phase-11/11.7-living-intelligence/WAVE_1_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.7/living/localbrain/constitution.ts",
  "src/lib/civic-action/builds/11.7/living/localbrain/w1.ts",
  "src/lib/civic-action/builds/11.7/living/localbrain/services/localbrain-service.ts",
  "src/app/api/v1/localbrain/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const constitution = readFileSync(join(root, "src/lib/civic-action/builds/11.7/living/localbrain/constitution.ts"), "utf8");
for (const term of ["LIX_LOCALBRAIN_PRINCIPLE", "LOCALBRAIN_ARCHITECTURE", "REQUIRED_LOCALBRAIN_SERVICES", "LOCALBRAIN_AI_MAY_NOT"]) {
  if (!constitution.includes(term)) fail(`constitution missing ${term}`);
}

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w1 = reqs.requirements.filter((r) => r.build === "11.7-lix" && r.wave === "W1");
if (w1.length < 30) fail(`expected 30+ W1 requirements, got ${w1.length}`);

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w1-tests-11.7-living.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W1 LocalBrain tests failed");

if (failed) process.exit(1);
console.log("CAE-11.7-W1 LocalBrain checks passed");
