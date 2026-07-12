#!/usr/bin/env node
/**
 * CAE-11.2-W3 — Objective execution engine validation
 */
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
  "docs/phase-11/11.2-objectives/EXECUTION_ENGINE_PROTOCOL.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_DOMAIN_SERVICES.md",
  "docs/phase-11/11.2-objectives/MISSION_DOMAIN_SERVICES.md",
  "docs/phase-11/11.2-objectives/TASK_DOMAIN_SERVICES.md",
  "docs/phase-11/11.2-objectives/EXECUTION_STATE_MACHINES.md",
  "docs/phase-11/11.2-objectives/EXECUTION_POLICY_ENGINE.md",
  "docs/phase-11/11.2-objectives/COMMAND_PIPELINE.md",
  "docs/phase-11/11.2-objectives/EVENT_PUBLISHING_STANDARD.md",
  "docs/phase-11/11.2-objectives/VERSIONING_ENGINE.md",
  "docs/phase-11/11.2-objectives/AUDIT_ENGINE.md",
  "docs/phase-11/11.2-objectives/PROTOCOL_3_CERTIFICATION.md",
];

for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.2/services/execution-engine.ts",
  "src/lib/civic-action/builds/11.2/services/commands.ts",
  "src/lib/civic-action/builds/11.2/services/validation-pipeline.ts",
  "src/lib/civic-action/builds/11.2/services/events.ts",
  "src/lib/civic-action/builds/11.2/services/repository.ts",
  "src/lib/civic-action/builds/11.2/services/policy.ts",
  "src/lib/civic-action/builds/11.2/services/dependency-engine.ts",
  "src/lib/civic-action/builds/11.2/services/version-audit.ts",
  "src/lib/civic-action/builds/11.2/w3.ts",
  "src/lib/civic-action/builds/11.2/w3-tests.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w3 = reqs.requirements.filter((r) => r.build === "11.2" && r.wave === "W3");
if (w3.length < 40) fail(`expected 40+ W3 requirements, got ${w3.length}`);
const implemented = w3.filter((r) => r.status === "implemented");
if (implemented.length < 40) fail(`expected 40 implemented W3 requirements, got ${implemented.length}`);

const engine = readFileSync(join(root, "src/lib/civic-action/builds/11.2/services/execution-engine.ts"), "utf8");
for (const sym of ["createObjective", "approveObjective", "startMission", "createTask", "assertExecutionMutationViaService"]) {
  if (!engine.includes(sym)) fail(`execution-engine missing ${sym}`);
}

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w3-tests-11.2.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (testRun.status !== 0) fail("W3 service tests failed");

if (failed) process.exit(1);
console.log("CAE-11.2-W3 Objective execution engine checks passed");
