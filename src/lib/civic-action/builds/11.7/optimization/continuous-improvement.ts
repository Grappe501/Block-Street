/**
 * CAE-11.7-W7 — Continuous improvement aggregation
 */
import { nowIso } from "../../../utils";
import { communicationApplicationService } from "../application-service";
import { COMMUNICATION_STORE_KEYS } from "../data-model";
import { readStoreSlice } from "../services/repository";
import type { KnowledgeRecord } from "../data-model";
import type { CommunicationOptimization } from "./contracts";
import { extractLessons } from "./lesson-engine";
import { isOptimizationRejected } from "./feedback-store";
import { analyzeCollaborationOptimization } from "./collaboration-optimization";
import { analyzeDocumentationOptimization } from "./documentation-optimization";
import { generateOrganizationalLearning } from "./organizational-learning";
import { analyzeTranslationLearning } from "./translation-learning";

export function generateContinuousImprovements(
  institutionId: string,
  options?: { initiativeId?: string; conversationId?: string }
): CommunicationOptimization[] {
  const recs: CommunicationOptimization[] = [];
  const initiativeId = options?.initiativeId;

  let conversations = communicationApplicationService
    .listAllConversations()
    .filter((c) => c.institution_id === institutionId);
  if (initiativeId) conversations = conversations.filter((c) => c.initiative_id === initiativeId);
  if (options?.conversationId) conversations = conversations.filter((c) => c.canonical_id === options.conversationId);

  const lessons = extractLessons(institutionId, initiativeId ? { initiativeId } : undefined);
  const archived = conversations.filter((c) => c.lifecycle_state === "archived");

  for (const conversation of archived) {
    const hasLesson = lessons.some((l) => l.source_id === conversation.canonical_id);
    if (hasLesson) continue;

    const optId = `ci-conv-lessons-${conversation.canonical_id}`;
    if (isOptimizationRejected(optId, institutionId)) continue;

    recs.push({
      optimization_id: optId,
      category: "lesson",
      title: `Capture lessons from ${conversation.display_name}`,
      title_es: `Capturar lecciones de ${conversation.display_name}`,
      what_changed: "Conversation archived without formally stored lessons.",
      why: "Institutional memory degrades when archive lacks documented learning.",
      why_es: "La memoria institucional se degrada sin lecciones documentadas.",
      confidence: "observed",
      evidence: [{ signal_id: conversation.canonical_id, source: "lifecycle", summary: "Archived without lesson" }],
      expected_benefit: "Future conversations start with proven coordination patterns.",
      potential_risk: "Retroactive lessons may be incomplete.",
      who_should_review: "Conversation owner and mission lead",
      suggested_action: "Schedule retrospective and record lessons via governed command.",
      conversation_id_optional: conversation.canonical_id,
      initiative_id_optional: conversation.initiative_id,
      advisory_only: true,
      generated_at: nowIso(),
    });
  }

  const knowledge = readStoreSlice<KnowledgeRecord>(COMMUNICATION_STORE_KEYS.knowledge).filter(
    (k) => k.institution_id === institutionId
  );
  if (knowledge.length > 0) {
    const memOptId = "ci-knowledge-reuse";
    if (!isOptimizationRejected(memOptId, institutionId)) {
      recs.push({
        optimization_id: memOptId,
        category: "knowledge",
        title: "Reuse institutional knowledge in new conversations",
        title_es: "Reutilizar conocimiento institucional",
        what_changed: `${knowledge.length} knowledge artifacts available for reference.`,
        why: "Teams repeat mistakes when knowledge is not referenced during planning.",
        why_es: "Los equipos repiten errores sin consultar el conocimiento.",
        confidence: knowledge.length >= 3 ? "strong_pattern" : "emerging",
        evidence: [{ signal_id: "knowledge-count", source: "knowledge_store", summary: `${knowledge.length} entries` }],
        expected_benefit: "Faster conversation setup with fewer coordination revisions.",
        potential_risk: "Over-reliance on past patterns may miss new context.",
        who_should_review: "Mission leads and knowledge stewards",
        suggested_action: "Search knowledge explorer before starting new mission conversations.",
        advisory_only: true,
        generated_at: nowIso(),
      });
    }
  }

  return [
    ...recs,
    ...analyzeCollaborationOptimization(institutionId, initiativeId),
    ...analyzeDocumentationOptimization(institutionId, initiativeId),
    ...generateOrganizationalLearning(institutionId, initiativeId),
    ...analyzeTranslationLearning(institutionId, initiativeId),
  ];
}

export function analyzeCommunicationCompletion(conversationId: string): CommunicationOptimization[] {
  const conversation = communicationApplicationService.getConversation(conversationId);
  if (!conversation) return [];
  return generateContinuousImprovements(conversation.institution_id, {
    initiativeId: conversation.initiative_id,
    conversationId,
  });
}
