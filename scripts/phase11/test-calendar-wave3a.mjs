import "../h-drive-env.mjs";
import { spawnSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const dir = dirname(fileURLToPath(import.meta.url));
const node = process.execPath;
const scripts = [
  "validate-calendar-tasks.mjs",
  "test-calendar-task-blocking.mjs",
  "test-calendar-task-model.mjs",
  "test-calendar-task-dependencies.mjs",
  "test-calendar-task-readiness.mjs",
  "test-calendar-wave3a-workflow.mjs",
];

for (const script of scripts) {
  const res = spawnSync(node, [join(dir, script)], { stdio: "inherit", env: process.env });
  if (res.status !== 0) process.exit(res.status ?? 1);
}
console.log("test:calendar:wave3a PASS");
