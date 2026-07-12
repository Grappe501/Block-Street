#!/usr/bin/env node
/**
 * Build 11.1 complete — all 8 waves
 */
import { spawnSync } from "child_process";
import { join } from "path";
import { existsSync } from "fs";

const root = process.cwd();
let failed = 0;

for (const wave of ["w1", "w2", "w3", "w4", "w5", "w6", "w7", "w8"]) {
  const script = join(root, `scripts/phase11/11.1-${wave}.mjs`);
  if (!existsSync(script)) {
    console.error(`FAIL: missing ${script}`);
    failed++;
    continue;
  }
  console.log(`\n--- Running 11.1-${wave} ---`);
  const r = spawnSync("node", [script], { cwd: root, stdio: "inherit", shell: process.platform === "win32" });
  if (r.status !== 0) failed++;
}

if (!existsSync(join(root, "docs/phase-11/11.1-initiatives/BUILD_11.1_COMPLETE.md"))) {
  console.error("FAIL: BUILD_11.1_COMPLETE.md missing");
  failed++;
}

if (failed) process.exit(1);
console.log("\nBuild 11.1 Initiative Engine — all 8 waves certified");
