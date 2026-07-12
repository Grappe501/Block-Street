/**
 * CAE-11.1-W7 — Continuous improvement aggregation
 */
import { nowIso } from "../../../utils";
import { initiativeApplicationService } from "../services/application-service";
import type { OptimizationRecommendation } from "./contracts";
import { buildInstitutionalMemory } from "./institutional-memory";
import { analyzeGovernanceOptimization } from "./governance-optimization";
import { discoverAutomationOpportunities } from "./automation-discovery";
import { generateStrategyRecommendations } from "./strategy-engine";
import { isOptimizationRejected } from "./feedback-store";

export function generateContinuousImprovements(institutionId: string): OptimizationRecommendation[] {
  const recs: OptimizationRecommendation[] = [];

  for (const id of initiativeApplicationService.listInitiativeIds()) {
    const agg = initiativeApplicationService.getAggregate(id);
    if (!agg || agg.initiative.institution_id !== institutionId) continue;
    if (agg.initiative.status !== "completed") continue;

    const optId = `ci-lessons-${id}`;
    if (isOptimizationRejected(optId, institutionId)) continue;

    const lessons = agg.closeout?.lessons_learned;
    if (!lessons) {
      recs.push({
        optimization_id: optId,
        category: "process",
        title: `Capture lessons from ${agg.initiative.initiative_name}`,
        title_es: `Capturar lecciones de ${agg.initiative.initiative_name}`,
        what_changed: "Initiative completed without documented lessons learned.",
        why: "Institutional memory degrades when closeout lessons are empty.",
        why_es: "La memoria institucional se degrada sin lecciones documentadas.",
        confidence: "observed",
        evidence: [{ signal_id: id, source: "closeout", summary: "Completed without lessons_learned" }],
        expected_benefit: "Future Initiatives start with proven patterns.",
        possible_downside: "Retroactive lessons may be incomplete.",
        who_should_review: "Initiative owner and institution historian",
        suggested_action: "Schedule a 30-minute retrospective and update closeout record via governed command.",
        advisory_only: true,
        generated_at: nowIso(),
      });
    }
  }

  const memoryCount = buildInstitutionalMemory(institutionId).length;
  if (memoryCount > 0) {
    recs.push({
      optimization_id: "ci-memory-reuse",
      category: "knowledge",
      title: "Reuse institutional memory in new charters",
      title_es: "Reutilizar memoria institucional en nuevos estatutos",
      what_changed: `${memoryCount} searchable memory entries available.`,
      why: "Teams repeat mistakes when memory is not referenced during charter drafting.",
      why_es: "Los equipos repiten errores sin consultar la memoria.",
      confidence: memoryCount >= 3 ? "strong_pattern" : "emerging",
      evidence: [{ signal_id: "memory-count", source: "institutional_memory", summary: `${memoryCount} entries` }],
      expected_benefit: "Faster charter completion with fewer revisions.",
      possible_downside: "Over-reliance on past patterns may miss new context.",
      who_should_review: "Charter authors and initiative owners",
      suggested_action: "Search institutional memory before drafting new Initiative charters.",
      advisory_only: true,
      generated_at: nowIso(),
    });
  }

  return [
    ...recs,
    ...analyzeGovernanceOptimization(institutionId),
    ...discoverAutomationOpportunities(institutionId),
    ...generateStrategyRecommendations(institutionId),
  ];
}
