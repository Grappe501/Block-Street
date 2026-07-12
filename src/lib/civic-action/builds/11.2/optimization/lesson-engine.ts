/**
 * CAE-11.2-W7 — Structured lessons from completed Objectives
 */
import { caeId } from "../../../utils";
import { objectiveApplicationService } from "../application-service";
import { readStoreSlice } from "../services/repository";
import { EXECUTION_STORE_KEYS } from "../data-model";
import type { LessonLearnedRecord, OutcomeRecord } from "../data-model";
import type { OptimizationConfidence, StructuredLesson } from "./contracts";
import { inferRootCauses } from "./root-cause-service";

function confidenceFromScore(score: number): OptimizationConfidence {
  if (score >= 0.85) return "institution_standard";
  if (score >= 0.7) return "strong_pattern";
  if (score >= 0.5) return "likely";
  return "observed";
}

export function extractLessons(
  institutionId: string,
  options?: { initiativeId?: string; objectiveId?: string }
): StructuredLesson[] {
  const lessons: StructuredLesson[] = [];
  const stored = readStoreSlice<LessonLearnedRecord>(EXECUTION_STORE_KEYS.lessons_learned).filter(
    (l) => l.institution_id === institutionId
  );

  for (const record of stored) {
    if (options?.initiativeId) {
      const obj = objectiveApplicationService.getObjective(record.objective_id);
      if (!obj || obj.initiative_id !== options.initiativeId) continue;
    }
    if (options?.objectiveId && record.objective_id !== options.objectiveId) continue;

    const objective = objectiveApplicationService.getObjective(record.objective_id);
    const rootCauses = inferRootCauses(record.observation, record.category);
    lessons.push({
      lesson_id: record.canonical_id,
      objective_id: record.objective_id,
      objective_name: objective?.display_name ?? record.objective_id,
      initiative_id: objective?.initiative_id ?? "",
      observation: record.observation,
      root_cause: rootCauses.join("; ") || "Unspecified",
      recommendation: record.recommendation,
      evidence: `Lesson captured by ${record.created_by}`,
      applicability: record.applicability,
      confidence: confidenceFromScore(record.confidence),
      occurred_at: record.updated_at,
    });
  }

  let objectives = objectiveApplicationService
    .listAllObjectives()
    .filter((o) => o.institution_id === institutionId);
  if (options?.initiativeId) objectives = objectives.filter((o) => o.initiative_id === options.initiativeId);
  if (options?.objectiveId) objectives = objectives.filter((o) => o.canonical_id === options.objectiveId);

  const outcomes = readStoreSlice<OutcomeRecord>(EXECUTION_STORE_KEYS.outcomes);
  const completed = objectives.filter((o) => ["completed", "archived"].includes(o.lifecycle_state));

  for (const objective of completed) {
    const hasLesson = lessons.some((l) => l.objective_id === objective.canonical_id);
    if (hasLesson) continue;

    const objOutcomes = outcomes.filter((o) => o.objective_id === objective.canonical_id);
    const variance = objOutcomes.map((o) => o.variance).filter(Boolean).join("; ");
    const observation =
      variance ||
      `Objective ${objective.display_name} completed without documented lessons — capture retrospective.`;

    lessons.push({
      lesson_id: caeId("les"),
      objective_id: objective.canonical_id,
      objective_name: objective.display_name,
      initiative_id: objective.initiative_id,
      observation,
      root_cause: inferRootCauses(observation, "completion").join("; ") || "Documentation gap",
      recommendation: "Schedule a 30-minute retrospective and record lessons before archiving.",
      evidence: objOutcomes.length
        ? `${objOutcomes.length} outcome(s) recorded`
        : "No outcomes or lessons on file",
      applicability: "Future Objectives with similar purpose and governance",
      confidence: "emerging",
      occurred_at: objective.updated_at,
    });
  }

  return lessons.sort((a, b) => b.occurred_at.localeCompare(a.occurred_at));
}

export function generateLessonForObjective(objectiveId: string): StructuredLesson | null {
  const objective = objectiveApplicationService.getObjective(objectiveId);
  if (!objective) return null;
  const lessons = extractLessons(objective.institution_id, { objectiveId });
  return lessons[0] ?? null;
}
