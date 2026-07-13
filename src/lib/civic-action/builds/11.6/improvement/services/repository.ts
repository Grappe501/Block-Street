/**
 * CAE-11.6-W13 — Improvement persistence
 */
import { readStoreSlice, writeStoreSlice } from "../../../11.1/services/repository";
export { readStoreSlice, writeStoreSlice };
import type {
  BenchmarkRecord,
  BestPracticeRecord,
  CommunityImpactRecord,
  ExperimentRecord,
  ImprovementBacklogRecord,
  ImprovementBriefingRecord,
  ImprovementCycleRecord,
  InnovationRecord,
  KPIRecord,
  MaturityAssessmentRecord,
  MeasurementRecord,
  OutcomeRecord,
  QualityReviewRecord,
  RootCauseRecord,
} from "../data-model";
import { IMPROVEMENT_STORE_KEYS } from "../data-model";

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

export function listMeasurements(institutionId: string) {
  return listByInstitution<MeasurementRecord>(IMPROVEMENT_STORE_KEYS.measurements, institutionId);
}

export function getMeasurement(measurementId: string) {
  return readStoreSlice<MeasurementRecord>(IMPROVEMENT_STORE_KEYS.measurements).find(
    (m) => m.measurement_id === measurementId
  ) ?? null;
}

export function saveMeasurement(record: MeasurementRecord) {
  upsertById(IMPROVEMENT_STORE_KEYS.measurements, record, "measurement_id");
}

export function listKPIs(institutionId: string) {
  return listByInstitution<KPIRecord>(IMPROVEMENT_STORE_KEYS.kpis, institutionId);
}

export function getKPI(kpiId: string) {
  return readStoreSlice<KPIRecord>(IMPROVEMENT_STORE_KEYS.kpis).find((k) => k.kpi_id === kpiId) ?? null;
}

export function saveKPI(record: KPIRecord) {
  upsertById(IMPROVEMENT_STORE_KEYS.kpis, record, "kpi_id");
}

export function listOutcomes(institutionId: string) {
  return listByInstitution<OutcomeRecord>(IMPROVEMENT_STORE_KEYS.outcomes, institutionId);
}

export function saveOutcome(record: OutcomeRecord) {
  upsertById(IMPROVEMENT_STORE_KEYS.outcomes, record, "outcome_id");
}

export function listBenchmarks(institutionId: string) {
  return listByInstitution<BenchmarkRecord>(IMPROVEMENT_STORE_KEYS.benchmarks, institutionId);
}

export function saveBenchmark(record: BenchmarkRecord) {
  upsertById(IMPROVEMENT_STORE_KEYS.benchmarks, record, "benchmark_id");
}

export function listImprovementCycles(institutionId: string) {
  return listByInstitution<ImprovementCycleRecord>(IMPROVEMENT_STORE_KEYS.cycles, institutionId);
}

export function saveImprovementCycle(record: ImprovementCycleRecord) {
  upsertById(IMPROVEMENT_STORE_KEYS.cycles, record, "cycle_id");
}

export function listRootCauseAnalyses(institutionId: string) {
  return listByInstitution<RootCauseRecord>(IMPROVEMENT_STORE_KEYS.root_cause, institutionId);
}

export function saveRootCause(record: RootCauseRecord) {
  upsertById(IMPROVEMENT_STORE_KEYS.root_cause, record, "analysis_id");
}

export function listBestPractices(institutionId: string) {
  return listByInstitution<BestPracticeRecord>(IMPROVEMENT_STORE_KEYS.best_practices, institutionId);
}

export function saveBestPractice(record: BestPracticeRecord) {
  upsertById(IMPROVEMENT_STORE_KEYS.best_practices, record, "practice_id");
}

export function listExperiments(institutionId: string) {
  return listByInstitution<ExperimentRecord>(IMPROVEMENT_STORE_KEYS.experiments, institutionId);
}

export function saveExperiment(record: ExperimentRecord) {
  upsertById(IMPROVEMENT_STORE_KEYS.experiments, record, "experiment_id");
}

export function listInnovations(institutionId: string) {
  return listByInstitution<InnovationRecord>(IMPROVEMENT_STORE_KEYS.innovations, institutionId);
}

export function saveInnovation(record: InnovationRecord) {
  upsertById(IMPROVEMENT_STORE_KEYS.innovations, record, "innovation_id");
}

export function listMaturityAssessments(institutionId: string) {
  return listByInstitution<MaturityAssessmentRecord>(IMPROVEMENT_STORE_KEYS.maturity, institutionId);
}

export function saveMaturityAssessment(record: MaturityAssessmentRecord) {
  upsertById(IMPROVEMENT_STORE_KEYS.maturity, record, "assessment_id");
}

export function listCommunityImpact(institutionId: string) {
  return listByInstitution<CommunityImpactRecord>(IMPROVEMENT_STORE_KEYS.community_impact, institutionId);
}

export function saveCommunityImpact(record: CommunityImpactRecord) {
  upsertById(IMPROVEMENT_STORE_KEYS.community_impact, record, "impact_id");
}

export function listQualityReviews(institutionId: string) {
  return listByInstitution<QualityReviewRecord>(IMPROVEMENT_STORE_KEYS.quality, institutionId);
}

export function saveQualityReview(record: QualityReviewRecord) {
  upsertById(IMPROVEMENT_STORE_KEYS.quality, record, "review_id");
}

export function listImprovementBacklog(institutionId: string) {
  return listByInstitution<ImprovementBacklogRecord>(IMPROVEMENT_STORE_KEYS.backlog, institutionId);
}

export function saveImprovementBacklog(record: ImprovementBacklogRecord) {
  upsertById(IMPROVEMENT_STORE_KEYS.backlog, record, "backlog_id");
}

export function listImprovementBriefings(institutionId: string) {
  return listByInstitution<ImprovementBriefingRecord>(IMPROVEMENT_STORE_KEYS.briefings, institutionId);
}

export function saveImprovementBriefing(record: ImprovementBriefingRecord) {
  upsertById(IMPROVEMENT_STORE_KEYS.briefings, record, "briefing_id");
}
