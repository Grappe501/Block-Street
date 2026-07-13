#!/usr/bin/env node
/**
 * CAE-11.7-W3 — Communications domain services validation
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
  "docs/phase-11/11.7-communications/03_DOMAIN_SERVICES_PROTOCOL.md",
  "docs/phase-11/11.7-communications/COMMUNICATION_DOMAIN_SERVICES.md",
  "docs/phase-11/11.7-communications/CONVERSATION_ENGINE.md",
  "docs/phase-11/11.7-communications/MESSAGE_ENGINE.md",
  "docs/phase-11/11.7-communications/DECISION_ENGINE.md",
  "docs/phase-11/11.7-communications/MEETING_ENGINE.md",
  "docs/phase-11/11.7-communications/DOCUMENT_COLLABORATION_ENGINE.md",
  "docs/phase-11/11.7-communications/KNOWLEDGE_CAPTURE_ENGINE.md",
  "docs/phase-11/11.7-communications/COMMUNICATION_POLICY_ENGINE.md",
  "docs/phase-11/11.7-communications/COMMUNICATION_STATE_MACHINE.md",
  "docs/phase-11/11.7-communications/COMMUNICATION_VALIDATION_PIPELINE.md",
  "docs/phase-11/11.7-communications/PROTOCOL_3_CERTIFICATION.md",
];

for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.7/services/communications-engine.ts",
  "src/lib/civic-action/builds/11.7/services/commands.ts",
  "src/lib/civic-action/builds/11.7/services/validation-pipeline.ts",
  "src/lib/civic-action/builds/11.7/services/events.ts",
  "src/lib/civic-action/builds/11.7/services/repository.ts",
  "src/lib/civic-action/builds/11.7/services/policy.ts",
  "src/lib/civic-action/builds/11.7/services/version-audit.ts",
  "src/lib/civic-action/builds/11.7/services/domain-registry.ts",
  "src/lib/civic-action/builds/11.7/services/mission-sync.ts",
  "src/lib/civic-action/builds/11.7/w3.ts",
  "src/lib/civic-action/builds/11.7/w3-tests.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w3 = reqs.requirements.filter((r) => r.build === "11.7" && r.wave === "W3");
if (w3.length < 40) fail(`expected 40+ W3 requirements, got ${w3.length}`);
const implemented = w3.filter((r) => r.status === "implemented");
if (implemented.length < 40) fail(`expected 40 implemented W3 requirements, got ${implemented.length}`);

const engine = readFileSync(join(root, "src/lib/civic-action/builds/11.7/services/communications-engine.ts"), "utf8");
for (const sym of [
  "createConversation",
  "postMessage",
  "recordDecision",
  "generateAISummary",
  "assertCommunicationMutationViaService",
]) {
  if (!engine.includes(sym)) fail(`communications-engine missing ${sym}`);
}

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w3-tests-11.7.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (testRun.status !== 0) fail("W3 service tests failed");

if (failed) process.exit(1);
console.log("CAE-11.7-W3 Communications domain services checks passed");
