/**
 * CAE-11.2-W7 — Executive improvement brief
 */
import { caeId } from "../../../utils";
import type { ExecutiveImprovementBrief } from "./contracts";
import { extractLessons } from "./lesson-engine";
import { generateContinuousImprovements } from "./continuous-improvement";
import { identifyTrainingNeeds } from "./training-optimization";
import { getTemplateEvolution } from "./template-evolution";
import { measureOrganizationHealth } from "./organization-health";
import { generateStrategicLearning } from "./strategic-learning";

export function buildExecutiveImprovementBrief(
  institutionId: string,
  initiativeId?: string
): ExecutiveImprovementBrief {
  const lessons = extractLessons(institutionId, initiativeId ? { initiativeId } : undefined);
  const improvements = generateContinuousImprovements(institutionId, initiativeId ? { initiativeId } : undefined);
  const health = measureOrganizationHealth(institutionId, initiativeId);
  const templates = getTemplateEvolution(institutionId, initiativeId);
  const strategic = generateStrategicLearning(institutionId, initiativeId);

  const whatWeLearned =
    lessons.length > 0
      ? lessons.slice(0, 5).map((l) => `${l.objective_name}: ${l.observation.slice(0, 120)}`)
      : ["Awaiting completed Objectives with documented lessons."];

  const attention = health
    .filter((h) => h.state === "critical" || h.state === "attention")
    .map((h) => `${h.label}: ${h.explanation}`);

  const templateUpdates = templates
    .filter((t) => t.version > 1)
    .map((t) => `${t.template_name} v${t.version} — ${t.lessons_applied[0] ?? "evolving"}`);

  return {
    brief_id: caeId("obrief"),
    what_we_learned: whatWeLearned,
    what_improved: improvements
      .filter((i) => i.category === "knowledge" || i.category === "template")
      .slice(0, 3)
      .map((i) => i.title),
    needs_attention: attention.length ? attention : ["No critical health dimensions flagged."],
    recommended_changes: improvements.slice(0, 5),
    training_needed: identifyTrainingNeeds(institutionId, initiativeId),
    template_updates: templateUpdates.length
      ? templateUpdates
      : ["Templates awaiting first completed Objective lessons."],
    strategic_opportunities: strategic.map((s) => s.title),
    reading_time_minutes: 5,
  };
}
