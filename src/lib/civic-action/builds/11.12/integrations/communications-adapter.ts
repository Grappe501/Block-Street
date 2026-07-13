/**
 * CAE-11.12-W5 — Communications knowledge suggestion adapter
 */
import { caeId, nowIso } from "../../../utils";
import { readStoreSlice, writeStoreSlice } from "../services/repository";

export type CommunicationKnowledgeSuggestion = {
  suggestion_id: string;
  source_type: "communication" | "mission_debrief";
  source_reference_id: string;
  institution_id: string;
  initiative_id: string;
  suggested_title: string;
  status: "pending_human_review";
  canonical: false;
  created_at: string;
};

const SUGGESTION_KEY = "knowledge_communication_suggestions";

export function createCommunicationKnowledgeSuggestion(input: {
  source_reference_id: string;
  institution_id: string;
  initiative_id: string;
  suggested_title: string;
  source_type?: "communication" | "mission_debrief";
}) {
  const suggestion: CommunicationKnowledgeSuggestion = {
    suggestion_id: caeId("cks"),
    source_type: input.source_type ?? "communication",
    source_reference_id: input.source_reference_id,
    institution_id: input.institution_id,
    initiative_id: input.initiative_id,
    suggested_title: input.suggested_title,
    status: "pending_human_review",
    canonical: false,
    created_at: nowIso(),
  };
  const items = readStoreSlice<CommunicationKnowledgeSuggestion>(SUGGESTION_KEY);
  items.push(suggestion);
  writeStoreSlice(SUGGESTION_KEY, items);
  return suggestion;
}
