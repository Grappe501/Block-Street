#!/usr/bin/env node
import { join } from "node:path";
import {
  loadKernel,
  validateObject,
  validateRelationships,
  detectDuplicateIds,
  buildAdjacency,
  detectCycles,
  findOrphans,
  scanCanonReferences,
  computeReadiness,
  CANON_DATA,
  writeJson,
} from "./lib.mjs";

const { objects, relationships, requirements, byId } = loadKernel();
const issues = [];

issues.push(...detectDuplicateIds(objects));
for (const obj of objects) {
  issues.push(...validateObject(obj));
}
issues.push(...validateRelationships(relationships, byId));

const { downstream } = buildAdjacency(relationships);
const cycles = detectCycles(downstream);
for (const cycle of cycles) {
  issues.push({ message: `Circular depends_on: ${cycle.join(" → ")}` });
}

const orphans = findOrphans(objects, relationships);
const codeRefs = scanCanonReferences();
for (const ref of codeRefs) {
  if (!byId.has(ref.canon_id)) {
    issues.push({ canon_id: ref.canon_id, message: `Unknown @canon reference in ${ref.file}` });
  }
}

const report = {
  validatedAt: new Date().toISOString(),
  passed: issues.length === 0,
  objectCount: objects.length,
  relationshipCount: relationships.length,
  requirementCount: requirements.length,
  orphanCount: orphans.length,
  orphans,
  cycleCount: cycles.length,
  codeReferenceCount: codeRefs.length,
  issueCount: issues.length,
  issues,
};

writeJson(join(CANON_DATA, "canon_validation.json"), report);
writeJson(join(CANON_DATA, "canon_readiness.json"), computeReadiness(objects, relationships, requirements, issues));

console.log(`Canon validation: ${report.passed ? "PASSED" : "FAILED"}`);
console.log(`  Objects: ${report.objectCount} · Relationships: ${report.relationshipCount} · Requirements: ${report.requirementCount}`);
console.log(`  Orphans: ${report.orphanCount} · Issues: ${report.issueCount}`);
if (!report.passed) {
  for (const issue of issues.slice(0, 20)) {
    console.log(`  - ${issue.canon_id || issue.relationship_id || ""} ${issue.message}`);
  }
  process.exit(1);
}
