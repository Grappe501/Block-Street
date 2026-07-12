import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type {
  CivicInfrastructureAsset,
  CommunityBenchmark,
  CommunityHealthAuditEvent,
  CommunityHealthProfile,
  CommunityHealthReport,
  CommunityOpportunity,
  CommunityProject,
  CommunityRisk,
  GeographicHealthPoint,
  HealthTrendPoint,
} from "./types";

export const CHD_DATA = join(process.cwd(), "data", "community-health");

const cache = new Map<string, unknown>();

function readStore(): Record<string, unknown> {
  if (cache.has("store")) return cache.get("store") as Record<string, unknown>;
  const raw = JSON.parse(readFileSync(join(CHD_DATA, "store.json"), "utf8"));
  cache.set("store", raw);
  return raw;
}

function writeStore(store: Record<string, unknown>) {
  writeFileSync(join(CHD_DATA, "store.json"), JSON.stringify(store, null, 2));
  cache.clear();
}

function readJsonFile<T>(file: string): T {
  const ck = `obj:${file}`;
  if (cache.has(ck)) return cache.get(ck) as T;
  const raw = JSON.parse(readFileSync(join(CHD_DATA, file), "utf8"));
  cache.set(ck, raw);
  return raw;
}

export function loadFeatureFlags() {
  return readJsonFile<Record<string, boolean>>("feature_flags.json");
}

export function loadHealthWeights() {
  return readJsonFile<{ domains: { key: string; weight: number }[] }>("health_weights.json");
}

function getKey<K extends string>(key: K): unknown[] {
  return (readStore()[key] as unknown[]) ?? [];
}

function setKey<K extends string>(key: K, items: unknown[]) {
  const store = readStore();
  store[key] = items;
  writeStore(store);
}

export const loadProfiles = () => getKey("health_profiles") as CommunityHealthProfile[];
export const persistProfiles = (items: CommunityHealthProfile[]) => setKey("health_profiles", items);
export const loadInfrastructure = () => getKey("infrastructure") as CivicInfrastructureAsset[];
export const persistInfrastructure = (items: CivicInfrastructureAsset[]) => setKey("infrastructure", items);
export const loadProjects = () => getKey("projects") as CommunityProject[];
export const persistProjects = (items: CommunityProject[]) => setKey("projects", items);
export const loadRisks = () => getKey("risks") as CommunityRisk[];
export const persistRisks = (items: CommunityRisk[]) => setKey("risks", items);
export const loadOpportunities = () => getKey("opportunities") as CommunityOpportunity[];
export const persistOpportunities = (items: CommunityOpportunity[]) => setKey("opportunities", items);
export const loadTrends = () => getKey("trend_history") as HealthTrendPoint[];
export const persistTrends = (items: HealthTrendPoint[]) => setKey("trend_history", items);
export const loadGeographicPoints = () => getKey("geographic_points") as GeographicHealthPoint[];
export const persistGeographicPoints = (items: GeographicHealthPoint[]) => setKey("geographic_points", items);
export const loadBenchmarks = () => getKey("benchmarks") as CommunityBenchmark[];
export const persistBenchmarks = (items: CommunityBenchmark[]) => setKey("benchmarks", items);
export const loadReports = () => getKey("reports") as CommunityHealthReport[];
export const persistReports = (items: CommunityHealthReport[]) => setKey("reports", items);
export const loadAuditEvents = () => getKey("audit_events") as CommunityHealthAuditEvent[];
export const persistAuditEvents = (items: CommunityHealthAuditEvent[]) => setKey("audit_events", items);
