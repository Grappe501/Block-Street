#!/usr/bin/env node
/**
 * CAE-11.1-W5 — Initiative API, events, and integration validation
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
  "docs/phase-11/11.1-initiatives/05_API_EVENTS_INTEGRATIONS.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_API_CONSTITUTION.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_EVENT_CATALOG.md",
  "docs/phase-11/11.1-initiatives/WAVE_5_CERTIFICATION.md",
  "docs/phase-11/11.1-initiatives/WAVE_6_INTELLIGENCE_HANDOFF.md",
];

for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.1/api/context.ts",
  "src/lib/civic-action/builds/11.1/w5.ts",
  "src/lib/civic-action/builds/11.1/w5-tests.ts",
  "src/app/api/v1/initiatives/route.ts",
  "src/app/api/v1/initiatives/commands/route.ts",
  "src/app/api/v1/search/initiatives/route.ts",
  "data/phase-11/initiative_event_catalog.json",
];

for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w5 = reqs.requirements.filter((r) => r.build === "11.1" && r.wave === "W5");
if (w5.length < 20) fail(`expected 20+ W5 requirements, got ${w5.length}`);

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w5-tests.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (testRun.status !== 0) fail("W5 API tests failed");

if (failed) process.exit(1);
console.log("CAE-11.1-W5 Initiative APIs, Events, and Integrations checks passed");
