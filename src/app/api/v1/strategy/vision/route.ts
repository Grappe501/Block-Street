import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withStrategyApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withStrategyApi(ctx, request, (apiCtx) => ({
      vision: operationsApplicationService.getVision(apiCtx.institution_id),
      event: "vision.updated",
    })),
  { permission: "civic_action.view", endpoint: "/api/v1/strategy/vision" }
);
