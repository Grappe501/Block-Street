/**
 * CAE-11.2-W7 — Strategic learning for executives
 */
import { nowIso } from "../../../utils";
import { objectiveApplicationService } from "../application-service";
import { detectExecutionRisks } from "../intelligence/risk-intelligence";
import { detectOptimizationPatterns } from "./pattern-recognition";
import type { OptimizationRecommendation } from "./contracts";

export function generateStrategicLearning(
  institutionId: string,
  initiativeId?: string
): OptimizationRecommendation[] {
  const recs: OptimizationRecommendation[] = [];
  const patterns = detectOptimizationPatterns(institutionId, initiativeId);
  const risks = detectExecutionRisks(institutionId, initiativeId);

  const delayPattern = patterns.find((p) => p.pattern_id === "pat-repeated-delays");
  if (delayPattern) {
    recs.push({
      optimization_id: "strat-delay-investment",
      category: "strategy",
      title: "Invest in scheduling and dependency management",
      title_es: "Invertir en gestión de dependencias",
      what_changed: delayPattern.description,
      why: "Repeated delays signal systemic scheduling risk.",
      why_es: "Retrasos repetidos indican riesgo sistémico.",
      confidence: delayPattern.confidence,
      evidence: [{ signal_id: delayPattern.pattern_id, source: "patterns", summary: delayPattern.evidence }],
      expected_benefit: "Future Objectives start with realistic timelines.",
      possible_downside: "Additional planning overhead upfront.",
      who_should_review: "Executive planning committee",
      suggested_action: "Add dependency review gate to Objective charter template.",
      advisory_only: true,
      generated_at: nowIso(),
    });
  }

  const highRisks = risks.filter((r) => r.severity === "high");
  if (highRisks.length > 0) {
    recs.push({
      optimization_id: "strat-capacity-gap",
      category: "strategy",
      title: "Resource gap — capacity risks emerging",
      title_es: "Brecha de recursos — riesgos de capacidad",
      what_changed: `${highRisks.length} high-severity execution risks detected.`,
      why: "Portfolio may exceed current volunteer and owner capacity.",
      why_es: "El portafolio puede exceder la capacidad actual.",
      confidence: "likely",
      evidence: highRisks.slice(0, 3).map((r) => ({
        signal_id: r.risk_id,
        source: "risk_intelligence",
        summary: r.explanation,
      })),
      expected_benefit: "Prevent cascade failures across Objectives.",
      possible_downside: "Pausing Objectives may slow momentum.",
      who_should_review: "Executive owners",
      suggested_action: "Review portfolio capacity before launching new Objectives.",
      advisory_only: true,
      generated_at: nowIso(),
    });
  }

  let objectives = objectiveApplicationService
    .listAllObjectives()
    .filter((o) => o.institution_id === institutionId);
  if (initiativeId) objectives = objectives.filter((o) => o.initiative_id === initiativeId);

  const completed = objectives.filter((o) => o.lifecycle_state === "completed").length;
  if (completed >= 3) {
    recs.push({
      optimization_id: "strat-template-expansion",
      category: "strategy",
      title: "Expand proven Objective templates regionally",
      title_es: "Expandir plantillas probadas regionalmente",
      what_changed: `${completed} completed Objectives provide institutional proof points.`,
      why: "Successful patterns can accelerate new geography launches.",
      why_es: "Patrones exitosos pueden acelerar lanzamientos regionales.",
      confidence: "emerging",
      evidence: [{ signal_id: "completed-count", source: "objectives", summary: `${completed} completed` }],
      expected_benefit: "Faster replication with lower failure rate.",
      possible_downside: "Local context may differ from template assumptions.",
      who_should_review: "Regional leads and executive council",
      suggested_action: "Select top-performing Objective template for pilot expansion.",
      advisory_only: true,
      generated_at: nowIso(),
    });
  }

  return recs;
}
