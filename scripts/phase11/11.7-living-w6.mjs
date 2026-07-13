#!/usr/bin/env node
/**
 * CAE-11.7-W6 — Conversation Intelligence validation
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
  "docs/phase-11/11.7-living-intelligence/06_AI_CONVERSATION_INTELLIGENCE_RUNTIME.md",
  "docs/phase-11/11.7-living-intelligence/CONVERSATION_CONSTITUTION.md",
  "docs/phase-11/11.7-living-intelligence/WAVE_6_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.7/living/conversation/constitution.ts",
  "src/lib/civic-action/builds/11.7/living/conversation/services/conversation-service.ts",
  "src/app/api/v1/localbrain/conversations/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const constitution = readFileSync(
  join(root, "src/lib/civic-action/builds/11.7/living/conversation/constitution.ts"),
  "utf8"
);
if (!constitution.includes("LIX_CONVERSATION_PRINCIPLE")) fail("constitution missing principle");

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w6 = reqs.requirements.filter((r) => r.build === "11.7-lix" && r.wave === "W6");
if (w6.length < 25) fail(`expected 25+ W6 requirements, got ${w6.length}`);

const w5Run = spawnSync("node", [join(root, "scripts/phase11/11.7-living-w5.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (w5Run.status !== 0) fail("W5 Research prerequisite failed");

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w6-tests-11.7-living.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W6 conversation tests failed");

if (failed) process.exit(1);
console.log("CAE-11.7-W6 Conversation Intelligence checks passed");
