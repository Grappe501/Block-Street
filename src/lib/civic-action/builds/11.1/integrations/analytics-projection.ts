/**
 * CAE-11.1-W5 — Analytics projection (derived read model; not source of truth)
 */
import { initiativeApplicationService } from "../services/application-service";
import { evaluateDependencyReadiness } from "../services/dependency-graph";
import { readStoreSlice, writeStoreSlice } from "../services/repository";
import type { InitiativeEventOutboxRecord } from "../services/events";
import { nowIso } from "../../../utils";

export type InitiativeOperationalProjection = {
  initiative_id: string;
  institution_id: string;
  status: string;
  type: string;
  governance_class: number;
  owner_human_ids: string[];
  health: string;
  readiness: string | null;
  blocking_dependency_count: number;
  updated_at: string;
  source_sequence: string;
  projection_status: "current" | "delayed" | "rebuilding" | "unavailable";
  last_updated_at: string;
};

const PROJECTION_KEY = "initiative_operational_projections";

export function projectInitiativeAnalytics(record: InitiativeEventOutboxRecord) {
  const agg = initiativeApplicationService.getAggregate(record.initiative_id);
  if (!agg) return null;

  const ini = agg.initiative;
  const blocking = evaluateDependencyReadiness(record.initiative_id, agg.dependencies).blocking_dependencies.length;
  const projection: InitiativeOperationalProjection = {
    initiative_id: ini.initiative_id,
    institution_id: ini.institution_id,
    status: ini.status,
    type: ini.initiative_type,
    governance_class: ini.governance_class,
    owner_human_ids: [ini.operational_owner_human_id, ini.executive_owner_human_id].filter(Boolean) as string[],
    health: ini.status === "at_risk" ? "at_risk" : ini.status === "active" ? "healthy" : "building",
    readiness: null,
    blocking_dependency_count: blocking,
    updated_at: ini.updated_at,
    source_sequence: record.event_id,
    projection_status: "current",
    last_updated_at: nowIso(),
  };

  const all = readStoreSlice<InitiativeOperationalProjection>(PROJECTION_KEY);
  const next = all.filter((p) => p.initiative_id !== ini.initiative_id);
  next.push(projection);
  writeStoreSlice(PROJECTION_KEY, next);
  return projection;
}

export function listInitiativeOperationalProjections(institutionId?: string) {
  const all = readStoreSlice<InitiativeOperationalProjection>(PROJECTION_KEY);
  return institutionId ? all.filter((p) => p.institution_id === institutionId) : all;
}
