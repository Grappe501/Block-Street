#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { CANON_DATA } from "./lib.mjs";

const path = join(CANON_DATA, "canon_readiness.json");
if (!existsSync(path)) {
  console.error("Run npm run canon:validate first");
  process.exit(1);
}
const readiness = JSON.parse(readFileSync(path, "utf8"));
console.log("Canon Readiness Report");
console.log(`  Calculated: ${readiness.calculatedAt}`);
console.log(`  Bootstrap: Stage ${readiness.bootstrapStage} — ${readiness.bootstrapStageName}`);
console.log(`  Objects: ${readiness.objectCount} · Relationships: ${readiness.relationshipCount}`);
for (const [key, val] of Object.entries(readiness)) {
  if (val && typeof val === "object" && "percent" in val) {
    console.log(`  ${key}: ${val.percent}% (${val.numerator}/${val.denominator}) — ${val.label}`);
  }
}
console.log(`  Orphan objects: ${readiness.orphanObjectCount}`);
console.log(`  Validation issues: ${readiness.validationIssueCount}`);
