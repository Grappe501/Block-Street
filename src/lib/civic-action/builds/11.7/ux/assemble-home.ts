/**
 * CAE-11.7-W4 — Communications home assembler
 */
import type { ConversationRecord } from "../data-model";
import { COMMUNICATION_STORE_KEYS } from "../data-model";
import { communicationApplicationService } from "../application-service";
import { readStoreSlice } from "../services/repository";
import type { CommunicationExperienceContext } from "./experience-context";
import { resolveCommunicationExperienceRole, roleFocusLabels } from "./experience-context";
import { assembleCollaborationWorkbenchShell } from "./assemble-workbench-shell";
import { conversationStatusLabel, t } from "./locale";
import { resolveCommunicationActions } from "./ui-actions";
import type { CommunicationsHomeView, ConversationCardView } from "./view-models";

function listConversationsForInstitution(institutionId: string): ConversationRecord[] {
  return readStoreSlice<ConversationRecord>(COMMUNICATION_STORE_KEYS.conversations).filter(
    (c) => c.institution_id === institutionId && c.lifecycle_state !== "archived"
  );
}

function resolveHomeRole(ctx: CommunicationExperienceContext, conversations: ConversationRecord[]) {
  const first = conversations[0];
  if (!first) return ctx.permissions.includes("civic_action.manage") ? "executive" : "contributor";
  return resolveCommunicationExperienceRole(
    ctx.actor_human_id,
    first.owner_human_id,
    first.moderator_human_ids,
    first.participant_human_ids,
    ctx.permissions
  );
}

function toConversationCard(c: ConversationRecord, locale: "en" | "es"): ConversationCardView {
  const missionPath = `/communications/missions/${c.mission_id_optional ?? c.canonical_id}`;
  return {
    conversation_id: c.canonical_id,
    display_name: c.display_name,
    purpose_summary: c.purpose,
    lifecycle_state: c.lifecycle_state,
    status_label: conversationStatusLabel(c.lifecycle_state, locale),
    participant_count: c.participant_human_ids.length,
    unread_mentions: 0,
    href: missionPath,
    mission_id_optional: c.mission_id_optional,
  };
}

export function assembleCommunicationsHome(ctx: CommunicationExperienceContext): CommunicationsHomeView {
  const conversations = listConversationsForInstitution(ctx.institution_id);
  const role = resolveHomeRole(ctx, conversations);
  const shell = assembleCollaborationWorkbenchShell(ctx, role, "home");

  const mentions = communicationApplicationService
    .listMentionsForActor(ctx.actor_human_id)
    .slice(0, 5)
    .map((m) => ({
      id: m.canonical_id,
      text: m.body.slice(0, 120),
      href: `/communications/missions/${m.conversation_id}`,
      when: m.created_at,
    }));

  const pendingDecisions = conversations
    .flatMap((c) => communicationApplicationService.listDecisionsByConversation(c.canonical_id))
    .filter((d) => d.lifecycle_state === "draft" || d.lifecycle_state === "proposed")
    .slice(0, 5)
    .map((d) => ({
      id: d.canonical_id,
      text: d.decision_text.slice(0, 100),
      href: `/communications/decisions/${d.canonical_id}`,
      status_label: d.lifecycle_state,
    }));

  const initiativeId = conversations[0]?.initiative_id;
  const meetings = initiativeId
    ? communicationApplicationService
        .listMeetingsByInitiative(initiativeId)
        .filter((m) => m.lifecycle_state === "scheduled" || m.lifecycle_state === "in_progress")
        .slice(0, 5)
        .map((m) => ({
          id: m.canonical_id,
          title: m.display_name,
          when: m.scheduled_at,
          href: `/communications/meetings/${m.canonical_id}`,
        }))
    : [];

  const actionItems = communicationApplicationService
    .listActionItemsForActor(ctx.actor_human_id)
    .slice(0, 5)
    .map((a) => ({
      id: a.canonical_id,
      description: a.description,
      due_date: a.due_date_optional,
      href: "/communications",
    }));

  const priorityConversations = conversations
    .filter((c) => c.lifecycle_state === "active" || c.lifecycle_state === "open")
    .slice(0, 6)
    .map((c) => toConversationCard(c, ctx.locale));

  const missionUpdates = conversations
    .filter((c) => c.mission_id_optional)
    .slice(0, 3)
    .map((c) => ({
      id: c.canonical_id,
      text: `${c.display_name}: ${c.human_summary_optional ?? c.purpose.slice(0, 80)}`,
      href: `/communications/missions/${c.mission_id_optional ?? c.canonical_id}`,
    }));

  const firstConv = conversations[0];
  const governedActions = firstConv ? resolveCommunicationActions(firstConv, ctx) : [];

  return {
    shell,
    collaboration_questions: [
      {
        question: t(ctx.locale, "q.conversations"),
        answer:
          priorityConversations.length > 0
            ? priorityConversations.map((c) => c.display_name).join(", ")
            : "No active conversations yet — start one from a mission.",
      },
      {
        question: t(ctx.locale, "q.decisions"),
        answer:
          pendingDecisions.length > 0
            ? `${pendingDecisions.length} decision(s) awaiting your review`
            : "No pending decisions need you right now.",
      },
      {
        question: t(ctx.locale, "q.actions"),
        answer:
          actionItems.length > 0
            ? actionItems.map((a) => a.description).join("; ")
            : "No open action items assigned to you.",
      },
      {
        question: t(ctx.locale, "q.changed"),
        answer:
          mentions.length > 0
            ? `${mentions.length} new mention(s) since your last visit`
            : "No new mentions — check mission updates below.",
      },
    ],
    todays_brief_href: "/communications/brief",
    priority_conversations: priorityConversations,
    mentions,
    pending_decisions: pendingDecisions,
    upcoming_meetings: meetings,
    action_items: actionItems,
    mission_updates: missionUpdates,
    ai_summary_placeholder: "AI summary will appear here when you request one — it never posts on your behalf.",
    governed_actions: governedActions,
    role_focus: roleFocusLabels(role, ctx.locale),
    empty_state:
      conversations.length === 0
        ? {
            title: t(ctx.locale, "home.empty.title"),
            body: t(ctx.locale, "home.empty.body"),
            action_label: t(ctx.locale, "home.empty.action"),
          }
        : null,
  };
}
