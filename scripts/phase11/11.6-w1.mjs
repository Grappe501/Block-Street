#!/usr/bin/env node
/**
 * CAE-11.6-W1 — Strategic Planning Constitution validation
 */
import "../h-drive-env.mjs";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { spawnSync } from "child_process";
import { hDriveEnv, REPO_ROOT } from "../h-drive-env.mjs";

const root = REPO_ROOT;
let failed = 0;
function fail(msg) {
  console.error(`FAIL: ${msg}`);
  failed++;
}

const docs = [
  "docs/phase-11/11.6-institutional-operations/01_CONSTITUTION.md",
  "docs/phase-11/11.6-institutional-operations/STRATEGY_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/STRATEGY_TRACEABILITY_STANDARD.md",
  "docs/phase-11/11.6-institutional-operations/STRATEGY_AI_BOUNDARIES.md",
  "docs/phase-11/11.6-institutional-operations/STRATEGY_SPANISH_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/STRATEGIC_HIERARCHY.md",
  "docs/phase-11/11.6-institutional-operations/WAVE_1_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.6/constitution.ts",
  "src/lib/civic-action/builds/11.6/w1.ts",
  "src/lib/civic-action/builds/11.6/services/strategic-planning-service.ts",
  "src/app/api/v1/strategy/dashboard/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const constitution = readFileSync(join(root, "src/lib/civic-action/builds/11.6/constitution.ts"), "utf8");
for (const term of ["OPS_GOVERNING_PRINCIPLE", "STRATEGIC_ARCHITECTURE", "TRACEABILITY_CHAIN", "REQUIRED_DOMAIN_SERVICES", "AI_MAY_NOT", "SPANISH_GLOSSARY"]) {
  if (!constitution.includes(term)) fail(`constitution missing ${term}`);
}

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w1 = reqs.requirements.filter((r) => r.build === "11.6" && r.wave === "W1");
if (w1.length < 30) fail(`expected 30+ W1 requirements, got ${w1.length}`);

const vocab = JSON.parse(readFileSync(join(root, "data/phase-11/strategy_vocabulary.json"), "utf8"));
if ((vocab.terms?.length ?? 0) < 20) fail("vocabulary too small");

const hierarchy = JSON.parse(readFileSync(join(root, "data/phase-11/strategy_hierarchy.json"), "utf8"));
if ((hierarchy.levels?.length ?? 0) < 14) fail("hierarchy incomplete");

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w1-tests-11.6.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W1 strategy tests failed");

if (failed) process.exit(1);
console.log("CAE-11.6-W1 Strategic Planning Constitution checks passed");
