import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withResilienceApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withResilienceApi(ctx, request, (apiCtx) => ({
      readiness: operationsApplicationService.assessReadiness(apiCtx.institution_id),
    })),
  { permission: "resilience.manage", endpoint: "/api/v1/readiness/assess" }
);
