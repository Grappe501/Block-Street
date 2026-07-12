import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type {
  CompetencyRecord,
  LeadershipAuditEvent,
  LeadershipCohort,
  LeadershipDevelopmentPlan,
  LeadershipEvidence,
  LeadershipHealthSummary,
  LeadershipOpportunity,
  LeadershipPrivacySettings,
  LeadershipProfile,
  MentorProfile,
  MentorshipRelationship,
  SuccessionPlan,
} from "./types";

export const LDR_DATA = join(process.cwd(), "data", "leadership");

const cache = new Map<string, unknown>();

function readStore(): Record<string, unknown> {
  if (cache.has("store")) return cache.get("store") as Record<string, unknown>;
  const raw = JSON.parse(readFileSync(join(LDR_DATA, "store.json"), "utf8"));
  cache.set("store", raw);
  return raw;
}

function writeStore(store: Record<string, unknown>) {
  writeFileSync(join(LDR_DATA, "store.json"), JSON.stringify(store, null, 2));
  cache.clear();
}

function readJsonFile<T>(file: string): T {
  const ck = `obj:${file}`;
  if (cache.has(ck)) return cache.get(ck) as T;
  const raw = JSON.parse(readFileSync(join(LDR_DATA, file), "utf8"));
  cache.set(ck, raw);
  return raw;
}

export function loadFeatureFlags() {
  return readJsonFile<Record<string, boolean>>("feature_flags.json");
}

export function loadCompetencyCatalog() {
  return readJsonFile<{ competencies: string[] }>("competency_catalog.json").competencies;
}

export function loadScoreWeights() {
  return readJsonFile<{ components: { key: string; weight: number }[] }>("score_weights.json");
}

function getKey<K extends string>(key: K): unknown[] {
  return (readStore()[key] as unknown[]) ?? [];
}

function setKey<K extends string>(key: K, items: unknown[]) {
  const store = readStore();
  store[key] = items;
  writeStore(store);
}

export const loadProfiles = () => getKey("profiles") as LeadershipProfile[];
export const persistProfiles = (items: LeadershipProfile[]) => setKey("profiles", items);
export const loadEvidence = () => getKey("evidence") as LeadershipEvidence[];
export const persistEvidence = (items: LeadershipEvidence[]) => setKey("evidence", items);
export const loadCompetencyRecords = () => getKey("competency_records") as CompetencyRecord[];
export const persistCompetencyRecords = (items: CompetencyRecord[]) => setKey("competency_records", items);
export const loadDevelopmentPlans = () => getKey("development_plans") as LeadershipDevelopmentPlan[];
export const persistDevelopmentPlans = (items: LeadershipDevelopmentPlan[]) => setKey("development_plans", items);
export const loadMentorProfiles = () => getKey("mentor_profiles") as MentorProfile[];
export const persistMentorProfiles = (items: MentorProfile[]) => setKey("mentor_profiles", items);
export const loadMentorships = () => getKey("mentorships") as MentorshipRelationship[];
export const persistMentorships = (items: MentorshipRelationship[]) => setKey("mentorships", items);
export const loadCohorts = () => getKey("cohorts") as LeadershipCohort[];
export const persistCohorts = (items: LeadershipCohort[]) => setKey("cohorts", items);
export const loadSuccessionPlans = () => getKey("succession_plans") as SuccessionPlan[];
export const persistSuccessionPlans = (items: SuccessionPlan[]) => setKey("succession_plans", items);
export const loadOpportunities = () => getKey("opportunities") as LeadershipOpportunity[];
export const persistOpportunities = (items: LeadershipOpportunity[]) => setKey("opportunities", items);
export const loadPrivacySettings = () => getKey("privacy_settings") as LeadershipPrivacySettings[];
export const persistPrivacySettings = (items: LeadershipPrivacySettings[]) => setKey("privacy_settings", items);
export const loadAuditEvents = () => getKey("audit_events") as LeadershipAuditEvent[];
export const persistAuditEvents = (items: LeadershipAuditEvent[]) => setKey("audit_events", items);
export const loadHealthSummary = () => readStore().health_summary as LeadershipHealthSummary;
export const persistHealthSummary = (summary: LeadershipHealthSummary) => {
  const store = readStore();
  store.health_summary = summary;
  writeStore(store);
};
