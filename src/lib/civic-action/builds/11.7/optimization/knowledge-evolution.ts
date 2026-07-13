/**
 * CAE-11.7-W7 — Knowledge evolution (optimization layer)
 * captured → validated → referenced → operational_standard → institutional_standard → historical_archive
 */
import { COMMUNICATION_STORE_KEYS } from "../data-model";
import { readStoreSlice } from "../services/repository";
import type { KnowledgeRecord } from "../data-model";
import type { KnowledgeEvolutionEntry, KnowledgeEvolutionStage } from "./contracts";

const STAGE_ORDER: KnowledgeEvolutionStage[] = [
  "captured",
  "validated",
  "referenced",
  "operational_standard",
  "institutional_standard",
  "historical_archive",
];

function mapToOptimizationStage(record: KnowledgeRecord): KnowledgeEvolutionStage {
  if (record.lifecycle_state === "archived") return "historical_archive";
  if (record.tags.includes("institutional_standard")) return "institutional_standard";
  if (record.tags.includes("operational_standard")) return "operational_standard";
  if (record.tags.includes("referenced")) return "referenced";
  if (record.tags.includes("validated")) return "validated";
  return "captured";
}

export function analyzeKnowledgeEvolution(
  institutionId: string,
  initiativeId?: string
): KnowledgeEvolutionEntry[] {
  let records = readStoreSlice<KnowledgeRecord>(COMMUNICATION_STORE_KEYS.knowledge).filter(
    (k) => k.institution_id === institutionId
  );
  if (initiativeId) records = records.filter((k) => k.initiative_id === initiativeId);

  return records.map((k) => {
    const stage = mapToOptimizationStage(k);
    const idx = STAGE_ORDER.indexOf(stage);
    const notes = STAGE_ORDER.slice(0, idx + 1).map((s) => `Reached stage: ${s}`);
    return {
      knowledge_id: k.canonical_id,
      display_name: k.display_name,
      current_stage: stage,
      institution_id: k.institution_id,
      initiative_id: k.initiative_id,
      transition_notes: notes,
      advisory_only: true,
    };
  });
}

export function nextEvolutionStage(current: KnowledgeEvolutionStage): KnowledgeEvolutionStage | null {
  const idx = STAGE_ORDER.indexOf(current);
  return idx < STAGE_ORDER.length - 1 ? STAGE_ORDER[idx + 1] : null;
}

export function countByStage(entries: KnowledgeEvolutionEntry[]): Record<KnowledgeEvolutionStage, number> {
  const counts = Object.fromEntries(STAGE_ORDER.map((s) => [s, 0])) as Record<KnowledgeEvolutionStage, number>;
  for (const e of entries) counts[e.current_stage]++;
  return counts;
}
