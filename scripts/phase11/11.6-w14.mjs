#!/usr/bin/env node
/**
 * CAE-11.6-W14 — Experience validation
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
  "docs/phase-11/11.6-institutional-operations/14_HUMAN_EXPERIENCE_PROTOCOL.md",
  "docs/phase-11/11.6-institutional-operations/EXPERIENCE_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/WORKSPACE_ENGINE.md",
  "docs/phase-11/11.6-institutional-operations/ADAPTIVE_DASHBOARD.md",
  "docs/phase-11/11.6-institutional-operations/UNIVERSAL_SEARCH.md",
  "docs/phase-11/11.6-institutional-operations/WAVE_14_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.6/experience/constitution.ts",
  "src/lib/civic-action/builds/11.6/experience/w14.ts",
  "src/lib/civic-action/builds/11.6/experience/services/experience-service.ts",
  "src/app/api/v1/workspace/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const constitution = readFileSync(join(root, "src/lib/civic-action/builds/11.6/experience/constitution.ts"), "utf8");
for (const term of ["OPS_EXPERIENCE_PRINCIPLE", "EXPERIENCE_ARCHITECTURE", "REQUIRED_EXPERIENCE_SERVICES", "EXPERIENCE_AI_MAY_NOT"]) {
  if (!constitution.includes(term)) fail(`constitution missing ${term}`);
}

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w14 = reqs.requirements.filter((r) => r.build === "11.6" && r.wave === "W14");
if (w14.length < 30) fail(`expected 30+ W14 requirements, got ${w14.length}`);

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w14-tests-11.6.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W14 experience tests failed");

if (failed) process.exit(1);
console.log("CAE-11.6-W14 Experience checks passed");
