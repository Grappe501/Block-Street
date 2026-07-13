#!/usr/bin/env node
/**
 * CAE-11.12-W5 — Knowledge API, events, and integration validation
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
  "docs/phase-11/11.12-adaptive-learning/05_API_EVENTS_INTEGRATIONS.md",
  "docs/phase-11/11.12-adaptive-learning/KNOWLEDGE_API_PROTOCOL.md",
  "docs/phase-11/11.12-adaptive-learning/KNOWLEDGE_EVENT_STANDARD.md",
  "docs/phase-11/11.12-adaptive-learning/PROTOCOL_5_CERTIFICATION.md",
];

for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.12/api/context.ts",
  "src/lib/civic-action/builds/11.12/w5.ts",
  "src/lib/civic-action/builds/11.12/w5-tests.ts",
  "src/app/api/v1/knowledge/route.ts",
  "src/app/api/v1/knowledge/commands/route.ts",
  "src/app/api/v1/knowledge/search/route.ts",
  "data/phase-11/knowledge_event_catalog.json",
  "data/phase-11/knowledge_api_registry.json",
];

for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w5 = reqs.requirements.filter((r) => r.build === "11.12" && r.wave === "W5");
if (w5.length < 24) fail(`expected 24+ W5 requirements, got ${w5.length}`);
const implemented = w5.filter((r) => r.status === "implemented");
if (implemented.length < 24) fail(`expected 24 implemented W5 requirements, got ${implemented.length}`);

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w5-tests-11.12.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W5 API tests failed");

if (failed) process.exit(1);
console.log("CAE-11.12-W5 Knowledge APIs, Events, and Integrations checks passed");
