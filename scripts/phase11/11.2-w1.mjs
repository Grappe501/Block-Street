#!/usr/bin/env node
/**
 * CAE-11.2-W1 — Objective Constitution validation
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";

const root = process.cwd();
let failed = 0;

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  failed++;
}

const requiredDocs = [
  "docs/phase-11/11.2-objectives/01_CONSTITUTION.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_VOCABULARY.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_TAXONOMY.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_AUTHORITY_MODEL.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_TRACEABILITY_STANDARD.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_LIFECYCLE_CONSTITUTION.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_SUCCESS_DOCTRINE.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_REVIEW_DOCTRINE.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_AI_BOUNDARIES.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_SPANISH_VOCABULARY.md",
  "docs/phase-11/11.2-objectives/EXECUTION_HIERARCHY.md",
  "docs/phase-11/11.2-objectives/IMPLEMENTATION_LEDGER.md",
  "docs/phase-11/11.2-objectives/CURSOR_HANDOFF.md",
];

for (const f of requiredDocs) {
  if (!existsSync(join(root, f))) fail(`missing doc ${f}`);
}

const constitution = readFileSync(join(root, "src/lib/civic-action/builds/11.2/constitution.ts"), "utf8");
for (const term of [
  "OBJ_GOVERNING_PRINCIPLE",
  "EXECUTION_HIERARCHY",
  "TRACEABILITY_CHAIN",
  "OBJECTIVE_TYPES",
  "OBJECTIVE_LIFECYCLE",
  "OUTCOME_CATEGORIES",
  "REQUIRED_DOMAIN_SERVICES",
  "orphan_task",
  "AI_MAY_NOT",
  "SPANISH_GLOSSARY",
  "SUCCESS_DOCTRINE",
]) {
  if (!constitution.includes(term)) fail(`constitution missing ${term}`);
}

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w1 = reqs.requirements.filter((r) => r.build === "11.2" && r.wave === "W1");
const ids = new Set(w1.map((r) => r.id));
if (w1.length < 40) fail(`expected 40+ W1 requirements, got ${w1.length}`);
if (ids.size !== w1.length) fail("duplicate requirement IDs");
if (!w1.every((r) => r.status === "documented")) fail("requirements must be status documented, not implemented");

const types = JSON.parse(readFileSync(join(root, "data/phase-11/objective_types.json"), "utf8"));
if (types.types.length !== 13) fail(`expected 13 objective types, got ${types.types.length}`);

const vocab = JSON.parse(readFileSync(join(root, "data/phase-11/objective_vocabulary.json"), "utf8"));
if ((vocab.terms?.length ?? 0) < 20) fail("vocabulary too small");

const lifecycle = JSON.parse(readFileSync(join(root, "data/phase-11/objective_lifecycle.json"), "utf8"));
if (lifecycle.states.length !== 12) fail(`expected 12 lifecycle states, got ${lifecycle.states.length}`);

const aiDoc = readFileSync(join(root, "docs/phase-11/11.2-objectives/OBJECTIVE_AI_BOUNDARIES.md"), "utf8");
if (!aiDoc.includes("may not") && !aiDoc.includes("May Not")) fail("AI boundaries doc incomplete");

const constitutionMd = readFileSync(join(root, "docs/phase-11/11.2-objectives/01_CONSTITUTION.md"), "utf8");
for (const phrase of ["orphan", "traceability", "key result", "workstream", "initiative"]) {
  if (!constitutionMd.toLowerCase().includes(phrase.toLowerCase())) fail(`constitution md missing: ${phrase}`);
}

if (failed) process.exit(1);
console.log("CAE-11.2-W1 Objective Constitution checks passed (documentation + contracts)");
