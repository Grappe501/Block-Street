import { withApiGateway } from "@/lib/api/http";
import { communicationOptimizationService } from "@/lib/civic-action/builds/11.7/optimization";
import { withCommunicationApi } from "@/lib/civic-action/builds/11.7/api/http-helpers";

/** AI advisory optimization — no mutation endpoints */
export const POST = withApiGateway(
  async (ctx, request) =>
    withCommunicationApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as { query?: string; initiative_id?: string };
      const query = body.query ?? "";
      return communicationOptimizationService.queryAdvisor(apiCtx.institution_id, query, {
        initiativeId: body.initiative_id,
      });
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/ai/communications/optimize" }
);
