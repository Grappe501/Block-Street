import { withApiGateway } from "@/lib/api/http";
import { initiativeIntelligenceService } from "@/lib/civic-action/builds/11.1/intelligence";
import { withInitiativeApi, initiativeIdFromPath } from "@/lib/civic-action/builds/11.1/api/http-helpers";
import { toIntelligenceContext } from "@/lib/civic-action/builds/11.1/intelligence/api-context";

export const GET = withApiGateway(
  async (ctx, request) => {
    const id = initiativeIdFromPath(request);
    return withInitiativeApi(ctx, request, (apiCtx) => ({
      initiative_id: id,
      recommendations: initiativeIntelligenceService.getAdvisorySuggestions(id, toIntelligenceContext(apiCtx, id)),
      risks: initiativeIntelligenceService.getRisks(toIntelligenceContext(apiCtx)).filter((r) => r.initiative_id === id),
      dependency_forecast: initiativeIntelligenceService.getDependencyForecast(id),
      graph: initiativeIntelligenceService.getInitiativeGraph(id),
      advisory_only: true,
    }));
  },
  { permission: "civic_action.view", endpoint: "/api/v1/initiatives/[id]/intelligence" }
);
