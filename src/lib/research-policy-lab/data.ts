import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { DatasetRequest, PolicyBrief, ResearchReview, ResearchWorkspace } from "./types";

export const RPL_DATA = join(process.cwd(), "data", "research-policy-lab");
const cache = new Map<string, unknown>();

function readStore(): Record<string, unknown> {
  if (cache.has("store")) return cache.get("store") as Record<string, unknown>;
  const raw = JSON.parse(readFileSync(join(RPL_DATA, "store.json"), "utf8"));
  cache.set("store", raw);
  return raw;
}

function writeStore(store: Record<string, unknown>) {
  writeFileSync(join(RPL_DATA, "store.json"), JSON.stringify(store, null, 2));
  cache.clear();
}

function getKey<T>(key: string): T[] {
  return ((readStore()[key] as T[]) ?? []) as T[];
}

function setKey<T>(key: string, items: T[]) {
  const store = readStore();
  store[key] = items;
  writeStore(store);
}

export function loadFeatureFlags() {
  return JSON.parse(readFileSync(join(RPL_DATA, "feature_flags.json"), "utf8")) as Record<
    string,
    boolean | number
  >;
}

export const loadWorkspaces = () => getKey<ResearchWorkspace>("workspaces");
export const persistWorkspaces = (items: ResearchWorkspace[]) => setKey("workspaces", items);
export const loadDatasetRequests = () => getKey<DatasetRequest>("dataset_requests");
export const persistDatasetRequests = (items: DatasetRequest[]) => setKey("dataset_requests", items);
export const loadBriefs = () => getKey<PolicyBrief>("briefs");
export const persistBriefs = (items: PolicyBrief[]) => setKey("briefs", items);
export const loadReviews = () => getKey<ResearchReview>("reviews");
export const persistReviews = (items: ResearchReview[]) => setKey("reviews", items);

export function appendAudit(action: string, detail: string) {
  const store = readStore();
  const events = ((store.audit_events as { at: string; action: string; detail: string }[]) ?? []).slice();
  events.unshift({ at: new Date().toISOString(), action, detail });
  store.audit_events = events.slice(0, 200);
  writeStore(store);
}

export function loadAudit(limit = 20) {
  return (((readStore().audit_events as { at: string; action: string; detail: string }[]) ?? []) as {
    at: string;
    action: string;
    detail: string;
  }[]).slice(0, limit);
}
