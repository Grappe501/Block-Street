import { withApiGateway } from "@/lib/api/http";
import { ApiError } from "@/lib/api/errors";
import { institutionalOptimizationService } from "@/lib/civic-action/builds/11.1/optimization";
import { withInitiativeApi } from "@/lib/civic-action/builds/11.1/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withInitiativeApi(
      ctx,
      request,
      async (apiCtx) => {
        const body = (await request.json()) as { query?: string };
        if (!body.query?.trim()) throw new ApiError("VALIDATION_ERROR", "query is required", 400);
        return institutionalOptimizationService.queryAdvisor(apiCtx.institution_id, body.query);
      },
      { requireAuth: true }
    ),
  { permission: "civic_action.view", endpoint: "/api/v1/ai/optimize" }
);
