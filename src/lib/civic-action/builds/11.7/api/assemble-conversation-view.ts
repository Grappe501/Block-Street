/**
 * CAE-11.7-W5 — Role-aware Conversation view assembly
 */
import type { ConversationRecord } from "../data-model";
import { humanLabel, resolveCommunicationExperienceRole } from "../ux/experience-context";
import { listThreadsForConversation } from "../services/repository";
import { resolveCommunicationActions } from "../ux/ui-actions";
import type { CommunicationApiContext, CommunicationViewLevel, ConversationView } from "./contracts";
import { toExperienceContext } from "./context";

function roleToViewLevel(role: string): CommunicationViewLevel {
  if (role === "executive") return "executive";
  if (role === "operational_owner") return "owner";
  if (role === "mission_lead") return "contributor";
  if (role === "contributor" || role === "volunteer") return "contributor";
  if (role === "viewer") return "member";
  return "member";
}

function conversationStatusLabel(status: string, locale: "en" | "es"): string {
  const en: Record<string, string> = {
    draft: "Draft",
    open: "Open",
    active: "Active",
    resolved: "Resolved",
    archived: "Archived",
  };
  const es: Record<string, string> = {
    draft: "Borrador",
    open: "Abierta",
    active: "Activa",
    resolved: "Resuelta",
    archived: "Archivada",
  };
  return (locale === "es" ? es : en)[status] ?? status;
}

export function assembleConversationView(
  conversation: ConversationRecord,
  apiCtx: CommunicationApiContext
): ConversationView {
  const exp = toExperienceContext(apiCtx);
  const role = resolveCommunicationExperienceRole(
    apiCtx.actor_human_id,
    conversation.owner_human_id,
    conversation.moderator_human_ids,
    conversation.participant_human_ids,
    apiCtx.effective_permissions
  );
  const viewLevel = roleToViewLevel(role);
  const actions = resolveCommunicationActions(conversation, exp);
  const threads = listThreadsForConversation(conversation.canonical_id);

  return {
    id: conversation.canonical_id,
    initiative_id: conversation.initiative_id,
    institution_id: conversation.institution_id,
    display_name: conversation.display_name,
    context_type: conversation.context_type,
    lifecycle_state: conversation.lifecycle_state,
    status_label: conversationStatusLabel(conversation.lifecycle_state, apiCtx.locale),
    purpose_summary: conversation.purpose.slice(0, 280),
    owner_summary: viewLevel === "member" ? null : humanLabel(conversation.owner_human_id),
    participant_count: conversation.participant_human_ids.length,
    thread_count: threads.length,
    mission_id_optional: conversation.mission_id_optional,
    created_at: conversation.created_at,
    updated_at: conversation.updated_at,
    view_level: viewLevel,
    permissions: apiCtx.effective_permissions,
    available_actions: actions.filter((a) => a.available).map((a) => a.label),
  };
}
