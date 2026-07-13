/**
 * CAE-11.6-W4 — Organization persistence
 */
export { readStoreSlice, writeStoreSlice } from "../../../11.1/services/repository";
import { readStoreSlice, writeStoreSlice } from "../../../11.1/services/repository";
import type {
  AuthorityRecord,
  CollaborationRecord,
  FederationRecord,
  GovernanceDecisionRecord,
  OpsInstitutionRecord,
  OrganizationHealthRecord,
  OrganizationUnitRecord,
  OrgMembershipRecord,
  ReportingRelationshipRecord,
  SharedMissionRecord,
} from "../data-model";
import { ORGANIZATION_STORE_KEYS } from "../data-model";

function upsertById<T>(key: string, record: T, idField: keyof T & string) {
  const items = readStoreSlice<T>(key);
  const id = String(record[idField]);
  const idx = items.findIndex((i) => String(i[idField]) === id);
  if (idx >= 0) items[idx] = record;
  else items.push(record);
  writeStoreSlice(key, items);
}

export function listFederations() {
  return readStoreSlice<FederationRecord>(ORGANIZATION_STORE_KEYS.federations);
}

export function saveFederation(record: FederationRecord) {
  upsertById(ORGANIZATION_STORE_KEYS.federations, record, "federation_id");
}

export function listOpsInstitutions(federationId?: string) {
  const items = readStoreSlice<OpsInstitutionRecord>(ORGANIZATION_STORE_KEYS.institutions);
  return federationId ? items.filter((i) => i.federation_id === federationId) : items;
}

export function getOpsInstitution(institutionId: string) {
  return readStoreSlice<OpsInstitutionRecord>(ORGANIZATION_STORE_KEYS.institutions).find((i) => i.institution_id === institutionId) ?? null;
}

export function saveOpsInstitution(record: OpsInstitutionRecord) {
  upsertById(ORGANIZATION_STORE_KEYS.institutions, record, "institution_id");
}

export function listOrganizationUnits(institutionId: string, parentUnitId?: string | null) {
  return readStoreSlice<OrganizationUnitRecord>(ORGANIZATION_STORE_KEYS.organization_units).filter(
    (u) => u.institution_id === institutionId && (parentUnitId === undefined || u.parent_unit_id === parentUnitId)
  );
}

export function saveOrganizationUnit(record: OrganizationUnitRecord) {
  upsertById(ORGANIZATION_STORE_KEYS.organization_units, record, "organization_unit_id");
}

export function listAuthorities(institutionId: string, unitId?: string) {
  return readStoreSlice<AuthorityRecord>(ORGANIZATION_STORE_KEYS.authorities).filter(
    (a) => a.institution_id === institutionId && (!unitId || a.organization_unit_id === unitId)
  );
}

export function saveAuthority(record: AuthorityRecord) {
  upsertById(ORGANIZATION_STORE_KEYS.authorities, record, "authority_id");
}

export function listOrgMemberships(institutionId: string, humanId?: string) {
  return readStoreSlice<OrgMembershipRecord>(ORGANIZATION_STORE_KEYS.memberships).filter(
    (m) => m.institution_id === institutionId && (!humanId || m.human_id === humanId)
  );
}

export function saveOrgMembership(record: OrgMembershipRecord) {
  upsertById(ORGANIZATION_STORE_KEYS.memberships, record, "membership_id");
}

export function listReportingRelationships(humanId: string) {
  return readStoreSlice<ReportingRelationshipRecord>(ORGANIZATION_STORE_KEYS.reporting_relationships).filter(
    (r) => r.human_id === humanId
  );
}

export function saveReportingRelationship(record: ReportingRelationshipRecord) {
  upsertById(ORGANIZATION_STORE_KEYS.reporting_relationships, record, "relationship_id");
}

export function listCollaborations(institutionId: string) {
  return readStoreSlice<CollaborationRecord>(ORGANIZATION_STORE_KEYS.collaborations).filter(
    (c) => c.from_institution_id === institutionId || c.to_institution_id === institutionId
  );
}

export function saveCollaboration(record: CollaborationRecord) {
  upsertById(ORGANIZATION_STORE_KEYS.collaborations, record, "collaboration_id");
}

export function listSharedMissions(institutionId: string) {
  return readStoreSlice<SharedMissionRecord>(ORGANIZATION_STORE_KEYS.shared_missions).filter(
    (s) => s.primary_institution_id === institutionId || s.supporting_institution_ids.includes(institutionId)
  );
}

export function saveSharedMission(record: SharedMissionRecord) {
  upsertById(ORGANIZATION_STORE_KEYS.shared_missions, record, "shared_mission_id");
}

export function listGovernanceDecisions(institutionId: string) {
  return readStoreSlice<GovernanceDecisionRecord>(ORGANIZATION_STORE_KEYS.governance_decisions).filter(
    (d) => d.institution_id === institutionId
  );
}

export function saveGovernanceDecision(record: GovernanceDecisionRecord) {
  upsertById(ORGANIZATION_STORE_KEYS.governance_decisions, record, "decision_id");
}

export function getOrganizationHealth(institutionId: string) {
  return readStoreSlice<OrganizationHealthRecord>(ORGANIZATION_STORE_KEYS.organization_health).find((h) => h.institution_id === institutionId) ?? null;
}

export function saveOrganizationHealth(record: OrganizationHealthRecord) {
  upsertById(ORGANIZATION_STORE_KEYS.organization_health, record, "health_id");
}

export function buildOrganizationTree(institutionId: string) {
  const units = listOrganizationUnits(institutionId);
  const byParent = new Map<string | null, OrganizationUnitRecord[]>();
  for (const u of units) {
    const key = u.parent_unit_id;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key)!.push(u);
  }
  function branch(parentId: string | null): unknown[] {
    return (byParent.get(parentId) ?? []).map((u) => ({
      ...u,
      children: branch(u.organization_unit_id),
    }));
  }
  return { institution_id: institutionId, tree: branch(null) };
}
