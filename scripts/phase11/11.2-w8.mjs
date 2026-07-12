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
  "docs/phase-11/11.2-objectives/08_PRODUCTION_READINESS.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_PRODUCTION_CONSTITUTION.md",
  "docs/phase-11/11.2-objectives/PROTOCOL_8_CERTIFICATION.md",
  "docs/phase-11/11.2-objectives/BUILD_11.2_COMPLETE.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.2/production/launch-control.ts",
  "src/lib/civic-action/builds/11.2/w8.ts",
  "src/app/api/v1/objectives/production/launch/route.ts",
  "src/features/objectives/components/ObjectiveLaunchControlCenter.tsx",
  "data/phase-11/objective_production_manifest.json",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w8 = reqs.requirements.filter((r) => r.build === "11.2" && r.wave === "W8");
if (w8.length < 15) fail(`expected 15+ W8 requirements, got ${w8.length}`);

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w8-tests-11.2.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (testRun.status !== 0) fail("W8 production tests failed");

if (failed) process.exit(1);
console.log("CAE-11.2-W8 Objective Production Readiness checks passed");
