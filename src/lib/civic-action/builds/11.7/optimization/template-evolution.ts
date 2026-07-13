/**
 * CAE-11.7-W7 — Template evolution with version history
 */
import { nowIso } from "../../../utils";
import { readStoreSlice, writeStoreSlice } from "../services/repository";
import { extractLessons } from "./lesson-engine";
import type { TemplateEvolutionRecord } from "./contracts";

const TEMPLATE_REGISTRY_KEY = "communication_template_evolution";

const BASE_TEMPLATES: Omit<TemplateEvolutionRecord, "version_history" | "updated_at">[] = [
  { template_id: "tpl-meeting-agenda", template_name: "Meeting agenda", template_type: "meeting_agenda", version: 1, source_conversation_id: null, lessons_applied: [], status: "draft" },
  { template_id: "tpl-mission-briefing", template_name: "Mission briefing", template_type: "mission_briefing", version: 1, source_conversation_id: null, lessons_applied: [], status: "draft" },
  { template_id: "tpl-executive-brief", template_name: "Executive brief", template_type: "executive_brief", version: 1, source_conversation_id: null, lessons_applied: [], status: "draft" },
  { template_id: "tpl-volunteer-welcome", template_name: "Volunteer welcome", template_type: "volunteer_welcome", version: 1, source_conversation_id: null, lessons_applied: [], status: "draft" },
  { template_id: "tpl-decision-record", template_name: "Decision record", template_type: "decision_record", version: 1, source_conversation_id: null, lessons_applied: [], status: "draft" },
  { template_id: "tpl-announcement", template_name: "Announcement", template_type: "announcement", version: 1, source_conversation_id: null, lessons_applied: [], status: "draft" },
];

type StoredTemplate = TemplateEvolutionRecord & { institution_id?: string };

export function getTemplateEvolution(
  institutionId: string,
  initiativeId?: string
): TemplateEvolutionRecord[] {
  const stored = readStoreSlice<StoredTemplate>(TEMPLATE_REGISTRY_KEY).filter(
    (t) => t.institution_id === institutionId
  );
  if (stored.length > 0) return stored;

  const lessons = extractLessons(institutionId, initiativeId ? { initiativeId } : undefined);
  const now = nowIso();

  return BASE_TEMPLATES.map((base) => {
    const applied = lessons.slice(0, 3).map((l) => l.recommendation.slice(0, 120));
    const version = applied.length >= 2 ? 2 : 1;
    return {
      ...base,
      version,
      lessons_applied: applied.length ? applied : ["Baseline template — awaiting first archived conversation lessons."],
      version_history: [
        { version: 1, change_summary: "Initial template", updated_at: now },
        ...(version > 1 ? [{ version: 2, change_summary: "Lessons from completed communications applied", updated_at: now }] : []),
      ],
      status: applied.length >= 3 ? "recommended" : "draft",
      updated_at: now,
    };
  });
}

export function recordTemplateVersion(
  institutionId: string,
  templateId: string,
  changeSummary: string
): TemplateEvolutionRecord | null {
  const templates = getTemplateEvolution(institutionId);
  const existing = templates.find((t) => t.template_id === templateId);
  if (!existing) return null;

  const nextVersion = existing.version + 1;
  const updated: StoredTemplate = {
    ...existing,
    institution_id: institutionId,
    version: nextVersion,
    version_history: [
      ...existing.version_history,
      { version: nextVersion, change_summary: changeSummary, updated_at: nowIso() },
    ],
    updated_at: nowIso(),
  };
  const rows = readStoreSlice<StoredTemplate>(TEMPLATE_REGISTRY_KEY).filter(
    (t) => !(t.institution_id === institutionId && t.template_id === templateId)
  );
  rows.push(updated);
  writeStoreSlice(TEMPLATE_REGISTRY_KEY, rows);
  return updated;
}
