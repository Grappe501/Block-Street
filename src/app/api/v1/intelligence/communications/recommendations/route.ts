import { withApiGateway } from "@/lib/api/http";
import { communicationIntelligenceService } from "@/lib/civic-action/builds/11.7/intelligence";
import { withCommunicationApi } from "@/lib/civic-action/builds/11.7/api/http-helpers";
import { toIntelligenceContext } from "@/lib/civic-action/builds/11.7/intelligence/api-context";

export const GET = withApiGateway(
  async (ctx, request) =>
    withCommunicationApi(ctx, request, (apiCtx) => {
      const sp = request.nextUrl.searchParams;
      const intelCtx = toIntelligenceContext(apiCtx, {
        initiativeId: sp.get("initiative_id") ?? undefined,
        conversationId: sp.get("conversation_id") ?? undefined,
      });
      return {
        recommendations: communicationIntelligenceService.getRecommendations(intelCtx),
        contract_version: communicationIntelligenceService.contract_version,
        advisory_only: true,
      };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/intelligence/communications/recommendations" }
);
