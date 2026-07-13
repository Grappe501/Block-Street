import { withApiGateway } from "@/lib/api/http";
import { communicationOptimizationService } from "@/lib/civic-action/builds/11.7/optimization";
import { withCommunicationApi } from "@/lib/civic-action/builds/11.7/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withCommunicationApi(ctx, request, (apiCtx) => {
      const initiativeId = request.nextUrl.searchParams.get("initiative_id") ?? undefined;
      return {
        templates: communicationOptimizationService.getTemplates(apiCtx.institution_id, initiativeId),
        advisory_only: true,
      };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/optimization/communications/templates" }
);
