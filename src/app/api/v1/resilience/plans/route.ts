import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withResilienceApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withResilienceApi(ctx, request, (apiCtx) => ({
      plans: operationsApplicationService.listContinuityPlans(apiCtx.institution_id),
    })),
  { permission: "resilience.view", endpoint: "/api/v1/resilience/plans" }
);
