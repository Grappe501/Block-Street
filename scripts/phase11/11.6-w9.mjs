#!/usr/bin/env node
/**
 * CAE-11.6-W9 — Workflow validation
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
  "docs/phase-11/11.6-institutional-operations/09_WORKFLOW_AUTOMATION_PROTOCOL.md",
  "docs/phase-11/11.6-institutional-operations/WORKFLOW_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/WORKFLOW_EXECUTION.md",
  "docs/phase-11/11.6-institutional-operations/APPROVAL_GATES.md",
  "docs/phase-11/11.6-institutional-operations/AUTOMATION_TEMPLATES.md",
  "docs/phase-11/11.6-institutional-operations/WAVE_9_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.6/workflows/constitution.ts",
  "src/lib/civic-action/builds/11.6/workflows/w9.ts",
  "src/lib/civic-action/builds/11.6/workflows/services/workflow-service.ts",
  "src/app/api/v1/workflows/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const constitution = readFileSync(join(root, "src/lib/civic-action/builds/11.6/workflows/constitution.ts"), "utf8");
for (const term of ["OPS_WORKFLOW_PRINCIPLE", "AUTOMATION_ARCHITECTURE", "REQUIRED_WORKFLOW_SERVICES", "WORKFLOW_AI_MAY_NOT"]) {
  if (!constitution.includes(term)) fail(`constitution missing ${term}`);
}

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w9 = reqs.requirements.filter((r) => r.build === "11.6" && r.wave === "W9");
if (w9.length < 30) fail(`expected 30+ W9 requirements, got ${w9.length}`);

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w9-tests-11.6.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W9 workflow tests failed");

if (failed) process.exit(1);
console.log("CAE-11.6-W9 Workflow checks passed");
