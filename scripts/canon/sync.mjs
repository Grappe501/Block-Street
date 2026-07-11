#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

function run(script) {
  const result = spawnSync(process.execPath, [join(__dirname, script)], { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status || 1);
}

run("validate.mjs");
run("index.mjs");
console.log("Canon sync complete (validate + index)");
