/**
 * CAE-11.7-W7 — Executive improvement brief (5-minute read)
 */
import { caeId } from "../../../utils";
import type { ExecutiveImprovementBrief } from "./contracts";
import { extractLessons } from "./lesson-engine";
import { generateContinuousImprovements } from "./continuous-improvement";
import { identifyTrainingNeeds } from "./organizational-learning";
import { getTemplateEvolution } from "./template-evolution";
import { getPlaybookEvolution, getPlaybookRecommendations } from "./playbook-evolution";
import { measureCommunicationHealthOptimization } from "./communication-health-optimization";

export function buildExecutiveImprovementBrief(
  institutionId: string,
  initiativeId?: string
): ExecutiveImprovementBrief {
  const lessons = extractLessons(institutionId, initiativeId ? { initiativeId } : undefined);
  const improvements = generateContinuousImprovements(institutionId, initiativeId ? { initiativeId } : undefined);
  const health = measureCommunicationHealthOptimization(institutionId, initiativeId);
  const templates = getTemplateEvolution(institutionId, initiativeId);
  const playbooks = getPlaybookRecommendations(institutionId, initiativeId);

  const whatWeLearned =
    lessons.length > 0
      ? lessons.slice(0, 5).map((l) => `${l.source_name}: ${l.observation.slice(0, 120)}`)
      : ["Awaiting archived conversations with documented lessons."];

  const attention = health
    .filter((h) => h.state === "critical" || h.state === "attention")
    .map((h) => `${h.label}: ${h.explanation}`);

  const templateUpdates = templates
    .filter((t) => t.version > 1)
    .map((t) => `${t.template_name} v${t.version} — ${t.lessons_applied[0] ?? "evolving"}`);

  return {
    brief_id: caeId("cbrief"),
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
      : ["Templates awaiting first archived conversation lessons."],
    playbook_updates: playbooks.length ? playbooks : ["Playbooks awaiting lesson accumulation."],
    reading_time_minutes: 5,
  };
}
