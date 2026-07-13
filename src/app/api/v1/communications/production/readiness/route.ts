import { withApiGateway } from "@/lib/api/http";
import { communicationProductionService } from "@/lib/civic-action/builds/11.7/production";
import { withCommunicationApi } from "@/lib/civic-action/builds/11.7/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withCommunicationApi(ctx, request, (apiCtx) =>
      communicationProductionService.getReadinessOverview(apiCtx.institution_id)
    ),
  { permission: "civic_action.view", endpoint: "/api/v1/communications/production/readiness" }
);
