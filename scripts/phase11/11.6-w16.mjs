#!/usr/bin/env node
/**
 * CAE-11.6-W16 — Evolution validation
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
  "docs/phase-11/11.6-institutional-operations/16_EVOLUTION_CANONFORGE_PROTOCOL.md",
  "docs/phase-11/11.6-institutional-operations/EVOLUTION_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/CANONFORGE_ENGINE.md",
  "docs/phase-11/11.6-institutional-operations/CONSTITUTION_LAYERS.md",
  "docs/phase-11/11.6-institutional-operations/WAVE_16_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.6/evolution/constitution.ts",
  "src/lib/civic-action/builds/11.6/evolution/w16.ts",
  "src/lib/civic-action/builds/11.6/evolution/services/evolution-service.ts",
  "src/app/api/v1/evolution/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const constitution = readFileSync(join(root, "src/lib/civic-action/builds/11.6/evolution/constitution.ts"), "utf8");
for (const term of ["OPS_EVOLUTION_PRINCIPLE", "EVOLUTION_ARCHITECTURE", "REQUIRED_EVOLUTION_SERVICES", "EVOLUTION_AI_MAY_NOT"]) {
  if (!constitution.includes(term)) fail(`constitution missing ${term}`);
}

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w16 = reqs.requirements.filter((r) => r.build === "11.6" && r.wave === "W16");
if (w16.length < 30) fail(`expected 30+ W16 requirements, got ${w16.length}`);

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w16-tests-11.6.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W16 certification tests failed");

if (failed) process.exit(1);
console.log("CAE-11.6-W16 Evolution checks passed");
