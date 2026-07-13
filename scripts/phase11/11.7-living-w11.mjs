#!/usr/bin/env node
/**
 * CAE-11.7-W11 — Federation Runtime validation
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
  "docs/phase-11/11.7-living-intelligence/11_FEDERATED_INSTITUTIONAL_INTELLIGENCE.md",
  "docs/phase-11/11.7-living-intelligence/FEDERATION_CONSTITUTION.md",
  "docs/phase-11/11.7-living-intelligence/WAVE_11_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.7/living/federation/constitution.ts",
  "src/lib/civic-action/builds/11.7/living/federation/services/federation-service.ts",
  "src/app/api/v1/localbrain/federation/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const constitution = readFileSync(
  join(root, "src/lib/civic-action/builds/11.7/living/federation/constitution.ts"),
  "utf8"
);
if (!constitution.includes("LIX_FEDERATION_PRINCIPLE")) fail("constitution missing principle");

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w11 = reqs.requirements.filter((r) => r.build === "11.7-lix" && r.wave === "W11");
if (w11.length < 25) fail(`expected 25+ W11 requirements, got ${w11.length}`);

const w10Run = spawnSync("node", [join(root, "scripts/phase11/11.7-living-w10.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (w10Run.status !== 0) fail("W10 Partnership prerequisite failed");

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w11-tests-11.7-living.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W11 federation tests failed");

if (failed) process.exit(1);
console.log("CAE-11.7-W11 Federation Runtime checks passed");
