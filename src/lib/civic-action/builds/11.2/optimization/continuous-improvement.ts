/**
 * CAE-11.2-W7 — Continuous improvement aggregation
 */
import { nowIso } from "../../../utils";
import { objectiveApplicationService } from "../application-service";
import { readStoreSlice } from "../services/repository";
import { EXECUTION_STORE_KEYS } from "../data-model";
import type { LessonLearnedRecord } from "../data-model";
import type { OptimizationRecommendation } from "./contracts";
import { buildInstitutionalMemory } from "./institutional-memory";
import { extractLessons } from "./lesson-engine";
import { analyzeGovernanceOptimization } from "./governance-optimization";
import { analyzeWorkflowOptimization } from "./workflow-optimization";
import { discoverAutomationOpportunities } from "./automation-discovery";
import { generateStrategicLearning } from "./strategic-learning";
import { isOptimizationRejected } from "./feedback-store";

export function generateContinuousImprovements(
  institutionId: string,
  options?: { initiativeId?: string; objectiveId?: string }
): OptimizationRecommendation[] {
  const recs: OptimizationRecommendation[] = [];
  const initiativeId = options?.initiativeId;

  let objectives = objectiveApplicationService
    .listAllObjectives()
    .filter((o) => o.institution_id === institutionId);
  if (initiativeId) objectives = objectives.filter((o) => o.initiative_id === initiativeId);
  if (options?.objectiveId) objectives = objectives.filter((o) => o.canonical_id === options.objectiveId);

  for (const objective of objectives) {
    if (!["completed", "archived"].includes(objective.lifecycle_state)) continue;

    const optId = `ci-lessons-${objective.canonical_id}`;
    if (isOptimizationRejected(optId, institutionId)) continue;

    const hasStoredLesson = readStoreSlice<LessonLearnedRecord>(EXECUTION_STORE_KEYS.lessons_learned).some(
      (l) => l.objective_id === objective.canonical_id
    );
    if (!hasStoredLesson) {
      recs.push({
        optimization_id: optId,
        category: "lesson",
        title: `Capture lessons from ${objective.display_name}`,
        title_es: `Capturar lecciones de ${objective.display_name}`,
        what_changed: "Objective completed without formally stored lessons learned.",
        why: "Institutional memory degrades when completion lacks documented learning.",
        why_es: "La memoria institucional se degrada sin lecciones documentadas.",
        confidence: "observed",
        evidence: [{ signal_id: objective.canonical_id, source: "lifecycle", summary: "Completed without canonical lesson" }],
        expected_benefit: "Future Objectives start with proven patterns.",
        possible_downside: "Retroactive lessons may be incomplete.",
        who_should_review: "Objective owner and institution historian",
        suggested_action: "Schedule retrospective and record lessons via governed command.",
        objective_id_optional: objective.canonical_id,
        initiative_id_optional: objective.initiative_id,
        advisory_only: true,
        generated_at: nowIso(),
      });
    }
  }

  const memoryCount = buildInstitutionalMemory(institutionId, initiativeId ? { initiativeId } : undefined).length;
  if (memoryCount > 0) {
    const memOptId = "ci-memory-reuse";
    if (!isOptimizationRejected(memOptId, institutionId)) {
      recs.push({
        optimization_id: memOptId,
        category: "knowledge",
        title: "Reuse institutional memory in new Objectives",
        title_es: "Reutilizar memoria institucional en nuevos objetivos",
        what_changed: `${memoryCount} searchable memory entries available.`,
        why: "Teams repeat mistakes when memory is not referenced during Objective planning.",
        why_es: "Los equipos repiten errores sin consultar la memoria.",
        confidence: memoryCount >= 3 ? "strong_pattern" : "emerging",
        evidence: [{ signal_id: "memory-count", source: "institutional_memory", summary: `${memoryCount} entries` }],
        expected_benefit: "Faster Objective planning with fewer revisions.",
        possible_downside: "Over-reliance on past patterns may miss new context.",
        who_should_review: "Objective authors and operational owners",
        suggested_action: "Search institutional memory before drafting new Objectives.",
        advisory_only: true,
        generated_at: nowIso(),
      });
    }
  }

  return [
    ...recs,
    ...analyzeGovernanceOptimization(institutionId, initiativeId),
    ...analyzeWorkflowOptimization(institutionId, initiativeId),
    ...discoverAutomationOpportunities(institutionId, initiativeId),
    ...generateStrategicLearning(institutionId, initiativeId),
  ];
}

export function analyzeObjectiveCompletion(objectiveId: string): OptimizationRecommendation[] {
  const objective = objectiveApplicationService.getObjective(objectiveId);
  if (!objective) return [];
  return generateContinuousImprovements(objective.institution_id, {
    initiativeId: objective.initiative_id,
    objectiveId,
  });
}
