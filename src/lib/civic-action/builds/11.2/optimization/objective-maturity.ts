/**
 * CAE-11.2-W7 — Objective maturity model
 */
import { objectiveApplicationService } from "../application-service";
import { extractLessons } from "./lesson-engine";
import { getTemplateEvolution } from "./template-evolution";
import type { ObjectiveMaturityLevel, ObjectiveMaturityView } from "./contracts";

function levelFromScore(score: number): ObjectiveMaturityLevel {
  if (score >= 85) return "optimized";
  if (score >= 70) return "measured";
  if (score >= 55) return "managed";
  if (score >= 35) return "repeatable";
  return "emerging";
}

export function measureObjectiveMaturity(
  institutionId: string,
  initiativeId?: string
): ObjectiveMaturityView {
  let objectives = objectiveApplicationService
    .listAllObjectives()
    .filter((o) => o.institution_id === institutionId);
  if (initiativeId) objectives = objectives.filter((o) => o.initiative_id === initiativeId);

  const completed = objectives.filter((o) => ["completed", "archived"].includes(o.lifecycle_state)).length;
  const lessons = extractLessons(institutionId, initiativeId ? { initiativeId } : undefined);
  const templates = getTemplateEvolution(institutionId, initiativeId);
  const evolvedTemplates = templates.filter((t) => t.version > 1).length;

  let score = 10;
  score += Math.min(30, completed * 8);
  score += Math.min(25, lessons.length * 5);
  score += Math.min(20, evolvedTemplates * 10);
  score += objectives.some((o) => o.review_rhythm) ? 10 : 0;
  score += objectives.some((o) => o.lifecycle_state === "active") ? 5 : 0;
  score = Math.min(100, score);

  const level = levelFromScore(score);
  const explanations: Record<ObjectiveMaturityLevel, string> = {
    emerging: "Organization is beginning Objective execution — focus on first completions with lessons.",
    repeatable: "Some Objectives complete — establish lesson capture habits.",
    managed: "Execution is managed with reviews and growing institutional memory.",
    measured: "Lessons and templates evolve from measured outcomes.",
    optimized: "Continuous improvement loop active — templates and learning compound.",
  };

  return {
    institution_id: institutionId,
    level,
    score,
    completed_objectives: completed,
    lessons_captured: lessons.length,
    templates_evolved: evolvedTemplates,
    explanation: explanations[level],
  };
}
