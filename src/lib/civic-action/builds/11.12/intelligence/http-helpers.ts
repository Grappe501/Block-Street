/**
 * CAE-11.12-W6 — Intelligence API route helpers
 */
import type { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api/errors";
import type { ApiRequestContext } from "@/lib/api/types";
import { withKnowledgeApi } from "../api/http-helpers";
import { toIntelligenceContext } from "../intelligence/api-context";
import { INTELLIGENCE_CONTRACT_VERSION } from "../intelligence/contracts";

export function intelligenceMeta(
  ctx: ReturnType<typeof toIntelligenceContext>,
  extra?: Record<string, unknown>
) {
  return {
    request_id: ctx.request_id,
    correlation_id: ctx.correlation_id,
    contract_version: INTELLIGENCE_CONTRACT_VERSION,
    advisory_only: true,
    canonical_mutation_allowed: false,
    ...extra,
  };
}

export async function withKnowledgeIntelligenceApi<T>(
  ctx: ApiRequestContext,
  request: NextRequest,
  fn: (intelCtx: ReturnType<typeof toIntelligenceContext>) => T | Promise<T>
) {
  return withKnowledgeApi(ctx, request, async (apiCtx) => {
    const intelCtx = toIntelligenceContext(apiCtx);
    const data = await fn(intelCtx);
    return data;
  });
}
