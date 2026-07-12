import { withApiGateway } from "@/lib/api/http";
import { ApiError } from "@/lib/api/errors";
import { objectiveOptimizationService } from "@/lib/civic-action/builds/11.2/optimization";
import { withObjectiveApi, objectiveIdFromPath } from "@/lib/civic-action/builds/11.2/api/http-helpers";
import { toOptimizationContext } from "@/lib/civic-action/builds/11.2/optimization/api-context";

export const GET = withApiGateway(
  async (ctx, request) => {
    const id = objectiveIdFromPath(request);
    const initiativeId = request.nextUrl.searchParams.get("initiative_id");
    if (!initiativeId) {
      throw new ApiError("VALIDATION_ERROR", "initiative_id query parameter is required", 400);
    }
    return withObjectiveApi(ctx, request, (apiCtx) => {
      const optCtx = toOptimizationContext(apiCtx, { initiativeId, objectiveId: id });
      return {
        objective_id: id,
        initiative_id: initiativeId,
        lessons: objectiveOptimizationService.getLessons(apiCtx.institution_id, initiativeId, id),
        optimizations: objectiveOptimizationService.analyzeObjective(id),
        patterns: objectiveOptimizationService.getPatterns(apiCtx.institution_id, initiativeId),
        templates: objectiveOptimizationService.getTemplates(apiCtx.institution_id, initiativeId),
        health: objectiveOptimizationService.getHealth(apiCtx.institution_id, initiativeId),
        maturity: objectiveOptimizationService.getMaturity(apiCtx.institution_id, initiativeId),
        executive_brief: objectiveOptimizationService.buildExecutiveBrief(apiCtx.institution_id, initiativeId),
        overview: objectiveOptimizationService.getOverview(optCtx),
        advisory_only: true,
      };
    });
  },
  { permission: "civic_action.view", endpoint: "/api/v1/objectives/[id]/optimization" }
);
