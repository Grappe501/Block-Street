import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type {
  CivicAuditEvent,
  CivicHabitRecord,
  CivicMilestone,
  CivicParticipationScore,
  CivicTimelineEntry,
  EngagementTrend,
  ParticipationEvent,
  ParticipationForecast,
  ParticipationHealthSummary,
  ParticipationPrivacySettings,
  VolunteerRecord,
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

export function loadParticipationWeights() {
  return readJsonFile<{ weights: Record<string, number>; score_components: { key: string; weight: number }[] }>(
    "participation_weights.json"
  );
}

export function loadMilestoneCatalog() {
  return readJsonFile<{ milestones: { key: string; title: string; description: string; trigger: string }[] }>(
    "milestone_catalog.json"
  ).milestones;
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
export const loadUserParticipationScores = () => getKey("user_participation_scores") as CivicParticipationScore[];
export const persistUserParticipationScores = (items: CivicParticipationScore[]) => setKey("user_participation_scores", items);
export const loadEngagementTrends = () => getKey("engagement_trends") as EngagementTrend[];
export const persistEngagementTrends = (items: EngagementTrend[]) => setKey("engagement_trends", items);
export const loadParticipationForecasts = () => getKey("participation_forecasts") as ParticipationForecast[];
export const persistParticipationForecasts = (items: ParticipationForecast[]) => setKey("participation_forecasts", items);
export const loadCivicHabits = () => getKey("civic_habits") as CivicHabitRecord[];
export const persistCivicHabits = (items: CivicHabitRecord[]) => setKey("civic_habits", items);
export const loadCivicTimeline = () => getKey("civic_timeline") as CivicTimelineEntry[];
export const persistCivicTimeline = (items: CivicTimelineEntry[]) => setKey("civic_timeline", items);
export const loadCivicMilestones = () => getKey("civic_milestones") as CivicMilestone[];
export const persistCivicMilestones = (items: CivicMilestone[]) => setKey("civic_milestones", items);
export const loadVolunteerRecords = () => getKey("volunteer_records") as VolunteerRecord[];
export const persistVolunteerRecords = (items: VolunteerRecord[]) => setKey("volunteer_records", items);
export const loadPrivacySettings = () => getKey("privacy_settings") as ParticipationPrivacySettings[];
export const persistPrivacySettings = (items: ParticipationPrivacySettings[]) => setKey("privacy_settings", items);
export const loadAuditEvents = () => getKey("audit_events") as CivicAuditEvent[];
export const persistAuditEvents = (items: CivicAuditEvent[]) => setKey("audit_events", items);
export const loadHealthSummary = () => readStore().health_summary as ParticipationHealthSummary;
export const persistHealthSummary = (summary: ParticipationHealthSummary) => {
  const store = readStore();
  store.health_summary = summary;
  writeStore(store);
};
