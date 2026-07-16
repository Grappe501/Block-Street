import "../h-drive-env.mjs";
import { spawnSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const dir = dirname(fileURLToPath(import.meta.url));
const node = process.execPath;
const scripts = [
  "validate-calendar-conflicts.mjs",
  "test-calendar-conflicts-phase2-model.mjs",
  "test-calendar-conflicts-phase2-readiness.mjs",
  "test-calendar-wave5b-workflow.mjs",
];

for (const script of scripts) {
  const res = spawnSync(node, [join(dir, script)], { stdio: "inherit", env: process.env });
  if (res.status !== 0) process.exit(res.status ?? 1);
}
console.log("test:calendar:wave5b PASS");
