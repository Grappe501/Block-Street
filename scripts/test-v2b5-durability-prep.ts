/**
 * npm run test:v2b5-durability-prep
 */
import assert from "assert";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { buildDurabilityPrep, durabilityPrepReady } from "../src/lib/field-plan/durability-prep";

const root = process.cwd();
const result = buildDurabilityPrep();

assert.ok(result.summary.approved_templates as number >= 20);
assert.ok(result.summary.approved_responsibilities as number >= 20);
assert.strictEqual(result.summary.personnel_assignments, 0);
assert.strictEqual(result.summary.postgres_live, false);
assert.strictEqual(result.summary.dual_write_started, false);
assert.strictEqual(result.summary.broad_ingest_allowed, false);
assert.ok(result.summary.all_gates_green, JSON.stringify(result.gates.filter((g) => !g.pass)));
assert.ok(durabilityPrepReady());

assert.ok(
  result.records
    .filter((r) => r.kind !== "kpi" && r.kind !== "responsibility")
    .every((r) => r.assignment_policy === "not_assigned_until_postgres_rbac"),
);
assert.ok(result.records.every((r) => r.storage_class === "static_seed"));
assert.ok(result.records.every((r) => r.personnel_assign_allowed === false));
assert.ok(result.records.every((r) => r.postgres_ready === false));

const regPath = join(root, "data/field-plan/approved-template-durability-registry.json");
assert.ok(existsSync(regPath), "run npm run field-plan:prep-durability before ship");
const registry = JSON.parse(readFileSync(regPath, "utf8"));
assert.strictEqual(registry.phase, "V2-B.5");
assert.strictEqual(registry.policy.personnel_assignment, false);
assert.ok(registry.summary.all_gates_green);

const map = JSON.parse(readFileSync(join(root, "data/v2/v2b-postgres-port-readiness-map.json"), "utf8"));
assert.ok(map.entities.some((e: { id: string }) => e.id === "field_plan_approved_templates"));
assert.strictEqual(map.netlify_database_live, false);

console.log("v2b5-durability-prep tests passed", result.summary);
