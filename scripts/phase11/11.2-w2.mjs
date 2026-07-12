#!/usr/bin/env node
/**
 * CAE-11.2-W2 — Objective Canonical Data Model Protocol validation
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
  "docs/phase-11/11.2-objectives/02_CANONICAL_MODEL_PROTOCOL.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_CANONICAL_MODEL.md",
  "docs/phase-11/11.2-objectives/MISSION_CANONICAL_MODEL.md",
  "docs/phase-11/11.2-objectives/TASK_CANONICAL_MODEL.md",
  "docs/phase-11/11.2-objectives/EVIDENCE_MODEL.md",
  "docs/phase-11/11.2-objectives/OUTCOME_MODEL.md",
  "docs/phase-11/11.2-objectives/EXECUTION_RELATIONSHIP_MATRIX.md",
  "docs/phase-11/11.2-objectives/OBJECT_VERSIONING_STANDARD.md",
  "docs/phase-11/11.2-objectives/OBJECT_PERMISSION_STANDARD.md",
  "docs/phase-11/11.2-objectives/OBJECT_EVENT_STANDARD.md",
  "docs/phase-11/11.2-objectives/TRACEABILITY_STANDARD.md",
  "docs/phase-11/11.2-objectives/PROTOCOL_2_CERTIFICATION.md",
  "docs/phase-11/PROTOCOL_ARCHITECTURE.md",
];

for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const contracts = [
  "data/phase-11/objective_database_contract.json",
  "data/phase-11/objective_entity_schema.json",
  "data/phase-11/objective_state_machines.json",
  "data/phase-11/objective_event_catalog.json",
  "data/phase-11/objective_relationship_matrix.json",
];
for (const f of contracts) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.2/data-model.ts",
  "src/lib/civic-action/builds/11.2/entity-registry.ts",
  "src/lib/civic-action/builds/11.2/state-machines.ts",
  "src/lib/civic-action/builds/11.2/versioning.ts",
  "src/lib/civic-action/builds/11.2/data-validation.ts",
  "src/lib/civic-action/builds/11.2/traceability.ts",
  "src/lib/civic-action/builds/11.2/w2.ts",
  "src/lib/civic-action/builds/11.2/w2-tests.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const db = JSON.parse(readFileSync(join(root, "data/phase-11/objective_database_contract.json"), "utf8"));
if ((db.tables?.length ?? 0) < 14) fail(`expected 14+ tables, got ${db.tables?.length ?? 0}`);

const sm = JSON.parse(readFileSync(join(root, "data/phase-11/objective_state_machines.json"), "utf8"));
if (Object.keys(sm.entities ?? {}).length < 3) fail("expected Objective, Mission, Task state machines");
if ((sm.illegal_child_parent?.length ?? 0) < 3) fail("parent-child lifecycle constraints required");

const events = JSON.parse(readFileSync(join(root, "data/phase-11/objective_event_catalog.json"), "utf8"));
if ((events.events?.length ?? 0) < 10) fail("event catalog too small");

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w2 = reqs.requirements.filter((r) => r.build === "11.2" && r.wave === "W2");
if (w2.length < 22) fail(`expected 22+ W2 requirements, got ${w2.length}`);
if (!w2.every((r) => r.status === "documented")) fail("W2 requirements must be documented");

const dm = readFileSync(join(root, "src/lib/civic-action/builds/11.2/data-model.ts"), "utf8");
for (const sym of [
  "ObjectiveRecord",
  "MissionRecord",
  "TaskRecord",
  "EvidenceRecord",
  "OutcomeRecord",
  "EXECUTION_STORE_KEYS",
  "ExecutionVersionRecord",
]) {
  if (!dm.includes(sym)) fail(`data-model missing ${sym}`);
}

const registry = readFileSync(join(root, "src/lib/civic-action/builds/11.2/entity-registry.ts"), "utf8");
if (!registry.includes("CANONICAL_EXECUTION_ENTITIES")) fail("entity registry missing");
if ((registry.match(/"Objective"/g) ?? []).length < 1) fail("Objective entity missing");

const val = readFileSync(join(root, "src/lib/civic-action/builds/11.2/data-validation.ts"), "utf8");
if (!val.includes("OBJ-V-021")) fail("orphan task validation code missing");

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w2-tests.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (testRun.status !== 0) fail("W2 model tests failed");

if (failed) process.exit(1);
console.log("CAE-11.2-W2 Objective Canonical Data Model Protocol checks passed");
