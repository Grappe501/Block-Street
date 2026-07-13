/**
 * CAE-11.7-W10 — Partnership persistence
 */
import { readStoreSlice, writeStoreSlice } from "../../../../11.1/services/repository";
export { readStoreSlice, writeStoreSlice };
import type {
  CollaborationRecord,
  DecisionOutcomeRecord,
  GovernanceEvolutionRecord,
  HumanFeedbackRecord,
  InstitutionalLearningRecord,
  MemoryEvolutionRecord,
  OrganizationalHealthRecord,
  RecommendationQualityRecord,
  RecommendationRecord,
  SelfEvaluationRecord,
  TransparencyAuditRecord,
  TrustCalibrationRecord,
  WisdomRecord,
} from "../data-model";
import { PARTNERSHIP_STORE_KEYS } from "../data-model";

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

export function listRecommendations(humanId: string) {
  return listByHuman<RecommendationRecord>(PARTNERSHIP_STORE_KEYS.recommendations, humanId);
}

export function saveRecommendation(record: RecommendationRecord) {
  upsertById(PARTNERSHIP_STORE_KEYS.recommendations, record, "recommendation_id");
}

export function listTrustCalibrations(institutionId: string) {
  return listByInstitution<TrustCalibrationRecord>(PARTNERSHIP_STORE_KEYS.trust, institutionId);
}

export function saveTrustCalibration(record: TrustCalibrationRecord) {
  upsertById(PARTNERSHIP_STORE_KEYS.trust, record, "trust_id");
}

export function listWisdom(institutionId: string) {
  return listByInstitution<WisdomRecord>(PARTNERSHIP_STORE_KEYS.wisdom, institutionId);
}

export function saveWisdom(record: WisdomRecord) {
  upsertById(PARTNERSHIP_STORE_KEYS.wisdom, record, "wisdom_id");
}

export function listSelfEvaluations(institutionId: string) {
  return listByInstitution<SelfEvaluationRecord>(PARTNERSHIP_STORE_KEYS.selfEvaluations, institutionId);
}

export function saveSelfEvaluation(record: SelfEvaluationRecord) {
  upsertById(PARTNERSHIP_STORE_KEYS.selfEvaluations, record, "evaluation_id");
}

export function listFeedback(humanId: string) {
  return listByHuman<HumanFeedbackRecord>(PARTNERSHIP_STORE_KEYS.feedback, humanId);
}

export function saveFeedback(record: HumanFeedbackRecord) {
  upsertById(PARTNERSHIP_STORE_KEYS.feedback, record, "feedback_id");
}

export function listQuality(institutionId: string) {
  return listByInstitution<RecommendationQualityRecord>(PARTNERSHIP_STORE_KEYS.quality, institutionId);
}

export function saveQuality(record: RecommendationQualityRecord) {
  upsertById(PARTNERSHIP_STORE_KEYS.quality, record, "quality_id");
}

export function listInstitutionalLearning(institutionId: string) {
  return listByInstitution<InstitutionalLearningRecord>(PARTNERSHIP_STORE_KEYS.learning, institutionId);
}

export function saveInstitutionalLearning(record: InstitutionalLearningRecord) {
  upsertById(PARTNERSHIP_STORE_KEYS.learning, record, "learning_id");
}

export function listOrganizationalHealth(institutionId: string) {
  return listByInstitution<OrganizationalHealthRecord>(PARTNERSHIP_STORE_KEYS.health, institutionId);
}

export function saveOrganizationalHealth(record: OrganizationalHealthRecord) {
  upsertById(PARTNERSHIP_STORE_KEYS.health, record, "health_id");
}

export function listOutcomes(institutionId: string) {
  return listByInstitution<DecisionOutcomeRecord>(PARTNERSHIP_STORE_KEYS.outcomes, institutionId);
}

export function saveOutcome(record: DecisionOutcomeRecord) {
  upsertById(PARTNERSHIP_STORE_KEYS.outcomes, record, "outcome_id");
}

export function listMemoryEvolution(institutionId: string) {
  return listByInstitution<MemoryEvolutionRecord>(PARTNERSHIP_STORE_KEYS.memoryEvolution, institutionId);
}

export function saveMemoryEvolution(record: MemoryEvolutionRecord) {
  upsertById(PARTNERSHIP_STORE_KEYS.memoryEvolution, record, "evolution_id");
}

export function listCollaboration(institutionId: string) {
  return listByInstitution<CollaborationRecord>(PARTNERSHIP_STORE_KEYS.collaboration, institutionId);
}

export function saveCollaboration(record: CollaborationRecord) {
  upsertById(PARTNERSHIP_STORE_KEYS.collaboration, record, "collaboration_id");
}

export function listGovernanceEvolution(institutionId: string) {
  return listByInstitution<GovernanceEvolutionRecord>(PARTNERSHIP_STORE_KEYS.governance, institutionId);
}

export function saveGovernanceEvolution(record: GovernanceEvolutionRecord) {
  upsertById(PARTNERSHIP_STORE_KEYS.governance, record, "governance_id");
}

export function listTransparencyAudits(institutionId: string) {
  return listByInstitution<TransparencyAuditRecord>(PARTNERSHIP_STORE_KEYS.transparency, institutionId);
}

export function saveTransparencyAudit(record: TransparencyAuditRecord) {
  upsertById(PARTNERSHIP_STORE_KEYS.transparency, record, "audit_id");
}
