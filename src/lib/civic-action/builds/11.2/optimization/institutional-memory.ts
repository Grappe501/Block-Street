/**
 * CAE-11.2-W7 — Institutional memory from completed Objectives
 */
import { caeId } from "../../../utils";
import { objectiveApplicationService } from "../application-service";
import { readStoreSlice } from "../services/repository";
import { EXECUTION_STORE_KEYS } from "../data-model";
import type { ExecutionHistoryEvent } from "../data-model";
import type { InstitutionalMemoryEntry } from "./contracts";
import { extractLessons } from "./lesson-engine";

export function buildInstitutionalMemory(
  institutionId: string,
  options?: { initiativeId?: string }
): InstitutionalMemoryEntry[] {
  const entries: InstitutionalMemoryEntry[] = [];
  const lessons = extractLessons(institutionId, options);
  const history = readStoreSlice<ExecutionHistoryEvent>(EXECUTION_STORE_KEYS.history);

  let objectives = objectiveApplicationService
    .listAllObjectives()
    .filter((o) => o.institution_id === institutionId);
  if (options?.initiativeId) objectives = objectives.filter((o) => o.initiative_id === options.initiativeId);

  for (const objective of objectives) {
    if (!["completed", "archived"].includes(objective.lifecycle_state)) continue;

    const objLessons = lessons.filter((l) => l.objective_id === objective.canonical_id);
    const objHistory = history
      .filter((h) => h.entity_id === objective.canonical_id)
      .slice(-3)
      .map((h) => `${h.event_type}: ${String(h.payload?.reason ?? "recorded")}`)
      .join("; ");

    const lessonText = objLessons.map((l) => l.observation).join(" ");
    entries.push({
      memory_id: caeId("mem"),
      objective_id: objective.canonical_id,
      objective_name: objective.display_name,
      initiative_id: objective.initiative_id,
      decision_summary: objHistory || `Objective completed — ${objective.lifecycle_state}`,
      what_worked: objLessons.find((l) => !l.observation.toLowerCase().includes("fail"))?.observation ?? null,
      what_failed: objLessons.find((l) => l.observation.toLowerCase().includes("fail"))?.observation ?? null,
      lessons: lessonText || null,
      occurred_at: objective.updated_at,
      searchable_text: [objective.display_name, objective.purpose, lessonText, objHistory].filter(Boolean).join(" "),
    });
  }

  return entries.sort((a, b) => b.occurred_at.localeCompare(a.occurred_at));
}

export function searchInstitutionalMemory(institutionId: string, query: string) {
  const q = query.toLowerCase();
  return buildInstitutionalMemory(institutionId).filter((m) => m.searchable_text.toLowerCase().includes(q));
}
