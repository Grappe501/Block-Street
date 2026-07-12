#!/usr/bin/env node
import { existsSync, readFileSync } from "fs";
import { join } from "path";

const root = process.cwd();
let failed = 0;

const flags = JSON.parse(readFileSync(join(root, "data/identity-trust/july14_flags.json"), "utf8"));
for (const key of [
  "JULY_14_ENTRY_ENABLED",
  "IDENTITY_HOME_ENABLED",
  "INVITATION_ONLY_ENTRY_REQUIRED",
  "PUBLIC_REGISTRATION_DISABLED",
  "JULY_14_MEETING_WORKSPACE_ENABLED",
  "IDENTITY_INTELLIGENCE_ENABLED",
  "AI_IDENTITY_AUTOMATIC_ACTIONS_DISABLED",
  "IDENTITY_HIGH_RISK_ACTIONS_LOCKED",
]) {
  if (key === "IDENTITY_INTELLIGENCE_ENABLED") {
    if (flags[key]) { console.error(`FAIL: ${key} must be false for meeting`); failed++; }
    continue;
  }
  if (!flags[key] && key !== "IDENTITY_INTELLIGENCE_ENABLED") {
    console.error(`FAIL: ${key}`);
    failed++;
  }
}

const pages = [
  "src/app/(site)/join/page.tsx",
  "src/app/(site)/invite/[token]/page.tsx",
  "src/app/(site)/july-14/page.tsx",
  "src/app/(site)/identity/page.tsx",
  "src/app/(site)/admin/identity/page.tsx",
];

for (const p of pages) {
  if (!existsSync(join(root, p))) {
    console.error(`FAIL: missing ${p}`);
    failed++;
  }
}

const i18n = readFileSync(join(root, "src/lib/july14/i18n.ts"), "utf8");
if (!i18n.includes('"es"')) {
  console.error("FAIL: Spanish strings missing");
  failed++;
}

if (failed) process.exit(1);
console.log("July 14 UI smoke checks passed");
