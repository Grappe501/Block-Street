#!/usr/bin/env node
/**
 * CAE-11.12-W7 — Knowledge evolution validation
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
  "docs/phase-11/11.12-adaptive-learning/07_KNOWLEDGE_EVOLUTION_INSTITUTIONAL_WISDOM.md",
  "docs/phase-11/11.12-adaptive-learning/KNOWLEDGE_EVOLUTION_PROTOCOL.md",
  "docs/phase-11/11.12-adaptive-learning/PROTOCOL_7_CERTIFICATION.md",
];

for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.12/optimization/index.ts",
  "src/lib/civic-action/builds/11.12/w7.ts",
  "src/lib/civic-action/builds/11.12/w7-tests.ts",
  "src/app/api/v1/improvements/route.ts",
  "src/app/api/v1/optimization/knowledge/route.ts",
  "src/app/api/v1/ai/knowledge/optimize/route.ts",
  "data/phase-11/knowledge_improvement_registry.json",
];

for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w7 = reqs.requirements.filter((r) => r.build === "11.12" && r.wave === "W7");
if (w7.length < 16) fail(`expected 16+ W7 requirements, got ${w7.length}`);
const implemented = w7.filter((r) => r.status === "implemented");
if (implemented.length < 16) fail(`expected 16 implemented W7 requirements, got ${implemented.length}`);

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w7-tests-11.12.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W7 optimization tests failed");

if (failed) process.exit(1);
console.log("CAE-11.12-W7 Knowledge Evolution checks passed");
