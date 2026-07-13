/**
 * CAE-11.6-W8 — Executive persistence
 */
export { readStoreSlice, writeStoreSlice } from "../../../11.1/services/repository";
import { readStoreSlice, writeStoreSlice } from "../../../11.1/services/repository";
import type {
  ExecutiveAlertRecord,
  ExecutiveBriefingRecord,
  ExecutiveDecisionRecord,
  ExecutiveTimelineEntry,
  InstitutionHealthRecord,
  ScenarioRecord,
  WarRoomRecord,
} from "../data-model";
import { EXECUTIVE_STORE_KEYS } from "../data-model";

function upsertById<T>(key: string, record: T, idField: keyof T & string) {
  const items = readStoreSlice<T>(key);
  const id = String(record[idField]);
  const idx = items.findIndex((i) => String(i[idField]) === id);
  if (idx >= 0) items[idx] = record;
  else items.push(record);
  writeStoreSlice(key, items);
}

export function listExecutiveBriefings(institutionId: string) {
  return readStoreSlice<ExecutiveBriefingRecord>(EXECUTIVE_STORE_KEYS.briefings).filter((b) => b.institution_id === institutionId);
}

export function saveExecutiveBriefing(record: ExecutiveBriefingRecord) {
  upsertById(EXECUTIVE_STORE_KEYS.briefings, record, "briefing_id");
}

export function listExecutiveAlerts(institutionId: string, resolved?: boolean) {
  return readStoreSlice<ExecutiveAlertRecord>(EXECUTIVE_STORE_KEYS.alerts).filter(
    (a) => a.institution_id === institutionId && (resolved === undefined || a.resolved === resolved)
  );
}

export function saveExecutiveAlert(record: ExecutiveAlertRecord) {
  upsertById(EXECUTIVE_STORE_KEYS.alerts, record, "alert_id");
}

export function listExecutiveDecisions(institutionId: string, status?: ExecutiveDecisionRecord["status"]) {
  return readStoreSlice<ExecutiveDecisionRecord>(EXECUTIVE_STORE_KEYS.decisions).filter(
    (d) => d.institution_id === institutionId && (!status || d.status === status)
  );
}

export function getExecutiveDecision(decisionId: string) {
  return readStoreSlice<ExecutiveDecisionRecord>(EXECUTIVE_STORE_KEYS.decisions).find((d) => d.decision_id === decisionId) ?? null;
}

export function saveExecutiveDecision(record: ExecutiveDecisionRecord) {
  upsertById(EXECUTIVE_STORE_KEYS.decisions, record, "decision_id");
}

export function getInstitutionHealth(institutionId: string) {
  return readStoreSlice<InstitutionHealthRecord>(EXECUTIVE_STORE_KEYS.institution_health).find((h) => h.institution_id === institutionId) ?? null;
}

export function saveInstitutionHealth(record: InstitutionHealthRecord) {
  upsertById(EXECUTIVE_STORE_KEYS.institution_health, record, "health_id");
}

export function listScenarios(institutionId: string) {
  return readStoreSlice<ScenarioRecord>(EXECUTIVE_STORE_KEYS.scenarios).filter((s) => s.institution_id === institutionId);
}

export function saveScenario(record: ScenarioRecord) {
  upsertById(EXECUTIVE_STORE_KEYS.scenarios, record, "scenario_id");
}

export function listWarRooms(institutionId: string, activeOnly?: boolean) {
  return readStoreSlice<WarRoomRecord>(EXECUTIVE_STORE_KEYS.war_rooms).filter(
    (w) => w.institution_id === institutionId && (!activeOnly || w.status === "active")
  );
}

export function saveWarRoom(record: WarRoomRecord) {
  upsertById(EXECUTIVE_STORE_KEYS.war_rooms, record, "war_room_id");
}

export function listExecutiveTimeline(institutionId: string) {
  return readStoreSlice<ExecutiveTimelineEntry>(EXECUTIVE_STORE_KEYS.timeline).filter((e) => e.institution_id === institutionId);
}

export function saveExecutiveTimelineEntry(record: ExecutiveTimelineEntry) {
  upsertById(EXECUTIVE_STORE_KEYS.timeline, record, "entry_id");
}
