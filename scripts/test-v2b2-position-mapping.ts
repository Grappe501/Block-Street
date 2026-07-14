/**
 * npm run test:v2b2-position-mapping
 */
import assert from "assert";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { mapFieldPlanPositions } from "../src/lib/field-plan/position-mapper";

const root = process.cwd();
const result = mapFieldPlanPositions();

assert.ok(result.summary.mapped >= 8, "expected mapped functional + hierarchy seats");
assert.ok(result.unmapped.some((u) => u.field_plan_key === "media_lead"));
assert.ok(result.unmapped.some((u) => u.field_plan_key === "logistics_lead"));
assert.ok(result.deferred_central.length >= 5, "central activation should defer");
assert.ok(
  result.mapped.every((m) => m.dashboard_owner && m.who_supervises && m.vacancy_behavior),
  "mapped rows must answer dashboard/supervisor/vacancy",
);
assert.ok(result.mapped.some((m) => m.field_plan_key === "event_lead"));
assert.ok(result.mapped.some((m) => m.canonical_key === "registration_lead"));
assert.ok(!result.mapped.some((m) => m.field_plan_key === "media_lead"));

// No silent assign: every unmapped requires review
assert.ok(result.unmapped.every((u) => u.review_required));

const registryPath = join(root, "data/field-plan/position-mapping-registry.json");
assert.ok(existsSync(registryPath), "run npm run field-plan:map-positions before ship");
const registry = JSON.parse(readFileSync(registryPath, "utf8"));
assert.strictEqual(registry.phase, "V2-B.2");
assert.ok(registry.summary.mapped >= 8);

const review = JSON.parse(
  readFileSync(join(root, "data/field-plan/ingestion/review-queue.json"), "utf8"),
);
assert.ok(review.items.length >= result.unmapped.length);

console.log("v2b2-position-mapping tests passed", result.summary);
