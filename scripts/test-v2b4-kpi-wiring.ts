/**
 * npm run test:v2b4-kpi-wiring
 */
import assert from "assert";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { wireFieldPlanKpis } from "../src/lib/field-plan/kpi-wiring";

const root = process.cwd();
const result = wireFieldPlanKpis();

assert.ok(result.summary.catalog_kpis >= 10, "catalog should have field KPIs");
assert.ok(result.summary.bindings_wired >= 20, "content-backed responsibilities should wire");
assert.ok(result.summary.responsibilities_approved >= 20);
assert.ok(result.summary.placeholders_deferred >= 1, "placeholders must stay deferred");
assert.strictEqual(result.summary.personnel_assignments, 0);

assert.ok(
  result.responsibilities
    .filter((r) => r.content_status === "placeholder")
    .every((r) => r.review_status === "draft" && r.kpi_relationship.length === 0),
  "placeholders never auto-approved or KPI-bound",
);

assert.ok(
  result.responsibilities
    .filter((r) => r.review_status === "approved")
    .every((r) => r.kpi_relationship.length > 0),
  "approved rows must have KPI links",
);

assert.ok(
  result.task_templates.every((t) => t.assignment_policy === "not_assigned_until_postgres_rbac"),
);

const eventSummary = result.responsibilities.find((r) => r.stable_id === "FP-resp-event_lead-summary");
assert.ok(eventSummary);
assert.strictEqual(eventSummary!.review_status, "approved");
assert.ok(eventSummary!.kpi_relationship.includes("FP-kpi-volunteers-recruited"));

assert.ok(
  !result.responsibilities.some((r) => r.canonical_key === "media_lead"),
  "unmapped seats remain excluded from library",
);

const registryPath = join(root, "data/field-plan/kpi-binding-registry.json");
assert.ok(existsSync(registryPath), "run npm run field-plan:wire-kpis before ship");
const registry = JSON.parse(readFileSync(registryPath, "utf8"));
assert.strictEqual(registry.phase, "V2-B.4");
assert.ok(registry.summary.bindings_wired >= 20);

const library = JSON.parse(readFileSync(join(root, "data/field-plan/responsibility-library.json"), "utf8"));
assert.ok(library.policy.kpi_wiring.includes("v2b4"));
assert.ok((library.responsibilities as { kpi_relationship: string[] }[]).some((r) => r.kpi_relationship.length > 0));

console.log("v2b4-kpi-wiring tests passed", result.summary);
