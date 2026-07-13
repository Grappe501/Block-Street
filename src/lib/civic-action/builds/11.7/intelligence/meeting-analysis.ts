/**
 * CAE-11.7-W6 — Meeting analysis (agenda completion, action items advisory)
 */
import { communicationApplicationService } from "../application-service";
import { COMMUNICATION_STORE_KEYS } from "../data-model";
import { readStoreSlice } from "../services/repository";
import type { ActionItemRecord, MeetingRecord } from "../data-model";

export type MeetingIntelligenceInsight = {
  meeting_id: string;
  display_name: string;
  agenda_completion_percent: number;
  action_items_extracted: number;
  open_action_items: number;
  efficiency_band: "efficient" | "moderate" | "needs_followup";
  advisory_notes: string[];
};

function meetingsInScope(institutionId: string, initiativeId?: string): MeetingRecord[] {
  let meetings = readStoreSlice<MeetingRecord>(COMMUNICATION_STORE_KEYS.meetings).filter(
    (m) => m.institution_id === institutionId && m.lifecycle_state !== "archived"
  );
  if (initiativeId) meetings = meetings.filter((m) => m.initiative_id === initiativeId);
  return meetings;
}

export function analyzeMeetings(institutionId: string, initiativeId?: string): MeetingIntelligenceInsight[] {
  const actionItems = readStoreSlice<ActionItemRecord>(COMMUNICATION_STORE_KEYS.action_items);
  return meetingsInScope(institutionId, initiativeId).map((meeting) => {
    const agendaItems = meeting.agenda_items ?? [];
    const completed = meeting.lifecycle_state === "completed" ? agendaItems.length : Math.floor(agendaItems.length * 0.5);
    const completion = agendaItems.length > 0 ? Math.round((completed / agendaItems.length) * 100) : 100;
    const related = actionItems.filter((a) => meeting.action_item_ids.includes(a.canonical_id));
    const open = related.filter((a) => a.lifecycle_state !== "completed").length;
    const efficiency_band: MeetingIntelligenceInsight["efficiency_band"] =
      completion >= 80 && open <= 2 ? "efficient" : completion >= 50 ? "moderate" : "needs_followup";

    return {
      meeting_id: meeting.canonical_id,
      display_name: meeting.display_name,
      agenda_completion_percent: completion,
      action_items_extracted: related.length,
      open_action_items: open,
      efficiency_band,
      advisory_notes: [
        "Action item extraction is advisory — Humans confirm assignments via governed commands.",
        open > 0 ? `${open} action item(s) remain open from this meeting.` : "No open action items linked.",
      ],
    };
  });
}

export function extractMeetingActionItemsAdvisory(meetingId: string): string[] {
  const meeting = communicationApplicationService.getMeeting(meetingId);
  if (!meeting) return [];
  const suggestions: string[] = [];
  if (meeting.minutes_text_optional) {
  const lines = meeting.minutes_text_optional.split("\n").filter((l) => /action|todo|follow/i.test(l));
    suggestions.push(...lines.slice(0, 5).map((l) => l.trim()));
  }
  if (suggestions.length === 0 && meeting.agenda_items.length > 0) {
    suggestions.push(`Review agenda item: ${meeting.agenda_items[0]}`);
  }
  return suggestions;
}
