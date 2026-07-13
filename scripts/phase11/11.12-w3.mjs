#!/usr/bin/env node
/**
 * CAE-11.12-W3 — Knowledge domain services validation
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
  "docs/phase-11/11.12-adaptive-learning/03_DOMAIN_SERVICES.md",
  "docs/phase-11/11.12-adaptive-learning/KNOWLEDGE_COMMAND_STANDARD.md",
  "docs/phase-11/11.12-adaptive-learning/KNOWLEDGE_DOMAIN_ERROR_STANDARD.md",
  "docs/phase-11/11.12-adaptive-learning/KNOWLEDGE_LIFECYCLE_ENGINE.md",
  "docs/phase-11/11.12-adaptive-learning/CLAIM_EVIDENCE_SERVICES.md",
  "docs/phase-11/11.12-adaptive-learning/LEARNING_PROGRAM_AND_COURSE_SERVICES.md",
  "docs/phase-11/11.12-adaptive-learning/CERTIFICATION_SERVICES.md",
  "docs/phase-11/11.12-adaptive-learning/TRANSLATION_AND_AI_TUTOR_SERVICES.md",
  "docs/phase-11/11.12-adaptive-learning/KNOWLEDGE_EVENT_AND_OUTBOX_STANDARD.md",
  "docs/phase-11/11.12-adaptive-learning/KNOWLEDGE_SERVICE_OVERLAP_AUDIT.md",
  "docs/phase-11/11.12-adaptive-learning/PROTOCOL_3_CERTIFICATION.md",
  "docs/phase-11/11.12-adaptive-learning/WAVE_3_TEST_PLAN.md",
  "docs/phase-11/11.12-adaptive-learning/WAVE_4_HANDOFF.md",
];

for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.12/services/knowledge-engine.ts",
  "src/lib/civic-action/builds/11.12/services/commands.ts",
  "src/lib/civic-action/builds/11.12/services/validation-pipeline.ts",
  "src/lib/civic-action/builds/11.12/services/events.ts",
  "src/lib/civic-action/builds/11.12/services/repository.ts",
  "src/lib/civic-action/builds/11.12/services/policy.ts",
  "src/lib/civic-action/builds/11.12/services/version-audit.ts",
  "src/lib/civic-action/builds/11.12/services/domain-registry.ts",
  "src/lib/civic-action/builds/11.12/w3.ts",
  "src/lib/civic-action/builds/11.12/w3-tests.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

if (!existsSync(join(root, "data/phase-11/knowledge_command_catalog.json"))) {
  fail("missing knowledge_command_catalog.json");
}

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w3 = reqs.requirements.filter((r) => r.build === "11.12" && r.wave === "W3");
if (w3.length < 42) fail(`expected 42+ W3 requirements, got ${w3.length}`);
const implemented = w3.filter((r) => r.status === "implemented");
if (implemented.length < 42) fail(`expected 42 implemented W3 requirements, got ${implemented.length}`);

const engine = readFileSync(join(root, "src/lib/civic-action/builds/11.12/services/knowledge-engine.ts"), "utf8");
for (const sym of [
  "createKnowledgeArtifact",
  "publishArtifact",
  "verifyCompetency",
  "createAISuggestion",
  "assertKnowledgeMutationViaService",
]) {
  if (!engine.includes(sym)) fail(`knowledge-engine missing ${sym}`);
}

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w3-tests-11.12.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (testRun.status !== 0) fail("W3 service tests failed");

if (failed) process.exit(1);
console.log("CAE-11.12-W3 Knowledge domain services checks passed");
