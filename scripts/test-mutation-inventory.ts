import assert from "node:assert/strict";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

const inventoryPath = join(process.cwd(), "data", "authority", "mutation-inventory.json");

assert.ok(existsSync(inventoryPath), "mutation-inventory.json missing — run npm run authority:inventory");

const inventory = JSON.parse(readFileSync(inventoryPath, "utf8")) as {
  program: string;
  summary: {
    total_mutations: number;
    protected_mutations: number;
    base_gated_only: number;
    authenticated_only?: number;
    unprotected: number;
    public_by_design: number;
    legacy_unused?: number;
    needs_investigation: number;
  };
  entries: Array<{ id: string; classification: string; kind: string }>;
};

assert.equal(inventory.program, "CPOS-DURABLE-AUTHORITY-1.2");
assert.ok(inventory.summary.total_mutations > 0, "inventory must contain mutations");

const sum =
  inventory.summary.protected_mutations +
  inventory.summary.base_gated_only +
  (inventory.summary.authenticated_only ?? 0) +
  inventory.summary.unprotected +
  inventory.summary.public_by_design +
  (inventory.summary.legacy_unused ?? 0) +
  inventory.summary.needs_investigation;

assert.equal(sum, inventory.summary.total_mutations, "classification counts must sum to total");

for (const entry of inventory.entries) {
  assert.ok(entry.id, "entry must have id");
  assert.ok(entry.classification, "entry must have classification");
}

const unprotected = inventory.entries.filter((e) => e.classification === "unprotected");
console.log("mutation inventory tests passed");
console.log(inventory.summary);
if (unprotected.length > 0 && unprotected.length <= 15) {
  console.log("unprotected sample:", unprotected.slice(0, 5).map((e) => e.id));
}
