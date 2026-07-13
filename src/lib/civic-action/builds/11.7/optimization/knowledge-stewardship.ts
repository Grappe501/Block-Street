/**
 * CAE-11.7-W7 — Knowledge stewardship (human approval required)
 */
import { caeId } from "../../../utils";
import { COMMUNICATION_STORE_KEYS } from "../data-model";
import { readStoreSlice } from "../services/repository";
import type { KnowledgeRecord } from "../data-model";
import { detectDuplicateConversations } from "../intelligence/duplicate-detection";
import { jaccardSimilarity, tokenize } from "../intelligence/utils";
import type { KnowledgeStewardshipRecommendation } from "./contracts";

export function generateKnowledgeStewardshipRecommendations(
  institutionId: string,
  initiativeId?: string
): KnowledgeStewardshipRecommendation[] {
  const recs: KnowledgeStewardshipRecommendation[] = [];
  let knowledge = readStoreSlice<KnowledgeRecord>(COMMUNICATION_STORE_KEYS.knowledge).filter(
    (k) => k.institution_id === institutionId && k.lifecycle_state === "active"
  );
  if (initiativeId) knowledge = knowledge.filter((k) => k.initiative_id === initiativeId);

  const staleThresholdMs = 180 * 24 * 60 * 60 * 1000;
  for (const k of knowledge) {
    const ageMs = Date.now() - new Date(k.updated_at).getTime();
    if (ageMs > staleThresholdMs) {
      recs.push({
        recommendation_id: caeId("ksr"),
        type: "outdated",
        knowledge_id: k.canonical_id,
        summary: `"${k.display_name}" not updated in 180+ days.`,
        suggested_action: "Review for archival or refresh with current mission context.",
        human_approval_required: true,
        advisory_only: true,
      });
    }
  }

  for (let i = 0; i < knowledge.length; i++) {
    for (let j = i + 1; j < knowledge.length; j++) {
      const a = knowledge[i]!;
      const b = knowledge[j]!;
      const sim = jaccardSimilarity(tokenize(a.knowledge_text), tokenize(b.knowledge_text));
      if (sim >= 0.7) {
        recs.push({
          recommendation_id: caeId("ksr"),
          type: "duplicate",
          knowledge_id: a.canonical_id,
          related_id_optional: b.canonical_id,
          summary: `High similarity (${Math.round(sim * 100)}%) between "${a.display_name}" and "${b.display_name}".`,
          suggested_action: "Merge or cross-reference — requires steward approval.",
          human_approval_required: true,
          advisory_only: true,
        });
      }
    }
  }

  const dupConversations = detectDuplicateConversations(institutionId, initiativeId, 0.75);
  for (const d of dupConversations.slice(0, 2)) {
    recs.push({
      recommendation_id: caeId("ksr"),
      type: "conflicting",
      knowledge_id: d.conversation_id_a,
      related_id_optional: d.conversation_id_b,
      summary: `Conflicting conversation threads: ${d.name_a} ↔ ${d.name_b}.`,
      suggested_action: "Reconcile or document divergence — human approval required.",
      human_approval_required: true,
      advisory_only: true,
    });
  }

  return recs;
}
