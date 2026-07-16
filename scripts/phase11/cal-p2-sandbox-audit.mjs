import "../h-drive-env.mjs";
import { spawnSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const dir = dirname(fileURLToPath(import.meta.url));
const root = join(dir, "../..");
const node = process.execPath;
const env = process.env;

const steps = [
  ["test:calendar:wave4b", join(dir, "test-calendar-wave4b.mjs")],
  ["test:calendar:wave4a", join(dir, "test-calendar-wave4a.mjs")],
  ["test:calendar:wave3e", join(dir, "test-calendar-wave3e.mjs")],
  ["test:calendar:wave3d", join(dir, "test-calendar-wave3d.mjs")],
  ["test:calendar:wave3c", join(dir, "test-calendar-wave3c.mjs")],
  ["test:calendar:wave3b", join(dir, "test-calendar-wave3b.mjs")],
  ["test:calendar:wave3a", join(dir, "test-calendar-wave3a.mjs")],
  ["calendar:route-audit", join(dir, "audit-calendar-routes.mjs")],
];

for (const [label, script] of steps) {
  console.log(`\n=== ${label} ===`);
  const res = spawnSync(node, [script], { stdio: "inherit", env, cwd: root });
  if (res.status !== 0) {
    console.error(`FAILED: ${label}`);
    process.exit(res.status ?? 1);
  }
}

console.log("\n=== typecheck ===");
const tc = spawnSync(node, [join(root, "scripts", "run-with-h-env.mjs"), "npm", "run", "typecheck"], {
  stdio: "inherit",
  env,
  cwd: root,
});
if (tc.status !== 0) process.exit(tc.status ?? 1);

console.log("\n=== production build ===");
const build = spawnSync(node, [join(root, "scripts", "run-with-h-env.mjs"), "npm", "run", "build"], {
  stdio: "inherit",
  env,
  cwd: root,
});
if (build.status !== 0) process.exit(build.status ?? 1);

console.log("\ncal-p2:sandbox-audit PASS — netlify ready");
