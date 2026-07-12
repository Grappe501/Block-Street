#!/usr/bin/env node
/**
 * CAE-11.2-W4 — Objective Human Experience validation
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
  "docs/phase-11/11.2-objectives/OBJECTIVE_WORKBENCH_PROTOCOL.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_DASHBOARD.md",
  "docs/phase-11/11.2-objectives/MISSION_WORKSPACE.md",
  "docs/phase-11/11.2-objectives/WORKSTREAM_BOARD.md",
  "docs/phase-11/11.2-objectives/TODAYS_WORK_EXPERIENCE.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_PROGRESS_STANDARD.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_ACCESSIBILITY_STANDARD.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_SPANISH_EXPERIENCE.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_EMPTY_STATE_GUIDE.md",
  "docs/phase-11/11.2-objectives/PROTOCOL_4_CERTIFICATION.md",
];

for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.2/ux/assemble-workspace.ts",
  "src/lib/civic-action/builds/11.2/ux/assemble-portfolio.ts",
  "src/lib/civic-action/builds/11.2/w4.ts",
  "src/lib/civic-action/builds/11.2/w4-tests.ts",
  "src/features/objectives/components/ObjectiveWorkspaceShell.tsx",
  "src/app/(site)/initiatives/[id]/objectives/page.tsx",
  "src/app/api/v1/civic-action/objectives/commands/route.ts",
];

for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w4 = reqs.requirements.filter((r) => r.build === "11.2" && r.wave === "W4");
if (w4.length < 20) fail(`expected 20+ W4 requirements, got ${w4.length}`);
const implemented = w4.filter((r) => r.status === "implemented");
if (implemented.length < 20) fail(`expected 20 implemented W4 requirements, got ${implemented.length}`);

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w4-tests-11.2.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (testRun.status !== 0) fail("W4 experience tests failed");

if (failed) process.exit(1);
console.log("CAE-11.2-W4 Objective Human Experience checks passed");
