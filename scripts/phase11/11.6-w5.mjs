#!/usr/bin/env node
/**
 * CAE-11.6-W5 — Resource & stewardship validation
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
  "docs/phase-11/11.6-institutional-operations/05_RESOURCE_STEWARDSHIP_PROTOCOL.md",
  "docs/phase-11/11.6-institutional-operations/RESOURCE_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/RESOURCE_LIFECYCLE.md",
  "docs/phase-11/11.6-institutional-operations/BUDGET_MODEL.md",
  "docs/phase-11/11.6-institutional-operations/FACILITIES_MODEL.md",
  "docs/phase-11/11.6-institutional-operations/WAVE_5_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.6/resources/constitution.ts",
  "src/lib/civic-action/builds/11.6/resources/w5.ts",
  "src/lib/civic-action/builds/11.6/resources/services/resource-service.ts",
  "src/app/api/v1/assets/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const constitution = readFileSync(join(root, "src/lib/civic-action/builds/11.6/resources/constitution.ts"), "utf8");
for (const term of ["OPS_RESOURCE_PRINCIPLE", "RESOURCE_ARCHITECTURE", "REQUIRED_RESOURCE_SERVICES", "RESOURCE_AI_MAY_NOT"]) {
  if (!constitution.includes(term)) fail(`constitution missing ${term}`);
}

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w5 = reqs.requirements.filter((r) => r.build === "11.6" && r.wave === "W5");
if (w5.length < 30) fail(`expected 30+ W5 requirements, got ${w5.length}`);

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w5-tests-11.6.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W5 resource tests failed");

if (failed) process.exit(1);
console.log("CAE-11.6-W5 Resource & Stewardship checks passed");
