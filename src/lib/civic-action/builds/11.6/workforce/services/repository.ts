/**
 * CAE-11.6-W3 — Workforce persistence
 */
export { readStoreSlice, writeStoreSlice } from "../../../11.1/services/repository";
import { readStoreSlice, writeStoreSlice } from "../../../11.1/services/repository";
import type {
  AvailabilityProfileRecord,
  BurnoutIndicatorRecord,
  CapacitySnapshotRecord,
  DelegationRecord,
  GrowthGoalRecord,
  HumanWorkProfileRecord,
  RecognitionRecord,
  VolunteerProfileExtension,
  WorkAssignmentRecord,
} from "../data-model";
import { WORKFORCE_STORE_KEYS } from "../data-model";

function upsertById<T>(key: string, record: T, idField: keyof T & string) {
  const items = readStoreSlice<T>(key);
  const id = String(record[idField]);
  const idx = items.findIndex((i) => String(i[idField]) === id);
  if (idx >= 0) items[idx] = record;
  else items.push(record);
  writeStoreSlice(key, items);
}

export function listWorkProfiles(institutionId?: string) {
  const items = readStoreSlice<HumanWorkProfileRecord>(WORKFORCE_STORE_KEYS.work_profiles);
  return institutionId ? items.filter((p) => p.institution_id === institutionId) : items;
}

export function getWorkProfileByHuman(humanId: string) {
  return readStoreSlice<HumanWorkProfileRecord>(WORKFORCE_STORE_KEYS.work_profiles).find((p) => p.human_id === humanId) ?? null;
}

export function saveWorkProfile(record: HumanWorkProfileRecord) {
  upsertById(WORKFORCE_STORE_KEYS.work_profiles, record, "human_work_profile_id");
}

export function listAssignments(institutionId?: string, humanId?: string, missionId?: string) {
  return readStoreSlice<WorkAssignmentRecord>(WORKFORCE_STORE_KEYS.work_assignments).filter(
    (a) =>
      (!institutionId || a.institution_id === institutionId) &&
      (!humanId || a.human_id === humanId) &&
      (!missionId || a.mission_id === missionId)
  );
}

export function getAssignment(assignmentId: string) {
  return readStoreSlice<WorkAssignmentRecord>(WORKFORCE_STORE_KEYS.work_assignments).find((a) => a.assignment_id === assignmentId) ?? null;
}

export function saveAssignment(record: WorkAssignmentRecord) {
  upsertById(WORKFORCE_STORE_KEYS.work_assignments, record, "assignment_id");
}

export function listAvailabilityProfiles(institutionId: string, humanId?: string) {
  return readStoreSlice<AvailabilityProfileRecord>(WORKFORCE_STORE_KEYS.availability_profiles).filter(
    (a) => a.institution_id === institutionId && (!humanId || a.human_id === humanId)
  );
}

export function saveAvailabilityProfile(record: AvailabilityProfileRecord) {
  upsertById(WORKFORCE_STORE_KEYS.availability_profiles, record, "availability_profile_id");
}

export function listCapacitySnapshots(institutionId: string, humanId?: string) {
  return readStoreSlice<CapacitySnapshotRecord>(WORKFORCE_STORE_KEYS.capacity_snapshots).filter(
    (c) => c.institution_id === institutionId && (!humanId || c.human_id === humanId)
  );
}

export function saveCapacitySnapshot(record: CapacitySnapshotRecord) {
  upsertById(WORKFORCE_STORE_KEYS.capacity_snapshots, record, "capacity_snapshot_id");
}

export function listDelegations(assignmentId?: string) {
  return readStoreSlice<DelegationRecord>(WORKFORCE_STORE_KEYS.delegations).filter(
    (d) => !assignmentId || d.assignment_id === assignmentId
  );
}

export function saveDelegation(record: DelegationRecord) {
  upsertById(WORKFORCE_STORE_KEYS.delegations, record, "delegation_id");
}

export function listRecognitions(institutionId: string, humanId?: string) {
  return readStoreSlice<RecognitionRecord>(WORKFORCE_STORE_KEYS.recognitions).filter(
    (r) => r.institution_id === institutionId && (!humanId || r.human_id === humanId)
  );
}

export function saveRecognition(record: RecognitionRecord) {
  upsertById(WORKFORCE_STORE_KEYS.recognitions, record, "recognition_id");
}

export function listGrowthGoals(humanId: string) {
  return readStoreSlice<GrowthGoalRecord>(WORKFORCE_STORE_KEYS.growth_goals).filter((g) => g.human_id === humanId);
}

export function saveGrowthGoal(record: GrowthGoalRecord) {
  upsertById(WORKFORCE_STORE_KEYS.growth_goals, record, "growth_goal_id");
}

export function getVolunteerProfile(humanId: string) {
  return readStoreSlice<VolunteerProfileExtension>(WORKFORCE_STORE_KEYS.volunteer_profiles).find((v) => v.human_id === humanId) ?? null;
}

export function saveVolunteerProfile(record: VolunteerProfileExtension) {
  const items = readStoreSlice<VolunteerProfileExtension>(WORKFORCE_STORE_KEYS.volunteer_profiles);
  const idx = items.findIndex((v) => v.human_id === record.human_id);
  if (idx >= 0) items[idx] = record;
  else items.push(record);
  writeStoreSlice(WORKFORCE_STORE_KEYS.volunteer_profiles, items);
}

export function getBurnoutIndicator(humanId: string) {
  return readStoreSlice<BurnoutIndicatorRecord>(WORKFORCE_STORE_KEYS.burnout_indicators).find((b) => b.human_id === humanId) ?? null;
}

export function saveBurnoutIndicator(record: BurnoutIndicatorRecord) {
  upsertById(WORKFORCE_STORE_KEYS.burnout_indicators, record, "indicator_id");
}
