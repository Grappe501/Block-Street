/**
 * CAE-11.1-W6 — Operational risk intelligence (alerts only)
 */
import { caeId, nowIso } from "../../../utils";
import { initiativeApplicationService } from "../services/application-service";
import { evaluateDependencyReadiness } from "../services/dependency-graph";
import { validateCharter } from "../services/charter-validator";
import type { IntelligenceConfidence, OperationalRiskSignal } from "./contracts";
import { scoreToConfidence } from "./utils";

export function detectOperationalRisks(institutionId: string): OperationalRiskSignal[] {
  const risks: OperationalRiskSignal[] = [];
  const ids = initiativeApplicationService.listInitiativeIds();

  for (const id of ids) {
    const agg = initiativeApplicationService.getAggregate(id);
    if (!agg || agg.initiative.institution_id !== institutionId) continue;
    const ini = agg.initiative;

    if (!ini.operational_owner_human_id || ini.status === "owner_required") {
      risks.push(makeRisk(id, "owner_required", "high", "Operational owner required", "No accepted operational owner is assigned.", [
        { signal_id: "owner_missing", source: "initiative_record", summary: "operational_owner_human_id empty or owner_required status" },
      ], 0.95));
    }

    if (ini.status === "at_risk") {
      risks.push(makeRisk(id, "marked_at_risk", "high", "Initiative marked at risk", "The Initiative is in an at-risk state and needs review.", [
        { signal_id: "status_at_risk", source: "lifecycle", summary: `status=${ini.status}` },
      ], 0.99));
    }

    const deps = evaluateDependencyReadiness(id, agg.dependencies);
    if (!deps.ready && ini.status === "preparation") {
      risks.push(makeRisk(id, "blocking_dependency", "medium", "Blocking dependencies remain", deps.blocking_dependencies.map((d) => d.description).join("; ") || "Dependencies not satisfied.", [
        { signal_id: "deps_blocking", source: "dependency_graph", summary: `${deps.blocking_dependencies.length} blocking` },
      ], 0.85));
    }

    const charter = validateCharter(agg, "activation");
    if (!charter.is_valid && ["preparation", "approval_pending", "active"].includes(ini.status)) {
      risks.push(makeRisk(id, "charter_incomplete", "medium", "Charter incomplete for current stage", `Missing: ${charter.missing_fields.join(", ")}`, [
        { signal_id: "charter_validation", source: "charter_validator", summary: charter.missing_fields.join(",") },
      ], 0.8));
    }

    const overdueReview = agg.reviews.some((r) => r.status === "overdue");
    if (overdueReview) {
      risks.push(makeRisk(id, "review_overdue", "medium", "Review overdue", "A scheduled review is past due.", [
        { signal_id: "review_overdue", source: "reviews", summary: "review status overdue" },
      ], 0.9));
    }
  }

  return risks.sort((a, b) => severityRank(b.severity) - severityRank(a.severity));
}

function severityRank(s: OperationalRiskSignal["severity"]) {
  return { critical: 4, high: 3, medium: 2, low: 1 }[s];
}

function makeRisk(
  initiativeId: string,
  riskType: string,
  severity: OperationalRiskSignal["severity"],
  title: string,
  explanation: string,
  evidence: OperationalRiskSignal["evidence"],
  score: number
): OperationalRiskSignal {
  return {
    risk_id: caeId("rsk"),
    risk_type: riskType,
    severity,
    title,
    explanation,
    initiative_id: initiativeId,
    evidence,
    confidence: scoreToConfidence(score),
  };
}

export function risksForInitiative(initiativeId: string, institutionId: string) {
  return detectOperationalRisks(institutionId).filter((r) => r.initiative_id === initiativeId);
}
