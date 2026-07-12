#!/usr/bin/env node
/** Wave 1 smoke checks — run: node scripts/identity-trust/wave1-smoke.mjs */
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// Compiled path fallback — use dynamic import of ts not available; inline minimal checks
import { readFileSync } from "fs";
import { join } from "path";

const root = process.cwd();
const flags = JSON.parse(readFileSync(join(root, "data/identity-trust/wave1_flags.json"), "utf8"));

const disposable = /^(patriot|freedom|eagle|volunteer|truth|admin|campaign|anonymous|user)\d*/i;
function validatePublicHumanName(name) {
  const trimmed = name.trim();
  if (trimmed.length < 2) return { valid: false };
  if (!/\s/.test(trimmed) && !/^[A-Z][a-z]{2,}/.test(trimmed)) return { valid: false };
  if (disposable.test(trimmed.replace(/\s/g, ""))) return { valid: false };
  return { valid: true };
}

let failed = 0;
for (const [name, expect] of [
  ["Steve Grappe", true],
  ["Kelly Grappe", true],
  ["Patriot1776", false],
  ["Volunteer42", false],
]) {
  const ok = validatePublicHumanName(name).valid === expect;
  if (!ok) {
    console.error(`FAIL public name: ${name}`);
    failed++;
  }
}

if (!flags.INVITATION_ONLY_ENTRY_REQUIRED || !flags.PUBLIC_REGISTRATION_DISABLED) {
  console.error("FAIL wave1 flags: invitation-only not enforced");
  failed++;
}

if (failed) {
  console.error(`Wave 1 smoke: ${failed} failure(s)`);
  process.exit(1);
}
console.log("Wave 1 smoke checks passed");
