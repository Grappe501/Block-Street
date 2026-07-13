/**
 * CAE-11.7-W5 — Shared Communication API route helpers
 */
import type { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api/errors";
import type { ApiRequestContext } from "@/lib/api/types";
import { COMMUNICATION_API_CONTRACT_VERSION, type CommunicationApiContext } from "./contracts";
import { resolveCommunicationApiContext } from "./context";
import { communicationErrorToApiError, isDomainQueryError } from "./errors";

export function communicationMeta(apiCtx: CommunicationApiContext, extra?: Record<string, unknown>) {
  return {
    request_id: apiCtx.request_id,
    correlation_id: apiCtx.correlation_id,
    contract_version: COMMUNICATION_API_CONTRACT_VERSION,
    ...extra,
  };
}

export function conversationIdFromPath(request: NextRequest): string {
  const parts = request.nextUrl.pathname.split("/");
  const idx = parts.indexOf("communications");
  return parts[idx + 1] ?? "";
}

export function lifecycleActionFromPath(request: NextRequest): string {
  const parts = request.nextUrl.pathname.split("/");
  const idx = parts.indexOf("actions");
  return parts[idx + 1] ?? "";
}

export async function withCommunicationApi<T>(
  ctx: ApiRequestContext,
  request: NextRequest,
  fn: (apiCtx: CommunicationApiContext) => T | Promise<T>,
  options?: { requireAuth?: boolean }
) {
  try {
    const apiCtx = resolveCommunicationApiContext(ctx, request, options);
    const data = await fn(apiCtx);
    return apiSuccess(data, communicationMeta(apiCtx));
  } catch (error) {
    if (isDomainQueryError(error)) throw communicationErrorToApiError(error);
    throw error;
  }
}
