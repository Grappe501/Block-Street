/**
 * CAE-11.12-W7 — Knowledge evolution proposals
 */
import { knowledgeApplicationService } from "../application-service";
import type { KnowledgeOptimization } from "./contracts";
import { nowIso } from "../../../utils";

export function generateKnowledgeEvolutionProposals(institutionId: string): KnowledgeOptimization[] {
  const artifacts = knowledgeApplicationService.listArtifacts(institutionId);
  const recs: KnowledgeOptimization[] = [];

  for (const a of artifacts.filter((x) => x.lifecycle_state === "review" || x.evidence_status === "insufficient")) {
    recs.push({
      optimization_id: `kev-${a.canonical_id}`,
      category: "knowledge_revision",
      title: `Review ${a.display_name}`,
      what_changed: `Lifecycle: ${a.lifecycle_state}, evidence: ${a.evidence_status}`,
      why: "Overdue review or weak evidence weakens institutional trust.",
      confidence: "high",
      evidence: [{ signal_id: a.canonical_id, source: "artifact", summary: a.lifecycle_state }],
      expected_benefit: "Current validated guidance.",
      potential_risk: "Publication delay during review.",
      who_should_review: "Knowledge steward",
      suggested_action: "SubmitKnowledgeArtifactForReview or ValidateKnowledgeArtifact via governed command.",
      domain_command_required: "ValidateKnowledgeArtifact",
      human_approval_required: true,
      advisory_only: true,
      generated_at: nowIso(),
    });
  }

  const historical = artifacts.filter((x) => x.lifecycle_state === "historical");
  if (historical.length > 0) {
    recs.push({
      optimization_id: "kev-historical-label",
      category: "knowledge_consolidation",
      title: "Ensure historical guidance is clearly labeled in search and tutor",
      what_changed: `${historical.length} historical artifacts exist.`,
      why: "Historical guidance must not appear as current without explicit request.",
      confidence: "medium",
      evidence: [{ signal_id: "historical-count", source: "artifacts", summary: String(historical.length) }],
      expected_benefit: "Reduced confusion between current and superseded guidance.",
      potential_risk: "None for labeling-only changes.",
      who_should_review: "Knowledge steward",
      suggested_action: "Verify search and tutor label historical results.",
      domain_command_required: null,
      human_approval_required: true,
      advisory_only: true,
      generated_at: nowIso(),
    });
  }

  return recs;
}
