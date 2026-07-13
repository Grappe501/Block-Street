/**
 * CAE-11.12-W6 — Research and evidence intelligence
 */
import { caeId } from "../../../utils";
import type { KnowledgeIntelligenceContext } from "./api-context";
import { semanticKnowledgeQuery } from "./semantic-retrieval";

export function synthesizeResearchEvidence(
  ctx: KnowledgeIntelligenceContext,
  question: string
) {
  const retrieval = semanticKnowledgeQuery(ctx, question);
  const supporting = retrieval.hits.filter((h) => h.is_current);
  const historical = retrieval.hits.filter((h) => !h.is_current);

  return {
    synthesis_id: caeId("rsy"),
    question,
    evidence_considered: retrieval.evidence,
    supporting_findings: supporting.map((h) => h.title),
    contradictory_findings: historical.length > 0 ? ["Historical guidance may differ from current"] : [],
    method_differences: ["Sources may use different operational contexts"],
    confidence: supporting.length > 1 ? "medium" : supporting.length === 1 ? "low" : "speculative",
    limitations: [
      "Synthesis is advisory — not validated research finding",
      "Does not auto-publish institutional policy",
    ],
    unanswered_questions: supporting.length === 0 ? [question] : [],
    source_references: retrieval.evidence,
    human_review_required: true,
    advisory_only: true as const,
  };
}

export function detectResearchGaps(ctx: KnowledgeIntelligenceContext) {
  return [
    {
      gap_id: caeId("rsg"),
      theme: "Mission outcome comparison",
      description: "Cross-county Mission outcome patterns may benefit from formal research review",
      confidence: "medium",
      recommended_action: "Create research project via governed command",
      advisory_only: true as const,
    },
  ];
}
