/**
 * Force temp and tool caches onto the repo drive (H:) — never C:.
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
  const caches = join(root, ".caches");

  for (const dir of [
    tmp,
    npmCache,
    caches,
    join(caches, "pip"),
    join(caches, "pnpm-store"),
    join(caches, "playwright"),
    join(caches, "node-gyp"),
    join(caches, "uv"),
  ]) {
    mkdirSync(dir, { recursive: true });
  }

  process.env.TEMP = tmp;
  process.env.TMP = tmp;
  process.env.TMPDIR = tmp;
  process.env.npm_config_cache = npmCache;
  process.env.npm_config_tmp = tmp;
  process.env.PIP_CACHE_DIR = join(caches, "pip");
  process.env.UV_CACHE_DIR = join(caches, "uv");
  process.env.XDG_CACHE_HOME = caches;
  process.env.PNPM_STORE_DIR = join(caches, "pnpm-store");
  process.env.PLAYWRIGHT_BROWSERS_PATH = join(caches, "playwright");
  process.env.NEXT_TELEMETRY_DISABLED = "1";

  return { root, tmp, npmCache, caches };
}

/** Env object safe to pass to spawn/spawnSync */
export function hDriveEnv(root = REPO_ROOT) {
  const { tmp, npmCache, caches } = applyHDriveEnv(root);
  return {
    ...process.env,
    TEMP: tmp,
    TMP: tmp,
    TMPDIR: tmp,
    npm_config_cache: npmCache,
    npm_config_tmp: tmp,
    PIP_CACHE_DIR: join(caches, "pip"),
    UV_CACHE_DIR: join(caches, "uv"),
    XDG_CACHE_HOME: caches,
    PNPM_STORE_DIR: join(caches, "pnpm-store"),
    PLAYWRIGHT_BROWSERS_PATH: join(caches, "playwright"),
    NEXT_TELEMETRY_DISABLED: "1",
    NODE_OPTIONS: mergeNodeHeapOptions(process.env.NODE_OPTIONS),
  };
}

function mergeNodeHeapOptions(existing) {
  const opts = existing ?? "";
  if (opts.includes("max-old-space-size")) return opts;
  return `${opts} --max-old-space-size=4096`.trim();
}

// Auto-apply when imported
applyHDriveEnv();
