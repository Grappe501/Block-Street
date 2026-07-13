#!/usr/bin/env node
/**
 * CAE-11.12-W4 — Human Experience validation
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
  "docs/phase-11/11.12-adaptive-learning/04_HUMAN_EXPERIENCE_PROTOCOL.md",
  "docs/phase-11/11.12-adaptive-learning/LEARNING_WORKBENCH_PROTOCOL.md",
  "docs/phase-11/11.12-adaptive-learning/LEARNING_ACCESSIBILITY_STANDARD.md",
  "docs/phase-11/11.12-adaptive-learning/LEARNING_SPANISH_STANDARD.md",
  "docs/phase-11/11.12-adaptive-learning/PROTOCOL_4_CERTIFICATION.md",
];

for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.12/ux/assemble-home.ts",
  "src/lib/civic-action/builds/11.12/w4.ts",
  "src/lib/civic-action/builds/11.12/w4-tests.ts",
  "src/features/knowledge/components/LearningWorkbenchShell.tsx",
  "src/app/(site)/learning/page.tsx",
  "src/app/api/v1/workspace/home/route.ts",
];

for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w4 = reqs.requirements.filter((r) => r.build === "11.12" && r.wave === "W4");
if (w4.length < 16) fail(`expected 16+ W4 requirements, got ${w4.length}`);
const implemented = w4.filter((r) => r.status === "implemented");
if (implemented.length < 16) fail(`expected 16 implemented W4 requirements, got ${implemented.length}`);

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w4-tests-11.12.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W4 experience tests failed");

if (failed) process.exit(1);
console.log("CAE-11.12-W4 Human Experience checks passed");
