#!/usr/bin/env node
import { spawnSync } from "child_process";
import { join } from "path";

const root = process.cwd();
const r = spawnSync("npx", ["tsx", join(root, "scripts/phase11/run-w6-tests-11.2.ts")], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});
process.exit(r.status ?? 1);
