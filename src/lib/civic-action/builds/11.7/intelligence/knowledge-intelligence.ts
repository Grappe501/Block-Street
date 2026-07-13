/**
 * CAE-11.7-W6 — Knowledge intelligence (emerging FAQs, playbooks)
 */
import { communicationApplicationService } from "../application-service";
import { tokenize } from "./utils";

export type EmergingFaq = {
  faq_id: string;
  question_theme: string;
  occurrence_count: number;
  sample_excerpt: string;
  confidence: "high" | "medium" | "low";
};

export type PlaybookSuggestion = {
  playbook_id: string;
  title: string;
  source_conversation_ids: string[];
  rationale: string;
};

export function detectEmergingFaqs(institutionId: string, initiativeId?: string): EmergingFaq[] {
  const themeCounts = new Map<string, { count: number; excerpt: string }>();
  let conversations = communicationApplicationService
    .listAllConversations()
    .filter((c) => c.institution_id === institutionId);
  if (initiativeId) conversations = conversations.filter((c) => c.initiative_id === initiativeId);

  for (const conv of conversations) {
    const bundle = communicationApplicationService.getConversationBundle(conv.canonical_id);
    if (!bundle) continue;
    for (const msg of bundle.messages) {
      if (!msg.body.includes("?")) continue;
      const tokens = [...tokenize(msg.body)].slice(0, 3).join(" ");
      if (!tokens) continue;
      const existing = themeCounts.get(tokens) ?? { count: 0, excerpt: msg.body.slice(0, 80) };
      existing.count++;
      themeCounts.set(tokens, existing);
    }
  }

  return [...themeCounts.entries()]
    .filter(([, v]) => v.count >= 2)
    .map(([theme, v]) => ({
      faq_id: `faq-${theme.replace(/\s+/g, "-")}`,
      question_theme: theme,
      occurrence_count: v.count,
      sample_excerpt: v.excerpt,
      confidence: v.count >= 4 ? "high" : "medium",
    }));
}

export function suggestPlaybooks(institutionId: string, initiativeId?: string): PlaybookSuggestion[] {
  const knowledge = initiativeId
    ? communicationApplicationService.listKnowledgeByInitiative(initiativeId)
    : communicationApplicationService
        .listAllConversations()
        .filter((c) => c.institution_id === institutionId)
        .flatMap((c) => communicationApplicationService.listKnowledgeByInitiative(c.initiative_id));

  const unique = new Map(knowledge.map((k) => [k.canonical_id, k]));
  if (unique.size === 0) {
    return [
      {
        playbook_id: "pb-default-onboarding",
        title: "Conversation onboarding checklist",
        source_conversation_ids: [],
        rationale: "No published knowledge yet — start with a standard onboarding playbook.",
      },
    ];
  }

  return [...unique.values()].slice(0, 5).map((k) => ({
    playbook_id: `pb-${k.canonical_id}`,
    title: k.display_name,
    source_conversation_ids: k.source_conversation_id ? [k.source_conversation_id] : [],
    rationale: "Recurring knowledge artifact suitable for playbook promotion.",
  }));
}
