#!/usr/bin/env node
/**
 * CAE-11.12-W8 — Production readiness validation
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
  "docs/phase-11/11.12-adaptive-learning/08_PRODUCTION_READINESS_CERTIFICATION.md",
  "docs/phase-11/11.12-adaptive-learning/KNOWLEDGE_PRODUCTION_CONSTITUTION.md",
  "docs/phase-11/11.12-adaptive-learning/PROTOCOL_8_CERTIFICATION.md",
  "docs/phase-11/11.12-adaptive-learning/BUILD_11.12_COMPLETE.md",
];

for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.12/production/launch-control.ts",
  "src/lib/civic-action/builds/11.12/w8.ts",
  "src/lib/civic-action/builds/11.12/w8-tests.ts",
  "src/app/api/v1/knowledge-certification/status/route.ts",
  "src/app/api/v1/knowledge-launch/go-no-go/route.ts",
  "src/features/knowledge/components/KnowledgeLaunchControlCenter.tsx",
  "data/phase-11/knowledge_production_manifest.json",
];

for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w8 = reqs.requirements.filter((r) => r.build === "11.12" && r.wave === "W8");
if (w8.length < 15) fail(`expected 15+ W8 requirements, got ${w8.length}`);
const implemented = w8.filter((r) => r.status === "implemented");
if (implemented.length < 15) fail(`expected 15 implemented W8 requirements, got ${implemented.length}`);

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w8-tests-11.12.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W8 production tests failed");

if (failed) process.exit(1);
console.log("CAE-11.12-W8 Knowledge Production Readiness checks passed");
