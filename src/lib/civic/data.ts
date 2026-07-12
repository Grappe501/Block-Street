import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type {
  CivicAuditEvent,
  CivicHabitRecord,
  CivicParticipationScore,
  EngagementTrend,
  ParticipationEvent,
  ParticipationForecast,
  ParticipationHealthSummary,
} from "./types";

export const CIVIC_DATA = join(process.cwd(), "data", "civic");

const cache = new Map<string, unknown>();

function readStore(): Record<string, unknown> {
  if (cache.has("store")) return cache.get("store") as Record<string, unknown>;
  const raw = JSON.parse(readFileSync(join(CIVIC_DATA, "store.json"), "utf8"));
  cache.set("store", raw);
  return raw;
}

function writeStore(store: Record<string, unknown>) {
  writeFileSync(join(CIVIC_DATA, "store.json"), JSON.stringify(store, null, 2));
  cache.clear();
}

function readJsonFile<T>(file: string): T {
  const ck = `obj:${file}`;
  if (cache.has(ck)) return cache.get(ck) as T;
  const raw = JSON.parse(readFileSync(join(CIVIC_DATA, file), "utf8"));
  cache.set(ck, raw);
  return raw;
}

export function loadFeatureFlags() {
  return readJsonFile<Record<string, boolean>>("feature_flags.json");
}

export function loadParticipationCatalog() {
  return readJsonFile<{ metrics: { key: string; name: string; weight: number; description: string }[] }>(
    "participation_catalog.json"
  ).metrics;
}

function getKey<K extends string>(key: K): unknown[] {
  return (readStore()[key] as unknown[]) ?? [];
}

function setKey<K extends string>(key: K, items: unknown[]) {
  const store = readStore();
  store[key] = items;
  writeStore(store);
}

export const loadParticipationEvents = () => getKey("participation_events") as ParticipationEvent[];
export const persistParticipationEvents = (items: ParticipationEvent[]) => setKey("participation_events", items);
export const loadParticipationScores = () => getKey("participation_scores") as CivicParticipationScore[];
export const persistParticipationScores = (items: CivicParticipationScore[]) => setKey("participation_scores", items);
export const loadEngagementTrends = () => getKey("engagement_trends") as EngagementTrend[];
export const persistEngagementTrends = (items: EngagementTrend[]) => setKey("engagement_trends", items);
export const loadParticipationForecasts = () => getKey("participation_forecasts") as ParticipationForecast[];
export const persistParticipationForecasts = (items: ParticipationForecast[]) => setKey("participation_forecasts", items);
export const loadCivicHabits = () => getKey("civic_habits") as CivicHabitRecord[];
export const persistCivicHabits = (items: CivicHabitRecord[]) => setKey("civic_habits", items);
export const loadAuditEvents = () => getKey("audit_events") as CivicAuditEvent[];
export const persistAuditEvents = (items: CivicAuditEvent[]) => setKey("audit_events", items);
export const loadHealthSummary = () => readStore().health_summary as ParticipationHealthSummary;
export const persistHealthSummary = (summary: ParticipationHealthSummary) => {
  const store = readStore();
  store.health_summary = summary;
  writeStore(store);
};
