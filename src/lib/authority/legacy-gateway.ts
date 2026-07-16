import { NextRequest, NextResponse } from "next/server";
import { loadApiFeatureFlags } from "@/lib/api/data";
import { resolveApiContext } from "@/lib/api/context";
import { apiErrorResponse } from "@/lib/api/errors";
import { assertScopedPermission, type ScopeResolver } from "./gateway";
import { lookupRouteProtection } from "./route-protection";
import { resolveScopeResolverByName } from "./scope-resolvers";

type LegacyHandler = (
  ctx: ReturnType<typeof resolveApiContext>,
  request: NextRequest,
  ...args: unknown[]
) => NextResponse | Promise<NextResponse>;

type LegacyScopedOptions = {
  permission: string;
  scopeResolver: ScopeResolver | string;
  endpoint: string;
};

async function resolveScope(
  scopeResolver: ScopeResolver | string,
  ctx: ReturnType<typeof resolveApiContext>,
  request: NextRequest
) {
  if (typeof scopeResolver === "string") {
    const fn = resolveScopeResolverByName(scopeResolver);
    if (!fn) throw new Error(`Unknown scope resolver: ${scopeResolver}`);
    return await fn(ctx, request);
  }
  return await scopeResolver(ctx, request);
}

/**
 * Wrap legacy route handlers (notifications, cms, missions) with scoped authority.
 */
export function withLegacyScopedMutation(
  handler: LegacyHandler,
  options: LegacyScopedOptions
) {
  return async (request: NextRequest, ...args: unknown[]) => {
    const ctx = resolveApiContext(request);
    const endpoint = options.endpoint;
    try {
      const flags = loadApiFeatureFlags();
      if (!ctx.actor_id) {
        return apiErrorResponse(
          { code: "AUTHENTICATION_REQUIRED", message: "Authentication required.", status: 401 },
          ctx.request_id
        );
      }
      if (flags.AUTHORITY_SCOPE_ENFORCEMENT_ENABLED) {
        const scope = await resolveScope(options.scopeResolver, ctx, request);
        assertScopedPermission(ctx, options.permission, scope, request);
      }
      return await handler(ctx, request, ...args);
    } catch (e) {
      return apiErrorResponse(e, ctx.request_id);
    }
  };
}

export function resolveProtectionForEndpoint(endpoint: string, method: string) {
  const record = lookupRouteProtection(endpoint, method);
  if (!record?.permission) return null;
  const scopeResolver = record.scopeResolver
    ? resolveScopeResolverByName(record.scopeResolver)
    : undefined;
  return { permission: record.permission, scopeResolver, record };
}
