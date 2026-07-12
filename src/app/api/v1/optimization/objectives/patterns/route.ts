import { withApiGateway } from "@/lib/api/http";
import { objectiveOptimizationService } from "@/lib/civic-action/builds/11.2/optimization";
import { withObjectiveApi } from "@/lib/civic-action/builds/11.2/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withObjectiveApi(ctx, request, (apiCtx) => {
      const initiativeId = request.nextUrl.searchParams.get("initiative_id") ?? undefined;
      return {
        patterns: objectiveOptimizationService.getPatterns(apiCtx.institution_id, initiativeId),
        advisory_only: true,
      };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/optimization/objectives/patterns" }
);
