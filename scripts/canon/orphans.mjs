#!/usr/bin/env node
import { loadKernel, findOrphans } from "./lib.mjs";

const { objects, relationships } = loadKernel();
const orphans = findOrphans(objects, relationships);

console.log(`Canon orphans: ${orphans.length}`);
for (const id of orphans) {
  const obj = objects.find((o) => o.canon_id === id);
  console.log(`  ${id} — ${obj?.canonical_name || "unknown"}`);
}
if (orphans.length) process.exit(1);
