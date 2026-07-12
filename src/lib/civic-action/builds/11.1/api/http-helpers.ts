/**
 * CAE-11.1-W5 — Shared Initiative API route helpers
 */
import type { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api/errors";
import type { ApiRequestContext } from "@/lib/api/types";
import {
  INITIATIVE_API_CONTRACT_VERSION,
  initiativeErrorToApiError,
  isDomainQueryError,
  resolveInitiativeApiContext,
  type InitiativeApiContext,
} from "@/lib/civic-action/builds/11.1/api";

export function initiativeMeta(apiCtx: InitiativeApiContext, extra?: Record<string, unknown>) {
  return {
    request_id: apiCtx.request_id,
    correlation_id: apiCtx.correlation_id,
    contract_version: INITIATIVE_API_CONTRACT_VERSION,
    ...extra,
  };
}

export function initiativeIdFromPath(request: NextRequest): string {
  const parts = request.nextUrl.pathname.split("/");
  const idx = parts.indexOf("initiatives");
  return parts[idx + 1] ?? "";
}

export function lifecycleActionFromPath(request: NextRequest): string {
  const parts = request.nextUrl.pathname.split("/");
  const idx = parts.indexOf("actions");
  return parts[idx + 1] ?? "";
}

export async function withInitiativeApi<T>(
  ctx: ApiRequestContext,
  request: NextRequest,
  fn: (apiCtx: InitiativeApiContext) => T | Promise<T>,
  options?: { requireAuth?: boolean }
) {
  try {
    const apiCtx = resolveInitiativeApiContext(ctx, request, options);
    const data = await fn(apiCtx);
    return apiSuccess(data, initiativeMeta(apiCtx));
  } catch (error) {
    if (isDomainQueryError(error)) throw initiativeErrorToApiError(error);
    throw error;
  }
}
