/**
 * CAE-11.7-W8 — Prediction persistence
 */
import { readStoreSlice, writeStoreSlice } from "../../../../11.1/services/repository";
export { readStoreSlice, writeStoreSlice };
import type {
  AssumptionRecord,
  ForecastRecord,
  ImpactAnalysisRecord,
  MissionOutcomeRecord,
  OpportunityForecastRecord,
  PlanningRecord,
  ResourceModelRecord,
  RiskForecastRecord,
  ScenarioRecord,
  SimulationRecord,
  TrendRecord,
} from "../data-model";
import { PREDICTION_STORE_KEYS } from "../data-model";

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

export function listForecasts(humanId: string) {
  return listByHuman<ForecastRecord>(PREDICTION_STORE_KEYS.forecasts, humanId);
}

export function saveForecast(record: ForecastRecord) {
  upsertById(PREDICTION_STORE_KEYS.forecasts, record, "forecast_id");
}

export function listScenarios(humanId: string) {
  return listByHuman<ScenarioRecord>(PREDICTION_STORE_KEYS.scenarios, humanId);
}

export function saveScenario(record: ScenarioRecord) {
  upsertById(PREDICTION_STORE_KEYS.scenarios, record, "scenario_id");
}

export function listTrends(institutionId: string) {
  return listByInstitution<TrendRecord>(PREDICTION_STORE_KEYS.trends, institutionId);
}

export function saveTrend(record: TrendRecord) {
  upsertById(PREDICTION_STORE_KEYS.trends, record, "trend_id");
}

export function listRiskForecasts(institutionId: string) {
  return listByInstitution<RiskForecastRecord>(PREDICTION_STORE_KEYS.risks, institutionId);
}

export function saveRiskForecast(record: RiskForecastRecord) {
  upsertById(PREDICTION_STORE_KEYS.risks, record, "risk_id");
}

export function listOpportunityForecasts(institutionId: string) {
  return listByInstitution<OpportunityForecastRecord>(PREDICTION_STORE_KEYS.opportunities, institutionId);
}

export function saveOpportunityForecast(record: OpportunityForecastRecord) {
  upsertById(PREDICTION_STORE_KEYS.opportunities, record, "opportunity_id");
}

export function listResourceModels(institutionId: string) {
  return listByInstitution<ResourceModelRecord>(PREDICTION_STORE_KEYS.resources, institutionId);
}

export function saveResourceModel(record: ResourceModelRecord) {
  upsertById(PREDICTION_STORE_KEYS.resources, record, "model_id");
}

export function listMissionOutcomes(institutionId: string) {
  return listByInstitution<MissionOutcomeRecord>(PREDICTION_STORE_KEYS.missionOutcomes, institutionId);
}

export function saveMissionOutcome(record: MissionOutcomeRecord) {
  upsertById(PREDICTION_STORE_KEYS.missionOutcomes, record, "outcome_id");
}

export function listImpactAnalyses(institutionId: string) {
  return listByInstitution<ImpactAnalysisRecord>(PREDICTION_STORE_KEYS.impacts, institutionId);
}

export function saveImpactAnalysis(record: ImpactAnalysisRecord) {
  upsertById(PREDICTION_STORE_KEYS.impacts, record, "impact_id");
}

export function listPlanning(institutionId: string) {
  return listByInstitution<PlanningRecord>(PREDICTION_STORE_KEYS.planning, institutionId);
}

export function savePlanning(record: PlanningRecord) {
  upsertById(PREDICTION_STORE_KEYS.planning, record, "plan_id");
}

export function listAssumptions(institutionId: string) {
  return listByInstitution<AssumptionRecord>(PREDICTION_STORE_KEYS.assumptions, institutionId);
}

export function saveAssumption(record: AssumptionRecord) {
  upsertById(PREDICTION_STORE_KEYS.assumptions, record, "assumption_id");
}

export function listSimulations(humanId: string) {
  return listByHuman<SimulationRecord>(PREDICTION_STORE_KEYS.simulations, humanId);
}

export function saveSimulation(record: SimulationRecord) {
  upsertById(PREDICTION_STORE_KEYS.simulations, record, "simulation_id");
}
