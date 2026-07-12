#!/usr/bin/env node
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const root = process.cwd();
const flags = JSON.parse(readFileSync(join(root, "data/identity-trust/wave7_flags.json"), "utf8"));
let failed = 0;

for (const key of [
  "IDENTITY_CERTIFICATION_FRAMEWORK_ENABLED",
  "IDENTITY_TRACEABILITY_REQUIRED",
  "IDENTITY_CONFORMANCE_CI_REQUIRED",
  "IDENTITY_RED_TEAM_REQUIRED",
  "IDENTITY_MIGRATION_CERTIFICATION_REQUIRED",
  "IDENTITY_LEDGER_RECONSTRUCTION_REQUIRED",
  "IDENTITY_CONTINUITY_DRILLS_REQUIRED",
  "IDENTITY_CONTROLLED_LAUNCH_ENABLED",
  "IDENTITY_CONSTITUTIONAL_DRIFT_MONITOR_ENABLED",
  "IDENTITY_RECERTIFICATION_REQUIRED",
]) {
  if (!flags[key]) {
    console.error(`FAIL: ${key}`);
    failed++;
  }
}

const modules = [
  "src/lib/identity-trust/wave7/engine.ts",
  "src/lib/identity-trust/wave7/requirements.ts",
  "src/lib/identity-trust/wave7/conformance.ts",
  "src/lib/identity-trust/wave7/redteam.ts",
  "src/lib/identity-trust/wave7/launch.ts",
  "src/lib/identity-trust/wave7/drift.ts",
];

for (const mod of modules) {
  if (!existsSync(join(root, mod))) {
    console.error(`FAIL: missing ${mod}`);
    failed++;
  }
}

if (flags.IDENTITY_PRODUCTION_CERTIFIED && !existsSync(join(root, "data/identity-trust/wave7_certification.json"))) {
  console.error("FAIL: IDENTITY_PRODUCTION_CERTIFIED without wave7_certification.json");
  failed++;
}

if (failed) process.exit(1);
console.log("Wave 7 smoke checks passed");
