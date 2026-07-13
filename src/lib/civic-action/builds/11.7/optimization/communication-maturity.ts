/**
 * CAE-11.7-W7 — Communication maturity model (5 levels)
 */
import { communicationApplicationService } from "../application-service";
import { extractLessons } from "./lesson-engine";
import { getTemplateEvolution } from "./template-evolution";
import { getPlaybookEvolution } from "./playbook-evolution";
import type { CommunicationMaturityView, MaturityLevel } from "./contracts";

function levelFromScore(score: number): MaturityLevel {
  if (score >= 85) return "adaptive";
  if (score >= 70) return "optimized";
  if (score >= 55) return "established";
  if (score >= 35) return "developing";
  return "foundational";
}

export function measureCommunicationMaturity(
  institutionId: string,
  initiativeId?: string
): CommunicationMaturityView {
  let conversations = communicationApplicationService
    .listAllConversations()
    .filter((c) => c.institution_id === institutionId);
  if (initiativeId) conversations = conversations.filter((c) => c.initiative_id === initiativeId);

  const archived = conversations.filter((c) => c.lifecycle_state === "archived").length;
  const lessons = extractLessons(institutionId, initiativeId ? { initiativeId } : undefined);
  const templates = getTemplateEvolution(institutionId, initiativeId);
  const evolvedTemplates = templates.filter((t) => t.version > 1).length;
  const playbooks = getPlaybookEvolution(institutionId, initiativeId);
  const activePlaybooks = playbooks.filter((p) => p.status !== "draft").length;

  let score = 10;
  score += Math.min(25, archived * 8);
  score += Math.min(25, lessons.length * 5);
  score += Math.min(20, evolvedTemplates * 8);
  score += Math.min(15, activePlaybooks * 5);
  score += conversations.some((c) => c.lifecycle_state === "active") ? 5 : 0;
  score = Math.min(100, score);

  const level = levelFromScore(score);
  const explanations: Record<MaturityLevel, string> = {
    foundational: "Organization is beginning communication operations — focus on first archives with lessons.",
    developing: "Some conversations archive — establish lesson capture habits.",
    established: "Communications are managed with reviews and growing institutional memory.",
    optimized: "Lessons and templates evolve from measured collaboration outcomes.",
    adaptive: "Continuous improvement loop active — templates and playbooks compound.",
  };

  return {
    institution_id: institutionId,
    level,
    score,
    archived_conversations: archived,
    lessons_captured: lessons.length,
    templates_evolved: evolvedTemplates,
    playbooks_active: activePlaybooks,
    explanation: explanations[level],
  };
}
