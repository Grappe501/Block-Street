/**
 * CAE-11.12-W5 — Knowledge application service (read helpers + command dispatch)
 */
import { readStoreSlice } from "./services/repository";
import { KNOWLEDGE_STORE_KEYS } from "./data-model";
import type {
  AssessmentRecord,
  CertificationAwardRecord,
  CertificationRecord,
  CourseRecord,
  HumanCompetencyRecord,
  KnowledgeArtifactRecord,
  LearningEnrollmentRecord,
} from "./data-model";
import { knowledgeDomainService } from "./services/knowledge-engine";
import type { KnowledgeCommandEnvelope, KnowledgeCommandResult } from "./services/commands";

export const knowledgeApplicationService = {
  executeCommand(envelope: KnowledgeCommandEnvelope, permissions: string[]): KnowledgeCommandResult {
    return knowledgeDomainService.execute(envelope, permissions);
  },

  listArtifacts(institutionId?: string): KnowledgeArtifactRecord[] {
    const items = readStoreSlice<KnowledgeArtifactRecord>(KNOWLEDGE_STORE_KEYS.knowledge_artifacts);
    return institutionId ? items.filter((a) => a.institution_id === institutionId) : items;
  },

  getArtifact(id: string): KnowledgeArtifactRecord | null {
    return readStoreSlice<KnowledgeArtifactRecord>(KNOWLEDGE_STORE_KEYS.knowledge_artifacts).find(
      (a) => a.canonical_id === id
    ) ?? null;
  },

  listCourses(institutionId?: string): CourseRecord[] {
    const items = readStoreSlice<CourseRecord>(KNOWLEDGE_STORE_KEYS.courses);
    return institutionId ? items.filter((c) => c.institution_id === institutionId) : items;
  },

  getCourse(id: string): CourseRecord | null {
    return readStoreSlice<CourseRecord>(KNOWLEDGE_STORE_KEYS.courses).find((c) => c.canonical_id === id) ?? null;
  },

  listEnrollments(institutionId?: string, humanId?: string): LearningEnrollmentRecord[] {
    let items = readStoreSlice<LearningEnrollmentRecord>(KNOWLEDGE_STORE_KEYS.learning_enrollments);
    if (institutionId) items = items.filter((e) => e.institution_id === institutionId);
    if (humanId) items = items.filter((e) => e.human_id === humanId);
    return items;
  },

  listCompetencyRecords(institutionId?: string, humanId?: string): HumanCompetencyRecord[] {
    let items = readStoreSlice<HumanCompetencyRecord>(KNOWLEDGE_STORE_KEYS.human_competency_records);
    if (institutionId) items = items.filter((r) => r.institution_id === institutionId);
    if (humanId) items = items.filter((r) => r.human_id === humanId);
    return items;
  },

  listAssessments(institutionId?: string): AssessmentRecord[] {
    const items = readStoreSlice<AssessmentRecord>(KNOWLEDGE_STORE_KEYS.assessments);
    return institutionId ? items.filter((a) => a.institution_id === institutionId) : items;
  },

  listCertifications(institutionId?: string): CertificationRecord[] {
    const items = readStoreSlice<CertificationRecord>(KNOWLEDGE_STORE_KEYS.certifications);
    return institutionId ? items.filter((c) => c.institution_id === institutionId) : items;
  },

  listCertificationAwards(institutionId?: string, humanId?: string): CertificationAwardRecord[] {
    let items = readStoreSlice<CertificationAwardRecord>(KNOWLEDGE_STORE_KEYS.certification_awards);
    if (institutionId) items = items.filter((a) => a.institution_id === institutionId);
    if (humanId) items = items.filter((a) => a.human_id === humanId);
    return items;
  },

  findAwardByVerificationCode(code: string): CertificationAwardRecord | null {
    return (
      readStoreSlice<CertificationAwardRecord>(KNOWLEDGE_STORE_KEYS.certification_awards).find(
        (a) => a.public_id === code || a.canonical_id === code
      ) ?? null
    );
  },
};
