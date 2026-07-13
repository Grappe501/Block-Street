#!/usr/bin/env node
/**
 * CAE-11.7-W2 — Communications Canonical Data Model validation
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
  "docs/phase-11/11.7-communications/02_CANONICAL_MODEL_PROTOCOL.md",
  "docs/phase-11/11.7-communications/COMMUNICATION_STATE_MACHINE.md",
  "docs/phase-11/11.7-communications/COMMUNICATION_EVENT_STANDARD.md",
  "docs/phase-11/11.7-communications/COMMUNICATION_VERSIONING_GUIDE.md",
  "docs/phase-11/PROTOCOL_ARCHITECTURE.md",
];

for (const f of docs) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const code = [
  "src/lib/civic-action/builds/11.7/data-model.ts",
  "src/lib/civic-action/builds/11.7/state-machines.ts",
  "src/lib/civic-action/builds/11.7/w2.ts",
  "data/phase-11/communication_event_catalog.json",
];
for (const f of code) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const dm = readFileSync(join(root, "src/lib/civic-action/builds/11.7/data-model.ts"), "utf8");
for (const sym of ["ConversationRecord", "MessageRecord", "DecisionRecord", "COMMUNICATION_STORE_KEYS", "CommunicationVersionRecord"]) {
  if (!dm.includes(sym)) fail(`data-model missing ${sym}`);
}

const events = JSON.parse(readFileSync(join(root, "data/phase-11/communication_event_catalog.json"), "utf8"));
if ((events.events?.length ?? 0) < 10) fail("event catalog too small");

const reqs = JSON.parse(readFileSync(join(root, "data/civic-action/requirements_registry.json"), "utf8"));
const w2 = reqs.requirements.filter((r) => r.build === "11.7" && r.wave === "W2");
if (w2.length < 10) fail(`expected 10+ W2 requirements, got ${w2.length}`);
if (!w2.every((r) => r.status === "documented")) fail("W2 requirements must be documented");

const certRun = spawnSync("node", ["--import", "tsx", join(root, "scripts/phase11/run-w2-cert-11.7.ts")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (certRun.status !== 0) fail("W2 certification failed");

if (failed) process.exit(1);
console.log("CAE-11.7-W2 Communications Canonical Data Model Protocol checks passed");
