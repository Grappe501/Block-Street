/**
 * CAE-11.2-W5 — Objective query handlers (read-only; no domain mutation)
 */
import { objectiveApplicationService } from "../application-service";
import { ExecutionDomainError } from "../services/errors";
import { assembleObjectiveDashboard, assembleObjectiveWorkspaceShell } from "../ux/assemble-workspace";
import { assembleObjectivePortfolio } from "../ux/assemble-portfolio";
import { assembleTodaysWork } from "../ux/assemble-todays-work";
import { assembleWorkstreamBoard } from "../ux/assemble-workstream-board";
import { resolveObjectiveLifecycleActions } from "../ux/ui-actions";
import { EXECUTION_PERMISSIONS } from "../services/commands";
import type { ExecutionCommandType } from "../services/commands";
import { assembleObjectiveView } from "./assemble-objective-view";
import type { ObjectiveApiContext, ObjectiveListQuery, ObjectivePermissionsView } from "./contracts";
import { toExperienceContext } from "./context";

function institutionFilter(objective: { institution_id: string }, institutionId: string) {
  return objective.institution_id === institutionId;
}

function visibilityAllowed(objective: { institution_id: string }, apiCtx: ObjectiveApiContext): boolean {
  if (objective.institution_id !== apiCtx.institution_id) return false;
  return apiCtx.effective_permissions.includes("civic_action.view") || apiCtx.effective_permissions.includes("civic_action.manage");
}

export function queryObjectiveCollection(apiCtx: ObjectiveApiContext, query: ObjectiveListQuery) {
  const limit = Math.min(query.limit ?? 25, 100);
  let offset = 0;
  if (query.cursor) {
    const parsed = Number.parseInt(Buffer.from(query.cursor, "base64url").toString("utf8"), 10);
    if (!Number.isNaN(parsed)) offset = parsed;
  }

  const institutionId = query.institution_id ?? apiCtx.institution_id;
  let items = objectiveApplicationService
    .listAllObjectives()
    .filter((o) => institutionFilter(o, institutionId))
    .filter((o) => visibilityAllowed(o, apiCtx));

  if (query.initiative_id) items = items.filter((o) => o.initiative_id === query.initiative_id);

  if (query.status) items = items.filter((o) => o.lifecycle_state === query.status);
  if (query.objective_type) items = items.filter((o) => o.objective_type === query.objective_type);
  if (query.owner_human_id) {
    items = items.filter(
      (o) =>
        o.operational_owner_human_id === query.owner_human_id ||
        o.executive_owner_human_id === query.owner_human_id
    );
  }
  if (query.search) {
    const q = query.search.toLowerCase();
    items = items.filter(
      (o) => o.display_name.toLowerCase().includes(q) || o.purpose.toLowerCase().includes(q)
    );
  }

  const page = items.slice(offset, offset + limit);
  const nextOffset = offset + limit;
  const hasMore = nextOffset < items.length;

  return {
    items: page.map((o) => assembleObjectiveView(o, apiCtx)),
    meta: {
      total: items.length,
      cursor: hasMore ? Buffer.from(String(nextOffset)).toString("base64url") : null,
      has_more: hasMore,
    },
  };
}

export function queryObjectiveDetail(objectiveId: string, apiCtx: ObjectiveApiContext) {
  const objective = objectiveApplicationService.getObjective(objectiveId);
  if (!objective || !visibilityAllowed(objective, apiCtx)) {
    throw new ExecutionDomainError({
      code: "EXECUTION_NOT_FOUND",
      message: "Objective not found.",
      requirement_ids: ["CAE-11.2-W5-API-013"],
    });
  }
  return assembleObjectiveView(objective, apiCtx);
}

export function queryObjectivePortfolio(initiativeId: string, apiCtx: ObjectiveApiContext) {
  return assembleObjectivePortfolio(initiativeId, toExperienceContext(apiCtx));
}

export function queryObjectiveDashboard(initiativeId: string, objectiveId: string, apiCtx: ObjectiveApiContext) {
  const dashboard = assembleObjectiveDashboard(initiativeId, objectiveId, toExperienceContext(apiCtx));
  if (!dashboard) {
    throw new ExecutionDomainError({
      code: "EXECUTION_NOT_FOUND",
      message: "Objective not found.",
      requirement_ids: ["CAE-11.2-W5-API-013"],
    });
  }
  return dashboard;
}

export function queryObjectiveProgress(initiativeId: string, objectiveId: string, apiCtx: ObjectiveApiContext) {
  const bundle = objectiveApplicationService.getObjectiveBundle(objectiveId);
  if (!bundle || bundle.objective.initiative_id !== initiativeId || !visibilityAllowed(bundle.objective, apiCtx)) {
    throw new ExecutionDomainError({
      code: "EXECUTION_NOT_FOUND",
      message: "Objective not found.",
      requirement_ids: ["CAE-11.2-W5-API-013"],
    });
  }
  const { objective, key_results, missions, workstreams } = bundle;
  return {
    objective_id: objectiveId,
    progress_percent: objective.lifecycle_state === "active" ? 57 : 0,
    key_results: {
      total: key_results.length,
      on_track: key_results.filter((kr) => (kr.current_value ?? 0) >= (kr.target ?? 1) * 0.5).length,
    },
    workstreams: { total: workstreams.length, active: workstreams.filter((w) => w.lifecycle_state === "active").length },
    missions: {
      total: missions.length,
      active: missions.filter((m) => m.lifecycle_state === "active").length,
      completed: missions.filter((m) => m.lifecycle_state === "completed").length,
    },
  };
}

export function queryObjectiveWorkstreams(initiativeId: string, objectiveId: string, apiCtx: ObjectiveApiContext) {
  return assembleWorkstreamBoard(initiativeId, objectiveId, toExperienceContext(apiCtx));
}

export function queryObjectiveTodaysWork(initiativeId: string, objectiveId: string, apiCtx: ObjectiveApiContext) {
  return assembleTodaysWork(initiativeId, objectiveId, toExperienceContext(apiCtx));
}

export function queryObjectiveShell(initiativeId: string, objectiveId: string, apiCtx: ObjectiveApiContext) {
  const shell = assembleObjectiveWorkspaceShell(initiativeId, objectiveId, toExperienceContext(apiCtx));
  if (!shell) {
    throw new ExecutionDomainError({
      code: "EXECUTION_NOT_FOUND",
      message: "Objective not found.",
      requirement_ids: ["CAE-11.2-W5-API-013"],
    });
  }
  return shell;
}

export function queryObjectivePermissions(
  initiativeId: string,
  objectiveId: string,
  apiCtx: ObjectiveApiContext
): ObjectivePermissionsView {
  const objective = objectiveApplicationService.getObjective(objectiveId);
  if (!objective || objective.initiative_id !== initiativeId || !visibilityAllowed(objective, apiCtx)) {
    throw new ExecutionDomainError({
      code: "EXECUTION_NOT_FOUND",
      message: "Objective not found.",
      requirement_ids: ["CAE-11.2-W5-API-016"],
    });
  }
  const exp = toExperienceContext(apiCtx);
  const actions = resolveObjectiveLifecycleActions(objective, exp);
  const available_commands = actions
    .filter((a) => a.available)
    .map((a) => a.action_key as ExecutionCommandType);
  const allCommands = Object.keys(EXECUTION_PERMISSIONS) as ExecutionCommandType[];
  const permitted = allCommands.filter((c) => exp.permissions.includes(EXECUTION_PERMISSIONS[c]) || exp.permissions.includes("civic_action.manage"));

  return {
    objective_id: objectiveId,
    initiative_id: initiativeId,
    available_actions: actions.filter((a) => a.available).map((a) => a.label),
    available_commands: permitted,
    view_level: "owner",
    note: "Permissions are advisory; every mutation reauthorizes on the server.",
  };
}

export function queryObjectiveMissions(initiativeId: string, objectiveId: string, apiCtx: ObjectiveApiContext) {
  const bundle = objectiveApplicationService.getObjectiveBundle(objectiveId);
  if (!bundle || bundle.objective.initiative_id !== initiativeId || !visibilityAllowed(bundle.objective, apiCtx)) {
    throw new ExecutionDomainError({
      code: "EXECUTION_NOT_FOUND",
      message: "Objective not found.",
      requirement_ids: ["CAE-11.2-W5-API-013"],
    });
  }
  return bundle.missions.map((m) => ({
    mission_id: m.canonical_id,
    display_name: m.display_name,
    lifecycle_state: m.lifecycle_state,
    workstream_id: m.workstream_id,
    operational_lead_human_id: m.operational_lead_human_id,
    due_date: m.finish_date,
  }));
}
