#!/usr/bin/env node
/**
 * CAE-11.6-W8 — Executive validation
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
  "docs/phase-11/11.6-institutional-operations/08_EXECUTIVE_COMMAND_PROTOCOL.md",
  "docs/phase-11/11.6-institutional-operations/EXECUTIVE_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/EXECUTIVE_BRIEFING.md",
  "docs/phase-11/11.6-institutional-operations/DECISION_WORKSPACE.md",
  "docs/phase-11/11.6-institutional-operations/WAR_ROOM_MODEL.md",
  "docs/phase-11/11.6-institutional-operations/WAVE_8_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.6/executive/constitution.ts",
  "src/lib/civic-action/builds/11.6/executive/w8.ts",
  "src/lib/civic-action/builds/11.6/executive/services/executive-service.ts",
  "src/app/api/v1/executive/dashboard/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const constitution = readFileSync(join(root, "src/lib/civic-action/builds/11.6/executive/constitution.ts"), "utf8");
for (const term of ["OPS_EXECUTIVE_PRINCIPLE", "EXECUTIVE_ARCHITECTURE", "REQUIRED_EXECUTIVE_SERVICES", "EXECUTIVE_AI_MAY_NOT"]) {
  if (!constitution.includes(term)) fail(`constitution missing ${term}`);
}

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w8 = reqs.requirements.filter((r) => r.build === "11.6" && r.wave === "W8");
if (w8.length < 30) fail(`expected 30+ W8 requirements, got ${w8.length}`);

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w8-tests-11.6.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W8 executive tests failed");

if (failed) process.exit(1);
console.log("CAE-11.6-W8 Executive checks passed");
