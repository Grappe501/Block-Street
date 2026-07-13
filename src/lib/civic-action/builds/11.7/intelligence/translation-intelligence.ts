/**
 * CAE-11.7-W6 — Translation intelligence (conversational Spanish advisory)
 */
import { communicationApplicationService } from "../application-service";

export type TranslationAdvisory = {
  message_id: string;
  conversation_id: string;
  original_excerpt: string;
  suggested_es: string;
  confidence: "high" | "medium" | "low";
  advisory_note: string;
};

const PHRASE_MAP: Record<string, string> = {
  hello: "hola",
  thanks: "gracias",
  meeting: "reunión",
  decision: "decisión",
  question: "pregunta",
  volunteer: "voluntario",
  register: "registrarse",
  help: "ayuda",
};

export function suggestConversationalSpanish(institutionId: string, limit = 5): TranslationAdvisory[] {
  const advisories: TranslationAdvisory[] = [];
  const conversations = communicationApplicationService
    .listAllConversations()
    .filter((c) => c.institution_id === institutionId);

  for (const conv of conversations) {
    const bundle = communicationApplicationService.getConversationBundle(conv.canonical_id);
    if (!bundle) continue;
    for (const msg of bundle.messages) {
      if (msg.is_ai_generated) continue;
      const lower = msg.body.toLowerCase();
      const hasSpanishCue = /\b(hola|gracias|pregunta)\b/.test(lower) === false;
      if (!hasSpanishCue && advisories.length < limit) {
        const suggested = translateAdvisory(msg.body);
        advisories.push({
          message_id: msg.canonical_id,
          conversation_id: conv.canonical_id,
          original_excerpt: msg.body.slice(0, 100),
          suggested_es: suggested,
          confidence: "medium",
          advisory_note: "Machine-assisted translation for review — not authoritative.",
        });
      }
      if (advisories.length >= limit) return advisories;
    }
  }
  return advisories;
}

function translateAdvisory(text: string): string {
  let result = text;
  for (const [en, es] of Object.entries(PHRASE_MAP)) {
    result = result.replace(new RegExp(`\\b${en}\\b`, "gi"), es);
  }
  return result.length === text.length ? `[ES] ${text}` : result;
}
