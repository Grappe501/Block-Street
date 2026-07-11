import { createHash, randomBytes } from "crypto";
import { getSessionFromRequest } from "@/lib/auth/session";
import { getUserById, resolveMemberships } from "@/lib/auth/engine";
import { resolveAdminContext } from "@/lib/admin/engine";
import { editorialPermissionsForUser } from "@/lib/cms/permissions";
import type { NextRequest } from "next/server";
import { ApiError } from "./errors";
import type { ApiRequestContext } from "./types";
import { resolveApiClientFromKey } from "./credentials";

export function newRequestId(): string {
  return `req_${randomBytes(8).toString("hex")}`;
}

export function getCorrelationId(request: NextRequest, requestId: string): string {
  return request.headers.get("x-correlation-id") ?? requestId;
}

export function resolveApiContext(request: NextRequest): ApiRequestContext {
  const request_id = newRequestId();
  const correlation_id = getCorrelationId(request, request_id);
  const started = new Date().toISOString();
  const apiKey = request.headers.get("x-api-key");
  const source_ip_reference = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

  if (apiKey) {
    const client = resolveApiClientFromKey(apiKey);
    if (client) {
      return {
        request_id,
        correlation_id,
        actor_type: "api_client",
        actor_id: client.client.id,
        session_id_optional: null,
        service_identity_id_optional: null,
        organization_id_optional: client.client.organization_id_optional,
        workspace_id_optional: client.client.workspace_id_optional,
        active_role_ids: [],
        effective_permissions: client.client.allowed_scopes,
        authentication_strength: "api_key",
        api_client_id_optional: client.client.id,
        source_ip_reference,
        request_started_at: started,
      };
    }
  }

  const session = getSessionFromRequest(request.headers.get("cookie"));
  if (!session) {
    return {
      request_id,
      correlation_id,
      actor_type: "anonymous",
      actor_id: null,
      session_id_optional: null,
      service_identity_id_optional: null,
      organization_id_optional: null,
      workspace_id_optional: null,
      active_role_ids: [],
      effective_permissions: [],
      authentication_strength: "none",
      api_client_id_optional: null,
      source_ip_reference,
      request_started_at: started,
    };
  }

  const user = getUserById(session.user_id);
  if (!user || user.account_status === "suspended") {
    return {
      request_id,
      correlation_id,
      actor_type: "anonymous",
      actor_id: null,
      session_id_optional: null,
      service_identity_id_optional: null,
      organization_id_optional: null,
      workspace_id_optional: null,
      active_role_ids: [],
      effective_permissions: [],
      authentication_strength: "none",
      api_client_id_optional: null,
      source_ip_reference,
      request_started_at: started,
    };
  }

  let adminPerms: string[] = [];
  try {
    const ctx = resolveAdminContext(session);
    adminPerms = ctx.effective_permissions ?? [];
  } catch {
    adminPerms = [];
  }

  const memberships = resolveMemberships(session.user_id);
  const orgId = memberships[0]?.organization_id ?? null;
  const wsId = memberships[0]?.workspace_id ?? null;
  const editorial = editorialPermissionsForUser(session.user_id);

  const apiScopes = new Set<string>([...adminPerms, ...editorial]);
  if (adminPerms.includes("users.view")) apiScopes.add("users.read");
  apiScopes.add("users.read");
  apiScopes.add("missions.read");
  apiScopes.add("missions.write");
  apiScopes.add("content.read");
  apiScopes.add("notifications.request");
  apiScopes.add("analytics.read");

  return {
    request_id,
    correlation_id,
    actor_type: "user",
    actor_id: session.user_id,
    session_id_optional: session.session_id,
    service_identity_id_optional: null,
    organization_id_optional: orgId,
    workspace_id_optional: wsId,
    active_role_ids: [],
    effective_permissions: [...apiScopes],
    authentication_strength: session.authentication_strength ?? "password",
    api_client_id_optional: null,
    source_ip_reference,
    request_started_at: started,
  };
}

export function assertAuthenticatedContext(ctx: ApiRequestContext) {
  if (ctx.actor_type === "anonymous" || !ctx.actor_id) {
    throw new ApiError("AUTHENTICATION_REQUIRED", "Authentication required.", 401);
  }
}

export function assertPermission(ctx: ApiRequestContext, permission: string) {
  if (!ctx.effective_permissions.includes(permission) && ctx.actor_type !== "api_client") {
    throw new ApiError("PERMISSION_DENIED", "You do not have permission to perform this action.", 403);
  }
  if (ctx.actor_type === "api_client" && !ctx.effective_permissions.includes(permission)) {
    throw new ApiError("PERMISSION_DENIED", "API client lacks required scope.", 403);
  }
}

export function hashBody(body: unknown): string {
  return createHash("sha256").update(JSON.stringify(body ?? {})).digest("hex");
}
