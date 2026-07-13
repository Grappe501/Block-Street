import { withApiGateway } from "@/lib/api/http";
import { communicationOptimizationService } from "@/lib/civic-action/builds/11.7/optimization";
import { withCommunicationApi } from "@/lib/civic-action/builds/11.7/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withCommunicationApi(ctx, request, (apiCtx) => {
      const sp = request.nextUrl.searchParams;
      const initiativeId = sp.get("initiative_id") ?? undefined;
      const conversationId = sp.get("conversation_id") ?? undefined;
      return {
        lessons: communicationOptimizationService.getLessons(
          apiCtx.institution_id,
          initiativeId,
          conversationId
        ),
        advisory_only: true,
      };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/optimization/communications/lessons" }
);
