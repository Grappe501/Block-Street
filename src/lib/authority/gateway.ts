import type { NextRequest } from "next/server";
import { ApiError } from "@/lib/api/errors";
import type { ApiRequestContext } from "@/lib/api/types";
import { authorize } from "./resolver";
import type { AuthorizationRequest } from "./types";
import { scopeToken } from "./types";

export type ScopeResolverInput = {
  resourceType: string;
  resourceId?: string;
  requestedScopeIds: string[];
};

export type ScopeResolver = (
  ctx: ApiRequestContext,
  request: NextRequest
) => ScopeResolverInput;

/** Default self-scope for volunteer-facing reads. */
export function selfScopeResolver(ctx: ApiRequestContext): ScopeResolverInput {
  return {
    resourceType: "self",
    resourceId: ctx.actor_id ?? undefined,
    requestedScopeIds: ctx.actor_id ? [scopeToken("self", ctx.actor_id)] : [],
  };
}

/** Campaign-wide scope for platform operations. */
export function campaignScopeResolver(): ScopeResolverInput {
  return {
    resourceType: "campaign",
    resourceId: "arkansas",
    requestedScopeIds: [scopeToken("campaign", "arkansas")],
  };
}

export function countyScopeFromQuery(request: NextRequest): ScopeResolverInput {
  const county = request.nextUrl.searchParams.get("county_slug") ?? request.nextUrl.searchParams.get("county");
  return {
    resourceType: "county",
    resourceId: county ?? undefined,
    requestedScopeIds: county ? [scopeToken("county", county)] : [],
  };
}

export function assertScopedPermission(
  ctx: ApiRequestContext,
  permission: string,
  scope: ScopeResolverInput,
  request?: NextRequest
): void {
  if (!ctx.actor_id) {
    throw new ApiError("AUTHENTICATION_REQUIRED", "Authentication required.", 401);
  }

  if (ctx.actor_type === "api_client") {
    if (!ctx.effective_permissions.includes(permission)) {
      throw new ApiError("PERMISSION_DENIED", "API client lacks required scope.", 403);
    }
    return;
  }

  const authReq: AuthorizationRequest = {
    actorId: ctx.actor_id,
    permission,
    resourceType: scope.resourceType,
    resourceId: scope.resourceId,
    requestedScopeIds: scope.requestedScopeIds,
    correlationId: ctx.correlation_id,
    route: request?.nextUrl.pathname,
    method: request?.method,
  };

  const decision = authorize(authReq);
  if (!decision.allowed) {
    const message =
      decision.reasonCode === "outside_scope"
        ? "You do not have permission for this scope."
        : decision.reasonCode === "inactive_appointment"
          ? "No active leadership appointment authorizes this action."
          : "You do not have permission to perform this action.";
    throw new ApiError("PERMISSION_DENIED", message, 403);
  }
}
