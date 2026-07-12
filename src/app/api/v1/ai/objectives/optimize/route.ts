import { withApiGateway } from "@/lib/api/http";
import { objectiveOptimizationService } from "@/lib/civic-action/builds/11.2/optimization";
import { withObjectiveApi } from "@/lib/civic-action/builds/11.2/api/http-helpers";

/** AI optimization advisor — advisory only, no mutations */
export const POST = withApiGateway(
  async (ctx, request) =>
    withObjectiveApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as { query?: string; initiative_id?: string };
      const query = body.query ?? "";
      return objectiveOptimizationService.queryAdvisor(apiCtx.institution_id, query, {
        initiativeId: body.initiative_id,
      });
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/ai/objectives/optimize" }
);
