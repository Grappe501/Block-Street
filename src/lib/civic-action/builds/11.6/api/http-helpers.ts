/**
 * CAE-11.6-W1 — Strategy API helpers
 */
import type { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api/errors";
import type { ApiRequestContext } from "@/lib/api/types";

export const STRATEGY_API_CONTRACT_VERSION = "11.6-w1.1";

export type StrategyApiContext = {
  institution_id: string;
  actor_human_id: string;
  request_id: string;
  correlation_id: string;
};

export function resolveStrategyApiContext(ctx: ApiRequestContext, request: NextRequest): StrategyApiContext {
  const institutionId =
    request.nextUrl.searchParams.get("institution_id") ??
    request.headers.get("x-institution-id") ??
    ctx.organization_id_optional ??
    "inst-block-street";
  return {
    institution_id: institutionId,
    actor_human_id: ctx.actor_id ?? "usr-001",
    request_id: ctx.request_id,
    correlation_id: request.headers.get("x-correlation-id") ?? ctx.correlation_id,
  };
}

export function strategyMeta(apiCtx: StrategyApiContext, extra?: Record<string, unknown>) {
  return {
    request_id: apiCtx.request_id,
    correlation_id: apiCtx.correlation_id,
    contract_version: STRATEGY_API_CONTRACT_VERSION,
    ...extra,
  };
}

export async function withStrategyApi<T>(
  ctx: ApiRequestContext,
  request: NextRequest,
  fn: (apiCtx: StrategyApiContext) => T | Promise<T>
) {
  const apiCtx = resolveStrategyApiContext(ctx, request);
  const data = await fn(apiCtx);
  return apiSuccess(data, strategyMeta(apiCtx));
}
