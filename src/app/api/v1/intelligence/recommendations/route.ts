import { withApiGateway } from "@/lib/api/http";
import { initiativeIntelligenceService } from "@/lib/civic-action/builds/11.1/intelligence";
import { withInitiativeApi } from "@/lib/civic-action/builds/11.1/api/http-helpers";
import { toIntelligenceContext } from "@/lib/civic-action/builds/11.1/intelligence/api-context";

export const GET = withApiGateway(
  async (ctx, request) =>
    withInitiativeApi(ctx, request, (apiCtx) => {
      const initiativeId = request.nextUrl.searchParams.get("initiative_id") ?? undefined;
      const intelCtx = toIntelligenceContext(apiCtx, initiativeId);
      return {
        recommendations: initiativeIntelligenceService.getRecommendations(intelCtx),
        contract_version: initiativeIntelligenceService.contract_version,
        advisory_only: true,
      };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/intelligence/recommendations" }
);
