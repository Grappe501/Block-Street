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
  "docs/phase-11/11.1-initiatives/07_OPTIMIZATION_LAYER.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_OPTIMIZATION_CONSTITUTION.md",
  "docs/phase-11/11.1-initiatives/WAVE_7_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.1/optimization/continuous-improvement.ts",
  "src/lib/civic-action/builds/11.1/w7.ts",
  "src/app/api/v1/optimization/route.ts",
  "src/app/api/v1/ai/optimize/route.ts",
  "src/features/initiatives/components/ImprovementDashboard.tsx",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w7 = reqs.requirements.filter((r) => r.build === "11.1" && r.wave === "W7");
if (w7.length < 15) fail(`expected 15+ W7 requirements, got ${w7.length}`);

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w7-tests.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (testRun.status !== 0) fail("W7 optimization tests failed");

if (failed) process.exit(1);
console.log("CAE-11.1-W7 Institutional Optimization checks passed");
