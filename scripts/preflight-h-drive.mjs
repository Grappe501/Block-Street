#!/usr/bin/env node
/**
 * Preflight: fail builds when workspace/temp are not on H: or C: is critically full.
 * Usage: node scripts/preflight-h-drive.mjs
 */
import { statfsSync } from "fs";
import { execSync } from "child_process";
import { parse } from "path";
import { REPO_ROOT, applyHDriveEnv } from "./h-drive-env.mjs";

applyHDriveEnv();

const WARN_GB = 10;
const HARD_STOP_GB = 5;
const repoDrive = parse(REPO_ROOT).root?.toUpperCase() ?? "H:\\";

function freeGb(driveRoot) {
  try {
    if (process.platform === "win32") {
      const letter = driveRoot.replace(/[\\/:]/g, "").charAt(0);
      const out = execSync(
        `powershell -NoProfile -Command "(Get-PSDrive -Name '${letter}').Free / 1GB"`,
        { encoding: "utf8" }
      );
      const n = parseFloat(out.trim());
      return Number.isFinite(n) ? n : null;
    }
    const stats = statfsSync(driveRoot);
    return stats.bavail / stats.bsize / 1024 ** 3;
  } catch {
    return null;
  }
}

const errors = [];
const warnings = [];

if (repoDrive !== "H:\\") {
  errors.push(`Repository must be on H: (found ${repoDrive})`);
}

for (const [label, value] of [
  ["TEMP", process.env.TEMP],
  ["TMP", process.env.TMP],
  ["npm_config_cache", process.env.npm_config_cache],
]) {
  if (!value) {
    warnings.push(`${label} is not set`);
    continue;
  }
  const drive = parse(value).root?.toUpperCase();
  if (drive === "C:\\") {
    errors.push(`${label} points to C: (${value}) — must use H:\\Block-Street\\.tmp or .npm-cache`);
  }
}

const cFree = freeGb("C:\\");
const tempOnC = [process.env.TEMP, process.env.TMP].some(
  (v) => v && parse(v).root?.toUpperCase() === "C:\\"
);
if (cFree != null) {
  if (cFree < HARD_STOP_GB && tempOnC) {
    errors.push(`C: free space ${cFree.toFixed(2)} GB — hard stop below ${HARD_STOP_GB} GB while TEMP/TMP on C:`);
  } else if (cFree < HARD_STOP_GB) {
    warnings.push(`C: free space ${cFree.toFixed(2)} GB — relocate Cursor state; TEMP is correctly on H:`);
  } else if (cFree < WARN_GB) {
    warnings.push(`C: free space ${cFree.toFixed(2)} GB — warning below ${WARN_GB} GB`);
  }
}

const hFree = freeGb("H:\\");
if (hFree != null && hFree < 20) {
  warnings.push(`H: free space ${hFree.toFixed(2)} GB — consider cleanup`);
}

if (warnings.length) {
  console.warn("preflight warnings:");
  for (const w of warnings) console.warn(`  ⚠ ${w}`);
}

if (errors.length) {
  console.error("preflight FAILED:");
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}

console.log(`preflight ok — repo ${REPO_ROOT}, C: ${cFree?.toFixed(1) ?? "?"} GB free`);
