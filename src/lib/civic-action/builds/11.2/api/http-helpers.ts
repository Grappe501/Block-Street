/**
 * CAE-11.2-W5 — Shared Objective API route helpers
 */
import type { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api/errors";
import type { ApiRequestContext } from "@/lib/api/types";
import {
  OBJECTIVE_API_CONTRACT_VERSION,
  type ObjectiveApiContext,
} from "./contracts";
import { resolveObjectiveApiContext } from "./context";
import { isDomainQueryError, objectiveErrorToApiError } from "./errors";

export function objectiveMeta(apiCtx: ObjectiveApiContext, extra?: Record<string, unknown>) {
  return {
    request_id: apiCtx.request_id,
    correlation_id: apiCtx.correlation_id,
    contract_version: OBJECTIVE_API_CONTRACT_VERSION,
    ...extra,
  };
}

export function objectiveIdFromPath(request: NextRequest): string {
  const parts = request.nextUrl.pathname.split("/");
  const idx = parts.indexOf("objectives");
  return parts[idx + 1] ?? "";
}

export function lifecycleActionFromPath(request: NextRequest): string {
  const parts = request.nextUrl.pathname.split("/");
  const idx = parts.indexOf("actions");
  return parts[idx + 1] ?? "";
}

export async function withObjectiveApi<T>(
  ctx: ApiRequestContext,
  request: NextRequest,
  fn: (apiCtx: ObjectiveApiContext) => T | Promise<T>,
  options?: { requireAuth?: boolean }
) {
  try {
    const apiCtx = resolveObjectiveApiContext(ctx, request, options);
    const data = await fn(apiCtx);
    return apiSuccess(data, objectiveMeta(apiCtx));
  } catch (error) {
    if (isDomainQueryError(error)) throw objectiveErrorToApiError(error);
    throw error;
  }
}
