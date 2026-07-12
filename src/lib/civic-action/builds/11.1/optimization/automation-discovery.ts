/**
 * CAE-11.1-W7 — Automation discovery (repetitive work signals)
 */
import type { OptimizationRecommendation } from "./contracts";
import { nowIso } from "../../../utils";
import { initiativeApplicationService } from "../services/application-service";

export function discoverAutomationOpportunities(institutionId: string): OptimizationRecommendation[] {
  const count = initiativeApplicationService
    .listInitiativeIds()
    .map((id) => initiativeApplicationService.getAggregate(id))
    .filter((a) => a && a.initiative.institution_id === institutionId).length;

  const recs: OptimizationRecommendation[] = [];

  if (count >= 3) {
    recs.push({
      optimization_id: "auto-portfolio-report",
      category: "automation",
      title: "Automate portfolio status report",
      title_es: "Automatizar informe de portafolio",
      what_changed: `Portfolio has ${count} Initiatives — manual status rollups are repetitive.`,
      why: "Repeated manual reporting was observed across governance reviews.",
      why_es: "Los informes manuales se repiten en revisiones de gobernanza.",
      confidence: count >= 6 ? "strong_pattern" : "emerging",
      evidence: [{ signal_id: "portfolio-size", source: "initiatives", summary: `${count} Initiatives tracked` }],
      expected_benefit: "Save ~2 hours per weekly executive review.",
      possible_downside: "Automated reports may miss narrative context.",
      who_should_review: "Operations lead and data steward",
      suggested_action: "Propose automated portfolio digest via governed integration — Humans approve activation.",
      advisory_only: true,
      generated_at: nowIso(),
    });
  }

  recs.push({
    optimization_id: "auto-approval-reminders",
    category: "automation",
    title: "Approval reminder notifications",
    title_es: "Recordatorios de aprobación",
    what_changed: "Approval delays correlate with missing calendar reminders.",
    why: "Multiple Initiatives stall in approval_pending without nudges.",
    why_es: "Las iniciativas se estancan sin recordatorios.",
    confidence: "emerging",
    evidence: [{ signal_id: "approval-delay", source: "lifecycle", summary: "Approval_pending states observed" }],
    expected_benefit: "Reduce average approval latency.",
    possible_downside: "Notification fatigue if over-configured.",
    who_should_review: "Governance administrator",
    suggested_action: "Configure notification rules through W5 integration — advisory until accepted.",
    advisory_only: true,
    generated_at: nowIso(),
  });

  return recs;
}
