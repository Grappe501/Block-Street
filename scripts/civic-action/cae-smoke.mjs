#!/usr/bin/env node
import { existsSync, readFileSync } from "fs";
import { join } from "path";

const root = process.cwd();
let failed = 0;

const flags = JSON.parse(readFileSync(join(root, "data/civic-action/cae_flags.json"), "utf8"));
for (const key of [
  "PHASE_11_ENABLED",
  "INITIATIVES_ENABLED",
  "INITIATIVE_ARCHITECTURE_ENABLED",
  "STRATEGIC_OBJECTIVES_ENABLED",
  "MISSION_EXECUTION_ENABLED",
  "OPERATIONS_COMMAND_CENTER_ENABLED",
  "AI_CONSEQUENTIAL_ACTIONS_DISABLED",
]) {
  if (!flags[key]) {
    console.error(`FAIL: ${key}`);
    failed++;
  }
}

if (flags.IDENTITY_INTELLIGENCE_ENABLED) {
  console.error("FAIL: IDENTITY_INTELLIGENCE_ENABLED should not be in cae_flags");
}

const modules = [
  "src/lib/civic-action/engine.ts",
  "src/lib/civic-action/initiatives.ts",
  "src/lib/civic-action/missions.ts",
  "src/lib/civic-action/command-center.ts",
  "src/lib/civic-action/seed.ts",
  "src/lib/civic-action/scaffold/ledger.ts",
  "src/lib/civic-action/builds/11.1/constitution.ts",
  "data/civic-action/scaffold.json",
];

for (const mod of modules) {
  if (!existsSync(join(root, mod))) {
    console.error(`FAIL: missing ${mod}`);
    failed++;
  }
}

const pages = [
  "src/app/(site)/operations/page.tsx",
  "src/app/(site)/initiative/[id]/page.tsx",
];

for (const p of pages) {
  if (!existsSync(join(root, p))) {
    console.error(`FAIL: missing ${p}`);
    failed++;
  }
}

if (failed) process.exit(1);
console.log("CAE-001 smoke checks passed");
