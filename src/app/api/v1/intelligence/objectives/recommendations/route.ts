import { withApiGateway } from "@/lib/api/http";
import { objectiveIntelligenceService } from "@/lib/civic-action/builds/11.2/intelligence";
import { withObjectiveApi } from "@/lib/civic-action/builds/11.2/api/http-helpers";
import { toIntelligenceContext } from "@/lib/civic-action/builds/11.2/intelligence/api-context";

export const GET = withApiGateway(
  async (ctx, request) =>
    withObjectiveApi(ctx, request, (apiCtx) => {
      const sp = request.nextUrl.searchParams;
      const intelCtx = toIntelligenceContext(apiCtx, {
        initiativeId: sp.get("initiative_id") ?? undefined,
        objectiveId: sp.get("objective_id") ?? undefined,
      });
      return {
        recommendations: objectiveIntelligenceService.getRecommendations(intelCtx),
        contract_version: objectiveIntelligenceService.contract_version,
        advisory_only: true,
      };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/intelligence/objectives/recommendations" }
);
