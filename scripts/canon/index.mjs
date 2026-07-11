#!/usr/bin/env node
import { join } from "node:path";
import { loadKernel, buildAdjacency, CANON_DATA, writeJson } from "./lib.mjs";

const { objects, relationships, byId } = loadKernel();
const { downstream, upstream } = buildAdjacency(relationships);

const nodes = objects.map((o) => ({
  id: o.canon_id,
  label: o.canonical_name,
  domain: o.domain,
  object_type: o.object_type,
  status: o.status,
  legacy_requirement_id: o.legacy_requirement_id || null,
}));

const edges = relationships.map((r) => ({
  id: r.relationship_id,
  source: r.source_canon_id,
  target: r.target_canon_id,
  type: r.relationship_type,
  status: r.status,
}));

const graph = {
  indexedAt: new Date().toISOString(),
  nodeCount: nodes.length,
  edgeCount: edges.length,
  nodes,
  edges,
  adjacency: {
    downstream: Object.fromEntries([...downstream.entries()].map(([k, v]) => [k, v])),
    upstream: Object.fromEntries([...upstream.entries()].map(([k, v]) => [k, v])),
  },
};

writeJson(join(CANON_DATA, "canon_graph.json"), graph);
console.log(`Canon graph indexed: ${graph.nodeCount} nodes · ${graph.edgeCount} edges`);
