/**
 * CAE-11.6-W2 — Mission execution persistence
 */
export { readStoreSlice, writeStoreSlice } from "../../../11.1/services/repository";
import { readStoreSlice, writeStoreSlice } from "../../../11.1/services/repository";
import type {
  ChecklistItemRecord,
  MissionActivityRecord,
  MissionCommunicationRecord,
  MissionDecisionRecord,
  MissionDependencyRecord,
  MissionEvidenceRecord,
  MissionLessonRecord,
  MissionPhaseRecord,
  MissionRiskRecord,
  MissionRoleAssignment,
  MissionTaskRecord,
  MissionTransitionAudit,
  OperationalMissionRecord,
  OperationalMissionTemplateRecord,
} from "../data-model";
import { EXECUTION_STORE_KEYS } from "../data-model";

function upsertById<T>(key: string, record: T, idField: keyof T & string) {
  const items = readStoreSlice<T>(key);
  const id = String(record[idField]);
  const idx = items.findIndex((i) => String(i[idField]) === id);
  if (idx >= 0) items[idx] = record;
  else items.push(record);
  writeStoreSlice(key, items);
}

export function listOperationalMissions(institutionId?: string) {
  const items = readStoreSlice<OperationalMissionRecord>(EXECUTION_STORE_KEYS.operational_missions);
  return institutionId ? items.filter((m) => m.institution_id === institutionId) : items;
}

export function loadOperationalMission(missionId: string) {
  return readStoreSlice<OperationalMissionRecord>(EXECUTION_STORE_KEYS.operational_missions).find((m) => m.mission_id === missionId) ?? null;
}

export function saveOperationalMission(record: OperationalMissionRecord) {
  upsertById(EXECUTION_STORE_KEYS.operational_missions, record, "mission_id");
}

export function listTasksForMission(missionId: string) {
  return readStoreSlice<MissionTaskRecord>(EXECUTION_STORE_KEYS.mission_tasks).filter((t) => t.mission_id === missionId);
}

export function saveTask(record: MissionTaskRecord) {
  upsertById(EXECUTION_STORE_KEYS.mission_tasks, record, "task_id");
}

export function listPhasesForMission(missionId: string) {
  return readStoreSlice<MissionPhaseRecord>(EXECUTION_STORE_KEYS.mission_phases).filter((p) => p.mission_id === missionId);
}

export function savePhase(record: MissionPhaseRecord) {
  upsertById(EXECUTION_STORE_KEYS.mission_phases, record, "phase_id");
}

export function listActivitiesForMission(missionId: string) {
  return readStoreSlice<MissionActivityRecord>(EXECUTION_STORE_KEYS.mission_activities).filter((a) => a.mission_id === missionId);
}

export function saveActivity(record: MissionActivityRecord) {
  upsertById(EXECUTION_STORE_KEYS.mission_activities, record, "activity_id");
}

export function listChecklistItems(missionId: string) {
  return readStoreSlice<ChecklistItemRecord>(EXECUTION_STORE_KEYS.checklist_items).filter((c) => c.mission_id === missionId);
}

export function saveChecklistItem(record: ChecklistItemRecord) {
  upsertById(EXECUTION_STORE_KEYS.checklist_items, record, "item_id");
}

export function listMissionEvidence(missionId: string) {
  return readStoreSlice<MissionEvidenceRecord>(EXECUTION_STORE_KEYS.mission_evidence).filter((e) => e.mission_id === missionId);
}

export function saveEvidence(record: MissionEvidenceRecord) {
  upsertById(EXECUTION_STORE_KEYS.mission_evidence, record, "evidence_id");
}

export function listMissionCommunications(missionId: string) {
  return readStoreSlice<MissionCommunicationRecord>(EXECUTION_STORE_KEYS.mission_communications).filter((c) => c.mission_id === missionId);
}

export function saveCommunication(record: MissionCommunicationRecord) {
  upsertById(EXECUTION_STORE_KEYS.mission_communications, record, "communication_id");
}

export function listMissionDecisions(missionId: string) {
  return readStoreSlice<MissionDecisionRecord>(EXECUTION_STORE_KEYS.mission_decisions).filter((d) => d.mission_id === missionId);
}

export function saveDecision(record: MissionDecisionRecord) {
  upsertById(EXECUTION_STORE_KEYS.mission_decisions, record, "decision_id");
}

export function listMissionLessons(missionId: string) {
  return readStoreSlice<MissionLessonRecord>(EXECUTION_STORE_KEYS.mission_lessons).filter((l) => l.mission_id === missionId);
}

export function saveLesson(record: MissionLessonRecord) {
  upsertById(EXECUTION_STORE_KEYS.mission_lessons, record, "lesson_id");
}

export function listMissionRisks(missionId: string) {
  return readStoreSlice<MissionRiskRecord>(EXECUTION_STORE_KEYS.mission_risks).filter((r) => r.mission_id === missionId);
}

export function saveMissionRisk(record: MissionRiskRecord) {
  upsertById(EXECUTION_STORE_KEYS.mission_risks, record, "risk_id");
}

export function listMissionDependencies(missionId: string) {
  return readStoreSlice<MissionDependencyRecord>(EXECUTION_STORE_KEYS.mission_dependencies).filter((d) => d.mission_id === missionId);
}

export function saveMissionDependency(record: MissionDependencyRecord) {
  upsertById(EXECUTION_STORE_KEYS.mission_dependencies, record, "dependency_id");
}

export function listMissionRoles(missionId: string) {
  return readStoreSlice<MissionRoleAssignment>(EXECUTION_STORE_KEYS.mission_roles).filter((r) => r.mission_id === missionId);
}

export function saveMissionRole(record: MissionRoleAssignment) {
  upsertById(EXECUTION_STORE_KEYS.mission_roles, record, "assignment_id");
}

export function appendTransitionAudit(record: MissionTransitionAudit) {
  const items = readStoreSlice<MissionTransitionAudit>(EXECUTION_STORE_KEYS.mission_transitions);
  items.push(record);
  writeStoreSlice(EXECUTION_STORE_KEYS.mission_transitions, items);
}

export function listTransitionAudits(missionId: string) {
  return readStoreSlice<MissionTransitionAudit>(EXECUTION_STORE_KEYS.mission_transitions).filter((a) => a.mission_id === missionId);
}

export function listMissionTemplates(institutionId: string) {
  return readStoreSlice<OperationalMissionTemplateRecord>(EXECUTION_STORE_KEYS.mission_templates).filter((t) => t.institution_id === institutionId);
}

export function saveMissionTemplate(record: OperationalMissionTemplateRecord) {
  upsertById(EXECUTION_STORE_KEYS.mission_templates, record, "template_id");
}
