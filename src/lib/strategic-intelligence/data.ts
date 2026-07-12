import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type {
  DecisionRecord,
  EarlyWarning,
  Forecast,
  InstitutionalLearning,
  Scenario,
  StrategicAuditEvent,
  StrategicInsight,
  StrategicRecommendation,
} from "./types";

export const INT_DATA = join(process.cwd(), "data", "strategic-intelligence");

const cache = new Map<string, unknown>();

function readStore(): Record<string, unknown> {
  if (cache.has("store")) return cache.get("store") as Record<string, unknown>;
  const raw = JSON.parse(readFileSync(join(INT_DATA, "store.json"), "utf8"));
  cache.set("store", raw);
  return raw;
}

function writeStore(store: Record<string, unknown>) {
  writeFileSync(join(INT_DATA, "store.json"), JSON.stringify(store, null, 2));
  cache.clear();
}

function readJsonFile<T>(file: string): T {
  const ck = `obj:${file}`;
  if (cache.has(ck)) return cache.get(ck) as T;
  const raw = JSON.parse(readFileSync(join(INT_DATA, file), "utf8"));
  cache.set(ck, raw);
  return raw;
}

export function loadFeatureFlags() {
  return readJsonFile<Record<string, boolean>>("feature_flags.json");
}

function getKey<K extends string>(key: K): unknown[] {
  return (readStore()[key] as unknown[]) ?? [];
}

function setKey<K extends string>(key: K, items: unknown[]) {
  const store = readStore();
  store[key] = items;
  writeStore(store);
}

export const loadInsights = () => getKey("insights") as StrategicInsight[];
export const persistInsights = (items: StrategicInsight[]) => setKey("insights", items);
export const loadRecommendations = () => getKey("recommendations") as StrategicRecommendation[];
export const persistRecommendations = (items: StrategicRecommendation[]) => setKey("recommendations", items);
export const loadWarnings = () => getKey("warnings") as EarlyWarning[];
export const persistWarnings = (items: EarlyWarning[]) => setKey("warnings", items);
export const loadScenarios = () => getKey("scenarios") as Scenario[];
export const persistScenarios = (items: Scenario[]) => setKey("scenarios", items);
export const loadForecasts = () => getKey("forecasts") as Forecast[];
export const persistForecasts = (items: Forecast[]) => setKey("forecasts", items);
export const loadDecisions = () => getKey("decisions") as DecisionRecord[];
export const persistDecisions = (items: DecisionRecord[]) => setKey("decisions", items);
export const loadLearningRecords = () => getKey("learning_records") as InstitutionalLearning[];
export const persistLearningRecords = (items: InstitutionalLearning[]) => setKey("learning_records", items);
export const loadAuditEvents = () => getKey("audit_events") as StrategicAuditEvent[];
export const persistAuditEvents = (items: StrategicAuditEvent[]) => setKey("audit_events", items);
