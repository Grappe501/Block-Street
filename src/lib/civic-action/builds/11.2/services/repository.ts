/**
 * CAE-11.2-W3 — Execution persistence (reuses civic-action store)
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

export {
  readStoreSlice,
  writeStoreSlice,
} from "../../11.1/services/repository";
import { readStoreSlice, writeStoreSlice } from "../../11.1/services/repository";
import { caeId } from "../../../utils";
import type {
  ExecutionHistoryEvent,
  ExecutionVersionRecord,
  MissionRecord,
  ObjectiveRecord,
  TaskRecord,
  WorkstreamRecord,
  EvidenceRecord,
  OutcomeRecord,
  KeyResultRecord,
} from "../data-model";
import { EXECUTION_STORE_KEYS } from "../data-model";

export const EXECUTION_OUTBOX_KEY = "execution_event_outbox";
export const EXECUTION_DOMAIN_EVENTS_KEY = "execution_domain_events";
export const EXECUTION_IDEMPOTENCY_KEY = "execution_idempotency";
export const EXECUTION_AUDIT_KEY = "execution_audit_entries";

const DATA_DIR = join(process.cwd(), "data", "civic-action");
const STORE_PATH = join(DATA_DIR, "store.json");

function readRootStore(): Record<string, unknown> {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(STORE_PATH)) writeFileSync(STORE_PATH, JSON.stringify({}, null, 2));
  return JSON.parse(readFileSync(STORE_PATH, "utf8"));
}

function writeRootStore(store: Record<string, unknown>) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

export function getExecutionIdempotencyResult(key: string): unknown | null {
  const map = (readRootStore()[EXECUTION_IDEMPOTENCY_KEY] as Record<string, unknown>) ?? {};
  const entry = map[key] as { result: unknown; payload_hash: string } | undefined;
  return entry?.result ?? null;
}

export function setExecutionIdempotencyResult(key: string, result: unknown, payloadHash: string): boolean {
  const store = readRootStore();
  const map = (store[EXECUTION_IDEMPOTENCY_KEY] as Record<string, { result: unknown; payload_hash: string }>) ?? {};
  if (map[key] && map[key].payload_hash !== payloadHash) return false;
  map[key] = { result, payload_hash: payloadHash };
  store[EXECUTION_IDEMPOTENCY_KEY] = map;
  writeRootStore(store);
  return true;
}

function upsertById<T extends { canonical_id: string }>(key: string, record: T) {
  const items = readStoreSlice<T>(key);
  const idx = items.findIndex((i) => i.canonical_id === record.canonical_id);
  if (idx >= 0) items[idx] = record;
  else items.push(record);
  writeStoreSlice(key, items);
}

export function saveObjective(record: ObjectiveRecord) {
  upsertById(EXECUTION_STORE_KEYS.objectives, record);
}

export function saveWorkstream(record: WorkstreamRecord) {
  upsertById(EXECUTION_STORE_KEYS.workstreams, record);
}

export function saveMission(record: MissionRecord) {
  upsertById(EXECUTION_STORE_KEYS.missions, record);
}

export function saveTask(record: TaskRecord) {
  upsertById(EXECUTION_STORE_KEYS.tasks, record);
}

export function saveEvidence(record: EvidenceRecord) {
  upsertById(EXECUTION_STORE_KEYS.evidence, record);
}

export function saveOutcome(record: OutcomeRecord) {
  upsertById(EXECUTION_STORE_KEYS.outcomes, record);
}

export function loadObjective(id: string): ObjectiveRecord | null {
  return readStoreSlice<ObjectiveRecord>(EXECUTION_STORE_KEYS.objectives).find((o) => o.canonical_id === id) ?? null;
}

export function loadMission(id: string): MissionRecord | null {
  return readStoreSlice<MissionRecord>(EXECUTION_STORE_KEYS.missions).find((m) => m.canonical_id === id) ?? null;
}

export function loadTask(id: string): TaskRecord | null {
  return readStoreSlice<TaskRecord>(EXECUTION_STORE_KEYS.tasks).find((t) => t.canonical_id === id) ?? null;
}

export function loadWorkstream(id: string): WorkstreamRecord | null {
  return readStoreSlice<WorkstreamRecord>(EXECUTION_STORE_KEYS.workstreams).find((w) => w.canonical_id === id) ?? null;
}

export function listMissionsForObjective(objectiveId: string): MissionRecord[] {
  return readStoreSlice<MissionRecord>(EXECUTION_STORE_KEYS.missions).filter((m) => m.objective_id === objectiveId);
}

export function listTasksForMission(missionId: string): TaskRecord[] {
  return readStoreSlice<TaskRecord>(EXECUTION_STORE_KEYS.tasks).filter((t) => t.mission_id === missionId);
}

export function listKeyResultsForObjective(objectiveId: string): KeyResultRecord[] {
  return readStoreSlice<KeyResultRecord>(EXECUTION_STORE_KEYS.key_results).filter((k) => k.objective_id === objectiveId);
}

export function appendExecutionHistory(event: ExecutionHistoryEvent) {
  const items = readStoreSlice<ExecutionHistoryEvent>(EXECUTION_STORE_KEYS.history);
  items.push(event);
  writeStoreSlice(EXECUTION_STORE_KEYS.history, items);
}

export function appendExecutionVersion(version: ExecutionVersionRecord) {
  const items = readStoreSlice<ExecutionVersionRecord>(EXECUTION_STORE_KEYS.versions);
  items.push(version);
  writeStoreSlice(EXECUTION_STORE_KEYS.versions, items);
}

export function createDefaultWorkstream(objective: ObjectiveRecord, actorId: string): WorkstreamRecord {
  const now = new Date().toISOString();
  return {
    canonical_id: caeId("wks"),
    public_id: `WS-${objective.public_id}`,
    display_name: `${objective.display_name} — Primary Workstream`,
    canonical_slug: `${objective.canonical_slug}-primary`,
    institution_id: objective.institution_id,
    initiative_id: objective.initiative_id,
    parent_object_id: objective.canonical_id,
    parent_object_type: "Objective",
    object_type: "Workstream",
    visibility: objective.visibility,
    governance_classification: objective.governance_classification,
    executive_owner_human_id: objective.executive_owner_human_id,
    operational_owner_human_id: objective.operational_owner_human_id,
    current_responsible_human_id: objective.operational_owner_human_id,
    created_by: actorId,
    last_modified_by: actorId,
    created_at: now,
    updated_at: now,
    current_version: 1,
    lifecycle_state: "active",
    tags: [],
    objective_id: objective.canonical_id,
    purpose: objective.purpose,
    priority: objective.priority,
    capacity_band: null,
    review_rhythm: objective.review_rhythm,
  };
}
