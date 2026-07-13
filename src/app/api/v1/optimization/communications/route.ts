import { withApiGateway } from "@/lib/api/http";
import { communicationOptimizationService } from "@/lib/civic-action/builds/11.7/optimization";
import { withCommunicationApi } from "@/lib/civic-action/builds/11.7/api/http-helpers";
import { toOptimizationContext } from "@/lib/civic-action/builds/11.7/optimization/api-context";

export const GET = withApiGateway(
  async (ctx, request) =>
    withCommunicationApi(ctx, request, (apiCtx) => {
      const sp = request.nextUrl.searchParams;
      const optCtx = toOptimizationContext(apiCtx, {
        initiativeId: sp.get("initiative_id") ?? undefined,
        conversationId: sp.get("conversation_id") ?? undefined,
      });
      return {
        optimization: communicationOptimizationService.getOverview(optCtx),
        executive_brief: communicationOptimizationService.buildExecutiveBrief(
          apiCtx.institution_id,
          sp.get("initiative_id") ?? undefined
        ),
        advisory_only: true,
      };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/optimization/communications" }
);
