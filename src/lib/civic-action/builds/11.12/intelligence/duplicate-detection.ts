/**
 * CAE-11.12-W6 — Duplicate knowledge detection (advisory)
 */
import { caeId } from "../../../utils";
import { filterArtifactsByPermission } from "./semantic-retrieval";
import type { KnowledgeIntelligenceContext } from "./api-context";
import { jaccardSimilarity, similarityLabel, tokenize } from "./utils";

export type DuplicateKnowledgeCandidate = {
  artifact_id_a: string;
  artifact_id_b: string;
  name_a: string;
  name_b: string;
  similarity_score: number;
  similarity_label: string;
  compare_href: string;
  human_review_required: true;
  advisory_only: true;
};

export function detectDuplicateKnowledge(
  ctx: KnowledgeIntelligenceContext,
  threshold = 0.55
): DuplicateKnowledgeCandidate[] {
  const artifacts = filterArtifactsByPermission(ctx);
  const pairs: DuplicateKnowledgeCandidate[] = [];

  for (let i = 0; i < artifacts.length; i++) {
    for (let j = i + 1; j < artifacts.length; j++) {
      const a = artifacts[i];
      const b = artifacts[j];
      const score = jaccardSimilarity(
        tokenize(`${a.display_name} ${a.lifecycle_state}`),
        tokenize(`${b.display_name} ${b.lifecycle_state}`)
      );
      if (score >= threshold) {
        pairs.push({
          artifact_id_a: a.id,
          artifact_id_b: b.id,
          name_a: a.display_name,
          name_b: b.display_name,
          similarity_score: score,
          similarity_label: similarityLabel(score),
          compare_href: `/knowledge/compare?a=${a.id}&b=${b.id}`,
          human_review_required: true,
          advisory_only: true,
        });
      }
    }
  }
  return pairs.sort((x, y) => y.similarity_score - x.similarity_score).slice(0, 10);
}
