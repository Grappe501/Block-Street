import { readFileSync, writeFileSync, appendFileSync } from "fs";
import { join } from "path";
import type {
  BuildArtifact,
  ConfigDriftWarning,
  DatabaseMigration,
  DeploymentAuditEvent,
  DeploymentEnvironmentRecord,
  DeploymentFeatureFlags,
  PreviewEnvironment,
  ReleaseApproval,
  ReleaseCandidate,
  ReleaseManifest,
} from "./types";

export const DPL_DATA = join(process.cwd(), "data", "deployment");

const cache = new Map<string, unknown>();

function readJson<T>(file: string, key: string): T[] {
  const ck = `${file}:${key}`;
  if (cache.has(ck)) return cache.get(ck) as T[];
  const raw = JSON.parse(readFileSync(join(DPL_DATA, file), "utf8"));
  const items = raw[key] as T[];
  cache.set(ck, items);
  return items;
}

function writeJson<T>(file: string, key: string, items: T[]) {
  writeFileSync(join(DPL_DATA, file), JSON.stringify({ [key]: items }, null, 2));
  cache.clear();
}

function readObject<T>(file: string): T {
  const ck = `obj:${file}`;
  if (cache.has(ck)) return cache.get(ck) as T;
  const raw = JSON.parse(readFileSync(join(DPL_DATA, file), "utf8"));
  cache.set(ck, raw);
  return raw;
}

export function loadEnvironments(): DeploymentEnvironmentRecord[] {
  return readJson<DeploymentEnvironmentRecord>("environments.json", "environments");
}

export function loadBuildArtifacts(): BuildArtifact[] {
  return readJson<BuildArtifact>("build_artifacts.json", "artifacts");
}

export function persistBuildArtifacts(items: BuildArtifact[]) {
  writeJson("build_artifacts.json", "artifacts", items);
}

export function loadReleaseCandidates(): ReleaseCandidate[] {
  return readJson<ReleaseCandidate>("release_candidates.json", "candidates");
}

export function persistReleaseCandidates(items: ReleaseCandidate[]) {
  writeJson("release_candidates.json", "candidates", items);
}

export function loadReleaseManifests(): ReleaseManifest[] {
  return readJson<ReleaseManifest>("release_manifests.json", "manifests");
}

export function persistReleaseManifests(items: ReleaseManifest[]) {
  writeJson("release_manifests.json", "manifests", items);
}

export function loadApprovals(): ReleaseApproval[] {
  return readJson<ReleaseApproval>("approvals.json", "approvals");
}

export function persistApprovals(items: ReleaseApproval[]) {
  writeJson("approvals.json", "approvals", items);
}

export function loadMigrations(): DatabaseMigration[] {
  return readJson<DatabaseMigration>("migrations.json", "migrations");
}

export function persistMigrations(items: DatabaseMigration[]) {
  writeJson("migrations.json", "migrations", items);
}

export function loadPreviews(): PreviewEnvironment[] {
  return readJson<PreviewEnvironment>("preview_environments.json", "previews");
}

export function loadConfigDrift(): ConfigDriftWarning[] {
  return readJson<ConfigDriftWarning>("config_drift.json", "warnings");
}

export function loadFeatureFlags(): DeploymentFeatureFlags {
  return readObject<DeploymentFeatureFlags>("feature_flags.json");
}

export function appendAudit(event: DeploymentAuditEvent) {
  appendFileSync(join(DPL_DATA, "audit_events.jsonl"), `${JSON.stringify(event)}\n`);
}

export function loadRecentAudit(limit = 50): DeploymentAuditEvent[] {
  try {
    const lines = readFileSync(join(DPL_DATA, "audit_events.jsonl"), "utf8").trim().split("\n");
    return lines.slice(-limit).map((l) => JSON.parse(l) as DeploymentAuditEvent).reverse();
  } catch {
    return [];
  }
}
