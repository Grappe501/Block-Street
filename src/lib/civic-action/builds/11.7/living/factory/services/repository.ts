/**
 * CAE-11.7-W13 — Factory persistence
 */
import { readStoreSlice, writeStoreSlice } from "../../../../11.1/services/repository";
export { readStoreSlice, writeStoreSlice };
import type {
  ArchitectureReviewRecord,
  BuildRecord,
  CapabilityRecord,
  CertificationRecord,
  DeploymentRecord,
  DesignRecord,
  EngineeringGovernanceRecord,
  EvolutionRecord,
  ExtensionRecord,
  ImprovementRecord,
  ObservatoryRecord,
  RollbackRecord,
} from "../data-model";
import { FACTORY_STORE_KEYS } from "../data-model";

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

export function listCapabilities(institutionId: string) {
  return listByInstitution<CapabilityRecord>(FACTORY_STORE_KEYS.capabilities, institutionId);
}

export function saveCapability(record: CapabilityRecord) {
  upsertById(FACTORY_STORE_KEYS.capabilities, record, "capability_id");
}

export function listDesigns(institutionId: string) {
  return listByInstitution<DesignRecord>(FACTORY_STORE_KEYS.designs, institutionId);
}

export function saveDesign(record: DesignRecord) {
  upsertById(FACTORY_STORE_KEYS.designs, record, "design_id");
}

export function listReviews(institutionId: string) {
  return listByInstitution<ArchitectureReviewRecord>(FACTORY_STORE_KEYS.reviews, institutionId);
}

export function saveReview(record: ArchitectureReviewRecord) {
  upsertById(FACTORY_STORE_KEYS.reviews, record, "review_id");
}

export function listBuilds(institutionId: string) {
  return listByInstitution<BuildRecord>(FACTORY_STORE_KEYS.builds, institutionId);
}

export function saveBuild(record: BuildRecord) {
  upsertById(FACTORY_STORE_KEYS.builds, record, "build_id");
}

export function listCertifications(institutionId: string) {
  return listByInstitution<CertificationRecord>(FACTORY_STORE_KEYS.certifications, institutionId);
}

export function saveCertification(record: CertificationRecord) {
  upsertById(FACTORY_STORE_KEYS.certifications, record, "certification_id");
}

export function listDeployments(institutionId: string) {
  return listByInstitution<DeploymentRecord>(FACTORY_STORE_KEYS.deployments, institutionId);
}

export function saveDeployment(record: DeploymentRecord) {
  upsertById(FACTORY_STORE_KEYS.deployments, record, "deployment_id");
}

export function listRollbacks(institutionId: string) {
  return listByInstitution<RollbackRecord>(FACTORY_STORE_KEYS.rollbacks, institutionId);
}

export function saveRollback(record: RollbackRecord) {
  upsertById(FACTORY_STORE_KEYS.rollbacks, record, "rollback_id");
}

export function listExtensions(institutionId: string) {
  return listByInstitution<ExtensionRecord>(FACTORY_STORE_KEYS.extensions, institutionId);
}

export function saveExtension(record: ExtensionRecord) {
  upsertById(FACTORY_STORE_KEYS.extensions, record, "extension_id");
}

export function listEvolution(institutionId: string) {
  return listByInstitution<EvolutionRecord>(FACTORY_STORE_KEYS.evolution, institutionId);
}

export function saveEvolution(record: EvolutionRecord) {
  upsertById(FACTORY_STORE_KEYS.evolution, record, "evolution_id");
}

export function listObservatory(institutionId: string) {
  return listByInstitution<ObservatoryRecord>(FACTORY_STORE_KEYS.observatory, institutionId);
}

export function saveObservatory(record: ObservatoryRecord) {
  upsertById(FACTORY_STORE_KEYS.observatory, record, "observatory_id");
}

export function listImprovements(institutionId: string) {
  return listByInstitution<ImprovementRecord>(FACTORY_STORE_KEYS.improvements, institutionId);
}

export function saveImprovement(record: ImprovementRecord) {
  upsertById(FACTORY_STORE_KEYS.improvements, record, "improvement_id");
}

export function listEngineeringGovernance(institutionId: string) {
  return listByInstitution<EngineeringGovernanceRecord>(FACTORY_STORE_KEYS.governance, institutionId);
}

export function saveEngineeringGovernance(record: EngineeringGovernanceRecord) {
  upsertById(FACTORY_STORE_KEYS.governance, record, "governance_id");
}
