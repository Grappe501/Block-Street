/**
 * CAE-11.12-W7 — Optimization API route helpers
 */
import type { NextRequest } from "next/server";
import type { ApiRequestContext } from "@/lib/api/types";
import { withKnowledgeApi } from "../api/http-helpers";
import { OPTIMIZATION_CONTRACT_VERSION } from "./contracts";

export function optimizationMeta(apiCtx: { request_id: string; correlation_id: string }, extra?: Record<string, unknown>) {
  return {
    request_id: apiCtx.request_id,
    correlation_id: apiCtx.correlation_id,
    contract_version: OPTIMIZATION_CONTRACT_VERSION,
    advisory_only: true,
    canonical_mutation_allowed: false,
    ...extra,
  };
}

export function improvementIdFromPath(request: NextRequest, segment: string): string {
  const parts = request.nextUrl.pathname.split("/");
  const idx = parts.indexOf(segment);
  return parts[idx + 1] ?? "";
}

export async function withKnowledgeOptimizationApi<T>(
  ctx: ApiRequestContext,
  request: NextRequest,
  fn: (apiCtx: Awaited<ReturnType<typeof import("../api/context").resolveKnowledgeApiContext>>) => T | Promise<T>
) {
  return withKnowledgeApi(ctx, request, fn);
}
