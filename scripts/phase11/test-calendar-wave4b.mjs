import "../h-drive-env.mjs";
import { spawnSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const dir = dirname(fileURLToPath(import.meta.url));
const node = process.execPath;
const scripts = [
  "validate-calendar-core-record.mjs",
  "test-calendar-core-record-model.mjs",
  "test-calendar-core-record-readiness.mjs",
  "test-calendar-wave4b-workflow.mjs",
];

for (const script of scripts) {
  const res = spawnSync(node, [join(dir, script)], { stdio: "inherit", env: process.env });
  if (res.status !== 0) process.exit(res.status ?? 1);
}
console.log("test:calendar:wave4b PASS");
