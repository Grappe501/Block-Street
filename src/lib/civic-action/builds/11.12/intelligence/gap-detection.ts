/**
 * CAE-11.12-W6 — Knowledge gap detection
 */
import { caeId } from "../../../utils";
import { knowledgeApplicationService } from "../application-service";
import type { KnowledgeGapCandidate } from "./contracts";
import type { KnowledgeIntelligenceContext } from "./api-context";
import { semanticKnowledgeQuery } from "./semantic-retrieval";

const GAP_QUERIES = [
  "volunteer transportation policy",
  "check-in procedure",
  "safety guidance",
];

export function detectKnowledgeGaps(ctx: KnowledgeIntelligenceContext): KnowledgeGapCandidate[] {
  const gaps: KnowledgeGapCandidate[] = [];

  for (const q of GAP_QUERIES) {
    const result = semanticKnowledgeQuery(ctx, q);
    if (result.hits.length === 0) {
      gaps.push({
        gap_id: caeId("kgp"),
        gap_type: "documentation_gap",
        description: `Repeated searches may find no useful answer for: ${q}`,
        evidence: [`Zero authorized hits for institution query: ${q}`],
        affected_roles: ["volunteer_coordinator", "mission_lead"],
        frequency: 1,
        impact: "medium",
        confidence: "medium",
        recommended_response: "Create FAQ and playbook section via governed Knowledge commands",
        human_review_required: true,
        advisory_only: true,
      });
    }
  }

  const courses = knowledgeApplicationService.listCourses(ctx.institution_id).filter(
    (c) => c.lifecycle_state === "published"
  );
  if (courses.length === 0) {
    gaps.push({
      gap_id: caeId("kgp"),
      gap_type: "training_need",
      description: "No published courses available for role training",
      evidence: ["Zero published courses in institution"],
      affected_roles: ["learner"],
      frequency: 1,
      impact: "high",
      confidence: "high",
      recommended_response: "Publish courses through Wave 3 commands",
      human_review_required: true,
      advisory_only: true,
    });
  }

  return gaps;
}
