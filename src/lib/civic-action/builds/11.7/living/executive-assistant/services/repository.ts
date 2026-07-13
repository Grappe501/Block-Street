/**
 * CAE-11.7-W3 — Executive Assistant persistence
 */
import { readStoreSlice, writeStoreSlice } from "../../../../11.1/services/repository";
export { readStoreSlice, writeStoreSlice };
import type {
  DecisionPackageRecord,
  DelegationRecommendationRecord,
  DissentItemRecord,
  EvidenceLedgerEntry,
  ExecutiveBriefingRecord,
  ExecutiveCapabilityEntry,
  ExecutiveCommitmentRecord,
  ExecutiveDraftRecord,
  ExecutiveInquiryRecord,
  ExecutiveOutputIncidentRecord,
  ExecutiveResponseRecord,
  ExecutiveRoleContextRecord,
  HandoffPackageRecord,
  MeetingPreparationRecord,
  OpportunityBriefRecord,
  RiskBriefRecord,
  VoicePreferenceRecord,
} from "../data-model";
import { EXECUTIVE_STORE_KEYS } from "../data-model";

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

export function getCapabilities() {
  return readStoreSlice<ExecutiveCapabilityEntry>(EXECUTIVE_STORE_KEYS.capabilities);
}

export function saveCapabilities(entries: ExecutiveCapabilityEntry[]) {
  writeStoreSlice(EXECUTIVE_STORE_KEYS.capabilities, entries);
}

export function getRoleContext(humanId: string, institutionId: string) {
  return (
    listByHuman<ExecutiveRoleContextRecord>(EXECUTIVE_STORE_KEYS.roleContext, humanId).find(
      (r) => r.institution_id === institutionId && r.status === "active"
    ) ?? null
  );
}

export function saveRoleContext(record: ExecutiveRoleContextRecord) {
  upsertById(EXECUTIVE_STORE_KEYS.roleContext, record, "executive_role_context_id");
}

export function listBriefings(humanId: string) {
  return listByHuman<ExecutiveBriefingRecord>(EXECUTIVE_STORE_KEYS.briefings, humanId);
}

export function getBriefing(briefingId: string) {
  return readStoreSlice<ExecutiveBriefingRecord>(EXECUTIVE_STORE_KEYS.briefings).find(
    (b) => b.briefing_id === briefingId
  ) ?? null;
}

export function saveBriefing(record: ExecutiveBriefingRecord) {
  upsertById(EXECUTIVE_STORE_KEYS.briefings, record, "briefing_id");
}

export function getMeetingPrep(eventId: string) {
  return readStoreSlice<MeetingPreparationRecord>(EXECUTIVE_STORE_KEYS.meetingPrep).find(
    (m) => m.calendar_event_id === eventId
  ) ?? null;
}

export function saveMeetingPrep(record: MeetingPreparationRecord) {
  upsertById(EXECUTIVE_STORE_KEYS.meetingPrep, record, "meeting_preparation_id");
}

export function listDecisions(humanId: string) {
  return listByHuman<DecisionPackageRecord>(EXECUTIVE_STORE_KEYS.decisions, humanId);
}

export function getDecision(decisionId: string) {
  return readStoreSlice<DecisionPackageRecord>(EXECUTIVE_STORE_KEYS.decisions).find(
    (d) => d.decision_package_id === decisionId
  ) ?? null;
}

export function saveDecision(record: DecisionPackageRecord) {
  upsertById(EXECUTIVE_STORE_KEYS.decisions, record, "decision_package_id");
}

export function listEvidence(outputId: string) {
  return readStoreSlice<EvidenceLedgerEntry>(EXECUTIVE_STORE_KEYS.evidence).filter(
    (e) => e.executive_output_id === outputId
  );
}

export function saveEvidence(record: EvidenceLedgerEntry) {
  upsertById(EXECUTIVE_STORE_KEYS.evidence, record, "evidence_ledger_id");
}

export function listDissent(decisionId: string) {
  return readStoreSlice<DissentItemRecord>(EXECUTIVE_STORE_KEYS.dissent).filter(
    (d) => d.decision_package_id === decisionId
  );
}

export function saveDissent(record: DissentItemRecord) {
  upsertById(EXECUTIVE_STORE_KEYS.dissent, record, "dissent_item_id");
}

export function listCommitments(humanId: string) {
  return listByHuman<ExecutiveCommitmentRecord>(EXECUTIVE_STORE_KEYS.commitments, humanId);
}

export function getCommitment(commitmentId: string) {
  return readStoreSlice<ExecutiveCommitmentRecord>(EXECUTIVE_STORE_KEYS.commitments).find(
    (c) => c.commitment_id === commitmentId
  ) ?? null;
}

export function saveCommitment(record: ExecutiveCommitmentRecord) {
  upsertById(EXECUTIVE_STORE_KEYS.commitments, record, "commitment_id");
}

export function listDrafts(humanId: string) {
  return listByHuman<ExecutiveDraftRecord>(EXECUTIVE_STORE_KEYS.drafts, humanId);
}

export function saveDraft(record: ExecutiveDraftRecord) {
  upsertById(EXECUTIVE_STORE_KEYS.drafts, record, "executive_draft_id");
}

export function listDelegations(humanId: string) {
  return listByHuman<DelegationRecommendationRecord>(EXECUTIVE_STORE_KEYS.delegations, humanId);
}

export function saveDelegation(record: DelegationRecommendationRecord) {
  upsertById(EXECUTIVE_STORE_KEYS.delegations, record, "delegation_recommendation_id");
}

export function listHandoffs(humanId: string) {
  return listByHuman<HandoffPackageRecord>(EXECUTIVE_STORE_KEYS.handoffs, humanId);
}

export function saveHandoff(record: HandoffPackageRecord) {
  upsertById(EXECUTIVE_STORE_KEYS.handoffs, record, "handoff_package_id");
}

export function listRisks(humanId: string) {
  return listByHuman<RiskBriefRecord>(EXECUTIVE_STORE_KEYS.risks, humanId);
}

export function saveRisk(record: RiskBriefRecord) {
  upsertById(EXECUTIVE_STORE_KEYS.risks, record, "risk_brief_id");
}

export function listOpportunities(humanId: string) {
  return listByHuman<OpportunityBriefRecord>(EXECUTIVE_STORE_KEYS.opportunities, humanId);
}

export function saveOpportunity(record: OpportunityBriefRecord) {
  upsertById(EXECUTIVE_STORE_KEYS.opportunities, record, "opportunity_brief_id");
}

export function listInquiries(humanId: string) {
  return listByHuman<ExecutiveInquiryRecord>(EXECUTIVE_STORE_KEYS.inquiries, humanId);
}

export function saveInquiry(record: ExecutiveInquiryRecord) {
  upsertById(EXECUTIVE_STORE_KEYS.inquiries, record, "executive_inquiry_id");
}

export function listResponses(humanId: string) {
  return listByHuman<ExecutiveResponseRecord>(EXECUTIVE_STORE_KEYS.responses, humanId);
}

export function saveResponse(record: ExecutiveResponseRecord) {
  upsertById(EXECUTIVE_STORE_KEYS.responses, record, "executive_response_id");
}

export function listIncidents(humanId: string) {
  return listByHuman<ExecutiveOutputIncidentRecord>(EXECUTIVE_STORE_KEYS.incidents, humanId);
}

export function saveIncident(record: ExecutiveOutputIncidentRecord) {
  upsertById(EXECUTIVE_STORE_KEYS.incidents, record, "incident_id");
}

export function getVoicePreferences(humanId: string) {
  return readStoreSlice<VoicePreferenceRecord>(EXECUTIVE_STORE_KEYS.voicePreferences).find(
    (v) => v.human_id === humanId
  ) ?? null;
}

export function saveVoicePreferences(record: VoicePreferenceRecord) {
  const items = readStoreSlice<VoicePreferenceRecord>(EXECUTIVE_STORE_KEYS.voicePreferences);
  const idx = items.findIndex((v) => v.human_id === record.human_id);
  if (idx >= 0) items[idx] = record;
  else items.push(record);
  writeStoreSlice(EXECUTIVE_STORE_KEYS.voicePreferences, items);
}
