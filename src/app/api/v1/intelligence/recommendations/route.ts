import { withApiGateway } from "@/lib/api/http";
import { initiativeIntelligenceService } from "@/lib/civic-action/builds/11.1/intelligence";
import { withInitiativeApi } from "@/lib/civic-action/builds/11.1/api/http-helpers";
import { toIntelligenceContext } from "@/lib/civic-action/builds/11.1/intelligence/api-context";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withOpsIntelligenceApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) => {
    const scope = request.nextUrl.searchParams.get("scope");
    if (scope === "institutional" || scope === "ops") {
      return withOpsIntelligenceApi(ctx, request, (apiCtx) =>
        operationsApplicationService.getInstitutionalRecommendations(apiCtx.institution_id)
      );
    }
    return withInitiativeApi(ctx, request, (apiCtx) => {
      const initiativeId = request.nextUrl.searchParams.get("initiative_id") ?? undefined;
      const intelCtx = toIntelligenceContext(apiCtx, initiativeId);
      return {
        recommendations: initiativeIntelligenceService.getRecommendations(intelCtx),
        contract_version: initiativeIntelligenceService.contract_version,
        advisory_only: true,
      };
    });
  },
  { permission: "civic_action.view", endpoint: "/api/v1/intelligence/recommendations" }
);
