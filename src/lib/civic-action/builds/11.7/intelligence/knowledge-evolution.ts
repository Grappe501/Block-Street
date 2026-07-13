/**
 * CAE-11.7-W6 — Knowledge evolution lifecycle
 * captured → validated → published → standard → historical → retired
 */
import { COMMUNICATION_STORE_KEYS } from "../data-model";
import { readStoreSlice } from "../services/repository";
import type { KnowledgeRecord } from "../data-model";

export type KnowledgeEvolutionStage =
  | "captured"
  | "validated"
  | "published"
  | "standard"
  | "historical"
  | "retired";

export type KnowledgeEvolutionEntry = {
  knowledge_id: string;
  display_name: string;
  current_stage: KnowledgeEvolutionStage;
  institution_id: string;
  initiative_id: string;
  transition_notes: string[];
  advisory_only: true;
};

const STAGE_ORDER: KnowledgeEvolutionStage[] = [
  "captured",
  "validated",
  "published",
  "standard",
  "historical",
  "retired",
];

function mapLifecycleToStage(record: KnowledgeRecord): KnowledgeEvolutionStage {
  if (record.lifecycle_state === "archived") return "retired";
  if (record.tags.includes("standard")) return "standard";
  if (record.tags.includes("historical")) return "historical";
  if (record.tags.includes("published")) return "published";
  if (record.tags.includes("validated")) return "validated";
  return "captured";
}

export function trackKnowledgeEvolution(institutionId: string, initiativeId?: string): KnowledgeEvolutionEntry[] {
  let records = readStoreSlice<KnowledgeRecord>(COMMUNICATION_STORE_KEYS.knowledge).filter(
    (k) => k.institution_id === institutionId
  );
  if (initiativeId) records = records.filter((k) => k.initiative_id === initiativeId);

  return records.map((k) => {
    const stage = mapLifecycleToStage(k);
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
