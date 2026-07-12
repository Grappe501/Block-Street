#!/usr/bin/env node
import { readFileSync } from "fs";
import { join } from "path";

const flags = JSON.parse(readFileSync(join(process.cwd(), "data/identity-trust/wave4_flags.json"), "utf8"));
let failed = 0;
for (const key of [
  "FEDERATION_IDENTITY_ENABLED",
  "GLOBAL_HUMAN_MULTI_INSTITUTION_ENABLED",
  "CROSS_INSTITUTION_INVITATIONS_ENABLED",
  "PORTABLE_IDENTITY_ASSURANCE_ENABLED",
  "INSTITUTION_CONTEXT_RESOLVER_ENABLED",
  "INSTITUTION_TRUST_ISOLATION_REQUIRED",
  "AI_CROSS_INSTITUTION_LINKING_PROHIBITED",
]) {
  if (!flags[key]) {
    console.error(`FAIL: ${key}`);
    failed++;
  }
}
if (failed) process.exit(1);
console.log("Wave 4 smoke checks passed");
