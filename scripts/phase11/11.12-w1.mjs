#!/usr/bin/env node
/**
 * CAE-11.12-W1 — Knowledge Constitution validation
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

const requiredDocs = [
  "docs/phase-11/11.12-adaptive-learning/01_CONSTITUTION.md",
  "docs/phase-11/11.12-adaptive-learning/README.md",
  "docs/phase-11/11.12-adaptive-learning/LEARNING_PHILOSOPHY.md",
  "docs/phase-11/11.12-adaptive-learning/AI_LEARNING_STANDARD.md",
];

for (const f of requiredDocs) {
  if (!existsSync(join(root, f))) fail(`missing doc ${f}`);
}

const constitutionMd = readFileSync(join(root, "docs/phase-11/11.12-adaptive-learning/01_CONSTITUTION.md"), "utf8");
for (const phrase of [
  "Knowledge exists to improve decisions",
  "Confidence must always be visible",
  "AI may never",
  "fabricate sources",
  "demonstrated capability",
  "Orphan knowledge is prohibited",
]) {
  if (!constitutionMd.toLowerCase().includes(phrase.toLowerCase())) {
    fail(`constitution md missing: ${phrase}`);
  }
}

if (!existsSync(join(root, "src/lib/civic-action/builds/11.12/constitution.ts"))) fail("missing constitution.ts");
if (!existsSync(join(root, "src/lib/civic-action/builds/11.12/w1.ts"))) fail("missing w1.ts");

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w1 = reqs.requirements.filter((r) => r.build === "11.12" && r.wave === "W1");
if (w1.length < 12) fail(`expected 12+ W1 requirements, got ${w1.length}`);
if (!w1.every((r) => r.status === "documented")) fail("W1 requirements must be status documented");

const certRun = spawnSync("node", ["--import", "tsx", join(root, "scripts/phase11/run-w1-cert-11.12.ts")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (certRun.status !== 0) fail("W1 certification failed");

if (failed) process.exit(1);
console.log("CAE-11.12-W1 Knowledge Constitution checks passed");
