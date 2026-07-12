/**
 * CAE-11.1-W5 — Initiative query handlers (read-only; no domain mutation)
 */
import { initiativeApplicationService } from "../services/application-service";
import { validateCharter } from "../services/charter-validator";
import { evaluateDependencyReadiness } from "../services/dependency-graph";
import { isInitiativeDomainError, InitiativeDomainError } from "../services/errors";
import { assembleCharterWorkbench } from "../ux/assemble-charter";
import { assembleInitiativeReadiness } from "../ux/assemble-readiness";
import { assembleInitiativePortfolio } from "../ux/assemble-portfolio";
import { resolveLifecycleActions } from "../ux/ui-actions";
import { assembleInitiativeView } from "./assemble-initiative-view";
import type { InitiativeApiContext, InitiativeListQuery, InitiativePermissionsView } from "./contracts";
import { toExperienceContext } from "./context";

function institutionFilter(agg: ReturnType<typeof initiativeApplicationService.getAggregate>, institutionId: string) {
  if (!agg) return false;
  return agg.initiative.institution_id === institutionId;
}

function visibilityAllowed(
  agg: NonNullable<ReturnType<typeof initiativeApplicationService.getAggregate>>,
  apiCtx: InitiativeApiContext
): boolean {
  const ini = agg.initiative;
  if (ini.institution_id !== apiCtx.institution_id) return false;
  if (ini.visibility === "member_public") return true;
  if (ini.visibility === "institution_internal") return true;
  return apiCtx.effective_permissions.includes("civic_action.view");
}

export function queryInitiativeCollection(apiCtx: InitiativeApiContext, query: InitiativeListQuery) {
  const ids = initiativeApplicationService.listInitiativeIds();
  const limit = Math.min(query.limit ?? 25, 100);
  let offset = 0;
  if (query.cursor) {
    const parsed = Number.parseInt(Buffer.from(query.cursor, "base64url").toString("utf8"), 10);
    if (!Number.isNaN(parsed)) offset = parsed;
  }

  const institutionId = query.institution_id ?? apiCtx.institution_id;
  let items = ids
    .map((id) => initiativeApplicationService.getAggregate(id))
    .filter((agg): agg is NonNullable<typeof agg> => agg !== null)
    .filter((agg) => institutionFilter(agg, institutionId))
    .filter((agg) => visibilityAllowed(agg, apiCtx));

  if (query.status) items = items.filter((a) => a.initiative.status === query.status);
  if (query.initiative_type) items = items.filter((a) => a.initiative.initiative_type === query.initiative_type);
  if (query.owner_human_id) {
    items = items.filter(
      (a) =>
        a.initiative.operational_owner_human_id === query.owner_human_id ||
        a.initiative.executive_owner_human_id === query.owner_human_id
    );
  }
  if (query.search) {
    const q = query.search.toLowerCase();
    items = items.filter((a) => {
      const name = a.initiative.initiative_name.toLowerCase();
      const purpose = (a.charter?.purpose ?? "").toLowerCase();
      return name.includes(q) || purpose.includes(q);
    });
  }

  const page = items.slice(offset, offset + limit);
  const nextOffset = offset + limit;
  const hasMore = nextOffset < items.length;

  return {
    items: page.map((agg) => assembleInitiativeView(agg, apiCtx)),
    meta: {
      total: items.length,
      cursor: hasMore ? Buffer.from(String(nextOffset)).toString("base64url") : null,
      has_more: hasMore,
    },
  };
}

export function queryInitiativeDetail(initiativeId: string, apiCtx: InitiativeApiContext) {
  const agg = initiativeApplicationService.getAggregate(initiativeId);
  if (!agg) {
    throw new InitiativeDomainError({
      code: "INITIATIVE_NOT_FOUND",
      message: "Initiative not found.",
      requirement_ids: ["CAE-11.1-W5-API-013"],
    });
  }
  if (!visibilityAllowed(agg, apiCtx)) {
    throw new InitiativeDomainError({
      code: "INITIATIVE_NOT_FOUND",
      message: "Initiative not found.",
      requirement_ids: ["CAE-11.1-W5-API-013"],
    });
  }
  return assembleInitiativeView(agg, apiCtx);
}

export function queryInitiativePortfolio(apiCtx: InitiativeApiContext, mode?: string) {
  return assembleInitiativePortfolio(toExperienceContext(apiCtx), mode ?? "institution");
}

export function queryInitiativeCharter(initiativeId: string, apiCtx: InitiativeApiContext) {
  return assembleCharterWorkbench(initiativeId, toExperienceContext(apiCtx));
}

export function queryInitiativeReadiness(initiativeId: string, apiCtx: InitiativeApiContext) {
  return assembleInitiativeReadiness(initiativeId, toExperienceContext(apiCtx));
}

export function queryInitiativePermissions(initiativeId: string, apiCtx: InitiativeApiContext): InitiativePermissionsView {
  const agg = initiativeApplicationService.getAggregate(initiativeId);
  if (!agg || !visibilityAllowed(agg, apiCtx)) {
    throw new InitiativeDomainError({
      code: "INITIATIVE_NOT_FOUND",
      message: "Initiative not found.",
      requirement_ids: ["CAE-11.1-W5-API-016"],
    });
  }
  const actions = resolveLifecycleActions(agg, toExperienceContext(apiCtx));
  return {
    initiative_id: initiativeId,
    available_actions: actions.filter((a) => a.available).map((a) => a.action_key),
    available_commands: actions
      .filter((a) => a.available)
      .map((a) => a.action_key)
      .filter((k): k is import("../services/commands").InitiativeCommandType => typeof k === "string"),
    view_level: assembleInitiativeView(agg, apiCtx).view_level,
    note: "Available actions are advisory; every mutation reauthorizes on the server.",
  };
}

export function queryInitiativeHistory(initiativeId: string, apiCtx: InitiativeApiContext) {
  const agg = initiativeApplicationService.getAggregate(initiativeId);
  if (!agg || !visibilityAllowed(agg, apiCtx)) {
    throw new InitiativeDomainError({
      code: "INITIATIVE_NOT_FOUND",
      message: "Initiative not found.",
      requirement_ids: ["CAE-11.1-W5-API-013"],
    });
  }
  return {
    initiative_id: initiativeId,
    events: agg.history.map((h) => ({
      event_id: h.initiative_event_id,
      event_type: h.event_type,
      occurred_at: h.occurred_at,
      actor_human_id: h.actor_human_id,
      reason: h.reason,
      previous_state: h.previous_state,
      new_state: h.new_state,
    })),
  };
}

export function queryInitiativeHealth(initiativeId: string, apiCtx: InitiativeApiContext) {
  const agg = initiativeApplicationService.getAggregate(initiativeId);
  if (!agg || !visibilityAllowed(agg, apiCtx)) {
    throw new InitiativeDomainError({
      code: "INITIATIVE_NOT_FOUND",
      message: "Initiative not found.",
      requirement_ids: ["CAE-11.1-W5-API-013"],
    });
  }
  const readiness = initiativeApplicationService.getActivationReadiness(initiativeId);
  const deps = evaluateDependencyReadiness(initiativeId, agg.dependencies);
  const charter = validateCharter(agg, "activation");
  const reasons: string[] = [];
  if (!agg.initiative.operational_owner_human_id) reasons.push("Operational owner required");
  if (!charter.is_valid) reasons.push("Charter incomplete for activation");
  if (!deps.ready) reasons.push("Blocking dependencies remain");
  if (agg.initiative.status === "at_risk") reasons.push("Initiative marked at risk");

  return {
    initiative_id: initiativeId,
    health_state: reasons.length === 0 ? "healthy" : agg.initiative.status === "at_risk" ? "at_risk" : "attention",
    reasons,
    owner_status: agg.initiative.operational_owner_human_id ? "assigned" : "required",
    review_status: agg.reviews.some((r) => r.status === "scheduled") ? "scheduled" : "none",
    dependency_status: deps.ready ? "satisfied" : "blocking",
    approval_status: agg.initiative.status,
    timeline_status: agg.timeline?.target_completion_date ? "planned" : "unset",
    risk_status: agg.initiative.status === "at_risk" ? "elevated" : "normal",
    data_freshness: agg.initiative.updated_at,
    readiness_optional: readiness,
  };
}

export function queryInitiativeDependencies(initiativeId: string, apiCtx: InitiativeApiContext) {
  const agg = initiativeApplicationService.getAggregate(initiativeId);
  if (!agg || !visibilityAllowed(agg, apiCtx)) {
    throw new InitiativeDomainError({
      code: "INITIATIVE_NOT_FOUND",
      message: "Initiative not found.",
      requirement_ids: ["CAE-11.1-W5-API-013"],
    });
  }
  return {
    initiative_id: initiativeId,
    dependencies: agg.dependencies,
    readiness: evaluateDependencyReadiness(initiativeId, agg.dependencies),
  };
}

export function isDomainQueryError(error: unknown): error is InitiativeDomainError {
  return isInitiativeDomainError(error);
}
