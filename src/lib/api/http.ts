import { NextRequest, NextResponse } from "next/server";
import { loadApiFeatureFlags } from "./data";
import { resolveApiContext, assertAuthenticatedContext, assertPermission, hashBody } from "./context";
import { apiErrorResponse, apiSuccess, ApiError } from "./errors";
import { checkRateLimit } from "./rate-limit";
import { checkIdempotency, storeIdempotency } from "./idempotency";
import { auditApiRequest } from "./gateway";
import type { ApiRequestContext } from "./types";

type Handler = (ctx: ApiRequestContext, request: NextRequest) => NextResponse | Promise<NextResponse>;

export function withApiGateway(handler: Handler, options?: { public?: boolean; permission?: string; endpoint?: string }) {
  return async (request: NextRequest) => {
    const ctx = resolveApiContext(request);
    const endpoint = options?.endpoint ?? request.nextUrl.pathname;
    try {
      const flags = loadApiFeatureFlags();
      if (!flags.API_V1_GATEWAY_ENABLED) {
        throw new ApiError("SERVICE_DEGRADED", "API gateway is not enabled.", 503);
      }
      if (!options?.public) assertAuthenticatedContext(ctx);
      if (options?.permission) assertPermission(ctx, options.permission);
      if (flags.API_RATE_LIMITING_ENABLED) checkRateLimit(ctx, endpoint);
      const response = await handler(ctx, request);
      auditApiRequest(ctx, endpoint, request.method, response.status, "success");
      return response;
    } catch (e) {
      auditApiRequest(ctx, endpoint, request.method, e instanceof ApiError ? e.status : 500, "failure");
      return apiErrorResponse(e, ctx.request_id);
    }
  };
}

export async function withIdempotentPost(
  ctx: ApiRequestContext,
  request: NextRequest,
  endpoint: string,
  handler: (body: Record<string, unknown>) => Promise<unknown>
) {
  const idempotencyKey = request.headers.get("idempotency-key");
  const body = (await request.json()) as Record<string, unknown>;
  const requestHash = hashBody(body);
  const flags = loadApiFeatureFlags();
  if (flags.API_IDEMPOTENCY_ENABLED && idempotencyKey) {
    const check = checkIdempotency(ctx, endpoint, idempotencyKey, requestHash);
    if (check.replay) {
      return apiSuccess(check.response, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 200);
    }
  }
  const result = await handler(body);
  if (flags.API_IDEMPOTENCY_ENABLED && idempotencyKey) {
    storeIdempotency(ctx, endpoint, idempotencyKey, requestHash, result);
  }
  return apiSuccess(result, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
}
