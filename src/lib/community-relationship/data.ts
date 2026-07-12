import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type {
  RelationshipAuditEvent,
  RelationshipEdge,
  RelationshipEvent,
  RelationshipHealthSummary,
  RelationshipNode,
  RelationshipPrivacySettings,
  RelationshipRecommendation,
} from "./types";

export const REL_DATA = join(process.cwd(), "data", "community-relationship");

const cache = new Map<string, unknown>();

function readStore(): Record<string, unknown> {
  if (cache.has("store")) return cache.get("store") as Record<string, unknown>;
  const raw = JSON.parse(readFileSync(join(REL_DATA, "store.json"), "utf8"));
  cache.set("store", raw);
  return raw;
}

function writeStore(store: Record<string, unknown>) {
  writeFileSync(join(REL_DATA, "store.json"), JSON.stringify(store, null, 2));
  cache.clear();
}

function readJsonFile<T>(file: string): T {
  const ck = `obj:${file}`;
  if (cache.has(ck)) return cache.get(ck) as T;
  const raw = JSON.parse(readFileSync(join(REL_DATA, file), "utf8"));
  cache.set(ck, raw);
  return raw;
}

export function loadFeatureFlags() {
  return readJsonFile<Record<string, boolean>>("feature_flags.json");
}

export function loadRelationshipTypes() {
  return readJsonFile<{ types: string[] }>("relationship_types.json").types;
}

export function loadStrengthWeights() {
  return readJsonFile<{
    weights: Record<string, number>;
    status_thresholds: Record<string, number>;
  }>("strength_weights.json");
}

function getKey<K extends string>(key: K): unknown[] {
  return (readStore()[key] as unknown[]) ?? [];
}

function setKey<K extends string>(key: K, items: unknown[]) {
  const store = readStore();
  store[key] = items;
  writeStore(store);
}

export const loadNodes = () => getKey("nodes") as RelationshipNode[];
export const persistNodes = (items: RelationshipNode[]) => setKey("nodes", items);
export const loadEdges = () => getKey("edges") as RelationshipEdge[];
export const persistEdges = (items: RelationshipEdge[]) => setKey("edges", items);
export const loadEvents = () => getKey("events") as RelationshipEvent[];
export const persistEvents = (items: RelationshipEvent[]) => setKey("events", items);
export const loadPrivacySettings = () => getKey("privacy_settings") as RelationshipPrivacySettings[];
export const persistPrivacySettings = (items: RelationshipPrivacySettings[]) => setKey("privacy_settings", items);
export const loadRecommendations = () => getKey("recommendations") as RelationshipRecommendation[];
export const persistRecommendations = (items: RelationshipRecommendation[]) => setKey("recommendations", items);
export const loadAuditEvents = () => getKey("audit_events") as RelationshipAuditEvent[];
export const persistAuditEvents = (items: RelationshipAuditEvent[]) => setKey("audit_events", items);
export const loadHealthSummary = () => readStore().health_summary as RelationshipHealthSummary;
export const persistHealthSummary = (summary: RelationshipHealthSummary) => {
  const store = readStore();
  store.health_summary = summary;
  writeStore(store);
};
