#!/usr/bin/env node
/**
 * Fail if flat 25% campus formula is presented as *active* (not clearly superseded).
 * Allow listed lineage / superseded documentation only.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
process.chdir(root);

const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  ".tmp",
  ".npm-cache",
  "coverage",
  "playwright-report",
  "test-results",
]);

/** Paths allowed to mention 0.25 only in superseded / lineage context */
const ALLOW = [
  "src/lib/field-goals/campus-goals.ts",
  "src/lib/field-goals/index.ts",
  "scripts/test-field-goals.ts",
  "scripts/field-goals/ingest-reddirt-goals.mjs",
  "scripts/field-plan/assert-no-active-flat-25.mjs",
  "docs/v2/CAMPUS_GOAL_FORMULA_DECISION.md",
  "docs/v2/V2B1_FIELD_PLAN_SOURCE_CONTRACT.md",
  "data/field-plan/source-contract.json",
  "data/field-goals/",
  "data/v2/",
  "data/volunteer-command/leadership-role-registry.json",
];

const ACTIVE_BAD = [
  /campus_goal_formula_version["']?\s*:\s*["']flat_0\.25/i,
  /Active formula:.*0\.25/i,
  /canonical[^.\n]{0,40}flat\s*25%/i,
  /ceil\(county_goal\s*\*\s*0\.25\)(?![^\n]*SUPERSEDED)/i,
];

const hits = [];

function allowlisted(rel) {
  const n = rel.replace(/\\/g, "/");
  return ALLOW.some((a) => n.includes(a.replace(/\\/g, "/")));
}

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full);
    else if (/\.(ts|tsx|js|mjs|md|json)$/i.test(name)) scan(full);
  }
}

function scan(file) {
  const rel = path.relative(root, file).replace(/\\/g, "/");
  if (allowlisted(rel)) return;
  let text;
  try {
    text = fs.readFileSync(file, "utf8");
  } catch {
    return;
  }
  // UI / docs claiming institutions share identical 25% as current rule
  if (/same for every (college|school|education).*25%/i.test(text) && !/supersed/i.test(text)) {
    hits.push({ file: rel, reason: "ui_or_doc_presents_flat_25_as_shared_current_rule" });
  }
  for (const re of ACTIVE_BAD) {
    if (re.test(text) && !/SUPERSEDED|superseded|retired|do not use/i.test(text)) {
      hits.push({ file: rel, reason: re.toString() });
    }
  }
}

for (const rel of ["src", "docs/v2", "data/registry", "data/v1-certification"]) {
  const dir = path.join(root, rel);
  if (fs.existsSync(dir)) walk(dir);
}

if (hits.length) {
  console.error("assert-no-active-flat-25 FAILED");
  for (const h of hits) console.error(` - ${h.file}: ${h.reason}`);
  process.exit(1);
}

console.log("assert-no-active-flat-25 PASSED");
