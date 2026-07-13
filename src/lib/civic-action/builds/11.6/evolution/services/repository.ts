/**
 * CAE-11.6-W16 — Evolution persistence
 */
import { readStoreSlice, writeStoreSlice } from "../../../11.1/services/repository";
export { readStoreSlice, writeStoreSlice };
import type {
  ArchitectureReviewRecord,
  BuildGenomeRecord,
  CanonRecord,
  DigitalTwinRecord,
  DocumentationSyncRecord,
  DriftDetectionRecord,
  EvolutionAnalyticsRecord,
  EvolutionProposalRecord,
  FactoryPackageRecord,
  FutureBuildRecord,
  InstitutionCloneRecord,
  ResearchRecord,
  TraceabilityLinkRecord,
} from "../data-model";
import { EVOLUTION_STORE_KEYS } from "../data-model";

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

export function listEvolutionProposals(institutionId: string) {
  return listByInstitution<EvolutionProposalRecord>(EVOLUTION_STORE_KEYS.proposals, institutionId);
}

export function getEvolutionProposal(evolutionId: string) {
  return readStoreSlice<EvolutionProposalRecord>(EVOLUTION_STORE_KEYS.proposals).find(
    (p) => p.evolution_id === evolutionId
  ) ?? null;
}

export function saveEvolutionProposal(record: EvolutionProposalRecord) {
  upsertById(EVOLUTION_STORE_KEYS.proposals, record, "evolution_id");
}

export function listCanon(institutionId: string) {
  return listByInstitution<CanonRecord>(EVOLUTION_STORE_KEYS.canon, institutionId);
}

export function getCanon(canonId: string) {
  return readStoreSlice<CanonRecord>(EVOLUTION_STORE_KEYS.canon).find((c) => c.canon_id === canonId) ?? null;
}

export function saveCanon(record: CanonRecord) {
  upsertById(EVOLUTION_STORE_KEYS.canon, record, "canon_id");
}

export function listArchitectureReviews(institutionId: string) {
  return listByInstitution<ArchitectureReviewRecord>(EVOLUTION_STORE_KEYS.reviews, institutionId);
}

export function saveArchitectureReview(record: ArchitectureReviewRecord) {
  upsertById(EVOLUTION_STORE_KEYS.reviews, record, "review_id");
}

export function listDriftDetections(institutionId: string) {
  return listByInstitution<DriftDetectionRecord>(EVOLUTION_STORE_KEYS.drift, institutionId);
}

export function saveDriftDetection(record: DriftDetectionRecord) {
  upsertById(EVOLUTION_STORE_KEYS.drift, record, "drift_id");
}

export function getBuildGenome(institutionId: string) {
  return listByInstitution<BuildGenomeRecord>(EVOLUTION_STORE_KEYS.genome, institutionId)[0] ?? null;
}

export function saveBuildGenome(record: BuildGenomeRecord) {
  upsertById(EVOLUTION_STORE_KEYS.genome, record, "genome_id");
}

export function listFactoryPackages(institutionId: string) {
  return listByInstitution<FactoryPackageRecord>(EVOLUTION_STORE_KEYS.factory, institutionId);
}

export function saveFactoryPackage(record: FactoryPackageRecord) {
  upsertById(EVOLUTION_STORE_KEYS.factory, record, "package_id");
}

export function listInstitutionClones(sourceInstitutionId: string) {
  return readStoreSlice<InstitutionCloneRecord>(EVOLUTION_STORE_KEYS.clones).filter(
    (c) => c.source_institution_id === sourceInstitutionId
  );
}

export function saveInstitutionClone(record: InstitutionCloneRecord) {
  upsertById(EVOLUTION_STORE_KEYS.clones, record, "clone_id");
}

export function listDocumentationSyncs(institutionId: string) {
  return listByInstitution<DocumentationSyncRecord>(EVOLUTION_STORE_KEYS.documentation, institutionId);
}

export function saveDocumentationSync(record: DocumentationSyncRecord) {
  upsertById(EVOLUTION_STORE_KEYS.documentation, record, "sync_id");
}

export function listDigitalTwins(institutionId: string) {
  return listByInstitution<DigitalTwinRecord>(EVOLUTION_STORE_KEYS.twins, institutionId);
}

export function saveDigitalTwin(record: DigitalTwinRecord) {
  upsertById(EVOLUTION_STORE_KEYS.twins, record, "twin_id");
}

export function listResearch(institutionId: string) {
  return listByInstitution<ResearchRecord>(EVOLUTION_STORE_KEYS.research, institutionId);
}

export function saveResearch(record: ResearchRecord) {
  upsertById(EVOLUTION_STORE_KEYS.research, record, "research_id");
}

export function listFutureBuilds(institutionId: string) {
  return listByInstitution<FutureBuildRecord>(EVOLUTION_STORE_KEYS.futureBuilds, institutionId);
}

export function saveFutureBuild(record: FutureBuildRecord) {
  upsertById(EVOLUTION_STORE_KEYS.futureBuilds, record, "build_id");
}

export function listTraceabilityLinks(institutionId: string) {
  return listByInstitution<TraceabilityLinkRecord>(EVOLUTION_STORE_KEYS.traceability, institutionId);
}

export function saveTraceabilityLink(record: TraceabilityLinkRecord) {
  upsertById(EVOLUTION_STORE_KEYS.traceability, record, "link_id");
}

export function getEvolutionAnalytics(institutionId: string) {
  return listByInstitution<EvolutionAnalyticsRecord>(EVOLUTION_STORE_KEYS.analytics, institutionId)[0] ?? null;
}

export function saveEvolutionAnalytics(record: EvolutionAnalyticsRecord) {
  upsertById(EVOLUTION_STORE_KEYS.analytics, record, "analytics_id");
}
