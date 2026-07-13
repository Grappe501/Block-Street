#!/usr/bin/env node
import "../h-drive-env.mjs";
import { spawnSync } from "child_process";
import { join } from "path";
import { hDriveEnv, REPO_ROOT } from "../h-drive-env.mjs";

const r = spawnSync("npx", ["tsx", join(REPO_ROOT, "scripts/phase11/run-w6-tests-11.12.ts")], {
  cwd: REPO_ROOT,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});
process.exit(r.status ?? 1);
