/**
 * CAE-11.2-W7 — Automation discovery (never self-implements)
 */
import { nowIso } from "../../../utils";
import { objectiveApplicationService } from "../application-service";
import type { OptimizationRecommendation } from "./contracts";

export function discoverAutomationOpportunities(
  institutionId: string,
  initiativeId?: string
): OptimizationRecommendation[] {
  const recs: OptimizationRecommendation[] = [];
  let objectives = objectiveApplicationService
    .listAllObjectives()
    .filter((o) => o.institution_id === institutionId);
  if (initiativeId) objectives = objectives.filter((o) => o.initiative_id === initiativeId);

  const count = objectives.length;
  if (count >= 3) {
    recs.push({
      optimization_id: "auto-objective-status-report",
      category: "automation",
      title: "Automate Objective status rollup",
      title_es: "Automatizar informe de estado de objetivos",
      what_changed: `${count} Objectives tracked — manual status rollups are repetitive.`,
      why: "Repeated manual reporting observed across review cycles.",
      why_es: "Los informes manuales se repiten en ciclos de revisión.",
      confidence: count >= 6 ? "strong_pattern" : "emerging",
      evidence: [{ signal_id: "portfolio-size", source: "objectives", summary: `${count} Objectives` }],
      expected_benefit: "Save ~1 hour per weekly operational review.",
      possible_downside: "Automated reports may miss narrative context.",
      who_should_review: "Operations lead and data steward",
      suggested_action: "Propose automated Objective digest — Humans approve activation.",
      advisory_only: true,
      generated_at: nowIso(),
    });
  }

  let missionCount = 0;
  for (const o of objectives) {
    const bundle = objectiveApplicationService.getObjectiveBundle(o.canonical_id);
    if (bundle) missionCount += bundle.missions.length;
  }

  if (missionCount >= 10) {
    recs.push({
      optimization_id: "auto-mission-attendance",
      category: "automation",
      title: "Automate mission attendance reports",
      title_es: "Automatizar informes de asistencia",
      what_changed: `Volunteer attendance reports manually generated across ${missionCount} missions.`,
      why: "High mission volume suggests repetitive manual reporting.",
      why_es: "Alto volumen de misiones sugiere informes manuales repetitivos.",
      confidence: missionCount >= 20 ? "strong_pattern" : "emerging",
      evidence: [{ signal_id: "mission-count", source: "missions", summary: `${missionCount} missions` }],
      expected_benefit: "Reduce volunteer coordinator workload.",
      possible_downside: "Automation may miss qualitative attendance notes.",
      who_should_review: "Volunteer operations lead",
      suggested_action: "Evaluate attendance automation via W5 integration — advisory only.",
      advisory_only: true,
      generated_at: nowIso(),
    });
  }

  return recs;
}
