import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type {
  DataReadinessAssessment,
  MigrationApproval,
  MigrationAuditEvent,
  MigrationDuplicateCandidate,
  MigrationDryRun,
  MigrationException,
  MigrationFieldMapping,
  MigrationHealth,
  MigrationIdentityMatch,
  MigrationImportJob,
  MigrationIntake,
  MigrationProject,
  MigrationQuarantineItem,
  MigrationReconciliationReport,
  MigrationRecordLink,
  MigrationRiskAssessment,
  MigrationSource,
  MigrationStagingRecord,
} from "./types";

export const MIG_DATA = join(process.cwd(), "data", "migration");

const cache = new Map<string, unknown>();

function readStore(): Record<string, unknown> {
  if (cache.has("store")) return cache.get("store") as Record<string, unknown>;
  const raw = JSON.parse(readFileSync(join(MIG_DATA, "store.json"), "utf8"));
  cache.set("store", raw);
  return raw;
}

function writeStore(store: Record<string, unknown>) {
  writeFileSync(join(MIG_DATA, "store.json"), JSON.stringify(store, null, 2));
  cache.clear();
}

function readJsonFile<T>(file: string): T {
  const ck = `obj:${file}`;
  if (cache.has(ck)) return cache.get(ck) as T;
  const raw = JSON.parse(readFileSync(join(MIG_DATA, file), "utf8"));
  cache.set(ck, raw);
  return raw;
}

export function loadFeatureFlags() {
  return readJsonFile<Record<string, boolean>>("feature_flags.json");
}

export function loadTransformationRules() {
  return readJsonFile<{ rules: Array<Record<string, unknown>> }>("transformation_registry.json").rules;
}

function getKey<K extends string>(key: K): unknown[] {
  return (readStore()[key] as unknown[]) ?? [];
}

function setKey<K extends string>(key: K, items: unknown[]) {
  const store = readStore();
  store[key] = items;
  writeStore(store);
}

export const loadProjects = () => getKey("projects") as MigrationProject[];
export const persistProjects = (items: MigrationProject[]) => setKey("projects", items);
export const loadRiskAssessments = () => getKey("risk_assessments") as MigrationRiskAssessment[];
export const persistRiskAssessments = (items: MigrationRiskAssessment[]) => setKey("risk_assessments", items);
export const loadSources = () => getKey("sources") as MigrationSource[];
export const persistSources = (items: MigrationSource[]) => setKey("sources", items);
export const loadIntakes = () => getKey("intakes") as MigrationIntake[];
export const persistIntakes = (items: MigrationIntake[]) => setKey("intakes", items);
export const loadFieldMappings = () => getKey("field_mappings") as MigrationFieldMapping[];
export const persistFieldMappings = (items: MigrationFieldMapping[]) => setKey("field_mappings", items);
export const loadStagingRecords = () => getKey("staging_records") as MigrationStagingRecord[];
export const persistStagingRecords = (items: MigrationStagingRecord[]) => setKey("staging_records", items);
export const loadIdentityMatches = () => getKey("identity_matches") as MigrationIdentityMatch[];
export const persistIdentityMatches = (items: MigrationIdentityMatch[]) => setKey("identity_matches", items);
export const loadDuplicateCandidates = () => getKey("duplicate_candidates") as MigrationDuplicateCandidate[];
export const persistDuplicateCandidates = (items: MigrationDuplicateCandidate[]) => setKey("duplicate_candidates", items);
export const loadExceptions = () => getKey("exceptions") as MigrationException[];
export const persistExceptions = (items: MigrationException[]) => setKey("exceptions", items);
export const loadDryRuns = () => getKey("dry_runs") as MigrationDryRun[];
export const persistDryRuns = (items: MigrationDryRun[]) => setKey("dry_runs", items);
export const loadApprovals = () => getKey("approvals") as MigrationApproval[];
export const persistApprovals = (items: MigrationApproval[]) => setKey("approvals", items);
export const loadImportJobs = () => getKey("import_jobs") as MigrationImportJob[];
export const persistImportJobs = (items: MigrationImportJob[]) => setKey("import_jobs", items);
export const loadRecordLinks = () => getKey("record_links") as MigrationRecordLink[];
export const persistRecordLinks = (items: MigrationRecordLink[]) => setKey("record_links", items);
export const loadReconciliationReports = () => getKey("reconciliation_reports") as MigrationReconciliationReport[];
export const persistReconciliationReports = (items: MigrationReconciliationReport[]) => setKey("reconciliation_reports", items);
export const loadReadinessAssessments = () => getKey("readiness_assessments") as DataReadinessAssessment[];
export const persistReadinessAssessments = (items: DataReadinessAssessment[]) => setKey("readiness_assessments", items);
export const loadQuarantineItems = () => getKey("quarantine_items") as MigrationQuarantineItem[];
export const persistQuarantineItems = (items: MigrationQuarantineItem[]) => setKey("quarantine_items", items);
export const loadAuditEvents = () => getKey("audit_events") as MigrationAuditEvent[];
export const persistAuditEvents = (items: MigrationAuditEvent[]) => setKey("audit_events", items);

export function appendAudit(event: MigrationAuditEvent) {
  const events = loadAuditEvents();
  events.push(event);
  persistAuditEvents(events);
}

export function loadHealth(): MigrationHealth {
  const store = readStore();
  return (store.health as MigrationHealth) ?? {
    active_projects: 0,
    records_in_staging: 0,
    validation_pass_rate: 0,
    open_exceptions: 0,
    identity_conflicts: 0,
    quarantined_items: 0,
    reconciliation_success_rate: 0,
    readiness_blockers: 0,
  };
}

export function persistHealth(health: MigrationHealth) {
  const store = readStore();
  store.health = health;
  writeStore(store);
}
