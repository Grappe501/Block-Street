import { withApiGateway } from "@/lib/api/http";
import { objectiveOptimizationService } from "@/lib/civic-action/builds/11.2/optimization";
import { withObjectiveApi } from "@/lib/civic-action/builds/11.2/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withObjectiveApi(ctx, request, (apiCtx) => {
      const sp = request.nextUrl.searchParams;
      return {
        lessons: objectiveOptimizationService.getLessons(
          apiCtx.institution_id,
          sp.get("initiative_id") ?? undefined,
          sp.get("objective_id") ?? undefined
        ),
        advisory_only: true,
      };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/optimization/objectives/lessons" }
);
