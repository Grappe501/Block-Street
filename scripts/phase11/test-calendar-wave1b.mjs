/**
 * CAL-P2 Wave 1B — orchestrated wave tests.
 */
import "../h-drive-env.mjs";
import { spawnSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const node = process.execPath;

const scripts = [
  "test-calendar-templates.mjs",
  "test-calendar-template-application.mjs",
  "test-calendar-recurrence.mjs",
  "test-calendar-series.mjs",
  "test-calendar-series-exceptions.mjs",
];

for (const script of scripts) {
  const res = spawnSync(node, [join(__dirname, script)], { stdio: "inherit", env: process.env });
  if (res.status !== 0) process.exit(res.status ?? 1);
}

console.log("test:calendar:wave1b PASS");
