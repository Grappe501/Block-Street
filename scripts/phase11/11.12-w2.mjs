#!/usr/bin/env node
/**
 * CAE-11.12-W2 — Knowledge Canonical Data Model Protocol validation
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
  "docs/phase-11/11.12-adaptive-learning/02_CANONICAL_MODEL_PROTOCOL.md",
  "docs/phase-11/11.12-adaptive-learning/KNOWLEDGE_ENTITY_REGISTRY.md",
  "docs/phase-11/11.12-adaptive-learning/KNOWLEDGE_ARTIFACT_MODEL.md",
  "docs/phase-11/11.12-adaptive-learning/CLAIM_SOURCE_CITATION_MODEL.md",
  "docs/phase-11/11.12-adaptive-learning/KNOWLEDGE_VERSIONING_STANDARD.md",
  "docs/phase-11/11.12-adaptive-learning/COURSE_AND_LEARNING_OBJECT_MODEL.md",
  "docs/phase-11/11.12-adaptive-learning/SKILL_AND_COMPETENCY_MODEL.md",
  "docs/phase-11/11.12-adaptive-learning/ASSESSMENT_MODEL.md",
  "docs/phase-11/11.12-adaptive-learning/CERTIFICATION_MODEL.md",
  "docs/phase-11/11.12-adaptive-learning/KNOWLEDGE_EVENT_STANDARD.md",
  "docs/phase-11/11.12-adaptive-learning/KNOWLEDGE_OVERLAP_AUDIT.md",
  "docs/phase-11/11.12-adaptive-learning/PROTOCOL_2_CERTIFICATION.md",
  "docs/phase-11/11.12-adaptive-learning/WAVE_2_VALIDATION_PLAN.md",
  "docs/phase-11/PROTOCOL_ARCHITECTURE.md",
];

for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const contracts = [
  "data/phase-11/knowledge_database_contract.json",
  "data/phase-11/knowledge_entity_schema.json",
  "data/phase-11/knowledge_state_machines.json",
  "data/phase-11/knowledge_event_catalog.json",
  "data/phase-11/knowledge_relationship_matrix.json",
];
for (const f of contracts) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.12/data-model.ts",
  "src/lib/civic-action/builds/11.12/entity-registry.ts",
  "src/lib/civic-action/builds/11.12/state-machines.ts",
  "src/lib/civic-action/builds/11.12/versioning.ts",
  "src/lib/civic-action/builds/11.12/data-validation.ts",
  "src/lib/civic-action/builds/11.12/traceability.ts",
  "src/lib/civic-action/builds/11.12/contracts.ts",
  "src/lib/civic-action/builds/11.12/w2.ts",
  "src/lib/civic-action/builds/11.12/w2-tests.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const db = JSON.parse(readFileSync(join(root, "data/phase-11/knowledge_database_contract.json"), "utf8"));
if ((db.tables?.length ?? 0) < 30) fail(`expected 30+ tables, got ${db.tables?.length ?? 0}`);

const sm = JSON.parse(readFileSync(join(root, "data/phase-11/knowledge_state_machines.json"), "utf8"));
if (Object.keys(sm.entities ?? {}).length < 5) fail("expected Artifact, Course, Certification, Competency, Claim state machines");
if ((sm.illegal_child_parent?.length ?? 0) < 3) fail("parent-child lifecycle constraints required");

const events = JSON.parse(readFileSync(join(root, "data/phase-11/knowledge_event_catalog.json"), "utf8"));
if ((events.events?.length ?? 0) < 15) fail("event catalog too small");

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w2 = reqs.requirements.filter((r) => r.build === "11.12" && r.wave === "W2");
if (w2.length < 24) fail(`expected 24+ W2 requirements, got ${w2.length}`);
if (!w2.every((r) => r.status === "documented")) fail("W2 requirements must be documented");

const dm = readFileSync(join(root, "src/lib/civic-action/builds/11.12/data-model.ts"), "utf8");
for (const sym of [
  "KnowledgeArtifactRecord",
  "KnowledgeClaimRecord",
  "CourseRecord",
  "CertificationRecord",
  "KNOWLEDGE_STORE_KEYS",
  "KnowledgeVersionRecord",
  "CitationRecord",
  "LearningCompletionRecord",
]) {
  if (!dm.includes(sym)) fail(`data-model missing ${sym}`);
}

const registry = readFileSync(join(root, "src/lib/civic-action/builds/11.12/entity-registry.ts"), "utf8");
if (!registry.includes("CANONICAL_KNOWLEDGE_ENTITIES")) fail("entity registry missing");
if (!registry.includes("COM_002_BOUNDARY_ENTITIES")) fail("COM-002 boundary missing");

const val = readFileSync(join(root, "src/lib/civic-action/builds/11.12/data-validation.ts"), "utf8");
if (!val.includes("KNW-V-021")) fail("orphan citation validation code missing");

const overlap = readFileSync(join(root, "docs/phase-11/11.12-adaptive-learning/KNOWLEDGE_OVERLAP_AUDIT.md"), "utf8");
if (!overlap.includes("COM-002")) fail("overlap audit must document COM-002 boundary");

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w2-tests-11.12.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (testRun.status !== 0) fail("W2 model tests failed");

if (failed) process.exit(1);
console.log("CAE-11.12-W2 Knowledge Canonical Data Model Protocol checks passed");
