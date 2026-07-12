#!/usr/bin/env node
import { readFileSync } from "fs";
import { join } from "path";

const flags = JSON.parse(readFileSync(join(process.cwd(), "data/identity-trust/wave6_flags.json"), "utf8"));
let failed = 0;
for (const key of [
  "IDENTITY_OPERATIONS_CENTER_ENABLED",
  "IDENTITY_WORK_QUEUE_ENABLED",
  "IDENTITY_HOME_ENABLED",
  "IDENTITY_SUPPORT_CENTER_ENABLED",
  "IDENTITY_INTELLIGENCE_REVIEW_ENABLED",
  "IDENTITY_AUDIT_EXPLORER_ENABLED",
  "EXECUTIVE_IDENTITY_OVERSIGHT_ENABLED",
  "AI_IDENTITY_AUTOMATIC_ACTIONS_DISABLED",
]) {
  if (!flags[key]) {
    console.error(`FAIL: ${key}`);
    failed++;
  }
}
if (failed) process.exit(1);
console.log("Wave 6 smoke checks passed");
