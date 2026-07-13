/**
 * CAE-11.12-W7 — Continuous improvement aggregation (consumes W6 intelligence)
 */
import { nowIso } from "../../../utils";
import { toIntelligenceContext } from "../intelligence/api-context";
import { knowledgeIntelligenceService } from "../intelligence";
import { DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT } from "../ux/experience-context";
import type { KnowledgeOptimization } from "./contracts";
import { isOptimizationRejected } from "./feedback-store";
import { createImprovementCandidate } from "./improvement-governance";

function defaultCtx(institutionId: string) {
  return toIntelligenceContext({
    actor_human_id: DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.actor_human_id,
    service_identity_id_optional: null,
    institution_id: institutionId,
    institution_membership_id: DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.active_membership_id,
    initiative_id_optional: DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.initiative_id_optional,
    request_id: "opt-continuous",
    correlation_id: "opt-continuous",
    idempotency_key_optional: null,
    locale: "en",
    timezone: "America/Chicago",
    effective_permissions: DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.permissions,
  });
}

export function generateContinuousImprovements(institutionId: string): KnowledgeOptimization[] {
  const ctx = defaultCtx(institutionId);
  const recs: KnowledgeOptimization[] = [];

  const health = knowledgeIntelligenceService.getHealth(ctx);
  if (health.overall_band !== "healthy") {
    const optId = "opt-knw-health-review";
    if (!isOptimizationRejected(optId, institutionId)) {
      recs.push({
        optimization_id: optId,
        category: "knowledge_health",
        title: "Address knowledge health findings",
        what_changed: `Health band: ${health.overall_band}`,
        why: "Weak evidence, conflicts, or overdue reviews weaken institutional guidance.",
        confidence: "high",
        evidence: [{ signal_id: health.snapshot_id, source: "knowledge_health", summary: health.overall_band }],
        expected_benefit: "Improved accuracy and trust in institutional knowledge.",
        potential_risk: "Review workload may increase temporarily.",
        who_should_review: "Knowledge steward",
        suggested_action: "Create improvement candidate and assign steward review.",
        domain_command_required: "SubmitKnowledgeArtifactForReview",
        human_approval_required: true,
        advisory_only: true,
        generated_at: nowIso(),
      });
      createImprovementCandidate({
        institution_id: institutionId,
        candidate_type: "knowledge_revision",
        source_type: "knowledge_health",
        source_id: health.snapshot_id,
        title: "Knowledge health review required",
        problem_statement: `Knowledge health band is ${health.overall_band}`,
        evidence_references: [{ signal_id: health.snapshot_id, source: "health", summary: health.overall_band }],
        identified_by_service: "KNW-OPT-001",
      });
    }
  }

  const gaps = knowledgeIntelligenceService.getGaps(ctx);
  for (const gap of gaps.slice(0, 3)) {
    const optId = `opt-gap-${gap.gap_id}`;
    if (isOptimizationRejected(optId, institutionId)) continue;
    recs.push({
      optimization_id: optId,
      category: "documentation_gap",
      title: gap.description,
      what_changed: gap.gap_type,
      why: gap.recommended_response,
      confidence: gap.confidence,
      evidence: gap.evidence.map((e, i) => ({ signal_id: `${gap.gap_id}-${i}`, source: "gap", summary: e })),
      expected_benefit: "Reduced repeated unanswered questions.",
      potential_risk: "New content requires steward review before publication.",
      who_should_review: "Knowledge steward",
      suggested_action: gap.recommended_response,
      domain_command_required: "CreateKnowledgeArtifact",
      human_approval_required: true,
      advisory_only: true,
      generated_at: nowIso(),
    });
  }

  const contradictions = knowledgeIntelligenceService.run(ctx, {
    request_type: "knowledge_query",
    purpose: "contradiction_scan",
    query: "conflict",
  });
  if (contradictions.conflicting_evidence.length > 0) {
    const optId = "opt-knw-contradiction";
    if (!isOptimizationRejected(optId, institutionId)) {
      recs.push({
        optimization_id: optId,
        category: "contradiction",
        title: "Resolve conflicting guidance",
        what_changed: "Multiple current artifacts may conflict.",
        why: "Conflicting guidance creates operational risk.",
        confidence: "medium",
        evidence: contradictions.evidence_references.map((e) => ({
          signal_id: e.signal_id,
          source: e.source_type,
          summary: e.summary,
        })),
        expected_benefit: "Single authoritative current guidance.",
        potential_risk: "Resolution may require retiring or superseding artifacts.",
        who_should_review: "Knowledge steward and subject expert",
        suggested_action: "Create contradiction resolution proposal.",
        domain_command_required: null,
        human_approval_required: true,
        advisory_only: true,
        generated_at: nowIso(),
      });
    }
  }

  return recs;
}
