#!/usr/bin/env node
import { loadKernel, buildAdjacency } from "./lib.mjs";

const canonId = process.argv[2];
if (!canonId) {
  console.error("Usage: npm run canon:impact -- COS-ARCH-000001");
  process.exit(1);
}

const { byId, relationships } = loadKernel();
if (!byId.has(canonId)) {
  console.error(`Unknown canon_id: ${canonId}`);
  process.exit(1);
}

const obj = byId.get(canonId);
const { downstream, upstream } = buildAdjacency(relationships);

function walk(start, map, dir, visited = new Set(), depth = 0) {
  if (visited.has(start) || depth > 8) return [];
  visited.add(start);
  const results = [];
  for (const edge of map.get(start) || []) {
    const next = dir === "down" ? edge.target : edge.source;
    const name = byId.get(next)?.canonical_name || next;
    results.push({ id: next, name, type: edge.type, depth });
    results.push(...walk(next, map, dir, visited, depth + 1));
  }
  return results;
}

const impacted = walk(canonId, downstream, "down");
const dependencies = walk(canonId, upstream, "up");

console.log(`Change impact: ${canonId} — ${obj.canonical_name}`);
console.log(`\nDownstream (${impacted.length}):`);
for (const item of impacted.slice(0, 30)) {
  console.log(`  ${"  ".repeat(item.depth)}${item.type} → ${item.id} (${item.name})`);
}
console.log(`\nUpstream dependencies (${dependencies.length}):`);
for (const item of dependencies.slice(0, 30)) {
  console.log(`  ${"  ".repeat(item.depth)}${item.type} ← ${item.id} (${item.name})`);
}
