#!/usr/bin/env node
import { readFileSync } from "fs";
import { join } from "path";

const flags = JSON.parse(readFileSync(join(process.cwd(), "data/identity-trust/wave3_flags.json"), "utf8"));
let failed = 0;
for (const key of [
  "IDENTITY_GOVERNANCE_ENABLED",
  "IDENTITY_CASE_MANAGEMENT_ENABLED",
  "IDENTITY_APPEALS_ENABLED",
  "AI_IDENTITY_DECISION_PROHIBITED",
]) {
  if (!flags[key]) {
    console.error(`FAIL: ${key}`);
    failed++;
  }
}
if (failed) process.exit(1);
console.log("Wave 3 smoke checks passed");
