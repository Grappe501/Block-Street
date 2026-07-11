import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(__dirname, "..", "..");
export const CANON_DATA = join(ROOT, "data", "canon");

const CANON_ID_RE = /^COS-[A-Z]+-\d{6}$/;

export function readJsonl(filename) {
  const path = join(CANON_DATA, filename);
  if (!existsSync(path)) return [];
  return readFileSync(path, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, i) => {
      try {
        return JSON.parse(line);
      } catch (e) {
        throw new Error(`${filename}:${i + 1} invalid JSON: ${e.message}`);
      }
    });
}

export function writeJson(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf8");
}

export function loadKernel() {
  const objects = readJsonl("canon_objects.jsonl");
  const relationships = readJsonl("canon_relationships.jsonl");
  const requirements = readJsonl("canon_requirements.jsonl");
  const byId = new Map(objects.map((o) => [o.canon_id, o]));
  return { objects, relationships, requirements, byId };
}

export function validateCanonId(id) {
  return CANON_ID_RE.test(id);
}

export function requiredFields() {
  return [
    "canon_id",
    "canonical_name",
    "object_type",
    "domain",
    "description",
    "status",
    "version",
    "owner",
    "steward",
    "authority",
    "created_at",
    "updated_at",
    "implementation_status",
    "validation_status",
    "security_classification",
    "privacy_classification",
  ];
}

export function validateObject(obj) {
  const issues = [];
  if (!validateCanonId(obj.canon_id)) {
    issues.push({ canon_id: obj.canon_id, gate: 1, message: "Invalid Canon ID format" });
  }
  for (const field of requiredFields()) {
    if (obj[field] === undefined || obj[field] === null || obj[field] === "") {
      issues.push({ canon_id: obj.canon_id, gate: 2, message: `Missing required field: ${field}` });
    }
  }
  if (!obj.description && !obj.purpose) {
    issues.push({ canon_id: obj.canon_id, gate: 5, message: "Missing description or purpose" });
  }
  if (!obj.security_classification) {
    issues.push({ canon_id: obj.canon_id, gate: 8, message: "Missing security classification" });
  }
  return issues;
}

export function validateRelationships(relationships, byId) {
  const issues = [];
  const seenIds = new Set();
  for (const rel of relationships) {
    if (seenIds.has(rel.relationship_id)) {
      issues.push({ relationship_id: rel.relationship_id, message: "Duplicate relationship_id" });
    }
    seenIds.add(rel.relationship_id);
    if (!byId.has(rel.source_canon_id)) {
      issues.push({ relationship_id: rel.relationship_id, message: `Unknown source: ${rel.source_canon_id}` });
    }
    if (!byId.has(rel.target_canon_id)) {
      issues.push({ relationship_id: rel.relationship_id, message: `Unknown target: ${rel.target_canon_id}` });
    }
  }
  return issues;
}

export function detectDuplicateIds(objects) {
  const seen = new Map();
  const issues = [];
  for (const obj of objects) {
    if (seen.has(obj.canon_id)) {
      issues.push({ canon_id: obj.canon_id, message: "Canon ID reused" });
    }
    seen.set(obj.canon_id, true);
  }
  return issues;
}

export function buildAdjacency(relationships) {
  const downstream = new Map();
  const upstream = new Map();
  for (const rel of relationships) {
    if (rel.status === "inactive" || rel.status === "retired") continue;
    const downType = rel.relationship_type;
    if (downType === "depends_on" || downType === "governed_by" || downType === "indexes" || downType === "derived_from") {
      if (!downstream.has(rel.source_canon_id)) downstream.set(rel.source_canon_id, []);
      downstream.get(rel.source_canon_id).push({ target: rel.target_canon_id, type: rel.relationship_type, id: rel.relationship_id });
      if (!upstream.has(rel.target_canon_id)) upstream.set(rel.target_canon_id, []);
      upstream.get(rel.target_canon_id).push({ source: rel.source_canon_id, type: rel.relationship_type, id: rel.relationship_id });
    }
  }
  return { downstream, upstream };
}

export function detectCycles(downstream) {
  const cycles = [];
  const visiting = new Set();
  const visited = new Set();

  function dfs(node, path) {
    if (visiting.has(node)) {
      cycles.push([...path, node]);
      return;
    }
    if (visited.has(node)) return;
    visiting.add(node);
    for (const edge of downstream.get(node) || []) {
      if (edge.type === "depends_on") {
        dfs(edge.target, [...path, node]);
      }
    }
    visiting.delete(node);
    visited.add(node);
  }

  for (const node of downstream.keys()) {
    dfs(node, []);
  }
  return cycles;
}

export function findOrphans(objects, relationships) {
  const connected = new Set();
  for (const rel of relationships) {
    connected.add(rel.source_canon_id);
    connected.add(rel.target_canon_id);
  }
  const rootIds = new Set(["COS-CAN-000001", "COS-CON-000001"]);
  return objects
    .filter((o) => !connected.has(o.canon_id) && !rootIds.has(o.canon_id))
    .map((o) => o.canon_id);
}

export function scanCanonReferences() {
  const refs = [];
  const re = /@canon\s+(COS-[A-Z]+-\d{6})/g;
  const dirs = ["src", "docs", "data/registry"];
  for (const dir of dirs) {
    const base = join(ROOT, dir);
    if (!existsSync(base)) continue;
    walk(base, (file) => {
      if (!/\.(ts|tsx|js|jsx|md|sql|json)$/.test(file)) return;
      const content = readFileSync(file, "utf8");
      let match;
      while ((match = re.exec(content)) !== null) {
        refs.push({ canon_id: match[1], file: file.replace(ROOT + "\\", "").replace(ROOT + "/", "") });
      }
    });
  }
  return refs;
}

function walk(dir, fn) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "node_modules" && entry.name !== ".next") {
      walk(full, fn);
    } else if (entry.isFile()) {
      fn(full);
    }
  }
}

export function computeReadiness(objects, relationships, requirements, validationIssues) {
  const archObjects = objects.filter((o) => o.object_type.includes("architecture") || o.object_type.includes("engine") || o.object_type.includes("fabric"));
  const withImpl = objects.filter((o) => ["implemented", "validated", "released", "maintained"].includes(o.implementation_status));
  const withDocs = objects.filter((o) => o.source_document);
  const reqsWithArch = requirements.filter((r) => r.architecture_links?.length);
  const reqsWithTests = requirements.filter((r) => r.test_links?.length);
  const orphanCount = findOrphans(objects, relationships).length;

  return {
    calculatedAt: new Date().toISOString(),
    architectureCoverage: metric(withDocs.length, objects.length, "objects with source_document"),
    requirementTraceability: metric(reqsWithArch.length, requirements.length || 1, "requirements with architecture_links"),
    implementationCoverage: metric(withImpl.length, archObjects.length || 1, "architecture objects implemented+"),
    testCoverageByRequirement: metric(reqsWithTests.length, requirements.length || 1, "requirements with test_links"),
    documentationCoverage: metric(withDocs.length, objects.length, "objects with source_document"),
    securityClassificationCoverage: metric(
      objects.filter((o) => o.security_classification).length,
      objects.length,
      "objects with security_classification"
    ),
    validationIssueCount: validationIssues.length,
    orphanObjectCount: orphanCount,
    objectCount: objects.length,
    relationshipCount: relationships.length,
    requirementCount: requirements.length,
    bootstrapStage: 1,
    bootstrapStageName: "Canon Bootstrap",
  };
}

function metric(numerator, denominator, label) {
  const pct = denominator ? Math.round((numerator / denominator) * 100) : 0;
  return { percent: pct, numerator, denominator, label };
}
