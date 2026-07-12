import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type {
  AdoptionMetrics,
  FeedbackItem,
  MaturityScore,
  OperationalHealth,
  OperationalLaunchPlan,
  OperationalRelease,
  OperationsAuditEvent,
  OperationsHealthSummary,
  SupportRequest,
} from "./types";

export const OPS_DATA = join(process.cwd(), "data", "operations");

const cache = new Map<string, unknown>();

function readStore(): Record<string, unknown> {
  if (cache.has("store")) return cache.get("store") as Record<string, unknown>;
  const raw = JSON.parse(readFileSync(join(OPS_DATA, "store.json"), "utf8"));
  cache.set("store", raw);
  return raw;
}

function writeStore(store: Record<string, unknown>) {
  writeFileSync(join(OPS_DATA, "store.json"), JSON.stringify(store, null, 2));
  cache.clear();
}

function readJsonFile<T>(file: string): T {
  const ck = `obj:${file}`;
  if (cache.has(ck)) return cache.get(ck) as T;
  const raw = JSON.parse(readFileSync(join(OPS_DATA, file), "utf8"));
  cache.set(ck, raw);
  return raw;
}

export function loadFeatureFlags() {
  return readJsonFile<Record<string, boolean>>("feature_flags.json");
}

export function loadPlaybooks() {
  return readJsonFile<{ playbooks: { key: string; name: string; description: string }[] }>("playbooks.json").playbooks;
}

function getKey<K extends string>(key: K): unknown[] {
  return (readStore()[key] as unknown[]) ?? [];
}

function setKey<K extends string>(key: K, items: unknown[]) {
  const store = readStore();
  store[key] = items;
  writeStore(store);
}

export const loadLaunchPlans = () => getKey("launch_plans") as OperationalLaunchPlan[];
export const persistLaunchPlans = (items: OperationalLaunchPlan[]) => setKey("launch_plans", items);
export const loadHealthRecords = () => getKey("health_records") as OperationalHealth[];
export const persistHealthRecords = (items: OperationalHealth[]) => setKey("health_records", items);
export const loadAdoptionRecords = () => getKey("adoption_records") as AdoptionMetrics[];
export const persistAdoptionRecords = (items: AdoptionMetrics[]) => setKey("adoption_records", items);
export const loadSupportRequests = () => getKey("support_requests") as SupportRequest[];
export const persistSupportRequests = (items: SupportRequest[]) => setKey("support_requests", items);
export const loadFeedbackItems = () => getKey("feedback_items") as FeedbackItem[];
export const persistFeedbackItems = (items: FeedbackItem[]) => setKey("feedback_items", items);
export const loadReleases = () => getKey("releases") as OperationalRelease[];
export const persistReleases = (items: OperationalRelease[]) => setKey("releases", items);
export const loadMaturityScores = () => getKey("maturity_scores") as MaturityScore[];
export const persistMaturityScores = (items: MaturityScore[]) => setKey("maturity_scores", items);
export const loadAuditEvents = () => getKey("audit_events") as OperationsAuditEvent[];
export const persistAuditEvents = (items: OperationsAuditEvent[]) => setKey("audit_events", items);
export const loadHealthSummary = () => readStore().health_summary as OperationsHealthSummary;
export const persistHealthSummary = (summary: OperationsHealthSummary) => {
  const store = readStore();
  store.health_summary = summary;
  writeStore(store);
};
