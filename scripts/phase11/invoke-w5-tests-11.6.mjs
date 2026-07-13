#!/usr/bin/env node
import { spawnSync } from "child_process";
import { join } from "path";
import { hDriveEnv, REPO_ROOT } from "../h-drive-env.mjs";

const result = spawnSync("npx", ["tsx", join(REPO_ROOT, "scripts/phase11/run-w5-tests-11.6.ts")], {
  cwd: REPO_ROOT,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
process.exit(result.status ?? 1);
