/**
 * CAE-11.7-W4 — Daily brief assembler
 */
import type { ConversationRecord } from "../data-model";
import { COMMUNICATION_STORE_KEYS } from "../data-model";
import { communicationApplicationService } from "../application-service";
import { readStoreSlice } from "../services/repository";
import type { CommunicationExperienceContext } from "./experience-context";
import { resolveCommunicationExperienceRole } from "./experience-context";
import { assembleCollaborationWorkbenchShell } from "./assemble-workbench-shell";
import { t } from "./locale";
import type { DailyBriefView } from "./view-models";

export function assembleDailyBrief(ctx: CommunicationExperienceContext): DailyBriefView {
  const conversations = readStoreSlice<ConversationRecord>(COMMUNICATION_STORE_KEYS.conversations).filter(
    (c) => c.institution_id === ctx.institution_id && c.lifecycle_state !== "archived"
  );
  const first = conversations[0];
  const role = first
    ? resolveCommunicationExperienceRole(
        ctx.actor_human_id,
        first.owner_human_id,
        first.moderator_human_ids,
        first.participant_human_ids,
        ctx.permissions
      )
    : "operational_owner";
  const shell = assembleCollaborationWorkbenchShell(ctx, role, "brief");

  const initiativeId = conversations[0]?.initiative_id;
  const decisions = conversations.flatMap((c) =>
    communicationApplicationService.listDecisionsByConversation(c.canonical_id)
  );
  const meetings = initiativeId ? communicationApplicationService.listMeetingsByInitiative(initiativeId) : [];
  const actionItems = communicationApplicationService.listActionItemsForActor(ctx.actor_human_id);
  const mentions = communicationApplicationService.listMentionsForActor(ctx.actor_human_id);

  const today = new Date().toISOString().slice(0, 10);
  const highlights: DailyBriefView["highlights"] = [];

  if (mentions.length > 0) {
    highlights.push({
      id: "mentions",
      title: t(ctx.locale, "card.mentions"),
      body: `${mentions.length} mention(s) need your attention`,
      tone: "warning",
    });
  }
  if (decisions.filter((d) => d.lifecycle_state === "proposed").length > 0) {
    highlights.push({
      id: "decisions",
      title: t(ctx.locale, "card.pending_decisions"),
      body: `${decisions.filter((d) => d.lifecycle_state === "proposed").length} decision(s) awaiting approval`,
      tone: "info",
    });
  }
  const todayMeetings = meetings.filter((m) => m.scheduled_at?.startsWith(today));
  if (todayMeetings.length > 0) {
    highlights.push({
      id: "meetings",
      title: t(ctx.locale, "card.meetings"),
      body: todayMeetings.map((m) => m.display_name).join(", "),
    });
  }

  return {
    shell,
    date_label: new Date().toLocaleDateString(ctx.locale === "es" ? "es-US" : "en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }),
    highlights,
    conversations_count: conversations.filter((c) => c.lifecycle_state === "active").length,
    decisions_count: decisions.filter((d) => d.lifecycle_state === "proposed").length,
    meetings_count: todayMeetings.length,
    action_items_count: actionItems.length,
    empty_message: t(ctx.locale, "brief.empty"),
  };
}
