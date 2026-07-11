import { readFileSync, writeFileSync, appendFileSync, existsSync } from "fs";
import { join } from "path";
import type { ApiClient, ApiCredential, ApiIdempotencyRecord, WebhookSubscription } from "./types";

export const API_DATA = join(process.cwd(), "data", "api");

const cache = new Map<string, unknown>();

function readJson<T>(file: string, key: string): T[] {
  const ck = `${file}:${key}`;
  if (cache.has(ck)) return cache.get(ck) as T[];
  const raw = JSON.parse(readFileSync(join(API_DATA, file), "utf8"));
  const items = raw[key] as T[];
  cache.set(ck, items);
  return items;
}

function writeJson<T>(file: string, key: string, items: T[]) {
  writeFileSync(join(API_DATA, file), JSON.stringify({ [key]: items }, null, 2));
  cache.clear();
}

function readObject<T>(file: string): T {
  const ck = `obj:${file}`;
  if (cache.has(ck)) return cache.get(ck) as T;
  const raw = JSON.parse(readFileSync(join(API_DATA, file), "utf8"));
  cache.set(ck, raw);
  return raw;
}

export function loadApiFeatureFlags() {
  return readObject<{ feature_flags: Record<string, boolean> }>("feature_flags.json").feature_flags;
}

export function loadApiClients(): ApiClient[] {
  return readJson<ApiClient>("api_clients.json", "clients");
}

export function loadApiCredentials(): ApiCredential[] {
  return readJson<ApiCredential>("api_credentials.json", "credentials");
}

export function persistApiCredentials(items: ApiCredential[]) {
  writeJson("api_credentials.json", "credentials", items);
}

export function loadApiScopes() {
  return readJson<{ key: string; description: string; risk: string }>("api_scopes.json", "scopes");
}

export function loadDeprecations() {
  return readJson<Record<string, unknown>>("deprecations.json", "deprecations");
}

export function loadWebhookSubscriptions(): WebhookSubscription[] {
  return readJson<WebhookSubscription>("webhooks.json", "subscriptions");
}

export function loadWebhookDeliveries() {
  return readJson<Record<string, unknown>>("webhooks.json", "deliveries");
}

export function loadAiTools() {
  return readJson<Record<string, unknown>>("ai_tools.json", "tools");
}

export function loadIdempotencyRecords(): ApiIdempotencyRecord[] {
  return readJson<ApiIdempotencyRecord>("idempotency_records.json", "records");
}

export function persistIdempotencyRecords(records: ApiIdempotencyRecord[]) {
  writeJson("idempotency_records.json", "records", records);
}

export function loadTelemetry() {
  return readObject<{ telemetry: Record<string, unknown> }>("telemetry.json").telemetry;
}

export function loadApiVersions() {
  return readJson<Record<string, unknown>>("api_versions.json", "versions");
}

export function appendApiAudit(event: Record<string, unknown>) {
  appendFileSync(
    join(API_DATA, "audit_events.jsonl"),
    JSON.stringify({ ...event, timestamp: new Date().toISOString() }) + "\n"
  );
}

export function readApiAudit(limit = 50) {
  const path = join(API_DATA, "audit_events.jsonl");
  if (!existsSync(path)) return [];
  return readFileSync(path, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => JSON.parse(l))
    .slice(-limit)
    .reverse();
}
