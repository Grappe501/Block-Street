/**
 * CAE-11.7-W14 — Digital Twin persistence
 */
import { readStoreSlice, writeStoreSlice } from "../../../../11.1/services/repository";
export { readStoreSlice, writeStoreSlice };
import type {
  AISandboxRecord,
  ExperimentRecord,
  InstitutionModelRecord,
  PolicySandboxRecord,
  ResourceSimulationRecord,
  ScenarioRecord,
  SimulationRecord,
  StressTestRecord,
  SyncRecord,
  TrainingSimulationRecord,
  TwinAccuracyRecord,
  TwinObservatoryRecord,
  TwinRecord,
} from "../data-model";
import { TWIN_STORE_KEYS } from "../data-model";

function upsertById<T>(key: string, record: T, idField: keyof T & string) {
  const items = readStoreSlice<T>(key);
  const id = String(record[idField]);
  const idx = items.findIndex((i) => String(i[idField]) === id);
  if (idx >= 0) items[idx] = record;
  else items.push(record);
  writeStoreSlice(key, items);
}

function listByInstitution<T extends { institution_id: string }>(key: string, institutionId: string) {
  return readStoreSlice<T>(key).filter((r) => r.institution_id === institutionId);
}

export function listTwins(institutionId: string) {
  return listByInstitution<TwinRecord>(TWIN_STORE_KEYS.twins, institutionId);
}

export function saveTwin(record: TwinRecord) {
  upsertById(TWIN_STORE_KEYS.twins, record, "twin_id");
}

export function listModels(institutionId: string) {
  return listByInstitution<InstitutionModelRecord>(TWIN_STORE_KEYS.models, institutionId);
}

export function saveModel(record: InstitutionModelRecord) {
  upsertById(TWIN_STORE_KEYS.models, record, "model_id");
}

export function listSyncs(institutionId: string) {
  return listByInstitution<SyncRecord>(TWIN_STORE_KEYS.syncs, institutionId);
}

export function saveSync(record: SyncRecord) {
  upsertById(TWIN_STORE_KEYS.syncs, record, "sync_id");
}

export function listSimulations(institutionId: string) {
  return listByInstitution<SimulationRecord>(TWIN_STORE_KEYS.simulations, institutionId);
}

export function saveSimulation(record: SimulationRecord) {
  upsertById(TWIN_STORE_KEYS.simulations, record, "simulation_id");
}

export function listScenarios(institutionId: string) {
  return listByInstitution<ScenarioRecord>(TWIN_STORE_KEYS.scenarios, institutionId);
}

export function saveScenario(record: ScenarioRecord) {
  upsertById(TWIN_STORE_KEYS.scenarios, record, "scenario_id");
}

export function listStressTests(institutionId: string) {
  return listByInstitution<StressTestRecord>(TWIN_STORE_KEYS.stress_tests, institutionId);
}

export function saveStressTest(record: StressTestRecord) {
  upsertById(TWIN_STORE_KEYS.stress_tests, record, "stress_id");
}

export function listResources(institutionId: string) {
  return listByInstitution<ResourceSimulationRecord>(TWIN_STORE_KEYS.resources, institutionId);
}

export function saveResource(record: ResourceSimulationRecord) {
  upsertById(TWIN_STORE_KEYS.resources, record, "resource_id");
}

export function listPolicies(institutionId: string) {
  return listByInstitution<PolicySandboxRecord>(TWIN_STORE_KEYS.policies, institutionId);
}

export function savePolicy(record: PolicySandboxRecord) {
  upsertById(TWIN_STORE_KEYS.policies, record, "policy_id");
}

export function listAISandboxes(institutionId: string) {
  return listByInstitution<AISandboxRecord>(TWIN_STORE_KEYS.ai_sandboxes, institutionId);
}

export function saveAISandbox(record: AISandboxRecord) {
  upsertById(TWIN_STORE_KEYS.ai_sandboxes, record, "sandbox_id");
}

export function listTraining(institutionId: string) {
  return listByInstitution<TrainingSimulationRecord>(TWIN_STORE_KEYS.training, institutionId);
}

export function saveTraining(record: TrainingSimulationRecord) {
  upsertById(TWIN_STORE_KEYS.training, record, "training_id");
}

export function listAccuracy(institutionId: string) {
  return listByInstitution<TwinAccuracyRecord>(TWIN_STORE_KEYS.accuracy, institutionId);
}

export function saveAccuracy(record: TwinAccuracyRecord) {
  upsertById(TWIN_STORE_KEYS.accuracy, record, "accuracy_id");
}

export function listExperiments(institutionId: string) {
  return listByInstitution<ExperimentRecord>(TWIN_STORE_KEYS.experiments, institutionId);
}

export function saveExperiment(record: ExperimentRecord) {
  upsertById(TWIN_STORE_KEYS.experiments, record, "experiment_id");
}

export function listTwinObservatory(institutionId: string) {
  return listByInstitution<TwinObservatoryRecord>(TWIN_STORE_KEYS.observatory, institutionId);
}

export function saveTwinObservatory(record: TwinObservatoryRecord) {
  upsertById(TWIN_STORE_KEYS.observatory, record, "observatory_id");
}
