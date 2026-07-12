/**
 * CAE-11.2-W5 — Objective API context resolver
 */
import type { NextRequest } from "next/server";
import type { ApiRequestContext } from "@/lib/api/types";
import { ApiError } from "@/lib/api/errors";
import { getUserById, resolveMemberships } from "@/lib/auth/engine";
import { DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT } from "../ux/experience-context";
import type { ObjectiveApiContext } from "./contracts";

/** Reject client-authoritative identity fields in mutation bodies */
export function stripUntrustedIdentityFields<T extends Record<string, unknown>>(body: T): T {
  const copy = { ...body };
  delete copy.actor_human_id;
  delete copy.institution_id;
  delete copy.active_membership_id;
  delete copy.institution_membership_id;
  delete copy.lifecycle_state;
  delete copy.executive_owner_human_id;
  delete copy.operational_owner_human_id;
  delete copy.review_authority_human_id;
  return copy;
}

export function resolveObjectiveApiContext(
  ctx: ApiRequestContext,
  request: NextRequest,
  options?: { requireAuth?: boolean }
): ObjectiveApiContext {
  const requireAuth = options?.requireAuth ?? false;
  const locale = request.headers.get("accept-language")?.startsWith("es") ? "es" : "en";
  const timezone = request.headers.get("x-timezone") ?? "America/Chicago";
  const idempotency_key_optional = request.headers.get("idempotency-key");

  if (ctx.actor_type === "anonymous") {
    if (requireAuth) {
      throw new ApiError("UNAUTHENTICATED", "Authentication required for this Objective operation.", 401);
    }
    return {
      actor_human_id: DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT.actor_human_id,
      service_identity_id_optional: null,
      institution_id: DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT.institution_id,
      institution_membership_id: DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT.active_membership_id,
      initiative_id_optional: request.nextUrl.searchParams.get("initiative_id"),
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
      idempotency_key_optional,
      locale,
      timezone,
      effective_permissions: DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT.permissions,
    };
  }

  const actorId = ctx.actor_id;
  if (!actorId) {
    throw new ApiError("UNAUTHENTICATED", "Actor could not be resolved.", 401);
  }

  const user = getUserById(actorId);
  const memberships = user ? resolveMemberships(user.user_id) : [];
  const institution_id =
    ctx.organization_id_optional ??
    request.nextUrl.searchParams.get("institution_id") ??
    memberships[0]?.organization_id ??
    DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT.institution_id;

  const membership = memberships.find((m) => m.organization_id === institution_id) ?? memberships[0];
  const perms = [
    ...ctx.effective_permissions,
    ...(membership ? ["civic_action.view"] : []),
    ...DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT.permissions,
  ];

  return {
    actor_human_id: actorId,
    service_identity_id_optional: ctx.service_identity_id_optional,
    institution_id,
    institution_membership_id: membership?.id ?? DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT.active_membership_id,
    initiative_id_optional: request.nextUrl.searchParams.get("initiative_id"),
    request_id: ctx.request_id,
    correlation_id: ctx.correlation_id,
    idempotency_key_optional,
    locale,
    timezone,
    effective_permissions: [...new Set(perms)],
  };
}

export function toExperienceContext(apiCtx: ObjectiveApiContext) {
  return {
    actor_human_id: apiCtx.actor_human_id,
    institution_id: apiCtx.institution_id,
    institution_name: "Block Street",
    active_membership_id: apiCtx.institution_membership_id,
    permissions: apiCtx.effective_permissions,
    locale: apiCtx.locale,
  };
}
