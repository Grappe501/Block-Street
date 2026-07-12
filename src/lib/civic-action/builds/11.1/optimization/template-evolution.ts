/**
 * CAE-11.1-W7 — Template evolution from completed Initiatives
 */
import { nowIso } from "../../../utils";
import { initiativeApplicationService } from "../services/application-service";
import { readStoreSlice } from "../services/repository";
import type { TemplateEvolutionRecord } from "./contracts";

const TEMPLATE_REGISTRY_KEY = "initiative_template_evolution";

export function getTemplateEvolution(institutionId: string): TemplateEvolutionRecord[] {
  const stored = readTemplatesFromMemory(institutionId);
  if (stored.length > 0) return stored;

  const derived: TemplateEvolutionRecord[] = [];
  for (const id of initiativeApplicationService.listInitiativeIds()) {
    const agg = initiativeApplicationService.getAggregate(id);
    if (!agg || agg.initiative.institution_id !== institutionId) continue;
    if (agg.initiative.status !== "completed") continue;
    if (!agg.closeout?.lessons_learned) continue;

    derived.push({
      template_id: `tpl-${agg.initiative.initiative_type}`,
      template_name: `${agg.initiative.initiative_type} Initiative template`,
      version: 2,
      source_initiative_id: id,
      lessons_applied: [agg.closeout.lessons_learned.slice(0, 120)],
      status: "recommended",
      updated_at: nowIso(),
    });
  }

  if (derived.length === 0) {
    derived.push({
      template_id: "tpl-youth-program",
      template_name: "Youth program Initiative",
      version: 1,
      source_initiative_id: null,
      lessons_applied: ["Baseline template — awaiting first completed Initiative with lessons."],
      status: "draft",
      updated_at: nowIso(),
    });
  }

  return derived;
}

function readTemplatesFromMemory(institutionId: string): TemplateEvolutionRecord[] {
  return readStoreSlice<TemplateEvolutionRecord & { institution_id?: string }>(TEMPLATE_REGISTRY_KEY).filter(
    (t) => t.institution_id === institutionId
  );
}
