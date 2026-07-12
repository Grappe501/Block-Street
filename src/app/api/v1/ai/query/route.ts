import { withApiGateway } from "@/lib/api/http";
import { ApiError } from "@/lib/api/errors";
import { initiativeIntelligenceService } from "@/lib/civic-action/builds/11.1/intelligence";
import { withInitiativeApi } from "@/lib/civic-action/builds/11.1/api/http-helpers";
import { toIntelligenceContext } from "@/lib/civic-action/builds/11.1/intelligence/api-context";

export const POST = withApiGateway(
  async (ctx, request) =>
    withInitiativeApi(
      ctx,
      request,
      async (apiCtx) => {
        const body = (await request.json()) as { query?: string };
        if (!body.query?.trim()) throw new ApiError("VALIDATION_ERROR", "query is required", 400);
        return initiativeIntelligenceService.copilotQuery(body.query, toIntelligenceContext(apiCtx));
      },
      { requireAuth: true }
    ),
  { permission: "civic_action.view", endpoint: "/api/v1/ai/query" }
);
