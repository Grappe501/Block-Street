/**
 * CAE-11.7-W7 — Institutional memory governance
 */
import { indexInstitutionalMemory } from "../intelligence/institutional-memory";
import { analyzeKnowledgeEvolution } from "./knowledge-evolution";
import type { KnowledgeEvolutionStage } from "./contracts";

export type MemoryGovernanceReport = {
  institution_id: string;
  artifact_count: number;
  knowledge_by_stage: Record<KnowledgeEvolutionStage, number>;
  retention_policy: string;
  archival_candidates: string[];
  advisory_only: true;
};

export function assessInstitutionalMemoryGovernance(
  institutionId: string,
  initiativeId?: string
): MemoryGovernanceReport {
  const artifacts = indexInstitutionalMemory(institutionId, initiativeId);
  const evolution = analyzeKnowledgeEvolution(institutionId, initiativeId);

  const knowledgeByStage = {
    captured: 0,
    validated: 0,
    referenced: 0,
    operational_standard: 0,
    institutional_standard: 0,
    historical_archive: 0,
  } satisfies Record<KnowledgeEvolutionStage, number>;

  for (const e of evolution) knowledgeByStage[e.current_stage]++;

  const archivalCandidates = evolution
    .filter((e) => e.current_stage === "historical_archive" || e.current_stage === "captured")
    .slice(0, 5)
    .map((e) => e.knowledge_id);

  return {
    institution_id: institutionId,
    artifact_count: artifacts.length,
    knowledge_by_stage: knowledgeByStage,
    retention_policy: "Historical archive requires human approval — no automatic deletion.",
    archival_candidates: archivalCandidates,
    advisory_only: true,
  };
}
