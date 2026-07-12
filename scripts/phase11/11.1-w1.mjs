#!/usr/bin/env node
/**
 * CAE-11.1-W1 — Initiative Constitution validation
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
  "docs/phase-11/11.1-initiatives/01_CONSTITUTION.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_VOCABULARY.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_TAXONOMY.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_AUTHORITY_MODEL.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_SCOPE_STANDARD.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_CHARTER_STANDARD.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_LIFECYCLE_CONSTITUTION.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_CLOSEOUT_CONSTITUTION.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_AI_BOUNDARIES.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_PRIVACY_AND_SECURITY.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_SPANISH_VOCABULARY.md",
  "docs/phase-11/11.1-initiatives/IMPLEMENTATION_LEDGER.md",
  "docs/phase-11/11.1-initiatives/CURSOR_HANDOFF.md",
];

for (const f of requiredDocs) {
  if (!existsSync(join(root, f))) fail(`missing doc ${f}`);
}

const constitution = readFileSync(join(root, "src/lib/civic-action/builds/11.1/constitution.ts"), "utf8");
for (const term of [
  "INI_GOVERNING_PRINCIPLE",
  "PROHIBITED_PATTERNS",
  "AI_MAY_NOT",
  "SPANISH_GLOSSARY",
  "INITIATIVE_TYPES",
  "emergency_initiative",
  "continuous_operating_function",
  "owner_required",
]) {
  if (!constitution.includes(term)) fail(`constitution missing ${term}`);
}

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w1 = reqs.requirements.filter((r) => r.build === "11.1" && r.wave === "W1");
const ids = new Set(w1.map((r) => r.id));
if (w1.length !== 44) fail(`expected 44 W1 requirements, got ${w1.length}`);
if (ids.size !== 44) fail("duplicate requirement IDs");
if (!w1.every((r) => r.status === "documented")) fail("requirements must be status documented, not implemented");

const types = JSON.parse(readFileSync(join(root, "data/phase-11/initiative_types.json"), "utf8"));
const typeKeys = new Set(types.types.map((t) => t.key));
if (types.types.length !== 12) fail(`expected 12 initiative types, got ${types.types.length}`);
if (typeKeys.size !== 12) fail("duplicate initiative type keys");

const vocab = JSON.parse(readFileSync(join(root, "data/phase-11/initiative_vocabulary.json"), "utf8"));
if ((vocab.terms?.length ?? 0) < 18) fail("vocabulary too small");

const aiDoc = readFileSync(join(root, "docs/phase-11/11.1-initiatives/INITIATIVE_AI_BOUNDARIES.md"), "utf8");
if (!aiDoc.includes("may not") && !aiDoc.includes("May Not")) fail("AI boundaries doc incomplete");

const constitutionMd = readFileSync(join(root, "docs/phase-11/11.1-initiatives/01_CONSTITUTION.md"), "utf8");
for (const phrase of ["governing institution", "service identit", "lifecycle", "closeout", "emergency"]) {
  if (!constitutionMd.toLowerCase().includes(phrase.toLowerCase())) fail(`constitution md missing: ${phrase}`);
}

if (failed) process.exit(1);
console.log("CAE-11.1-W1 Initiative Constitution checks passed (documentation + contracts)");
