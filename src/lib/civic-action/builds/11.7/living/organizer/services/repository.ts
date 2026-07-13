/**
 * CAE-11.7-W4 — Organizer persistence
 */
import { readStoreSlice, writeStoreSlice } from "../../../../11.1/services/repository";
export { readStoreSlice, writeStoreSlice };
import type {
  ChecklistRecord,
  CommunicationCoordinationRecord,
  DailyPlanRecord,
  DailyReviewRecord,
  DeadlineRecord,
  DependencyRecord,
  MissionPlanRecord,
  OrganizerRecommendationRecord,
  ResourceStatusRecord,
  TaskCoordinationRecord,
  TeamStatusRecord,
  TravelPlanRecord,
} from "../data-model";
import { ORGANIZER_STORE_KEYS } from "../data-model";

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

export function listDailyPlans(humanId: string) {
  return listByHuman<DailyPlanRecord>(ORGANIZER_STORE_KEYS.dailyPlans, humanId);
}

export function getDailyPlan(planId: string) {
  return readStoreSlice<DailyPlanRecord>(ORGANIZER_STORE_KEYS.dailyPlans).find((p) => p.daily_plan_id === planId) ?? null;
}

export function saveDailyPlan(record: DailyPlanRecord) {
  upsertById(ORGANIZER_STORE_KEYS.dailyPlans, record, "daily_plan_id");
}

export function getMissionPlan(missionId: string) {
  return readStoreSlice<MissionPlanRecord>(ORGANIZER_STORE_KEYS.missionPlans).find((p) => p.mission_id === missionId) ?? null;
}

export function saveMissionPlan(record: MissionPlanRecord) {
  upsertById(ORGANIZER_STORE_KEYS.missionPlans, record, "mission_plan_id");
}

export function listTasks(humanId: string) {
  return listByHuman<TaskCoordinationRecord>(ORGANIZER_STORE_KEYS.tasks, humanId);
}

export function saveTask(record: TaskCoordinationRecord) {
  upsertById(ORGANIZER_STORE_KEYS.tasks, record, "task_id");
}

export function listDependencies(humanId: string) {
  return listByHuman<DependencyRecord>(ORGANIZER_STORE_KEYS.dependencies, humanId);
}

export function saveDependency(record: DependencyRecord) {
  upsertById(ORGANIZER_STORE_KEYS.dependencies, record, "dependency_id");
}

export function listChecklists(humanId: string) {
  return listByHuman<ChecklistRecord>(ORGANIZER_STORE_KEYS.checklists, humanId);
}

export function saveChecklist(record: ChecklistRecord) {
  upsertById(ORGANIZER_STORE_KEYS.checklists, record, "checklist_id");
}

export function getTeamStatus(institutionId: string, missionId?: string) {
  return (
    readStoreSlice<TeamStatusRecord>(ORGANIZER_STORE_KEYS.teamStatus).find(
      (t) => t.institution_id === institutionId && (missionId ? t.mission_id === missionId : true)
    ) ?? null
  );
}

export function saveTeamStatus(record: TeamStatusRecord) {
  upsertById(ORGANIZER_STORE_KEYS.teamStatus, record, "team_status_id");
}

export function listResources(institutionId: string) {
  return readStoreSlice<ResourceStatusRecord>(ORGANIZER_STORE_KEYS.resources).filter(
    (r) => r.institution_id === institutionId
  );
}

export function saveResource(record: ResourceStatusRecord) {
  upsertById(ORGANIZER_STORE_KEYS.resources, record, "resource_status_id");
}

export function getTravelPlan(humanId: string) {
  return listByHuman<TravelPlanRecord>(ORGANIZER_STORE_KEYS.travel, humanId)[0] ?? null;
}

export function saveTravelPlan(record: TravelPlanRecord) {
  upsertById(ORGANIZER_STORE_KEYS.travel, record, "travel_plan_id");
}

export function getCommunicationCoordination(humanId: string) {
  return listByHuman<CommunicationCoordinationRecord>(ORGANIZER_STORE_KEYS.communications, humanId)[0] ?? null;
}

export function saveCommunicationCoordination(record: CommunicationCoordinationRecord) {
  upsertById(ORGANIZER_STORE_KEYS.communications, record, "communication_id");
}

export function listDeadlines(humanId: string) {
  return listByHuman<DeadlineRecord>(ORGANIZER_STORE_KEYS.deadlines, humanId);
}

export function saveDeadline(record: DeadlineRecord) {
  upsertById(ORGANIZER_STORE_KEYS.deadlines, record, "deadline_id");
}

export function listReviews(humanId: string) {
  return listByHuman<DailyReviewRecord>(ORGANIZER_STORE_KEYS.reviews, humanId);
}

export function saveReview(record: DailyReviewRecord) {
  upsertById(ORGANIZER_STORE_KEYS.reviews, record, "review_id");
}

export function listRecommendations(humanId: string) {
  return listByHuman<OrganizerRecommendationRecord>(ORGANIZER_STORE_KEYS.recommendations, humanId);
}

export function saveRecommendation(record: OrganizerRecommendationRecord) {
  upsertById(ORGANIZER_STORE_KEYS.recommendations, record, "recommendation_id");
}

export function getRecommendation(recommendationId: string) {
  return readStoreSlice<OrganizerRecommendationRecord>(ORGANIZER_STORE_KEYS.recommendations).find(
    (r) => r.recommendation_id === recommendationId
  ) ?? null;
}
