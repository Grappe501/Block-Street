#!/usr/bin/env node
/**
 * CAE-11.1-W3 — Initiative service engine validation
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { spawnSync } from "child_process";

const root = process.cwd();
let failed = 0;

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  failed++;
}

const docs = [
  "docs/phase-11/11.1-initiatives/03_SERVICE_ARCHITECTURE.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_COMMAND_MODEL.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_LIFECYCLE_ENGINE.md",
  "docs/phase-11/11.1-initiatives/WAVE_3_CERTIFICATION.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_AUTHORITY_RESOLUTION.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_CHARTER_VALIDATION.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_OWNERSHIP_ENGINE.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_DOMAIN_ERRORS.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_DOMAIN_EVENTS.md",
  "docs/phase-11/11.1-initiatives/WAVE_3_TEST_PLAN.md",
];

for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.1/services/domain-service.ts",
  "src/lib/civic-action/builds/11.1/services/commands.ts",
  "src/lib/civic-action/builds/11.1/services/charter-validator.ts",
  "src/lib/civic-action/builds/11.1/services/owner-eligibility.ts",
  "src/lib/civic-action/builds/11.1/services/dependency-graph.ts",
  "src/lib/civic-action/builds/11.1/services/repository.ts",
  "src/lib/civic-action/builds/11.1/services/events.ts",
  "src/lib/civic-action/builds/11.1/w3.ts",
  "src/lib/civic-action/builds/11.1/w3-tests.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w3 = reqs.requirements.filter((r) => r.build === "11.1" && r.wave === "W3");
if (w3.length < 40) fail(`expected 40+ W3 requirements, got ${w3.length}`);
const implemented = w3.filter((r) => r.status === "implemented");
if (implemented.length < 40) fail(`expected 40 implemented W3 requirements, got ${implemented.length}`);

const ds = readFileSync(join(root, "src/lib/civic-action/builds/11.1/services/domain-service.ts"), "utf8");
for (const sym of ["createDraft", "submitForReview", "activate", "assertInitiativeMutationViaService"]) {
  if (!ds.includes(sym)) fail(`domain-service missing ${sym}`);
}

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w3-tests.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (testRun.status !== 0) fail("W3 service tests failed");

if (failed) process.exit(1);
console.log("CAE-11.1-W3 Initiative service engine checks passed");
