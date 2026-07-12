/**
 * CAE-11.2-W5 — Analytics projection (derived read model; not source of truth)
 */
import { objectiveApplicationService } from "../application-service";
import { readStoreSlice, writeStoreSlice } from "../services/repository";
import type { ExecutionEventOutboxRecord } from "../services/events";
import { nowIso } from "../../../utils";

export type ObjectiveOperationalProjection = {
  objective_id: string;
  initiative_id: string;
  institution_id: string;
  lifecycle_state: string;
  objective_type: string;
  owner_human_ids: string[];
  mission_count: number;
  active_mission_count: number;
  completed_mission_count: number;
  health: string;
  updated_at: string;
  source_sequence: string;
  projection_status: "current" | "delayed" | "rebuilding" | "unavailable";
  last_updated_at: string;
};

const PROJECTION_KEY = "objective_operational_projections";

export function projectObjectiveAnalytics(record: ExecutionEventOutboxRecord) {
  const objectiveId =
    record.entity_type === "objective"
      ? record.entity_id
      : (record.payload.objective_id as string) ?? record.entity_id;
  const bundle = objectiveApplicationService.getObjectiveBundle(objectiveId);
  if (!bundle) return null;

  const { objective, missions } = bundle;
  const projection: ObjectiveOperationalProjection = {
    objective_id: objective.canonical_id,
    initiative_id: objective.initiative_id,
    institution_id: objective.institution_id,
    lifecycle_state: objective.lifecycle_state,
    objective_type: objective.objective_type,
    owner_human_ids: [objective.operational_owner_human_id, objective.executive_owner_human_id].filter(Boolean),
    mission_count: missions.length,
    active_mission_count: missions.filter((m) => m.lifecycle_state === "active").length,
    completed_mission_count: missions.filter((m) => m.lifecycle_state === "completed").length,
    health:
      objective.lifecycle_state === "at_risk"
        ? "at_risk"
        : objective.lifecycle_state === "active"
          ? "healthy"
          : "building",
    updated_at: objective.updated_at,
    source_sequence: record.event_id,
    projection_status: "current",
    last_updated_at: nowIso(),
  };

  const all = readStoreSlice<ObjectiveOperationalProjection>(PROJECTION_KEY);
  const next = all.filter((p) => p.objective_id !== objective.canonical_id);
  next.push(projection);
  writeStoreSlice(PROJECTION_KEY, next);
  return projection;
}

export function listObjectiveOperationalProjections(institutionId?: string, initiativeId?: string) {
  let all = readStoreSlice<ObjectiveOperationalProjection>(PROJECTION_KEY);
  if (institutionId) all = all.filter((p) => p.institution_id === institutionId);
  if (initiativeId) all = all.filter((p) => p.initiative_id === initiativeId);
  return all;
}
