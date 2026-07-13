/**
 * CAE-11.12-W6 — Knowledge quality and freshness intelligence
 */
import { caeId, nowIso } from "../../../utils";
import { knowledgeApplicationService } from "../application-service";
import type { KnowledgeHealthSnapshot } from "./contracts";
import type { KnowledgeIntelligenceContext } from "./api-context";
import { filterArtifactsByPermission } from "./semantic-retrieval";
import { isCurrentLifecycle } from "./utils";

export function computeKnowledgeHealth(ctx: KnowledgeIntelligenceContext): KnowledgeHealthSnapshot {
  const artifacts = filterArtifactsByPermission(ctx);
  let healthy = 0;
  let reviewDue = 0;
  let weakEvidence = 0;
  let conflicting = 0;
  let staleTranslation = 0;

  for (const a of artifacts) {
    const full = knowledgeApplicationService.getArtifact(a.id);
    if (!full) continue;
    if (isCurrentLifecycle(full.lifecycle_state) && full.evidence_status === "verified") healthy++;
    if (full.lifecycle_state === "review") reviewDue++;
    if (full.evidence_status === "insufficient" || full.evidence_status === "none") weakEvidence++;
    if (full.confidence_level === "low") conflicting++;
    if (full.language !== "en" && full.lifecycle_state === "published") staleTranslation++;
  }

  const overall =
    weakEvidence > 2 || conflicting > 1 ? "at_risk" : reviewDue > 2 ? "watch" : "healthy";

  return {
    snapshot_id: caeId("khs"),
    institution_id: ctx.institution_id,
    generated_at: nowIso(),
    healthy_count: healthy,
    review_due_count: reviewDue,
    weak_evidence_count: weakEvidence,
    conflicting_count: conflicting,
    stale_translation_count: staleTranslation,
    overall_band: overall,
    advisory_only: true,
  };
}

export function detectStaleKnowledge(ctx: KnowledgeIntelligenceContext) {
  return filterArtifactsByPermission(ctx)
    .filter((a) => a.is_historical || a.lifecycle_state === "review")
    .map((a) => ({
      artifact_id: a.id,
      display_name: a.display_name,
      reason: a.is_historical ? "Historical lifecycle state" : "Review pending",
      recommendation: "Human steward review — no automatic status change",
      advisory_only: true as const,
    }));
}
