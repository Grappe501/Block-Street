/**
 * CAE-11.2-W5 — Objective search projection (visibility-scoped fields only)
 */
import { objectiveApplicationService } from "../application-service";
import { readStoreSlice, writeStoreSlice } from "../services/repository";

export type ObjectiveSearchDocument = {
  objective_id: string;
  initiative_id: string;
  institution_id: string;
  display_name: string;
  objective_type: string;
  lifecycle_state: string;
  purpose_summary: string;
  updated_at: string;
};

const INDEX_KEY = "objective_search_index";

export function projectObjectiveSearchDocument(
  entityId: string,
  entityType: string
): ObjectiveSearchDocument | null {
  if (entityType === "objective") {
    const objective = objectiveApplicationService.getObjective(entityId);
    if (!objective) return null;
    return {
      objective_id: objective.canonical_id,
      initiative_id: objective.initiative_id,
      institution_id: objective.institution_id,
      display_name: objective.display_name,
      objective_type: objective.objective_type,
      lifecycle_state: objective.lifecycle_state,
      purpose_summary: objective.purpose.slice(0, 280),
      updated_at: objective.updated_at,
    };
  }
  const bundle = objectiveApplicationService.getObjectiveBundle(entityId);
  if (bundle) {
    const o = bundle.objective;
    return {
      objective_id: o.canonical_id,
      initiative_id: o.initiative_id,
      institution_id: o.institution_id,
      display_name: o.display_name,
      objective_type: o.objective_type,
      lifecycle_state: o.lifecycle_state,
      purpose_summary: o.purpose.slice(0, 280),
      updated_at: o.updated_at,
    };
  }
  return null;
}

export function upsertObjectiveSearchIndex(doc: ObjectiveSearchDocument) {
  const index = readStoreSlice<ObjectiveSearchDocument>(INDEX_KEY);
  const next = index.filter((d) => d.objective_id !== doc.objective_id);
  next.push(doc);
  writeStoreSlice(INDEX_KEY, next);
}

export function searchObjectives(input: {
  institution_id: string;
  initiative_id?: string;
  query?: string;
  include_archived?: boolean;
}) {
  let docs = readStoreSlice<ObjectiveSearchDocument>(INDEX_KEY).filter(
    (d) => d.institution_id === input.institution_id
  );

  if (input.initiative_id) docs = docs.filter((d) => d.initiative_id === input.initiative_id);
  if (!input.include_archived) docs = docs.filter((d) => d.lifecycle_state !== "archived");

  if (input.query) {
    const q = input.query.toLowerCase();
    docs = docs.filter(
      (d) => d.display_name.toLowerCase().includes(q) || d.purpose_summary.toLowerCase().includes(q)
    );
  }

  return docs.map((d) => ({
    objective_id: d.objective_id,
    initiative_id: d.initiative_id,
    display_name: d.display_name,
    objective_type: d.objective_type,
    lifecycle_state: d.lifecycle_state,
    institution_id: d.institution_id,
    purpose_summary: d.purpose_summary,
  }));
}
