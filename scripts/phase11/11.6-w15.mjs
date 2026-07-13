#!/usr/bin/env node
/**
 * CAE-11.6-W15 — Certification validation
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
  "docs/phase-11/11.6-institutional-operations/15_CERTIFICATION_READINESS_PROTOCOL.md",
  "docs/phase-11/11.6-institutional-operations/CERTIFICATION_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/READINESS_FRAMEWORK.md",
  "docs/phase-11/11.6-institutional-operations/COMPLIANCE_ENGINE.md",
  "docs/phase-11/11.6-institutional-operations/LAUNCH_READINESS.md",
  "docs/phase-11/11.6-institutional-operations/WAVE_15_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.6/certification/constitution.ts",
  "src/lib/civic-action/builds/11.6/certification/w15.ts",
  "src/lib/civic-action/builds/11.6/certification/services/certification-service.ts",
  "src/app/api/v1/certifications/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const constitution = readFileSync(join(root, "src/lib/civic-action/builds/11.6/certification/constitution.ts"), "utf8");
for (const term of ["OPS_CERTIFICATION_PRINCIPLE", "CERTIFICATION_ARCHITECTURE", "REQUIRED_CERTIFICATION_SERVICES", "CERTIFICATION_AI_MAY_NOT"]) {
  if (!constitution.includes(term)) fail(`constitution missing ${term}`);
}

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w15 = reqs.requirements.filter((r) => r.build === "11.6" && r.wave === "W15");
if (w15.length < 30) fail(`expected 30+ W15 requirements, got ${w15.length}`);

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w15-tests-11.6.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W15 certification tests failed");

if (failed) process.exit(1);
console.log("CAE-11.6-W15 Certification checks passed");
