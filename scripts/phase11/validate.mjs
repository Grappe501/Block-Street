#!/usr/bin/env node
/**
 * Phase 11 scaffold validation — CAE-SCAFFOLD-001
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";

const root = process.cwd();
let failed = 0;

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  failed++;
}

const required = [
  "data/civic-action/scaffold.json",
  "data/civic-action/requirements_registry.json",
  "data/phase-11/initiative_vocabulary.json",
  "data/phase-11/initiative_types.json",
  "docs/phase-11/PHASE_11_MASTER_SCAFFOLD.md",
  "docs/phase-11/PHASE_11_TRACEABILITY_MATRIX.md",
  "docs/phase-11/11.1-initiatives/01_CONSTITUTION.md",
  "src/lib/civic-action/scaffold/ledger.ts",
  "src/lib/civic-action/builds/11.1/constitution.ts",
  "docs/phase-11/11.1-initiatives/02_DATA_MODEL.md",
  "data/phase-11/initiative_database_contract.json",
  "data/phase-11/initiative_state_machine.json",
  "src/lib/civic-action/builds/11.1/data-model.ts",
  "src/app/api/v1/civic-action/scaffold/route.ts",
];

for (const f of required) {
  if (!existsSync(join(root, f))) fail(`missing ${f}`);
}

const scaffold = JSON.parse(readFileSync(join(root, "data/civic-action/scaffold.json"), "utf8"));
if (scaffold.scaffold_id !== "CAE-SCAFFOLD-001") fail("scaffold_id mismatch");
if (scaffold.total_planned_waves !== 128) fail("expected 128 waves");
if (!scaffold.builds["11.1"]) fail("missing build 11.1");

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w1 = reqs.requirements.filter((r) => r.build === "11.1" && r.wave === "W1");
if (w1.length !== 44) fail(`expected 44 W1 requirements, got ${w1.length}`);
if (!w1.every((r) => r.status === "documented")) fail("W1 requirements must be documented");

if (failed) process.exit(1);
console.log("Phase 11 scaffold validation passed");
