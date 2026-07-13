/**
 * CAE-11.12-W5 — Shared Knowledge API route helpers
 */
import type { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api/errors";
import type { ApiRequestContext } from "@/lib/api/types";
import { KNOWLEDGE_API_CONTRACT_VERSION, type KnowledgeApiContext } from "./contracts";
import { resolveKnowledgeApiContext } from "./context";
import { isDomainQueryError, knowledgeErrorToApiError } from "./errors";

export function knowledgeMeta(apiCtx: KnowledgeApiContext, extra?: Record<string, unknown>) {
  return {
    request_id: apiCtx.request_id,
    correlation_id: apiCtx.correlation_id,
    contract_version: KNOWLEDGE_API_CONTRACT_VERSION,
    ...extra,
  };
}

export function knowledgeIdFromPath(request: NextRequest, segment: string): string {
  const parts = request.nextUrl.pathname.split("/");
  const idx = parts.indexOf(segment);
  return parts[idx + 1] ?? "";
}

export function lifecycleActionFromPath(request: NextRequest): string {
  const parts = request.nextUrl.pathname.split("/");
  const idx = parts.indexOf("actions");
  return parts[idx + 1] ?? "";
}

export async function withKnowledgeApi<T>(
  ctx: ApiRequestContext,
  request: NextRequest,
  fn: (apiCtx: KnowledgeApiContext) => T | Promise<T>,
  options?: { requireAuth?: boolean }
) {
  try {
    const apiCtx = resolveKnowledgeApiContext(ctx, request, options);
    const data = await fn(apiCtx);
    return apiSuccess(data, knowledgeMeta(apiCtx));
  } catch (error) {
    if (isDomainQueryError(error)) throw knowledgeErrorToApiError(error);
    throw error;
  }
}
