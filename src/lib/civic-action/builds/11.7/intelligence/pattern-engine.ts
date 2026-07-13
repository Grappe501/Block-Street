/**
 * CAE-11.7-W6 — Pattern recognition (repeated questions, duplicate conversations)
 */
import { detectEmergingFaqs } from "./knowledge-intelligence";
import { detectDuplicateConversations } from "./duplicate-detection";

export type CommunicationPattern = {
  pattern_id: string;
  pattern_type: "repeated_question" | "duplicate_conversation" | "collaboration_flow";
  description: string;
  evidence: string;
  confidence: "high" | "medium" | "low";
};

export function detectCommunicationPatterns(institutionId: string, initiativeId?: string): CommunicationPattern[] {
  const patterns: CommunicationPattern[] = [];

  const faqs = detectEmergingFaqs(institutionId, initiativeId);
  for (const faq of faqs.slice(0, 5)) {
    patterns.push({
      pattern_id: faq.faq_id,
      pattern_type: "repeated_question",
      description: `Repeated question theme: "${faq.question_theme}"`,
      evidence: `Observed ${faq.occurrence_count} times. Sample: ${faq.sample_excerpt}`,
      confidence: faq.confidence,
    });
  }

  const dupes = detectDuplicateConversations(institutionId, initiativeId, 0.6).slice(0, 3);
  for (const d of dupes) {
    patterns.push({
      pattern_id: `pat-dup-${d.conversation_id_a}-${d.conversation_id_b}`,
      pattern_type: "duplicate_conversation",
      description: `Possible duplicate conversations: ${d.name_a} ↔ ${d.name_b}`,
      evidence: d.similarity_label,
      confidence: d.confidence === "very_high" || d.confidence === "high" ? "high" : "medium",
    });
  }

  return patterns;
}
