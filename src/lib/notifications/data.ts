import { readFileSync, writeFileSync, appendFileSync, existsSync } from "fs";
import { join } from "path";
import type {
  CommunicationConsent,
  Notification,
  NotificationCampaign,
  NotificationDelivery,
  NotificationPreference,
  NotificationTemplate,
  QuietHours,
} from "./types";

export const NTF_DATA = join(process.cwd(), "data", "notifications");

const cache = new Map<string, unknown>();

function readJson<T>(file: string, key: string): T[] {
  const ck = `${file}:${key}`;
  if (cache.has(ck)) return cache.get(ck) as T[];
  const raw = JSON.parse(readFileSync(join(NTF_DATA, file), "utf8"));
  const items = raw[key] as T[];
  cache.set(ck, items);
  return items;
}

function writeJson<T>(file: string, key: string, items: T[]) {
  writeFileSync(join(NTF_DATA, file), JSON.stringify({ [key]: items }, null, 2));
  cache.clear();
}

function readObject<T>(file: string): T {
  const ck = `obj:${file}`;
  if (cache.has(ck)) return cache.get(ck) as T;
  const raw = JSON.parse(readFileSync(join(NTF_DATA, file), "utf8"));
  cache.set(ck, raw);
  return raw;
}

function writeObject(file: string, data: unknown) {
  writeFileSync(join(NTF_DATA, file), JSON.stringify(data, null, 2));
  cache.clear();
}

export function loadNotifications(): Notification[] {
  return readJson<Notification>("notifications.json", "notifications");
}

export function persistNotifications(items: Notification[]) {
  writeJson("notifications.json", "notifications", items);
}

export function loadDeliveries(): NotificationDelivery[] {
  return readJson<NotificationDelivery>("deliveries.json", "deliveries");
}

export function persistDeliveries(items: NotificationDelivery[]) {
  writeJson("deliveries.json", "deliveries", items);
}

export function loadPreferences(): NotificationPreference[] {
  return readJson<NotificationPreference>("preferences.json", "preferences");
}

export function persistPreferences(items: NotificationPreference[]) {
  writeJson("preferences.json", "preferences", items);
}

export function loadQuietHours(): QuietHours[] {
  return readJson<QuietHours>("quiet_hours.json", "quiet_hours");
}

export function persistQuietHours(items: QuietHours[]) {
  writeJson("quiet_hours.json", "quiet_hours", items);
}

export function loadConsents(): CommunicationConsent[] {
  return readJson<CommunicationConsent>("consents.json", "consents");
}

export function persistConsents(items: CommunicationConsent[]) {
  writeJson("consents.json", "consents", items);
}

export function loadTemplates(): NotificationTemplate[] {
  return readJson<NotificationTemplate>("templates.json", "templates");
}

export function loadCampaigns(): NotificationCampaign[] {
  return readJson<NotificationCampaign>("campaigns.json", "campaigns");
}

export function persistCampaigns(items: NotificationCampaign[]) {
  writeJson("campaigns.json", "campaigns", items);
}

export function loadQueue() {
  return readObject<{ queue: Record<string, unknown>[]; paused: boolean }>("queue.json");
}

export function persistQueue(data: { queue: Record<string, unknown>[]; paused: boolean }) {
  writeObject("queue.json", data);
}

export function loadFailures() {
  return readJson<Record<string, unknown>>("failures.json", "failures");
}

export function loadSuppressions() {
  return readJson<Record<string, unknown>>("suppressions.json", "suppressions");
}

export function loadProviders() {
  return readJson<Record<string, unknown>>("providers.json", "providers");
}

export function loadNotificationFeatureFlags() {
  const raw = JSON.parse(readFileSync(join(NTF_DATA, "feature_flags.json"), "utf8"));
  return raw.feature_flags as Record<string, boolean>;
}

export function appendNotificationAudit(event: Record<string, unknown>) {
  appendFileSync(
    join(NTF_DATA, "audit_events.jsonl"),
    JSON.stringify({ ...event, timestamp: new Date().toISOString() }) + "\n"
  );
}

export function readNotificationAudit(limit = 50) {
  const path = join(NTF_DATA, "audit_events.jsonl");
  if (!existsSync(path)) return [];
  return readFileSync(path, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => JSON.parse(l))
    .slice(-limit)
    .reverse();
}
