#!/usr/bin/env node
/**
 * CAE-11.6-W12 — Federation validation
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
  "docs/phase-11/11.6-institutional-operations/12_FEDERATION_COLLABORATION_PROTOCOL.md",
  "docs/phase-11/11.6-institutional-operations/FEDERATION_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/FEDERATION_GOVERNANCE.md",
  "docs/phase-11/11.6-institutional-operations/SHARED_MISSIONS.md",
  "docs/phase-11/11.6-institutional-operations/FEDERATION_AGREEMENTS.md",
  "docs/phase-11/11.6-institutional-operations/WAVE_12_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.6/federation/constitution.ts",
  "src/lib/civic-action/builds/11.6/federation/w12.ts",
  "src/lib/civic-action/builds/11.6/federation/services/federation-ops-service.ts",
  "src/app/api/v1/federations/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const constitution = readFileSync(join(root, "src/lib/civic-action/builds/11.6/federation/constitution.ts"), "utf8");
for (const term of ["OPS_FEDERATION_PRINCIPLE", "FEDERATION_ARCHITECTURE", "REQUIRED_FEDERATION_SERVICES", "FEDERATION_AI_MAY_NOT"]) {
  if (!constitution.includes(term)) fail(`constitution missing ${term}`);
}

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w12 = reqs.requirements.filter((r) => r.build === "11.6" && r.wave === "W12");
if (w12.length < 30) fail(`expected 30+ W12 requirements, got ${w12.length}`);

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w12-tests-11.6.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W12 federation tests failed");

if (failed) process.exit(1);
console.log("CAE-11.6-W12 Federation checks passed");
