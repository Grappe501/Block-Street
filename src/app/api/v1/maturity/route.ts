import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withImprovementApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withImprovementApi(ctx, request, (apiCtx) => ({
      assessments: operationsApplicationService.listMaturityAssessments(apiCtx.institution_id),
    })),
  { permission: "improvement.view", endpoint: "/api/v1/maturity" }
);
