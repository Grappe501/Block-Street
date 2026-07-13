/**
 * CAE-11.6-W11 — Resilience persistence
 */
export { readStoreSlice, writeStoreSlice } from "../../../11.1/services/repository";
import { readStoreSlice, writeStoreSlice } from "../../../11.1/services/repository";
import type {
  BackupVerificationRecord,
  ContinuityPlanRecord,
  EmergencyOperationsCenterRecord,
  IncidentRecord,
  LessonLearnedRecord,
  MutualAidRecord,
  ReadinessIndexRecord,
  RecoveryRecord,
  ResilienceExerciseRecord,
} from "../data-model";
import { RESILIENCE_STORE_KEYS } from "../data-model";

function upsertById<T>(key: string, record: T, idField: keyof T & string) {
  const items = readStoreSlice<T>(key);
  const id = String(record[idField]);
  const idx = items.findIndex((i) => String(i[idField]) === id);
  if (idx >= 0) items[idx] = record;
  else items.push(record);
  writeStoreSlice(key, items);
}

export function listContinuityPlans(institutionId: string) {
  return readStoreSlice<ContinuityPlanRecord>(RESILIENCE_STORE_KEYS.continuity_plans).filter((p) => p.institution_id === institutionId);
}

export function getContinuityPlan(planId: string) {
  return readStoreSlice<ContinuityPlanRecord>(RESILIENCE_STORE_KEYS.continuity_plans).find((p) => p.continuity_plan_id === planId) ?? null;
}

export function saveContinuityPlan(record: ContinuityPlanRecord) {
  upsertById(RESILIENCE_STORE_KEYS.continuity_plans, record, "continuity_plan_id");
}

export function listIncidents(institutionId: string, status?: IncidentRecord["status"]) {
  return readStoreSlice<IncidentRecord>(RESILIENCE_STORE_KEYS.incidents).filter(
    (i) => i.institution_id === institutionId && (!status || i.status === status)
  );
}

export function getIncident(incidentId: string) {
  return readStoreSlice<IncidentRecord>(RESILIENCE_STORE_KEYS.incidents).find((i) => i.incident_id === incidentId) ?? null;
}

export function saveIncident(record: IncidentRecord) {
  upsertById(RESILIENCE_STORE_KEYS.incidents, record, "incident_id");
}

export function listEoc(institutionId: string) {
  return readStoreSlice<EmergencyOperationsCenterRecord>(RESILIENCE_STORE_KEYS.eoc).filter((e) => e.institution_id === institutionId);
}

export function saveEoc(record: EmergencyOperationsCenterRecord) {
  upsertById(RESILIENCE_STORE_KEYS.eoc, record, "eoc_id");
}

export function listRecovery(institutionId: string) {
  return readStoreSlice<RecoveryRecord>(RESILIENCE_STORE_KEYS.recovery).filter((r) => r.institution_id === institutionId);
}

export function saveRecovery(record: RecoveryRecord) {
  upsertById(RESILIENCE_STORE_KEYS.recovery, record, "recovery_id");
}

export function listMutualAid(institutionId: string) {
  return readStoreSlice<MutualAidRecord>(RESILIENCE_STORE_KEYS.mutual_aid).filter((m) => m.institution_id === institutionId);
}

export function saveMutualAid(record: MutualAidRecord) {
  upsertById(RESILIENCE_STORE_KEYS.mutual_aid, record, "aid_id");
}

export function listExercises(institutionId: string) {
  return readStoreSlice<ResilienceExerciseRecord>(RESILIENCE_STORE_KEYS.exercises).filter((e) => e.institution_id === institutionId);
}

export function saveExercise(record: ResilienceExerciseRecord) {
  upsertById(RESILIENCE_STORE_KEYS.exercises, record, "exercise_id");
}

export function listBackupVerifications(institutionId: string) {
  return readStoreSlice<BackupVerificationRecord>(RESILIENCE_STORE_KEYS.backups).filter((b) => b.institution_id === institutionId);
}

export function saveBackupVerification(record: BackupVerificationRecord) {
  upsertById(RESILIENCE_STORE_KEYS.backups, record, "verification_id");
}

export function getReadinessIndex(institutionId: string) {
  return readStoreSlice<ReadinessIndexRecord>(RESILIENCE_STORE_KEYS.readiness).find((r) => r.institution_id === institutionId) ?? null;
}

export function saveReadinessIndex(record: ReadinessIndexRecord) {
  upsertById(RESILIENCE_STORE_KEYS.readiness, record, "readiness_id");
}

export function listLessons(institutionId: string) {
  return readStoreSlice<LessonLearnedRecord>(RESILIENCE_STORE_KEYS.lessons).filter((l) => l.institution_id === institutionId);
}

export function saveLesson(record: LessonLearnedRecord) {
  upsertById(RESILIENCE_STORE_KEYS.lessons, record, "lesson_id");
}
