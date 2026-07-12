#!/usr/bin/env node
/**
 * Phase 11 traceability — honest status by wave
 */
import { readFileSync } from "fs";
import { join } from "path";

const root = process.cwd();
let failed = 0;

const matrixPath = join(root, "docs/phase-11/PHASE_11_TRACEABILITY_MATRIX.md");
const matrix = readFileSync(matrixPath, "utf8");
const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w1 = reqs.requirements.filter((r) => r.build === "11.1" && r.wave === "W1");
const w2 = reqs.requirements.filter((r) => r.build === "11.1" && r.wave === "W2");
const w3 = reqs.requirements.filter((r) => r.build === "11.1" && r.wave === "W3");

for (const r of [...w1, ...w2]) {
  if (!matrix.includes(r.id)) {
    console.error(`FAIL: ${r.id} missing from traceability matrix`);
    failed++;
  }
  if (matrix.includes(`${r.id} | implemented`)) {
    console.error(`FAIL: ${r.id} falsely marked implemented in matrix`);
    failed++;
  }
}

for (const r of w3) {
  if (!matrix.includes(r.id)) {
    console.error(`FAIL: ${r.id} missing from traceability matrix`);
    failed++;
  }
}

const w3Implemented = w3.filter((r) => r.status === "implemented");
if (w3Implemented.length < 40) {
  console.error(`FAIL: expected 40+ implemented W3 requirements, got ${w3Implemented.length}`);
  failed++;
}

if (!matrix.includes("Build 11.1 — Wave 3")) {
  console.error("FAIL: matrix must include W3 section");
  failed++;
}

if (failed) process.exit(1);
console.log(`Phase 11 traceability OK (${w1.length} W1 + ${w2.length} W2 + ${w3.length} W3 requirements)`);
