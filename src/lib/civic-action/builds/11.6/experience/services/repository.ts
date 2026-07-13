/**
 * CAE-11.6-W14 — Experience persistence
 */
import { readStoreSlice, writeStoreSlice } from "../../../11.1/services/repository";
export { readStoreSlice, writeStoreSlice };
import type {
  ContextRecord,
  DashboardCardRecord,
  ExperienceAnalyticsRecord,
  ExperienceMemoryRecord,
  ExperienceNotificationRecord,
  OfflineQueueRecord,
  PersonalizationRecord,
  SearchLogRecord,
  WorkspaceRecord,
} from "../data-model";
import { EXPERIENCE_STORE_KEYS } from "../data-model";

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

function listByInstitution<T extends { institution_id: string }>(key: string, institutionId: string) {
  return readStoreSlice<T>(key).filter((r) => r.institution_id === institutionId);
}

export function listWorkspaces(humanId: string) {
  return listByHuman<WorkspaceRecord>(EXPERIENCE_STORE_KEYS.workspaces, humanId);
}

export function getWorkspace(workspaceId: string) {
  return readStoreSlice<WorkspaceRecord>(EXPERIENCE_STORE_KEYS.workspaces).find((w) => w.workspace_id === workspaceId) ?? null;
}

export function saveWorkspace(record: WorkspaceRecord) {
  upsertById(EXPERIENCE_STORE_KEYS.workspaces, record, "workspace_id");
}

export function getContext(humanId: string, institutionId: string) {
  return readStoreSlice<ContextRecord>(EXPERIENCE_STORE_KEYS.context).find(
    (c) => c.human_id === humanId && c.institution_id === institutionId
  ) ?? null;
}

export function saveContext(record: ContextRecord) {
  upsertById(EXPERIENCE_STORE_KEYS.context, record, "context_id");
}

export function listDashboardCards(humanId: string, institutionId: string) {
  return listByHuman<DashboardCardRecord>(EXPERIENCE_STORE_KEYS.dashboard_cards, humanId).filter(
    (c) => c.institution_id === institutionId
  );
}

export function saveDashboardCard(record: DashboardCardRecord) {
  upsertById(EXPERIENCE_STORE_KEYS.dashboard_cards, record, "card_id");
}

export function listExperienceNotifications(humanId: string) {
  return listByHuman<ExperienceNotificationRecord>(EXPERIENCE_STORE_KEYS.notifications, humanId);
}

export function saveExperienceNotification(record: ExperienceNotificationRecord) {
  upsertById(EXPERIENCE_STORE_KEYS.notifications, record, "notification_id");
}

export function getExperienceMemory(humanId: string, institutionId: string) {
  return readStoreSlice<ExperienceMemoryRecord>(EXPERIENCE_STORE_KEYS.memory).find(
    (m) => m.human_id === humanId && m.institution_id === institutionId
  ) ?? null;
}

export function saveExperienceMemory(record: ExperienceMemoryRecord) {
  upsertById(EXPERIENCE_STORE_KEYS.memory, record, "memory_id");
}

export function getPersonalization(institutionId: string) {
  return listByInstitution<PersonalizationRecord>(EXPERIENCE_STORE_KEYS.personalization, institutionId)[0] ?? null;
}

export function savePersonalization(record: PersonalizationRecord) {
  upsertById(EXPERIENCE_STORE_KEYS.personalization, record, "personalization_id");
}

export function listOfflineQueue(humanId: string) {
  return listByHuman<OfflineQueueRecord>(EXPERIENCE_STORE_KEYS.offline_queue, humanId);
}

export function saveOfflineQueue(record: OfflineQueueRecord) {
  upsertById(EXPERIENCE_STORE_KEYS.offline_queue, record, "queue_id");
}

export function getExperienceAnalytics(institutionId: string) {
  return listByInstitution<ExperienceAnalyticsRecord>(EXPERIENCE_STORE_KEYS.analytics, institutionId)[0] ?? null;
}

export function saveExperienceAnalytics(record: ExperienceAnalyticsRecord) {
  upsertById(EXPERIENCE_STORE_KEYS.analytics, record, "analytics_id");
}

export function listSearchLog(humanId: string) {
  return listByHuman<SearchLogRecord>(EXPERIENCE_STORE_KEYS.search_log, humanId);
}

export function saveSearchLog(record: SearchLogRecord) {
  upsertById(EXPERIENCE_STORE_KEYS.search_log, record, "search_id");
}
