import { withApiGateway } from "@/lib/api/http";
import { institutionalOptimizationService } from "@/lib/civic-action/builds/11.1/optimization";
import { withInitiativeApi } from "@/lib/civic-action/builds/11.1/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withInitiativeApi(ctx, request, (apiCtx) => ({
      strategy: institutionalOptimizationService.getStrategy(apiCtx.institution_id),
      advisory_only: true,
    })),
  { permission: "civic_action.view", endpoint: "/api/v1/optimization/strategy" }
);
