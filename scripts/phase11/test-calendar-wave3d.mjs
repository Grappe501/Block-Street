import "../h-drive-env.mjs";
import { spawnSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const dir = dirname(fileURLToPath(import.meta.url));
const node = process.execPath;
const scripts = [
  "validate-calendar-rsvp.mjs",
  "validate-calendar-verification.mjs",
  "test-calendar-rsvp-model.mjs",
  "test-calendar-verification-model.mjs",
  "test-calendar-attendance-readiness.mjs",
  "test-calendar-wave3d-workflow.mjs",
];

for (const script of scripts) {
  const res = spawnSync(node, [join(dir, script)], { stdio: "inherit", env: process.env });
  if (res.status !== 0) process.exit(res.status ?? 1);
}
console.log("test:calendar:wave3d PASS");
