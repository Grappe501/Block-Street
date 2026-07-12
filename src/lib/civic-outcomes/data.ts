import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type {
  OutcomeAuditEvent,
  OutcomeBenchmark,
  OutcomeEvidence,
  OutcomeRecord,
  OutcomeReport,
  OutcomeTimelineEntry,
  ProgramEvaluation,
  ProgramOutput,
  TheoryOfChange,
} from "./types";

export const OUT_DATA = join(process.cwd(), "data", "civic-outcomes");

const cache = new Map<string, unknown>();

function readStore(): Record<string, unknown> {
  if (cache.has("store")) return cache.get("store") as Record<string, unknown>;
  const raw = JSON.parse(readFileSync(join(OUT_DATA, "store.json"), "utf8"));
  cache.set("store", raw);
  return raw;
}

function writeStore(store: Record<string, unknown>) {
  writeFileSync(join(OUT_DATA, "store.json"), JSON.stringify(store, null, 2));
  cache.clear();
}

function readJsonFile<T>(file: string): T {
  const ck = `obj:${file}`;
  if (cache.has(ck)) return cache.get(ck) as T;
  const raw = JSON.parse(readFileSync(join(OUT_DATA, file), "utf8"));
  cache.set(ck, raw);
  return raw;
}

export function loadFeatureFlags() {
  return readJsonFile<Record<string, boolean>>("feature_flags.json");
}

export function loadIndicatorCatalog() {
  return readJsonFile<{ indicators: string[] }>("indicator_catalog.json").indicators;
}

function getKey<K extends string>(key: K): unknown[] {
  return (readStore()[key] as unknown[]) ?? [];
}

function setKey<K extends string>(key: K, items: unknown[]) {
  const store = readStore();
  store[key] = items;
  writeStore(store);
}

export const loadOutcomes = () => getKey("outcome_records") as OutcomeRecord[];
export const persistOutcomes = (items: OutcomeRecord[]) => setKey("outcome_records", items);
export const loadEvidence = () => getKey("evidence") as OutcomeEvidence[];
export const persistEvidence = (items: OutcomeEvidence[]) => setKey("evidence", items);
export const loadTheoryOfChange = () => getKey("theory_of_change") as TheoryOfChange[];
export const persistTheoryOfChange = (items: TheoryOfChange[]) => setKey("theory_of_change", items);
export const loadOutputs = () => getKey("outputs") as ProgramOutput[];
export const persistOutputs = (items: ProgramOutput[]) => setKey("outputs", items);
export const loadEvaluations = () => getKey("evaluations") as ProgramEvaluation[];
export const persistEvaluations = (items: ProgramEvaluation[]) => setKey("evaluations", items);
export const loadTimeline = () => getKey("timeline") as OutcomeTimelineEntry[];
export const persistTimeline = (items: OutcomeTimelineEntry[]) => setKey("timeline", items);
export const loadBenchmarks = () => getKey("benchmarks") as OutcomeBenchmark[];
export const persistBenchmarks = (items: OutcomeBenchmark[]) => setKey("benchmarks", items);
export const loadReports = () => getKey("reports") as OutcomeReport[];
export const persistReports = (items: OutcomeReport[]) => setKey("reports", items);
export const loadAuditEvents = () => getKey("audit_events") as OutcomeAuditEvent[];
export const persistAuditEvents = (items: OutcomeAuditEvent[]) => setKey("audit_events", items);
