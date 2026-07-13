/**
 * CAE-11.6-W1 — Strategic planning persistence
 */
export { readStoreSlice, writeStoreSlice } from "../../11.1/services/repository";
import { readStoreSlice, writeStoreSlice } from "../../11.1/services/repository";
import type {
  PurposeRecord,
  VisionRecord,
  MissionStatementRecord,
  StrategicGoalRecord,
  StrategicObjectiveRecord,
  StrategicKeyResultRecord,
  StrategicPillarRecord,
  ProgramRecord,
  ProjectRecord,
  StrategicReviewRecord,
} from "../data-model";
import { STRATEGY_STORE_KEYS } from "../data-model";

function upsertById<T extends { canonical_id: string }>(key: string, record: T) {
  const items = readStoreSlice<T>(key);
  const idx = items.findIndex((i) => i.canonical_id === record.canonical_id);
  if (idx >= 0) items[idx] = record;
  else items.push(record);
  writeStoreSlice(key, items);
}

export function listPurposes(institutionId?: string) {
  const items = readStoreSlice<PurposeRecord>(STRATEGY_STORE_KEYS.purposes);
  return institutionId ? items.filter((p) => p.institution_id === institutionId) : items;
}

export function getActivePurpose(institutionId: string) {
  return listPurposes(institutionId).find((p) => p.lifecycle_state === "active") ?? null;
}

export function savePurpose(record: PurposeRecord) {
  upsertById(STRATEGY_STORE_KEYS.purposes, record);
}

export function listVisions(institutionId: string) {
  return readStoreSlice<VisionRecord>(STRATEGY_STORE_KEYS.visions).filter((v) => v.institution_id === institutionId);
}

export function getActiveVision(institutionId: string) {
  return listVisions(institutionId).find((v) => v.lifecycle_state === "active") ?? null;
}

export function saveVision(record: VisionRecord) {
  upsertById(STRATEGY_STORE_KEYS.visions, record);
}

export function getActiveMission(institutionId: string) {
  return readStoreSlice<MissionStatementRecord>(STRATEGY_STORE_KEYS.mission_statements).find(
    (m) => m.institution_id === institutionId && m.lifecycle_state === "active"
  ) ?? null;
}

export function saveMissionStatement(record: MissionStatementRecord) {
  upsertById(STRATEGY_STORE_KEYS.mission_statements, record);
}

export function listPillars(institutionId: string) {
  return readStoreSlice<StrategicPillarRecord>(STRATEGY_STORE_KEYS.pillars).filter((p) => p.institution_id === institutionId);
}

export function listGoals(institutionId: string, pillarId?: string) {
  return readStoreSlice<StrategicGoalRecord>(STRATEGY_STORE_KEYS.goals).filter(
    (g) => g.institution_id === institutionId && (!pillarId || g.pillar_id === pillarId)
  );
}

export function saveGoal(record: StrategicGoalRecord) {
  upsertById(STRATEGY_STORE_KEYS.goals, record);
}

export function listStrategicObjectives(institutionId: string, goalId?: string) {
  return readStoreSlice<StrategicObjectiveRecord>(STRATEGY_STORE_KEYS.objectives).filter(
    (o) => o.institution_id === institutionId && (!goalId || o.goal_id === goalId)
  );
}

export function saveStrategicObjective(record: StrategicObjectiveRecord) {
  upsertById(STRATEGY_STORE_KEYS.objectives, record);
}

export function listKeyResults(institutionId: string, objectiveId?: string) {
  return readStoreSlice<StrategicKeyResultRecord>(STRATEGY_STORE_KEYS.key_results).filter(
    (k) => k.institution_id === institutionId && (!objectiveId || k.objective_id === objectiveId)
  );
}

export function saveKeyResult(record: StrategicKeyResultRecord) {
  upsertById(STRATEGY_STORE_KEYS.key_results, record);
}

export function listPrograms(institutionId: string) {
  return readStoreSlice<ProgramRecord>(STRATEGY_STORE_KEYS.programs).filter((p) => p.institution_id === institutionId);
}

export function listProjects(institutionId: string, programId?: string) {
  return readStoreSlice<ProjectRecord>(STRATEGY_STORE_KEYS.projects).filter(
    (p) => p.institution_id === institutionId && (!programId || p.program_id === programId)
  );
}

export function listReviews(institutionId: string) {
  return readStoreSlice<StrategicReviewRecord>(STRATEGY_STORE_KEYS.reviews).filter((r) => r.institution_id === institutionId);
}

export function saveReview(record: StrategicReviewRecord) {
  upsertById(STRATEGY_STORE_KEYS.reviews, record);
}
