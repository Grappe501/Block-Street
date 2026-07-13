/**
 * CAE-11.7-W7 — Playbook evolution
 */
import { nowIso } from "../../../utils";
import { suggestPlaybooks } from "../intelligence/knowledge-intelligence";
import { extractLessons } from "./lesson-engine";
import type { PlaybookEvolutionRecord } from "./contracts";

export function getPlaybookEvolution(
  institutionId: string,
  initiativeId?: string
): PlaybookEvolutionRecord[] {
  const suggestions = suggestPlaybooks(institutionId, initiativeId);
  const lessons = extractLessons(institutionId, initiativeId ? { initiativeId } : undefined);
  const now = nowIso();

  const defaults: PlaybookEvolutionRecord[] = [
    {
      playbook_id: "pb-volunteer-onboarding",
      playbook_name: "Volunteer onboarding",
      playbook_type: "volunteer_onboarding",
      version: 1,
      lessons_applied: ["Welcome message template and orientation checklist."],
      status: "draft",
      updated_at: now,
    },
    {
      playbook_id: "pb-campaign-launch",
      playbook_name: "Campaign launch",
      playbook_type: "campaign_launch",
      version: 1,
      lessons_applied: ["Announcement sequence and mission briefing cadence."],
      status: "draft",
      updated_at: now,
    },
    {
      playbook_id: "pb-crisis-response",
      playbook_name: "Crisis response communications",
      playbook_type: "crisis_response",
      version: 1,
      lessons_applied: ["Escalation contacts and decision record template."],
      status: "draft",
      updated_at: now,
    },
    {
      playbook_id: "pb-meeting-cadence",
      playbook_name: "Meeting cadence",
      playbook_type: "meeting_cadence",
      version: 1,
      lessons_applied: ["Agenda time-boxing and action item capture."],
      status: "draft",
      updated_at: now,
    },
    {
      playbook_id: "pb-decision-escalation",
      playbook_name: "Decision escalation",
      playbook_type: "decision_escalation",
      version: 1,
      lessons_applied: ["Decision SLA and reviewer assignment."],
      status: "draft",
      updated_at: now,
    },
  ];

  if (suggestions.length === 0 && lessons.length === 0) return defaults;

  return defaults.map((pb) => {
    const match = suggestions.find((s) => s.title.toLowerCase().includes(pb.playbook_type.replace("_", " ")));
    const applied = match
      ? [match.rationale, ...lessons.slice(0, 2).map((l) => l.recommendation.slice(0, 80))]
      : lessons.slice(0, 2).map((l) => l.recommendation.slice(0, 80));
    return {
      ...pb,
      version: applied.length >= 2 ? 2 : 1,
      lessons_applied: applied.length ? applied : pb.lessons_applied,
      status: applied.length >= 3 ? "recommended" : pb.status,
      updated_at: now,
    };
  });
}

export function getPlaybookRecommendations(institutionId: string, initiativeId?: string): string[] {
  return getPlaybookEvolution(institutionId, initiativeId)
    .filter((p) => p.status === "recommended" || p.version > 1)
    .map((p) => `${p.playbook_name} v${p.version} — ${p.lessons_applied[0]}`);
}
