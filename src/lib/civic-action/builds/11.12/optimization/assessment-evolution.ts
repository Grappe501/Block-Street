/**
 * CAE-11.12-W7 — Assessment evolution (active attempts protected)
 */
import { knowledgeApplicationService } from "../application-service";
import type { KnowledgeOptimization } from "./contracts";
import { nowIso } from "../../../utils";

export function generateAssessmentEvolutionProposals(institutionId: string): KnowledgeOptimization[] {
  const assessments = knowledgeApplicationService.listAssessments(institutionId);
  return assessments.map((a) => ({
    optimization_id: `asv-${a.canonical_id}`,
    category: "assessment_revision",
    title: `Assessment review: ${a.display_name}`,
    what_changed: `Assessment version ${a.current_version}`,
    why: "Assessment changes must not alter active attempts.",
    confidence: "medium",
    evidence: [{ signal_id: a.canonical_id, source: "assessment", summary: a.lifecycle_state }],
    expected_benefit: "Clearer, fairer assessments.",
    potential_risk: "Active attempts remain bound to original version.",
    who_should_review: "Assessment governance authority",
    suggested_action: "Publish new assessment version; active attempts unchanged.",
    domain_command_required: null,
    human_approval_required: true,
    advisory_only: true,
    generated_at: nowIso(),
  }));
}

export const ACTIVE_ATTEMPT_PROTECTION = {
  rule: "Published assessment changes must not alter active attempts.",
  enforcement: "version_binding",
} as const;
