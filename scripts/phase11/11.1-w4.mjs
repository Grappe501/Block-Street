#!/usr/bin/env node
/**
 * CAE-11.1-W4 — Initiative Human Workflows validation
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
  "docs/phase-11/11.1-initiatives/04_UI_AND_WORKFLOWS.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_EXPERIENCE_CONSTITUTION.md",
  "docs/phase-11/11.1-initiatives/WAVE_4_CERTIFICATION.md",
  "docs/phase-11/11.1-initiatives/WAVE_5_API_HANDOFF.md",
];

for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.1/ux/assemble-portfolio.ts",
  "src/lib/civic-action/builds/11.1/ux/assemble-workspace.ts",
  "src/lib/civic-action/builds/11.1/ux/human-messages.ts",
  "src/lib/civic-action/builds/11.1/w4.ts",
  "src/lib/civic-action/builds/11.1/w4-tests.ts",
  "src/app/(site)/initiatives/page.tsx",
  "src/app/api/v1/civic-action/initiatives/commands/route.ts",
];

for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w4 = reqs.requirements.filter((r) => r.build === "11.1" && r.wave === "W4");
if (w4.length < 20) fail(`expected 20+ W4 requirements, got ${w4.length}`);

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w4-tests.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (testRun.status !== 0) fail("W4 experience tests failed");

if (failed) process.exit(1);
console.log("CAE-11.1-W4 Initiative Human Workflows checks passed");
