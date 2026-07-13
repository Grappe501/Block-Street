/**
 * CAE-11.7-W1 — LocalBrain persistence
 */
import { readStoreSlice, writeStoreSlice } from "../../../../11.1/services/repository";
export { readStoreSlice, writeStoreSlice };
import type {
  CalendarMemoryRecord,
  ContextRuntimeRecord,
  InstitutionConnectionRecord,
  KnowledgeGraphNodeRecord,
  LearningMemoryRecord,
  LocalBrainAnalyticsRecord,
  LocalBrainPreferencesRecord,
  LocalBrainRecord,
  MemoryRecord,
  RelationshipMemoryRecord,
  TimelineEntryRecord,
  WorkingMemorySnapshot,
  WorkspaceMemoryRecord,
} from "../data-model";
import { LOCALBRAIN_STORE_KEYS } from "../data-model";

function upsertById<T>(key: string, record: T, idField: keyof T & string) {
  const items = readStoreSlice<T>(key);
  const id = String(record[idField]);
  const idx = items.findIndex((i) => String(i[idField]) === id);
  if (idx >= 0) items[idx] = record;
  else items.push(record);
  writeStoreSlice(key, items);
}

function listByHuman<T extends { human_id: string }>(key: string, humanId: string) {
  return readStoreSlice<T>(key).filter((r) => r.human_id === humanId);
}

export function getLocalBrainByHuman(humanId: string) {
  return readStoreSlice<LocalBrainRecord>(LOCALBRAIN_STORE_KEYS.brains).find((b) => b.human_id === humanId) ?? null;
}

export function getLocalBrain(localbrainId: string) {
  return readStoreSlice<LocalBrainRecord>(LOCALBRAIN_STORE_KEYS.brains).find((b) => b.localbrain_id === localbrainId) ?? null;
}

export function saveLocalBrain(record: LocalBrainRecord) {
  upsertById(LOCALBRAIN_STORE_KEYS.brains, record, "localbrain_id");
}

export function listMemories(humanId: string, tier?: MemoryRecord["tier"]) {
  const items = listByHuman<MemoryRecord>(LOCALBRAIN_STORE_KEYS.memories, humanId);
  return tier ? items.filter((m) => m.tier === tier) : items;
}

export function saveMemory(record: MemoryRecord) {
  upsertById(LOCALBRAIN_STORE_KEYS.memories, record, "memory_id");
}

export function getWorkingMemory(humanId: string) {
  return listByHuman<WorkingMemorySnapshot>(LOCALBRAIN_STORE_KEYS.working, humanId)[0] ?? null;
}

export function saveWorkingMemory(record: WorkingMemorySnapshot) {
  upsertById(LOCALBRAIN_STORE_KEYS.working, record, "snapshot_id");
}

export function getContextRuntime(humanId: string) {
  return listByHuman<ContextRuntimeRecord>(LOCALBRAIN_STORE_KEYS.context, humanId)[0] ?? null;
}

export function saveContextRuntime(record: ContextRuntimeRecord) {
  upsertById(LOCALBRAIN_STORE_KEYS.context, record, "context_id");
}

export function listTimeline(humanId: string) {
  return listByHuman<TimelineEntryRecord>(LOCALBRAIN_STORE_KEYS.timeline, humanId);
}

export function saveTimelineEntry(record: TimelineEntryRecord) {
  upsertById(LOCALBRAIN_STORE_KEYS.timeline, record, "entry_id");
}

export function listKnowledgeNodes(humanId: string) {
  return listByHuman<KnowledgeGraphNodeRecord>(LOCALBRAIN_STORE_KEYS.knowledge, humanId);
}

export function saveKnowledgeNode(record: KnowledgeGraphNodeRecord) {
  upsertById(LOCALBRAIN_STORE_KEYS.knowledge, record, "node_id");
}

export function listInstitutionConnections(humanId: string) {
  return listByHuman<InstitutionConnectionRecord>(LOCALBRAIN_STORE_KEYS.connections, humanId);
}

export function saveInstitutionConnection(record: InstitutionConnectionRecord) {
  upsertById(LOCALBRAIN_STORE_KEYS.connections, record, "connection_id");
}

export function getWorkspaceMemory(humanId: string) {
  return listByHuman<WorkspaceMemoryRecord>(LOCALBRAIN_STORE_KEYS.workspace, humanId)[0] ?? null;
}

export function saveWorkspaceMemory(record: WorkspaceMemoryRecord) {
  upsertById(LOCALBRAIN_STORE_KEYS.workspace, record, "workspace_memory_id");
}

export function listRelationshipMemory(humanId: string) {
  return listByHuman<RelationshipMemoryRecord>(LOCALBRAIN_STORE_KEYS.relationships, humanId);
}

export function saveRelationshipMemory(record: RelationshipMemoryRecord) {
  upsertById(LOCALBRAIN_STORE_KEYS.relationships, record, "relationship_id");
}

export function getCalendarMemory(humanId: string) {
  return listByHuman<CalendarMemoryRecord>(LOCALBRAIN_STORE_KEYS.calendar, humanId)[0] ?? null;
}

export function saveCalendarMemory(record: CalendarMemoryRecord) {
  upsertById(LOCALBRAIN_STORE_KEYS.calendar, record, "calendar_memory_id");
}

export function getLearningMemory(humanId: string) {
  return listByHuman<LearningMemoryRecord>(LOCALBRAIN_STORE_KEYS.learning, humanId)[0] ?? null;
}

export function saveLearningMemory(record: LearningMemoryRecord) {
  upsertById(LOCALBRAIN_STORE_KEYS.learning, record, "learning_memory_id");
}

export function getPreferences(humanId: string) {
  return listByHuman<LocalBrainPreferencesRecord>(LOCALBRAIN_STORE_KEYS.preferences, humanId)[0] ?? null;
}

export function savePreferences(record: LocalBrainPreferencesRecord) {
  upsertById(LOCALBRAIN_STORE_KEYS.preferences, record, "preferences_id");
}

export function getLocalBrainAnalytics(humanId: string) {
  return listByHuman<LocalBrainAnalyticsRecord>(LOCALBRAIN_STORE_KEYS.analytics, humanId)[0] ?? null;
}

export function saveLocalBrainAnalytics(record: LocalBrainAnalyticsRecord) {
  upsertById(LOCALBRAIN_STORE_KEYS.analytics, record, "analytics_id");
}
