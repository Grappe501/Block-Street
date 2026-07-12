import { withApiGateway } from "@/lib/api/http";
import { objectiveProductionService } from "@/lib/civic-action/builds/11.2/production";
import { runBuild112Certification } from "@/lib/civic-action/builds/11.2/w8";
import { withObjectiveApi } from "@/lib/civic-action/builds/11.2/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withObjectiveApi(ctx, request, (apiCtx) => ({
      certification_suite: objectiveProductionService.getCertification(),
      production_levels: objectiveProductionService.getProductionLevels(apiCtx.institution_id),
      build_112: runBuild112Certification(),
    })),
  { permission: "civic_action.view", endpoint: "/api/v1/objectives/production/certification" }
);
