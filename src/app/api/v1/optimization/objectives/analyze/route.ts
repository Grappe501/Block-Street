import { withApiGateway } from "@/lib/api/http";
import { ApiError } from "@/lib/api/errors";
import { objectiveOptimizationService } from "@/lib/civic-action/builds/11.2/optimization";
import { withObjectiveApi } from "@/lib/civic-action/builds/11.2/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withObjectiveApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as { objective_id?: string; initiative_id?: string };
      const objectiveId = body.objective_id;
      const initiativeId = body.initiative_id;

      if (objectiveId) {
        return {
          optimizations: objectiveOptimizationService.analyzeObjective(objectiveId),
          advisory_only: true,
        };
      }

      if (!initiativeId) {
        throw new ApiError("VALIDATION_ERROR", "objective_id or initiative_id required", 400);
      }

      return {
        optimizations: objectiveOptimizationService.getOverview({
          actor_human_id: apiCtx.actor_human_id,
          institution_id: apiCtx.institution_id,
          initiative_id_optional: initiativeId,
        }).optimizations,
        advisory_only: true,
      };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/optimization/objectives/analyze" }
);
