#!/usr/bin/env node
/**
 * CAE-11.6-W6 — Calendar & time intelligence validation
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
  "docs/phase-11/11.6-institutional-operations/06_CALENDAR_TIME_PROTOCOL.md",
  "docs/phase-11/11.6-institutional-operations/CALENDAR_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/EVENT_LIFECYCLE.md",
  "docs/phase-11/11.6-institutional-operations/SCHEDULING_MODEL.md",
  "docs/phase-11/11.6-institutional-operations/TIME_ZONE_MODEL.md",
  "docs/phase-11/11.6-institutional-operations/WAVE_6_CERTIFICATION.md",
];
for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.6/calendar/constitution.ts",
  "src/lib/civic-action/builds/11.6/calendar/w6.ts",
  "src/lib/civic-action/builds/11.6/calendar/services/calendar-service.ts",
  "src/app/api/v1/calendar/route.ts",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const constitution = readFileSync(join(root, "src/lib/civic-action/builds/11.6/calendar/constitution.ts"), "utf8");
for (const term of ["OPS_CALENDAR_PRINCIPLE", "TIME_ARCHITECTURE", "REQUIRED_CALENDAR_SERVICES", "CALENDAR_AI_MAY_NOT"]) {
  if (!constitution.includes(term)) fail(`constitution missing ${term}`);
}

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w6 = reqs.requirements.filter((r) => r.build === "11.6" && r.wave === "W6");
if (w6.length < 30) fail(`expected 30+ W6 requirements, got ${w6.length}`);

const testRun = spawnSync("node", [join(root, "scripts/phase11/invoke-w6-tests-11.6.mjs")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
if (testRun.status !== 0) fail("W6 calendar tests failed");

if (failed) process.exit(1);
console.log("CAE-11.6-W6 Calendar & Time Intelligence checks passed");
