import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withOpsIntelligenceApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withOpsIntelligenceApi(ctx, request, (apiCtx) => ({
      insights: operationsApplicationService.listInstitutionalInsights(apiCtx.institution_id),
    })),
  { permission: "intelligence.view", endpoint: "/api/v1/intelligence/insights" }
);
