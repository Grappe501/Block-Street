import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { CivicImpactScorecard, ImpactTrendPack } from "./types";

export const CIA_DATA = join(process.cwd(), "data", "civic-impact-analytics");
const cache = new Map<string, unknown>();

function readStore(): Record<string, unknown> {
  if (cache.has("store")) return cache.get("store") as Record<string, unknown>;
  const raw = JSON.parse(readFileSync(join(CIA_DATA, "store.json"), "utf8"));
  cache.set("store", raw);
  return raw;
}

function writeStore(store: Record<string, unknown>) {
  writeFileSync(join(CIA_DATA, "store.json"), JSON.stringify(store, null, 2));
  cache.clear();
}

function getKey<T>(key: string): T[] {
  return ((readStore()[key] as T[]) ?? []) as T[];
}

function setKey<T>(key: string, items: T[]) {
  const store = readStore();
  store[key] = items;
  writeStore(store);
}

export function loadFeatureFlags() {
  return JSON.parse(readFileSync(join(CIA_DATA, "feature_flags.json"), "utf8")) as Record<string, boolean>;
}

export const loadScorecards = () => getKey<CivicImpactScorecard>("scorecards");
export const persistScorecards = (items: CivicImpactScorecard[]) => setKey("scorecards", items);
export const loadTrendPacks = () => getKey<ImpactTrendPack>("trend_packs");
export const persistTrendPacks = (items: ImpactTrendPack[]) => setKey("trend_packs", items);

export function appendAudit(action: string, detail: string) {
  const store = readStore();
  const events = ((store.audit_events as { at: string; action: string; detail: string }[]) ?? []).slice();
  events.unshift({ at: new Date().toISOString(), action, detail });
  store.audit_events = events.slice(0, 200);
  writeStore(store);
}

export function loadAudit(limit = 20) {
  return (((readStore().audit_events as { at: string; action: string; detail: string }[]) ?? []) as {
    at: string;
    action: string;
    detail: string;
  }[]).slice(0, limit);
}
