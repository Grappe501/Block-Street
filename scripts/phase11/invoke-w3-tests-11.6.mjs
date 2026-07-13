#!/usr/bin/env node
import { spawnSync } from "child_process";
import { join } from "path";
import { existsSync } from "fs";

const root = process.cwd();
const tsxCli = join(root, "node_modules", "tsx", "dist", "cli.mjs");
const script = join(root, "scripts/phase11/run-w3-tests-11.6.ts");
const args = existsSync(tsxCli) ? ["node", tsxCli, script] : ["npx", "--yes", "tsx", script];
const r = spawnSync(args[0], args.slice(1), { cwd: root, stdio: "inherit", shell: process.platform === "win32" });
process.exit(r.status ?? 1);
