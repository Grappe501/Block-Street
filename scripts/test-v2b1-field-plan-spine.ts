/**
 * npm run test:v2b1-field-plan-spine
 */
import assert from "assert";
import { existsSync } from "fs";
import { join } from "path";
import {
  enqueueMappingReview,
  fieldPlanBroadIngestAllowed,
  getFieldPlanSourceContract,
  getFieldPlanSpineState,
  listFieldPlanGates,
  missingRequiredRecordFields,
} from "../src/lib/field-plan/source-contract";
import { CAMPUS_GOAL_FORMULA_VERSION, SUPERSEDED_FLAT_25_RULE } from "../src/lib/field-goals";

const root = process.cwd();
for (const rel of [
  "data/field-plan/source-contract.json",
  "data/field-plan/ingestion/spine-state.json",
  "data/field-plan/ingestion/review-queue.json",
  "data/field-plan/ingestion/conflict-queue.json",
  "docs/v2/V2B1_FIELD_PLAN_SOURCE_CONTRACT.md",
]) {
  assert.ok(existsSync(join(root, rel)), `missing ${rel}`);
}

const contract = getFieldPlanSourceContract();
assert.strictEqual(contract.phase, "V2-B.1");
assert.strictEqual(fieldPlanBroadIngestAllowed(), false);
assert.ok(contract.tree.includes("Positions"));
assert.ok(contract.tree.includes("KPIs"));
assert.ok(listFieldPlanGates().includes("no_active_flat_25_formula"));
assert.strictEqual(contract.preserves.campus_goal_formula_version, CAMPUS_GOAL_FORMULA_VERSION);
assert.ok(SUPERSEDED_FLAT_25_RULE.includes("SUPERSEDED"));

const spine = getFieldPlanSpineState();
assert.strictEqual(spine.broad_ingest, "blocked_until_gates_pass");

const incomplete = missingRequiredRecordFields({
  stable_id: "FP-position-demo",
  title: "Demo",
});
assert.ok(incomplete.includes("source_reference"));
assert.ok(incomplete.includes("review_status"));

const review = enqueueMappingReview({
  stable_id: "FP-position-conflict-demo",
  title: "Unmapped City Lead",
  reason: "no dashboard_owner",
});
assert.strictEqual(review.review_status, "queued_for_review");

console.log("v2b1-field-plan-spine tests passed");
