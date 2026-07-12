import { withApiGateway } from "@/lib/api/http";
import { objectiveProductionService } from "@/lib/civic-action/builds/11.2/production";
import { withObjectiveApi } from "@/lib/civic-action/builds/11.2/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withObjectiveApi(ctx, request, (apiCtx) => ({
      launch: objectiveProductionService.getLaunchControl(apiCtx.institution_id),
      sign_offs: objectiveProductionService.listSignOffs(apiCtx.institution_id),
    })),
  { permission: "civic_action.view", endpoint: "/api/v1/objectives/production/launch" }
);
