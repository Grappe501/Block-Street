#!/usr/bin/env node
/**
 * Build 11.12 complete — all 8 waves
 */
import "../h-drive-env.mjs";
import { spawnSync } from "child_process";
import { join } from "path";
import { existsSync } from "fs";
import { hDriveEnv, REPO_ROOT } from "../h-drive-env.mjs";

const root = REPO_ROOT;
let failed = 0;

for (const wave of ["w1", "w2", "w3", "w4", "w5", "w6", "w7", "w8"]) {
  const script = join(root, `scripts/phase11/11.12-${wave}.mjs`);
  if (!existsSync(script)) {
    console.error(`FAIL: missing ${script}`);
    failed++;
    continue;
  }
  console.log(`\n--- Running 11.12-${wave} ---`);
  const r = spawnSync("node", [script], {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
    env: hDriveEnv(),
  });
  if (r.status !== 0) failed++;
}

if (!existsSync(join(root, "docs/phase-11/11.12-adaptive-learning/BUILD_11.12_COMPLETE.md"))) {
  console.error("FAIL: BUILD_11.12_COMPLETE.md missing");
  failed++;
}

if (failed) process.exit(1);
console.log("\nBuild 11.12 Knowledge, Learning & Institutional Intelligence Engine — all 8 waves certified");
