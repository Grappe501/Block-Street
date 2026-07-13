/**
 * Force temp and npm cache onto the repo drive (H:) — never C:.
 * Import this module (side effect) or call applyHDriveEnv() before spawning children.
 */
import { mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = join(__dirname, "..");

export function applyHDriveEnv(root = REPO_ROOT) {
  const tmp = join(root, ".tmp");
  const npmCache = join(root, ".npm-cache");

  mkdirSync(tmp, { recursive: true });
  mkdirSync(npmCache, { recursive: true });

  process.env.TEMP = tmp;
  process.env.TMP = tmp;
  process.env.TMPDIR = tmp;
  process.env.npm_config_cache = npmCache;
  process.env.npm_config_tmp = tmp;
  process.env.NEXT_TELEMETRY_DISABLED = "1";

  return { root, tmp, npmCache };
}

/** Env object safe to pass to spawn/spawnSync */
export function hDriveEnv(root = REPO_ROOT) {
  const { tmp, npmCache } = applyHDriveEnv(root);
  return {
    ...process.env,
    TEMP: tmp,
    TMP: tmp,
    TMPDIR: tmp,
    npm_config_cache: npmCache,
    npm_config_tmp: tmp,
    NEXT_TELEMETRY_DISABLED: "1",
  };
}

// Auto-apply when imported
applyHDriveEnv();
