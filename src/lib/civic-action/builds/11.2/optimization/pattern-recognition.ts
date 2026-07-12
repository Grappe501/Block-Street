/**
 * CAE-11.2-W7 — Pattern recognition (evidence-based)
 */
import { objectiveApplicationService } from "../application-service";
import { detectExecutionPatterns } from "../intelligence/pattern-engine";
import { extractLessons } from "./lesson-engine";

export type OptimizationPattern = {
  pattern_id: string;
  description: string;
  evidence: string;
  confidence: "observed" | "likely" | "strong_pattern" | "institution_standard" | "emerging";
  domain: string;
};

export function detectOptimizationPatterns(
  institutionId: string,
  initiativeId?: string
): OptimizationPattern[] {
  const patterns: OptimizationPattern[] = [];

  for (const p of detectExecutionPatterns(institutionId, initiativeId)) {
    patterns.push({
      pattern_id: p.pattern_id,
      description: p.description,
      evidence: p.evidence,
      confidence: p.confidence === "high" ? "strong_pattern" : p.confidence === "medium" ? "likely" : "observed",
      domain: "execution",
    });
  }

  const lessons = extractLessons(institutionId, initiativeId ? { initiativeId } : undefined);
  const delayLessons = lessons.filter((l) =>
    /delay|late|slip|bottleneck/i.test(l.observation + l.root_cause)
  );
  if (delayLessons.length >= 2) {
    patterns.push({
      pattern_id: "pat-repeated-delays",
      description: "Repeated delay patterns across completed Objectives.",
      evidence: `${delayLessons.length} lessons mention scheduling or dependency delays.`,
      confidence: delayLessons.length >= 4 ? "strong_pattern" : "likely",
      domain: "scheduling",
    });
  }

  let objectives = objectiveApplicationService
    .listAllObjectives()
    .filter((o) => o.institution_id === institutionId);
  if (initiativeId) objectives = objectives.filter((o) => o.initiative_id === initiativeId);

  const completed = objectives.filter((o) => o.lifecycle_state === "completed").length;
  const withLessons = lessons.length;
  if (completed > 0) {
    const rate = Math.round((withLessons / Math.max(completed, 1)) * 100);
    patterns.push({
      pattern_id: "pat-lesson-capture",
      description: `Lesson capture rate is ${rate}% among completed Objectives.`,
      evidence: `${withLessons} lessons for ${completed} completed Objectives.`,
      confidence: completed >= 3 ? "likely" : "observed",
      domain: "knowledge",
    });
  }

  const proposed = objectives.filter((o) => o.lifecycle_state === "proposed").length;
  if (proposed >= 2) {
    patterns.push({
      pattern_id: "pat-approval-bottleneck",
      description: "Multiple Objectives awaiting approval.",
      evidence: `${proposed} Objectives in proposed state.`,
      confidence: proposed >= 4 ? "strong_pattern" : "emerging",
      domain: "governance",
    });
  }

  return patterns;
}
