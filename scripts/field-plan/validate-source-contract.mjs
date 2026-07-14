#!/usr/bin/env node
/**
 * V2-B.1 — validate Field Plan source contract + ingestion spine files.
 * Writes only under H:\Block-Street (repo cwd).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
process.chdir(root);

function must(rel) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) throw new Error(`Missing required file: ${rel}`);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

const contract = must("data/field-plan/source-contract.json");
const spine = must("data/field-plan/ingestion/spine-state.json");
must("data/field-plan/ingestion/review-queue.json");
must("data/field-plan/ingestion/conflict-queue.json");
must("data/field-plan/ingestion/lineage-log.json");
must("data/field-plan/entity-templates/record.template.json");

const required = [
  "tree",
  "entity_kinds",
  "required_record_fields",
  "review_statuses",
  "gates_before_broad_ingest",
  "conflict_policy",
];
for (const k of required) {
  if (contract[k] == null) throw new Error(`source-contract missing ${k}`);
}

if (contract.broad_content_ingest_allowed !== false) {
  throw new Error("broad_content_ingest_allowed must be false until gates explicitly opened");
}

if (contract.preserves?.campus_goal_formula_version !== "enrollment_share_of_county_vap_v1") {
  throw new Error("source-contract must preserve enrollment_share_of_county_vap_v1");
}

if (contract.preserves?.flat_25_status !== "superseded_do_not_use") {
  throw new Error("flat 25% must remain superseded_do_not_use");
}

if (spine.broad_ingest !== "blocked_until_gates_pass") {
  throw new Error("spine broad_ingest must remain blocked_until_gates_pass in V2-B.1");
}

if (!String(contract.preserves?.hierarchy || "").includes("Volunteer Manager")) {
  throw new Error("hierarchy preserve string must retain Volunteer Manager");
}

console.log("field-plan:validate-contract PASSED", {
  phase: contract.phase,
  entities: contract.entity_kinds.length,
  gates: contract.gates_before_broad_ingest.length,
});
