import { readFileSync, writeFileSync, appendFileSync } from "fs";
import { join } from "path";
import type {
  AccessReview,
  BackupRecord,
  DataAsset,
  DataClassification,
  ExportManifest,
  PrivacyRequest,
  RecoveryTest,
  SecurityEvent,
  SecurityFeatureFlags,
  SecurityIncident,
  SecurityRisk,
  ThreatModel,
  Vulnerability,
} from "./types";

export const SEC_DATA = join(process.cwd(), "data", "security");

const cache = new Map<string, unknown>();

function readJson<T>(file: string, key: string): T[] {
  const ck = `${file}:${key}`;
  if (cache.has(ck)) return cache.get(ck) as T[];
  const raw = JSON.parse(readFileSync(join(SEC_DATA, file), "utf8"));
  const items = raw[key] as T[];
  cache.set(ck, items);
  return items;
}

function writeJson<T>(file: string, key: string, items: T[]) {
  writeFileSync(join(SEC_DATA, file), JSON.stringify({ [key]: items }, null, 2));
  cache.clear();
}

function readObject<T>(file: string): T {
  const ck = `obj:${file}`;
  if (cache.has(ck)) return cache.get(ck) as T;
  const raw = JSON.parse(readFileSync(join(SEC_DATA, file), "utf8"));
  cache.set(ck, raw);
  return raw;
}

export function loadRisks(): SecurityRisk[] {
  return readJson<SecurityRisk>("risk_register.json", "risks");
}

export function loadThreatModels(): ThreatModel[] {
  return readJson<ThreatModel>("threat_models.json", "models");
}

export function loadClassifications(): DataClassification[] {
  return readJson<DataClassification>("data_classifications.json", "classifications");
}

export function loadSecurityEvents(): SecurityEvent[] {
  return readJson<SecurityEvent>("security_events.json", "events");
}

export function persistSecurityEvents(items: SecurityEvent[]) {
  writeJson("security_events.json", "events", items);
}

export function loadIncidents(): SecurityIncident[] {
  return readJson<SecurityIncident>("incidents.json", "incidents");
}

export function persistIncidents(items: SecurityIncident[]) {
  writeJson("incidents.json", "incidents", items);
}

export function loadVulnerabilities(): Vulnerability[] {
  return readJson<Vulnerability>("vulnerabilities.json", "vulnerabilities");
}

export function persistVulnerabilities(items: Vulnerability[]) {
  writeJson("vulnerabilities.json", "vulnerabilities", items);
}

export function loadAccessReviews(): AccessReview[] {
  return readJson<AccessReview>("access_reviews.json", "reviews");
}

export function persistAccessReviews(items: AccessReview[]) {
  writeJson("access_reviews.json", "reviews", items);
}

export function loadDataAssets(): DataAsset[] {
  return readJson<DataAsset>("data_assets.json", "assets");
}

export function loadPrivacyRequests(): PrivacyRequest[] {
  return readJson<PrivacyRequest>("privacy_requests.json", "requests");
}

export function persistPrivacyRequests(items: PrivacyRequest[]) {
  writeJson("privacy_requests.json", "requests", items);
}

export function loadExports(): ExportManifest[] {
  return readJson<ExportManifest>("export_manifests.json", "exports");
}

export function loadBackups(): BackupRecord[] {
  return readJson<BackupRecord>("backups.json", "backups");
}

export function loadRecoveryTests(): RecoveryTest[] {
  return readJson<RecoveryTest>("recovery_tests.json", "tests");
}

export function persistRecoveryTests(items: RecoveryTest[]) {
  writeJson("recovery_tests.json", "tests", items);
}

export function loadFeatureFlags(): SecurityFeatureFlags {
  return readObject<SecurityFeatureFlags>("feature_flags.json");
}

export function appendSecurityAudit(event: Record<string, unknown>) {
  appendFileSync(join(SEC_DATA, "audit_events.jsonl"), `${JSON.stringify({ ...event, timestamp: new Date().toISOString() })}\n`);
}

export function loadRecentAudit(limit = 50): Record<string, unknown>[] {
  try {
    const lines = readFileSync(join(SEC_DATA, "audit_events.jsonl"), "utf8").trim().split("\n");
    return lines.slice(-limit).map((l) => JSON.parse(l) as Record<string, unknown>).reverse();
  } catch {
    return [];
  }
}
