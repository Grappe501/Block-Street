/**
 * CAE-11.1-W7 — Governance optimization (approval bottlenecks, latency)
 */
import { initiativeApplicationService } from "../services/application-service";
import type { OptimizationEvidence, OptimizationRecommendation } from "./contracts";
import { nowIso } from "../../../utils";
import { isOptimizationRejected } from "./feedback-store";

export function analyzeGovernanceOptimization(institutionId: string): OptimizationRecommendation[] {
  const recs: OptimizationRecommendation[] = [];
  const ids = initiativeApplicationService.listInitiativeIds();
  let approvalPending = 0;
  let ownerRequired = 0;

  for (const id of ids) {
    const agg = initiativeApplicationService.getAggregate(id);
    if (!agg || agg.initiative.institution_id !== institutionId) continue;
    if (agg.initiative.status === "approval_pending") approvalPending++;
    if (agg.initiative.status === "owner_required") ownerRequired++;
  }

  if (approvalPending >= 2) {
    const optId = `gov-approval-bottleneck`;
    if (!isOptimizationRejected(optId, institutionId)) {
      const evidence: OptimizationEvidence[] = [
        { signal_id: "approval-pending", source: "portfolio", summary: `${approvalPending} Initiatives in approval_pending` },
      ];
      recs.push({
        optimization_id: optId,
        category: "governance",
        title: "Approval bottleneck detected",
        title_es: "Cuello de botella en aprobaciones",
        what_changed: "Multiple Initiatives are waiting for approval simultaneously.",
        why: "Decision latency increases when approvers face batch queues.",
        why_es: "La latencia de decisiones aumenta con colas de aprobación.",
        confidence: approvalPending >= 4 ? "strong_pattern" : "emerging",
        evidence,
        expected_benefit: "Batch review session could clear queue faster.",
        possible_downside: "Batch reviews may reduce deliberation time per Initiative.",
        who_should_review: "Executive approvers and institution administrators",
        suggested_action: "Schedule a governance review session for pending approvals.",
        action_href_optional: "/initiatives?mode=needs_attention",
        advisory_only: true,
        generated_at: nowIso(),
      });
    }
  }

  if (ownerRequired >= 1) {
    recs.push({
      optimization_id: "gov-owner-gap",
      category: "governance",
      title: "Ownership assignment gap",
      title_es: "Brecha en asignación de responsables",
      what_changed: `${ownerRequired} Initiative(s) lack accepted operational owners.`,
      why: "Owner-required states block execution and increase review exceptions.",
      why_es: "Sin dueño operacional, la ejecución se bloquea.",
      confidence: "observed",
      evidence: [{ signal_id: "owner-required", source: "lifecycle", summary: `${ownerRequired} owner_required` }],
      expected_benefit: "Faster activation once owners are assigned and accept.",
      possible_downside: "Rushing ownership assignment may choose wrong Human.",
      who_should_review: "Institution leadership and HR coordinators",
      suggested_action: "Review owner eligibility and propose assignments through governed workflow.",
      advisory_only: true,
      generated_at: nowIso(),
    });
  }

  return recs;
}
