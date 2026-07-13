/**
 * CAE-11.7-W7 — Learning persistence
 */
import { readStoreSlice, writeStoreSlice } from "../../../../11.1/services/repository";
export { readStoreSlice, writeStoreSlice };
import type {
  AssessmentRecord,
  CertificationRecord,
  CompetencyGraphNode,
  CompetencyRecord,
  CourseRecord,
  ExperienceLearningRecord,
  KnowledgeGapRecord,
  LearningAnalyticsRecord,
  LearningPlanRecord,
  MentorRecommendationRecord,
  SimulationRecord,
  UniversityRecord,
} from "../data-model";
import { LEARNING_STORE_KEYS } from "../data-model";

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

export function listCompetencies(institutionId: string) {
  return listByInstitution<CompetencyRecord>(LEARNING_STORE_KEYS.competencies, institutionId);
}

export function saveCompetency(record: CompetencyRecord) {
  upsertById(LEARNING_STORE_KEYS.competencies, record, "competency_id");
}

export function listCourses(institutionId: string) {
  return listByInstitution<CourseRecord>(LEARNING_STORE_KEYS.courses, institutionId);
}

export function listCoursesByHuman(humanId: string) {
  return listByHuman<CourseRecord>(LEARNING_STORE_KEYS.courses, humanId);
}

export function saveCourse(record: CourseRecord) {
  upsertById(LEARNING_STORE_KEYS.courses, record, "course_id");
}

export function listCurricula(institutionId: string) {
  return readStoreSlice<CourseRecord>(LEARNING_STORE_KEYS.curricula).filter(
    (c) => c.institution_id === institutionId
  );
}

export function saveCurriculum(record: CourseRecord) {
  upsertById(LEARNING_STORE_KEYS.curricula, record, "course_id");
}

export function listLearningPlans(humanId: string) {
  return listByHuman<LearningPlanRecord>(LEARNING_STORE_KEYS.plans, humanId);
}

export function saveLearningPlan(record: LearningPlanRecord) {
  upsertById(LEARNING_STORE_KEYS.plans, record, "plan_id");
}

export function listCertifications(humanId: string) {
  return listByHuman<CertificationRecord>(LEARNING_STORE_KEYS.certifications, humanId);
}

export function saveCertification(record: CertificationRecord) {
  upsertById(LEARNING_STORE_KEYS.certifications, record, "certification_id");
}

export function listSimulations(humanId: string) {
  return listByHuman<SimulationRecord>(LEARNING_STORE_KEYS.simulations, humanId);
}

export function saveSimulation(record: SimulationRecord) {
  upsertById(LEARNING_STORE_KEYS.simulations, record, "simulation_id");
}

export function listKnowledgeGaps(humanId: string) {
  return listByHuman<KnowledgeGapRecord>(LEARNING_STORE_KEYS.gaps, humanId);
}

export function saveKnowledgeGap(record: KnowledgeGapRecord) {
  upsertById(LEARNING_STORE_KEYS.gaps, record, "gap_id");
}

export function listMentorRecommendations(humanId: string) {
  return listByHuman<MentorRecommendationRecord>(LEARNING_STORE_KEYS.mentors, humanId);
}

export function saveMentorRecommendation(record: MentorRecommendationRecord) {
  upsertById(LEARNING_STORE_KEYS.mentors, record, "mentor_id");
}

export function listExperienceLearning(institutionId: string) {
  return listByInstitution<ExperienceLearningRecord>(LEARNING_STORE_KEYS.experience, institutionId);
}

export function saveExperienceLearning(record: ExperienceLearningRecord) {
  upsertById(LEARNING_STORE_KEYS.experience, record, "experience_id");
}

export function getUniversity(institutionId: string) {
  return readStoreSlice<UniversityRecord>(LEARNING_STORE_KEYS.university).find(
    (u) => u.institution_id === institutionId
  ) ?? null;
}

export function saveUniversity(record: UniversityRecord) {
  upsertById(LEARNING_STORE_KEYS.university, record, "university_id");
}

export function listCompetencyGraph(institutionId: string) {
  return listByInstitution<CompetencyGraphNode>(LEARNING_STORE_KEYS.competencyGraph, institutionId);
}

export function saveCompetencyGraphNode(record: CompetencyGraphNode) {
  upsertById(LEARNING_STORE_KEYS.competencyGraph, record, "node_id");
}

export function getLearningAnalytics(institutionId: string, humanId?: string) {
  return readStoreSlice<LearningAnalyticsRecord>(LEARNING_STORE_KEYS.analytics).find(
    (a) => a.institution_id === institutionId && (humanId ? a.human_id === humanId : !a.human_id)
  ) ?? null;
}

export function saveLearningAnalytics(record: LearningAnalyticsRecord) {
  upsertById(LEARNING_STORE_KEYS.analytics, record, "analytics_id");
}

export function saveAssessment(record: AssessmentRecord) {
  upsertById(LEARNING_STORE_KEYS.assessments, record, "assessment_id");
}
