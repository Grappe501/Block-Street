#!/usr/bin/env node
/**
 * Run a command with TEMP/TMP/npm cache redirected to H:\Block-Street\.tmp
 * Usage: node scripts/run-with-h-env.mjs <command> [args...]
 */
import { spawnSync } from "child_process";
import { hDriveEnv, REPO_ROOT } from "./h-drive-env.mjs";

const [, , command, ...args] = process.argv;

if (!command) {
  console.error("Usage: node scripts/run-with-h-env.mjs <command> [args...]");
  process.exit(1);
}

const result = spawnSync(command, args, {
  cwd: REPO_ROOT,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: hDriveEnv(),
});

process.exit(result.status ?? 1);
