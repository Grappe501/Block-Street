/**
 * CAE-11.7-W16 — Genesis persistence
 */
import { readStoreSlice, writeStoreSlice } from "../../../../11.1/services/repository";
export { readStoreSlice, writeStoreSlice };
import type {
  BootstrapRecord,
  CanonicalArchiveRecord,
  ContinuityPlanRecord,
  GenesisPackageRecord,
  InstitutionDNARecord,
  LegacyRecord,
  PortabilityRecord,
  PreservationObservatoryRecord,
  ProvenanceRecord,
  RecoveryRecord,
  StewardshipRecord,
  TimelineEventRecord,
  VaultEntryRecord,
} from "../data-model";
import { GENESIS_STORE_KEYS } from "../data-model";

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

export function listPackages(institutionId: string) {
  return listByInstitution<GenesisPackageRecord>(GENESIS_STORE_KEYS.packages, institutionId);
}
export function savePackage(record: GenesisPackageRecord) {
  upsertById(GENESIS_STORE_KEYS.packages, record, "package_id");
}

export function listDNA(institutionId: string) {
  return listByInstitution<InstitutionDNARecord>(GENESIS_STORE_KEYS.dna, institutionId);
}
export function saveDNA(record: InstitutionDNARecord) {
  upsertById(GENESIS_STORE_KEYS.dna, record, "dna_id");
}

export function listArchives(institutionId: string) {
  return listByInstitution<CanonicalArchiveRecord>(GENESIS_STORE_KEYS.archives, institutionId);
}
export function saveArchive(record: CanonicalArchiveRecord) {
  upsertById(GENESIS_STORE_KEYS.archives, record, "archive_id");
}

export function listContinuity(institutionId: string) {
  return listByInstitution<ContinuityPlanRecord>(GENESIS_STORE_KEYS.continuity, institutionId);
}
export function saveContinuity(record: ContinuityPlanRecord) {
  upsertById(GENESIS_STORE_KEYS.continuity, record, "continuity_id");
}

export function listRecoveries(institutionId: string) {
  return listByInstitution<RecoveryRecord>(GENESIS_STORE_KEYS.recoveries, institutionId);
}
export function saveRecovery(record: RecoveryRecord) {
  upsertById(GENESIS_STORE_KEYS.recoveries, record, "recovery_id");
}

export function listBootstraps(institutionId: string) {
  return listByInstitution<BootstrapRecord>(GENESIS_STORE_KEYS.bootstraps, institutionId);
}
export function saveBootstrap(record: BootstrapRecord) {
  upsertById(GENESIS_STORE_KEYS.bootstraps, record, "bootstrap_id");
}

export function listPortability(institutionId: string) {
  return listByInstitution<PortabilityRecord>(GENESIS_STORE_KEYS.portability, institutionId);
}
export function savePortability(record: PortabilityRecord) {
  upsertById(GENESIS_STORE_KEYS.portability, record, "portability_id");
}

export function listProvenance(institutionId: string) {
  return listByInstitution<ProvenanceRecord>(GENESIS_STORE_KEYS.provenance, institutionId);
}
export function saveProvenance(record: ProvenanceRecord) {
  upsertById(GENESIS_STORE_KEYS.provenance, record, "provenance_id");
}

export function listTimeline(institutionId: string) {
  return listByInstitution<TimelineEventRecord>(GENESIS_STORE_KEYS.timeline, institutionId);
}
export function saveTimeline(record: TimelineEventRecord) {
  upsertById(GENESIS_STORE_KEYS.timeline, record, "timeline_id");
}

export function listLegacy(institutionId: string) {
  return listByInstitution<LegacyRecord>(GENESIS_STORE_KEYS.legacy, institutionId);
}
export function saveLegacy(record: LegacyRecord) {
  upsertById(GENESIS_STORE_KEYS.legacy, record, "legacy_id");
}

export function listVault(institutionId: string) {
  return listByInstitution<VaultEntryRecord>(GENESIS_STORE_KEYS.vault, institutionId);
}
export function saveVault(record: VaultEntryRecord) {
  upsertById(GENESIS_STORE_KEYS.vault, record, "vault_id");
}

export function listObservatory(institutionId: string) {
  return listByInstitution<PreservationObservatoryRecord>(GENESIS_STORE_KEYS.observatory, institutionId);
}
export function saveObservatory(record: PreservationObservatoryRecord) {
  upsertById(GENESIS_STORE_KEYS.observatory, record, "observatory_id");
}

export function listStewardship(institutionId: string) {
  return listByInstitution<StewardshipRecord>(GENESIS_STORE_KEYS.stewardship, institutionId);
}
export function saveStewardship(record: StewardshipRecord) {
  upsertById(GENESIS_STORE_KEYS.stewardship, record, "stewardship_id");
}
