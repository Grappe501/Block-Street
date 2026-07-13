#!/usr/bin/env node
/**
 * CAE-11.7-W5 — Communication API, events, and integration validation
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
  "docs/phase-11/11.7-communications/05_API_EVENTS_INTEGRATIONS.md",
  "docs/phase-11/11.7-communications/COMMUNICATION_API_PROTOCOL.md",
  "docs/phase-11/11.7-communications/COMMUNICATION_EVENT_STANDARD.md",
  "docs/phase-11/11.7-communications/PROTOCOL_5_CERTIFICATION.md",
];

for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.7/api/context.ts",
  "src/lib/civic-action/builds/11.7/w5.ts",
  "src/lib/civic-action/builds/11.7/w5-tests.ts",
  "src/app/api/v1/communications/route.ts",
  "src/app/api/v1/communications/commands/route.ts",
  "src/app/api/v1/communications/search/route.ts",
  "data/phase-11/communication_event_catalog.json",
];

for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w5 = reqs.requirements.filter((r) => r.build === "11.7" && r.wave === "W5");
if (w5.length < 24) fail(`expected 24+ W5 requirements, got ${w5.length}`);
const implemented = w5.filter((r) => r.status === "implemented");
if (implemented.length < 24) fail(`expected 24 implemented W5 requirements, got ${implemented.length}`);

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w5-tests-11.7.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (testRun.status !== 0) fail("W5 API tests failed");

if (failed) process.exit(1);
console.log("CAE-11.7-W5 Communication APIs, Events, and Integrations checks passed");
