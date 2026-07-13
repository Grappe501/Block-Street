/**
 * CAE-11.7-W5 — Research Network persistence
 */
import { readStoreSlice, writeStoreSlice } from "../../../../11.1/services/repository";
export { readStoreSlice, writeStoreSlice };
import type {
  ChangeRecord,
  EvidenceCorrelationRecord,
  KnowledgePromotionRecord,
  MonitorRecord,
  OpportunityRecord,
  ResearchBriefRecord,
  ResearchItemRecord,
  ResearchMemoryRecord,
  SourceRegistryEntry,
  ThreatRecord,
} from "../data-model";
import { RESEARCH_STORE_KEYS } from "../data-model";

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

export function getSources() {
  return readStoreSlice<SourceRegistryEntry>(RESEARCH_STORE_KEYS.sources);
}

export function saveSources(entries: SourceRegistryEntry[]) {
  writeStoreSlice(RESEARCH_STORE_KEYS.sources, entries);
}

export function saveSource(entry: SourceRegistryEntry) {
  upsertById(RESEARCH_STORE_KEYS.sources, entry, "source_id");
}

export function listResearchItems(humanId: string) {
  return listByHuman<ResearchItemRecord>(RESEARCH_STORE_KEYS.items, humanId);
}

export function saveResearchItem(record: ResearchItemRecord) {
  upsertById(RESEARCH_STORE_KEYS.items, record, "research_id");
}

export function listMonitors(humanId: string) {
  return listByHuman<MonitorRecord>(RESEARCH_STORE_KEYS.monitors, humanId);
}

export function saveMonitor(record: MonitorRecord) {
  upsertById(RESEARCH_STORE_KEYS.monitors, record, "monitor_id");
}

export function listChanges(institutionId: string) {
  return listByInstitution<ChangeRecord>(RESEARCH_STORE_KEYS.changes, institutionId);
}

export function saveChange(record: ChangeRecord) {
  upsertById(RESEARCH_STORE_KEYS.changes, record, "change_id");
}

export function listBriefs(humanId: string) {
  return listByHuman<ResearchBriefRecord>(RESEARCH_STORE_KEYS.briefs, humanId);
}

export function getBrief(briefId: string) {
  return readStoreSlice<ResearchBriefRecord>(RESEARCH_STORE_KEYS.briefs).find((b) => b.brief_id === briefId) ?? null;
}

export function saveBrief(record: ResearchBriefRecord) {
  upsertById(RESEARCH_STORE_KEYS.briefs, record, "brief_id");
}

export function listOpportunities(institutionId: string) {
  return listByInstitution<OpportunityRecord>(RESEARCH_STORE_KEYS.opportunities, institutionId);
}

export function saveOpportunity(record: OpportunityRecord) {
  upsertById(RESEARCH_STORE_KEYS.opportunities, record, "opportunity_id");
}

export function listThreats(institutionId: string) {
  return listByInstitution<ThreatRecord>(RESEARCH_STORE_KEYS.threats, institutionId);
}

export function saveThreat(record: ThreatRecord) {
  upsertById(RESEARCH_STORE_KEYS.threats, record, "threat_id");
}

export function listPromotions(humanId: string) {
  return listByHuman<KnowledgePromotionRecord>(RESEARCH_STORE_KEYS.promotions, humanId);
}

export function savePromotion(record: KnowledgePromotionRecord) {
  upsertById(RESEARCH_STORE_KEYS.promotions, record, "promotion_id");
}

export function listResearchMemory(humanId: string) {
  return listByHuman<ResearchMemoryRecord>(RESEARCH_STORE_KEYS.memory, humanId);
}

export function saveResearchMemory(record: ResearchMemoryRecord) {
  upsertById(RESEARCH_STORE_KEYS.memory, record, "memory_id");
}

export function listCorrelations(researchId: string) {
  return readStoreSlice<EvidenceCorrelationRecord>(RESEARCH_STORE_KEYS.correlations).filter(
    (c) => c.research_id === researchId
  );
}

export function saveCorrelation(record: EvidenceCorrelationRecord) {
  upsertById(RESEARCH_STORE_KEYS.correlations, record, "correlation_id");
}
