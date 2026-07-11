import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type {
  ConfigurationTemplate,
  InstitutionProvisioning,
  LaunchFeatureFlags,
} from "./types";

export const LAUNCH_DATA = join(process.cwd(), "data", "launch");

const cache = new Map<string, unknown>();

function readJson<T>(file: string, key: string): T[] {
  const ck = `${file}:${key}`;
  if (cache.has(ck)) return cache.get(ck) as T[];
  const raw = JSON.parse(readFileSync(join(LAUNCH_DATA, file), "utf8"));
  const items = raw[key] as T[];
  cache.set(ck, items);
  return items;
}

function writeJson<T>(file: string, key: string, items: T[]) {
  writeFileSync(join(LAUNCH_DATA, file), JSON.stringify({ [key]: items }, null, 2));
  cache.clear();
}

function readObject<T>(file: string): T {
  const ck = `obj:${file}`;
  if (cache.has(ck)) return cache.get(ck) as T;
  const raw = JSON.parse(readFileSync(join(LAUNCH_DATA, file), "utf8"));
  cache.set(ck, raw);
  return raw;
}

export function loadProvisionings(): InstitutionProvisioning[] {
  return readJson<InstitutionProvisioning>("provisionings.json", "provisionings");
}

export function persistProvisionings(items: InstitutionProvisioning[]) {
  writeJson("provisionings.json", "provisionings", items);
}

export function loadConfigurationTemplates(): ConfigurationTemplate[] {
  const raw = readObject<{ templates: ConfigurationTemplate[] }>("configuration_templates.json");
  return raw.templates;
}

export function loadFeatureFlags(): LaunchFeatureFlags {
  return readObject<LaunchFeatureFlags>("feature_flags.json");
}

export function loadAdoptionMetrics() {
  return readObject<{
    metrics: {
      activation_rate: number;
      onboarding_completion: number;
      training_completion: number;
      human_help_count_avg: number;
      launch_readiness_score: number;
    };
  }>("adoption_metrics.json");
}

export function loadSupportRequests() {
  return readJson<{ status: string }>("support_requests.json", "requests");
}
