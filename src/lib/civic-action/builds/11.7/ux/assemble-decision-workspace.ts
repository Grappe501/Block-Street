/**
 * CAE-11.7-W4 — Decision workspace assembler
 */
import { communicationApplicationService } from "../application-service";
import { readStoreSlice } from "../services/repository";
import { COMMUNICATION_STORE_KEYS } from "../data-model";
import type { ActionItemRecord, MessageRecord } from "../data-model";
import type { CommunicationExperienceContext } from "./experience-context";
import { humanLabel } from "./experience-context";
import { assembleCollaborationWorkbenchShell } from "./assemble-workbench-shell";
import { resolveDecisionActions } from "./ui-actions";
import type { DecisionWorkspaceView } from "./view-models";

export function assembleDecisionWorkspace(
  decisionId: string,
  ctx: CommunicationExperienceContext
): DecisionWorkspaceView | null {
  const decision = communicationApplicationService.getDecision(decisionId);
  if (!decision) return null;

  const shell = assembleCollaborationWorkbenchShell(ctx, "mission_lead", "decisions");
  const messages = readStoreSlice<MessageRecord>(COMMUNICATION_STORE_KEYS.messages);
  const actionItems = readStoreSlice<ActionItemRecord>(COMMUNICATION_STORE_KEYS.action_items).filter((a) =>
    decision.action_item_ids.includes(a.canonical_id)
  );

  return {
    shell,
    decision_id: decision.canonical_id,
    decision_text: decision.decision_text,
    rationale: decision.rationale,
    status_label: decision.lifecycle_state,
    decided_by_label: humanLabel(decision.decided_by_human_id),
    related_messages: decision.related_message_ids
      .map((id) => messages.find((m) => m.canonical_id === id))
      .filter(Boolean)
      .map((m) => ({ id: m!.canonical_id, excerpt: m!.body.slice(0, 120) })),
    action_items: actionItems.map((a) => ({ id: a.canonical_id, description: a.description })),
    governed_actions: resolveDecisionActions(decision, ctx),
  };
}
