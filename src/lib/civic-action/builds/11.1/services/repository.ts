/**
 * CAE-11.1-W3 — Canonical initiative persistence
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import type { InitiativeAggregate } from "../data-model";
import { INITIATIVE_STORE_KEYS } from "../data-model";
import { loadInitiatives } from "../../../data";
import { projectLegacyInitiatives } from "../legacy-adapter";

const DATA_DIR = join(process.cwd(), "data", "civic-action");
const STORE_PATH = join(DATA_DIR, "store.json");
const cache = new Map<string, unknown>();

function ensureStore() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(STORE_PATH)) writeFileSync(STORE_PATH, JSON.stringify({}, null, 2));
}

function readStore(): Record<string, unknown> {
  if (cache.has("store")) return cache.get("store") as Record<string, unknown>;
  ensureStore();
  const raw = JSON.parse(readFileSync(STORE_PATH, "utf8"));
  cache.set("store", raw);
  return raw;
}

function writeStore(store: Record<string, unknown>) {
  ensureStore();
  writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
  cache.clear();
}

export function readStoreSlice<T>(key: string): T[] {
  return (readStore()[key] as T[]) ?? [];
}

export function writeStoreSlice<T>(key: string, items: T[]) {
  const store = readStore();
  store[key] = items;
  writeStore(store);
}

export function getIdempotencyResult(key: string): unknown | null {
  const map = (readStore().initiative_idempotency as Record<string, unknown>) ?? {};
  return map[key] ?? null;
}

export function setIdempotencyResult(key: string, result: unknown, payloadHash: string) {
  const store = readStore();
  const map = (store.initiative_idempotency as Record<string, { result: unknown; payload_hash: string }>) ?? {};
  if (map[key] && map[key].payload_hash !== payloadHash) {
    return false;
  }
  map[key] = { result, payload_hash: payloadHash };
  store.initiative_idempotency = map;
  writeStore(store);
  return true;
}

export function ensureCanonicalInitiativeStore(): { migrated: boolean; count: number } {
  const existing = readStoreSlice<InitiativeAggregate["initiative"]>(INITIATIVE_STORE_KEYS.initiatives);
  if (existing.length > 0) return { migrated: false, count: existing.length };

  const legacy = loadInitiatives();
  if (legacy.length === 0) return { migrated: false, count: 0 };

  const projected = projectLegacyInitiatives(legacy);
  for (const agg of projected) {
    persistAggregate(agg);
  }
  return { migrated: true, count: projected.length };
}

export function loadInitiativeAggregate(initiativeId: string): InitiativeAggregate | null {
  ensureCanonicalInitiativeStore();
  const initiative = readStoreSlice<InitiativeAggregate["initiative"]>(INITIATIVE_STORE_KEYS.initiatives).find(
    (i) => i.initiative_id === initiativeId
  );
  if (!initiative) return null;

  const charters = readStoreSlice<InitiativeAggregate["charter"]>(INITIATIVE_STORE_KEYS.charters).filter(
    (c) => c && c.initiative_id === initiativeId
  );
  const scopes = readStoreSlice<InitiativeAggregate["scope"]>(INITIATIVE_STORE_KEYS.scopes).filter(
    (s) => s && s.initiative_id === initiativeId
  );
  const timelines = readStoreSlice<InitiativeAggregate["timeline"]>(INITIATIVE_STORE_KEYS.timelines);
  const memberships = readStoreSlice<InitiativeAggregate["memberships"][0]>(INITIATIVE_STORE_KEYS.memberships).filter(
    (m) => m.initiative_id === initiativeId
  );
  const versions = readStoreSlice<InitiativeAggregate["versions"][0]>(INITIATIVE_STORE_KEYS.versions).filter(
    (v) => v.initiative_id === initiativeId
  );
  const dependencies = readStoreSlice<InitiativeAggregate["dependencies"][0]>(INITIATIVE_STORE_KEYS.dependencies).filter(
    (d) => d.initiative_id === initiativeId
  );
  const reviews = readStoreSlice<InitiativeAggregate["reviews"][0]>(INITIATIVE_STORE_KEYS.reviews).filter(
    (r) => r.initiative_id === initiativeId
  );
  const history = readStoreSlice<InitiativeAggregate["history"][0]>(INITIATIVE_STORE_KEYS.history).filter(
    (h) => h.initiative_id === initiativeId
  );
  const closeouts = readStoreSlice<InitiativeAggregate["closeout"]>(INITIATIVE_STORE_KEYS.closeouts).filter(
    (c) => c && c.initiative_id === initiativeId
  );

  const activeCharter = charters.find((c) => c!.charter_status === "active_version" || c!.charter_status === "approved") ?? charters[charters.length - 1] ?? null;
  const activeScope = scopes.sort((a, b) => (b?.version ?? 0) - (a?.version ?? 0))[0] ?? null;

  return {
    initiative,
    charter: activeCharter,
    scope: activeScope,
    timeline: timelines.find((t) => t?.initiative_id === initiativeId) ?? null,
    memberships,
    versions,
    dependencies,
    reviews,
    history,
    closeout: closeouts[0] ?? null,
  };
}

export function listCanonicalInitiativeIds(): string[] {
  ensureCanonicalInitiativeStore();
  return readStoreSlice<InitiativeAggregate["initiative"]>(INITIATIVE_STORE_KEYS.initiatives).map((i) => i.initiative_id);
}

export function persistAggregate(aggregate: InitiativeAggregate) {
  const upsert = <T extends { initiative_id: string }>(key: string, items: T[], single?: T | null) => {
    if (single === undefined) return;
    const all = readStoreSlice<T>(key).filter((x) => x.initiative_id !== aggregate.initiative.initiative_id);
    if (single) all.push(single);
    writeStoreSlice(key, all);
  };

  const upsertMany = <T extends { initiative_id: string }>(key: string, items: T[]) => {
    const all = readStoreSlice<T>(key).filter((x) => x.initiative_id !== aggregate.initiative.initiative_id);
    all.push(...items);
    writeStoreSlice(key, all);
  };

  const initiatives = readStoreSlice<InitiativeAggregate["initiative"]>(INITIATIVE_STORE_KEYS.initiatives).filter(
    (i) => i.initiative_id !== aggregate.initiative.initiative_id
  );
  initiatives.push(aggregate.initiative);
  writeStoreSlice(INITIATIVE_STORE_KEYS.initiatives, initiatives);

  if (aggregate.charter) {
    const charters = readStoreSlice<NonNullable<InitiativeAggregate["charter"]>>(INITIATIVE_STORE_KEYS.charters).filter(
      (c) => c.charter_id !== aggregate.charter!.charter_id
    );
    charters.push(aggregate.charter);
    writeStoreSlice(INITIATIVE_STORE_KEYS.charters, charters);
  }

  if (aggregate.scope) {
    const scopes = readStoreSlice<NonNullable<InitiativeAggregate["scope"]>>(INITIATIVE_STORE_KEYS.scopes).filter(
      (s) => s.scope_id !== aggregate.scope!.scope_id
    );
    scopes.push(aggregate.scope);
    writeStoreSlice(INITIATIVE_STORE_KEYS.scopes, scopes);
  }

  upsert(INITIATIVE_STORE_KEYS.timelines, [], aggregate.timeline);
  upsertMany(INITIATIVE_STORE_KEYS.memberships, aggregate.memberships);
  upsertMany(INITIATIVE_STORE_KEYS.versions, aggregate.versions);
  upsertMany(INITIATIVE_STORE_KEYS.dependencies, aggregate.dependencies);
  upsertMany(INITIATIVE_STORE_KEYS.reviews, aggregate.reviews);
  upsertMany(INITIATIVE_STORE_KEYS.history, aggregate.history);
  upsert(INITIATIVE_STORE_KEYS.closeouts, [], aggregate.closeout);
}

export function appendHistoryEvent(event: InitiativeAggregate["history"][0]) {
  const all = readStoreSlice<InitiativeAggregate["history"][0]>(INITIATIVE_STORE_KEYS.history);
  all.push(event);
  writeStoreSlice(INITIATIVE_STORE_KEYS.history, all);
}
