#!/usr/bin/env node
/**
 * CAE-11.1-W2 — Initiative canonical data model validation
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";

const root = process.cwd();
let failed = 0;

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  failed++;
}

const docs = [
  "docs/phase-11/11.1-initiatives/02_DATA_MODEL.md",
  "docs/phase-11/11.1-initiatives/ENTITY_RELATIONSHIP_MODEL.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_DATABASE_CONTRACT.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_STATE_MACHINE.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_VERSIONING.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_AUDIT_MODEL.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_DEPENDENCY_MODEL.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_RETENTION_POLICY.md",
];

for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const contracts = [
  "data/phase-11/initiative_database_contract.json",
  "data/phase-11/initiative_state_machine.json",
  "data/phase-11/initiative_entity_schema.json",
];
for (const f of contracts) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.1/data-model.ts",
  "src/lib/civic-action/builds/11.1/state-machine.ts",
  "src/lib/civic-action/builds/11.1/versioning.ts",
  "src/lib/civic-action/builds/11.1/data-validation.ts",
  "src/lib/civic-action/builds/11.1/legacy-adapter.ts",
  "src/lib/civic-action/builds/11.1/w2.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const db = JSON.parse(readFileSync(join(root, "data/phase-11/initiative_database_contract.json"), "utf8"));
if ((db.tables?.length ?? 0) < 10) fail("expected 10 tables");

const sm = JSON.parse(readFileSync(join(root, "data/phase-11/initiative_state_machine.json"), "utf8"));
if ((sm.states?.length ?? 0) < 13) fail("expected 13+ lifecycle states");
if (!sm.illegal_transitions?.length) fail("illegal transitions required");

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w2 = reqs.requirements.filter((r) => r.build === "11.1" && r.wave === "W2");
if (w2.length < 22) fail(`expected 22 W2 requirements, got ${w2.length}`);
if (!w2.every((r) => r.status === "documented")) fail("W2 requirements must be documented");

const dm = readFileSync(join(root, "src/lib/civic-action/builds/11.1/data-model.ts"), "utf8");
for (const sym of ["InitiativeRecord", "InitiativeCharterRecord", "InitiativeHistoryEvent", "INITIATIVE_STORE_KEYS"]) {
  if (!dm.includes(sym)) fail(`data-model missing ${sym}`);
}

const val = readFileSync(join(root, "src/lib/civic-action/builds/11.1/data-validation.ts"), "utf8");
if (!val.includes("detectCircularDependencies")) fail("circular dependency validation missing");

if (failed) process.exit(1);
console.log("CAE-11.1-W2 Initiative data model checks passed");
