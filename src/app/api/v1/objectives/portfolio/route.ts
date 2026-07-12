import { withApiGateway } from "@/lib/api/http";
import { queryObjectivePortfolio } from "@/lib/civic-action/builds/11.2/api";
import { withObjectiveApi } from "@/lib/civic-action/builds/11.2/api/http-helpers";
import { ApiError } from "@/lib/api/errors";

export const GET = withApiGateway(
  async (ctx, request) =>
    withObjectiveApi(ctx, request, (apiCtx) => {
      const initiativeId = request.nextUrl.searchParams.get("initiative_id");
      if (!initiativeId) {
        throw new ApiError("VALIDATION_ERROR", "initiative_id query parameter is required", 400);
      }
      return queryObjectivePortfolio(initiativeId, apiCtx);
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/objectives/portfolio" }
);
