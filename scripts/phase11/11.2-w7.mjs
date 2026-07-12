#!/usr/bin/env node
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
  "docs/phase-11/11.2-objectives/07_OPTIMIZATION_LAYER.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_OPTIMIZATION_PROTOCOL.md",
  "docs/phase-11/11.2-objectives/PROTOCOL_7_CERTIFICATION.md",
  "docs/phase-11/11.2-objectives/LESSONS_LEARNED_STANDARD.md",
  "docs/phase-11/11.2-objectives/INSTITUTIONAL_MEMORY_STANDARD.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.2/optimization/continuous-improvement.ts",
  "src/lib/civic-action/builds/11.2/optimization/lesson-engine.ts",
  "src/lib/civic-action/builds/11.2/w7.ts",
  "src/app/api/v1/optimization/objectives/route.ts",
  "src/app/api/v1/ai/objectives/optimize/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w7 = reqs.requirements.filter((r) => r.build === "11.2" && r.wave === "W7");
if (w7.length < 15) fail(`expected 15+ W7 requirements, got ${w7.length}`);

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w7-tests-11.2.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (testRun.status !== 0) fail("W7 optimization tests failed");

if (failed) process.exit(1);
console.log("CAE-11.2-W7 Objective Optimization checks passed");
