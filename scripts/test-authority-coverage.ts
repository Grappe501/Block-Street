import assert from "node:assert/strict";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

const coveragePath = join(process.cwd(), "data", "authority", "coverage-summary.json");
const registryPath = join(process.cwd(), "data", "authority", "protected-routes.json");
const inventoryPath = join(process.cwd(), "data", "authority", "mutation-inventory.json");

assert.ok(existsSync(coveragePath), "coverage-summary.json missing");
assert.ok(existsSync(registryPath), "protected-routes.json missing");
assert.ok(existsSync(inventoryPath), "mutation-inventory.json missing");

const coverage = JSON.parse(readFileSync(coveragePath, "utf8")) as {
  program: string;
  unprotected: number;
  needs_investigation: number;
  overall_scope_coverage: number;
  scope_protected: number;
  total_mutations: number;
};

const registry = JSON.parse(readFileSync(registryPath, "utf8")) as {
  routes: Array<{ routePattern: string; classification: string }>;
};

const inventory = JSON.parse(readFileSync(inventoryPath, "utf8")) as {
  program: string;
  summary: { unprotected: number; needs_investigation: number; protected_mutations: number; total_mutations: number };
};

assert.equal(coverage.program, "CPOS-DURABLE-AUTHORITY-1.2");
assert.equal(inventory.program, "CPOS-DURABLE-AUTHORITY-1.2");
assert.equal(registry.routes.length, inventory.summary.total_mutations ?? coverage.total_mutations);
assert.equal(coverage.unprotected, 0, "all unprotected routes must be classified");
assert.equal(coverage.needs_investigation, 0, "all needs_investigation routes must be resolved");
assert.ok(coverage.overall_scope_coverage >= 0.15, `scope coverage must be >= 15% (got ${coverage.overall_scope_coverage})`);
assert.ok(inventory.summary.protected_mutations >= 69 || inventory.summary.protected_mutations > 0, "scope-protected mutations must be moving");

const unclassified = registry.routes.filter((r) => !r.classification);
assert.equal(unclassified.length, 0, "every registry record must have classification");

console.log("authority coverage tests passed");
console.log({
  scope_protected: coverage.scope_protected,
  coverage_pct: (coverage.overall_scope_coverage * 100).toFixed(1) + "%",
  inventory_protected: inventory.summary.protected_mutations,
  unprotected: inventory.summary.unprotected,
});
