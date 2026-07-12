import { readFileSync } from "fs";
import { join } from "path";

let cache: Record<string, boolean> | null = null;

export function loadAuthFeatureFlags() {
  if (!cache) {
    const raw = JSON.parse(readFileSync(join(process.cwd(), "data", "auth", "feature_flags.json"), "utf8"));
    cache = raw.feature_flags ?? raw;
  }
  return cache!;
}
