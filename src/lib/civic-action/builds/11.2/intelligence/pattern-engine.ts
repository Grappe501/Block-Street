/**
 * CAE-11.2-W6 — Pattern recognition (evidence-based)
 */
import { objectiveApplicationService } from "../application-service";

export type ExecutionPattern = {
  pattern_id: string;
  description: string;
  evidence: string;
  confidence: "high" | "medium" | "low";
};

export function detectExecutionPatterns(institutionId: string, initiativeId?: string): ExecutionPattern[] {
  const patterns: ExecutionPattern[] = [];
  let objectives = objectiveApplicationService.listAllObjectives().filter((o) => o.institution_id === institutionId);
  if (initiativeId) objectives = objectives.filter((o) => o.initiative_id === initiativeId);

  let totalMissions = 0;
  let completedMissions = 0;
  for (const o of objectives) {
    const bundle = objectiveApplicationService.getObjectiveBundle(o.canonical_id);
    if (!bundle) continue;
    totalMissions += bundle.missions.length;
    completedMissions += bundle.missions.filter((m) => m.lifecycle_state === "completed").length;
  }

  if (totalMissions > 0) {
    const rate = Math.round((completedMissions / totalMissions) * 100);
    patterns.push({
      pattern_id: "pat-mission-completion",
      description: `Mission completion rate is ${rate}% across scoped Objectives.`,
      evidence: `${completedMissions} of ${totalMissions} missions completed.`,
      confidence: totalMissions >= 5 ? "high" : "medium",
    });
  }

  const withReviews = objectives.filter((o) => o.review_rhythm).length;
  if (withReviews > 0) {
    patterns.push({
      pattern_id: "pat-review-rhythm",
      description: "Objectives with defined review rhythms show more consistent execution tracking.",
      evidence: `${withReviews} objectives define review rhythm.`,
      confidence: "medium",
    });
  }

  return patterns;
}
