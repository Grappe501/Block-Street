/**
 * CAE-11.6-W10 — Intelligence persistence
 */
export { readStoreSlice, writeStoreSlice } from "../../../11.1/services/repository";
import { readStoreSlice, writeStoreSlice } from "../../../11.1/services/repository";
import type {
  ForecastRecord,
  InstitutionalHealthIndexRecord,
  InstitutionalInsightRecord,
  IntelligenceScenarioRecord,
  LearningFeedbackRecord,
  OpportunityRecord,
  PatternRecord,
  RecommendationRecord,
  RiskPredictionRecord,
  SimulationRecord,
} from "../data-model";
import { INTELLIGENCE_STORE_KEYS } from "../data-model";

function upsertById<T>(key: string, record: T, idField: keyof T & string) {
  const items = readStoreSlice<T>(key);
  const id = String(record[idField]);
  const idx = items.findIndex((i) => String(i[idField]) === id);
  if (idx >= 0) items[idx] = record;
  else items.push(record);
  writeStoreSlice(key, items);
}

export function listInsights(institutionId: string, status?: InstitutionalInsightRecord["status"]) {
  return readStoreSlice<InstitutionalInsightRecord>(INTELLIGENCE_STORE_KEYS.insights).filter(
    (i) => i.institution_id === institutionId && (!status || i.status === status)
  );
}

export function saveInsight(record: InstitutionalInsightRecord) {
  upsertById(INTELLIGENCE_STORE_KEYS.insights, record, "insight_id");
}

export function listForecasts(institutionId: string) {
  return readStoreSlice<ForecastRecord>(INTELLIGENCE_STORE_KEYS.forecasts).filter((f) => f.institution_id === institutionId);
}

export function saveForecast(record: ForecastRecord) {
  upsertById(INTELLIGENCE_STORE_KEYS.forecasts, record, "forecast_id");
}

export function listPatterns(institutionId: string) {
  return readStoreSlice<PatternRecord>(INTELLIGENCE_STORE_KEYS.patterns).filter((p) => p.institution_id === institutionId);
}

export function savePattern(record: PatternRecord) {
  upsertById(INTELLIGENCE_STORE_KEYS.patterns, record, "pattern_id");
}

export function listRiskPredictions(institutionId: string) {
  return readStoreSlice<RiskPredictionRecord>(INTELLIGENCE_STORE_KEYS.risks).filter((r) => r.institution_id === institutionId);
}

export function saveRiskPrediction(record: RiskPredictionRecord) {
  upsertById(INTELLIGENCE_STORE_KEYS.risks, record, "risk_id");
}

export function listOpportunities(institutionId: string) {
  return readStoreSlice<OpportunityRecord>(INTELLIGENCE_STORE_KEYS.opportunities).filter((o) => o.institution_id === institutionId);
}

export function saveOpportunity(record: OpportunityRecord) {
  upsertById(INTELLIGENCE_STORE_KEYS.opportunities, record, "opportunity_id");
}

export function listIntelligenceScenarios(institutionId: string) {
  return readStoreSlice<IntelligenceScenarioRecord>(INTELLIGENCE_STORE_KEYS.scenarios).filter((s) => s.institution_id === institutionId);
}

export function saveIntelligenceScenario(record: IntelligenceScenarioRecord) {
  upsertById(INTELLIGENCE_STORE_KEYS.scenarios, record, "scenario_id");
}

export function listSimulations(institutionId: string) {
  return readStoreSlice<SimulationRecord>(INTELLIGENCE_STORE_KEYS.simulations).filter((s) => s.institution_id === institutionId);
}

export function saveSimulation(record: SimulationRecord) {
  upsertById(INTELLIGENCE_STORE_KEYS.simulations, record, "simulation_id");
}

export function listRecommendations(institutionId: string) {
  return readStoreSlice<RecommendationRecord>(INTELLIGENCE_STORE_KEYS.recommendations).filter((r) => r.institution_id === institutionId);
}

export function saveRecommendation(record: RecommendationRecord) {
  upsertById(INTELLIGENCE_STORE_KEYS.recommendations, record, "recommendation_id");
}

export function listLearningFeedback(institutionId: string) {
  return readStoreSlice<LearningFeedbackRecord>(INTELLIGENCE_STORE_KEYS.learning).filter((l) => l.institution_id === institutionId);
}

export function saveLearningFeedback(record: LearningFeedbackRecord) {
  upsertById(INTELLIGENCE_STORE_KEYS.learning, record, "feedback_id");
}

export function getHealthIndex(institutionId: string) {
  return readStoreSlice<InstitutionalHealthIndexRecord>(INTELLIGENCE_STORE_KEYS.health_index).find((h) => h.institution_id === institutionId) ?? null;
}

export function saveHealthIndex(record: InstitutionalHealthIndexRecord) {
  upsertById(INTELLIGENCE_STORE_KEYS.health_index, record, "health_index_id");
}
