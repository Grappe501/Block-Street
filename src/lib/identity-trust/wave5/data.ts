import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type {
  IdentityDetectionRule,
  IdentityIntelligenceEvent,
  IdentityIntelligenceSignal,
  IdentitySignalFalsePositive,
  IdentitySignalReferral,
} from "./types";

const ITL_DATA = join(process.cwd(), "data", "identity-trust");
const cache = new Map<string, unknown>();

function readStore(): Record<string, unknown> {
  if (cache.has("store")) return cache.get("store") as Record<string, unknown>;
  const raw = JSON.parse(readFileSync(join(ITL_DATA, "store.json"), "utf8"));
  cache.set("store", raw);
  return raw;
}

function writeStore(store: Record<string, unknown>) {
  writeFileSync(join(ITL_DATA, "store.json"), JSON.stringify(store, null, 2));
  cache.clear();
}

function readJson<T>(file: string): T {
  const k = `json:${file}`;
  if (cache.has(k)) return cache.get(k) as T;
  const raw = JSON.parse(readFileSync(join(ITL_DATA, file), "utf8"));
  cache.set(k, raw);
  return raw;
}

export function loadWave5Flags() {
  return readJson<Record<string, boolean | string>>("wave5_flags.json");
}

function getKey<T>(key: string): T[] {
  return (readStore()[key] as T[]) ?? [];
}

function setKey(key: string, items: unknown[]) {
  const store = readStore();
  store[key] = items;
  writeStore(store);
}

export const loadIntelligenceEvents = () => getKey<IdentityIntelligenceEvent>("identity_intelligence_events");
export const persistIntelligenceEvents = (items: IdentityIntelligenceEvent[]) =>
  setKey("identity_intelligence_events", items);

export const loadIntelligenceSignals = () => getKey<IdentityIntelligenceSignal>("identity_intelligence_signals");
export const persistIntelligenceSignals = (items: IdentityIntelligenceSignal[]) =>
  setKey("identity_intelligence_signals", items);

export const loadDetectionRules = () => getKey<IdentityDetectionRule>("identity_detection_rules");
export const persistDetectionRules = (items: IdentityDetectionRule[]) => setKey("identity_detection_rules", items);

export const loadSignalReferrals = () => getKey<IdentitySignalReferral>("identity_signal_referrals");
export const persistSignalReferrals = (items: IdentitySignalReferral[]) => setKey("identity_signal_referrals", items);

export const loadSignalFalsePositives = () => getKey<IdentitySignalFalsePositive>("identity_signal_false_positives");
export const persistSignalFalsePositives = (items: IdentitySignalFalsePositive[]) =>
  setKey("identity_signal_false_positives", items);
