/**
 * CAE-11.7-W4 — Meeting workspace assembler
 */
import { communicationApplicationService } from "../application-service";
import { readStoreSlice } from "../services/repository";
import { COMMUNICATION_STORE_KEYS } from "../data-model";
import type { ActionItemRecord } from "../data-model";
import type { CommunicationExperienceContext } from "./experience-context";
import { humanLabel } from "./experience-context";
import { assembleCollaborationWorkbenchShell } from "./assemble-workbench-shell";
import { resolveMeetingActions } from "./ui-actions";
import type { MeetingWorkspaceView } from "./view-models";

export function assembleMeetingWorkspace(
  meetingId: string,
  ctx: CommunicationExperienceContext
): MeetingWorkspaceView | null {
  const meeting = communicationApplicationService.getMeeting(meetingId);
  if (!meeting) return null;

  const shell = assembleCollaborationWorkbenchShell(ctx, "operational_owner", "meetings");
  const actionItems = readStoreSlice<ActionItemRecord>(COMMUNICATION_STORE_KEYS.action_items).filter((a) =>
    meeting.action_item_ids.includes(a.canonical_id)
  );

  return {
    shell,
    meeting_id: meeting.canonical_id,
    display_name: meeting.display_name,
    purpose: meeting.purpose,
    status_label: meeting.lifecycle_state,
    scheduled_at: meeting.scheduled_at,
    location: meeting.location_optional,
    agenda_items: meeting.agenda_items,
    minutes_text: meeting.minutes_text_optional,
    action_items: actionItems.map((a) => ({
      id: a.canonical_id,
      description: a.description,
      assignee_label: humanLabel(a.assignee_human_id),
    })),
    governed_actions: resolveMeetingActions(meeting, ctx),
  };
}
