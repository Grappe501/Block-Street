import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type {
  BenchmarkSnapshot,
  FederationAgreement,
  FederationAuditEvent,
  FederationHealthSummary,
  FederationMember,
  InstitutionTemplate,
  KnowledgeContribution,
  MarketplaceAsset,
  ReplicatedInstitution,
  SharedResource,
} from "./types";

export const FED_DATA = join(process.cwd(), "data", "federation");

const cache = new Map<string, unknown>();

function readStore(): Record<string, unknown> {
  if (cache.has("store")) return cache.get("store") as Record<string, unknown>;
  const raw = JSON.parse(readFileSync(join(FED_DATA, "store.json"), "utf8"));
  cache.set("store", raw);
  return raw;
}

function writeStore(store: Record<string, unknown>) {
  writeFileSync(join(FED_DATA, "store.json"), JSON.stringify(store, null, 2));
  cache.clear();
}

function readJsonFile<T>(file: string): T {
  const ck = `obj:${file}`;
  if (cache.has(ck)) return cache.get(ck) as T;
  const raw = JSON.parse(readFileSync(join(FED_DATA, file), "utf8"));
  cache.set(ck, raw);
  return raw;
}

export function loadFeatureFlags() {
  return readJsonFile<Record<string, boolean>>("feature_flags.json");
}

export function loadTemplateCatalog() {
  return readJsonFile<{ templates: Omit<InstitutionTemplate, "id" | "source_institution_id" | "status" | "published_at" | "created_at" | "updated_at">[] }>(
    "template_catalog.json"
  ).templates;
}

function getKey<K extends string>(key: K): unknown[] {
  return (readStore()[key] as unknown[]) ?? [];
}

function setKey<K extends string>(key: K, items: unknown[]) {
  const store = readStore();
  store[key] = items;
  writeStore(store);
}

export const loadTemplates = () => getKey("templates") as InstitutionTemplate[];
export const persistTemplates = (items: InstitutionTemplate[]) => setKey("templates", items);
export const loadReplicatedInstitutions = () => getKey("replicated_institutions") as ReplicatedInstitution[];
export const persistReplicatedInstitutions = (items: ReplicatedInstitution[]) => setKey("replicated_institutions", items);
export const loadFederationMembers = () => getKey("federation_members") as FederationMember[];
export const persistFederationMembers = (items: FederationMember[]) => setKey("federation_members", items);
export const loadFederationAgreements = () => getKey("federation_agreements") as FederationAgreement[];
export const persistFederationAgreements = (items: FederationAgreement[]) => setKey("federation_agreements", items);
export const loadSharedResources = () => getKey("shared_resources") as SharedResource[];
export const persistSharedResources = (items: SharedResource[]) => setKey("shared_resources", items);
export const loadKnowledgeContributions = () => getKey("knowledge_contributions") as KnowledgeContribution[];
export const persistKnowledgeContributions = (items: KnowledgeContribution[]) => setKey("knowledge_contributions", items);
export const loadBenchmarkSnapshots = () => getKey("benchmark_snapshots") as BenchmarkSnapshot[];
export const persistBenchmarkSnapshots = (items: BenchmarkSnapshot[]) => setKey("benchmark_snapshots", items);
export const loadMarketplaceAssets = () => getKey("marketplace_assets") as MarketplaceAsset[];
export const persistMarketplaceAssets = (items: MarketplaceAsset[]) => setKey("marketplace_assets", items);
export const loadAuditEvents = () => getKey("audit_events") as FederationAuditEvent[];
export const persistAuditEvents = (items: FederationAuditEvent[]) => setKey("audit_events", items);
export const loadHealthSummary = () => readStore().health_summary as FederationHealthSummary;
export const persistHealthSummary = (summary: FederationHealthSummary) => {
  const store = readStore();
  store.health_summary = summary;
  writeStore(store);
};
