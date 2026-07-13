#!/usr/bin/env node
/**
 * CAE-11.7-W4 — Communications Human Experience validation
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { spawnSync } from "child_process";

const root = process.cwd();
let failed = 0;

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  failed++;
}

const docs = [
  "docs/phase-11/11.7-communications/04_HUMAN_EXPERIENCE_PROTOCOL.md",
  "docs/phase-11/11.7-communications/COMMUNICATION_WORKBENCH_PROTOCOL.md",
  "docs/phase-11/11.7-communications/MISSION_CONVERSATION_STANDARD.md",
  "docs/phase-11/11.7-communications/MEETING_WORKSPACE_STANDARD.md",
  "docs/phase-11/11.7-communications/DOCUMENT_COLLABORATION_STANDARD.md",
  "docs/phase-11/11.7-communications/DAILY_BRIEF_STANDARD.md",
  "docs/phase-11/11.7-communications/KNOWLEDGE_EXPLORER_STANDARD.md",
  "docs/phase-11/11.7-communications/COMMUNICATION_MOBILE_STANDARD.md",
  "docs/phase-11/11.7-communications/COMMUNICATION_ACCESSIBILITY_STANDARD.md",
  "docs/phase-11/11.7-communications/COMMUNICATION_SPANISH_STANDARD.md",
  "docs/phase-11/11.7-communications/COMMUNICATION_OFFLINE_STANDARD.md",
  "docs/phase-11/11.7-communications/PROTOCOL_4_CERTIFICATION.md",
];

for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.7/ux/assemble-home.ts",
  "src/lib/civic-action/builds/11.7/ux/assemble-workbench-shell.ts",
  "src/lib/civic-action/builds/11.7/w4.ts",
  "src/lib/civic-action/builds/11.7/w4-tests.ts",
  "src/lib/civic-action/builds/11.7/application-service.ts",
  "src/features/communications/components/CollaborationWorkbenchShell.tsx",
  "src/app/(site)/communications/page.tsx",
  "src/app/api/v1/civic-action/communications/commands/route.ts",
];

for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w4 = reqs.requirements.filter((r) => r.build === "11.7" && r.wave === "W4");
if (w4.length < 20) fail(`expected 20+ W4 requirements, got ${w4.length}`);
const implemented = w4.filter((r) => r.status === "implemented");
if (implemented.length < 20) fail(`expected 20 implemented W4 requirements, got ${implemented.length}`);

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w4-tests-11.7.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (testRun.status !== 0) fail("W4 experience tests failed");

if (failed) process.exit(1);
console.log("CAE-11.7-W4 Communications Human Experience checks passed");
