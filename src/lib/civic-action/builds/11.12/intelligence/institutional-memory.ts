/**
 * CAE-11.12-W6 — Institutional memory intelligence
 */
import { caeId } from "../../../utils";
import { knowledgeApplicationService } from "../application-service";
import type { KnowledgeIntelligenceContext } from "./api-context";
import { semanticKnowledgeQuery } from "./semantic-retrieval";
import { isHistoricalLifecycle } from "./utils";

export function queryInstitutionalMemory(ctx: KnowledgeIntelligenceContext, query: string) {
  const retrieval = semanticKnowledgeQuery(ctx, query, { include_historical: true });
  const historical = retrieval.hits.filter((h) => !h.is_current);

  return {
    memory_id: caeId("mem"),
    query,
    similar_situations: historical.map((h) => ({
      entity_id: h.entity_id,
      title: h.title,
      relevance: "Historical institutional record",
      labeled_historical: true,
    })),
    current_guidance: retrieval.hits.filter((h) => h.is_current),
    decision_lineage: [
      "Original Problem → Discussion → Evidence → Decision → Implementation → Outcome → Later Revision",
    ],
    advisory_only: true as const,
  };
}

export function findHistoricalSimilarity(
  ctx: KnowledgeIntelligenceContext,
  input: { mission_type?: string; geography?: string; objective?: string }
) {
  const artifacts = knowledgeApplicationService
    .listArtifacts(ctx.institution_id)
    .filter((a) => isHistoricalLifecycle(a.lifecycle_state))
    .slice(0, 5);

  return artifacts.map((a) => ({
    artifact_id: a.canonical_id,
    display_name: a.display_name,
    similarity_reason: [
      input.mission_type ? `Mission type context: ${input.mission_type}` : null,
      input.geography ? `Geography: ${input.geography}` : null,
      input.objective ? `Objective alignment: ${input.objective}` : null,
    ]
      .filter(Boolean)
      .join("; "),
    differences: ["Historical context may not match current policy or resources"],
    advisory_only: true as const,
  }));
}
