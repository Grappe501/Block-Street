import { withApiGateway } from "@/lib/api/http";
import { objectiveProductionService } from "@/lib/civic-action/builds/11.2/production";
import { withObjectiveApi } from "@/lib/civic-action/builds/11.2/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withObjectiveApi(ctx, request, (apiCtx) => objectiveProductionService.getReadinessOverview(apiCtx.institution_id)),
  { permission: "civic_action.view", endpoint: "/api/v1/objectives/production/readiness" }
);
