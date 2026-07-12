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
  "docs/phase-11/11.2-objectives/06_INTELLIGENCE_LAYER.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_INTELLIGENCE_PROTOCOL.md",
  "docs/phase-11/11.2-objectives/PROTOCOL_6_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.2/intelligence/recommendation-engine.ts",
  "src/lib/civic-action/builds/11.2/w6.ts",
  "src/app/api/v1/intelligence/objectives/recommendations/route.ts",
  "src/app/api/v1/ai/objectives/query/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w6 = reqs.requirements.filter((r) => r.build === "11.2" && r.wave === "W6");
if (w6.length < 15) fail(`expected 15+ W6 requirements, got ${w6.length}`);

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w6-tests-11.2.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (testRun.status !== 0) fail("W6 intelligence tests failed");

if (failed) process.exit(1);
console.log("CAE-11.2-W6 Objective Intelligence checks passed");
