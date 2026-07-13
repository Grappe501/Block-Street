/**
 * CAE-11.7-W6 — Duplicate conversation detection (advisory)
 */
import { communicationApplicationService } from "../application-service";
import type { DuplicateConversationCandidate, IntelligenceConfidence } from "./contracts";
import { jaccardSimilarity, scoreToConfidence, similarityLabel, tokenize } from "./utils";

function conversationText(conversationId: string) {
  const c = communicationApplicationService.getConversation(conversationId);
  if (!c) return null;
  const text = `${c.display_name} ${c.purpose}`;
  return { name: c.display_name, tokens: tokenize(text), institution_id: c.institution_id, initiative_id: c.initiative_id };
}

export function detectDuplicateConversations(
  institutionId: string,
  initiativeId?: string,
  minScore = 0.55
): DuplicateConversationCandidate[] {
  let ids = communicationApplicationService
    .listAllConversations()
    .filter((c) => c.institution_id === institutionId && c.lifecycle_state !== "archived")
    .map((c) => c.canonical_id);
  if (initiativeId) {
    ids = ids.filter((id) => communicationApplicationService.getConversation(id)?.initiative_id === initiativeId);
  }

  const candidates: DuplicateConversationCandidate[] = [];
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const a = conversationText(ids[i]);
      const b = conversationText(ids[j]);
      if (!a || !b) continue;

      const nameSim = jaccardSimilarity(tokenize(a.name), tokenize(b.name));
      const textSim = jaccardSimilarity(a.tokens, b.tokens);
      const score = nameSim * 0.4 + textSim * 0.6;
      if (score < minScore) continue;

      const confidence: IntelligenceConfidence = scoreToConfidence(score);
      const shared: string[] = [];
      if (nameSim > 0.5) shared.push("similar_name");
      if (textSim > 0.5) shared.push("similar_purpose");

      candidates.push({
        conversation_id_a: ids[i],
        conversation_id_b: ids[j],
        name_a: a.name,
        name_b: b.name,
        similarity_score: Math.round(score * 100) / 100,
        similarity_label: similarityLabel(score),
        shared_signals: shared,
        confidence,
        compare_href: `/communications?compare=${ids[i]}&with=${ids[j]}`,
      });
    }
  }
  return candidates.sort((x, y) => y.similarity_score - x.similarity_score);
}

export function duplicatesForConversation(conversationId: string, institutionId: string) {
  const c = communicationApplicationService.getConversation(conversationId);
  if (!c) return [];
  return detectDuplicateConversations(institutionId, c.initiative_id, 0.5).filter(
    (d) => d.conversation_id_a === conversationId || d.conversation_id_b === conversationId
  );
}
