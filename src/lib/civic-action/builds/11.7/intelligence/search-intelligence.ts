/**
 * CAE-11.7-W6 — Search intelligence (natural language query parsing)
 */
export type ParsedSearchQuery = {
  raw_query: string;
  intent: "find_conversation" | "find_decision" | "find_meeting" | "find_knowledge" | "general";
  keywords: string[];
  filters: {
    initiative_id_optional?: string;
    conversation_id_optional?: string;
    entity_types: string[];
  };
  advisory_only: true;
};

export function parseNaturalLanguageQuery(query: string, options?: { initiativeId?: string }): ParsedSearchQuery {
  const q = query.toLowerCase().trim();
  const keywords = q.split(/\s+/).filter((w) => w.length > 2);

  let intent: ParsedSearchQuery["intent"] = "general";
  const entityTypes: string[] = [];

  if (q.includes("decision") || q.includes("decided")) {
    intent = "find_decision";
    entityTypes.push("decision");
  } else if (q.includes("meeting") || q.includes("agenda")) {
    intent = "find_meeting";
    entityTypes.push("meeting");
  } else if (q.includes("knowledge") || q.includes("playbook") || q.includes("faq")) {
    intent = "find_knowledge";
    entityTypes.push("knowledge");
  } else if (q.includes("conversation") || q.includes("thread") || q.includes("message")) {
    intent = "find_conversation";
    entityTypes.push("conversation", "thread", "message");
  }

  return {
    raw_query: query,
    intent,
    keywords,
    filters: {
      initiative_id_optional: options?.initiativeId,
      entity_types: entityTypes.length > 0 ? entityTypes : ["conversation", "decision", "meeting", "document"],
    },
    advisory_only: true,
  };
}
