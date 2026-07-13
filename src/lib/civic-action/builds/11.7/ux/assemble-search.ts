/**
 * CAE-11.7-W4 — Natural language search stub
 */
import type { ConversationRecord, DecisionRecord, DocumentRecord } from "../data-model";
import { COMMUNICATION_STORE_KEYS } from "../data-model";
import { readStoreSlice } from "../services/repository";
import type { CommunicationExperienceContext } from "./experience-context";
import { assembleCollaborationWorkbenchShell } from "./assemble-workbench-shell";
import { t } from "./locale";
import type { CommunicationSearchView } from "./view-models";

function parseSemanticIntent(query: string): string {
  const lower = query.toLowerCase();
  if (lower.includes("decision")) return "decisions";
  if (lower.includes("meeting") || lower.includes("reunion")) return "meetings";
  if (lower.includes("document")) return "documents";
  if (lower.includes("mission")) return "mission_conversations";
  return "general_communications";
}

function scoreText(text: string, query: string): number {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const hay = text.toLowerCase();
  return terms.reduce((acc, term) => acc + (hay.includes(term) ? 1 : 0), 0);
}

export function assembleCommunicationSearch(
  query: string,
  ctx: CommunicationExperienceContext
): CommunicationSearchView {
  const shell = assembleCollaborationWorkbenchShell(ctx, "contributor", "search");
  const intent = parseSemanticIntent(query);
  const results: CommunicationSearchView["results"] = [];

  if (!query.trim()) {
    return {
      shell,
      query,
      parsed_semantic_intent: "awaiting_query",
      results: [],
      placeholder: t(ctx.locale, "search.placeholder"),
    };
  }

  const conversations = readStoreSlice<ConversationRecord>(COMMUNICATION_STORE_KEYS.conversations).filter(
    (c) => c.institution_id === ctx.institution_id
  );
  const decisions = readStoreSlice<DecisionRecord>(COMMUNICATION_STORE_KEYS.decisions);
  const documents = readStoreSlice<DocumentRecord>(COMMUNICATION_STORE_KEYS.documents);

  if (intent === "decisions" || intent === "general_communications") {
    for (const d of decisions) {
      const score = scoreText(`${d.decision_text} ${d.rationale}`, query);
      if (score > 0) {
        results.push({
          id: d.canonical_id,
          title: d.decision_text.slice(0, 80),
          excerpt: d.rationale.slice(0, 120),
          entity_type: "Decision",
          href: `/communications/decisions/${d.canonical_id}`,
          score,
        });
      }
    }
  }

  if (intent === "mission_conversations" || intent === "general_communications") {
    for (const c of conversations) {
      const score = scoreText(`${c.display_name} ${c.purpose}`, query);
      if (score > 0) {
        results.push({
          id: c.canonical_id,
          title: c.display_name,
          excerpt: c.purpose.slice(0, 120),
          entity_type: "Conversation",
          href: `/communications/missions/${c.mission_id_optional ?? c.canonical_id}`,
          score,
        });
      }
    }
  }

  if (intent === "documents" || intent === "general_communications") {
    for (const doc of documents) {
      const score = scoreText(`${doc.display_name} ${doc.content}`, query);
      if (score > 0) {
        results.push({
          id: doc.canonical_id,
          title: doc.display_name,
          excerpt: doc.content.slice(0, 120),
          entity_type: "Document",
          href: `/communications/documents/${doc.canonical_id}`,
          score,
        });
      }
    }
  }

  results.sort((a, b) => b.score - a.score);

  return {
    shell,
    query,
    parsed_semantic_intent: intent,
    results: results.slice(0, 20),
    placeholder: t(ctx.locale, "search.placeholder"),
  };
}
