import { withApiGateway } from "@/lib/api/http";
import { ApiError } from "@/lib/api/errors";
import { objectiveIntelligenceService } from "@/lib/civic-action/builds/11.2/intelligence";
import { withObjectiveApi, objectiveIdFromPath } from "@/lib/civic-action/builds/11.2/api/http-helpers";
import { toIntelligenceContext } from "@/lib/civic-action/builds/11.2/intelligence/api-context";

export const GET = withApiGateway(
  async (ctx, request) => {
    const id = objectiveIdFromPath(request);
    const initiativeId = request.nextUrl.searchParams.get("initiative_id");
    if (!initiativeId) {
      throw new ApiError("VALIDATION_ERROR", "initiative_id query parameter is required", 400);
    }
    return withObjectiveApi(ctx, request, (apiCtx) => {
      const intelCtx = toIntelligenceContext(apiCtx, { initiativeId, objectiveId: id });
      return {
        objective_id: id,
        initiative_id: initiativeId,
        recommendations: objectiveIntelligenceService.getAdvisorySuggestions(id, intelCtx),
        risks: objectiveIntelligenceService.getRisks(intelCtx).filter((r) => r.objective_id === id),
        progress: objectiveIntelligenceService.getProgress(intelCtx).find((p) => p.objective_id === id),
        execution: objectiveIntelligenceService.getExecution(intelCtx).find((e) => e.objective_id === id),
        forecasts: objectiveIntelligenceService.getForecasts(intelCtx).filter((f) => f.objective_id === id),
        graph: objectiveIntelligenceService.getObjectiveGraph(id),
        patterns: objectiveIntelligenceService.getPatterns(apiCtx.institution_id, initiativeId),
        advisory_only: true,
      };
    });
  },
  { permission: "civic_action.view", endpoint: "/api/v1/objectives/[id]/intelligence" }
);
