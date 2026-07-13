#!/usr/bin/env node
/**
 * CAE-11.6-W7 — Communications validation
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
  "docs/phase-11/11.6-institutional-operations/07_COMMUNICATIONS_PROTOCOL.md",
  "docs/phase-11/11.6-institutional-operations/COMMUNICATIONS_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/CONVERSATION_MODEL.md",
  "docs/phase-11/11.6-institutional-operations/DECISION_LEDGER.md",
  "docs/phase-11/11.6-institutional-operations/MEETING_WORKSPACE.md",
  "docs/phase-11/11.6-institutional-operations/WAVE_7_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.6/communications/constitution.ts",
  "src/lib/civic-action/builds/11.6/communications/w7.ts",
  "src/lib/civic-action/builds/11.6/communications/services/communications-service.ts",
  "src/app/api/v1/conversations/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const constitution = readFileSync(join(root, "src/lib/civic-action/builds/11.6/communications/constitution.ts"), "utf8");
for (const term of ["OPS_COMMUNICATIONS_PRINCIPLE", "COMMUNICATION_ARCHITECTURE", "REQUIRED_COMMUNICATIONS_SERVICES", "COMMUNICATIONS_AI_MAY_NOT"]) {
  if (!constitution.includes(term)) fail(`constitution missing ${term}`);
}

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w7 = reqs.requirements.filter((r) => r.build === "11.6" && r.wave === "W7");
if (w7.length < 30) fail(`expected 30+ W7 requirements, got ${w7.length}`);

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w7-tests-11.6.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W7 communications tests failed");

if (failed) process.exit(1);
console.log("CAE-11.6-W7 Communications checks passed");
