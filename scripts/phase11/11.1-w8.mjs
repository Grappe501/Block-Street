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
  "docs/phase-11/11.1-initiatives/08_PRODUCTION_READINESS.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_PRODUCTION_CONSTITUTION.md",
  "docs/phase-11/11.1-initiatives/WAVE_8_CERTIFICATION.md",
  "docs/phase-11/11.1-initiatives/BUILD_11.1_COMPLETE.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.1/production/launch-control.ts",
  "src/lib/civic-action/builds/11.1/w8.ts",
  "src/app/api/v1/production/launch/route.ts",
  "src/features/initiatives/components/LaunchControlCenter.tsx",
  "data/phase-11/initiative_production_manifest.json",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w8 = reqs.requirements.filter((r) => r.build === "11.1" && r.wave === "W8");
if (w8.length < 15) fail(`expected 15+ W8 requirements, got ${w8.length}`);

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w8-tests.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (testRun.status !== 0) fail("W8 production tests failed");

if (failed) process.exit(1);
console.log("CAE-11.1-W8 Production Readiness checks passed");
