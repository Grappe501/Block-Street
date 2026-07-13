/**
 * CAE-11.7-W4 — Notification center assembler
 */
import type { ConversationRecord } from "../data-model";
import { COMMUNICATION_STORE_KEYS } from "../data-model";
import { communicationApplicationService } from "../application-service";
import { readStoreSlice } from "../services/repository";
import type { CommunicationExperienceContext } from "./experience-context";
import { assembleCollaborationWorkbenchShell } from "./assemble-workbench-shell";
import type { NotificationCenterView } from "./view-models";

export function assembleNotificationCenter(ctx: CommunicationExperienceContext): NotificationCenterView {
  const shell = assembleCollaborationWorkbenchShell(ctx, "contributor", "notifications");
  const mentions = communicationApplicationService.listMentionsForActor(ctx.actor_human_id);
  const announcements = readStoreSlice<ConversationRecord>(COMMUNICATION_STORE_KEYS.conversations)
    .filter((c) => c.institution_id === ctx.institution_id)
    .flatMap((c) =>
      communicationApplicationService
        .listAnnouncementsByInitiative(c.initiative_id)
        .map((a) => ({
          id: a.canonical_id,
          title: a.display_name,
          body: a.body.slice(0, 160),
          when: a.effective_date,
          read: false,
          href: "/communications",
        }))
    );

  const notifications = [
    ...mentions.map((m) => ({
      id: m.canonical_id,
      title: "You were mentioned",
      body: m.body.slice(0, 120),
      when: m.created_at,
      read: false,
      href: `/communications/missions/${m.conversation_id}`,
    })),
    ...announcements,
  ];

  return {
    shell,
    notifications,
    unread_count: notifications.filter((n) => !n.read).length,
  };
}
