/**
 * CAE-11.7-W1 — Living Intelligence API helpers
 */
import type { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api/errors";
import type { ApiRequestContext } from "@/lib/api/types";

export const LOCALBRAIN_API_CONTRACT_VERSION = "11.7-w1.1";

export type LocalBrainApiContext = {
  human_id: string;
  institution_id: string;
  actor_human_id: string;
  request_id: string;
  correlation_id: string;
};

export function resolveLocalBrainApiContext(ctx: ApiRequestContext, request: NextRequest): LocalBrainApiContext {
  const institutionId =
    request.nextUrl.searchParams.get("institution_id") ??
    request.headers.get("x-institution-id") ??
    ctx.organization_id_optional ??
    "inst-block-street";
  const humanId = ctx.actor_id ?? "usr-001";
  return {
    human_id: humanId,
    institution_id: institutionId,
    actor_human_id: humanId,
    request_id: ctx.request_id,
    correlation_id: request.headers.get("x-correlation-id") ?? ctx.correlation_id,
  };
}

export function localBrainMeta(apiCtx: LocalBrainApiContext, extra?: Record<string, unknown>) {
  return {
    request_id: apiCtx.request_id,
    correlation_id: apiCtx.correlation_id,
    contract_version: LOCALBRAIN_API_CONTRACT_VERSION,
    human_id: apiCtx.human_id,
    ...extra,
  };
}

export async function withLocalBrainApi<T>(
  ctx: ApiRequestContext,
  request: NextRequest,
  fn: (apiCtx: LocalBrainApiContext) => T | Promise<T>
) {
  const apiCtx = resolveLocalBrainApiContext(ctx, request);
  const data = await fn(apiCtx);
  return apiSuccess(data, localBrainMeta(apiCtx));
}
