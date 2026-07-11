#!/usr/bin/env node
import { loadKernel } from "./lib.mjs";

const { objects, requirements, relationships, byId } = loadKernel();

console.log("Canon Traceability");
console.log("==================\n");

for (const req of requirements) {
  console.log(`${req.requirement_id} — ${req.statement.slice(0, 80)}...`);
  console.log(`  Status: ${req.status} · Legacy: ${req.legacy_requirement_id || "—"}`);
  for (const arch of req.architecture_links || []) {
    const obj = byId.get(arch);
    console.log(`  Architecture: ${arch} — ${obj?.canonical_name || "?"}`);
  }
  for (const impl of req.implementation_links || []) {
    console.log(`  Implementation: ${impl}`);
  }
  console.log("");
}

const unlinked = objects.filter(
  (o) => !relationships.some((r) => r.source_canon_id === o.canon_id || r.target_canon_id === o.canon_id)
);
if (unlinked.length) {
  console.log(`Unlinked objects: ${unlinked.map((o) => o.canon_id).join(", ")}`);
}
