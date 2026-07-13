/**
 * CAE-11.7-W9 — Multi-Agent persistence
 */
import { readStoreSlice, writeStoreSlice } from "../../../../11.1/services/repository";
export { readStoreSlice, writeStoreSlice };
import type {
  AgentGovernanceRecord,
  AgentMemoryRecord,
  AgentMessageRecord,
  AgentRegistryEntry,
  AgentTaskRecord,
  ConflictRecord,
  ConsensusRecord,
  EvidenceBusRecord,
  HumanReviewRecord,
  IntegrationRecord,
  MarketplaceEntry,
} from "../data-model";
import { AGENT_STORE_KEYS } from "../data-model";

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

export function listRegistry(institutionId: string) {
  return listByInstitution<AgentRegistryEntry>(AGENT_STORE_KEYS.registry, institutionId);
}

export function saveRegistryEntry(record: AgentRegistryEntry) {
  upsertById(AGENT_STORE_KEYS.registry, record, "agent_id");
}

export function getRegistryEntry(agentId: string) {
  return readStoreSlice<AgentRegistryEntry>(AGENT_STORE_KEYS.registry).find((r) => r.agent_id === agentId) ?? null;
}

export function listTasks(humanId: string) {
  return listByHuman<AgentTaskRecord>(AGENT_STORE_KEYS.tasks, humanId);
}

export function saveTask(record: AgentTaskRecord) {
  upsertById(AGENT_STORE_KEYS.tasks, record, "task_id");
}

export function listMessages(taskId: string) {
  return readStoreSlice<AgentMessageRecord>(AGENT_STORE_KEYS.messages).filter((m) => m.task_id === taskId);
}

export function saveMessage(record: AgentMessageRecord) {
  upsertById(AGENT_STORE_KEYS.messages, record, "message_id");
}

export function listEvidence(taskId?: string) {
  const all = readStoreSlice<EvidenceBusRecord>(AGENT_STORE_KEYS.evidence);
  return taskId ? all.filter((e) => e.task_id === taskId) : all;
}

export function saveEvidence(record: EvidenceBusRecord) {
  upsertById(AGENT_STORE_KEYS.evidence, record, "evidence_id");
}

export function listConflicts(institutionId: string) {
  return listByInstitution<ConflictRecord>(AGENT_STORE_KEYS.conflicts, institutionId);
}

export function saveConflict(record: ConflictRecord) {
  upsertById(AGENT_STORE_KEYS.conflicts, record, "conflict_id");
}

export function listConsensus(humanId: string) {
  return listByHuman<ConsensusRecord>(AGENT_STORE_KEYS.consensus, humanId);
}

export function saveConsensus(record: ConsensusRecord) {
  upsertById(AGENT_STORE_KEYS.consensus, record, "consensus_id");
}

export function listReviews(humanId: string) {
  return listByHuman<HumanReviewRecord>(AGENT_STORE_KEYS.reviews, humanId);
}

export function saveReview(record: HumanReviewRecord) {
  upsertById(AGENT_STORE_KEYS.reviews, record, "review_id");
}

export function listAgentMemory(agentId: string) {
  return readStoreSlice<AgentMemoryRecord>(AGENT_STORE_KEYS.memory).filter((m) => m.agent_id === agentId);
}

export function saveAgentMemory(record: AgentMemoryRecord) {
  upsertById(AGENT_STORE_KEYS.memory, record, "memory_id");
}

export function listMarketplace(institutionId: string) {
  return listByInstitution<MarketplaceEntry>(AGENT_STORE_KEYS.marketplace, institutionId);
}

export function saveMarketplaceEntry(record: MarketplaceEntry) {
  upsertById(AGENT_STORE_KEYS.marketplace, record, "listing_id");
}

export function listIntegrations(institutionId: string) {
  return listByInstitution<IntegrationRecord>(AGENT_STORE_KEYS.integrations, institutionId);
}

export function saveIntegration(record: IntegrationRecord) {
  upsertById(AGENT_STORE_KEYS.integrations, record, "integration_id");
}

export function listGovernance(institutionId: string) {
  return listByInstitution<AgentGovernanceRecord>(AGENT_STORE_KEYS.governance, institutionId);
}

export function saveGovernance(record: AgentGovernanceRecord) {
  upsertById(AGENT_STORE_KEYS.governance, record, "governance_id");
}
