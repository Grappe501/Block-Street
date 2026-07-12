/**
 * CAE-11.2-W7 — Template evolution (history preserved)
 */
import { nowIso } from "../../../utils";
import { readStoreSlice } from "../services/repository";
import { objectiveApplicationService } from "../application-service";
import type { TemplateEvolutionRecord } from "./contracts";
import { extractLessons } from "./lesson-engine";

const TEMPLATE_REGISTRY_KEY = "objective_template_evolution";

export function getTemplateEvolution(
  institutionId: string,
  initiativeId?: string
): TemplateEvolutionRecord[] {
  const stored = readStoreSlice<TemplateEvolutionRecord & { institution_id?: string }>(TEMPLATE_REGISTRY_KEY).filter(
    (t) => t.institution_id === institutionId
  );
  if (stored.length > 0) return stored;

  const derived: TemplateEvolutionRecord[] = [];
  const lessons = extractLessons(institutionId, initiativeId ? { initiativeId } : undefined);

  const byType = new Map<string, string[]>();
  for (const lesson of lessons) {
    const objective = objectiveApplicationService.getObjective(lesson.objective_id);
    const type = String(objective?.governance_classification ?? "operational");
    const list = byType.get(type) ?? [];
    list.push(lesson.recommendation.slice(0, 120));
    byType.set(type, list);
  }

  for (const [type, applied] of byType) {
    derived.push({
      template_id: `tpl-obj-${type}`,
      template_name: `Classification ${type} Objective template`,
      version: applied.length >= 3 ? 2 : 1,
      source_objective_id: lessons.find((l) => {
        const o = objectiveApplicationService.getObjective(l.objective_id);
        return o && String(o.governance_classification) === type;
      })?.objective_id ?? null,
      lessons_applied: applied.slice(0, 5),
      status: applied.length >= 3 ? "recommended" : "draft",
      updated_at: nowIso(),
    });
  }

  if (derived.length === 0) {
    derived.push({
      template_id: "tpl-obj-volunteer",
      template_name: "Volunteer mobilization Objective",
      version: 1,
      source_objective_id: null,
      lessons_applied: ["Baseline template — awaiting first completed Objective with lessons."],
      status: "draft",
      updated_at: nowIso(),
    });
  }

  return derived;
}
