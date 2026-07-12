import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type {
  IdentityExecutiveMetric,
  IdentityHumanHelpEvent,
  IdentityOperationalAuthority,
  IdentityOperationsAuditEvent,
  IdentityReportRun,
  IdentitySupportRequest,
  IdentityWorkAssignment,
  IdentityWorkItem,
} from "./types";

const ITL_DATA = join(process.cwd(), "data", "identity-trust");
const cache = new Map<string, unknown>();

function readStore(): Record<string, unknown> {
  if (cache.has("store")) return cache.get("store") as Record<string, unknown>;
  const raw = JSON.parse(readFileSync(join(ITL_DATA, "store.json"), "utf8"));
  cache.set("store", raw);
  return raw;
}

function writeStore(store: Record<string, unknown>) {
  writeFileSync(join(ITL_DATA, "store.json"), JSON.stringify(store, null, 2));
  cache.clear();
}

function readJson<T>(file: string): T {
  const k = `json:${file}`;
  if (cache.has(k)) return cache.get(k) as T;
  const raw = JSON.parse(readFileSync(join(ITL_DATA, file), "utf8"));
  cache.set(k, raw);
  return raw;
}

export function loadWave6Flags() {
  return readJson<Record<string, boolean | string>>("wave6_flags.json");
}

function getKey<T>(key: string): T[] {
  return (readStore()[key] as T[]) ?? [];
}

function setKey(key: string, items: unknown[]) {
  const store = readStore();
  store[key] = items;
  writeStore(store);
}

export const loadOperationalAuthorities = () => getKey<IdentityOperationalAuthority>("identity_operational_authorities");
export const persistOperationalAuthorities = (items: IdentityOperationalAuthority[]) =>
  setKey("identity_operational_authorities", items);

export const loadWorkItems = () => getKey<IdentityWorkItem>("identity_work_items");
export const persistWorkItems = (items: IdentityWorkItem[]) => setKey("identity_work_items", items);

export const loadWorkAssignments = () => getKey<IdentityWorkAssignment>("identity_work_assignments");
export const persistWorkAssignments = (items: IdentityWorkAssignment[]) => setKey("identity_work_assignments", items);

export const loadSupportRequests = () => getKey<IdentitySupportRequest>("identity_support_requests");
export const persistSupportRequests = (items: IdentitySupportRequest[]) => setKey("identity_support_requests", items);

export const loadHumanHelpEvents = () => getKey<IdentityHumanHelpEvent>("identity_human_help_events");
export const persistHumanHelpEvents = (items: IdentityHumanHelpEvent[]) => setKey("identity_human_help_events", items);

export const loadReportRuns = () => getKey<IdentityReportRun>("identity_report_runs");
export const persistReportRuns = (items: IdentityReportRun[]) => setKey("identity_report_runs", items);

export const loadExecutiveMetrics = () => getKey<IdentityExecutiveMetric>("identity_executive_metrics");
export const persistExecutiveMetrics = (items: IdentityExecutiveMetric[]) => setKey("identity_executive_metrics", items);

export const loadOperationsAuditEvents = () => getKey<IdentityOperationsAuditEvent>("identity_operations_audit_events");
export const persistOperationsAuditEvents = (items: IdentityOperationsAuditEvent[]) =>
  setKey("identity_operations_audit_events", items);
