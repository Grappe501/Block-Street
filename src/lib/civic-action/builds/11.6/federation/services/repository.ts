/**
 * CAE-11.6-W12 — Federation persistence
 */
export { readStoreSlice, writeStoreSlice } from "../../../11.1/services/repository";
import { readStoreSlice, writeStoreSlice } from "../../../11.1/services/repository";
import type {
  CrossInstitutionTeamRecord,
  FederationAgreementRecord,
  FederationBriefingRecord,
  FederationCapabilityRecord,
  FederationKnowledgeShareRecord,
  FederationMembershipRecord,
  FederationMutualAidRecord,
  FederationProfileRecord,
  FederationResourceExchangeRecord,
  FederationSharedMissionRecord,
  FederationVoteRecord,
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

export function listFederationProfiles() {
  return readStoreSlice<FederationProfileRecord>(FEDERATION_STORE_KEYS.profiles);
}

export function getFederationProfile(federationId: string) {
  return listFederationProfiles().find((f) => f.federation_id === federationId) ?? null;
}

export function saveFederationProfile(record: FederationProfileRecord) {
  upsertById(FEDERATION_STORE_KEYS.profiles, record, "federation_id");
}

export function listFederationMemberships(federationId: string) {
  return readStoreSlice<FederationMembershipRecord>(FEDERATION_STORE_KEYS.memberships).filter(
    (m) => m.federation_id === federationId
  );
}

export function listInstitutionMemberships(institutionId: string) {
  return readStoreSlice<FederationMembershipRecord>(FEDERATION_STORE_KEYS.memberships).filter(
    (m) => m.institution_id === institutionId
  );
}

export function saveFederationMembership(record: FederationMembershipRecord) {
  upsertById(FEDERATION_STORE_KEYS.memberships, record, "membership_id");
}

export function listFederationAgreements(federationId: string) {
  return readStoreSlice<FederationAgreementRecord>(FEDERATION_STORE_KEYS.agreements).filter(
    (a) => a.federation_id === federationId
  );
}

export function getFederationAgreement(agreementId: string) {
  return readStoreSlice<FederationAgreementRecord>(FEDERATION_STORE_KEYS.agreements).find(
    (a) => a.agreement_id === agreementId
  ) ?? null;
}

export function saveFederationAgreement(record: FederationAgreementRecord) {
  upsertById(FEDERATION_STORE_KEYS.agreements, record, "agreement_id");
}

export function listFederationSharedMissions(federationId: string) {
  return readStoreSlice<FederationSharedMissionRecord>(FEDERATION_STORE_KEYS.shared_missions).filter(
    (m) => m.federation_id === federationId
  );
}

export function saveFederationSharedMission(record: FederationSharedMissionRecord) {
  upsertById(FEDERATION_STORE_KEYS.shared_missions, record, "shared_mission_id");
}

export function listFederationKnowledgeShares(federationId: string) {
  return readStoreSlice<FederationKnowledgeShareRecord>(FEDERATION_STORE_KEYS.knowledge_shares).filter(
    (k) => k.federation_id === federationId
  );
}

export function saveFederationKnowledgeShare(record: FederationKnowledgeShareRecord) {
  upsertById(FEDERATION_STORE_KEYS.knowledge_shares, record, "share_id");
}

export function listFederationResourceExchanges(federationId: string) {
  return readStoreSlice<FederationResourceExchangeRecord>(FEDERATION_STORE_KEYS.resource_exchanges).filter(
    (r) => r.federation_id === federationId
  );
}

export function saveFederationResourceExchange(record: FederationResourceExchangeRecord) {
  upsertById(FEDERATION_STORE_KEYS.resource_exchanges, record, "exchange_id");
}

export function listFederationMutualAid(federationId: string) {
  return readStoreSlice<FederationMutualAidRecord>(FEDERATION_STORE_KEYS.mutual_aid).filter(
    (a) => a.federation_id === federationId
  );
}

export function saveFederationMutualAid(record: FederationMutualAidRecord) {
  upsertById(FEDERATION_STORE_KEYS.mutual_aid, record, "aid_id");
}

export function listFederationVotes(federationId: string) {
  return readStoreSlice<FederationVoteRecord>(FEDERATION_STORE_KEYS.votes).filter((v) => v.federation_id === federationId);
}

export function saveFederationVote(record: FederationVoteRecord) {
  upsertById(FEDERATION_STORE_KEYS.votes, record, "vote_id");
}

export function listFederationTeams(federationId: string) {
  return readStoreSlice<CrossInstitutionTeamRecord>(FEDERATION_STORE_KEYS.teams).filter(
    (t) => t.federation_id === federationId
  );
}

export function saveFederationTeam(record: CrossInstitutionTeamRecord) {
  upsertById(FEDERATION_STORE_KEYS.teams, record, "team_id");
}

export function listFederationCapabilities(federationId: string) {
  return readStoreSlice<FederationCapabilityRecord>(FEDERATION_STORE_KEYS.capabilities).filter(
    (c) => c.federation_id === federationId
  );
}

export function saveFederationCapability(record: FederationCapabilityRecord) {
  upsertById(FEDERATION_STORE_KEYS.capabilities, record, "capability_id");
}

export function listFederationBriefings(federationId: string) {
  return readStoreSlice<FederationBriefingRecord>(FEDERATION_STORE_KEYS.briefings).filter(
    (b) => b.federation_id === federationId
  );
}

export function saveFederationBriefing(record: FederationBriefingRecord) {
  upsertById(FEDERATION_STORE_KEYS.briefings, record, "briefing_id");
}
