/**
 * CAE-11.7-W7 — Meeting learning outputs
 */
import { caeId } from "../../../utils";
import { COMMUNICATION_STORE_KEYS } from "../data-model";
import { readStoreSlice } from "../services/repository";
import type { MeetingRecord } from "../data-model";
import { analyzeMeetings } from "../intelligence/meeting-analysis";
import type { OptimizationConfidence, StructuredLesson } from "./contracts";

function confidenceFromEfficiency(band: string): OptimizationConfidence {
  if (band === "needs_followup") return "strong_pattern";
  if (band === "moderate") return "likely";
  return "observed";
}

export function extractMeetingLessons(
  institutionId: string,
  options?: { initiativeId?: string }
): StructuredLesson[] {
  const lessons: StructuredLesson[] = [];
  let meetings = readStoreSlice<MeetingRecord>(COMMUNICATION_STORE_KEYS.meetings).filter(
    (m) => m.institution_id === institutionId
  );
  if (options?.initiativeId) meetings = meetings.filter((m) => m.initiative_id === options.initiativeId);

  const analysis = analyzeMeetings(institutionId, options?.initiativeId);
  const analysisById = new Map(analysis.map((a) => [a.meeting_id, a]));

  for (const meeting of meetings.filter((m) => m.lifecycle_state === "completed" || m.lifecycle_state === "archived")) {
    const intel = analysisById.get(meeting.canonical_id);
    if (!intel || intel.efficiency_band === "efficient") continue;

    lessons.push({
      lesson_id: caeId("mles"),
      source_type: "meeting",
      source_id: meeting.canonical_id,
      source_name: meeting.display_name,
      initiative_id: meeting.initiative_id,
      observation: `Meeting completed with ${intel.efficiency_band} efficiency — ${intel.agenda_completion_percent}% agenda completion.`,
      root_cause: intel.agenda_completion_percent < 70 ? "Agenda scope exceeded available time" : "Action items not captured during meeting",
      recommendation: "Use time-boxed agenda sections and capture decisions before adjournment.",
      evidence: `Agenda ${intel.agenda_completion_percent}% · ${intel.action_items_extracted} extracted actions`,
      applicability: "Recurring mission coordination meetings",
      confidence: confidenceFromEfficiency(intel.efficiency_band),
      occurred_at: meeting.updated_at,
    });
  }

  return lessons.sort((a, b) => b.occurred_at.localeCompare(a.occurred_at));
}
