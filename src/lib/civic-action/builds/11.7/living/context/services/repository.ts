/**
 * CAE-11.7-W2 — Context persistence
 */
import { readStoreSlice, writeStoreSlice } from "../../../../11.1/services/repository";
export { readStoreSlice, writeStoreSlice };
import type {
  ActiveContextRecord,
  AttentionItemRecord,
  CalendarContextRecord,
  ContextCorrectionRecord,
  ContextSignalRecord,
  ContextTypeRegistryEntry,
  DeviceSessionRecord,
  FocusSessionRecord,
  InstitutionContextRecord,
  LocationContextRecord,
  NextActionRecord,
  WorkContextRecord,
} from "../data-model";
import { CONTEXT_STORE_KEYS } from "../data-model";

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

export function getContextRegistry() {
  return readStoreSlice<ContextTypeRegistryEntry>(CONTEXT_STORE_KEYS.registry);
}

export function saveContextRegistry(entries: ContextTypeRegistryEntry[]) {
  writeStoreSlice(CONTEXT_STORE_KEYS.registry, entries);
}

export function listSignals(humanId: string) {
  return listByHuman<ContextSignalRecord>(CONTEXT_STORE_KEYS.signals, humanId);
}

export function saveSignal(record: ContextSignalRecord) {
  upsertById(CONTEXT_STORE_KEYS.signals, record, "signal_id");
}

export function listActiveContexts(humanId: string) {
  return listByHuman<ActiveContextRecord>(CONTEXT_STORE_KEYS.active, humanId);
}

export function getPrimaryContext(humanId: string) {
  return listActiveContexts(humanId).find((c) => c.stack_role === "primary" && c.status === "active") ?? null;
}

export function saveActiveContext(record: ActiveContextRecord) {
  upsertById(CONTEXT_STORE_KEYS.active, record, "active_context_id");
}

export function getInstitutionContext(humanId: string) {
  return listByHuman<InstitutionContextRecord>(CONTEXT_STORE_KEYS.institution, humanId).find(
    (c) => c.status === "active"
  ) ?? null;
}

export function saveInstitutionContext(record: InstitutionContextRecord) {
  upsertById(CONTEXT_STORE_KEYS.institution, record, "institution_context_id");
}

export function getWorkContext(humanId: string) {
  return listByHuman<WorkContextRecord>(CONTEXT_STORE_KEYS.work, humanId)[0] ?? null;
}

export function saveWorkContext(record: WorkContextRecord) {
  upsertById(CONTEXT_STORE_KEYS.work, record, "work_context_id");
}

export function getCalendarContext(humanId: string) {
  return listByHuman<CalendarContextRecord>(CONTEXT_STORE_KEYS.calendar, humanId)[0] ?? null;
}

export function saveCalendarContext(record: CalendarContextRecord) {
  upsertById(CONTEXT_STORE_KEYS.calendar, record, "calendar_context_id");
}

export function getLocationContext(humanId: string) {
  return listByHuman<LocationContextRecord>(CONTEXT_STORE_KEYS.location, humanId).find(
    (l) => l.status === "active"
  ) ?? null;
}

export function saveLocationContext(record: LocationContextRecord) {
  upsertById(CONTEXT_STORE_KEYS.location, record, "location_context_id");
}

export function getDeviceSession(humanId: string) {
  return listByHuman<DeviceSessionRecord>(CONTEXT_STORE_KEYS.device, humanId).find((d) => d.status === "active") ?? null;
}

export function saveDeviceSession(record: DeviceSessionRecord) {
  upsertById(CONTEXT_STORE_KEYS.device, record, "device_session_id");
}

export function getActiveFocusSession(humanId: string) {
  return listByHuman<FocusSessionRecord>(CONTEXT_STORE_KEYS.focus, humanId).find((f) => f.status === "active") ?? null;
}

export function saveFocusSession(record: FocusSessionRecord) {
  upsertById(CONTEXT_STORE_KEYS.focus, record, "focus_session_id");
}

export function listAttentionItems(humanId: string) {
  return listByHuman<AttentionItemRecord>(CONTEXT_STORE_KEYS.attention, humanId);
}

export function saveAttentionItem(record: AttentionItemRecord) {
  upsertById(CONTEXT_STORE_KEYS.attention, record, "attention_item_id");
}

export function listNextActions(humanId: string) {
  return listByHuman<NextActionRecord>(CONTEXT_STORE_KEYS.nextActions, humanId);
}

export function saveNextAction(record: NextActionRecord) {
  upsertById(CONTEXT_STORE_KEYS.nextActions, record, "next_action_id");
}

export function listCorrections(humanId: string) {
  return listByHuman<ContextCorrectionRecord>(CONTEXT_STORE_KEYS.corrections, humanId);
}

export function saveCorrection(record: ContextCorrectionRecord) {
  upsertById(CONTEXT_STORE_KEYS.corrections, record, "correction_id");
}

export function isInferencePaused(humanId: string) {
  return readStoreSlice<{ human_id: string; paused: boolean }>(CONTEXT_STORE_KEYS.inferencePaused).some(
    (p) => p.human_id === humanId && p.paused
  );
}

export function setInferencePaused(humanId: string, paused: boolean) {
  const items = readStoreSlice<{ human_id: string; paused: boolean }>(CONTEXT_STORE_KEYS.inferencePaused);
  const idx = items.findIndex((p) => p.human_id === humanId);
  if (idx >= 0) items[idx] = { human_id: humanId, paused };
  else items.push({ human_id: humanId, paused });
  writeStoreSlice(CONTEXT_STORE_KEYS.inferencePaused, items);
}
