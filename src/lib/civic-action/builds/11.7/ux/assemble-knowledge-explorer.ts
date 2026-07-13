/**
 * CAE-11.7-W4 — Knowledge explorer assembler
 */
import type { ConversationRecord } from "../data-model";
import { COMMUNICATION_STORE_KEYS } from "../data-model";
import { communicationApplicationService } from "../application-service";
import { readStoreSlice } from "../services/repository";
import type { CommunicationExperienceContext } from "./experience-context";
import { humanLabel } from "./experience-context";
import { assembleCollaborationWorkbenchShell } from "./assemble-workbench-shell";
import type { KnowledgeExplorerView } from "./view-models";

export function assembleKnowledgeExplorer(ctx: CommunicationExperienceContext): KnowledgeExplorerView {
  const conversations = readStoreSlice<ConversationRecord>(COMMUNICATION_STORE_KEYS.conversations).filter(
    (c) => c.institution_id === ctx.institution_id
  );
  const initiativeId = conversations[0]?.initiative_id;
  const entries = initiativeId
    ? communicationApplicationService.listKnowledgeByInitiative(initiativeId).map((k) => ({
        id: k.canonical_id,
        knowledge_text: k.knowledge_text,
        source_label: k.source_entity_type,
        captured_by_label: humanLabel(k.captured_by_human_id),
        when: k.created_at,
      }))
    : [];

  const shell = assembleCollaborationWorkbenchShell(ctx, "executive", "knowledge");

  return {
    shell,
    entries,
    empty_message: "Knowledge captured from conversations will appear here for institutional learning.",
  };
}
