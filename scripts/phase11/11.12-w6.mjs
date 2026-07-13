#!/usr/bin/env node
/**
 * CAE-11.12-W6 — Knowledge intelligence validation
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
  "docs/phase-11/11.12-adaptive-learning/06_KNOWLEDGE_INTELLIGENCE_ADAPTIVE_LEARNING.md",
  "docs/phase-11/11.12-adaptive-learning/KNOWLEDGE_INTELLIGENCE_PROTOCOL.md",
  "docs/phase-11/11.12-adaptive-learning/PROTOCOL_6_CERTIFICATION.md",
];

for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.12/intelligence/orchestrator.ts",
  "src/lib/civic-action/builds/11.12/w6.ts",
  "src/lib/civic-action/builds/11.12/w6-tests.ts",
  "src/app/api/v1/intelligence/knowledge/query/route.ts",
  "src/app/api/v1/ai/knowledge/query/route.ts",
  "data/phase-11/knowledge_intelligence_registry.json",
];

for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w6 = reqs.requirements.filter((r) => r.build === "11.12" && r.wave === "W6");
if (w6.length < 16) fail(`expected 16+ W6 requirements, got ${w6.length}`);
const implemented = w6.filter((r) => r.status === "implemented");
if (implemented.length < 16) fail(`expected 16 implemented W6 requirements, got ${implemented.length}`);

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w6-tests-11.12.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (testRun.status !== 0) fail("W6 intelligence tests failed");

if (failed) process.exit(1);
console.log("CAE-11.12-W6 Knowledge Intelligence checks passed");
