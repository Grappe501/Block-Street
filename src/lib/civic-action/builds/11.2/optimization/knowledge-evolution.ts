/**
 * CAE-11.2-W7 — Knowledge lifecycle evolution
 */
import { nowIso } from "../../../utils";
import type { TemplateEvolutionRecord } from "./contracts";
import { getTemplateEvolution } from "./template-evolution";
import { buildInstitutionalMemory } from "./institutional-memory";

export type KnowledgeAsset = {
  knowledge_id: string;
  title: string;
  lifecycle_state: TemplateEvolutionRecord["status"];
  source: string;
  updated_at: string;
};

export function analyzeKnowledgeEvolution(institutionId: string, initiativeId?: string): KnowledgeAsset[] {
  const assets: KnowledgeAsset[] = [];
  const templates = getTemplateEvolution(institutionId, initiativeId);
  for (const t of templates) {
    assets.push({
      knowledge_id: t.template_id,
      title: t.template_name,
      lifecycle_state: t.status,
      source: "template_evolution",
      updated_at: t.updated_at,
    });
  }

  const memory = buildInstitutionalMemory(institutionId, initiativeId ? { initiativeId } : undefined);
  for (const m of memory.slice(0, 10)) {
    assets.push({
      knowledge_id: m.memory_id,
      title: `Memory: ${m.objective_name}`,
      lifecycle_state: m.lessons ? "validated" : "draft",
      source: "institutional_memory",
      updated_at: m.occurred_at,
    });
  }

  if (assets.length === 0) {
    assets.push({
      knowledge_id: "knowledge-baseline",
      title: "Objective execution knowledge base",
      lifecycle_state: "draft",
      source: "system",
      updated_at: nowIso(),
    });
  }

  return assets;
}
