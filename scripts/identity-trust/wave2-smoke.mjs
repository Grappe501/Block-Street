#!/usr/bin/env node
import { readFileSync } from "fs";
import { join } from "path";

const root = process.cwd();
const flags = JSON.parse(readFileSync(join(root, "data/identity-trust/wave2_flags.json"), "utf8"));

let failed = 0;
const required = [
  "IDENTITY_VERIFICATION_ENGINE_ENABLED",
  "INDEPENDENT_SECOND_VERIFICATION_REQUIRED",
  "IDENTITY_LEDGER_ENABLED",
  "AI_IDENTITY_ACTIONS_PROHIBITED",
  "TRUST_LIFECYCLE_ENABLED",
];

for (const key of required) {
  if (!flags[key]) {
    console.error(`FAIL: ${key} not enabled`);
    failed++;
  }
}

if (failed) {
  console.error(`Wave 2 smoke: ${failed} failure(s)`);
  process.exit(1);
}
console.log("Wave 2 smoke checks passed");
