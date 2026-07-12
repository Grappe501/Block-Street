import { withApiGateway } from "@/lib/api/http";
import { objectiveOptimizationService } from "@/lib/civic-action/builds/11.2/optimization";
import { withObjectiveApi } from "@/lib/civic-action/builds/11.2/api/http-helpers";
import { toOptimizationContext } from "@/lib/civic-action/builds/11.2/optimization/api-context";

export const GET = withApiGateway(
  async (ctx, request) =>
    withObjectiveApi(ctx, request, (apiCtx) => {
      const sp = request.nextUrl.searchParams;
      const optCtx = toOptimizationContext(apiCtx, {
        initiativeId: sp.get("initiative_id") ?? undefined,
        objectiveId: sp.get("objective_id") ?? undefined,
      });
      return {
        optimization: objectiveOptimizationService.getOverview(optCtx),
        executive_brief: objectiveOptimizationService.buildExecutiveBrief(
          apiCtx.institution_id,
          sp.get("initiative_id") ?? undefined
        ),
        advisory_only: true,
      };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/optimization/objectives" }
);
