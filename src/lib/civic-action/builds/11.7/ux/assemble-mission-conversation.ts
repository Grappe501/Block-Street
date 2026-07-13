/**
 * CAE-11.7-W4 — Mission conversation workspace assembler
 */
import { communicationApplicationService } from "../application-service";
import type { CommunicationExperienceContext } from "./experience-context";
import { humanLabel, resolveCommunicationExperienceRole } from "./experience-context";
import { assembleCollaborationWorkbenchShell } from "./assemble-workbench-shell";
import { conversationStatusLabel, t } from "./locale";
import { resolveCommunicationActions } from "./ui-actions";
import type { MissionConversationView, TimelineEntryView } from "./view-models";

export function assembleMissionConversation(
  missionId: string,
  ctx: CommunicationExperienceContext
): MissionConversationView | null {
  const byMission = communicationApplicationService.listConversationsByMission(missionId);
  const conversation = byMission[0] ?? communicationApplicationService.getConversation(missionId) ?? null;
  if (!conversation) return null;

  const bundle = communicationApplicationService.getConversationBundle(conversation.canonical_id);
  if (!bundle) return null;

  const role = resolveCommunicationExperienceRole(
    ctx.actor_human_id,
    conversation.owner_human_id,
    conversation.moderator_human_ids,
    conversation.participant_human_ids,
    ctx.permissions
  );
  const shell = assembleCollaborationWorkbenchShell(ctx, role, "missions");

  const timeline: TimelineEntryView[] = bundle.messages
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .slice(-20)
    .map((m) => ({
      id: m.canonical_id,
      author_label: humanLabel(m.author_human_id),
      body: m.body,
      when: m.created_at,
      entity_type: "Message" as const,
    }));

  return {
    shell,
    conversation_id: conversation.canonical_id,
    mission_id: conversation.mission_id_optional ?? missionId,
    display_name: conversation.display_name,
    purpose: conversation.purpose,
    lifecycle_state: conversation.lifecycle_state,
    lifecycle_label: conversationStatusLabel(conversation.lifecycle_state, ctx.locale),
    archived_banner:
      conversation.lifecycle_state === "archived" ? t(ctx.locale, "banner.archived") : null,
    threads: bundle.threads.map((th) => ({
      id: th.canonical_id,
      subject: th.subject,
      message_count: bundle.messages.filter((m) => m.thread_id === th.canonical_id).length,
      resolved: th.resolved,
      href: `#thread-${th.canonical_id}`,
    })),
    timeline,
    governed_actions: resolveCommunicationActions(conversation, ctx),
    ai_suggestion_prompts: [
      "Summarize this mission conversation.",
      "What decisions are still open?",
      "Draft a message for me to review — do not post.",
    ],
    participants: conversation.participant_human_ids.map((id) => ({
      human_id: id,
      label: humanLabel(id),
      role: conversation.moderator_human_ids.includes(id)
        ? "Moderator"
        : id === conversation.owner_human_id
          ? "Owner"
          : "Participant",
    })),
  };
}
