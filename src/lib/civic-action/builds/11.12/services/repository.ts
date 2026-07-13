/**
 * CAE-11.12-W3 — Knowledge persistence (reuses civic-action store)
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

export { readStoreSlice, writeStoreSlice } from "../../11.1/services/repository";
import { readStoreSlice, writeStoreSlice } from "../../11.1/services/repository";
import type {
  AIKnowledgeSuggestionRecord,
  AssessmentAttemptRecord,
  AssessmentRecord,
  AssessmentResultRecord,
  CertificationAwardRecord,
  CertificationRecord,
  CitationRecord,
  CompetencyRecord,
  CourseRecord,
  HumanCompetencyRecord,
  KnowledgeApprovalRecord,
  KnowledgeArtifactRecord,
  KnowledgeClaimRecord,
  KnowledgeCollectionRecord,
  KnowledgeConflictRecord,
  KnowledgeCorrectionRecord,
  KnowledgeDomainRecord,
  KnowledgeHistoryEvent,
  KnowledgeReviewRecord,
  KnowledgeTranslationRecord,
  KnowledgeVersionRecord,
  LearningCompletionRecord,
  LearningEnrollmentRecord,
  SourceRecord,
} from "../data-model";
import { KNOWLEDGE_STORE_KEYS } from "../data-model";

export const KNOWLEDGE_OUTBOX_KEY = "knowledge_event_outbox";
export const KNOWLEDGE_DOMAIN_EVENTS_KEY = "knowledge_domain_events";
export const KNOWLEDGE_IDEMPOTENCY_KEY = "knowledge_idempotency";
export const KNOWLEDGE_AUDIT_KEY = "knowledge_audit_entries";

const DATA_DIR = join(process.cwd(), "data", "civic-action");
const STORE_PATH = join(DATA_DIR, "store.json");

function readRootStore(): Record<string, unknown> {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(STORE_PATH)) writeFileSync(STORE_PATH, JSON.stringify({}, null, 2));
  return JSON.parse(readFileSync(STORE_PATH, "utf8"));
}

function writeRootStore(store: Record<string, unknown>) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

export function getKnowledgeIdempotencyResult(key: string): unknown | null {
  const map = (readRootStore()[KNOWLEDGE_IDEMPOTENCY_KEY] as Record<string, unknown>) ?? {};
  const entry = map[key] as { result: unknown; payload_hash: string } | undefined;
  return entry?.result ?? null;
}

export function setKnowledgeIdempotencyResult(key: string, result: unknown, payloadHash: string): boolean {
  const store = readRootStore();
  const map = (store[KNOWLEDGE_IDEMPOTENCY_KEY] as Record<string, { result: unknown; payload_hash: string }>) ?? {};
  if (map[key] && map[key].payload_hash !== payloadHash) return false;
  map[key] = { result, payload_hash: payloadHash };
  store[KNOWLEDGE_IDEMPOTENCY_KEY] = map;
  writeRootStore(store);
  return true;
}

function upsertById<T extends { canonical_id: string }>(key: string, record: T) {
  const items = readStoreSlice<T>(key);
  const idx = items.findIndex((i) => i.canonical_id === record.canonical_id);
  if (idx >= 0) items[idx] = record;
  else items.push(record);
  writeStoreSlice(key, items);
}

export function saveKnowledgeDomain(record: KnowledgeDomainRecord) {
  upsertById(KNOWLEDGE_STORE_KEYS.knowledge_domains, record);
}

export function saveKnowledgeCollection(record: KnowledgeCollectionRecord) {
  upsertById(KNOWLEDGE_STORE_KEYS.knowledge_collections, record);
}

export function saveArtifact(record: KnowledgeArtifactRecord) {
  upsertById(KNOWLEDGE_STORE_KEYS.knowledge_artifacts, record);
}

export function saveClaim(record: KnowledgeClaimRecord) {
  upsertById(KNOWLEDGE_STORE_KEYS.knowledge_claims, record);
}

export function saveSource(record: SourceRecord) {
  upsertById(KNOWLEDGE_STORE_KEYS.sources, record);
}

export function saveCitation(record: CitationRecord) {
  upsertById(KNOWLEDGE_STORE_KEYS.citations, record);
}

export function saveReview(record: KnowledgeReviewRecord) {
  upsertById(KNOWLEDGE_STORE_KEYS.knowledge_reviews, record);
}

export function saveApproval(record: KnowledgeApprovalRecord) {
  upsertById(KNOWLEDGE_STORE_KEYS.knowledge_approvals, record);
}

export function saveCourse(record: CourseRecord) {
  upsertById(KNOWLEDGE_STORE_KEYS.courses, record);
}

export function saveEnrollment(record: LearningEnrollmentRecord) {
  upsertById(KNOWLEDGE_STORE_KEYS.learning_enrollments, record);
}

export function saveCompletion(record: LearningCompletionRecord) {
  upsertById(KNOWLEDGE_STORE_KEYS.learning_completions, record);
}

export function saveCompetency(record: CompetencyRecord) {
  upsertById(KNOWLEDGE_STORE_KEYS.competencies, record);
}

export function saveHumanCompetency(record: HumanCompetencyRecord) {
  upsertById(KNOWLEDGE_STORE_KEYS.human_competency_records, record);
}

export function saveAssessment(record: AssessmentRecord) {
  upsertById(KNOWLEDGE_STORE_KEYS.assessments, record);
}

export function saveAssessmentAttempt(record: AssessmentAttemptRecord) {
  upsertById(KNOWLEDGE_STORE_KEYS.assessment_attempts, record);
}

export function saveAssessmentResult(record: AssessmentResultRecord) {
  upsertById(KNOWLEDGE_STORE_KEYS.assessment_results, record);
}

export function saveCertification(record: CertificationRecord) {
  upsertById(KNOWLEDGE_STORE_KEYS.certifications, record);
}

export function saveCertificationAward(record: CertificationAwardRecord) {
  upsertById(KNOWLEDGE_STORE_KEYS.certification_awards, record);
}

export function saveAISuggestion(record: AIKnowledgeSuggestionRecord) {
  upsertById(KNOWLEDGE_STORE_KEYS.ai_knowledge_suggestions, record);
}

export function saveTranslation(record: KnowledgeTranslationRecord) {
  upsertById(KNOWLEDGE_STORE_KEYS.knowledge_translations, record);
}

export function saveCorrection(record: KnowledgeCorrectionRecord) {
  upsertById(KNOWLEDGE_STORE_KEYS.knowledge_corrections, record);
}

export function saveConflict(record: KnowledgeConflictRecord) {
  upsertById(KNOWLEDGE_STORE_KEYS.knowledge_conflicts, record);
}

export function loadArtifact(id: string): KnowledgeArtifactRecord | null {
  return readStoreSlice<KnowledgeArtifactRecord>(KNOWLEDGE_STORE_KEYS.knowledge_artifacts).find((a) => a.canonical_id === id) ?? null;
}

export function loadClaim(id: string): KnowledgeClaimRecord | null {
  return readStoreSlice<KnowledgeClaimRecord>(KNOWLEDGE_STORE_KEYS.knowledge_claims).find((c) => c.canonical_id === id) ?? null;
}

export function loadCourse(id: string): CourseRecord | null {
  return readStoreSlice<CourseRecord>(KNOWLEDGE_STORE_KEYS.courses).find((c) => c.canonical_id === id) ?? null;
}

export function loadEnrollment(id: string): LearningEnrollmentRecord | null {
  return readStoreSlice<LearningEnrollmentRecord>(KNOWLEDGE_STORE_KEYS.learning_enrollments).find((e) => e.canonical_id === id) ?? null;
}

export function loadCompetency(id: string): CompetencyRecord | null {
  return readStoreSlice<CompetencyRecord>(KNOWLEDGE_STORE_KEYS.competencies).find((c) => c.canonical_id === id) ?? null;
}

export function loadAssessment(id: string): AssessmentRecord | null {
  return readStoreSlice<AssessmentRecord>(KNOWLEDGE_STORE_KEYS.assessments).find((a) => a.canonical_id === id) ?? null;
}

export function loadAssessmentAttempt(id: string): AssessmentAttemptRecord | null {
  return readStoreSlice<AssessmentAttemptRecord>(KNOWLEDGE_STORE_KEYS.assessment_attempts).find((a) => a.canonical_id === id) ?? null;
}

export function loadCertification(id: string): CertificationRecord | null {
  return readStoreSlice<CertificationRecord>(KNOWLEDGE_STORE_KEYS.certifications).find((c) => c.canonical_id === id) ?? null;
}

export function loadAISuggestion(id: string): AIKnowledgeSuggestionRecord | null {
  return readStoreSlice<AIKnowledgeSuggestionRecord>(KNOWLEDGE_STORE_KEYS.ai_knowledge_suggestions).find((s) => s.canonical_id === id) ?? null;
}

export function loadTranslation(id: string): KnowledgeTranslationRecord | null {
  return readStoreSlice<KnowledgeTranslationRecord>(KNOWLEDGE_STORE_KEYS.knowledge_translations).find((t) => t.canonical_id === id) ?? null;
}

export function hasApprovalForArtifact(artifactId: string): boolean {
  return readStoreSlice<KnowledgeApprovalRecord>(KNOWLEDGE_STORE_KEYS.knowledge_approvals).some(
    (a) => a.artifact_id === artifactId && a.approved_at != null
  );
}

export function appendKnowledgeHistory(event: KnowledgeHistoryEvent) {
  const items = readStoreSlice<KnowledgeHistoryEvent>(KNOWLEDGE_STORE_KEYS.history_events);
  items.push(event);
  writeStoreSlice(KNOWLEDGE_STORE_KEYS.history_events, items);
}

export function appendKnowledgeVersion(version: KnowledgeVersionRecord) {
  const items = readStoreSlice<KnowledgeVersionRecord>(KNOWLEDGE_STORE_KEYS.knowledge_versions);
  items.push(version);
  writeStoreSlice(KNOWLEDGE_STORE_KEYS.knowledge_versions, items);
}

export function markTranslationsStaleForArtifact(artifactId: string, sourceVersion: number) {
  const items = readStoreSlice<KnowledgeTranslationRecord & { source_version?: number; is_stale?: boolean }>(
    KNOWLEDGE_STORE_KEYS.knowledge_translations
  );
  let changed = false;
  for (const t of items) {
    if (t.source_artifact_id === artifactId && (t.source_version ?? 0) < sourceVersion) {
      t.is_stale = true;
      changed = true;
    }
  }
  if (changed) writeStoreSlice(KNOWLEDGE_STORE_KEYS.knowledge_translations, items);
}
