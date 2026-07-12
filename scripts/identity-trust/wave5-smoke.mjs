#!/usr/bin/env node
import { readFileSync } from "fs";
import { join } from "path";

const flags = JSON.parse(readFileSync(join(process.cwd(), "data/identity-trust/wave5_flags.json"), "utf8"));
let failed = 0;
for (const key of [
  "IDENTITY_INTELLIGENCE_ENABLED",
  "IDENTITY_SIGNAL_ONLY_AUTHORITY_REQUIRED",
  "AI_IDENTITY_AUTOMATIC_ACTIONS_DISABLED",
  "IDENTITY_SIGNAL_REFERRALS_ENABLED",
  "IDENTITY_DUPLICATE_DETECTION_ENABLED",
  "IDENTITY_FEDERATION_BOUNDARY_DETECTION_ENABLED",
]) {
  if (!flags[key]) {
    console.error(`FAIL: ${key}`);
    failed++;
  }
}
if (failed) process.exit(1);
console.log("Wave 5 smoke checks passed");
