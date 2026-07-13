/**
 * CAE-11.7-W11 — Federation persistence
 */
import { readStoreSlice, writeStoreSlice } from "../../../../11.1/services/repository";
export { readStoreSlice, writeStoreSlice };
import type {
  CoalitionRecord,
  CrossInstitutionIdentityRecord,
  FederatedSearchRecord,
  FederationAuditRecord,
  FederationGovernanceRecord,
  FederationInstitutionRecord,
  SharedKnowledgeRecord,
  SharedMissionRecord,
  SharedResourceRecord,
  SovereigntyRecord,
  TrustRelationshipRecord,
} from "../data-model";
import { FEDERATION_STORE_KEYS } from "../data-model";

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

export function listInstitutions() {
  return readStoreSlice<FederationInstitutionRecord>(FEDERATION_STORE_KEYS.institutions);
}

export function getInstitution(institutionId: string) {
  return listInstitutions().find((i) => i.institution_id === institutionId) ?? null;
}

export function saveInstitution(record: FederationInstitutionRecord) {
  upsertById(FEDERATION_STORE_KEYS.institutions, record, "institution_id");
}

export function listSovereignty(institutionId: string) {
  return listByInstitution<SovereigntyRecord>(FEDERATION_STORE_KEYS.sovereignty, institutionId);
}

export function saveSovereignty(record: SovereigntyRecord) {
  upsertById(FEDERATION_STORE_KEYS.sovereignty, record, "sovereignty_id");
}

export function listTrust(institutionId: string) {
  return listByInstitution<TrustRelationshipRecord>(FEDERATION_STORE_KEYS.trust, institutionId);
}

export function saveTrust(record: TrustRelationshipRecord) {
  upsertById(FEDERATION_STORE_KEYS.trust, record, "trust_id");
}

export function listCoalitions() {
  return readStoreSlice<CoalitionRecord>(FEDERATION_STORE_KEYS.coalitions);
}

export function saveCoalition(record: CoalitionRecord) {
  upsertById(FEDERATION_STORE_KEYS.coalitions, record, "coalition_id");
}

export function listSharedMissions() {
  return readStoreSlice<SharedMissionRecord>(FEDERATION_STORE_KEYS.missions);
}

export function saveSharedMission(record: SharedMissionRecord) {
  upsertById(FEDERATION_STORE_KEYS.missions, record, "mission_id");
}

export function listSharedKnowledge(ownerInstitutionId?: string) {
  const all = readStoreSlice<SharedKnowledgeRecord>(FEDERATION_STORE_KEYS.knowledge);
  return ownerInstitutionId ? all.filter((k) => k.owner_institution_id === ownerInstitutionId) : all;
}

export function saveSharedKnowledge(record: SharedKnowledgeRecord) {
  upsertById(FEDERATION_STORE_KEYS.knowledge, record, "knowledge_id");
}

export function listSharedResources(institutionId: string) {
  return readStoreSlice<SharedResourceRecord>(FEDERATION_STORE_KEYS.resources).filter(
    (r) => r.owner_institution_id === institutionId || r.shared_with.includes(institutionId)
  );
}

export function saveSharedResource(record: SharedResourceRecord) {
  upsertById(FEDERATION_STORE_KEYS.resources, record, "resource_id");
}

export function listFederatedSearches(humanId: string) {
  return readStoreSlice<FederatedSearchRecord>(FEDERATION_STORE_KEYS.search).filter((s) => s.human_id === humanId);
}

export function saveFederatedSearch(record: FederatedSearchRecord) {
  upsertById(FEDERATION_STORE_KEYS.search, record, "search_id");
}

export function listCrossInstitutionIdentity(humanId: string) {
  return readStoreSlice<CrossInstitutionIdentityRecord>(FEDERATION_STORE_KEYS.identity).filter(
    (i) => i.human_id === humanId
  );
}

export function saveCrossInstitutionIdentity(record: CrossInstitutionIdentityRecord) {
  upsertById(FEDERATION_STORE_KEYS.identity, record, "identity_id");
}

export function listFederationGovernance(coalitionId: string) {
  return readStoreSlice<FederationGovernanceRecord>(FEDERATION_STORE_KEYS.governance).filter(
    (g) => g.coalition_id === coalitionId
  );
}

export function saveFederationGovernance(record: FederationGovernanceRecord) {
  upsertById(FEDERATION_STORE_KEYS.governance, record, "governance_id");
}

export function listFederationAudits(institutionId: string) {
  return readStoreSlice<FederationAuditRecord>(FEDERATION_STORE_KEYS.audit).filter(
    (a) => a.owner_institution_id === institutionId
  );
}

export function saveFederationAudit(record: FederationAuditRecord) {
  upsertById(FEDERATION_STORE_KEYS.audit, record, "audit_id");
}
