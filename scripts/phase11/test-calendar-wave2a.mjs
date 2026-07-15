import "../h-drive-env.mjs";
import { spawnSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const dir = dirname(fileURLToPath(import.meta.url));
const node = process.execPath;
const scripts = [
  "test-calendar-staffing-model.mjs",
  "test-calendar-staffing-requirements.mjs",
  "test-calendar-shift-builder.mjs",
  "test-calendar-staffing-coverage.mjs",
  "test-calendar-staffing-training.mjs",
  "test-calendar-shift-leads.mjs",
  "test-calendar-staffing-interest.mjs",
  "test-calendar-staffing-readiness.mjs",
  "test-calendar-staffing-series.mjs",
];

for (const script of scripts) {
  const res = spawnSync(node, [join(dir, script)], { stdio: "inherit", env: process.env });
  if (res.status !== 0) process.exit(res.status ?? 1);
}
console.log("test:calendar:wave2a PASS");
