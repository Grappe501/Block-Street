import { withApiGateway } from "@/lib/api/http";
import { institutionalProductionService } from "@/lib/civic-action/builds/11.1/production";
import { withInitiativeApi } from "@/lib/civic-action/builds/11.1/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withInitiativeApi(ctx, request, (apiCtx) => ({
      health: institutionalProductionService.getHealthSummary(apiCtx.institution_id),
    })),
  { permission: "civic_action.view", endpoint: "/api/v1/production/health" }
);
